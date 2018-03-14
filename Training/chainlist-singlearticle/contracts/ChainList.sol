pragma solidity ^0.4.18;

contract ChainList {

    // state
    address seller;
    address buyer;
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

    // buy article event
    event LogBuyArticle(
        address indexed _seller,
        address indexed _buyer,
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
            address _buyer,
            string _name, 
            string _description,
            uint256 _price) {
        return (seller, buyer, name, description, priceWei);
    }

    // buy an article
    function buyArticle() payable public {
        // if a function is labeled as payable, this means that you can send value to it.
        // the value is stored in msg.value;


        // we check whether there is an article for sale
        require(seller != 0x0);

        // we check that the article has not been sold yet
        require(buyer == 0x0);

        // we don't allow the seller to buy his own article
        require(msg.sender != seller);

        // we check that the value sent corresponds to the price of the article
        require(msg.value == priceWei);

        // keep buyer's information
        buyer = msg.sender;

        // the buyer can pay the seller
        seller.transfer(msg.value);

        // trigger the event
        LogBuyArticle(seller, buyer, name, priceWei);
    }
}