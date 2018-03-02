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

## Deploying smart contract via truffle

Previously, we have seen how to do it via the low level method. This time we will use the Truffle development framework for ethereum, which was made to tackle deployment more easily.

- verify that truffle is installed, and is the correct version

```
truffle version
```

- Initialize the project structure

```
truffle init
```

### The truffle project hierarchy

- **contracts directory** - will contain all the solidity contracts
	- the Migrations.sol is used to check which scripts have already run on each network. Makes sure that deployed contracts are not lost accidentally.
- **migrations directory** - logic used during the deployment process. .js files here are sequentially prefixed and are run in sequence when we issue a migration.
	- **1_initial_migration.js** should always run first. It does some bookkeeping regarding migrations.
- **test directory** - highly recommended to test your contracts before deploying them to the main nets. You can use javascript to test your contracts using Moccha.
- **truffle.js** - Configures the environment and more specifically the networks where you want to deploy your smart contract.
	- by default truffle.js is empty, because by default, we use a node with the same concept as ganesh, called itself ganesh, and runs in memory.
- **truffle-config.js** - we can delete it safely.


### Using truffle and creating a deployment

- You need to create a new migration in the migrations folder.
- See ```2_deploy_contracts.js```. When you later call ```migrate```, this will deploy your contract on the Truffle node.

- in terminal go to the root folder of the truffle project

- start develop
```truffle develop```

- This creates a Truffle Ganache node, exposes a port RPC port on 9545, creates 10 accounts that are identical to the ones that Ganache creates.

- In another terminal, you can start 
```truffle develop --log``` to see the log of the node that is running. On the terminal where you actually have truffle running, you will input commands to it.

- If you deploy a contract that was already deployed, the new contract is saved, and the old one is lost. It's still there, but truffle doesn't know where it is anymore.
- Truffle will not recompile the contract if it sees on change in your source code.
- Because of the above reasons, sometimes you may start getting unknown errors, and you would just like truffle to reset itself. So ```--compile-all``` flag will force recompilation of all scripts, and ```--reset``` migrate everything again.

```migrate --compile-all --reset```

- if you use migrate without the flags, it will check in Migrations.sol's last_completed_migration variable, to verify which ones need to be migrated and compiled anew.
- For some issues, deleting the build directory and migrating again will fix them. But when you do that, you lose the address of the contracts you deleted on all networks that you have deployed so far. If you deployed on the main net, that might be an issue.

### Using the contract within truffle

- The truffle console is also used for communicating with the contracts. You may use the code inside them.
- NOTE though, that truffle is not exactly the same as web3. It creates an additional level of abstraction and is for some things used somewhat differently.
- Examples:
	- Greetings.address
	- web3.eth.accounts
	- ```Greetings.deployed().then(function (instance) {app = instance;})```
		- This one stores an instance of the contract inside the ```app``` variable.
	- ```app.getGreetings();```
	- ```app.setGreetings("Hello ChainSkills!", { from: web3.eth.accounts[0] });```
	- ```web3.eth.getTransaction("<transactionHash>")```
	-  ```web3.eth.getBlock("<blockHash>")```

## Deploying directly on Ganache instead of the bundled Truffle Ganache node.

- in ```truffle.js```, you should add a networks object, and within it define the ganache node. By default on Mac OS X, it will be:

```
networks: {
	ganache: {
		host: "localhost",
		port: "7545",
		network_id: "*"
	}
}
```

- after this definition, we may connect to this network via starting truffle with more flags.

```truffle migrate --compile-all --reset --network ganache```

- To now connect to the ganache node with a terminal...

```truffle console --network ganache```

- Then you can use javascript commands the same way as before.