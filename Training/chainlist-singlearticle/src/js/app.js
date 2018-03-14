App = {
  web3Provider: null,
  contracts: {},
  account: 0x0, // our user defined variable

  init: function() {
    // load articlesRow
    // this.createArticle();

    return App.initWeb3();
  },

  createArticle: function () {
    var articlesRow = $('#articlesRow');
    var articleTemplate = $('#articleTemplate');

    articleTemplate.find('.panel-title').text('article 1');
    articleTemplate.find('.article-description').text('Desription for article 1');
    articleTemplate.find('.article-price').text("10.23");
    articleTemplate.find('.article-seller').text("0x1234567890123456890");

    articlesRow.append(articleTemplate.html());
  },

  initWeb3: function() {
    
    // initialize web3
    if (typeof web3 !== 'undefined') {
          // reuse the provider injected by metamask
          App.web3Provider = web3.currentProvider;
    } else {
          // create a new provider and plug it directly into our local node
          // we'll use the ganache node
          App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
    
    // display the account balance and address on the top bar of our application
    App.displayAccountInfo();

    return App.initContract();
  },

  displayAccountInfo: function () {
      web3.eth.getCoinbase(function (err, account) {
            if (err === null) {
                  App.account = account;
                  $('#account').text(account);
                  console.log(account);
                  web3.eth.getBalance(account, function (err, balance) {
                        if (err == null) {
                              $('#accountBalance').text(web3.fromWei(balance, "ether") + ' Eth');
                        }
                  });
            }
      });
  },

  initContract: function() {
    $.getJSON('ChainList.json', function (chainListArtifact) {
      // get the contract artifact file and use it to instantiate a truffle contract
      // abstraction.
      App.contracts.ChainList = TruffleContract(chainListArtifact);
      // need to set the provider for our contract
      App.contracts.ChainList.setProvider(App.web3Provider);
      App.listenToEvents();
      // retrieve the article from the contract
      return App.reloadArticles();
    });
  },

  reloadArticles: function () {
      // refresh account information because the balance might have changed
      App.displayAccountInfo();

      // retrieve the article placeholder and clear it
      $('#articleRow').empty();

      App.contracts.ChainList.deployed().then ((instance) => {
            return instance.getArticle();
      }).then ( (article) => {
            if (article[0] == 0x0) {
                  // no article
                  return;
            } 

            var price = web3.fromWei(article[4], 'ether');

            // retrieve the article template and fill it
            var articleTemplate = $('#articleTemplate');
            articleTemplate.find('.panel-title').text(article[2]);
            articleTemplate.find('.article-description').text(article[3]);
            articleTemplate.find('.article-price').text(price);//web3.fromWei(price, "ether"));
            articleTemplate.find('.btn-buy').attr('data-value', price);

            // redefine the seller
            var seller = article[0];
            if (seller == App.account) {
                  seller = "You";
            }
            articleTemplate.find('.article-seller').text(seller);

            // redefine the buyer
            var buyer = article[1];
            if (buyer == App.account) {
                  buyer = "You";
            } else if (buyer == 0x0) {
                  buyer = "No one yet";
            }
            articleTemplate.find('.article-buyer').text(buyer);
            
            // add the buy button if the buyer is not the same as the seller
            articleTemplate.find('.btn-buy').show();
            /*if (article[0] == App.account || article[1] != 0x0) {
                  articleTemplate.find('.btn-buy').hide();
            } else{
                  articleTemplate.find('.btn-buy').show();
            }*/

            // add this article
            $('#articlesRow').append(articleTemplate.html());
      }).catch ( (err) => {
            console.error(err);
      });
  },

  sellArticle: function () {
        var _articleName = $('#article_name').val();
        var _description = $('#article_description').val();
        var _price = web3.toWei(parseFloat($('#article_price').val() || 0), "ether");

        if ((_articleName.trim() == '') || (_price == 0)) {
            // nothing to sell
            return false;
        }

        App.contracts.ChainList.deployed().then( (instance) => {
            console.log(instance);
            return instance.sellArticle(_articleName, _description, _price, 
                  { from: App.account, gas: 500000 });
        }).then( (result) => {
            App.reloadArticles();
        }).then( (err) => {
            console.log(err);
        }); 
  },

  buyArticle: function () {
      event.preventDefault();

      // retrieve the article price
      var _price = parseFloat($(event.target).data('value'));

      App.contracts.ChainList.deployed().then( function (instance) {
            return instance.buyArticle({
                  from: App.account,
                  value: web3.toWei(_price, "ether"),
                  gas: 500000
            });
      }).catch(function (error) {
            console.log(error);
      });
  },

  listenToEvents: function () {
      App.contracts.ChainList.deployed().then ( function (instance) {
            instance.LogSellArticle({},{}).watch(function (error, event) {
                  if (!error) {
                        $('#events').append('<li class="list-group-item">' + event.args._name + ' is now for sale</li>')
                  } else {
                        console.error(error);
                  }
                  App.reloadArticles();
            });

            instance.LogBuyArticle({},{}).watch(function (error, event) {
                  if (!error) {
                        $('#events').append('<li class="list-group-item">' + event.args._buyer + ' bought ' + event.args._name + '</li>')
                  } else {
                        console.error(error);
                  }
                  App.reloadArticles();
            });
      });
   }
}

$(function() {
  $(window).load(function() {
    App.init();
  });
});
