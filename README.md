# Alastria-identity : Definition of the ID for Alastria

## Alastria ID

Process to create a new ID : Only identified IDs can create a new IDs in Alastria now (That's a paradox, I know). First ID to be created is Alastria itself, this iD will be able to create new organitzations, and only these certified organizations will be able to create new identities.

Alastria --> organizations[] --> users[]

We will be using uPort Smart Contracts a s a basis for our Identity System. To start We will use two main components : IdentityRegister (uPortRegister) and IdentityManager.

### Proxy contract
The Proxy contract acts as a permanent identifier for a user. When interacting with other smart contracts on the blockchain the address of the proxy contract will be msg.sender for the user.

### IdentityRegister
Smart Contract to store attributes for a Proxy contract (Id).

### IdentityManager
IdentityManager is a controller contract for Proxy contracts that is shared between users. This minimizes gas costs compared to each user having to have their own separate controller for their proxy, while still allowing the user to have full control over their own proxy. The IdentityManager also gives the user the power to control the proxy from multiple devices.

The IdentityManager should be able to perform the following actions:

- Identity Creation
  - Allow users to create a new proxy through the IdentityManager
  - Allow users to transfer an old proxy to the IdentityManager
- Use
  - Relay a tx to proxy
  - Adding of new owners
  - Removal of owners
  - Recovering from loss of all owner keys
  - Changing recovery
  - Transferring ownership of proxy away from IdentityManager

The IdentityManager contract has any number of owners and one recovery key for each proxy. It also has rate limits for each caller on some of the functions. Proxies can be created, transfered to and from the IdentityManager. Owners can be added and removed, the recovery key can be changed.

### Parameters

- userTimeLock : Time before new owner can control proxy
- adminTimeLock : Time before new owner can add/remove owners
- adminRate : Time period used for rate limiting a given key for admin functionality

List of owners for a proxy (timestamp):
- mapping(address => mapping(address => uint)) owners;

Recovery keys for a proxy:
- mapping(address => address) recoveryKeys

Rate limiters for a owner of a proxy (timestamp):
- mapping(address => mapping(address => uint)) limiter;

### Modifiers

onlyOwner(address identity)
- (owners[identity][msg.sender] > 0 && (owners[identity][msg.sender] + userTimeLock) <= now)

onlyOlderOwner(address identity)
- (owners[identity][msg.sender] > 0 && (owners[identity][msg.sender] + adminTimeLock) <= now)

onlyRecovery(address identity)
- (recoveryKeys[identity] == msg.sender)

rateLimited(address identity)
- (limiter[identity][msg.sender] < (now - adminRate))

validAddress(address addr)
- (addr != address(0))

### Functions

createIdentity: This is how we create a new ID. It Creates a new proxy contract for an owner and recovery
- function createIdentity(address owner, address recoveryKey) validAddress(recoveryKey)

forwardTo: Forward a call via the proxy.
- function forwardTo(Proxy identity, address destination, uint value, bytes data) onlyOwner(identity)

addOwner: Allows an olderOwner to add a new owner instantly
- function addOwner(Proxy identity, address newOwner) onlyOlderOwner(identity) rateLimited(identity)

addOwnerFromRecovery: Allows a recoveryKey to add a new owner with userTimeLock waiting time
- function addOwnerFromRecovery(Proxy identity, address newOwner) onlyRecovery(identity) rateLimited(identity)

removeOwner: Allows an owner to remove another owner instantly
- function removeOwner(Proxy identity, address owner) onlyOlderOwner(identity) rateLimited(identity)

changeRecovery: Allows an owner to change the recoveryKey instantly
- function changeRecovery(Proxy identity, address recoveryKey) onlyOlderOwner(identity) rateLimited(identity) validAddress(recoveryKey)

## ANS - Alastria Name Service

alastria.users.<alias> aka @<alias>
alastria.<brand>

Each brand will need to deploy a Smart contract acting as a resolver for its own domain.
Based on ENS but with a different way of giving names

### Genesis

At the beginning of times we have one addres (addr0) to act as main admin for the system. It's importnat to keep that address safe (of course). IN a later stage we will turn the contracts multiowner so we don't tdepend on this unqieu address.

### Deploy Generic Smart Contracts
1. Deploy IdentityManager
2. Deploy IdentityRegister
3. Deploy Libs : ArrayLib
4. Deploy ANS

### Add First ID : Alastria
1. new Account : AlastriaOwner (private key that owns the Proxy for Alastria ID)
2. new Account : AlastriaKey (recovery Key to be stored in a USB as a backup)
3. Using IdentityManager add a new ID for Alastria (AlastriaOwner & AlastriaKey). This will create a Proxy for the Alastria : AlastriaID.
4. Create a Json file with basic information about Alastria. Upload it to IPFS anf get its hash.
5. Write to IdentityRegister the hash
6. Deploy the Resolver for Alastria
7. Write to ANS : AlsatriaID

### We need tools (nodejs/python) to :
1. Deploy Smart Contracts easliy
2. Deploy new Ids
3. Write entries in the Alastria NS
4. Write entries to the Resolvers

### At this point we will have
1. Address for ANS
2. Address for Alastria main ID
3. Address for the Alastria Resolver
4. We can resolve "alastria" to the Alastria main ID address

### Considerations
1. Only AlastriaID (through IdentityManager) can add new resolvers (organizations) to the ANS.
2. Only certified organizations can add new IDs to IdentityManager.

### The API
To make things easier for this organizations to add users in their zones we will create an API so they can (once authenticated) deploy easily new IDs.

/login
We will use webtokens (jwt).

.... define process... Need to talk to you guys on slack

/newId/<addr_owner>/<name>
Deploys a new ID and sets the owner to <addr_owner>. Adds a new entry to the resolver with the name. Returns the new <addr> for the ID.

/registerAttribute/<addr>/<attribute>
Adds an atribute to the <addr>

## Alastria ID App : On the phone!
Double verification : email + SMS (phone)
We will need a double verification to create a new Identity. The app will ask for the Phone Number and will send a verification code via SMS. The app will also ask for an email and will send a code to the email.

Once the App is verified we can save basic information about the user : First Name and last names (we have 2 in Spain), address, gender and date of birth.

1. Create a Smart contract representing your ID
2. Create a file (JSON) with all your data following the standar Persona. We create a merkle tree of all the information. This way we can share anly the information we want to share and the hashes for other information. A nonce will be added whenever needed (DNI) for security reasons.
3. Write in the registry the top of the merkle tree. AT this point thins information is not certified by anyone (not trutsable)
4. Ask for an alias and create the alias in the ANS.
