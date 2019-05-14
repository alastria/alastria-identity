#!/bin/bash
contracts=find "./contracts" -name '*.sol' -exec printf '%s ' {} \;  
echo $contracts
#º./node_modules/solc/solcjs
