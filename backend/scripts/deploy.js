async function main() {
  const AssignmentHashing = await ethers.getContractFactory("AssignmentHashing");
  const contract = await AssignmentHashing.deploy();

  await contract.waitForDeployment();

  console.log("Contract deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
