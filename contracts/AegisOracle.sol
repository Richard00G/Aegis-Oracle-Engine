// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract AegisOracle is AccessControl {
    // ========== EVENTS ==========
    event PriceUpdated(uint256 price);
    event CircuitBreakerTriggered(uint256 price);
    event FallbackUsed(uint256 price);
    event Paused();
    event Unpaused();

    // ========== ROLES ==========
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN");
    bytes32 public constant GUARDIAN_ROLE = keccak256("GUARDIAN");

    // ========== STORAGE ==========
    AggregatorV3Interface public priceFeed;
    AggregatorV3Interface public fallbackFeed;
    AggregatorV3Interface public secondaryFeed;

    uint256 public lastPrice;
    uint256 public lastGoodPrice;

    uint256 public lastUpdateTime;
    uint256 public twapPrice; 

    uint256 public maxDeviation = 10; // %
    uint256 public maxGlobalDeviation = 20; // %
    uint256 public maxOracleDeviation = 10; //%

    bool public paused;

    // ========== CONSTRUCTOR ==========
    constructor(address _feed, address _fallback, address _secondary) {
        require(_feed != address(0), "Invalid feed");
        require(_fallback != address(0), "Invalid fallback");
        require(_secondary != address(0), "Invalid secondary feed");

        priceFeed = AggregatorV3Interface(_feed);
        fallbackFeed = AggregatorV3Interface(_fallback);
        secondaryFeed = AggregatorV3Interface(_secondary);

        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(GUARDIAN_ROLE, msg.sender);
    }

    // ========== INTERNAL ==========
    function _getPrice(AggregatorV3Interface feed) public view returns (uint256) {
        try feed.latestRoundData() returns (
            uint80,
            int256 price, 
            uint256,
            uint256 updatedAt,
            uint80
        ) {
            require(price > 0, "Invalid price");
            require(block.timestamp - updatedAt < 1 hours, "Stale price");

            return uint256(price);
        } catch {
            revert("Oracle failure");
        }
    }

    function _checkDeviation(uint256 p) internal view returns (uint256 deviation) {
        if (lastPrice == 0) return 0;

        uint256 diff = p > lastPrice ? p - lastPrice : lastPrice - p;
        deviation = (diff * 100) / lastPrice;
    }

    // ========== CORE ==========
    function getSafePrice() public returns (uint256) {
    require(!paused, "Protocol paused");

    uint256 p1;
    uint256 p2;
    uint256 p3;

    // 🔹 Primary con try/catch
    try this._getPrice(priceFeed) returns (uint256 mainPrice) {
        p1 = mainPrice;
    } catch {
        p1 = _getPrice(fallbackFeed);
        emit FallbackUsed(p1);
    }

    // 🔹 Otros oráculos
    p2 = _getPrice(fallbackFeed);
    p3 = _getPrice(secondaryFeed);

    // MEDIANA 
    uint256 p = _mediana3(p1, p2, p3); 

    //  Validación contra desviación global
    uint256 deviation = _checkDeviation(p);

    if (deviation > maxGlobalDeviation) {
        paused = true;
        emit CircuitBreakerTriggered(p);
        emit Paused();
        return p;
    }

    require(deviation <= maxDeviation, "Deviation too high");

    _updateTWAP(p);
   
    lastPrice = p;
    lastGoodPrice = twapPrice; 

    emit PriceUpdated(twapPrice);

    return twapPrice;
}
    
    function _updateTWAP(uint256 newPrice) internal {
        
        if (twapPrice == 0) {
            twapPrice = newPrice;
            lastUpdateTime = block.timestamp;
            return;
        }

        uint256 timeElapsed = block.timestamp - lastUpdateTime;

        if (timeElapsed == 0) return;

        twapPrice = (twapPrice * newPrice) / 2;

        lastUpdateTime = block.timestamp;
    }

    function _validateOracles(uint256 p1, uint256 p2) internal view { 

        uint256 diff = p1 > p2 ? p1 -p2 : p2 -p1;
        
        uint256 deviation = (diff * 100) / p1;
        
        require(deviation <= maxOracleDeviation, "Oracles mismatch");
    }

    function _mediana3(uint256 a, uint256 b, uint256 c) internal view returns (uint256) {
        if ((a >= b && a <= c) || (a <= b && a >= c)) return a;
        if ((b >= a && b <= c) || (b <= a && b >= c)) return b;
        return c;
    }

    // ========== ADMIN ==========
    function unpause() external onlyRole(GUARDIAN_ROLE) {
        paused = false;
        emit Unpaused();
    }

    function setDeviation(uint256 _max, uint256 _global) external onlyRole(ADMIN_ROLE) {
        require(_max < _global, "Invalid config");
        maxDeviation = _max;
        maxGlobalDeviation = _global;
    }
}
