var ChainList = artifacts.require("./ChainList.sol");

// test suite
contract('ChainList', function (accounts) {
    
    var chainListInstance;
    var seller = accounts[1];
    var articleName = "article 1";
    var articleDescription = "Description for article 1";
    var articlePrice = 10;


    it ("should be initialized with empty values", () => {
        return ChainList.deployed().then( (instance) => {
            return instance.getArticle();
        }).then( (article) => {
            console.log("article[3]=", article[3]);
            assert.equal(article[0], 0x0, "seller must be empty");
            assert.equal(article[1], "", "article name must be empty");
            assert.equal(article[2], "", "article description must be empty");
            assert.equal(article[3].toNumber(), 0, "article price must be zero");
        });
    });

    it ("should sell an article", () => {
        return ChainList.deployed().then( (instance) => {
            chainListInstance = instance;
            return chainListInstance.sellArticle(articleName, articleDescription, web3.toWei(articlePrice, "ether"), 
                { from: seller }).then( () => {
                    return chainListInstance.getArticle();
                }).then( (article) => {
                    assert.equal(article[0], seller, "seller must be empty");
                    assert.equal(article[1], articleName, "article name must be empty");
                    assert.equal(article[2], articleDescription, "article description must be empty");
                    assert.equal(article[3].toNumber(), web3.toWei(articlePrice, "ether"), "article price must be zero");
                });
        })
    });

    it ("should trigger an event when a new article is sold", () => {
        return ChainList.deployed().then( (instance) => {
            chainListInstance = instance;
            return chainListInstance.sellArticle(articleName, articleDescription, web3.toWei(articlePrice, "ether"), { from: seller });
        }).then( (receipt) => {
            assert.equal(receipt.logs.length, 1, "one event should have been triggered");
            assert.equal(receipt.logs[0].event, "LogSellArticle", "event should be LogSellArticle");
            assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
            assert.equal(receipt.logs[0].args._name, articleName, "event name must be " + articleName);
            assert.equal(receipt.logs[0].args._price, web3.toWei(articlePrice, "ether"), "event price must be " + web3.toWei(articlePrice, "ether"));
        });
    });

});