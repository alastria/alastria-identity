"use strict";
var AlastriaAttestationRegistry = artifacts.require('./AlastriaAttestationRegistry.sol')
// var Web3Utils = artifacts.require('web3-utils') not available, use solidity function instead.


contract('AlastriaAttestationRegistry', function (accounts) {
  let Attestation

  let subject1 = accounts[0]
  let subject2 = accounts[1]
  let issuer1 = accounts[2]
  let issuer2 = accounts[3]

  var attestation1 = "Attestation1"
  var attestation2 = "Attestation2"
  var attestation3 = "Attestation2"
  var attestation4 = "Attestation4"

  var dataHash1 = "dataHash1" // Should be web3.eth.abi.encodeParameter("bytes32",web3.utils.soliditySha3(attestation1))
  var dataHash2 = "dataHash2" // but readable strings make life easier.
  var dataHash3 = "dataHash3"
  var dataHash4 = "dataHash4"

  var signature1 = "signature1" // Should be the signature of attestation1
  var signature2 = "signature2"
  var signature3 = "signature3"
  var signature4 = "signature4"

  var revHash1 = "revHash1" // Should be web3.eth.abi.encodeParameter("bytes32",web3-utils.soliditySha3(dataHash1 + signature1))
  var revHash2 = "revHash2"
  var revHash3 = "revHash3"
  var revHash4 = "revHash4"
  var revHash

  // Return Variables from Solidity Smart Contract
  var txResult
  var subjectStatus
  var issuerStatus
  var attestationStatus
  var attestationList

  //we can't reuse enum in solidity contract so status definition is duplicated here
  let Status = {
      "Valid": 0,
      "AskIssuer": 1,
      "Revoked": 2,
      "DeletedBySubject": 3
  }

  function LogStatus() {
    var i
    var attString
    /* More detailled view: console.log("subject    : " , subjectStatus[0] , ", " , subjectStatus[1], ",", subjectStatus[1].c)*/
    console.log("subject    : " + subjectStatus
    )
    console.log("issuer     : " + issuerStatus)
    console.log("att. status: " + attestationStatus)
    /* console.log("AttList    : ", attestationList) */
    /* Detailed attestationList one by one in UTF8 */
    attString = attestationList[0]
    for (i = 0; i < attestationList[0]; i++) {
      attString = attString + ", " + web3.toUtf8(attestationList[1][i])
    }
    console.log("AttList    : ", attString)

    for (i = 0; i < txResult.logs.length; i++) {
      console.log("Event      : " + txResult.logs[i].event, ", args: ", txResult.logs[i].args)
      }
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
    console.log("Subject1  : "+subject1);
    console.log("Issuer1   : "+issuer1);
    console.log("dataHash1 : "+dataHash1);
    console.log("revHash1  : "+revHash1);
    console.log("");
    Attestation.set(dataHash1, "Direccion1", {from: subject1}).then(function(r) {
      txResult = r
      return Attestation.subjectAttestationStatus.call(subject1, dataHash1)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer1, revHash1)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      return Attestation.subjectAttestationList({from: subject1})
    }).then(function(r) {
      attestationList = r
      LogStatus()
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(issuerStatus[0], false, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(attestationStatus.toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(attestationList[0].toNumber(), 1, 'should be 1')
      assert.strictEqual(web3.toUtf8(attestationList[1][0]), dataHash1, 'should be dataHash1')
      assert.strictEqual(txResult.logs.length, 0, 'should be 0')
      done()
    }).catch(done)

  })

  it('Second equal Set for subject1, Issuer1, will fail & revert', done => {
    Attestation.set(dataHash1, "Direccion1", {from: subject1}).then(() => {
      console.log ("")
      assert (false, "ERROR: Expected exception")
      console.log ("")
      done()
    }).catch ( () => {
      console.log ("")
      console.log ("Expected exception caught, check nothing changed")
      console.log ("")
      return Attestation.subjectAttestationStatus.call(subject1, dataHash1)
      .then(function(r) {
        subjectStatus = r
        return Attestation.issuerRevocationStatus.call(issuer1, revHash1)
      }).then(function(r) {
        issuerStatus = r
        return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
      }).then(function(r) {
        attestationStatus = r
        return Attestation.subjectAttestationList({from: subject1})
      }).then(function(r) {
        attestationList = r
        LogStatus()
        assert.strictEqual(subjectStatus[0], true, 'should exist')
        assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid')
        assert.strictEqual(issuerStatus[0], false, 'should exist')
        assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be valid')
        assert.strictEqual(attestationStatus.toNumber(), Status.Valid, 'should be valid')
        assert.strictEqual(attestationList[0].toNumber(), 1, 'should be 1')
        assert.strictEqual(web3.toUtf8(attestationList[1][0]), dataHash1, 'should be dataHash1')
        done()
        })
    }).catch(done)
  })


  it('Change to AskIssuer by subject, no change', done => {
    Attestation.revokeAttestation(revHash1, Status.AskIssuer, {from: subject1}).then(function(r) {
      txResult = r
      return Attestation.subjectAttestationStatus.call(subject1, dataHash1)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer1, revHash1)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      return Attestation.subjectAttestationList({from: subject1})
    }).then(function(r) {
      attestationList = r
      LogStatus()
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(issuerStatus[0], false, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(attestationStatus.toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(txResult.logs.length, 1, 'should be 1')
      assert.strictEqual(txResult.logs[0].event, "AttestationRevoked", 'should be AttestationRevoked')
      assert.strictEqual(web3.toUtf8(txResult.logs[0].args.revHash), revHash1, 'should be revHash1' )
      assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.AskIssuer, 'should be AkIssuer' )
      done()
    }).catch(done)
  })

  it('Change to AskIssuer by issuer1', done => {
    Attestation.revokeAttestation(revHash1, Status.AskIssuer, {from: issuer1}).then(function(r) {
      txResult = r
      return Attestation.subjectAttestationStatus.call(subject1, dataHash1)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer1, revHash1)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      return Attestation.subjectAttestationList({from: subject1})
    }).then(function(r) {
      attestationList = r
      LogStatus()
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.AskIssuer, 'should be AskIssuer')
      assert.strictEqual(attestationStatus.toNumber(), Status.AskIssuer, 'should be AskIssuer')
      assert.strictEqual(txResult.logs.length, 1, 'should be 1')
      assert.strictEqual(txResult.logs[0].event, "AttestationRevoked", 'should be AttestationRevoked')
      assert.strictEqual(web3.toUtf8(txResult.logs[0].args.revHash), revHash1, 'should be revHash1' )
      assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.AskIssuer, 'should be AkIssuer' )
      done()
    }).catch(done)
  })

  it('Change to Revoked by issuer1', done => {
    Attestation.revokeAttestation(revHash1, Status.Revoked, {from: issuer1}).then(function(r) {
      txResult = r
      return Attestation.subjectAttestationStatus.call(subject1, dataHash1)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer1, revHash1)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      return Attestation.subjectAttestationList({from: subject1})
    }).then(function(r) {
      attestationList = r
      LogStatus()
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(attestationStatus.toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(txResult.logs.length, 1, 'should be 1')
      assert.strictEqual(txResult.logs[0].event, "AttestationRevoked", 'should be AttestationRevoked')
      assert.strictEqual(web3.toUtf8(txResult.logs[0].args.revHash), revHash1, 'should be revHash1' )
      assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.Revoked, 'should be Revoked' )
      done()
    }).catch(done)
  })

  it('Change to DeletedBySubject by issuer1, no change', done => {
    Attestation.deleteAttestation(dataHash1, {from: issuer1}).then(function(r) {
      txResult = r
      return Attestation.subjectAttestationStatus.call(subject1, dataHash1)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer1, revHash1)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      return Attestation.subjectAttestationList({from: subject1})
    }).then(function(r) {
      attestationList = r
      LogStatus()
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be valid')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(attestationStatus.toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(txResult.logs.length, 0, 'should be 0')
      done()
    }).catch(done)
  })

  it('Change to DeletedBySubject by subject', done => {
    Attestation.deleteAttestation(dataHash1, {from: subject1}).then(function(r) {
      txResult = r
      return Attestation.subjectAttestationStatus.call(subject1, dataHash1)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer1, revHash1)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      return Attestation.subjectAttestationList({from: subject1})
    }).then(function(r) {
      attestationList = r
      LogStatus()
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.DeletedBySubject, 'should be DeletedBySubject')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(attestationStatus.toNumber(), Status.DeletedBySubject, 'should be DeletedBySubject')
      assert.strictEqual(txResult.logs.length, 1, 'should be 1')
      assert.strictEqual(txResult.logs[0].event, "AttestationDeleted", 'should be AttestationDeleted')
      assert.strictEqual(web3.toUtf8(txResult.logs[0].args.dataHash), dataHash1, 'should be dataHash1' )
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

    Attestation.set(dataHash2, "Direccion2", {from: subject1}).then(function(r) {
      txResult = r
      return Attestation.subjectAttestationStatus.call(subject1, dataHash2)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash2)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      return Attestation.subjectAttestationList({from: subject1})
    }).then(function(r) {
      attestationList = r
      LogStatus()
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], false, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(attestationStatus.toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(attestationList[0].toNumber(), 2, 'should be 2')
      assert.strictEqual(web3.toUtf8(attestationList[1][1]), dataHash2, 'should be dataHash2')
      assert.strictEqual(txResult.logs.length, 0, 'should be 0')
      done()
    }).catch(done)
  })

  it('Change to AskIssuer by subject1, no change', done => {
    Attestation.revokeAttestation(revHash2, Status.AskIssuer, {from: subject1}).then(function(r) {
      txResult = r
      return Attestation.subjectAttestationStatus.call(subject1, dataHash2)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash2)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      return Attestation.subjectAttestationList({from: subject1})
    }).then(function(r) {
      attestationList = r
      LogStatus()
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], false, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(attestationStatus.toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(txResult.logs.length, 1, 'should be 1')
      assert.strictEqual(txResult.logs[0].event, "AttestationRevoked", 'should be AttestationRevoked')
      assert.strictEqual(web3.toUtf8(txResult.logs[0].args.revHash), revHash2, 'should be revHash2' )
      assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.AskIssuer, 'should be AskIssuer' )
      done()
    }).catch(done)
  })

  it('Change to AskIssuer by issuer2', done => {
    Attestation.revokeAttestation(revHash2, Status.AskIssuer, {from: issuer2}).then(function(r) {
      txResult = r
      return Attestation.subjectAttestationStatus.call(subject1, dataHash2)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash2)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      return Attestation.subjectAttestationList({from: subject1})
    }).then(function(r) {
      attestationList = r
      LogStatus()
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.AskIssuer, 'should be AskIssuer')
      assert.strictEqual(attestationStatus.toNumber(), Status.AskIssuer, 'should be AskIssuer')
      assert.strictEqual(txResult.logs.length, 1, 'should be 1')
      assert.strictEqual(txResult.logs[0].event, "AttestationRevoked", 'should be AttestationRevoked')
      assert.strictEqual(web3.toUtf8(txResult.logs[0].args.revHash), revHash2, 'should be revHash2' )
      assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.AskIssuer, 'should be AskIssuer' )
      done()
    }).catch(done)
  })

  it('Change to Revoked by subject1, no change', done => {
    Attestation.revokeAttestation(revHash2, Status.Revoked, {from: subject1}).then(function(r) {
      txResult = r
      return Attestation.subjectAttestationStatus.call(subject1, dataHash2)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash2)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      return Attestation.subjectAttestationList({from: subject1})
    }).then(function(r) {
      attestationList = r
      LogStatus()
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.AskIssuer, 'should be AskIssuer')
      assert.strictEqual(attestationStatus.toNumber(), Status.AskIssuer, 'should be AskIssuer')
      assert.strictEqual(txResult.logs.length, 1, 'should be 1')
      assert.strictEqual(txResult.logs[0].event, "AttestationRevoked", 'should be AttestationRevoked')
      assert.strictEqual(web3.toUtf8(txResult.logs[0].args.revHash), revHash2, 'should be revHash2' )
      assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.Revoked, 'should be Revoked' )
      done()
    }).catch(done)
  })

  it('Change to Revoked by issuer1, no change', done => {
    Attestation.revokeAttestation(revHash2, Status.Revoked, {from: issuer1}).then(function(r) {
      txResult = r
      return Attestation.subjectAttestationStatus.call(subject1, dataHash2)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash2)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      return Attestation.subjectAttestationList({from: subject1})
    }).then(function(r) {
      attestationList = r
      LogStatus()
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.AskIssuer, 'should be AskIssuer')
      assert.strictEqual(attestationStatus.toNumber(), Status.AskIssuer, 'should be AskIssuer')
      assert.strictEqual(txResult.logs.length, 1, 'should be 1')
      assert.strictEqual(txResult.logs[0].event, "AttestationRevoked", 'should be AttestationRevoked')
      assert.strictEqual(web3.toUtf8(txResult.logs[0].args.revHash), revHash2, 'should be revHash2' )
      assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.Revoked, 'should be Revoked' )
      done()
    }).catch(done)
  })

  it('Change to Revoked by issuer2', done => {
    Attestation.revokeAttestation(revHash2, Status.Revoked, {from: issuer2}).then(function(r) {
      txResult = r
      return Attestation.subjectAttestationStatus.call(subject1, dataHash2)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash2)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      return Attestation.subjectAttestationList({from: subject1})
    }).then(function(r) {
      attestationList = r
      LogStatus()
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(attestationStatus.toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(txResult.logs.length, 1, 'should be 1')
      assert.strictEqual(txResult.logs[0].event, "AttestationRevoked", 'should be AttestationRevoked')
      assert.strictEqual(web3.toUtf8(txResult.logs[0].args.revHash), revHash2, 'should be revHash2' )
      assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.Revoked, 'should be Revoked' )
      done()
    }).catch(done)
  })

  it('Change to DeletedBySubject by issuer2, no change', done => {
    Attestation.deleteAttestation (dataHash2, {from: issuer2}).then(function(r) {
      txResult = r
      return Attestation.subjectAttestationStatus.call(subject1, dataHash2)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash2)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      return Attestation.subjectAttestationList({from: subject1})
    }).then(function(r) {
      attestationList = r
      LogStatus()
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(attestationStatus.toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(txResult.logs.length, 0, 'should be 0')
      done()
    }).catch(done)
  })

  it('Change to DeletedBySubject by subject1', done => {
    Attestation.deleteAttestation (dataHash2, {from: subject1}).then(function(r) {
      txResult = r
      return Attestation.subjectAttestationStatus.call(subject1, dataHash2)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash2)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      return Attestation.subjectAttestationList({from: subject1})
    }).then(function(r) {
      attestationList = r
      return Attestation.subjectAttestationList({from: subject1})
    }).then(function(r) {
      attestationList = r
      LogStatus()
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.DeletedBySubject, 'should be DeletedBySubject')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(attestationStatus.toNumber(), Status.DeletedBySubject, 'should be DeletedBySubject')	
      assert.strictEqual(txResult.logs.length, 1, 'should be 1')
      assert.strictEqual(txResult.logs[0].event, "AttestationDeleted", 'should be AttestationDeleted')
      assert.strictEqual(web3.toUtf8(txResult.logs[0].args.dataHash), dataHash2, 'should be dataHash2' )
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

    Attestation.set(dataHash3, "Direccion3", {from: subject2}).then(function(r) {
      txResult = r
      return Attestation.subjectAttestationStatus.call(subject2, dataHash3)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash3)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      return Attestation.subjectAttestationList({from: subject2})
    }).then(function(r) {
      attestationList = r
      LogStatus()
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], false, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(attestationStatus.toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(attestationList[0].toNumber(), 1, 'should be 1')
      assert.strictEqual(web3.toUtf8(attestationList[1][0]), dataHash3, 'should be dataHash3')
      assert.strictEqual(txResult.logs.length, 0, 'should be 0')
      done()
    }).catch(done)
  })

  it('Change to AskIssuer by subject2, no change', done => {
    Attestation.revokeAttestation(revHash3, Status.AskIssuer, {from: subject2}).then(function(r) {
      txResult = r
      return Attestation.subjectAttestationStatus.call(subject2, dataHash3)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash3)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      return Attestation.subjectAttestationList({from: subject2})
    }).then(function(r) {
      attestationList = r
      LogStatus()
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], false, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(attestationStatus.toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(txResult.logs.length, 1, 'should be 1')
      assert.strictEqual(txResult.logs[0].event, "AttestationRevoked", 'should be AttestationRevoked')
      assert.strictEqual(web3.toUtf8(txResult.logs[0].args.revHash), revHash3, 'should be revHash3' )
      assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.AskIssuer, 'should be AskIssuer' )
      done()
    }).catch(done)
  })

  it('Direct Change to Revoked by subject2, no change', done => {
    Attestation.revokeAttestation(revHash3, Status.Revoked, {from: subject2}).then(function(r) {
      txResult = r
      return Attestation.subjectAttestationStatus.call(subject2, dataHash3)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash3)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      return Attestation.subjectAttestationList({from: subject2})    }).then(function(r) {
      attestationList = r
      LogStatus()
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], false, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(attestationStatus.toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(txResult.logs.length, 1, 'should be 1')
      assert.strictEqual(txResult.logs[0].event, "AttestationRevoked", 'should be AttestationRevoked')
      assert.strictEqual(web3.toUtf8(txResult.logs[0].args.revHash), revHash3, 'should be revHash3' )
      assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.Revoked, 'should be Revoked' )
      done()
    }).catch(done)
  })

  it('Change to DeletedBySubject by issuer2, no change', done => {
    Attestation.deleteAttestation (dataHash3, {from: issuer2}).then(function(r) {
      txResult = r
      return Attestation.subjectAttestationStatus.call(subject2, dataHash3)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash3)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      return Attestation.subjectAttestationList({from: subject2})    }).then(function(r) {
      attestationList = r
      LogStatus()
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], false, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(attestationStatus.toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(txResult.logs.length, 0, 'should be 0')
      done()
    }).catch(done)
  })

  it('Direct Change to Revoked by issuer2', done => {
    Attestation.revokeAttestation(revHash3, Status.Revoked, {from: issuer2}).then(function(r) {
      txResult = r
      return Attestation.subjectAttestationStatus.call(subject2, dataHash3)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash3)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      return Attestation.subjectAttestationList({from: subject2})    }).then(function(r) {
      attestationList = r
      LogStatus()
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(attestationStatus.toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(txResult.logs.length, 1, 'should be 1')
      assert.strictEqual(txResult.logs[0].event, "AttestationRevoked", 'should be AttestationRevoked')
      assert.strictEqual(web3.toUtf8(txResult.logs[0].args.revHash), revHash3, 'should be revHash3' )
      assert.strictEqual(txResult.logs[0].args.status.toNumber(), Status.Revoked, 'should be Revoked' )
      done()
    }).catch(done)
  })

  it('Back Change to Valid by Issuer2, no change', done => {
    Attestation.revokeAttestation(revHash3, Status.Valid, {from: issuer2}).then(function(r) {
      txResult = r
      return Attestation.subjectAttestationStatus.call(subject2, dataHash3)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash3)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      return Attestation.subjectAttestationList({from: subject2})    }).then(function(r) {
      attestationList = r
      LogStatus()
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(attestationStatus.toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(txResult.logs.length, 0, 'should be 0')
      done()
    }).catch(done)
  })

   it('Back Change to AskIssuer by Issuer2, no change', done => {
    Attestation.revokeAttestation(revHash3, Status.AskIssuer, {from: issuer2}).then(function(r) {
      txResult = r
      return Attestation.subjectAttestationStatus.call(subject2, dataHash3)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash3)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      return Attestation.subjectAttestationList({from: subject2})    }).then(function(r) {
      attestationList = r
      LogStatus()
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(attestationStatus.toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(txResult.logs.length, 0, 'should be 0')
      done()
      }).catch(done)
  })

  it('Change to DeletedBySubject by subject 2', done => {
    Attestation.deleteAttestation(dataHash3, {from: subject2}).then(function(r) {
      txResult = r
      return Attestation.subjectAttestationStatus.call(subject2, dataHash3)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash3)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      return Attestation.subjectAttestationList({from: subject2})    }).then(function(r) {
      attestationList = r
      LogStatus()
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.DeletedBySubject, 'should be DeletedBySubject')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(attestationStatus.toNumber(), Status.DeletedBySubject, 'should be DeletedBySubject')
      assert.strictEqual(txResult.logs.length, 1, 'should be 1')
      assert.strictEqual(txResult.logs[0].event, "AttestationDeleted", 'should be AttestationDeleted')
      assert.strictEqual(web3.toUtf8(txResult.logs[0].args.dataHash), dataHash3, 'should be dataHash3' )
      done()
    }).catch(done)
  })

  it('Back Change to Valid by subject2, no change', done => {
    Attestation.deleteAttestation(dataHash3, {from: subject2}).then(function(r) {
      txResult = r
      return Attestation.subjectAttestationStatus.call(subject2, dataHash3)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash3)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      return Attestation.subjectAttestationList({from: subject2})    }).then(function(r) {
      attestationList = r
      LogStatus()
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.DeletedBySubject, 'should be DeletedBySubject')
      assert.strictEqual(issuerStatus[0], true, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Revoked, 'should be Revoked')
      assert.strictEqual(attestationStatus.toNumber(), Status.DeletedBySubject, 'should be DeletedBySubject')
      assert.strictEqual(txResult.logs.length, 0, 'should be 0')
      done()
    }).catch(done)
  })


