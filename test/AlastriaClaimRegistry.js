"use strict";
var AlastriaClaimRegistry = artifacts.require('./AlastriaClaimRegistry.sol');


contract('AlastriaClaimRegistry', (accounts) => {
    let Claim;

    let subject1 = accounts[0];
    let subject2 = accounts[1];
    let receiver1 = accounts[2];
    let receiver2 = accounts[3];

    var verboseLevel = 1;

    var Claim1 = "Claim1";
    var Claim2 = "Claim2";
    var Claim3 = "Claim2";
    var Claim4 = "Claim4";

    var dataHash1 = "dataHash1"; // Should be web3.eth.abi.encodeParameter("bytes32",web3.utils.soliditySha3(Claim1))
    var dataHash2 = "dataHash2"; // but readable strings make life easier.
    var dataHash3 = "dataHash3";
    var dataHash4 = "dataHash4";

    var signature1 = "signature1"; // Should be the signature of Claim1
    var signature2 = "signature2";
    var signature3 = "signature3";
    var signature4 = "signature4";

    var dualHash1 = "dualHash1"; // Should be web3.eth.abi.encodeParameter("bytes32",web3-utils.soliditySha3(dataHash1 + signature1))
    var dualHash2 = "dualHash2";
    var dualHash3 = "dualHash3";
    var dualHash4 = "dualHash4";
    var dualHash

    // Return Variables from Solidity Smart Contract
    var txResult;
    var subjectStatus;
    var receiverStatus;
    var ClaimStatus;
    var ClaimList;

    //we can't reuse enum in solidity contract, so status definition is duplicated here
    let Status = {
        "Valid": 0,
        "Received": 1,
        "AskDeletion": 2,
        "DeletionConfirmation": 3
    };

    function logStatus(verbosity) {
        var i;
        var attString;

        if (verbosity <= verboseLevel) {
            /* More detailled view: log(2, "subject    : " , subjectStatus[0] , ", " , subjectStatus[1], ",", subjectStatus[1].c)*/
            console.log("subject     : " + subjectStatus);
            console.log("receiver    : " + receiverStatus);
            console.log("claim status: " + ClaimStatus);
            /* console.log("AttList    : ", ClaimList) */
            /* Detailed ClaimList one by one in UTF8 */
            attString = ClaimList[0];
            for (i = 0; i < ClaimList[0]; i++) {
                attString = attString + ", " + web3.toUtf8(ClaimList[1][i]);
            }
            console.log("ClaimList   : ", attString);

            for (i = 0; i < txResult.logs.length; i++) {
                console.log("Event       : " + txResult.logs[i].event,
                            "args: " + web3.toUtf8(txResult.logs[i].args.hash) + ", " + txResult.logs[i].args.status);
            }
        }
    }

    function log (verbosity, message) {
        if (verbosity <= verboseLevel) {
            console.log(message);
        }
    }

    it('Creates AlastriaClaimRegistry correctly', async() => {
        Claim = await AlastriaClaimRegistry.deployed();
        const version = await Claim.version();
        const previousVersion = await Claim.previousPublishedVersion();

        assert.equal(version.toNumber(), 3, 'The `version` must be `3`.');
        assert.equal(previousVersion, accounts[0], 'The contract was deployed for the 0 account.');
    });


    //Test Set 1: Subject1, Receiver1, dataHash1, dualHash1. One by one transitions
    it('Initial Set for Subject1,  dataHash1', async() => {
        log(2, "");
        log(2, "Test Set 1: Subject1, Receiver1, dataHash1, dualHash1. One by one transitions");
        log(2, "Subject1  : "+subject1);
        log(2, "Receiver1 : "+receiver1);
        log(2, "dataHash1 : "+dataHash1);
        log(2, "dualHash1 : "+dualHash1);
        log(2, "");

        txResult = await Claim.set(dataHash1, "Direccion1", {from: subject1});
        subjectStatus = await Claim.subjectClaimStatus.call(subject1, dataHash1);
        receiverStatus =  await Claim.receiverClaimStatus.call(receiver1, dualHash1);
        ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
        ClaimList = await Claim.subjectClaimList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(receiverStatus[0], false, 'should not exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(ClaimStatus.toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(ClaimList[0].toNumber(), 1, 'should be 1');
        assert.strictEqual(web3.toUtf8(ClaimList[1][0]), dataHash1, 'should be dataHash1');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
    });

    it('Second equal Set for Subject1, dataHash1, will fail & revert', async() => {
        try {
            txResult = await Claim.set(dataHash1, "Direccion1", {from: subject1});
            log(2, "");
            assert (false, "ERROR: Expected exception not raised");
            log(2, "");
        } catch (error) {
            log(2, "");
            log(2, "Expected exception caught:" + error);
            log(2, "Check nothing changed.");
            log(2, "");

            subjectStatus = await Claim.subjectClaimStatus.call(subject1, dataHash1);
            receiverStatus = await Claim.receiverClaimStatus.call(receiver1, dualHash1);
            ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
            ClaimList = await Claim.subjectClaimList({from: subject1});
            logStatus(2);

            assert.strictEqual(subjectStatus[0], true, 'should exist');
            assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(receiverStatus[0], false, 'should not exist');
            assert.strictEqual(receiverStatus[1].toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(ClaimStatus.toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(ClaimList[0].toNumber(), 1, 'should be 1');
            assert.strictEqual(web3.toUtf8(ClaimList[1][0]), dataHash1, 'should be dataHash1');
            assert.strictEqual(txResult.logs.length, 0, 'should be 0');
        }
    });

    it('Change to invalid Status by subject1, will fail & revert', async() => {
        try {
            txResult = await Claim.subjectUpdateClaim(dataHash1, 10, {from: subject1});
            log(2, "");
            assert (false, "ERROR: Expected exception not raised.");
            log(2, "");
        } catch (error) {
            log(2, "");
            log(2, "Expected exception caught:" + error);
            log(2, "Check nothing changed.");
            log(2, "");
            subjectStatus = await Claim.subjectClaimStatus.call(subject1, dataHash1);
            receiverStatus = await Claim.receiverClaimStatus.call(receiver1, dualHash1);
            ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
            ClaimList = await Claim.subjectClaimList({from: subject1});
            logStatus(2);

            assert.strictEqual(subjectStatus[0], true, 'should exist');
            assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(receiverStatus[0], false, 'should not exist');
            assert.strictEqual(receiverStatus[1].toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(ClaimStatus.toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(ClaimList[0].toNumber(), 1, 'should be 1');
            assert.strictEqual(web3.toUtf8(ClaimList[1][0]), dataHash1, 'should be dataHash1');
            assert.strictEqual(txResult.logs.length, 0, 'should be 0');
        }
    });

    it('Change to invalid Status by Receiver1, will fail & revert', async() => {
        try {
            txResult = await Claim.receiverUpdateClaim(dualHash1, 10, {from: receiver1});
            log(2, "");
            assert (false, "ERROR: Expected exception not raised.");
            log(2, "");
        } catch (error) {
            log(2, "");
            log(2, "Expected exception caught:" + error);
            log(2, "Check nothing changed.");
            log(2, "");
            subjectStatus = await Claim.subjectClaimStatus.call(subject1, dataHash1);
            receiverStatus = await Claim.receiverClaimStatus.call(receiver1, dualHash1);
            ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
            ClaimList = await Claim.subjectClaimList({from: subject1});
            logStatus(2);

            assert.strictEqual(subjectStatus[0], true, 'should exist');
            assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(receiverStatus[0], false, 'should not exist');
            assert.strictEqual(receiverStatus[1].toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(ClaimStatus.toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(ClaimList[0].toNumber(), 1, 'should be 1');
            assert.strictEqual(web3.toUtf8(ClaimList[1][0]), dataHash1, 'should be dataHash1');
            assert.strictEqual(txResult.logs.length, 0, 'should be 0');
        }
    });

    it('Change to AskDeletion by Receiver1, no change', async() => {
        txResult = await Claim.receiverUpdateClaim(dualHash1, Status.AskDeletion, {from: receiver1});
        subjectStatus = await Claim.subjectClaimStatus.call(subject1, dataHash1);
        receiverStatus = await Claim.receiverClaimStatus.call(receiver1, dualHash1);
        ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
        ClaimList = await Claim.subjectClaimList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(receiverStatus[0], false, 'should not exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(ClaimStatus.toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(ClaimList[0].toNumber(), 1, 'should be 1');
        assert.strictEqual(web3.toUtf8(ClaimList[1][0]), dataHash1, 'should be dataHash1');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');

    });

    it('Change to Received by Subject1, no change', async() => {
        txResult = await Claim.subjectUpdateClaim(dataHash1, Status.Received, {from: subject1});
        subjectStatus = await Claim.subjectClaimStatus.call(subject1, dataHash1);
        receiverStatus = await Claim.receiverClaimStatus.call(receiver1, dualHash1);
        ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
        ClaimList = await Claim.subjectClaimList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(receiverStatus[0], false, 'should not exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(ClaimStatus.toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(ClaimList[0].toNumber(), 1, 'should be 1');
        assert.strictEqual(web3.toUtf8(ClaimList[1][0]), dataHash1, 'should be dataHash1');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
    })

    it('Change to Received by Receiver1', async() => {
        txResult = await Claim.receiverUpdateClaim(dualHash1, Status.Received, {from: receiver1});
        subjectStatus = await Claim.subjectClaimStatus.call(subject1, dataHash1);
        receiverStatus = await Claim.receiverClaimStatus.call(receiver1, dualHash1);
        ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
        ClaimList = await Claim.subjectClaimList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Received, 'should be Received');
        assert.strictEqual(ClaimStatus.toNumber(), Status.Received, 'should be Received');
        assert.strictEqual(ClaimList[0].toNumber(), 1, 'should be 1');
        assert.strictEqual(web3.toUtf8(ClaimList[1][0]), dataHash1, 'should be dataHash1');
        assert.strictEqual(txResult.logs.length, 1, 'should be 1');
        assert.strictEqual(txResult.logs[0].event, "ClaimUpdated", 'should be ClaimUpdated');
        assert.strictEqual(web3.toUtf8(txResult.logs[0].args.hash), dualHash1, 'should be dualHash1' );
        assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.Received, 'should be Received' );
    })

    it('Change to AskDeletion by subject1', async() => {
        txResult = await Claim.subjectUpdateClaim(dataHash1, Status.AskDeletion, {from: subject1});
        subjectStatus = await Claim.subjectClaimStatus.call(subject1, dataHash1);
        receiverStatus = await Claim.receiverClaimStatus.call(receiver1, dualHash1);
        ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
        ClaimList = await Claim.subjectClaimList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Received, 'should be Valid');
        assert.strictEqual(ClaimStatus.toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(ClaimList[0].toNumber(), 1, 'should be 1');
        assert.strictEqual(web3.toUtf8(ClaimList[1][0]), dataHash1, 'should be dataHash1');
        assert.strictEqual(txResult.logs.length, 1, 'should be 1');
        assert.strictEqual(txResult.logs[0].event, "ClaimUpdated", 'should be ClaimUpdated');
        assert.strictEqual(web3.toUtf8(txResult.logs[0].args.hash), dataHash1, 'should be dataHash1' );
        assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.AskDeletion, 'should be AskDeletion' );
    });

    it('Change back to Valid by subject1, no change', async() => {
        txResult = await Claim.subjectUpdateClaim(dataHash1, Status.Valid, {from: subject1});
        subjectStatus = await Claim.subjectClaimStatus.call(subject1, dataHash1);
        receiverStatus = await Claim.receiverClaimStatus.call(receiver1, dualHash1);
        ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
        ClaimList = await Claim.subjectClaimList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Received, 'should be Received');
        assert.strictEqual(ClaimStatus.toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(ClaimList[0].toNumber(), 1, 'should be 1');
        assert.strictEqual(web3.toUtf8(ClaimList[1][0]), dataHash1, 'should be dataHash1');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
    });

    it('Change again to Received by Receiver1, no change', async() => {
        txResult = await Claim.receiverUpdateClaim(dualHash1, Status.Received, {from: receiver1});
        subjectStatus = await Claim.subjectClaimStatus.call(subject1, dataHash1);
        receiverStatus = await Claim.receiverClaimStatus.call(receiver1, dualHash1);
        ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
        ClaimList = await Claim.subjectClaimList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Received, 'should be Received');
        assert.strictEqual(ClaimStatus.toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(ClaimList[0].toNumber(), 1, 'should be 1');
        assert.strictEqual(web3.toUtf8(ClaimList[1][0]), dataHash1, 'should be dataHash1');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
    });

    it('Change to DeletionConfirmation by Receiver1', async() => {
        txResult = await Claim.receiverUpdateClaim(dualHash1, Status.DeletionConfirmation, {from: receiver1});
        subjectStatus = await Claim.subjectClaimStatus.call(subject1, dataHash1);
        receiverStatus = await Claim.receiverClaimStatus.call(receiver1, dualHash1);
        ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
        ClaimList = await Claim.subjectClaimList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(ClaimStatus.toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(ClaimList[0].toNumber(), 1, 'should be 1');
        assert.strictEqual(web3.toUtf8(ClaimList[1][0]), dataHash1, 'should be dataHash1');
        assert.strictEqual(txResult.logs.length, 1, 'should be 1');
        assert.strictEqual(txResult.logs[0].event, "ClaimUpdated", 'should be ClaimUpdated');
        assert.strictEqual(web3.toUtf8(txResult.logs[0].args.hash), dualHash1, 'should be dualHash1' );
        assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation' );
    });

    it('Change back to Valid by subject1, no change', async() => {
        txResult = await Claim.subjectUpdateClaim(dataHash1, Status.Valid, {from: subject1});
        subjectStatus = await Claim.subjectClaimStatus.call(subject1, dataHash1);
        receiverStatus = await Claim.receiverClaimStatus.call(receiver1, dualHash1);
        ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
        ClaimList = await Claim.subjectClaimList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(ClaimStatus.toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(ClaimList[0].toNumber(), 1, 'should be 1');
        assert.strictEqual(web3.toUtf8(ClaimList[1][0]), dataHash1, 'should be dataHash1');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
      });

    it('Change Back to Received by Receiver1, no change', async() => {
        txResult = await Claim.receiverUpdateClaim(dualHash1, Status.Received, {from: receiver1});
        subjectStatus = await Claim.subjectClaimStatus.call(subject1, dataHash1);
        receiverStatus = await Claim.receiverClaimStatus.call(receiver1, dualHash1);
        ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
        ClaimList = await Claim.subjectClaimList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(ClaimStatus.toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(ClaimList[0].toNumber(), 1, 'should be 1');
        assert.strictEqual(web3.toUtf8(ClaimList[1][0]), dataHash1, 'should be dataHash1');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
    });


//Set 2: Subject1, Receiver2, dataHash2, dualHash2. One by one transitions
    it('Initial Set for subject1,  dataHash2', async() => {
        log(2, "");
        log(2, "Test Set 2: subject1, receiver2, dataHash2, dualHash2. One by one transitions");
        log(2, "subject1  : "+subject1);
        log(2, "receiver2 : "+receiver2);
        log(2, "dataHash2 : "+dataHash2);
        log(2, "dualHash2 : "+dualHash2);
        log(2, "");

        txResult = await Claim.set(dataHash2, "Direccion2", {from: subject1});
        subjectStatus = await Claim.subjectClaimStatus.call(subject1, dataHash2);
        receiverStatus =  await Claim.receiverClaimStatus.call(receiver1, dualHash2);
        ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
        ClaimList = await Claim.subjectClaimList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(receiverStatus[0], false, 'should not exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(ClaimStatus.toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(ClaimList[0].toNumber(), 2, 'should be 2');
        assert.strictEqual(web3.toUtf8(ClaimList[1][1]), dataHash2, 'should be dataHash2');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
    });

    it('Second equal Set for Subject1, dataHash2, will fail & revert', async() => {
        try {
            txResult = await Claim.set(dataHash2, "Direccion2", {from: subject1});
            log(2, "");
            assert (false, "ERROR: Expected exception not raised");
            log(2, "");
        } catch (error) {
            log(2, "");
            log(2, "Expected exception caught:" + error);
            log(2, "Check nothing changed.");
            log(2, "");

            subjectStatus = await Claim.subjectClaimStatus.call(subject1, dataHash2);
            receiverStatus = await Claim.receiverClaimStatus.call(receiver1, dualHash2);
            ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
            ClaimList = await Claim.subjectClaimList({from: subject1});
            logStatus(2);

            assert.strictEqual(subjectStatus[0], true, 'should exist');
            assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(receiverStatus[0], false, 'should not exist');
            assert.strictEqual(receiverStatus[1].toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(ClaimStatus.toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(ClaimList[0].toNumber(), 2, 'should be 2');
            assert.strictEqual(web3.toUtf8(ClaimList[1][1]), dataHash2, 'should be dataHash2');
            assert.strictEqual(txResult.logs.length, 0, 'should be 0');
        }
    });

    it('Change to invalid Status by subject1, will fail & revert', async() => {
        try {
            txResult = await Claim.subjectUpdateClaim(dataHash2, 10, {from: subject1});
            log(2, "");
            assert (false, "ERROR: Expected exception not raised.");
            log(2, "");
        } catch (error) {
            log(2, "");
            log(2, "Expected exception caught:" + error);
            log(2, "Check nothing changed.");
            log(2, "");
            subjectStatus = await Claim.subjectClaimStatus.call(subject1, dataHash2);
            receiverStatus = await Claim.receiverClaimStatus.call(receiver1, dualHash2);
            ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
            ClaimList = await Claim.subjectClaimList({from: subject1});
            logStatus(2);

            assert.strictEqual(subjectStatus[0], true, 'should exist');
            assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(receiverStatus[0], false, 'should not exist');
            assert.strictEqual(receiverStatus[1].toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(ClaimStatus.toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(ClaimList[0].toNumber(), 2, 'should be 2');
            assert.strictEqual(web3.toUtf8(ClaimList[1][1]), dataHash2, 'should be dataHash2');
            assert.strictEqual(txResult.logs.length, 0, 'should be 0');
        }
    });

    it('Change to invalid Status by Receiver1, will fail & revert', async() => {
        try {
            txResult = await Claim.receiverUpdateClaim(dualHash2, 10, {from: receiver1});
            log(2, "");
            assert (false, "ERROR: Expected exception not raised.");
            log(2, "");
        } catch (error) {
            log(2, "");
            log(2, "Expected exception caught:" + error);
            log(2, "Check nothing changed.");
            log(2, "");
            subjectStatus = await Claim.subjectClaimStatus.call(subject1, dataHash2);
            receiverStatus = await Claim.receiverClaimStatus.call(receiver1, dualHash2);
            ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
            ClaimList = await Claim.subjectClaimList({from: subject1});
            logStatus(2);

            assert.strictEqual(subjectStatus[0], true, 'should exist');
            assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(receiverStatus[0], false, 'should not exist');
            assert.strictEqual(receiverStatus[1].toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(ClaimStatus.toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(ClaimList[0].toNumber(), 2, 'should be 2');
            assert.strictEqual(web3.toUtf8(ClaimList[1][1]), dataHash2, 'should be dataHash2');
            assert.strictEqual(txResult.logs.length, 0, 'should be 0');
        }
    });

    it('Change to AskDeletion by Receiver1, no change', async() => {
        txResult = await Claim.receiverUpdateClaim(dualHash2, Status.AskDeletion, {from: receiver1});
        subjectStatus = await Claim.subjectClaimStatus.call(subject1, dataHash2);
        receiverStatus = await Claim.receiverClaimStatus.call(receiver1, dualHash2);
        ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
        ClaimList = await Claim.subjectClaimList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(receiverStatus[0], false, 'should not exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(ClaimStatus.toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(ClaimList[0].toNumber(), 2, 'should be 2');
        assert.strictEqual(web3.toUtf8(ClaimList[1][1]), dataHash2, 'should be dataHash2');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');

    });

    it('Change to Received by Subject1, no change', async() => {
        txResult = await Claim.subjectUpdateClaim(dataHash2, Status.Received, {from: subject1});
        subjectStatus = await Claim.subjectClaimStatus.call(subject1, dataHash2);
        receiverStatus = await Claim.receiverClaimStatus.call(receiver1, dualHash2);
        ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
        ClaimList = await Claim.subjectClaimList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(receiverStatus[0], false, 'should not exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(ClaimStatus.toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(ClaimList[0].toNumber(), 2, 'should be 2');
        assert.strictEqual(web3.toUtf8(ClaimList[1][1]), dataHash2, 'should be dataHash2');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
    });

    it('Change to Received by Receiver1', async() => {
        txResult = await Claim.receiverUpdateClaim(dualHash2, Status.Received, {from: receiver1});
        subjectStatus = await Claim.subjectClaimStatus.call(subject1, dataHash2);
        receiverStatus = await Claim.receiverClaimStatus.call(receiver1, dualHash2);
        ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
        ClaimList = await Claim.subjectClaimList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Received, 'should be Received');
        assert.strictEqual(ClaimStatus.toNumber(), Status.Received, 'should be Received');
        assert.strictEqual(ClaimList[0].toNumber(), 2, 'should be 2');
        assert.strictEqual(web3.toUtf8(ClaimList[1][1]), dataHash2, 'should be dataHash2');
        assert.strictEqual(txResult.logs.length, 1, 'should be 1');
        assert.strictEqual(txResult.logs[0].event, "ClaimUpdated", 'should be ClaimUpdated');
        assert.strictEqual(web3.toUtf8(txResult.logs[0].args.hash), dualHash2, 'should be dualHash2' );
        assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.Received, 'should be Received' );
    });

    it('Change to AskDeletion by subject1', async() => {
        txResult = await Claim.subjectUpdateClaim(dataHash2, Status.AskDeletion, {from: subject1});
        subjectStatus = await Claim.subjectClaimStatus.call(subject1, dataHash2);
        receiverStatus = await Claim.receiverClaimStatus.call(receiver1, dualHash2);
        ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
        ClaimList = await Claim.subjectClaimList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Received, 'should be Valid');
        assert.strictEqual(ClaimStatus.toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(ClaimList[0].toNumber(), 2, 'should be 2');
        assert.strictEqual(web3.toUtf8(ClaimList[1][1]), dataHash2, 'should be dataHash2');
        assert.strictEqual(txResult.logs.length, 1, 'should be 1');
        assert.strictEqual(txResult.logs[0].event, "ClaimUpdated", 'should be ClaimUpdated');
        assert.strictEqual(web3.toUtf8(txResult.logs[0].args.hash), dataHash2, 'should be dataHash2' );
        assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.AskDeletion, 'should be AskDeletion' );
    });

    it('Change back to Valid by subject1, no change', async() => {
        txResult = await Claim.subjectUpdateClaim(dataHash2, Status.Valid, {from: subject1});
        subjectStatus = await Claim.subjectClaimStatus.call(subject1, dataHash2);
        receiverStatus = await Claim.receiverClaimStatus.call(receiver1, dualHash2);
        ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
        ClaimList = await Claim.subjectClaimList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Received, 'should be Received');
        assert.strictEqual(ClaimStatus.toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(ClaimList[0].toNumber(), 2, 'should be 2');
        assert.strictEqual(web3.toUtf8(ClaimList[1][1]), dataHash2, 'should be dataHash2');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
    });

    it('Change again to Received by Receiver1, no change', async() => {
        txResult = await Claim.receiverUpdateClaim(dualHash2, Status.Received, {from: receiver1});
        subjectStatus = await Claim.subjectClaimStatus.call(subject1, dataHash2);
        receiverStatus = await Claim.receiverClaimStatus.call(receiver1, dualHash2);
        ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
        ClaimList = await Claim.subjectClaimList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Received, 'should be Received');
        assert.strictEqual(ClaimStatus.toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(ClaimList[0].toNumber(), 2, 'should be 2');
        assert.strictEqual(web3.toUtf8(ClaimList[1][1]), dataHash2, 'should be dataHash2');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
    });

    it('Change to DeletionConfirmation by Receiver1', async() => {
        txResult = await Claim.receiverUpdateClaim(dualHash2, Status.DeletionConfirmation, {from: receiver1});
        subjectStatus = await Claim.subjectClaimStatus.call(subject1, dataHash2);
        receiverStatus = await Claim.receiverClaimStatus.call(receiver1, dualHash2);
        ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
        ClaimList = await Claim.subjectClaimList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(ClaimStatus.toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(ClaimList[0].toNumber(), 2, 'should be 2');
        assert.strictEqual(web3.toUtf8(ClaimList[1][1]), dataHash2, 'should be dataHash2');
        assert.strictEqual(txResult.logs.length, 1, 'should be 1');
        assert.strictEqual(txResult.logs[0].event, "ClaimUpdated", 'should be ClaimUpdated');
        assert.strictEqual(web3.toUtf8(txResult.logs[0].args.hash), dualHash2, 'should be dualHash2' );
        assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation' );
    });

    it('Change back to Valid by subject1, no change', async() => {
        txResult = await Claim.subjectUpdateClaim(dataHash2, Status.Valid, {from: subject1});
        subjectStatus = await Claim.subjectClaimStatus.call(subject1, dataHash2);
        receiverStatus = await Claim.receiverClaimStatus.call(receiver1, dualHash2);
        ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
        ClaimList = await Claim.subjectClaimList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(ClaimStatus.toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(ClaimList[0].toNumber(), 2, 'should be 2');
        assert.strictEqual(web3.toUtf8(ClaimList[1][1]), dataHash2, 'should be dataHash2');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
      });

    it('Change Back to Received by Receiver1, no change', async() => {
        txResult = await Claim.receiverUpdateClaim(dualHash2, Status.Received, {from: receiver1});
        subjectStatus = await Claim.subjectClaimStatus.call(subject1, dataHash2);
        receiverStatus = await Claim.receiverClaimStatus.call(receiver1, dualHash2);
        ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
        ClaimList = await Claim.subjectClaimList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(ClaimStatus.toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(ClaimList[0].toNumber(), 2, 'should be 2');
        assert.strictEqual(web3.toUtf8(ClaimList[1][1]), dataHash2, 'should be dataHash2');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
    });


    //Test Set 3: Subject2, Receiver2, dataHash3, dualHash3. Direct jump to Revoked and backtransitions
    it('Update before Set for subject2,  dataHash3', async() => {
        log(2, "");
        log(2, "Test Set 3: Subject2, Receiver2, dataHash3, dualHash3.");
        log(2, "Test Set 3: Many Hashes in the middle. Direct Jump to AskDeletion");
        log(2, "subject2  : "+subject2);
        log(2, "receiver2 : "+receiver2);
        log(2, "dataHash3 : "+dataHash3);
        log(2, "dualHash3 : "+dualHash3);
        log(2, "");

        txResult = await Claim.subjectUpdateClaim(dataHash3, Status.Valid, {from: subject2});
        subjectStatus = await Claim.subjectClaimStatus.call(subject2, dataHash3);
        receiverStatus = await Claim.receiverClaimStatus.call(receiver2, dualHash3);
        ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
        ClaimList = await Claim.subjectClaimList({from: subject2});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], false, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid');
        assert.strictEqual(receiverStatus[0], false, 'should not exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(ClaimStatus.toNumber(), Status.Valid, 'should be Valid');
        assert.strictEqual(ClaimList[0].toNumber(), 0, 'should be 0');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
    });

    it('Initial Set for subject2,  dataHash3', async() => {
        txResult = await Claim.set("MiddH1", "MidDireccion1", {from: subject2})
        txResult = await Claim.set("MiddH2", "MidDireccion2", {from: subject2})
        txResult = await Claim.set("MiddH3", "MidDireccion3", {from: subject2})
        txResult = await Claim.set("MiddH4", "MidDireccion4", {from: subject2})
        txResult = await Claim.set("MiddH5", "MidDireccion5", {from: subject2})
        txResult = await Claim.set("MiddH6", "MidDireccion6", {from: subject2})
        txResult = await Claim.set("MiddH7", "MidDireccion7", {from: subject2})
        txResult = await Claim.set("MiddH8", "MidDireccion8", {from: subject2})
        txResult = await Claim.set("MiddH9", "MidDireccion9", {from: subject2})

        txResult = await Claim.set(dataHash3, "Direccion3", {from: subject2});
        subjectStatus = await Claim.subjectClaimStatus.call(subject2, dataHash3);
        receiverStatus =  await Claim.receiverClaimStatus.call(receiver2, dualHash3);
        ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
        ClaimList = await Claim.subjectClaimList({from: subject2});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(receiverStatus[0], false, 'should not exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(ClaimStatus.toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(ClaimList[0].toNumber(), 10, 'should be 10');
        assert.strictEqual(web3.toUtf8(ClaimList[1][9]), dataHash3, 'should be dataHash3');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
    });

    it('Change to AskDeletion by subject2', async() => {
        txResult = await Claim.subjectUpdateClaim(dataHash3, Status.AskDeletion, {from: subject2});
        subjectStatus = await Claim.subjectClaimStatus.call(subject2, dataHash3);
        receiverStatus = await Claim.receiverClaimStatus.call(receiver2, dualHash3);
        ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
        ClaimList = await Claim.subjectClaimList({from: subject2});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], false, 'should not exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(ClaimStatus.toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(ClaimList[0].toNumber(), 10, 'should be 10');
        assert.strictEqual(web3.toUtf8(ClaimList[1][9]), dataHash3, 'should be dataHash3');
        assert.strictEqual(txResult.logs.length, 1, 'should be 1');
        assert.strictEqual(txResult.logs[0].event, "ClaimUpdated", 'should be ClaimUpdated');
        assert.strictEqual(web3.toUtf8(txResult.logs[0].args.hash), dataHash3, 'should be dataHash3' );
        assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.AskDeletion, 'should be AskDeletion' );
    });

    it('Change back to Valid by subject2, no change', async() => {
        txResult = await Claim.subjectUpdateClaim(dataHash3, Status.Valid, {from: subject2});
        subjectStatus = await Claim.subjectClaimStatus.call(subject2, dataHash3);
        receiverStatus = await Claim.receiverClaimStatus.call(receiver2, dualHash3);
        ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
        ClaimList = await Claim.subjectClaimList({from: subject2});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], false, 'should not exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(ClaimStatus.toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(ClaimList[0].toNumber(), 10, 'should be 10');
        assert.strictEqual(web3.toUtf8(ClaimList[1][9]), dataHash3, 'should be dataHash3');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
    });

    it('Change to Received by receiver2', async() => {
        txResult = await Claim.receiverUpdateClaim(dualHash3, Status.Received, {from: receiver2});
        subjectStatus = await Claim.subjectClaimStatus.call(subject2, dataHash3);
        receiverStatus = await Claim.receiverClaimStatus.call(receiver2, dualHash3);
        ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
        ClaimList = await Claim.subjectClaimList({from: subject2});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Received, 'should be Received');
        assert.strictEqual(ClaimStatus.toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(ClaimList[0].toNumber(), 10, 'should be 10');
        assert.strictEqual(web3.toUtf8(ClaimList[1][9]), dataHash3, 'should be dataHash3');
        assert.strictEqual(txResult.logs.length, 1, 'should be 1');
        assert.strictEqual(txResult.logs[0].event, "ClaimUpdated", 'should be ClaimUpdated');
        assert.strictEqual(web3.toUtf8(txResult.logs[0].args.hash), dualHash3, 'should be dualHash3' );
        assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.Received, 'should be Received' );
    });

    it('Change to DeletionConfirmation by receiver2', async() => {
        txResult = await Claim.receiverUpdateClaim(dualHash3, Status.DeletionConfirmation, {from: receiver2});
        subjectStatus = await Claim.subjectClaimStatus.call(subject2, dataHash3);
        receiverStatus = await Claim.receiverClaimStatus.call(receiver2, dualHash3);
        ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
        ClaimList = await Claim.subjectClaimList({from: subject2});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(ClaimStatus.toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(ClaimList[0].toNumber(), 10, 'should be 10');
        assert.strictEqual(web3.toUtf8(ClaimList[1][9]), dataHash3, 'should be dataHash3');
        assert.strictEqual(txResult.logs.length, 1, 'should be 1');
        assert.strictEqual(txResult.logs[0].event, "ClaimUpdated", 'should be ClaimUpdated');
        assert.strictEqual(web3.toUtf8(txResult.logs[0].args.hash), dualHash3, 'should be dualHash3' );
        assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation' );
    });

    it('Change back to Valid by subject2, no change', async() => {
        txResult = await Claim.subjectUpdateClaim(dataHash3, Status.Valid, {from: subject2});
        subjectStatus = await Claim.subjectClaimStatus.call(subject2, dataHash3);
        receiverStatus = await Claim.receiverClaimStatus.call(receiver2, dualHash3);
        ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
        ClaimList = await Claim.subjectClaimList({from: subject2});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(ClaimStatus.toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(ClaimList[0].toNumber(), 10, 'should be 10');
        assert.strictEqual(web3.toUtf8(ClaimList[1][9]), dataHash3, 'should be dataHash3');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
      });

    it('Change Back to Received by receiver2, no change', async() => {
        txResult = await Claim.receiverUpdateClaim(dualHash3, Status.Received, {from: receiver2});
        subjectStatus = await Claim.subjectClaimStatus.call(subject2, dataHash3);
        receiverStatus = await Claim.receiverClaimStatus.call(receiver2, dualHash3);
        ClaimStatus = await Claim.claimStatus(subjectStatus[1], receiverStatus[1]);
        ClaimList = await Claim.subjectClaimList({from: subject2});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(ClaimStatus.toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(ClaimList[0].toNumber(), 10, 'should be 10');
        assert.strictEqual(web3.toUtf8(ClaimList[1][9]), dataHash3, 'should be dataHash3');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
    });

})
