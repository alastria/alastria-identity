"use strict";
var AlastriaAttestationRegistry = artifacts.require('./AlastriaAttestationRegistry.sol')
// var Web3Utils = artifacts.require('web3-utils') not available, use solidity function instead.


contract('AlastriaAttestationRegistry', function (accounts) {
  let Attestation

  let subject1 = accounts[0]
  let subject2 = accounts[1]
  let issuer1 = accounts[2]
  let issuer2 = accounts[3]

  var attribute1 = "Atribute1"  
  var attribute2 = "Attribute2"  
  var attribute3 = "Attribute2"  
  var attribute4 = "Attribute4"  
  
  var dataHash1 = "dataHash1"  // Should be web3.utils.soliditySha3(attribute1)
  var dataHash2 = "dataHash2"  
  var dataHash3 = "dataHash3"  
  var dataHash4 = "dataHash4" 

  var signature1 = "signature1" // Should be the signature of Attribute1
  var signature2 = "signature2"
  var signature3 = "signature3"
  var signature4 = "signature4"
  
  var revHash1 = "revHash1" // Should be web3.utils.soliditySha3(dataHash1 + signature1)
  var revHash2 = "revHash2"
  var revHash3 = "revHash3"
  var revHash4 = "revHash4"
  var revHash
  
  var subjectStatus
  var issuerStatus
  var attestationStatus
  
  //we can't reuse enum in solidity contract so status definition is duplicated here
  let Status = {
      "Valid": 0,
      "AskIssuer": 1,
      "Revoked": 2,
      "DeletedByUser": 3
  }
  
  
  before(done => {
    done()
  })

  it('Creates AlastriaAttestationRegistry correctly', done => {
    let fakePrevVersion = accounts[3]
    AlastriaAttestationRegistry.new(fakePrevVersion, {from: accounts[0], gas: 3141592}).then(attestation => {
      Attestation = attestation
      return Attestation.version()
    }).then(version => {
      assert.equal(version.toNumber(), 3)
      return Attestation.previousPublishedVersion()
    }).then(previousVersion => {
      assert.equal(previousVersion, fakePrevVersion)
/*
      return Attestation.solidityHash.call(dataHash1, revHash1)
    }).then(revHash => {
      revHash1 = revHash
      console.log("revHash1:"+revHash1)
      return Attestation.solidityHash.call(dataHash2, revHash2)
    }).then(revHash => {
      revHash2 = revHash
      console.log("revHash2:"+revHash2)
      return Attestation.solidityHash.call(dataHash3, revHash3)
    }).then(revHash => {
      revHash3 = revHash
      console.log("revHash3:"+revHash3)
      return Attestation.solidityHash.call(dataHash4, revHash4)
    }).then(revHash => {
      revHash4 = revHash
      console.log("revHash4:"+revHash4)
*/
      done()
    }).catch(done)
  })

  
//Test Set 1: Subject1, Issuer1, dataHash1, revHash1. One by one transitions
  it('Initial Set for subject1, Issuer1', done => {
    console.log("");
    console.log("Test Set 1: Subject1, Issuer1, dataHash1, revHash1. One by one transitions")
    console.log("dataHash1 : "+dataHash1);
    console.log("revHash1  : "+revHash1);
    console.log("");
    
    Attestation.set(dataHash1, "Direccion1", {from: subject1}).then(() => {
      return Attestation.subjectAttestationStatus.call(subject1, dataHash1)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer1, revHash1)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r

      console.log("subject    : ", subjectStatus)
      console.log("issuer     : ", issuerStatus)
      console.log("attestation: ", attestationStatus)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(issuerStatus[0], false, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(attestationStatus.toNumber(), Status.Valid, 'should be valid')

      done()      
    }).catch(done)
    
})

  it('Change to AskIssuer by subject, no change', done => {
    Attestation.revokeAttestation(revHash1, Status.AskIssuer, {from: subject1}).then(() => {
      return Attestation.subjectAttestationStatus.call(subject1, dataHash1)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer1, revHash1)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      console.log("subject    : ", subjectStatus)
      console.log("issuer     : ", issuerStatus)
      console.log("attestation: ", attestationStatus)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(issuerStatus[0], false, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(attestationStatus.toNumber(), Status.Valid, 'should be valid')
      done()      
    }).catch(done)
  })

  it('Change to AskIssuer by issuer1', done => {
    Attestation.revokeAttestation(revHash1, Status.AskIssuer, {from: issuer1}).then(() => {
      return Attestation.subjectAttestationStatus.call(subject1, dataHash1)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer1, revHash1)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      console.log("subject    : ", subjectStatus)
      console.log("issuer     : ", issuerStatus)
      console.log("attestation: ", attestationStatus)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.AskIssuer, 'should be AskIssuer')
      assert.strictEqual(attestationStatus.toNumber(), Status.AskIssuer, 'should be AskIssuer')
      done()      
    }).catch(done)
  })

  it('Change to Revoked by issuer1', done => {
    Attestation.revokeAttestation(revHash1, Status.Revoked, {from: issuer1}).then(() => {
      return Attestation.subjectAttestationStatus.call(subject1, dataHash1)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer1, revHash1)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      console.log("subject    : ", subjectStatus)
      console.log("issuer     : ", issuerStatus)
      console.log("attestation: ", attestationStatus)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(attestationStatus.toNumber(), Status.Revoked, 'should be Revoked')
      done()      
    }).catch(done)
  })

  it('Change to DeletedByUser by issuer1, no change', done => {
    Attestation.deleteAttestation(dataHash1, {from: issuer1}).then(() => {
      return Attestation.subjectAttestationStatus.call(subject1, dataHash1)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer1, revHash1)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      console.log("subject    : ", subjectStatus)
      console.log("issuer     : ", issuerStatus)
      console.log("attestation: ", attestationStatus)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(attestationStatus.toNumber(), Status.Revoked, 'should be Revoked')
      done()      
    }).catch(done)
  })

  it('Change to DeletedByUser by subject', done => {
    Attestation.deleteAttestation(dataHash1, {from: subject1}).then(() => {
      return Attestation.subjectAttestationStatus.call(subject1, dataHash1)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer1, revHash1)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      console.log("subject    : ", subjectStatus)
      console.log("issuer     : ", issuerStatus)
      console.log("attestation: ", attestationStatus)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.DeletedByUser, 'should be DeletedByUser')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(attestationStatus.toNumber(), Status.DeletedByUser, 'should be DeletedByUser')
     done()      
    }).catch(done)
  })