//Test Set 4: Subject2, Issuer2, dataHash4, revHash4. Direct jump to DeletedBySubject, registering many hashes in the middle
  it('Initial Set for subject2 dataHash4 ', done => {
    console.log("");
    console.log("Test Set 4: Subject2, Issuer2, dataHash4, revHash4. Direct jump to DeletedBySubject, registering many hashes in the middle")
    console.log("dataHash4 : " +dataHash4);
    console.log("revHash4  : " +revHash4);
    console.log("");
    Attestation.set("MiddH2", "MidDireccion2", {from: subject2})
    Attestation.set("MiddH3", "MidDireccion3", {from: subject2})
    Attestation.set("MiddH4", "MidDireccion4", {from: subject2})
    Attestation.set("MiddH5", "MidDireccion5", {from: subject2})
    Attestation.set("MiddH6", "MidDireccion6", {from: subject2})
    Attestation.set("MiddH7", "MidDireccion7", {from: subject2})
    Attestation.set("MiddH8", "MidDireccion8", {from: subject2})
    Attestation.set("MiddH9", "MidDireccion9", {from: subject2})
    Attestation.set(dataHash4, "Direccion4", {from: subject2}).then(function(r) {
      txResult = r
      return Attestation.subjectAttestationStatus.call(subject2, dataHash4)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash4)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      return Attestation.subjectAttestationList({from: subject2})    }).then(function(r) {
      attestationList = r
      LogStatus()
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], false, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(attestationStatus.toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(attestationList[0].toNumber(), 10, 'should be 10')
      assert.strictEqual(web3.toUtf8(attestationList[1][9]), dataHash4, 'should be dataHash4')
      assert.strictEqual(txResult.logs.length, 0, 'should be 0')
      done()
    }).catch(done)
  })

  it('Direct Change to DeletedBySubject by issuer2, no change', done => {
    Attestation.deleteAttestation(dataHash4, {from: issuer2}).then(function(r) {
      txResult = r
      return Attestation.subjectAttestationStatus.call(subject2, dataHash4)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash4)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      return Attestation.subjectAttestationList({from: subject2})    }).then(function(r) {
      attestationList = r
      LogStatus()
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(issuerStatus[0], false, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(attestationStatus.toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(txResult.logs.length, 0, 'should be 0')
      done()
    }).catch(done)
  })

  it('Direct Change to DeletedBySubject by subject2', done => {
    Attestation.deleteAttestation(dataHash4, {from: subject2}).then(function(r) {
      txResult = r
       return Attestation.subjectAttestationStatus.call(subject2, dataHash4)
    }).then(function(r) {
      subjectStatus = r
      return Attestation.issuerRevocationStatus.call(issuer2, revHash4)
    }).then(function(r) {
      issuerStatus = r
      return Attestation.attestationStatus(subjectStatus[1], issuerStatus[1])
    }).then(function(r) {
      attestationStatus = r
      return Attestation.subjectAttestationList({from: subject2})    }).then(function(r) {
      attestationList = r
      LogStatus()
      assert.strictEqual(subjectStatus[0], true, 'should exist')
      assert.strictEqual(subjectStatus[1].toNumber(), Status.DeletedBySubject, 'should be DeletedBySubject')
      assert.strictEqual(issuerStatus[0], false, 'should exist')
      assert.strictEqual(issuerStatus[1].toNumber(), Status.Valid, 'should be Valid')
      assert.strictEqual(attestationStatus.toNumber(), Status.DeletedBySubject, 'should be DeletedBySubject')
      assert.strictEqual(txResult.logs.length, 1, 'should be 1')
      assert.strictEqual(txResult.logs[0].event, "AttestationDeleted", 'should be AttestationDeleted')
      assert.strictEqual(web3.toUtf8(txResult.logs[0].args.dataHash), dataHash4, 'should be dataHash4' )
      done()
    }).catch(done)
  })

})
