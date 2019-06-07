# Rationale

## Roles

There are three different roles:
- Subject. The one whose data is saved in the wallet and exchanged with others. It could be a person or an entity.
- Issuer. An entity that adds signed data about a subject. This is a credential.
- Service Provider. An entity that asks for a specific credential to a subject. A presentation is he set of enveloped credentials under a purpose, period of validity and a concrete addressee.

## Credential
A credential is issued by an issuer about a subject. It is sent offchain by the issuer to the subjet. Each credential is registered in the blockchain using hashes.
On the blockchain, just the status and the URI are saved. Everything else is saved offchain.
Issuer and subject, included in a given credential, should be able to update the status of a credential.

Possible values for the State are: Valid, AskIssuer, Revoked and DeletedBySubject

A credential could be sent offchain by the Subject to a Service Provider as part of a Presentation. Service providers having received a credential should be able to access the credential status but should not be able to change its status.

## Presentation


## Privacy
To ensure privacy, the relationship between subject and issuer can not be exposed to third parties. Upddates made by subject and those made by issuer should be kept isolated. Updates made by the subject and by the issuer to the status require information available in the credential. So, only those having a copy of the credential can update the status. Furthermore only those having a copy of the credential are able to know where the status of a given credential is stored.

Alastria Id four hashes to allow subject and issuer to update the credential status independently and to preserve the subject privacy. Those four hashes can be used by a Service Provider having received the credential as part of a presentation to read the status of an attestatoin and act accordingly. 
 
## Subject Credential Hash
Subject will use *hash (credential)*, to refer to and update the credential. Credential is the full credential including all the fields and the original signature from issuer.

## Issuer Credential Hash
Issuer will use *hash (credential + IssuerSignature)*, aka revocation hash or revHash.
In the revocation hash the IssuerSignature will be included twice to calculate the hash.

## Relationship between Credential Hash and Revocation Hash 
Both hashes are easily calculated by anyone having access to the credential. Both hashes are univocally related to the credential but can not be calculated nor guessed without having the credential.

## Implementation - TO UPDATE
* Status
  * enum Status {Valid, AskIssuer, Revoked, DeletedBySubject}
* Mappings
  Separate mapping should be used to kept credential information and revovation information indexed by credentialHash and revocationHash
* functions available to the subject use dataHash i.e. hash(credential):
  * set(bytes32 dataHash, string URI)
  * deleteAttestation (bytes32 dataHash)
  * subjectAttestationList ()
* functions available to the issuer use revHash i.e. hash(attestation + IssuerSignature)
  * revokeAttestation(bytes32 revHash, Status status)
* functions available to anybody, only meaningful to those having received the attestation.
  * subjectAttestationStatus (address subject, bytes32 dataHash) 
  * issuerRevocationStatus(address issuer, bytes32 revHash) 
  * attestationStatus (Status subjectStatus, Status issuerStatus)
