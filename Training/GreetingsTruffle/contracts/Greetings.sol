pragma solidity ^0.4.18;

contract Greetings {
    
    string message; // internal state of the contract

    // constructor gets called exactly once, when the contract is
    // first deployed.
    function Greetings () public {
        message = "I'm ready";
    }

    // public methods can be called from outside our contract.
    function setGreetings(string _message) public {
        message = _message;
    }

    // the view property means that this function doesn't change
    // the state of the contract, so calling it won't require a transaction.
    function getGreetings() public view returns (string) {
        return message;
    }

}