# Create fake identities for developing purposes
## What it does
This program initially creates 5 fake identities
```
accounts[0] is Entity 1 (Issuer and Service Provider)
accounts[1] is Entity 2 (Issuer and Service Provider)
accounts[2] is Subject 1
accounts[3] is Subject 2
accounts[4] is Subject 3
```
You can add more entities or subjects calling the last two functions.
```javascript
function createFakeEntity(){...}
function createFakeSubject(){...}
```
## How to use it
Launch an HTTP Server, open your favourite browser and interact with the buttons.
```
python -m http.server 8080
```
The script is configured to work with Ganache by default. If you want to use a different environment, just change line 21 of createFakeIdentities.js to choose your option
```javascript
// Environment selection
const envs = {
	GANACHE : 'ganache',
	LOCAL_ALASTRIA : 'local_alastria',
	ALASTRIA : 'alastria'
}
var env = envs.GANACHE;
```
If your option is not preconfigured, please, be a good guy: add a new case sentence in the switch(env) and create a pull request in this repository :innocent:

Enjoy it!

Also, you have a bunch of deployed identities and identity smart contracts in Telsius:

# Alastria Identities 

##Alastria Identity Manager: 0xf18bd0f5a4f3944f3074453ce2015e8af12ed196

##Alastria Public Key Registry: 0x0b337E2aC98a9725615dE042E950dD8C8b66b0fA
##Alastria Credential Registry: 0xE4f91b47399Dc2560025Aafb4fFA7Cd5C483330e
##Alastria Presentation Registry: 0x8e78E1BfBdcD1564309d86d4925fCF533a6dcBC8

##Service Provider: 0x643266eb3105f4bf8b4f4fec50886e453f0da9ad
Password: Passw0rd
Added in tx hash: 
```
0x30741fcd02d3faf8c362a22fa9ae1b6738a680c951e944eace33ac25942f1f63
```

##Issuer: 0x806bc0d7a47b890383a831634bcb92dd4030b092
Password: Passw0rd
Added in tx hash: 
```
0xfe01429627d8150952cd15cc52c35a6076f655812ce5cff5a4feb9d82abb5af9
```

##Identity 1: 0xa9728125c573924b2b1ad6a8a8cd9bf6858ced49
Password: Passw0rd
Create identity transaction:
```
{
	from: "0xa9728125c573924b2b1ad6a8a8cd9bf6858ced49",
	to: "0xf18bd0f5a4f3944f3074453ce2015e8af12ed196",
	data: "0x6d69d99a0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002460e6cfd87fdf96e9f8749d267319088775ad1cc245e5cd9fa0d6567426788a3ea10e675e00000000000000000000000000000000000000000000000000000000",
	gas: 409452
}
```
hash:
```
0x9b6a123e19ba94b46992328657e59c98221323e129a8a159cadf80a0ae854c69
```
DID:
```
did:ala:quor:telsius:0x47c144879C64558128B8C2FDDC28705649E2F839
```
PublicKey(Used as raw signature):
```
7fdf96e9f8749d267319088775ad1cc245e5cd9fa0d6567426788a3ea10e675e
```
##Identity 2: 0xad88f1a89cf02a32010b971d8c8af3a2c7b3bd94
Password: Passw0rd
Create identity transaction:
```
{
	from: "0xad88f1a89cf02a32010b971d8c8af3a2c7b3bd94",
	to: "0xf18bd0f5a4f3944f3074453ce2015e8af12ed196",
	data: "0x6d69d99a0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002460e6cfd87fdf96e9f8749d267319088775ad1cc245e5cd9fa0d6567426788a3ea10e675e00000000000000000000000000000000000000000000000000000000",
	gas: 409452
}
```
hash:
```
0xcd93ee4d59cf94e2450c66888300bc5057d1d19c34ff3998623c49f4f52e98cc
```
DID:
```
did:ala:quor:telsius:0x5628C8F7e66d3a628F089f1a6D5C93cb3D10c552
```
PublicKey(Used as raw signature):
```
7fdf96e9f8749d267319088775ad1cc245e5cd9fa0d6567426788a3ea10e675e
```
##Identity 3: 0xde7ab34219563ac50ccc7b51d23b9a61d22a383e
Password: Passw0rd
Generated acces token in tx hash: 0x960e6fcdd1a8a527a78d82fe644893ddad06926cc28a7d75bf7cf3ac41461d3b
Create identity transaction:
```
{
	from: "0xde7ab34219563ac50ccc7b51d23b9a61d22a383e",
	to: "0xf18bd0f5a4f3944f3074453ce2015e8af12ed196",
	data: "0x6d69d99a0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002460e6cfd87fdf96e9f8749d267319088775ad1cc245e5cd9fa0d6567426788a3ea10e675e00000000000000000000000000000000000000000000000000000000",
	gas: 409452
}
```
hash:
```
0xd980d40b34d6a6040a6bcca23db174e7286f04621250b8f58201524eac5202d1
```
DID:
```
did:ala:quor:telsius:0xC096B3e0CF9891F947710Af54209eBDEf9774ef4
```
PublicKey(Used as raw signature):
```
7fdf96e9f8749d267319088775ad1cc245e5cd9fa0d6567426788a3ea10e675e
```