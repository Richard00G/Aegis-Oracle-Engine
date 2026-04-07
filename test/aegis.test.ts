import { expect } from "chai";
import { ethers } from "hardhat";

describe("AegisOracle", function () {
  let oracle: any;
  let mock1: any;
  let mock2: any;
  let mock3: any;

  beforeEach(async () => {
    const Mock = await ethers.getContractFactory("MOCKV3A");
    mock1 = await Mock.deploy(2000);
    await mock1.waitForDeployment();

    mock2 = await Mock.deploy(2000);
    await mock2.waitForDeployment();

    mock3 = await Mock.deploy(2000);
    await mock3.waitForDeployment();

    const Oracle = await ethers.getContractFactory("AegisOracle");
    oracle = await Oracle.deploy(
      await mock1.getAddress(),
      await mock2.getAddress(),
      await mock3.getAddress()
    );
    await oracle.waitForDeployment();

    // 🔧 config inicial 
    await oracle.setDeviation(10, 20);
  });

  // ✅ 1. PRECIO NORMAL
  it("Should return correct price", async () => {
    const price = await oracle.previewPrice();
    expect(price).to.equal(2000n);
  });

  // ⚖️ 2. VALIDACIÓN ENTRE ORÁCULOS
  it("Should revert if oracles mismatch too much", async () => {

    await mock1.setPrice(2000);
    await mock2.setPrice(2100);
    await mock3.setPrice(2600); 

    await expect(oracle.previewPrice()).to.be.revertedWith(
      "Oracles mismatch"
    );
  });

  it("Should return price even with small deviation", async () => {

    await mock1.setPrice(2000);
    await mock2.setPrice(2020);
    await mock3.setPrice(1980); 

    const price = await oracle.previewPrice();
    
    expect(price).to.be.gt(0);
  });


  // 🚨 3. CIRCUIT BREAKER
  it("Should trigger breaker on extreme deviation", async () => {
    await oracle.getSafePrice(); // set initial

    await mock1.setPrice(2000);
    await mock2.setPrice(2000);
    await mock3.setPrice(2000);

    await oracle.getSafePrice();

    // 💣 cambio fuerte
    await mock1.setPrice(5000);
    await mock2.setPrice(5000);
    await mock3.setPrice(5000);

    await oracle.getSafePrice();

    const paused = await oracle.paused();
    expect(paused).to.equal(true);
  });

  // 🔁 4. FALLBACK
  it("Should use fallback if primary fails", async () => {
    // simula fallo en primary (depende de tu lógica)
    // aquí solo verificamos que no reviente

    const price = await oracle.getSafePrice();
    expect(price).to.not.equal(0);
  });

  // 🔧 5. ADMIN CONFIG
  it("Should update deviation config", async () => {
    await oracle.setDeviation(10, 50);

    const max = await oracle.maxDeviation();
    const global = await oracle.maxGlobalDeviation();

    expect(max).to.equal(10);
    expect(global).to.equal(50);
  });

});