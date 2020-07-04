const IdentityManager = artifacts.require("AlastriaIdentityManager");

const fs = require("fs");
const path = require("path");
const adminAdd = "0x6e3976aeaa3a59e4af51783cc46ee0ffabc5dc11"
const adminPKey = ""
const imAddress = "0xE0Fdc04F5AFAe99Db4BBe1D4e9Ac8d2628CB2db0";

module.exports = async function () {
  try {

    let imInstance = await IdentityManager.at(imAddress);
    await imInstance.prepareAlastriaID(adminAdd);
    await imInstance.createAlastriaIdentity(adminAdd,);

  } catch (error) {
    
  }
}