//Connjunto 2: Subject1, Issuer2, dataHash2, revHash2. One by one transitions
  it('Initial Set for subject1, Issuer2', done => {
    console.log("");
    console.log("Test Set 2: Subject1, Issuer2, dataHash2, revHash2. One by one transitions")
    console.log("dataHash2 : "+dataHash2);
    console.log("revHash2  : "+revHash2);
    console.log("");
    
    Attestation.set(dataHash2, "Direccion2", {from: subject1}).then(() => {
      return Attestation.subjectAttestationStatus.call(subject1, dataHash2)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash2)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      console.log("subject    : ", subjectStatus)
      console.log("issuer     : ", issuerStatus)
      console.log("attestation: ", attestationStatus)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], false, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(attestationStatus.toNumber(), Status.Valid, 'should be Valid')
      done()      
    }).catch(done)
  })

  it('Change to AskIssuer by subject1, no change', done => {
    Attestation.revokeAttestation(revHash2, Status.AskIssuer, {from: subject1}).then(() => {
      return Attestation.subjectAttestationStatus.call(subject1, dataHash2)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash2)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      console.log("subject    : ", subjectStatus)
      console.log("issuer     : ", issuerStatus)
      console.log("attestation: ", attestationStatus)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], false, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(attestationStatus.toNumber(), Status.Valid, 'should be Valid')
      done()      
    }).catch(done)
  })

  it('Change to AskIssuer by issuer2', done => {
    Attestation.revokeAttestation(revHash2, Status.AskIssuer, {from: issuer2}).then(() => {
      return Attestation.subjectAttestationStatus.call(subject1, dataHash2)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash2)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      console.log("subject    : ", subjectStatus)
      console.log("issuer     : ", issuerStatus)
      console.log("attestation: ", attestationStatus)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.AskIssuer, 'should be AskIssuer')
      assert.strictEqual(attestationStatus.toNumber(), Status.AskIssuer, 'should be AskIssuer')
      done()      
    }).catch(done)
  })

  it('Change to Revoked by subject1, no change', done => {
    Attestation.revokeAttestation(revHash2, Status.Revoked, {from: subject1}).then(() => {
      return Attestation.subjectAttestationStatus.call(subject1, dataHash2)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash2)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      console.log("subject    : ", subjectStatus)
      console.log("issuer     : ", issuerStatus)
      console.log("attestation: ", attestationStatus)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.AskIssuer, 'should be AskIssuer')
      assert.strictEqual(attestationStatus.toNumber(), Status.AskIssuer, 'should be AskIssuer')
      done()      
    }).catch(done)
  })

  it('Change to Revoked by issuer1, no change', done => {
    Attestation.revokeAttestation(revHash2, Status.Revoked, {from: issuer1}).then(() => {
      return Attestation.subjectAttestationStatus.call(subject1, dataHash2)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash2)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      console.log("subject    : ", subjectStatus)
      console.log("issuer     : ", issuerStatus)
      console.log("attestation: ", attestationStatus)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.AskIssuer, 'should be AskIssuer')
      assert.strictEqual(attestationStatus.toNumber(), Status.AskIssuer, 'should be AskIssuer')
      done()      
    }).catch(done)
  })

  it('Change to Revoked by issuer2', done => {
    Attestation.revokeAttestation(revHash2, Status.Revoked, {from: issuer2}).then(() => {
      return Attestation.subjectAttestationStatus.call(subject1, dataHash2)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash2)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      console.log("subject    : ", subjectStatus)
      console.log("issuer     : ", issuerStatus)
      console.log("attestation: ", attestationStatus)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(attestationStatus.toNumber(), Status.Revoked, 'should be Revoked')
      done()      
    }).catch(done)
  })

  it('Change to DeletedByUser by issuer2, no change', done => {
    Attestation.deleteAttestation (dataHash2, {from: issuer2}).then(() => {
      return Attestation.subjectAttestationStatus.call(subject1, dataHash2)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash2)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      console.log("subject    : ", subjectStatus)
      console.log("issuer     : ", issuerStatus)
      console.log("attestation: ", attestationStatus)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(attestationStatus.toNumber(), Status.Revoked, 'should be Revoked')
      done()      
    }).catch(done)
  })

  it('Change to DeletedByUser by subject1', done => {
    Attestation.deleteAttestation (dataHash2, {from: subject1}).then(() => {
      return Attestation.subjectAttestationStatus.call(subject1, dataHash2)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash2)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      console.log("subject    : ", subjectStatus)
      console.log("issuer     : ", issuerStatus)
      console.log("attestation: ", attestationStatus)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.DeletedByUser, 'should be DeletedByUser')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(attestationStatus.toNumber(), Status.DeletedByUser, 'should be DeletedByUser')
      done()      
    }).catch(done)
  })


