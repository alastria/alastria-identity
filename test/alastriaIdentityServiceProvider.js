const AlastriaIdentityServiceProvider = artifacts.require('contracts/identityManager/AlastriaIdentityServiceProvider.sol');

var identityServiceProvider;

contract('AlastriaIdentityServiceProvider', () => {

    if (AlastriaIdentityServiceProvider.network_id === '19535753591') {
        web3.personal.unlockAccount(web3.eth.accounts[0], "Passw0rd");
    }

    it("It should add new Indentity Service Provider", async () => {

        identityServiceProvider = await AlastriaIdentityServiceProvider.new();

        await identityServiceProvider.addIdentityServiceProvider(identityServiceProvider.address);

        const isServiceProvider = await identityServiceProvider.isIdentityServiceProvider(identityServiceProvider.address);

        assert.equal(isServiceProvider, true, "The isServiceProvider must be `true`.");
    });

    it("It should remove an Indentity Service Provider", async () => {

        await identityServiceProvider.deleteIdentityServiceProvider(identityServiceProvider.address);

        const isServiceProvider = await identityServiceProvider.isIdentityServiceProvider(identityServiceProvider.address);

        assert.equal(isServiceProvider, false, "The isServiceProvider must be `false`.");

    });

});
