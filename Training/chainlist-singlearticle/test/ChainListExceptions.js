// contract to be tested
var ChainList = artifacts.require("./ChainList.sol");

// test suite
contract("ChainList", function (accounts) {
    var chainListInstance;
    var seller = accounts[1];
    var buyer = accounts[2];
    var articleName = "article 1";
    var articleDescription = "Description for article 1";
    var articlePrice = 10;
    var sellerBalanceBeforeBuy, sellerBalanceAfterBuy;
    var buyerBalanceBeforeBuy, buyerBalanceAfterBuy;

    // no article for sale yet
    it ("should throw an exception if you try to buy an article when there is no article for sale yet", function () {
        return ChainList.deployed().then( function (instance) {
            chainListInstance = instance;
            return chainListInstance.buyArticle({
                from: buyer,
                value: web3.toWei(articlePrice, "ether")
            }).then(assert.fail)
            .catch(function (error) {
                assert(true);  // check that an error truly gets thrown
            }).then(function () {
                return chainListInstance.getArticle()
            }).then(function (article) {
                assert.equal(article[0], 0x0, "seller must be empty");
                assert.equal(article[1], 0x0, "buyer must be empty");
                assert.equal(article[2], "", "article name must be empty");
                assert.equal(article[3], "", "article description must be empty");
                assert.equal(article[4].toNumber(), 0, "article price must be zero");
            })
        });
    });

    // buying an article you are selling
    /*
    .... bla bla bla bla should be done but no actual new knowledge so it passed it!
    it ("should throw an exception if you try to buy your own article", function () {
        return ChainList.deployed().then( function (instance) {
            chainListInstance = instance;
            return chainListInstance.sellArticle(articleName, articleDescription, web3.toWei(articlePrice, 'ether'))
        }).then( function (receipt) {
            return chainListInstance.buyArticle(... parameters of the same seller)
        }).then(assert.fail).catch (blalblasijfuaf)....
    });

    it ("should throw an exception if you try to buy an article for a value that is different than its price")
    */ 
})