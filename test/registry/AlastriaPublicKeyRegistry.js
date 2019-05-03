"use strict";
var AlastriaPublicKeyRegistry = artifacts.require('./AlastriaPublicKeyRegistry.sol');


contract('AlastriaPublicKeyRegistry', (accounts) => {
  let PublicKey

  var verboseLevel = 1;

  let subject1 = accounts[0];
  let subject2 = accounts[1];
  let subject3 = accounts[2];
  let subject4 = accounts[3];

  var publicKey1 = "PublicKey1";  // Should be web3.eth.abi.encodeParameter("bytes32","WhatEver")º)

  var publicKey2 = "PublicKey2";
  var publicKey3 = "PublicKey2";
  var publicKey4 = "PublicKey4";


  // Return Variables from Solidity Smart Contract
  var currentPublicKey;
  var publicKeyStatus;
  var blockInfo;
  var previousBlockInfo;
  var txResult;


  //we can't reuse enum in solidity contract so status definition is duplicated here
  let Status = {
      "Valid": 0,
      "DeletedBySubject": 1
  }

  function logStatus (verbosity, description) {
    if (verbosity <= verboseLevel) {
      console.log("Test           : ", description);
      console.log("Now            : ", blockInfo.timestamp);
      console.log("currentKey     : ", web3.toUtf8(currentPublicKey), ", " , currentPublicKey);
      console.log("publicKeyStatus: "+ publicKeyStatus);
      console.log("publicKeyStatus: ", publicKeyStatus[0], ", " , publicKeyStatus[1], ",", publicKeyStatus[2], ",", publicKeyStatus[3]);
    }
  };

  function log (verbosity, message) {
    if (verbosity <= verboseLevel) {
      console.log(message);
    }
  }

  before(done => {
    done();
  });

  it('Creates AlastriaPublicKeyRegistry correctly', async() => {
    PublicKey = await AlastriaPublicKeyRegistry.deployed();
    const version = await PublicKey.version();
    const previousVersion = await PublicKey.previousPublishedVersion();

    assert.equal(version.toNumber(), 3, 'The `version` must be `3`.');
    assert.equal(previousVersion, accounts[0], 'The contract was deployed for the 0 account.');
  });


//Test Set 1: subject1, publicKey1, publicKey2
  it('Initial Set for subject1, publicKey1', done => {
    log(2,  "");
    log(2,  "Test Set 1: Subject1, PublicKey1, PublicKey2")
    log(2,  "Subject1  : ", subject1);
    log(2,  "publicKey1: ", publicKey1)
    log(2,  "publicKey2: ", publicKey2)
    log(2,  "");

    PublicKey.addKey(publicKey1, {from: subject1}).then(r => {
      txResult = r
      blockInfo = web3.eth.getBlock("latest")
      return PublicKey.getCurrentPublicKey.call(subject1)
    }).then(function(r) {
      currentPublicKey = r
      return PublicKey.getPublicKeyStatus.call(subject1, publicKey1)
    }).then(function(r) {
      publicKeyStatus = r

      logStatus (2, "Subject1")
      assert.strictEqual(web3.toUtf8(currentPublicKey), publicKey1, 'should be publicKey1')
      assert.strictEqual(publicKeyStatus[0], true, 'should exist')
      assert.strictEqual(publicKeyStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(publicKeyStatus[2].toNumber(), blockInfo.timestamp, 'should be now')
      assert.strictEqual(publicKeyStatus[3].toNumber(), 0, 'should be 0 notime')
      assert.strictEqual(txResult.logs.length, 0, 'should be 0')
      done()
    }).catch(done)

  })

  it('Second equal Set for subject1, PublicKey1, will fail & revert', done => {
    PublicKey.addKey(publicKey1, {from: subject1}).then(() => {
    log(2,  "")
    assert (false, "ERROR: Expected exception")
    log(2,  "")
    done()
    }).catch ( () => {
      log(2,  "")
      log(2,  "Expected exception caught, check nothing changed")
      log(2,  "")
      return PublicKey.getCurrentPublicKey.call(subject1)
      .then(function(r) {
        currentPublicKey = r
        return PublicKey.getPublicKeyStatus.call(subject1, publicKey1)
      }).then(function(r) {
        publicKeyStatus = r

        logStatus (2, "")
        assert.strictEqual(web3.toUtf8(currentPublicKey), publicKey1, 'should be publicKey1')
        assert.strictEqual(publicKeyStatus[0], true, 'should exist')
        assert.strictEqual(publicKeyStatus[1].toNumber(), Status.Valid, 'should be valid')
        assert.strictEqual(publicKeyStatus[2].toNumber(), blockInfo.timestamp, 'should be now')
        assert.strictEqual(publicKeyStatus[3].toNumber(), 0, 'should be 0 notime')

        done()
        })
    }).catch(done)
  })

  it('Set for subject1, publicKey2; publicKey1 implicitly revoked', done => {
    previousBlockInfo = blockInfo
    PublicKey.addKey(publicKey2, {from: subject1}).then(r => {
      txResult = r
      blockInfo = web3.eth.getBlock("latest")
      return PublicKey.getPublicKeyStatus.call(subject1, publicKey1)
    }).then(function(r) {
      publicKeyStatus = r
      logStatus (2, "pubkey 1 endDate updated to now")
      assert.strictEqual(publicKeyStatus[0], true, 'should exist')
      assert.strictEqual(publicKeyStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(publicKeyStatus[2].toNumber(), previousBlockInfo.timestamp, 'should be unchanged')
      assert.strictEqual(publicKeyStatus[3].toNumber(), blockInfo.timestamp, 'should be now')

      return PublicKey.getCurrentPublicKey.call(subject1)
    }).then(function(r) {
      currentPublicKey = r
      return PublicKey.getPublicKeyStatus.call(subject1, publicKey2)
    }).then(function(r) {
      publicKeyStatus = r

      logStatus (2, "pubKey2 created")
      assert.strictEqual(web3.toUtf8(currentPublicKey), publicKey2, 'should be publicKey2')
      assert.strictEqual(publicKeyStatus[0], true, 'should exist')
      assert.strictEqual(publicKeyStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(publicKeyStatus[2].toNumber(), blockInfo.timestamp, 'should be now')
      assert.strictEqual(publicKeyStatus[3].toNumber(), 0, 'should be 0 notime')
      assert.strictEqual(txResult.logs.length, 1, 'should be 1')
      assert.strictEqual(txResult.logs[0].event, "PublicKeyRevoked", 'should be PublicRevoked')
      assert.strictEqual(web3.toUtf8(txResult.logs[0].args.publicKey), publicKey1, 'should be publicKey1' )

      done()
    }).catch(done)
  })

  it('Delete subject1, publicKey1', done => {
    previousBlockInfo = blockInfo
    PublicKey.deletePublicKey(publicKey1, {from: subject1}).then(r => {
      txResult = r
      blockInfo = web3.eth.getBlock("latest")
      return PublicKey.getPublicKeyStatus.call(subject1, publicKey1)
    }).then(function(r) {
      publicKeyStatus = r
      logStatus (2, "pubkey 1 deleted")
      assert.strictEqual(publicKeyStatus[0], true, 'should exist')
      assert.strictEqual(publicKeyStatus[1].toNumber(), Status.DeletedBySubject, 'should be Deleted')
      assert.strictEqual(publicKeyStatus[3].toNumber(), blockInfo.timestamp, 'should be now')
      return PublicKey.getCurrentPublicKey.call(subject1)
    }).then(function(r) {
      currentPublicKey = r
      return PublicKey.getPublicKeyStatus.call(subject1, publicKey2)
    }).then(function(r) {
      publicKeyStatus = r
      logStatus (2, "pubKey2 no change")
      assert.strictEqual(web3.toUtf8(currentPublicKey), publicKey2, 'should be publicKey2')
      assert.strictEqual(publicKeyStatus[0], true, 'should exist')
      assert.strictEqual(publicKeyStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(publicKeyStatus[2].toNumber(), previousBlockInfo.timestamp, 'should be unchanged')
      assert.strictEqual(publicKeyStatus[3].toNumber(), 0, 'should be 0 notime')
      assert.strictEqual(txResult.logs.length, 1, 'should be 1')
      assert.strictEqual(txResult.logs[0].event, "PublicKeyDeleted", 'should be PublicKeyDeleted')
      assert.strictEqual(web3.toUtf8(txResult.logs[0].args.publicKey), publicKey1, 'should be publicKey1' )

      done()
    }).catch(done)
  })


  //Test Set 2: subject2, publicKey3, publicKey4
  it('Initial Set for subject2, publicKey3', done => {
    log(2,  "");
    log(2,  "Test Set 1: subject2, publicKey3, publicKey4")
    log(2,  "subject2  : ", subject2);
    log(2,  "publicKey3: ", publicKey3)
    log(2,  "publicKey4: ", publicKey4)
    log(2,  "");
    PublicKey.addKey(publicKey3, {from: subject2}).then(r => {
      txResult = r
      blockInfo = web3.eth.getBlock("latest")
      return PublicKey.getCurrentPublicKey.call(subject2)
    }).then(function(r) {
      currentPublicKey = r
      return PublicKey.getPublicKeyStatus.call(subject2, publicKey3)
    }).then(function(r) {
      publicKeyStatus = r

      logStatus (2, "subject2 publicKey3 created")
      assert.strictEqual(web3.toUtf8(currentPublicKey), publicKey3, 'should be publicKey3')
      assert.strictEqual(publicKeyStatus[0], true, 'should exist')
      assert.strictEqual(publicKeyStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(publicKeyStatus[2].toNumber(), blockInfo.timestamp, 'should be now')
      assert.strictEqual(publicKeyStatus[3].toNumber(), 0, 'should be 0 notime')

      done()
    }).catch(done)

  })

  it('Revoke subject2, publicKey3', done => {
    previousBlockInfo = blockInfo
    PublicKey.revokePublicKey(publicKey3, {from: subject2}).then(r => {
      txResult = r
      blockInfo = web3.eth.getBlock("latest")
      return PublicKey.getCurrentPublicKey.call(subject2)
    }).then(function(r) {
      currentPublicKey = r
      return PublicKey.getPublicKeyStatus.call(subject2, publicKey3)
    }).then(function(r) {
      publicKeyStatus = r
      logStatus (2, "pubkey 3 revoked, endDate updated")
      assert.strictEqual(web3.toUtf8(currentPublicKey), publicKey3, 'should be publicKey3')
      assert.strictEqual(publicKeyStatus[0], true, 'should exist')
      assert.strictEqual(publicKeyStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(publicKeyStatus[2].toNumber(), previousBlockInfo.timestamp, 'should be unchanged')
      assert.strictEqual(publicKeyStatus[3].toNumber(), blockInfo.timestamp, 'should be now')

      done()
    }).catch(done)
  })

  it('Set for subject2, publicKey4', done => {
    PublicKey.addKey(publicKey4, {from: subject2}).then(r => {
      txResult = r
      blockInfo = web3.eth.getBlock("latest")
      return PublicKey.getPublicKeyStatus.call(subject2, publicKey3)
    }).then(function(r) {
      publicKeyStatus = r
      logStatus (2, "pubkey 1 endDate updated")
      assert.strictEqual(publicKeyStatus[0], true, 'should exist')
      assert.strictEqual(publicKeyStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(publicKeyStatus[2].toNumber(), previousBlockInfo.timestamp, 'should be unchanged')
      assert.strictEqual(publicKeyStatus[3].toNumber(), blockInfo.timestamp, 'should be now')

      return PublicKey.getCurrentPublicKey.call(subject2)
    }).then(function(r) {
      currentPublicKey = r
      return PublicKey.getPublicKeyStatus.call(subject2, publicKey4)
    }).then(function(r) {
      publicKeyStatus = r

      logStatus (2, "pubKey2 created")
      assert.strictEqual(web3.toUtf8(currentPublicKey), publicKey4, 'should be publicKey4')
      assert.strictEqual(publicKeyStatus[0], true, 'should exist')
      assert.strictEqual(publicKeyStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(publicKeyStatus[2].toNumber(), blockInfo.timestamp, 'should be now')
      assert.strictEqual(publicKeyStatus[3].toNumber(), 0, 'should be 0 notime')

      done()
    }).catch(done)
  })

  it('Delete subject2, publicKey3', done => {
    previousBlockInfo = blockInfo
    PublicKey.deletePublicKey(publicKey3, {from: subject2}).then(r => {
      txResult = r
      blockInfo = web3.eth.getBlock("latest")

      return PublicKey.getPublicKeyStatus.call(subject2, publicKey3)
    }).then(function(r) {
      publicKeyStatus = r
      logStatus (2, "pubkey3 deleted")
      assert.strictEqual(publicKeyStatus[0], true, 'should exist')
      assert.strictEqual(publicKeyStatus[1].toNumber(), Status.DeletedBySubject, 'should be Deleted')
      assert.strictEqual(publicKeyStatus[3].toNumber(), blockInfo.timestamp, 'should be now')

      done()
    }).catch(done)
  })

  it('Revoke subject2, deleted publicKey3, no change', done => {
    previousBlockInfo = blockInfo
    PublicKey.revokePublicKey(publicKey3, {from: subject2}).then(r => {
      txResult = r
      blockInfo = web3.eth.getBlock("latest")
      return PublicKey.getCurrentPublicKey.call(subject2)
    }).then(function(r) {
      currentPublicKey = r
      return PublicKey.getPublicKeyStatus.call(subject2, publicKey3)
    }).then(function(r) {
      publicKeyStatus = r
      logStatus (2, "deleted pubkey3 revoked, no change")
      assert.strictEqual(web3.toUtf8(currentPublicKey), publicKey4, 'should be publicKey4')
      assert.strictEqual(publicKeyStatus[0], true, 'should exist')
      assert.strictEqual(publicKeyStatus[1].toNumber(), Status.DeletedBySubject, 'should be DeletedBySubject')
      assert.strictEqual(publicKeyStatus[3].toNumber(), previousBlockInfo.timestamp, 'should be previous')

      done()
    }).catch(done)
  })
})
