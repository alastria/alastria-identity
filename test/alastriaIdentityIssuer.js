const AlastriaIdentityIssuer = artifacts.require('contracts/identityManager/AlastriaIdentityIssuer.sol');

var identityIssuer;

contract('AlastriaIdentityIssuer', () => {

    if (AlastriaIdentityIssuer.network_id === '19535753591') {
        web3.personal.unlockAccount(web3.eth.accounts[0], "Passw0rd");
    }

    it("It should add new Indentity Issuer", async () => {

        identityIssuer = await AlastriaIdentityIssuer.new();

        await identityIssuer.addIdentityIssuer(identityIssuer.address, 4);

        const level = await identityIssuer.getEidasLevel(identityIssuer.address);

        assert.equal(level, 4, "The level must be `4`.");
    });

    it("It should update an Indentity Issuer", async () => {

        await identityIssuer.updateIdentityIssuerEidasLevel(identityIssuer.address, 2);

        const level = await identityIssuer.getEidasLevel(identityIssuer.address);

        assert.equal(level, 2, "The level must be `2`.");

    });

    it("It should delete an Indentity Issuer", async () => {

        await identityIssuer.deleteIdentityIssuer(identityIssuer.address);
        try {
            await identityIssuer.getEidasLevel(identityIssuer.address);
            assert.fail("The call to getEidasLevel must fail if the address in't an identity provider.");
        } catch (e) {
            assert.isNotNull(e, "'e' must be an error.");
        }

    });

});
