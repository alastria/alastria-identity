const IdentityManager = artifacts.require("AlastriaIdentityManager");

const fs = require("fs");
const path = require("path");
const ethers = require("ethers");
// Admin keystore
const adminPath = path.resolve('./dev-tools/createFakeIdentities/mocked-identity-keys/admin-6e3976aeaa3a59e4af51783cc46ee0ffabc5dc11');
// Identity Manager Address
const imAddress = "0xbd4a2c84edb97be5beff7cd341bd63567e73f8c9";

module.exports = async function () {
  try {
    let provider = new ethers.providers.JsonRpcProvider("http://63.33.206.111/rpc")
    let adminKeystore = fs.readFileSync(adminPath, 'utf-8');
    let adminAccount = await ethers.Wallet.fromEncryptedJson(adminKeystore, "Passw0rd",(progress)=>{
      //console.log(progress);
    });
    const wallet = adminAccount.connect(provider);
    let imInstance = new ethers.Contract(imAddress, IdentityManager.abi, wallet);
    // prepareAlastriaID with EoA admin address
    const tx1 = await imInstance.prepareAlastriaID(adminAccount.address);
    console.log("tx1", tx1);
    // createAlastriaIdentity with the admin public key (ABI encoded)
    const tx2 = await imInstance.createAlastriaIdentity("0x50382c1a0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000008430783034306365356564633230346165393737643664363966636336623333396135376235343465663464303934393239663365623931386137376466626132363939386537376563356232396133373964643539626265393632653262323237343531343361613262353263346138373562373439326331333765656562663430353500000000000000000000000000000000000000000000000000000000");
    console.log("tx2", tx2);
    // addIdentityIssuer with the admin proxy address and eidas level
    const tx3 = await imInstance.addIdentityIssuer("0x7F4fbC3f46d6ece0eC8D05B41EaC195862c946d0", 3);
    console.log("tx3", tx3);
  } catch (error) {
    console.log(error);
  }
}
