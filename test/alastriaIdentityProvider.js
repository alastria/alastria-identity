const AlastriaIdentityProvider = artifacts.require('../contract/AlastriaIdentityProvider.sol');

var identityProvider;

contract('AlastriaIdentityProvider', () => {

    if (AlastriaIdentityProvider.network_id === '19535753591') {
        web3.personal.unlockAccount(web3.eth.accounts[0], "Passw0rd");
    }

    it("It should add new Indentity Provider", async () => {

        identityProvider = await AlastriaIdentityProvider.new();
        
        await identityProvider.addIdentityProvider(identityProvider.address);

        const isProvider = await identityProvider.isIdentityProvider(identityProvider.address);
        
        assert.equal(isProvider, true, "The isProvider must be `true`.");    
    });

    it("It should remove an Indentity Provider", async () => {

        await identityProvider.removeIdentityProvider(identityProvider.address);
        
        const isProvider = await identityProvider.isIdentityProvider(identityProvider.address);
        
        assert.equal(isProvider, false, "The isProvider must be `false`.");    

    });

});
