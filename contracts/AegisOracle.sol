// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

import "@openzeppelin/contracts/access/AccessControl.sol";

contract AegisOracle is AccessControl {

    event PriceUpdate(uint256 price);
    event CircuitBreakerTrigger(uint256 price);
    event FallbackUsed(uint256 price);
    event Paused();
    event UnPaused();

    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN");
    bytes32 public constant GUARDIAN_ROLE = keccak256("GUARDIAN");

    AggregatorV3Interface public priceFeed;
    AggregatorV3Interface public fallbackFeed;

    uint256 public lastPrice;
    uint256 public lastGoodPrice;

    uint256 public maxDeviation = 10;    
    uint256 public maxGlobalDeviation = 20;

    bool public paused;

    constructor (address _feed, address _fallback) {
        priceFeed = AggregatorV3Interface(_feed);
        fallbackFeed = AggregatorV3Interface(_fallback);

        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(GUARDIAN_ROLE, msg.sender);
    }

    modifier notPaused() {
        require(!paused,"Paused");
        _;
    }

    function getSafePrice() public returns (uint256) {
        
        (, int price,, uint updateAt,) = priceFeed.latestRoundData();
        
        require(price > 0, "Invalid price");
        require(block.timestamp - updateAt < 1 hours, "Stale price");

        uint256 p = uint256(price);

        if (lastPrice != 0) {

            uint diff = p > lastPrice ? p - lastPrice : lastPrice - p; 
            uint deviation = (diff * 100) / lastPrice;
            
            require(deviation <= maxDeviation, "High deviation");

           if (deviation > maxGlobalDeviation) {

            paused = true;

            emit CircuitBreakerTrigger(p);
            
           } 
        }

        emit PriceUpdate(p);

        lastPrice = p;
        return p;

        
    }

    function getFallbackPrice() public view returns(uint256) {
        
        (, int price,,,) = fallbackFeed.latestRoundData();
        
        require(price > 0, "Fallback fail!!");

        return uint256(price);

    }

    function getFinalPrice() public returns (uint256) {

        try this.getSafePrice() returns (uint price) {
            
            lastGoodPrice = price;
            
            return price;
        
        } catch  {
            require(lastGoodPrice > 0, "No safe Price");
            return lastGoodPrice;
        }
    }

    function pause() external onlyRole(GUARDIAN_ROLE) {
        paused = true;
        emit Paused();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        paused = false;
        emit UnPaused();
    }
    function setMaxDeviation(uint256 value) external onlyRole(ADMIN_ROLE) {
        maxDeviation = value;
    }
}
