const csgoMatch = require('./csgo-match-model')
const request = require('request');
const cheerio = require('cheerio');
const firebase = require("firebase");

////////////////////////////////
/////   FIREBASE INITIALIZATION
firebase.initializeApp({
  serviceAccount: "./gghub-ecb5b94a426c.json",
  databaseURL: "https://gghub-9103b.firebaseio.com"
});
const db = firebase.database();
const csgoMatchesRef = db.ref('/csgoMatches')

////////////////////////////////////////
/////   Remove previous matches from DB
csgoMatch.remove({}, function(err) {
  if(err) { console.log('Error clearing matches') }
})

/////////////////////////////
/////   Begin match scraping
function scrape() {
  request('http://www.hltv.org/matches?m=yes' , function (error, response, html) {
    let $ = cheerio.load(html);
    let matches = $('.well>a');
    for (let i = 0; i < matches.length; i++) {
      ////////////////////////////////////////////////
      /////   Send matches found to be further scraped
      scrapeMatch(matches[i].attribs.href);
    };
  });
  ///////////////////////////////////////////////
  /////   Scrapes teams, players and player stats
  function scrapeMatch(matchHref) {
    let matchUrl = 'http://www.hltv.org' + matchHref + '&m=yes';
    ////////////////////////////////////////
    /////   Scrape match page for team names
    request(matchUrl , function (error, response, rethtml) {
      let teams = [];
      let $ = cheerio.load(rethtml);
      let nameContainer = $('.img-rounded');
      let initialSlice = nameContainer[0].next.data.slice(14);
      let initialSplit = initialSlice.split(' ');
      let teamName = '';
      if (initialSplit.length === 41) {
        teamName = initialSplit[0];
      } else if (initialSplit.length === 40) {
        teamName = initialSplit[0];
      };
      teams.push({
        teamName : teamName
      });
      initialSlice = nameContainer[0].next.next.next.data.slice(14);
      initialSplit = initialSlice.split(' ');
      teamName = '';
      if (initialSplit.length === 25) {
        teamName = initialSplit[0] + ' ' + initialSplit[1];
      } else if (initialSplit.length === 24) {
        teamName = initialSplit[0];
      };
      teams.push({
        teamName : teamName
      });
      ///////////////////////////////////////////////////
      /////   Create initial match object to be filled in
      let matchObj = {
        matchUrl : matchUrl,
        teams : teams
      };
      ///////////////////////////////
      /////   For each team in match
      for(let i = 0; i < teams.length; i++) {
        ///////////////////////////////
        /////   Add team url based on team names
        let teamUrl = 'http://www.hltv.org/?pageid=152&query=' + teams[i].teamName + '&m=yes';
        teams[i].teamUrl = teamUrl;
        ///////////////////////////////
        /////   Scrape team information
        request(teams[i].teamUrl , function (error, response, html2) {
          let $ = cheerio.load(html2);
          let teamLogoSelect = $('img');
          /////////////////////////
          /////   Add team logo url
          let teamLogoUrl = teamLogoSelect[0].attribs.src;
          teams[i].teamLogoUrl = teamLogoUrl;
          //////////////////////////////////////////////////
          /////   Get and add player name, url, id and image
          let playersSelect = $('td a');
          teams[i].players = [];
          for (let j = 0; j < playersSelect.length; j++) {
            if(playersSelect[j].attribs.href.includes('/player/')) {
              let playerUrl = 'http://www.hltv.org' + playersSelect[j].attribs.href + '&m=yes';
              let playerName = playerUrl.split('-')[1].split('&')[0];
              let playerID = playerUrl.split('-')[0].split('/')[4];
              let playerImg = 'http://static.hltv.org/images/playerprofile/thumb/' + playerID + '/400.jpeg?v=1';
              teams[i].players.push({
                playerName : playerName,
                playerID : playerID,
                playerUrl : playerUrl,
                playerImg : playerImg
              });
            };
            if(playersSelect[j].attribs.href.includes('playerid')) {
              let playerUrl = 'http://www.hltv.org' + playersSelect[j].attribs.href + '&m=yes';
              let playerID = playerUrl.split('=')[2].split('&')[0];
              let playerImg = 'http://static.hltv.org/images/playerprofile/thumb/' + playerID + '/400.jpeg?v=1';
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
          for (let k = 0; k < teams[i].players.length; k++) {
            request(teams[i].players[k].playerUrl , function (error, response, html3) {
              let $ = cheerio.load(html3);
              if(teams[i].players[k].playerUrl.includes('/player/')) {
                let statContainer = $('.flexContainer');
                teams[i].players[k].rating = statContainer[0].children[1].children[0].children[0].data;
                teams[i].players[k].killsPerRound = statContainer[0].children[5].children[0].children[0].data;
                teams[i].players[k].deathsPerRound = statContainer[0].children[9].children[0].children[0].data;
                teams[i].players[k].headshots = statContainer[0].children[11].children[0].children[0].data;
                teams[i].players[k].roundsContributed = statContainer[0].children[13].children[0].children[0].data;
              };
              if(teams[i].players[k].playerUrl.includes('playerid')) {
                let nameContainer = $('.covSmallHeadline');
                teams[i].players[k].playerName = nameContainer[0].children[0].data;
                let statContainer = $('.covSmallHeadline');
                teams[i].players[k].rating = statContainer[30].children[0].data;
                teams[i].players[k].killsPerRound = statContainer[24].children[0].data;
                teams[i].players[k].deathsPerRound = statContainer[28].children[0].data;
                teams[i].players[k].headshots = statContainer[14].children[0].data;
                teams[i].players[k].roundsContributed = statContainer[26].children[0].data;
              };
            }); /// end request
          }; /// end for loop
        }); /// end request
      }; /// end for loop
      ///////////////////////////////
      /////  Pass completed match object on to be saved
      setTimeout(function() {
        for (team of matchObj.teams) {
          if (team.players.length < 5) {
            console.log(team.teamName, team.players.length)
            let numLess = 5 - team.players.length;
            for (let l = 0; l < numLess; l++) {
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
        saveMatch(matchObj);
      },20000);
    }); /// end request
  }; /// end scrapeMatch


  function saveMatch(matchObj) {
    /// FIREBASE PUSH
    csgoMatchesRef.push().set(matchObj);
    /// MONGODB SAVE
    // let newMatch = new csgoMatch(matchObj);
    // newMatch.save(function(error, nmatch) {
    //   if (error) { console.error('ERROR SAVING MATCH!', error) }
    //   else { console.log('Match Saved') };
    // });
  }; /// end saveMatch
} /// end scrape

module.exports = {
  scrape: scrape
}
