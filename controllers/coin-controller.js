const cheerioAdv = require('cheerio-advanced-selectors');
const cheerio = cheerioAdv.wrap(require('cheerio'));
const axios = require('axios');

function Coin(rank, name, imgUrl, price, marketCap, change24, trend) {
  this.rank = rank;
  this.name = name;
  this.imgUrl = imgUrl;
  this.price = price;
  this.marketCap = marketCap;
  this.change24 = change24;
  this.trend = trend;
}

function scrape(req, res) {
  axios.get("https://coinranking.com/")
    .then(function (response) {
      const $ = cheerio.load(response.data)
      var rank$ = 1;
      var name$ = $('.coin-name')
      var imgUrl$ = $('.coin-list__body__row__cryptocurrency__prepend__icon__img')
      var price$ = $('.coin-list__body__row__price__value')
      var marketCap$ = $('.coin-list__body__row__market-cap__value')
      var change24$ = $('.coin-list__body__row__change')
      var trend = null;
      var coinArr = []
      for (var i = 0; i < name$.length; i++) {

        if ($(change24$[i]).attr('class').includes('negative')) {
          trend = "negative" 
        }
        else {
          trend = "postive"
        }
        var newCoin = new Coin(
          rank$++,
          $(name$[i]).text(),
          $(imgUrl$[i]).attr('src'),
          parseFloat($(price$[i]).text().replace(/,/g,"")),
          parseFloat($(marketCap$[i]).text().replace(/,/g,"")),
          $(change24$[i]).text().trim(),
          trend 
        )
        coinArr.push(newCoin)
      }



      res.json(coinArr)
    })
    .catch(function (error) {
      res.json(error)
    })

}

module.exports = {
  scrape
}