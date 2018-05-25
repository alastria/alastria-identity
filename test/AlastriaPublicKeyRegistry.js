"use strict";
var AlastriaPublicKeyRegistry = artifacts.require('./AlastriaPublicKeyRegistry.sol')
// var Web3Utils = artifacts.require('web3-utils') not available, use solidity function instead.

// To Do: Check previous times in a more consistent way


contract('AlastriaPublicKeyRegistry', function (accounts) {
  let PublicKey

  let subject1 = accounts[0]
  let subject2 = accounts[1]
  let subject3 = accounts[2]
  let subject4 = accounts[3]

  var publicKey1 = "PublicKey1"  // Should be web3.eth.abi.encodeParameter("bytes32","WhatEver"))  
  var publicKey2 = "PublicKey2"  
  var publicKey3 = "PublicKey2"  
  var publicKey4 = "PublicKey4"  
  

  // Return Variables from Solidity Smart Contract
  var currentPublicKey
  var publicKeyStatus
  var blockInfo
  var previousBlockInfo

  
  //we can't reuse enum in solidity contract so status definition is duplicated here
  let Status = {
      "Valid": 0,
      "DeletedBySubject": 1
  }
  
  function LogStatus(description) {
    console.log("Test           : ", description);
    console.log("Now            : ", blockInfo.timestamp);
    console.log("currentKey     : ", web3.toUtf8(currentPublicKey), ", " , currentPublicKey)
    console.log("publicKeyStatus: "+ publicKeyStatus)
    console.log("publicKeyStatus: ", publicKeyStatus[0], ", " , publicKeyStatus[1], ",", publicKeyStatus[2], ",", publicKeyStatus[3])
  }
  
  before(done => {
    done()
  })

  it('Creates AlastriaPublicKeyRegistry correctly', done => {
    let fakePrevVersion = accounts[3]
    AlastriaPublicKeyRegistry.new(fakePrevVersion, {from: accounts[0], gas: 3141592}).then(publicKey => {
      PublicKey = publicKey
      return PublicKey.version()
    }).then(version => {
      assert.equal(version.toNumber(), 3)
      return PublicKey.previousPublishedVersion()
    }).then(previousVersion => {
      assert.equal(previousVersion, fakePrevVersion)
      done()
    }).catch(done)
  })

  
//Test Set 1: subject1, publicKey1, publicKey2
  it('Initial Set for subject1, publicKey1', done => {
    console.log("");
    console.log("Test Set 1: Subject1, PublicKey1, PublicKey2")
    console.log("Subject1  : ", subject1);
    console.log("publicKey1: ", publicKey1)
    console.log("publicKey2: ", publicKey2)/**/
    console.log("");    
    PublicKey.set(publicKey1, {from: subject1}).then(() => {
      blockInfo = web3.eth.getBlock("latest")
      return PublicKey.currentPublicKey.call(subject1)
    }).then(function(r) {
      currentPublicKey = r
      return PublicKey.publicKeyStatus.call(subject1, publicKey1)
    }).then(function(r) {
      publicKeyStatus = r

      LogStatus("Subject1")
      assert.strictEqual(web3.toUtf8(currentPublicKey), publicKey1, 'should be publicKey1')
      assert.strictEqual(publicKeyStatus[0], true, 'should exist')
      assert.strictEqual(publicKeyStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(publicKeyStatus[2].toNumber(), blockInfo.timestamp, 'should be now')
      assert.strictEqual(publicKeyStatus[3].toNumber(), 0, 'should be 0 notime')

      done()      
    }).catch(done)
    
  })

  it('Second equal Set for subject1, PublicKey1, will fail & revert', done => {
    PublicKey.set(publicKey1, {from: subject1}).then(() => {
    console.log ("")
    assert (false, "ERROR: Expected exception")
    console.log ("")
    done()
    }).catch ( () => {
      console.log ("")
      console.log ("Expected exception caught, check nothing changed")
      console.log ("")
      return PublicKey.currentPublicKey.call(subject1)
      .then(function(r) {
        currentPublicKey = r
        return PublicKey.publicKeyStatus.call(subject1, publicKey1)
      }).then(function(r) {
        publicKeyStatus = r

        LogStatus("")
        assert.strictEqual(web3.toUtf8(currentPublicKey), publicKey1, 'should be publicKey1')
        assert.strictEqual(publicKeyStatus[0], true, 'should exist')
        assert.strictEqual(publicKeyStatus[1].toNumber(), Status.Valid, 'should be valid')
        assert.strictEqual(publicKeyStatus[2].toNumber(), blockInfo.timestamp, 'should be now')
        assert.strictEqual(publicKeyStatus[3].toNumber(), 0, 'should be 0 notime')

        done()
        })  
    }).catch(done)   
  })

  it('Set for subject1, publicKey2', done => {
    previousBlockInfo = blockInfo
    PublicKey.set(publicKey2, {from: subject1}).then(() => {
      blockInfo = web3.eth.getBlock("latest")
      return PublicKey.publicKeyStatus.call(subject1, publicKey1)
    }).then(function(r) {
      publicKeyStatus = r
      LogStatus("pubkey 1 endDate updated")
      assert.strictEqual(publicKeyStatus[0], true, 'should exist')
      assert.strictEqual(publicKeyStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(publicKeyStatus[2].toNumber(), previousBlockInfo.timestamp, 'should be unchanged')
      assert.strictEqual(publicKeyStatus[3].toNumber(), blockInfo.timestamp, 'should be now')

      return PublicKey.currentPublicKey.call(subject1)
    }).then(function(r) {
      currentPublicKey = r
      return PublicKey.publicKeyStatus.call(subject1, publicKey2)
    }).then(function(r) {
      publicKeyStatus = r

      LogStatus("pubKey2 created")
      assert.strictEqual(web3.toUtf8(currentPublicKey), publicKey2, 'should be publicKey2')
      assert.strictEqual(publicKeyStatus[0], true, 'should exist')
      assert.strictEqual(publicKeyStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(publicKeyStatus[2].toNumber(), blockInfo.timestamp, 'should be now')
      assert.strictEqual(publicKeyStatus[3].toNumber(), 0, 'should be 0 notime')

      done()      
    }).catch(done)    
  })

  it('Delete subject1, publicKey1', done => {
    previousBlockInfo = blockInfo
    PublicKey.deletePublicKey(publicKey1, {from: subject1}).then(() => {
      blockInfo = web3.eth.getBlock("latest")

      return PublicKey.publicKeyStatus.call(subject1, publicKey1)
    }).then(function(r) {
      publicKeyStatus = r
      LogStatus("pubkey 1 deleted")
      assert.strictEqual(publicKeyStatus[0], true, 'should exist')
      assert.strictEqual(publicKeyStatus[1].toNumber(), Status.DeletedBySubject, 'should be Deleted')
      assert.strictEqual(publicKeyStatus[3].toNumber(), blockInfo.timestamp, 'should be now')

      return PublicKey.currentPublicKey.call(subject1)
    }).then(function(r) {
      currentPublicKey = r
      return PublicKey.publicKeyStatus.call(subject1, publicKey2)
    }).then(function(r) {
      publicKeyStatus = r

      LogStatus("pubKey2 no change")
      assert.strictEqual(web3.toUtf8(currentPublicKey), publicKey2, 'should be publicKey2')
      assert.strictEqual(publicKeyStatus[0], true, 'should exist')
      assert.strictEqual(publicKeyStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(publicKeyStatus[2].toNumber(), previousBlockInfo.timestamp, 'should be unchanged')
      assert.strictEqual(publicKeyStatus[3].toNumber(), 0, 'should be 0 notime')

      done()      
    }).catch(done)    
  })


  //Test Set 2: subject2, publicKey3, publicKey4
  it('Initial Set for subject2, publicKey3', done => {
    console.log("");
    console.log("Test Set 1: subject2, publicKey3, publicKey4")
    console.log("subject2  : ", subject2);
    console.log("publicKey3: ", publicKey3)
    console.log("publicKey4: ", publicKey4)/**/
    console.log("");    
    PublicKey.set(publicKey3, {from: subject2}).then(() => {
      blockInfo = web3.eth.getBlock("latest")
      return PublicKey.currentPublicKey.call(subject2)
    }).then(function(r) {
      currentPublicKey = r
      return PublicKey.publicKeyStatus.call(subject2, publicKey3)
    }).then(function(r) {
      publicKeyStatus = r

      LogStatus("subject2 publicKey3 created")
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
    PublicKey.revokePublicKey(publicKey3, {from: subject2}).then(() => {
      blockInfo = web3.eth.getBlock("latest")
      return PublicKey.currentPublicKey.call(subject2)
    }).then(function(r) {
      currentPublicKey = r
      return PublicKey.publicKeyStatus.call(subject2, publicKey3)
    }).then(function(r) {
      publicKeyStatus = r
      LogStatus("pubkey 3 revoked, endDate updated")
      assert.strictEqual(web3.toUtf8(currentPublicKey), publicKey3, 'should be publicKey3')
      assert.strictEqual(publicKeyStatus[0], true, 'should exist')
      assert.strictEqual(publicKeyStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(publicKeyStatus[2].toNumber(), previousBlockInfo.timestamp, 'should be unchanged')
      assert.strictEqual(publicKeyStatus[3].toNumber(), blockInfo.timestamp, 'should be now')

      done()      
    }).catch(done)    
  })
  
  it('Set for subject2, publicKey4', done => {
    PublicKey.set(publicKey4, {from: subject2}).then(() => {
      blockInfo = web3.eth.getBlock("latest")
      return PublicKey.publicKeyStatus.call(subject2, publicKey3)
    }).then(function(r) {
      publicKeyStatus = r
      LogStatus("pubkey 1 endDate updated")
      assert.strictEqual(publicKeyStatus[0], true, 'should exist')
      assert.strictEqual(publicKeyStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(publicKeyStatus[2].toNumber(), previousBlockInfo.timestamp, 'should be unchanged')
      assert.strictEqual(publicKeyStatus[3].toNumber(), blockInfo.timestamp, 'should be now')

      return PublicKey.currentPublicKey.call(subject2)
    }).then(function(r) {
      currentPublicKey = r
      return PublicKey.publicKeyStatus.call(subject2, publicKey4)
    }).then(function(r) {
      publicKeyStatus = r

      LogStatus("pubKey2 created")
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
    PublicKey.deletePublicKey(publicKey3, {from: subject2}).then(() => {
      blockInfo = web3.eth.getBlock("latest")

      return PublicKey.publicKeyStatus.call(subject2, publicKey3)
    }).then(function(r) {
      publicKeyStatus = r
      LogStatus("pubkey3 deleted")
      assert.strictEqual(publicKeyStatus[0], true, 'should exist')
      assert.strictEqual(publicKeyStatus[1].toNumber(), Status.DeletedBySubject, 'should be Deleted')
      assert.strictEqual(publicKeyStatus[3].toNumber(), blockInfo.timestamp, 'should be now')

      done()      
    }).catch(done)    
  })
  
  it('Revoke subject2, deleted publicKey3, no change', done => {
    PublicKey.revokePublicKey(publicKey3, {from: subject2}).then(() => {
      blockInfo = web3.eth.getBlock("latest")
      return PublicKey.currentPublicKey.call(subject2)
    }).then(function(r) {
      currentPublicKey = r
      return PublicKey.publicKeyStatus.call(subject2, publicKey3)
    }).then(function(r) {
      publicKeyStatus = r
      LogStatus("deleted pubkey3 revoked, no change")
      assert.strictEqual(web3.toUtf8(currentPublicKey), publicKey4, 'should be publicKey4')
      assert.strictEqual(publicKeyStatus[0], true, 'should exist')
      assert.strictEqual(publicKeyStatus[3].toNumber(), previousBlockInfo.timestamp, 'should be previous')
// To check      assert.strictEqual(publicKeyStatus[1].toNumber(), Status.DeletedBySubject, 'should be valid')

      done()      
    }).catch(done)    
  })
  

  
})

