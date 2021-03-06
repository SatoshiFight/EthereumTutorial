## Chainlist application

This application is about adding an "article" to be sold on the blockchain. For now, the user can just put an article up on the blockchain, and if any new user does the same that means that he will just 

- This was created from the chainskills/chainskills-box truffle box. Truffle boxes are template projects that serve as the basis for your application.
- You can create this in an empty folder by writing
```truffle unbox chainskills/chainskills-box```
Which will retrieve it from their github repository.

- Advice: Use Ganache to debug and do things on the node and contracts instead of the native Truffle Ganache node. The native node runs on a specified network id and you can't change it, which can cause problems when using metamask. The Ganache node provides more flexibility. It's default network ID is ```5777``` and the RPC server is running on ```127.0.0.1:7545```.

- Also note, the Ganesh generated 10 accounts are deterministic and unlocked indefinitely! Which is very practical for development purposes!

### Run a node and deploy the contracts
- Run Ganache. This will start a new node in memory and give you the UI.
- From the console execute
```
truffle migrate --network ganache
```
```
truffle console --network ganache
```
- Also make sure that the ganache network is defined in ```truffle.js```


## Testing the application

- You can use multiple environments to test
- You can use truffle develop or Ganache to test, because they are faster and have specific features for testing.
- You can use geth to create your own private ethereum node, and use the same settings as in production networks.
- You can use a public testnet like Rothstein or Rinkeby as an acceptace environment. Here you have the opportunity to share your address and solutions with testers.

Truffle provides a testing framework, and provides two ways of testing.

###### Testing options

- Javascript test, to test your smart contract from the client side point of view.
- Solidity, to test your SC within the blockchain, creating another SC to test the interaction with yours. Testing with solidity is quite new and is not a very documented option.

In this course we will focus on javascript testing.
**Note that testing on a blockchain is a lot more critical than in other applications, because smart contracts manipulate value!**

Also in the current state of the environment, you can't rely on the compiler to warn you about bugs. There is no static analysis tool or formal verification process for smart contracts.

**Your tests and code review are the best tools you've got to rid your contracts of all their bugs. You have been warned.**

### Javascript tests

- Use Moccha
- Use Chya, as a behavior driven assertion library.

View ```test/ChainListHappyPath.js``` to view how to test the ```getArticle()``` and ```sellArticle()``` methods.

Warning: each test will redeploy the contract to the net, which costs gas. This is why you don't run tests on the main net. Only on the private net!

## Perparing the frontend for the application

This project relies of the chainskills truffle box. There are already some dependencies installed via npm, stated in the ```package.json```.

- Navigate to the root of the project directory.
- Run ```npm install``` to install the frontend dependencies.
- Use ```npm run dev``` to run the frontend. This will host it on ```localhost:3000```.

With npm, we install ```lite server```, which is used to host our web application. Also includes express.

### html

- Check the ```index.html``` file to see how the page is structured. It's basically plain bootstrap html.

### javascript

- Check the ```app.js``` file to see what we do it in.

### Connecting the frontend to the blockchain

- We will use the ```.json``` files in the ```build``` folder to actually communicate with the contracts.

- Instead of rendering our own arbitrary article, we are going to retrieve it from the blockchain.

- We do this using ```web3.js```, which is a connector application that lets frontend use the blockchain.
	- You need to bind ```web3``` to a provider.
	- **Metamask case: If you have metamask enabled, a web3 instance will be injected into the window object of your web page, in other cases, you need to define the address of the http provider that hosts your ethereum node.**.
	- We will now adapt ```app.js``` to either create a new instance of Web3, or use an existing one.

##### Connect directly without using metamask

- Disable metamask in your browser

- In the initWeb3 function, we either get the injected provider or create a new one, which is the localhost Ganache instance in our case. Then we initialize the web3 instance, and retrieve the account balance and address from it, to display it.

- In the ```initContract``` function, we need to load the ```ChainList.json``` from the build, to be able to access our contract. Then set the provider. This can all be done thanks to the ChainSkills truffle box, using just jQuery. You can see the configuration of the lite server from which you retrieve the json file in ```bs-config.json```. there you can see which files are accessible from the root of the application.

