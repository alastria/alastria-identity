const AlastriaIdentityProvider = artifacts.require('../contract/AlastriaIdentityProvider.sol');

var identityProvider;

contract('AlastriaIdentityProvider', () => {

    if (AlastriaIdentityProvider.network_id === '19535753591') {
        web3.personal.unlockAccount(web3.eth.accounts[0], "Passw0rd");
    }

    it("It should add new Indentity Provider", async () => {

        identityProvider = await AlastriaIdentityProvider.new();
        
        await identityProvider.addIdentityProvider(identityProvider.address, 4);

        const level = await identityProvider.getEidasLevel(identityProvider.address);
        
        assert.equal(level, 4, "The level must be `4`.");    
    });

    it("It should modify an Indentity Provider", async () => {

        await identityProvider.modifyIdentityProviderEidasLevel(identityProvider.address, 2);

        const level = await identityProvider.getEidasLevel(identityProvider.address);
        
        assert.equal(level, 2, "The level must be `2`.");    

    });

    it("It should remove an Indentity Provider", async () => {

        await identityProvider.removeIdentityProvider(identityProvider.address);
        try {
            await identityProvider.getEidasLevel(identityProvider.address);
            assert.fail("The call to getEidasLevel must fail if the address in't an identity provider.");
        } catch (e) {
            assert.isNotNull(e, "'e' must be an error.");
        }

    });

});