//Test Set 3: Subject2, Issuer2, dataHash3, revHash3. Direct jump to Revoked and backtransitions
  it('Initial Set for subject2 ', done => {
    console.log("");
    console.log("Test Set 3: Subject2, Issuer2, dataHash3, revHash3. Direct jump to Revoked and backtransitions")
    console.log("dataHash3 : "+dataHash3);
    console.log("revHash3  : "+revHash3);
    console.log("");
    
    Attestation.set(dataHash3, "Direccion3", {from: subject2}).then(() => {
      return Attestation.subjectAttestationStatus.call(subject2, dataHash3)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash3)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      console.log("subject    : ", subjectStatus)
      console.log("issuer     : ", issuerStatus)
      console.log("attestation: ", attestationStatus)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], false, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(attestationStatus.toNumber(), Status.Valid, 'should be Valid')
      done()      
    }).catch(done)
  })

  it('Change to AskIssuer by subject2, no change', done => {
    Attestation.revokeAttestation(revHash3, Status.AskIssuer, {from: subject2}).then(() => {
      return Attestation.subjectAttestationStatus.call(subject2, dataHash3)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash3)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      console.log("subject    : ", subjectStatus)
      console.log("issuer     : ", issuerStatus)
      console.log("attestation: ", attestationStatus)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], false, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(attestationStatus.toNumber(), Status.Valid, 'should be Valid')
      done()      
    }).catch(done)
  })

  it('Direct Change to Revoked by subject2, no change', done => {
    Attestation.revokeAttestation(revHash3, Status.Revoked, {from: subject2}).then(() => {
      return Attestation.subjectAttestationStatus.call(subject2, dataHash3)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash3)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      console.log("subject    : ", subjectStatus)
      console.log("issuer     : ", issuerStatus)
      console.log("attestation: ", attestationStatus)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], false, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(attestationStatus.toNumber(), Status.Valid, 'should be Valid')
      done()      
    }).catch(done)
  })

  it('Change to DeletedByUser by issuer2, no change', done => {
    Attestation.deleteAttestation (dataHash3, {from: issuer2}).then(() => {
      return Attestation.subjectAttestationStatus.call(subject2, dataHash3)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash3)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      console.log("subject    : ", subjectStatus)
      console.log("issuer     : ", issuerStatus)
      console.log("attestation: ", attestationStatus)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], false, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(attestationStatus.toNumber(), Status.Valid, 'should be Valid')
      done()      
    }).catch(done)
  })

  it('Direct Change to Revoked by issuer2', done => {
    Attestation.revokeAttestation(revHash3, Status.Revoked, {from: issuer2}).then(() => {
      return Attestation.subjectAttestationStatus.call(subject2, dataHash3)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash3)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      console.log("subject    : ", subjectStatus)
      console.log("issuer     : ", issuerStatus)
      console.log("attestation: ", attestationStatus)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(attestationStatus.toNumber(), Status.Revoked, 'should be Revoked')
      done()      
    }).catch(done)
  })

  it('Back Change to Valid by Issuer2, no change', done => {
    Attestation.revokeAttestation(revHash3, Status.Valid, {from: issuer2}).then(() => {
      return Attestation.subjectAttestationStatus.call(subject2, dataHash3)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash3)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      console.log("subject    : ", subjectStatus)
      console.log("issuer     : ", issuerStatus)
      console.log("attestation: ", attestationStatus)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(attestationStatus.toNumber(), Status.Revoked, 'should be Revoked')
      done()      
    }).catch(done)
  })
  
   it('Back Change to AskIssuer by Issuer2, no change', done => {
    Attestation.revokeAttestation(revHash3, Status.AskIssuer, {from: issuer2}).then(() => {
      return Attestation.subjectAttestationStatus.call(subject2, dataHash3)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash3)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      console.log("subject    : ", subjectStatus)
      console.log("issuer     : ", issuerStatus)
      console.log("attestation: ", attestationStatus)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(attestationStatus.toNumber(), Status.Revoked, 'should be Revoked')
      done()      
      }).catch(done)
  })
  
  it('Change to DeletedByUser by subject 2', done => {
    Attestation.deleteAttestation(dataHash3, {from: subject2}).then(() => {
      return Attestation.subjectAttestationStatus.call(subject2, dataHash3)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash3)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      console.log("subject    : ", subjectStatus)
      console.log("issuer     : ", issuerStatus)
      console.log("attestation: ", attestationStatus)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.DeletedByUser, 'should be DeletedByUser')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(attestationStatus.toNumber(), Status.DeletedByUser, 'should be DeletedByUser')
      done()      
    }).catch(done)
  })

  it('Back Change to Valid by subject2, no change', done => {
    Attestation.deleteAttestation(dataHash3, {from: subject2}).then(() => {
      return Attestation.subjectAttestationStatus.call(subject2, dataHash3)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash3)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      console.log("subject    : ", subjectStatus)
      console.log("issuer     : ", issuerStatus)
      console.log("attestation: ", attestationStatus)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.DeletedByUser, 'should be DeletedByUser')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(attestationStatus.toNumber(), Status.DeletedByUser, 'should be DeletedByUser')
      done()      
    }).catch(done)
  })
  
  
