# CODE QUALITY

## References

* [NodeJs and npm tool](https://nodejs.org/es/download/package-manager/). 
* [Truffle framework](http://truffleframework.com/): Life cycle for solidity.
* [Ganache](http://truffleframework.com/ganache/): Light node of Ethereum for testing purpose.
* [Solium](https://github.com/duaraghav8/Solium): Linter & security static analysis.
* [Mythril](https://github.com/ConsenSys/mythril/wiki): Security analysis.

## Rules:

1. Code coverage of smart contracts up to 100%.
2. Solium can not find any error message.
3. Mythril can not find any error message.

Only if all rules pass, a new pull request must be accepted.

## Installation on ubuntu linux

```
$ sudo npm install -g truffle
$ sudo npm install -g ganache-cli
$ sudo npm install -g solium
$ sudo apt-get update
$ sudo apt-get install -y software-properties-common
$ sudo add-apt-repository -y ppa:ethereum/ethereum
$ sudo apt-get update
$ sudo apt-get install -y solc
$ sudo apt-get install libssl-dev
$ sudo apt-get install -y python3-pip=9.0.1-2 python3-dev
$ sudo ln -s /usr/bin/python3 /usr/local/bin/python
$ sudo apt-get install -y pandoc
$ sudo apt-get install -y git
$ pip3 install mythril
```

# QUALITY OF CODE VERIFICATION

From root path of truffle project:

```
$ echo "[ ] Calculating tests code coverage"
$ node_modules/.bin/solidity-coverage
$ echo "[ ] Linter and static analysis with Solium"
$ solium -d contracts/
$ echo "[ ] Security analysis with Mythril"
$ myth --truffle
```
