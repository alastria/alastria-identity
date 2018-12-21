const AlastriaIdentityAttestator = artifacts.require('../contract/AlastriaIdentityAttestator.sol');

var identityAttestator;

contract('AlastriaIdentityAttestator', () => {

    if (AlastriaIdentityAttestator.network_id === '19535753591') {
        web3.personal.unlockAccount(web3.eth.accounts[0], "Passw0rd");
    }

    it("It should add new Indentity Attestator", async () => {

        identityAttestator = await AlastriaIdentityAttestator.new();
        
        await identityAttestator.addIdentityAttestator(identityAttestator.address, 4);

        const level = await identityAttestator.getEidasLevel(identityAttestator.address);
        
        assert.equal(level, 4, "The level must be `4`.");    
    });

    it("It should modify an Indentity Attestator", async () => {

        await identityAttestator.modifyIdentityAttestatorEidasLevel(identityAttestator.address, 2);

        const level = await identityAttestator.getEidasLevel(identityAttestator.address);
        
        assert.equal(level, 2, "The level must be `2`.");    

    });

    it("It should remove an Indentity Attestator", async () => {

        await identityAttestator.removeIdentityAttestator(identityAttestator.address);
        try {
            await identityAttestator.getEidasLevel(identityAttestator.address);
            assert.fail("The call to getEidasLevel must fail if the address in't an identity provider.");
        } catch (e) {
            assert.isNotNull(e, "'e' must be an error.");
        }

    });

});