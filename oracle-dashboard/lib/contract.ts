import { ethers } from "ethers";
import artifacts from "../../artifacts/contracts/AegisOracle.sol/AegisOracle.json";
import mockAbi from "../../artifacts/contracts/MOCKV3A.sol/MOCKV3A.json";

let provider: any;
let signer: any;

if (typeof window !== "undefined") {
    provider = new ethers.BrowserProvider((window as any).ethereum);
}

export const getContract = async () => {
    signer = await provider.getSigner();
    const contract = new ethers.Contract("0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9", artifacts.abi, signer);
    const mock = new ethers.Contract("0x5FbDB2315678afecb367f032d93F642f64180aa3", mockAbi.abi, signer);
    return { contract, mock };
}


