// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

contract MOCKV3A {

    int256 private price;

    constructor(int256 _price) {
        price = _price;
        
    }

    function setPrice(int256 _price) external{
        price = _price;        
    }

    function latestRoundData() external view returns (
                                                uint80,
                                                int256,
                                                uint256,
                                                uint256,
                                                uint80
    ) 
    {
       return (0, price, 0, block.timestamp, 0);   
    } 
}