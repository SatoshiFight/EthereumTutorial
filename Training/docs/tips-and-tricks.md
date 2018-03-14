### Function modifiers

You may create modifiers to just put up into the function signature, which will then execute some other code before you actually execute the function. Can be very useful in generic cases - For functions which share their first few lines or so.

modifier onlyOwner () {
	require(msg.sender == owner);
	_;
}

function kill() public onlyOwner {
	selfdestruct(owner);
}

### Inheritance

- Check it in ```Ownable.sol``` in the ChainList application. 

### Abstract contracts, interfaces

http://solidity.readthedocs.io/en/latest/contracts.html#inheritance

