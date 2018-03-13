### Good sites to visit with useful information

- https://ethgasstation.info/index.php - Calculations of gas price

## Instaling development environment

- install homebrew

```
brew tap ethereum/ethereum
brew install ethereum
```

- install Ganache from their Github, version 1.0.1
- install latest version of node and npm
- Install Truffle 4.0.4

```
npm install truffle@4.0.4
```
- You can use Atom or Visual Studio Code to code smart contracts.
- Install the Metamask chrome extension

## Creating a private ethereum node

### Create your own private ethereum node

##### Process summary

To establish a new ethereum node the following steps need to be completed:

- **Prepare the node files and configuration** - where you need to create the folder and set it up via puppeth, where you specify your network id and create a genesis block configuration. After that, you will reconfigure the genesis block to your liking.
- **Initialize the node** - Where you need to specify apis that you want to use, RPC and IPC endpoints. This is pretty complex, that's why we use a command that's stored in a bash file.
- **Start the node**
- **Attach to the node** - The node is like a server. We use a javascript API via IPC or RPC

##### Prepare the node files and configuration

- mkdir -p ~/ChainSkills/private
- cd ChainSkills/private

``` puppeth```

- Input your network name
- Choose to configure new genesis
- Choose Ethash - proof-of-work
- Choose the network ID: (we choose 4225)
	- 1: main net
	- 2: Morden test net (obsolete)
	- 3: Ropsten test net
	- 4: Rinkeby test net
	- 42: Kovan test net
	- X: you can chose any for your own private network.
- Manage existing genesis
- Export genesis configuration

##### Initialize the node

- geth --datadir <path>/ChainSkills/private init ChainSkills.json
- (You can replace ChainSkills with another name, but be consistent)

##### Start the node

```chmod +x startnode.sh```

- (Also view the contents inside startnode.sh -> At minute 15 in Setting Up A private node video in the course)
- **Watch out. It's important that you verify in the console output that the IPC endpoint opened is ~/Library/Ethereum/geth.ipc, because all applications look for it there by default!**
- Also note that this path is for Mac OS X, on other system the default directory where ```geth attach``` looks for the IPC enpoints might be different.

##### Attach to the node

- ```geth attach``` . You can also use ```geth attach ipc:\\.\pipe\geth.ipc```
- (Here it's important that IPC endpoint is opened at ~/Library/Ethereum/geth.ipc, because the attach command looks for it there.)
- You can attach to it as an IPC or RPC endpoint. IPC by default. Both have their advantages.
- After this, you can use the REPL to try out javascript commands. To see some commands, look bellow in the cheatsheets.


##### Warnings

- Restating the IPC problem. Make sure that you are setting up the correct IPC enpoint, on Mac OS X, this is ~/Library/Ethereum/geth.ipc.
- Make sure that there is no space in the list of modules in --rpcapi parameter, or you will get errors saying certain functions are unavailable.
- Always make sure that only one ethereum node is running on your machine. Either testrpc, private node or Mist's own geth! Truffle may get confused and produce unexpected and unpredictable results. You should always run exactly one ethereum node!
- You can though use ```geth attach ipc://Users/sarbogast/ChainSkills/private/geth.ipc``` to specify your own ipc endpoint.
- It is also possible to attach a Geth console over the HTTP endpoint instead of the IPC one, but if you do so, you will not have access to all the modules in the Geth console, so you will get "undefined function" errors a lot later.

## Cheatsheets:


### Some commands to write when attached via geth

Comprehensive list of commands is on https://github.com/ethereum/go-ethereum/wiki/JavaScript-Console

##### basic (initializing, unlocking, checking balance)

- eth.accounts
- eth.coinbase - the main address that's used for mining rewards.
- miner.stop()
- miner.start()
- miner.start(#threads)
- net.version - network identifier
- personal.unlockAccounts(eth.accounts[1], "pass1234", 300)
	- The last parameter is the duration for which you want the account to be unlocked
	- Unlocking the account means this. The private key is actually encrypted by the password. Until you input the password and unlock it, you cannot commit trasaction even though you have the private key.
- personal.unlockAccounts(eth.accounts[0])
	- Will unlock the account for 10 minutes and will ask you to input the password.

#### transactions and balances

- eth.getBalance(eth.accounts[0])
- web3.fromWei(eth.getBalance(eth.coinbase), "ether");
- eth.sendTransaction({from: eth.coinbase, to: eth.accounts[1], value: web3.toWei(10, "ether")})
	- after this a transaction will be submitted and you can view it in the terminal where the geth node is running!