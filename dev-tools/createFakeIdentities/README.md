# Create Fake Identities for developing purposes

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
