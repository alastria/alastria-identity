const AlastriaIdentityManager = artifacts.require('../contract/AlastriaIdentityManager.sol');

const truffleAssert = require('truffle-assertions');

contract('AlastriaIdentityManager', () => {
    var identityManager;

    if (AlastriaIdentityManager.network_id === '19535753591') {
        web3.personal.unlockAccount(web3.eth.accounts[0], "Passw0rd");
    }

    it("It should create an access token for Alastria ID creation", async () => {

        identityManager = await AlastriaIdentityManager.deployed();
        console.log("identityManager: ");
        const accessToken = await identityManager.generateAccessToken(web3.eth.accounts[1]);
        console.log("accessToken");
        truffleAssert.eventEmitted(accessToken, 'AccessTokenGenerated', (_event) => {
            return _event._signAddress == web3.eth.accounts[1];
        }, 'AccessTokenGenerated must be emmited when the account was registered.');

    });

    it("It should create an Alastria ID when accessToken was created", async () => {

        if (AlastriaIdentityManager.network_id === '19535753591') {
            web3.personal.unlockAccount(web3.eth.accounts[1], "Passw0rd");
        }

        const createIdentity = await identityManager.createIdentity( 
            {from: web3.eth.accounts[1]}
        );
        
        truffleAssert.eventEmitted(createIdentity, 'LogIdentityCreated', (_event) => {
            return _event.identity != 0 && _event.creator == web3.eth.accounts[1] && 
            _event.owner == web3.eth.accounts[1] && _event.recoveryKey == identityManager.address;
        }, 'LogIdentityCreated must be emmited when the alastria id was created.');

    });

});