//Test Set 4: Subject2, Issuer2, dataHash4, revHash4. Direct jump to DeletedByUser
  it('Initial Set for subject2 dataHash4 ', done => {
    console.log("");
    console.log("Test Set 4: Subject2, Issuer2, dataHash4, revHash4. Direct jump to DeletedByUser")
    console.log("dataHash4 : " +dataHash4);
    console.log("revHash4  : " +revHash4);
    console.log("");
    
    Attestation.set(dataHash4, "Direccion4", {from: subject2}).then(() => {
      return Attestation.subjectAttestationStatus.call(subject2, dataHash4)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash4)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      console.log("subject    : ", subjectStatus)
      console.log("issuer     : ", issuerStatus)
      console.log("attestation: ", attestationStatus)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], false, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(attestationStatus.toNumber(), Status.Valid, 'should be Valid')
      done()      
    }).catch(done)
  })

  it('Direct Change to DeletedByUser by issuer2, no change', done => {
    Attestation.deleteAttestation(dataHash4, {from: issuer2}).then(() => {
      return Attestation.subjectAttestationStatus.call(subject2, dataHash4)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash4)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      console.log("subject    : ", subjectStatus)
      console.log("issuer     : ", issuerStatus)
      console.log("attestation: ", attestationStatus)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], false, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(attestationStatus.toNumber(), Status.Valid, 'should be Valid')
      done()      
    }).catch(done)
  })
  
  it('Direct Change to DeletedByUser by subject2', done => {
    Attestation.deleteAttestation(dataHash4, {from: subject2}).then(() => {
       return Attestation.subjectAttestationStatus.call(subject2, dataHash4)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash4)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      console.log("subject    : ", subjectStatus)
      console.log("issuer     : ", issuerStatus)
      console.log("attestation: ", attestationStatus)
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.DeletedByUser, 'should be DeletedByUser')
      assert.strictEqual(issuerStatus[0], false, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(attestationStatus.toNumber(), Status.DeletedByUser, 'should be DeletedByUser')
      done()      
    }).catch(done)
  })
  
})