- This has been added to ```app.js``` so check it out.

##### Connect using metamask

This will be explained in the next chapter directly, when we sell articles through metamask.

### Selling an article from the frontend

- In ```app.js``` we have defined a ```sellArticle``` function which will call a method with the defined parameters on the blockchain. To the ```index.html``` we needed to add a click event to call this function to the submit button.

- **When you sell an article to the blockchain, you can view the transaction that resulted. You can use any hex to string converter to translate the data payload of the transaction, and you'll see that the arguments for the function are packed into the payload!**

##### Selling the article through metamask

- enable metamask and connect to the ganache node. Then switch to the first ganache account.

- **Warning: if metamask displays an error with nonce, it may be because it is out of sync with the ganache node. This happens because we frequently restart the ganache node and metamask does not assume it. The problem is in the network ID. This is easily changeable within Ganache, so just set it from 5777 to for example 5778. Switch on metamask to main net and then back.**

### Events in ```SmartContract```s

- We need a mechanism to get notified automatically when a new thing that is concerning us is posted on the blockchain. Right now we have to poll or reload the page, which kind of sucks.

- Ethereum provides a feature called ```events```.

- In ```ChainList.sol``` view the ```sellArticle``` function, which calls an event.

- In the truffle console do

```
ChainList.deployed().then((instance) => {app = instance});
```
```
var sellEvent = app.LogSellArticle({}, {fromBlock: 0, toBlock: 'latest'}).watch( (error, event) => console.log(event))
```
To stop watching you can use ```sellEvent.stopWatching();```.

- To view only the last event, use this command:
```sellEvent = app.LogSellArticle({},{}).watch((err, event) => console.log(event));```

Getting only the last event is a good idea when possible, because large calls like all of the logs can have an impact on the node, and even metamask may reject such a call.

##### Add a javascript test for the event

- The ```"should trigger and event when a new article is sold"``` test asserts whether the smart contract truly publishes an event after the action of selling has been committed.

##### SmartContract events in javascript

- In ```app.js``` there is a function ```listenToEvents``` which we call from the ```initContract``` function.

## Deploying the application on a private network

- For this, you need to update your truffle to 4.0.7.
```
npm uninstall -g truffle
npm instasll -g truffle@4.0.7
```

- This starts at lecture 53 in the course.

- Why would I even want to deploy to a private network when I have Ganache?
	- Private is closer to the real world scenario. Ganache is great because it speeds up your development, but every once in a while you should deploy to a private network.
		- Ganache: in memory, 1 transaction per block, Near-synchronous tx, accounts unlocked by default.
		- Private: on disc, N transactions per block,  long transaction confirmation times, locked accounts.

## Buy an article

### Update the smart contract
- constraints
	- ensure that there is an article to buy
	- is still available to purchase
	- buyer and seller are not the same
	- value passed to the function is the same as the price of the article.

- In the ```ChainList``` smart contract, we add a new event ```LogBuyArticle``` and a new function ```buyArticle```, which is labeled as ```payable```. This is the first function where we are able to transfer value in ether from one account to another.

- **New lesson**: assert (internal errors), require (preconditions), throw (legacy), revert (imperative exceptions)
	- in common they have that when they fail, the value is refunded to the caller.
	- all changes to state variables in reverted
	- function interrupted, so no more gas will be spent
	- all gas spent so far is not refunded
	- REVER opcode is returned. This is like an exception.

- ```address``` variables has 2 ways of sending value:
	- ```someaddr.send(msg.value);``` - will return true or false. It's up to you to revert the transaction if this fails!
	- ```someaddr.transfer(msg.value);``` - Like send, but will automatically throw a revert style exception if it fails. (Example the balance is not large enough).

- When a contract receives funds, then it's basically it's value! When a function is called, the caller gives the value to the contract, and relies on it that it will send the value to whomever needs to actually receive it.

- In truffle, you can call this function by using
```app.buyArticle({from: web3.eth.accounts[2], value: web3.toWei(10, 'ether')})```

