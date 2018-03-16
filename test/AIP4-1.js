//https://tree.taiga.io/project/marcossanlab-alastria-platform/us/57?no-milestone=1
//#57AIP4: 1. As a user, I want to make possible to create my identity in order to interact with the Alastria network.

var AIM = artifacts.require("../contracts/AlastriaIdentityManager.sol");
var registry = artifacts.require("../contracts/UportRegistry.sol");

contract('AIM', function(accounts){
  console.log("#57AIP4: 1. As a user, I want to make possible to create my identity in order to interact with the Alastria network.\n");
  web3.eth.defaultAccount = accounts[0];
  console.log("Default account " + accounts[0]);
  it("An AlastriaIdentityManager with it's proxy should be deployed",() => {
    return AIM.deployed()
    .then((AIM_instance) => {
      AIM_instance.createIdentity(accounts[1]);
      return AIM_instance;
    })
    .then((AIM_instance) => {
      var event_LogIdentityCreated = AIM_instance.LogIdentityCreated({},{fromBlock: 0, toBlock: 'Latest'});
      event_LogIdentityCreated.get((err, res) => {
        if(err) {
          console.log(err);
          return;
        }
        assert.equal(res[0].args.creator, accounts[0], "Unknown creator");
        assert.equal(res[0].args.owner,  accounts[1], "Unknown owner");
      });
    })
  });
});
