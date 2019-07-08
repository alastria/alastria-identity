"use strict";
var AlastriaPresentationRegistry = artifacts.require('./AlastriaPresentationRegistry.sol');


contract('AlastriaPresentationRegistry', (accounts) => {
    let Presentation;

    let subject1 = accounts[0];
    let subject2 = accounts[1];
    let receiver1 = accounts[2];
    let receiver2 = accounts[3];

    var verboseLevel = 1;

    var Presentation1 = "Presentation1";
    var Presentation2 = "Presentation2";
    var Presentation3 = "Presentation2";
    var Presentation4 = "Presentation4";

    var subjectPresentationHash1 = "subjectPresentationHash1"; // Should be web3.eth.abi.encodeParameter("bytes32",web3.utils.soliditySha3(Presentation1));
    var subjectPresentationHash2 = "subjectPresentationHash2"; // but readable strings make life easier.
    var subjectPresentationHash3 = "subjectPresentationHash3";
    var subjectPresentationHash4 = "subjectPresentationHash4";

    var signature1 = "signature1"; // Should be the signature of Presentation1
    var signature2 = "signature2";
    var signature3 = "signature3";
    var signature4 = "signature4";

    var receiverPresentationHash1 = "receiverPresentationHash1"; // Should be web3.eth.abi.encodeParameter("bytes32",web3-utils.soliditySha3(subjectPresentationHash1 + signature1))
    var receiverPresentationHash2 = "receiverPresentationHash2";
    var receiverPresentationHash3 = "receiverPresentationHash3";
    var receiverPresentationHash4 = "receiverPresentationHash4";
    var receiverPresentationHash

    // Return Variables from Solidity Smart Contract
    var txResult;
    var subjectStatus;
    var receiverStatus;
    var presentationStatus;
    var presentationList;

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
            console.log("Presentation status: " + getPresentationStatus);
            /* console.log("AttList    : ", PresentationList) */
            /* Detailed PresentationList one by one in UTF8 */
            attString = presentationList[0];
            for (i = 0; i < presentationList[0]; i++) {
                attString = attString + ", " + web3.toUtf8(presentationList[1][i]);
            }
            console.log("PresentationList   : ", attString);

            for (i = 0; i < txResult.logs.length; i++) {
                console.log("Event       : " + txResult.logs[i].event, "args: " +
                web3.toUtf8(txResult.logs[i].args.hash) + ", " + txResult.logs[i].args.status);
            }
        }
    }

    function log (verbosity, message) {
        if (verbosity <= verboseLevel) {
            console.log(message);
        }
    }

    it('Creates AlastriaPresentationRegistry correctly', async() => {
        Presentation = await AlastriaPresentationRegistry.deployed();
        const version = await Presentation.version();
        const previousVersion = await Presentation.previousPublishedVersion();

        assert.equal(version.toNumber(), 3, 'The `version` must be `3`.');
        assert.equal(previousVersion, accounts[0], 'The contract was deployed for the 0 account.');
    });


    //Test Set 1: Subject1, Receiver1, subjectPresentationHash1, receiverPresentationHash1. One by one transitions
    it('Initial Set for Subject1,  subjectPresentationHash1', async() => {
        log(2, "");
        log(2, "Test Set 1: Subject1, Receiver1, subjectPresentationHash1, receiverPresentationHash1. One by one transitions");
        log(2, "Subject1  : "+subject1);
        log(2, "Receiver1 : "+receiver1);
        log(2, "subjectPresentationHash1 : "+subjectPresentationHash1);
        log(2, "receiverPresentationHash1 : "+receiverPresentationHash1);
        log(2, "");

        txResult = await Presentation.addSubjectPresentation(subjectPresentationHash1, "Direccion1", {from: subject1});
        subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject1, subjectPresentationHash1);
        receiverStatus =  await Presentation.getReceiverPresentationStatus.call(receiver1, receiverPresentationHash1);
        presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
        presentationList = await Presentation.getSubjectPresentationList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(receiverStatus[0], false, 'should not exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(presentationStatus.toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(presentationList[0].toNumber(), 1, 'should be 1');
        assert.strictEqual(web3.toUtf8(presentationList[1][0]), subjectPresentationHash1, 'should be subjectPresentationHash1');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
    });

    it('Second equal Set for Subject1, subjectPresentationHash1, will fail & revert', async() => {
        try {
            txResult = await Presentation.addSubjectPresentation(subjectPresentationHash1, "Direccion1", {from:subject1});
            log(2, "");
            assert (false, "ERROR: Expected exception not raised");
            log(2, "");
        } catch (error) {
            log(2, "");
            log(2, "Expected exception caught:" + error);
            log(2, "Check nothing changed.");
            log(2, "");

            subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject1, subjectPresentationHash1);
            receiverStatus = await Presentation.getReceiverPresentationStatus.call(receiver1, receiverPresentationHash1);
            presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
            presentationList = await Presentation.getSubjectPresentationList({from: subject1});
            logStatus(2);

            assert.strictEqual(subjectStatus[0], true, 'should exist');
            assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(receiverStatus[0], false, 'should not exist');
            assert.strictEqual(receiverStatus[1].toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(presentationStatus.toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(presentationList[0].toNumber(), 1, 'should be 1');
            assert.strictEqual(web3.toUtf8(presentationList[1][0]), subjectPresentationHash1, 'should be subjectPresentationHash1');
            assert.strictEqual(txResult.logs.length, 0, 'should be 0');
        }
    });

    it('Change to invalid Status by subject1, will fail & revert', async() => {
        try {
            txResult = await Presentation.updateSubjectPresentation(subjectPresentationHash1, 10, {from: subject1});
            log(2, "");
            assert (false, "ERROR: Expected exception not raised.");
            log(2, "");
        } catch (error) {
            log(2, "");
            log(2, "Expected exception caught:" + error);
            log(2, "Check nothing changed.");
            log(2, "");
            subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject1, subjectPresentationHash1);
            receiverStatus = await Presentation.getReceiverPresentationStatus.call(receiver1, receiverPresentationHash1);
            presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
            presentationList = await Presentation.getSubjectPresentationList({from: subject1});
            logStatus(2);

            assert.strictEqual(subjectStatus[0], true, 'should exist');
            assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(receiverStatus[0], false, 'should not exist');
            assert.strictEqual(receiverStatus[1].toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(presentationStatus.toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(presentationList[0].toNumber(), 1, 'should be 1');
            assert.strictEqual(web3.toUtf8(presentationList[1][0]), subjectPresentationHash1, 'should be subjectPresentationHash1');
            assert.strictEqual(txResult.logs.length, 0, 'should be 0');
        }
    });

    it('Change to invalid Status by Receiver1, will fail & revert', async() => {
        try {
            txResult = await Presentation.updateReceiverPresentation(receiverPresentationHash1, 10, {from: receiver1});
            log(2, "");
            assert (false, "ERROR: Expected exception not raised.");
            log(2, "");
        } catch (error) {
            log(2, "");
            log(2, "Expected exception caught:" + error);
            log(2, "Check nothing changed.");
            log(2, "");
            subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject1, subjectPresentationHash1);
            receiverStatus = await Presentation.getReceiverPresentationStatus.call(receiver1, receiverPresentationHash1);
            presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
            presentationList = await Presentation.getSubjectPresentationList({from: subject1});
            logStatus(2);

            assert.strictEqual(subjectStatus[0], true, 'should exist');
            assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(receiverStatus[0], false, 'should not exist');
            assert.strictEqual(receiverStatus[1].toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(presentationStatus.toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(presentationList[0].toNumber(), 1, 'should be 1');
            assert.strictEqual(web3.toUtf8(presentationList[1][0]), subjectPresentationHash1, 'should be subjectPresentationHash1');
            assert.strictEqual(txResult.logs.length, 0, 'should be 0');
        }
    });

    it('Change to AskDeletion by Receiver1, no change', async() => {
        txResult = await Presentation.updateReceiverPresentation(receiverPresentationHash1, Status.AskDeletion, {from: receiver1});
        subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject1, subjectPresentationHash1);
        receiverStatus = await Presentation.getReceiverPresentationStatus.call(receiver1, receiverPresentationHash1);
        presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
        presentationList = await Presentation.getSubjectPresentationList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(receiverStatus[0], false, 'should not exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(presentationStatus.toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(presentationList[0].toNumber(), 1, 'should be 1');
        assert.strictEqual(web3.toUtf8(presentationList[1][0]), subjectPresentationHash1, 'should be subjectPresentationHash1');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');

    });

    it('Change to Received by Subject1, no change', async() => {
        txResult = await Presentation.updateSubjectPresentation(subjectPresentationHash1, Status.Received, {from: subject1});
        subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject1, subjectPresentationHash1);
        receiverStatus = await Presentation.getReceiverPresentationStatus.call(receiver1, receiverPresentationHash1);
        presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
        presentationList = await Presentation.getSubjectPresentationList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(receiverStatus[0], false, 'should not exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(presentationStatus.toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(presentationList[0].toNumber(), 1, 'should be 1');
        assert.strictEqual(web3.toUtf8(presentationList[1][0]), subjectPresentationHash1, 'should be subjectPresentationHash1');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
    })

    it('Change to Received by Receiver1', async() => {
        txResult = await Presentation.updateReceiverPresentation(receiverPresentationHash1, Status.Received, {from: receiver1});
        subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject1, subjectPresentationHash1);
        receiverStatus = await Presentation.getReceiverPresentationStatus.call(receiver1, receiverPresentationHash1);
        presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
        presentationList = await Presentation.getSubjectPresentationList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Received, 'should be Received');
        assert.strictEqual(presentationStatus.toNumber(), Status.Received, 'should be Received');
        assert.strictEqual(presentationList[0].toNumber(), 1, 'should be 1');
        assert.strictEqual(web3.toUtf8(presentationList[1][0]), subjectPresentationHash1, 'should be subjectPresentationHash1');
        assert.strictEqual(txResult.logs.length, 1, 'should be 1');
        assert.strictEqual(txResult.logs[0].event, "PresentationUpdated", 'should be PresentationUpdated');
        assert.strictEqual(web3.toUtf8(txResult.logs[0].args.hash), receiverPresentationHash1, 'should be receiverPresentationHash1' );
        assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.Received, 'should be Received' );
    })

    it('Change to AskDeletion by subject1', async() => {
        txResult = await Presentation.updateSubjectPresentation(subjectPresentationHash1, Status.AskDeletion, {from: subject1});
        subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject1, subjectPresentationHash1);
        receiverStatus = await Presentation.getReceiverPresentationStatus.call(receiver1, receiverPresentationHash1);
        presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
        presentationList = await Presentation.getSubjectPresentationList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Received, 'should be Valid');
        assert.strictEqual(presentationStatus.toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(presentationList[0].toNumber(), 1, 'should be 1');
        assert.strictEqual(web3.toUtf8(presentationList[1][0]), subjectPresentationHash1, 'should be subjectPresentationHash1');
        assert.strictEqual(txResult.logs.length, 1, 'should be 1');
        assert.strictEqual(txResult.logs[0].event, "PresentationUpdated", 'should be PresentationUpdated');
        assert.strictEqual(web3.toUtf8(txResult.logs[0].args.hash), subjectPresentationHash1, 'should be subjectPresentationHash1' );
        assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.AskDeletion, 'should be AskDeletion' );
    });

    it('Change back to Valid by subject1, no change', async() => {
        txResult = await Presentation.updateSubjectPresentation(subjectPresentationHash1, Status.Valid, {from: subject1});
        subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject1, subjectPresentationHash1);
        receiverStatus = await Presentation.getReceiverPresentationStatus.call(receiver1, receiverPresentationHash1);
        presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
        presentationList = await Presentation.getSubjectPresentationList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Received, 'should be Received');
        assert.strictEqual(presentationStatus.toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(presentationList[0].toNumber(), 1, 'should be 1');
        assert.strictEqual(web3.toUtf8(presentationList[1][0]), subjectPresentationHash1, 'should be subjectPresentationHash1');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
    });

    it('Change again to Received by Receiver1, no change', async() => {
        txResult = await Presentation.updateReceiverPresentation(receiverPresentationHash1, Status.Received, {from: receiver1});
        subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject1, subjectPresentationHash1);
        receiverStatus = await Presentation.getReceiverPresentationStatus.call(receiver1, receiverPresentationHash1);
        presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
        presentationList = await Presentation.getSubjectPresentationList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Received, 'should be Received');
        assert.strictEqual(presentationStatus.toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(presentationList[0].toNumber(), 1, 'should be 1');
        assert.strictEqual(web3.toUtf8(presentationList[1][0]), subjectPresentationHash1, 'should be subjectPresentationHash1');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
    });

    it('Change to DeletionConfirmation by Receiver1', async() => {
        txResult = await Presentation.updateReceiverPresentation(receiverPresentationHash1, Status.DeletionConfirmation, {from: receiver1});
        subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject1, subjectPresentationHash1);
        receiverStatus = await Presentation.getReceiverPresentationStatus.call(receiver1, receiverPresentationHash1);
        presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
        presentationList = await Presentation.getSubjectPresentationList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(presentationStatus.toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(presentationList[0].toNumber(), 1, 'should be 1');
        assert.strictEqual(web3.toUtf8(presentationList[1][0]), subjectPresentationHash1, 'should be subjectPresentationHash1');
        assert.strictEqual(txResult.logs.length, 1, 'should be 1');
        assert.strictEqual(txResult.logs[0].event, "PresentationUpdated", 'should be PresentationUpdated');
        assert.strictEqual(web3.toUtf8(txResult.logs[0].args.hash), receiverPresentationHash1, 'should be receiverPresentationHash1' );
        assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation' );
    });

    it('Change back to Valid by subject1, no change', async() => {
        txResult = await Presentation.updateSubjectPresentation(subjectPresentationHash1, Status.Valid, {from: subject1});
        subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject1, subjectPresentationHash1);
        receiverStatus = await Presentation.getReceiverPresentationStatus.call(receiver1, receiverPresentationHash1);
        presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
        presentationList = await Presentation.getSubjectPresentationList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(presentationStatus.toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(presentationList[0].toNumber(), 1, 'should be 1');
        assert.strictEqual(web3.toUtf8(presentationList[1][0]), subjectPresentationHash1, 'should be subjectPresentationHash1');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
      });

    it('Change Back to Received by Receiver1, no change', async() => {
        txResult = await Presentation.updateReceiverPresentation(receiverPresentationHash1, Status.Received, {from: receiver1});
        subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject1, subjectPresentationHash1);
        receiverStatus = await Presentation.getReceiverPresentationStatus.call(receiver1, receiverPresentationHash1);
        presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
        presentationList = await Presentation.getSubjectPresentationList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(presentationStatus.toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(presentationList[0].toNumber(), 1, 'should be 1');
        assert.strictEqual(web3.toUtf8(presentationList[1][0]), subjectPresentationHash1, 'should be subjectPresentationHash1');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
    });


