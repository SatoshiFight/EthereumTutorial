## The Greetings Smart Contract

In this project we will create a smart contract with the state of a single string. There will be one function with expects a string parameter, which updates the string in the state. Thus the only possible transaction is to change the string state.

- npm init
- npm install web3@0.20.0
- npm install solc@0.4.18

The smart contract is written in Greetings.sol.

## Deploying the smart contract the hard way

This section should just be used for understanding. Bellow this section will be a description on how to do it with Truffle, which is a framework to make it easier to work with.

### Compiling the smart contract

- In your terminal start node
- We will be connecting to Ganache in memory ethereum node, but web3 may be established with another one as well.
```
Web3 = require('web3')
```
```
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"))
```

- After this you may use any of the normal api calls you have used directly on the ethereum node, by typing e.g.
```web3.eth.accounts```

- Require the solidity compiler
```solc = require('solc')```

- load the source code via a file stream, then compile it with solc.
```
sourceCode = fs.readFileSync('Greetings.sol').toString()
```
```
compiledCode = solc.compile(sourceCode)
```

### Deploy the smart contract

```
contractABI = JSON.parse(compiledCode.contracts[':Greetings'].interface)
```

- now we create a contract factory based on the ABI, then extract the byte code from the compiled code, and we pass the byte code to the new function on our contract factory.

```
greetingsContract = web3.eth.contract(contractABI)
byteCode = compiledCode.contracts[':Greetings'].bytecode
```


- Finally you deploy the smart contract.
```
greetingsDeployed = greetingsContract.new(
	{
	  data: byteCode, 
	  from: web3.eth.accounts[0], 
	  gas: 4700000
	})
```

### Retrieve an instance of the deployed smart contract

```
greetingsInstance = greetingsContract.at(greetingsDeployed.address)
```

### Call the functions of the smart contract

- getGreetings is a trivial call that doesn't induce a transaction.

```
greetingsInstance.getGreetings()
```

- setGreetings is a call that creates a transaction of type ContractCall.

```
greetingsInstance.setGreetings("Hello, ChainSkills!", {from: web3.eth.accounts[0]})
```