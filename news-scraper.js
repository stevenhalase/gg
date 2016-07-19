///// Require elements
var request = require('request');
var cheerio = require('cheerio');

///// Begin match scraping
function scrape(nameQuery, callback) {
  request('http://n4g.com/channel/' + nameQuery , function (error, response, html) {
    var $ = cheerio.load(html);
    // console.log(html)
    var contents = $('.si-content')
    console.log(contents.length)
    var newsArticles = []
    // console.log(contents[0].children[0].next.children[0].children[0].data)
    var iterations = 5;
    if (contents.length < 5) {
      callback([])
    } else {
      for (var i = 0; i < 5 ; i++) {
        var article = {
          link : 'http://n4g.com/' + contents[i].children[0].attribs.href,
          title : contents[i].children[0].children[0].children[0].data,
          timeAgo : contents[i].children[0].next.children[0].children[0].data
        }
        newsArticles.push(article)
      }
      // console.log(newsArticles)
      callback(newsArticles)
    }
  })
}

module.exports = {
  scrape : scrape
}
