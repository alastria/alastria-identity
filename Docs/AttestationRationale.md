# Roles
An attestation is issued by an issuer about a subject and sent offchain by the issuer to the subjet. Each attestation is registered in the BlockChain using hashes.
Information about an attestation in the BC only includes the status and the URI where the attestation is really stored off chain.
Issuer and subject, included in a given attestation, should be able to update the status of an attestation.

Posible values for the State are: Valid, AskIssuer, Revoked and DeletedBySubject

An attestation could be sent offchain by the Subject to a Service Provider as part of a Claim. Service providers having received an attestation should be able to access the attestation status but should not be able to change its status.

# Privacy
To ensure privacy, the relationship between subject and issuer can not be exposed to third parties. Upddates made by subject and those made by issuer should be kept isolated. Updates made by the subject and by the issuer to the status require information available in the attestation. So, only those having a copy of the attestation can update the status. Furthermore only those having a copy of the attestation are able to know where the status of a given attestation is stored.

Alastria Id uses a pair of hashes to allow subject and issuer to update the attestation status independently. Those two hashes can be used by a Service Provider having reveived the attestation as part of a claim to read the status of an attestatoin and act accordingly. 
 
## Subject Attestation Hash
Subject will use *hash (attestation)*, aka dataHash, to refer to and update the attestation. Attestation is the full attestation including all the fields and the original signature from issuer.

## Issuer Revocation Hash
Issuer will use *hash (attestation + IssuerSignature)*, aka revocation hash or revHash.
In the revocation hash the IssuerSignature will be included twice to calculate the hash.

## Relationship between Attestation Hash and Revocation Hash 
Both hashes are easily calculated by anyone having access to the Attestation. Both hashes are univocally related to the attestation but can not be calculated nor guessed without having the attestation.

# Implementation
* Status
  * enum Status {Valid, AskIssuer, Revoked, DeletedBySubject}
* Mappings
  Separate mapping should be used to kept Attestation information and revovation information indexed by attestationHash and revocationHash
* functions available to the subject use dataHash i.e. hash(attestation):
  * set(bytes32 dataHash, string URI)
  * deleteAttestation (bytes32 dataHash)
  * subjectAttestationList ()
* functions available to the issuer use revHash i.e. hash(attestation + IssuerSignature)
  * revokeAttestation(bytes32 revHash, Status status)
* functions available to anybody, only meaningful to those having received the attestation.
  * subjectAttestationStatus (address subject, bytes32 dataHash) 
  * issuerRevocationStatus(address issuer, bytes32 revHash) 
  * attestationStatus (Status subjectStatus, Status issuerStatus)
