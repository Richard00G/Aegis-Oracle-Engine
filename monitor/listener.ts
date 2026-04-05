import { ethers } from "ethers";
import artifacts from "../artifacts/contracts/AegisOracle.sol/AegisOracle.json";

const abi = artifacts.abi;

const provider = new ethers.JsonRpcProvider("http:127.0.0.1:8545");

const contract = new ethers.Contract("0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9", abi, provider);

contract.on("CircuitBreakerTriggered", (price) => {
    console.log("BREAKER ACTIVATED:", price.toString());
});

contract.on("PriceUpdated", (price) => {
    console.log("Price:", price.toString());
});

contract.on("FallbackUsed", (price) => {
    console.log("Using fallback:", price.toString());
});

contract.on("Paused", () => {
    console.log("Protocol paused:");
});

contract.on("Unpaused", () => {
    console.log("Protocol resumed:");
});

console.log("Listening Events....");

process.stdin.resume();