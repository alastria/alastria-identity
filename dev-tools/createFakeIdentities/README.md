# Create Fake Identities for developing purposes

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
Launch an HTTP Server and open your favourite browser
```
python -m http.server 8080
```
The script is configured to work with Ganache. If you want a different one, just change line 21 of createFakeIdentities.js to choose your option
```javascript
// Environment selection
const envs = {
	GANACHE : 'ganache',
	LOCAL_ALASTRIA : 'local_alastria',
	ALASTRIA : 'alastria'
}
var env = envs.GANACHE;
```
If your option is not preconfigured, please, be a good guy: add a new case sentence in the switch(env) and create a pull request in this repository :two_hearts:

Enjoy it!
