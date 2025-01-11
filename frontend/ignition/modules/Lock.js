const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("LockModule", (m) => {
  // Default owner address - using the first hardhat test account
  const initialOwner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  
  // Deploy Lock contract with initial owner
  const lock = m.contract("Lock", [initialOwner]);
  
  return { lock };
});
