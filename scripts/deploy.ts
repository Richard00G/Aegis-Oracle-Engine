import { ethers } from "hardhat";

async function main() {
    
    const Mock = await ethers.getContractFactory("MOCKV3A");
    const mock = await Mock.deploy(2000);
    await mock.waitForDeployment();

     const Oracle = await ethers.getContractFactory("AegisOracle");
    const oracle = await Oracle.deploy(await mock.getAddress(), await mock.getAddress());
    await oracle.waitForDeployment();

    console.log("Deployed to Oracle: ", await oracle.getAddress());
    console.log("Deployed to Mock: ", await mock.getAddress());
}
main();