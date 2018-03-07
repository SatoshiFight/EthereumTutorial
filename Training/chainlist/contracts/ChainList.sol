pragma solidity ^0.4.18;

contract ChainList {

    // state
    address seller;
    string name;
    string description;
    uint256 priceWei;

    // constructor
    /*
    function ChainList () public {
        sellArticle("Default article", "This is an article set by default", 10000000000000);
    }
    */

    // events
    event LogSellArticle(
        address indexed _seller, // indexed means that it will be possible to filter
        // by address of the seller. They are like keys in a database.
        string _name,
        uint256 _price
    );

    // sell an article
    function sellArticle(string _name, string _description, uint256 _price) public {
        seller = msg.sender; // get the address from the caller
        name = _name;
        description = _description;
        priceWei = _price;

        LogSellArticle(seller, name, priceWei);
    }

    // get an article
    function getArticle() public view returns (
            address _seller, 
            string _name, 
            string _description,
            uint256 _price) {
        return (seller, name, description, priceWei);
    }
}