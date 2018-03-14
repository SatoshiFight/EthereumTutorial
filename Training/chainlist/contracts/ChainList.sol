pragma solidity ^0.4.18;

import "./Ownable.sol";

contract ChainList is Ownable {

    // custom types
    struct Article {
        uint id;
        address seller;
        address buyer;
        string name;
        string description;
        uint256 priceWei;    
    }

    // state variables
    mapping (uint => Article) public articles; // making it public creates a getter, so that you are able to retrieve it using articles(id).
    uint articleCounter = 0;

    // constructor
    /*
    function ChainList () public {
        sellArticle("Default article", "This is an article set by default", 10000000000000);
    }
    */

    // events
    event LogSellArticle(
        uint indexed id,
        address indexed _seller, // indexed means that it will be possible to filter
        // by address of the seller. They are like keys in a database.
        string _name,
        uint256 _price
    );

    // buy article event
    event LogBuyArticle(
        uint indexed id,
        address indexed _seller,
        address indexed _buyer,
        string _name,
        uint256 _price
    );

    // deactivate the contract
    function kill() public onlyOwner {

        // only allow the contract owner to call this function
        require(msg.sender == owner);

        selfdestruct(owner);
    }

    // sell an article
    function sellArticle(string _name, string _description, uint256 _price) public {
        
        articleCounter++;

        articles[articleCounter] = Article(
            articleCounter,
            msg.sender,
            0x0,
            _name,
            _description,
            _price
        );

        LogSellArticle(articleCounter, msg.sender, _name, _price);
    }

    // fetch the number of articles in the contract
    function getNumberOfArticles() public view returns (uint) {
        return articleCounter;
    }

    // fetch and return all article IDs for articles still for sale
    function getArticlesForSale() public view returns (uint[]) {
        // prepare output array
        uint[] memory articleIds = new uint[](articleCounter); // by default variables are stored in storage. Which is much more expensive than storing it in memory.

        uint numberOfArticlesForSale = 0;

        // interate over articles
        for (uint i = 1; i <= articleCounter; i++) {
            // keep the ID if the article is still for sale
            if (articles[i].buyer == 0x0) {
                articleIds[numberOfArticlesForSale] = articles[i].id;
                numberOfArticlesForSale++;
            }
        }

        // copy the articleIds array into a smaller forSale array
        uint[] memory forSale = new uint[](numberOfArticlesForSale);
        for (uint j = 0; j < numberOfArticlesForSale; j++) {
            forSale[j] = articleIds[j];
        }
        return forSale;
    }

    // buy an article
    function buyArticle(uint _id) payable public {
        // if a function is labeled as payable, this means that you can send value to it.
        // the value is stored in msg.value;


        // we check whether there is an article for sale
        require(articleCounter > 0);

        // we check that the article exists
        require(_id > 0 && _id <= articleCounter);

        // we retrieve the article from the mapping
        Article storage article = articles[_id];

        // we check that the article has not been sold yet
        require(article.buyer == 0x0);

        // we don't allow the seller to buy his own article
        require(msg.sender != article.seller);

        // we check that the value sent corresponds to the price of the article
        require(msg.value == article.priceWei);

        // keep buyer's information
        article.buyer = msg.sender;

        // the buyer can pay the seller
        article.seller.transfer(msg.value);

        // trigger the event
        LogBuyArticle(_id, article.seller, article.buyer, article.name, article.priceWei);
    }
}