var csgoMatch = require('./csgo-match-model')
var request = require('request');
var cheerio = require('cheerio');
var firebase = require("firebase");
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/gg', function(error) {
    if (error) {
        console.error(error);
    } else {
        console.log('Mongoose connected successfully')
    }
})

////////////////////////////////
/////   FIREBASE INITIALIZATION
// firebase.initializeApp({
//   serviceAccount: "./gghub-ecb5b94a426c.json",
//   databaseURL: "https://gghub-9103b.firebaseio.com"
// });
// var db = firebase.database();
// var csgoMatchesRef = db.ref('/csgoMatches')

////////////////////////////////////////
/////   Remove previous matches from DB
csgoMatch.remove({}, function(err) {
  if(err) { console.log('Error clearing matches') }
})

/////////////////////////////
/////   Begin match scraping
function scrape() {
  request('http://www.hltv.org/matches?m=yes' , function (error, response, html) {
    var $ = cheerio.load(html);
    var matches = $('.well>a');
    for (var i = 0; i < matches.length; i++) {
      ////////////////////////////////////////////////
      /////   Send matches found to be further scraped
      scrapeMatch(matches[i].attribs.href);
    };
  });
  ///////////////////////////////////////////////
  /////   Scrapes teams, players and player stats
  function scrapeMatch(matchHref) {
    var matchUrl = 'http://www.hltv.org' + matchHref + '&m=yes';
    ////////////////////////////////////////
    /////   Scrape match page for team names
    request(matchUrl , function (error, response, rethtml) {
      var teams = [];
      var $ = cheerio.load(rethtml);
      var nameContainer = $('.img-rounded');
      // console.log(nameContainer[0])
      if(nameContainer[0] !== undefined) {
        var initialSlice = nameContainer[0].next.data.slice(14);
        var initialSplit = initialSlice.split(' ');
        var teamName = '';
        var teamCount = 0;

        // console.log('split: ', initialSplit, 'split length: ', initialSplit.length)
        // console.log(matchUrl);
        if (initialSplit.length === 41 || initialSplit.length === 40 || initialSplit.length === 39) {
          teamName = initialSplit[0];
          teamCount++
        }
        // console.log('first successful team: ', teamName)
        teams.push({
          teamName : teamName
        });
        // console.log('url: ', matchUrl)

        // console.log('teamName: ', teamName, 'teamname length: ', teamName.length)
        if (nameContainer[0].next.next === null) {
          // console.log('noname')
          if (initialSplit[1] === ' '){
            secondSlice = nameContainer[0].next.data.slice(14).split(' ')[27];
            // console.log('team 2: ', secondSlice)
            // console.log('second successful team: ', secondSlice)
          } else {
            secondSlice = nameContainer[0].next.data.slice(14).split(' ')[28];
            // console.log('team 2: ', secondSlice)
            // console.log('second successful team: ', secondSlice)
          }
          teams.push({
            teamName : secondSlice
          });
        } else {
          // console.log('teamNameLength: ', teamName.length, 'container: ', nameContainer[0])
          initialSlice = nameContainer[0].next.next.next.data.slice(14);
          initialSplit = initialSlice.split(' ');
          teamName = '';
          if (initialSplit.length === 25) {
            teamName = initialSplit[0] + ' ' + initialSplit[1];
          } else if (initialSplit.length === 24) {
            teamName = initialSplit[0];
          };
          // console.log('second successful team: ', teamName)
          teams.push({
            teamName : teamName
          });
        }

        ///////////////////////////////////////////////////
        /////   Create initial match object to be filled in
        var matchObj = {
          matchUrl : matchUrl,
          teams : teams
        };
        ///////////////////////////////
        /////   For each team in match
        for(var i = 0; i < teams.length; i++) {
          ///////////////////////////////
          /////   Add team url based on team names
          var teamUrl = 'http://www.hltv.org/?pageid=152&query=' + teams[i].teamName + '&m=yes';
          teams[i].teamUrl = teamUrl;
          ///////////////////////////////
          /////   Scrape team information
          (function(i) {
            request(teams[i].teamUrl , function (error, response, html2) {
              var $ = cheerio.load(html2);
              var teamLogoSelect = $('img');
              /////////////////////////
              /////   Add team logo url
              var teamLogoUrl = teamLogoSelect[0].attribs.src;
              teams[i].teamLogoUrl = teamLogoUrl;
              //////////////////////////////////////////////////
              /////   Get and add player name, url, id and image
              var playersSelect = $('td a');
              teams[i].players = [];
              for (var j = 0; j < playersSelect.length; j++) {
                if(playersSelect[j].attribs.href.includes('/player/')) {
                  var playerUrl = 'http://www.hltv.org' + playersSelect[j].attribs.href + '&m=yes';
                  var playerName = playerUrl.split('-')[1].split('&')[0];
                  var playerID = playerUrl.split('-')[0].split('/')[4];
                  var playerImg = 'http://static.hltv.org/images/playerprofile/thumb/' + playerID + '/400.jpeg?v=1';
                  teams[i].players.push({
                    playerName : playerName,
                    playerID : playerID,
                    playerUrl : playerUrl,
                    playerImg : playerImg
                  });
                };
                if(playersSelect[j].attribs.href.includes('playerid')) {
                  var playerUrl = 'http://www.hltv.org' + playersSelect[j].attribs.href + '&m=yes';
                  var playerID = playerUrl.split('=')[2].split('&')[0];
                  var playerImg = 'http://static.hltv.org/images/playerprofile/thumb/' + playerID + '/400.jpeg?v=1';
                  teams[i].players.push({
                    playerName : 'Noname',
                    playerID : playerID,
                    playerUrl : playerUrl,
                    playerImg : playerImg
                  });
                };
              };
              ///////////////////////////////////////////////////////////////////////////////////
              /////   For each player in team get and add player stats (rating,kpr,dpr,headshots)
              for (var k = 0; k < teams[i].players.length; k++) {
                (function(k) {
                  // console.log(teams[i].players[k])
                  request(teams[i].players[k].playerUrl , function (error, response, html3) {
                    var $ = cheerio.load(html3);
                    if(teams[i].players[k].playerUrl.includes('/player/')) {
                      var statContainer = $('.flexContainer');
                      // console.log(statContainer)
                      teams[i].players[k].rating = statContainer[0].children[1].children[0].children[0].data;
                      teams[i].players[k].killsPerRound = statContainer[0].children[5].children[0].children[0].data;
                      teams[i].players[k].deathsPerRound = statContainer[0].children[9].children[0].children[0].data;
                      teams[i].players[k].headshots = statContainer[0].children[11].children[0].children[0].data;
                      teams[i].players[k].roundsContributed = statContainer[0].children[13].children[0].children[0].data;
                    };
                    if(teams[i].players[k].playerUrl.includes('playerid')) {
                      var nameContainer = $('.covSmallHeadline');
                      teams[i].players[k].playerName = nameContainer[0].children[0].data;
                      var statContainer = $('.covSmallHeadline');
                      teams[i].players[k].rating = statContainer[30].children[0].data;
                      teams[i].players[k].killsPerRound = statContainer[24].children[0].data;
                      teams[i].players[k].deathsPerRound = statContainer[28].children[0].data;
                      teams[i].players[k].headshots = statContainer[14].children[0].data;
                      teams[i].players[k].roundsContributed = statContainer[26].children[0].data;
                    };
                  }); /// end request
                })(k)

              }; /// end for loop
            }); /// end request
          })(i) /// end iife
        }; /// end for loop
        ///////////////////////////////
        /////  Pass completed match object on to be saved
        setTimeout(function() {
          if(matchObj.teams[0].teamName !== '' && matchObj.teams[1].teamName !== '') {
            for (team of matchObj.teams) {
              if (team.players.length < 5) {
                console.log(team.teamName, team.players.length)
                var numLess = 5 - team.players.length;
                for (var l = 0; l < numLess; l++) {
                  console.log('adding player');
                  team.players.push({
                    playerName : 'Noname',
                    playerID: '',
                    playerImg: 'http://static.hltv.org/images/playerprofile/thumb/10209/400.jpeg?v=1',
                    playerUrl: '',
                    rating: '',
                    headshots: '',
                    killsPerRound: '',
                    deathsPerRound: '',
                    roundsContributed: ''
                  }); /// end push
                }; /// end for loop
              }; /// end if
            }; /// end for loop
            console.log('saved match!!')
            saveMatch(matchObj);
          } /// end if
        },20000);
      }
    }); /// end request

  }; /// end scrapeMatch


  function saveMatch(matchObj) {
    /// FIREBASE PUSH
    // csgoMatchesRef.push().set(matchObj);
    // MONGODB SAVE
    var newMatch = new csgoMatch(matchObj);
    newMatch.save(function(error, nmatch) {
      if (error) { console.error('ERROR SAVING MATCH!', error) }
      else { console.log('Match Saved') };
    });
  }; /// end saveMatch
} /// end scrape

module.exports = {
  scrape: scrape
}

scrape();
