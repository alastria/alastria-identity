const IdentityManager = artifacts.require("AlastriaIdentityManager");

const fs = require("fs");
const path = require("path");
const ethers = require("ethers");
//const adminPath = path.resolve('./dev-tools/createFakeIdentities/mocked-identity-keys/admin-6e3976aeaa3a59e4af51783cc46ee0ffabc5dc11');
const adminPath = path.resolve('./dev-tools/createFakeIdentities/mocked-identity-keys/issuer-806bc0d7a47b890383a831634bcb92dd4030b092');
//const imAddress = "0xE0Fdc04F5AFAe99Db4BBe1D4e9Ac8d2628CB2db0";
const imAddress = "0x16947aD7c14419269e957Be374E6E345AD4EDf97";

module.exports = async function () {
  try {
    // let provider = new ethers.providers.JsonRpcProvider("http://63.33.206.111/rpc")
    let provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
    let adminKeystore = fs.readFileSync(adminPath,'utf-8');
    let adminAccount = await ethers.Wallet.fromEncryptedJson(adminKeystore,"Passw0rd",(progress)=>{
      //console.log(progress);
    });
    const wallet = adminAccount.connect(provider);
    let imInstance = new ethers.Contract(imAddress,IdentityManager.abi,wallet);
    const tx1 = await imInstance.prepareAlastriaID(adminAccount.address);
    console.log(tx1);
    const tx2 = await imInstance.createAlastriaIdentity("0x50382c1a0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000008430783034306365356564633230346165393737643664363966636336623333396135376235343465663464303934393239663365623931386137376466626132363939386537376563356232396133373964643539626265393632653262323237343531343361613262353263346138373562373439326331333765656562663430353500000000000000000000000000000000000000000000000000000000");
    console.log(tx2);

  } catch (error) {
    console.log(error);
  }
}