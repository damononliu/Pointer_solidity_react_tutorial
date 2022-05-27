// // We require the Hardhat Runtime Environment explicitly here. This is optional
// // but useful for running the script in a standalone fashion through `node <script>`.
// //
// // When running the script with `npx hardhat run <script>` you'll find the Hardhat
// // Runtime Environment's members available in the global scope.
// const hre = require("hardhat");

// async function main() {
//   // Hardhat always runs the compile task when running scripts with its command
//   // line interface.
//   //
//   // If this script is run directly using `node` you may want to call compile
//   // manually to make sure everything is compiled
//   // await hre.run('compile');

//   // We get the contract to deploy
//   const Greeter = await hre.ethers.getContractFactory("Greeter");
//   const greeter = await Greeter.deploy("Hello, Hardhat!");

//   await greeter.deployed();

//   console.log("Greeter deployed to:", greeter.address);
// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });

async function main() {
  const [owner, somebodyElse] = await hre.ethers.getSigners();
  const keyboardsContractFactory = await hre.ethers.getContractFactory("Keyboards");
  const keyboardsContract = await keyboardsContractFactory.deploy();
  await keyboardsContract.deployed();

  console.log("Contract deployed to:", keyboardsContract.address);

  let keyboards = await keyboardsContract.getKeyboards();
  console.log("We got the keyboards!", keyboards);

  const keyboardTx1 = await keyboardsContract.create(0, true, "sepia");
  const txnReceipt = await keyboardTx1.wait();
  console.log(txnReceipt.events);

  const keyboardTx2 = await keyboardsContract.connect(somebodyElse).tip(0, {value: hre.ethers.utils.parseEther("1")});
  const txnReceipt1 = await keyboardTx2.wait();
  console.log(txnReceipt1.events);

  // const balanceBefore = await hre.ethers.provider.getBalance(somebodyElse.address);
  // console.log("Balance before:", hre.ethers.utils.formatEther(balanceBefore))

  // const tx = await keyboardsContract.tip(1, {value: hre.ethers.utils.parseEther("1000")});
  // await tx.wait();

  // const balanceAfter = await hre.ethers.provider.getBalance(somebodyElse.address);
  // console.log("Balance after:", hre.ethers.utils.formatEther(balanceAfter));
  // const balanceAfter1 = await hre.ethers.provider.getBalance(owner.address);

  // console.log("Balance after:", hre.ethers.utils.formatEther(balanceAfter1));



}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
