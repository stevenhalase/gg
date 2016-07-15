///// Require elements
var request = require('request');
var cheerio = require('cheerio');

///// Begin match scraping
function scrape() {
  request('https://steamdb.info/search/?a=app&q=league+of+legends' , function (error, response, html) {
    var $ = cheerio.load(html);
    console.log(html)
  })

}
scrape()