//Set 2: Subject1, Receiver2, subjectPresentationHash2, receiverPresentationHash2. One by one transitions
    it('Initial Set for subject1,  subjectPresentationHash2', async() => {
        log(2, "");
        log(2, "Test Set 2: subject1, receiver2, subjectPresentationHash2, receiverPresentationHash2. One by one transitions");
        log(2, "subject1  : "+subject1);
        log(2, "receiver2 : "+receiver2);
        log(2, "subjectPresentationHash2 : "+subjectPresentationHash2);
        log(2, "receiverPresentationHash2 : "+receiverPresentationHash2);
        log(2, "");

        txResult = await Presentation.addSubjectPresentation(subjectPresentationHash2, "Direccion2", {from: subject1});
        subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject1, subjectPresentationHash2);
        receiverStatus =  await Presentation.getReceiverPresentationStatus.call(receiver1, receiverPresentationHash2);
        presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
        presentationList = await Presentation.getSubjectPresentationList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(receiverStatus[0], false, 'should not exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(presentationStatus.toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(presentationList[0].toNumber(), 2, 'should be 2');
        assert.strictEqual(web3.toUtf8(presentationList[1][1]), subjectPresentationHash2, 'should be subjectPresentationHash2');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
    });

    it('Second equal Set for Subject1, subjectPresentationHash2, will fail & revert', async() => {
        try {
            txResult = await Presentation.addSubjectPresentation(subjectPresentationHash2, "Direccion2", {from:subject1});
            log(2, "");
            assert (false, "ERROR: Expected exception not raised");
            log(2, "");
        } catch (error) {
            log(2, "");
            log(2, "Expected exception caught:" + error);
            log(2, "Check nothing changed.");
            log(2, "");

            subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject1, subjectPresentationHash2);
            receiverStatus = await Presentation.getReceiverPresentationStatus.call(receiver1, receiverPresentationHash2);
            presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
            presentationList = await Presentation.getSubjectPresentationList({from: subject1});
            logStatus(2);

            assert.strictEqual(subjectStatus[0], true, 'should exist');
            assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(receiverStatus[0], false, 'should not exist');
            assert.strictEqual(receiverStatus[1].toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(presentationStatus.toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(presentationList[0].toNumber(), 2, 'should be 2');
            assert.strictEqual(web3.toUtf8(presentationList[1][1]), subjectPresentationHash2, 'should be subjectPresentationHash2');
            assert.strictEqual(txResult.logs.length, 0, 'should be 0');
        }
    });

    it('Change to invalid Status by subject1, will fail & revert', async() => {
        try {
            txResult = await Presentation.updateSubjectPresentation(subjectPresentationHash2, 10, {from: subject1});
            log(2, "");
            assert (false, "ERROR: Expected exception not raised.");
            log(2, "");
        } catch (error) {
            log(2, "");
            log(2, "Expected exception caught:" + error);
            log(2, "Check nothing changed.");
            log(2, "");
            subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject1, subjectPresentationHash2);
            receiverStatus = await Presentation.getReceiverPresentationStatus.call(receiver1, receiverPresentationHash2);
            presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
            presentationList = await Presentation.getSubjectPresentationList({from: subject1});
            logStatus(2);

            assert.strictEqual(subjectStatus[0], true, 'should exist');
            assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(receiverStatus[0], false, 'should not exist');
            assert.strictEqual(receiverStatus[1].toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(presentationStatus.toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(presentationList[0].toNumber(), 2, 'should be 2');
            assert.strictEqual(web3.toUtf8(presentationList[1][1]), subjectPresentationHash2, 'should be subjectPresentationHash2');
            assert.strictEqual(txResult.logs.length, 0, 'should be 0');
        }
    });

    it('Change to invalid Status by Receiver1, will fail & revert', async() => {
        try {
            txResult = await Presentation.updateReceiverPresentation(receiverPresentationHash2, 10, {from: receiver1});
            log(2, "");
            assert (false, "ERROR: Expected exception not raised.");
            log(2, "");
        } catch (error) {
            log(2, "");
            log(2, "Expected exception caught:" + error);
            log(2, "Check nothing changed.");
            log(2, "");
            subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject1, subjectPresentationHash2);
            receiverStatus = await Presentation.getReceiverPresentationStatus.call(receiver1, receiverPresentationHash2);
            presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
            presentationList = await Presentation.getSubjectPresentationList({from: subject1});
            logStatus(2);

            assert.strictEqual(subjectStatus[0], true, 'should exist');
            assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(receiverStatus[0], false, 'should not exist');
            assert.strictEqual(receiverStatus[1].toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(presentationStatus.toNumber(), Status.Valid, 'should be valid');
            assert.strictEqual(presentationList[0].toNumber(), 2, 'should be 2');
            assert.strictEqual(web3.toUtf8(presentationList[1][1]), subjectPresentationHash2, 'should be subjectPresentationHash2');
            assert.strictEqual(txResult.logs.length, 0, 'should be 0');
        }
    });

    it('Change to AskDeletion by Receiver1, no change', async() => {
        txResult = await Presentation.updateReceiverPresentation(receiverPresentationHash2, Status.AskDeletion, {from: receiver1});
        subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject1, subjectPresentationHash2);
        receiverStatus = await Presentation.getReceiverPresentationStatus.call(receiver1, receiverPresentationHash2);
        presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
        presentationList = await Presentation.getSubjectPresentationList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(receiverStatus[0], false, 'should not exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(presentationStatus.toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(presentationList[0].toNumber(), 2, 'should be 2');
        assert.strictEqual(web3.toUtf8(presentationList[1][1]), subjectPresentationHash2, 'should be subjectPresentationHash2');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');

    });

    it('Change to Received by Subject1, no change', async() => {
        txResult = await Presentation.updateSubjectPresentation(subjectPresentationHash2, Status.Received, {from: subject1});
        subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject1, subjectPresentationHash2);
        receiverStatus = await Presentation.getReceiverPresentationStatus.call(receiver1, receiverPresentationHash2);
        presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
        presentationList = await Presentation.getSubjectPresentationList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(receiverStatus[0], false, 'should not exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(presentationStatus.toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(presentationList[0].toNumber(), 2, 'should be 2');
        assert.strictEqual(web3.toUtf8(presentationList[1][1]), subjectPresentationHash2, 'should be subjectPresentationHash2');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
    });

    it('Change to Received by Receiver1', async() => {
        txResult = await Presentation.updateReceiverPresentation(receiverPresentationHash2, Status.Received, {from: receiver1});
        subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject1, subjectPresentationHash2);
        receiverStatus = await Presentation.getReceiverPresentationStatus.call(receiver1, receiverPresentationHash2);
        presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
        presentationList = await Presentation.getSubjectPresentationList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Received, 'should be Received');
        assert.strictEqual(presentationStatus.toNumber(), Status.Received, 'should be Received');
        assert.strictEqual(presentationList[0].toNumber(), 2, 'should be 2');
        assert.strictEqual(web3.toUtf8(presentationList[1][1]), subjectPresentationHash2, 'should be subjectPresentationHash2');
        assert.strictEqual(txResult.logs.length, 1, 'should be 1');
        assert.strictEqual(txResult.logs[0].event, "PresentationUpdated", 'should be PresentationUpdated');
        assert.strictEqual(web3.toUtf8(txResult.logs[0].args.hash), receiverPresentationHash2, 'should be receiverPresentationHash2' );
        assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.Received, 'should be Received' );
    });

    it('Change to AskDeletion by subject1', async() => {
        txResult = await Presentation.updateSubjectPresentation(subjectPresentationHash2, Status.AskDeletion, {from: subject1});
        subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject1, subjectPresentationHash2);
        receiverStatus = await Presentation.getReceiverPresentationStatus.call(receiver1, receiverPresentationHash2);
        presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
        presentationList = await Presentation.getSubjectPresentationList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Received, 'should be Valid');
        assert.strictEqual(presentationStatus.toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(presentationList[0].toNumber(), 2, 'should be 2');
        assert.strictEqual(web3.toUtf8(presentationList[1][1]), subjectPresentationHash2, 'should be subjectPresentationHash2');
        assert.strictEqual(txResult.logs.length, 1, 'should be 1');
        assert.strictEqual(txResult.logs[0].event, "PresentationUpdated", 'should be PresentationUpdated');
        assert.strictEqual(web3.toUtf8(txResult.logs[0].args.hash), subjectPresentationHash2, 'should be subjectPresentationHash2' );
        assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.AskDeletion, 'should be AskDeletion' );
    });

    it('Change back to Valid by subject1, no change', async() => {
        txResult = await Presentation.updateSubjectPresentation(subjectPresentationHash2, Status.Valid, {from: subject1});
        subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject1, subjectPresentationHash2);
        receiverStatus = await Presentation.getReceiverPresentationStatus.call(receiver1, receiverPresentationHash2);
        presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
        presentationList = await Presentation.getSubjectPresentationList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Received, 'should be Received');
        assert.strictEqual(presentationStatus.toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(presentationList[0].toNumber(), 2, 'should be 2');
        assert.strictEqual(web3.toUtf8(presentationList[1][1]), subjectPresentationHash2, 'should be subjectPresentationHash2');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
    });

    it('Change again to Received by Receiver1, no change', async() => {
        txResult = await Presentation.updateReceiverPresentation(receiverPresentationHash2, Status.Received, {from: receiver1});
        subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject1, subjectPresentationHash2);
        receiverStatus = await Presentation.getReceiverPresentationStatus.call(receiver1, receiverPresentationHash2);
        presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
        presentationList = await Presentation.getSubjectPresentationList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Received, 'should be Received');
        assert.strictEqual(presentationStatus.toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(presentationList[0].toNumber(), 2, 'should be 2');
        assert.strictEqual(web3.toUtf8(presentationList[1][1]), subjectPresentationHash2, 'should be subjectPresentationHash2');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
    });

    it('Change to DeletionConfirmation by Receiver1', async() => {
        txResult = await Presentation.updateReceiverPresentation(receiverPresentationHash2, Status.DeletionConfirmation, {from: receiver1});
        subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject1, subjectPresentationHash2);
        receiverStatus = await Presentation.getReceiverPresentationStatus.call(receiver1, receiverPresentationHash2);
        presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
        presentationList = await Presentation.getSubjectPresentationList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(presentationStatus.toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(presentationList[0].toNumber(), 2, 'should be 2');
        assert.strictEqual(web3.toUtf8(presentationList[1][1]), subjectPresentationHash2, 'should be subjectPresentationHash2');
        assert.strictEqual(txResult.logs.length, 1, 'should be 1');
        assert.strictEqual(txResult.logs[0].event, "PresentationUpdated", 'should be PresentationUpdated');
        assert.strictEqual(web3.toUtf8(txResult.logs[0].args.hash), receiverPresentationHash2, 'should be receiverPresentationHash2' );
        assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation' );
    });

    it('Change back to Valid by subject1, no change', async() => {
        txResult = await Presentation.updateSubjectPresentation(subjectPresentationHash2, Status.Valid, {from: subject1});
        subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject1, subjectPresentationHash2);
        receiverStatus = await Presentation.getReceiverPresentationStatus.call(receiver1, receiverPresentationHash2);
        presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
        presentationList = await Presentation.getSubjectPresentationList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(presentationStatus.toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(presentationList[0].toNumber(), 2, 'should be 2');
        assert.strictEqual(web3.toUtf8(presentationList[1][1]), subjectPresentationHash2, 'should be subjectPresentationHash2');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
      });

    it('Change Back to Received by Receiver1, no change', async() => {
        txResult = await Presentation.updateReceiverPresentation(receiverPresentationHash2, Status.Received, {from: receiver1});
        subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject1, subjectPresentationHash2);
        receiverStatus = await Presentation.getReceiverPresentationStatus.call(receiver1, receiverPresentationHash2);
        presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
        presentationList = await Presentation.getSubjectPresentationList({from: subject1});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(presentationStatus.toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(presentationList[0].toNumber(), 2, 'should be 2');
        assert.strictEqual(web3.toUtf8(presentationList[1][1]), subjectPresentationHash2, 'should be subjectPresentationHash2');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
    });


    //Test Set 3: Subject2, Receiver2, subjectPresentationHash3, receiverPresentationHash3. Direct jump to Revoked and backtransitions
    it('Update before Set for subject2,  subjectPresentationHash3', async() => {
        log(2, "");
        log(2, "Test Set 3: Subject2, Receiver2, subjectPresentationHash3, receiverPresentationHash3.");
        log(2, "Test Set 3: Many Hashes in the middle. Direct Jump to AskDeletion");
        log(2, "subject2  : "+subject2);
        log(2, "receiver2 : "+receiver2);
        log(2, "subjectPresentationHash3 : "+subjectPresentationHash3);
        log(2, "receiverPresentationHash3 : "+receiverPresentationHash3);
        log(2, "");

        txResult = await Presentation.updateSubjectPresentation(subjectPresentationHash3, Status.Valid, {from: subject2});
        subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject2, subjectPresentationHash3);
        receiverStatus = await Presentation.getReceiverPresentationStatus.call(receiver2, receiverPresentationHash3);
        presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
        presentationList = await Presentation.getSubjectPresentationList({from: subject2});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], false, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid');
        assert.strictEqual(receiverStatus[0], false, 'should not exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(presentationStatus.toNumber(), Status.Valid, 'should be Valid');
        assert.strictEqual(presentationList[0].toNumber(), 0, 'should be 0');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
    });

    it('Initial Set for subject2,  subjectPresentationHash3', async() => {
        txResult = await Presentation.addSubjectPresentation("MiddH1", "MidDireccion1", {from: subject2})
        txResult = await Presentation.addSubjectPresentation("MiddH2", "MidDireccion2", {from: subject2})
        txResult = await Presentation.addSubjectPresentation("MiddH3", "MidDireccion3", {from: subject2})
        txResult = await Presentation.addSubjectPresentation("MiddH4", "MidDireccion4", {from: subject2})
        txResult = await Presentation.addSubjectPresentation("MiddH5", "MidDireccion5", {from: subject2})
        txResult = await Presentation.addSubjectPresentation("MiddH6", "MidDireccion6", {from: subject2})
        txResult = await Presentation.addSubjectPresentation("MiddH7", "MidDireccion7", {from: subject2})
        txResult = await Presentation.addSubjectPresentation("MiddH8", "MidDireccion8", {from: subject2})
        txResult = await Presentation.addSubjectPresentation("MiddH9", "MidDireccion9", {from: subject2})

        txResult = await Presentation.addSubjectPresentation(subjectPresentationHash3, "Direccion3", {from: subject2});
        subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject2, subjectPresentationHash3);
        receiverStatus =  await Presentation.getReceiverPresentationStatus.call(receiver2, receiverPresentationHash3);
        presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
        presentationList = await Presentation.getSubjectPresentationList({from: subject2});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(receiverStatus[0], false, 'should not exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(presentationStatus.toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(presentationList[0].toNumber(), 10, 'should be 10');
        assert.strictEqual(web3.toUtf8(presentationList[1][9]), subjectPresentationHash3, 'should be subjectPresentationHash3');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
    });

    it('Change to AskDeletion by subject2', async() => {
        txResult = await Presentation.updateSubjectPresentation(subjectPresentationHash3, Status.AskDeletion, {from: subject2});
        subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject2, subjectPresentationHash3);
        receiverStatus = await Presentation.getReceiverPresentationStatus.call(receiver2, receiverPresentationHash3);
        presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
        presentationList = await Presentation.getSubjectPresentationList({from: subject2});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], false, 'should not exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(presentationStatus.toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(presentationList[0].toNumber(), 10, 'should be 10');
        assert.strictEqual(web3.toUtf8(presentationList[1][9]), subjectPresentationHash3, 'should be subjectPresentationHash3');
        assert.strictEqual(txResult.logs.length, 1, 'should be 1');
        assert.strictEqual(txResult.logs[0].event, "PresentationUpdated", 'should be PresentationUpdated');
        assert.strictEqual(web3.toUtf8(txResult.logs[0].args.hash), subjectPresentationHash3, 'should be subjectPresentationHash3' );
        assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.AskDeletion, 'should be AskDeletion' );
    });

    it('Change back to Valid by subject2, no change', async() => {
        txResult = await Presentation.updateSubjectPresentation(subjectPresentationHash3, Status.Valid, {from: subject2});
        subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject2, subjectPresentationHash3);
        receiverStatus = await Presentation.getReceiverPresentationStatus.call(receiver2, receiverPresentationHash3);
        presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
        presentationList = await Presentation.getSubjectPresentationList({from: subject2});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], false, 'should not exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Valid, 'should be valid');
        assert.strictEqual(presentationStatus.toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(presentationList[0].toNumber(), 10, 'should be 10');
        assert.strictEqual(web3.toUtf8(presentationList[1][9]), subjectPresentationHash3, 'should be subjectPresentationHash3');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
    });

    it('Change to Received by receiver2', async() => {
        txResult = await Presentation.updateReceiverPresentation(receiverPresentationHash3, Status.Received, {from: receiver2});
        subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject2, subjectPresentationHash3);
        receiverStatus = await Presentation.getReceiverPresentationStatus.call(receiver2, receiverPresentationHash3);
        presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
        presentationList = await Presentation.getSubjectPresentationList({from: subject2});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.Received, 'should be Received');
        assert.strictEqual(presentationStatus.toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(presentationList[0].toNumber(), 10, 'should be 10');
        assert.strictEqual(web3.toUtf8(presentationList[1][9]), subjectPresentationHash3, 'should be subjectPresentationHash3');
        assert.strictEqual(txResult.logs.length, 1, 'should be 1');
        assert.strictEqual(txResult.logs[0].event, "PresentationUpdated", 'should be PresentationUpdated');
        assert.strictEqual(web3.toUtf8(txResult.logs[0].args.hash), receiverPresentationHash3, 'should be receiverPresentationHash3' );
        assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.Received, 'should be Received' );
    });

    it('Change to DeletionConfirmation by receiver2', async() => {
        txResult = await Presentation.updateReceiverPresentation(receiverPresentationHash3, Status.DeletionConfirmation, {from: receiver2});
        subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject2, subjectPresentationHash3);
        receiverStatus = await Presentation.getReceiverPresentationStatus.call(receiver2, receiverPresentationHash3);
        presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
        presentationList = await Presentation.getSubjectPresentationList({from: subject2});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(presentationStatus.toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(presentationList[0].toNumber(), 10, 'should be 10');
        assert.strictEqual(web3.toUtf8(presentationList[1][9]), subjectPresentationHash3, 'should be subjectPresentationHash3');
        assert.strictEqual(txResult.logs.length, 1, 'should be 1');
        assert.strictEqual(txResult.logs[0].event, "PresentationUpdated", 'should be PresentationUpdated');
        assert.strictEqual(web3.toUtf8(txResult.logs[0].args.hash), receiverPresentationHash3, 'should be receiverPresentationHash3' );
        assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation' );
    });

    it('Change back to Valid by subject2, no change', async() => {
        txResult = await Presentation.updateSubjectPresentation(subjectPresentationHash3, Status.Valid, {from: subject2});
        subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject2, subjectPresentationHash3);
        receiverStatus = await Presentation.getReceiverPresentationStatus.call(receiver2, receiverPresentationHash3);
        presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
        presentationList = await Presentation.getSubjectPresentationList({from: subject2});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(presentationStatus.toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(presentationList[0].toNumber(), 10, 'should be 10');
        assert.strictEqual(web3.toUtf8(presentationList[1][9]), subjectPresentationHash3, 'should be subjectPresentationHash3');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
      });

    it('Change Back to Received by receiver2, no change', async() => {
        txResult = await Presentation.updateReceiverPresentation(receiverPresentationHash3, Status.Received, {from: receiver2});
        subjectStatus = await Presentation.getSubjectPresentationStatus.call(subject2, subjectPresentationHash3);
        receiverStatus = await Presentation.getReceiverPresentationStatus.call(receiver2, receiverPresentationHash3);
        presentationStatus = await Presentation.getPresentationStatus(subjectStatus[1], receiverStatus[1]);
        presentationList = await Presentation.getSubjectPresentationList({from: subject2});
        logStatus(2);

        assert.strictEqual(subjectStatus[0], true, 'should exist');
        assert.strictEqual(subjectStatus[1].toNumber(), Status.AskDeletion, 'should be AskDeletion');
        assert.strictEqual(receiverStatus[0], true, 'should exist');
        assert.strictEqual(receiverStatus[1].toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(presentationStatus.toNumber(), Status.DeletionConfirmation, 'should be DeletionConfirmation');
        assert.strictEqual(presentationList[0].toNumber(), 10, 'should be 10');
        assert.strictEqual(web3.toUtf8(presentationList[1][9]), subjectPresentationHash3, 'should be subjectPresentationHash3');
        assert.strictEqual(txResult.logs.length, 0, 'should be 0');
    });

})
