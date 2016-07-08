var Gosu = require('gosugamers-api');
var request = require('request');
var cheerio = require('cheerio');

// Gosu.fetchMatchUrls('lol', function(err, urls) {
//   // console.log(urls);
//   Gosu.parseMatches(urls, function(err, match) {
//     console.log(match)
//   })
// });

var newLolMatch =  {
  url: 'http://www.gosugamers.net/lol/tournaments/10629-2016-na-lcs-summer/matches/119724-phoenix1-vs-apex-gaming',
  home:
   { name: 'Phoenix1',
     url: '/lol/teams/15670-phoenix1',
     country: 'United States',
     rank: 106,
     score: 2 },
  away:
   { name: 'Apex Gaming',
     url: '/lol/teams/14636-apex-gaming',
     country: 'United States',
     rank: 89,
     score: 1 },
  status: 'Complete',
  type: 'lol',
  rounds: 'Best of 3',
  valueBet: true,
  datetime: 1467583200
}

console.log('teamURL: \n', newLolMatch.home.url)




function scrape() {
  request('http://www.gosugamers.net/' + newLolMatch.home.url, function(error, response, html) {
    var $ = cheerio.load(html);
    var teamImage = $('div.teamImage');
    console.log(teamImage.children)
  })
}

scrape()
