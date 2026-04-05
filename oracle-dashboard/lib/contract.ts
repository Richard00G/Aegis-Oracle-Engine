import { ethers } from "ethers";
import artifacts from "../../artifacts/contracts/AegisOracle.sol/AegisOracle.json";
const provider = new ethers.JsonRpcProvider("http://localhost:8545");
export const contract = new ethers.Contract("0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9", artifacts.abi, provider);