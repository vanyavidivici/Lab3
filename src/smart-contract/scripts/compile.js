const fs = require('fs');
const path = require('path');
const solc = require('solc');

const contractPath = path.resolve(__dirname, '../contract/FundraisingContract.sol');
const source = fs.readFileSync(contractPath, 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        'FundraisingContract.sol': {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*'],
            },
        },
    },
};
const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
    output.errors.forEach((err) => {
        console.error(err.formattedMessage);
    });
    throw new Error('Compilation failed');
}

const contractName = 'FundraisingContract';
const abi = output.contracts['FundraisingContract.sol'][contractName].abi;
const bytecode = output.contracts['FundraisingContract.sol'][contractName].evm.bytecode.object;

module.exports = { abi, bytecode };