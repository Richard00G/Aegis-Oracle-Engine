import { ethers } from "hardhat";

async function main() {
    
    const Mock = await ethers.getContractFactory("MOCKV3A");
    const mock1 = await Mock.deploy(2000);
    const mock2 = await Mock.deploy(2000);
    const mock3 = await Mock.deploy(2000);
    
    await mock1.waitForDeployment();
    await mock2.waitForDeployment();
    await mock3.waitForDeployment();

     const Oracle = await ethers.getContractFactory("AegisOracle");

     const oracle = await Oracle.deploy(
        await mock1.getAddress(), 
        await mock2.getAddress(), 
        await mock3.getAddress());

    await oracle.waitForDeployment();

    console.log("Deployed to Oracle: ", await oracle.getAddress());
    console.log("Deployed to Mock: ", await mock1.getAddress());
    console.log("Deployed to Mock: ", await mock2.getAddress());
    console.log("Deployed to Mock: ", await mock3.getAddress());
}
main();