### Testing the buy article function

- The principle is very similar, you should check out ```ChainListHappyPath.js```. We also added a new file that is meant to test exceptions called ```ChainListExceptions.js```. HappyPath tested if the cases where everything should flow as expected really does so, but the exceptions file will check if we are throwing exceptions where appropriate.

### The buying article frontend

- These will be the changes:
	- display the address of the buyer in the list
		- This is just a matter of adding another span to the article template in ```index.html```.
	- add a button to buy the article
		- add another button into ```index.hmtl```, where we set up a click function to ```buyArticle()```
		- Next we need to implement the click function in ```app.js.```
		- Also we need to update the reload article function, to account for the new attributes about the buyer and the ability to buy in itself.

## List of articles

This part will be focused on the ability not to just sell one article, but a whole list of articles. Here, we will meet more advanced data types and structures:
	- mappings
	- structures
	- loops
	- arrays
	- **memory vs storage**

### Updating the smart contract

- We will add a new structure to hold all the data for each article, instead of having global variables within the contract.

```
struct Article {
	uint id;
	address seller;
	address buyer;
	string name;
	string description;
	uint256 price;
}
```

- We will add a mapping now!
	- The mapping is very limited. There is no way to know the size of the mapping, no way to iterate over it or even verify whether the key exists. Only thing you can do is change the value associated with it, or retrieve it. If a key is not associated to any value, then it will default to 0.

```
mapping (uint => Article) public articles;
uint articleCounter; // because there's no way to keep track of map size, we keep the number of articles in here.
```

- Now we have to change the sellArticle() implementation.
	- we need to now use the mapping as an array and assign the articles increasingly higher integer keys, and keep track of the highest value.

- Next you need to change buyArticle(uint _id)

**how to use mappings and structs**
```
articles[id] = Article(articleCounter, ... args);
Article storage article = articles[id];
article.buyer = addr;
```

- **Solidity limitation: You can't return an array of structure times at this moment. So your best bet is to return ids.**

### Tests in list of articles

- Just copied and skipped this part, as when you see the tests they are very self-explanatory.

### Frontend for list of articles

- Adjusted the frontend - now it is able to render all of the articles and you can buy any one of them. There was nothing much new about it. The major changes were made in the smart contract.

## Debugging a function
- in the truffle console you may use
```debug <tx hash>```
- example:
```debug '0x912374y59248237h23917hc'```
- Debugger won't give you a lot of information, but it will tell you exactly where the exception was thrown.

- **WHAT IS THE DIFFERENCE BETWEEN STORAGE AND MEMORY?**

## Deactivating a contract

- You need to call the selfdestruct function.
	- It has parameter that's an address. This is the address to send all the funds that are still in the smart contract.
	- You need to only allow the contract owner to be able to call the self-destruct function

- To do:
	- Create a new global variable called ```address owner```
	- Create a constructor, where you save the address that deployed the contract as the contract owner
	- Create the destructor
- **It's very important to commmunicate to your users when they should not use the contract anymore, because the functions may still be called, and you will waste ether, but the state will not be changed.**

- ```https://ens.domains/``` - domain name on ethereum (DNS).

# ChainSkills Truffle Box

This Truffle Box has all you need to create a DApp by following the course delivered by [ChainSkills](https://www.udemy.com/getting-started-with-ethereum-solidity-development/).

This box has been based from [pet-shop-box](https://github.com/truffle-box/pet-shop-box).

## Installation

1. Install Truffle globally.
    ```javascript
    npm install -g truffle
    ```

2. Download the box. This also takes care of installing the necessary dependencies.
    ```javascript
    truffle unbox chainskills/chainskills-box
    ```

3. Run the development console.
    ```javascript
    truffle develop
    ```

4. Compile and migrate the smart contracts. Note inside the development console we don't preface commands with `truffle`.
    ```javascript
    compile
    migrate
    ```

5. Run the `liteserver` development server (outside the development console) for front-end hot reloading. Smart contract changes must be manually recompiled and migrated.
    ```javascript
    // Serves the front-end on http://localhost:3000
    npm run dev
    ```
