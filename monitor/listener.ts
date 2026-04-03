import { ethers } from "ethers";
import artifacts from "../artifacts/contracts/AegisOracle.sol/AegisOracle.json";

const abi = artifacts.abi;

const provider = new ethers.JsonRpcProvider("http:127.0.0.1:8545");

const contract = new ethers.Contract("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", abi, provider);

contract.on("CircuitBreakerTrigger", (price) => {
    console.log("BREAKER ACTIVATED:", price.toString());
});

contract.on("PriceUpdate", (price) => {
    console.log("Price:", price.toString());
});

contract.on("FallbackUsed", (price) => {
    console.log("Using fallback:", price.toString());
});

contract.on("Paused", () => {
    console.log("Protocol paused:");
});

contract.on("UnPaused", () => {
    console.log("Protocol resumed:");
});

console.log("Listening Events....");

process.stdin.resume();