const AlastriaIdentityManager = artifacts.require('contracts/identityManager/AlastriaIdentityManager.sol');

const truffleAssert = require('truffle-assertions');

contract('AlastriaIdentityManager', () => {
    var identityManager;

    if (AlastriaIdentityManager.network_id === '19535753591') {
        web3.personal.unlockAccount(web3.eth.accounts[0], "Passw0rd");
    }

    it("It should create an access token for Alastria ID creation", async () => {

        identityManager = await AlastriaIdentityManager.deployed();

        const accessToken = await identityManager.generateAccessToken(web3.eth.accounts[1]);

        truffleAssert.eventEmitted(accessToken, 'AccessTokenGenerated', (_event) => {
            return _event.signAddress == web3.eth.accounts[1];
        }, 'AccessTokenGenerated must be emmited when the account was registered.');

    });

    it("It should create an Alastria ID when accessToken was created", async () => {

        if (AlastriaIdentityManager.network_id === '19535753591') {
            web3.personal.unlockAccount(web3.eth.accounts[1], "Passw0rd");
        }

        const createIdentity = await identityManager.createAlastriaIdentity(
            {from: web3.eth.accounts[1]}
        );

        // TODO: IGM revisar este test
        truffleAssert.eventEmitted(createIdentity, 'IdentityCreated', (_event) => {
            return _event.identity != 0 && _event.creator == web3.eth.accounts[1] &&
              _event.owner == web3.eth.accounts[1] && _event.recoveryKey == identityManager.address;
        }, 'IdentityCreated event must be emmited when the alastria id was created.');

    });

    it ("It should emit OperationWasNotSupported if try to create identity with originals uport methods", async() => {

        if (AlastriaIdentityManager.network_id === '19535753591') {
            web3.personal.unlockAccount(web3.eth.accounts[1], "Passw0rd");
        }

        try {
            const createIdentity = await identityManager.createIdentity.call( web3.eth.accounts[0],
                web3.eth.accounts[0]
            );
        } catch (e) {
            assert.isNotNull(e);
        }

        try {
            const createIdentityWithCall = await identityManager.createIdentityWithCall.call( web3.eth.accounts[2],
                web3.eth.accounts[1], web3.eth.accounts[0], ["0x1262","0x12","0x12"]
            );
        } catch (e) {
            assert.isNotNull(e);
        }

    });

});
