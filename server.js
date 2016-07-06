const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const apiRouter = require('./api-routes')
const Match = require('./match-model')
const request = require("request");
const cheerio = require("cheerio");


mongoose.connect('mongodb://localhost/matches', function(error) {
    if (error) {
        console.error(error);
    } else {
        console.log('Mongoose connected successfully')
    }
})

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1', apiRouter);

app.use(express.static(path.join(__dirname, './www')))

app.get('/', function (req, res) {
    res.sendFile('index.html', {root : './www'})
});

app.listen(3000, function () {
    console.log('Server started at http://localhost:3000')
})


Match.remove({}, function(err) {
  if(err) {
    console.log('Error clearing matches');
  }
})

///////////////////////////////
/////   Begin match scraping
///////////////////////////////
request('http://www.hltv.org/matches?m=yes' , function (error, response, html) {
  let $ = cheerio.load(html);
  let matches = $('.well>a');
  // console.log(matches)
  for (let i = 0; i < matches.length; i++) {
    // console.log(matches[i].attribs.href);

    ///////////////////////////////
    /////   Send matches found to
    /////   be further scraped
    ///////////////////////////////
    scrapeMatch(matches[i].attribs.href);
  }
})

///////////////////////////////
/////   Scrapes teams, players
/////   and player stats
///////////////////////////////
function scrapeMatch(matchHref) {
  let matchUrl = 'http://www.hltv.org' + matchHref + '&m=yes';

  ///////////////////////////////
  /////   Scrape match page for
  /////   team names
  ///////////////////////////////
  request(matchUrl , function (error, response, rethtml) {

    let teams = [];

    let $ = cheerio.load(rethtml);
    // console.log(html)
    let nameContainer = $('.img-rounded');
    let initialSlice = nameContainer[0].next.data.slice(14)
    let initialSplit = initialSlice.split(' ');

    // console.log(initialSplit.length)
    let teamName = '';
    if (initialSplit.length === 41) {
      teamName = initialSplit[0];
    } else if (initialSplit.length === 40) {
      teamName = initialSplit[0];
    }

    // console.log('*************\n teamName: \n*************\n', teamName)

    teams.push({
      teamName : teamName
    })

    // console.log('*************\n nameContainer : \n*************\n', nameContainer[0].next.next.next.data.slice(14));
    initialSlice = nameContainer[0].next.next.next.data.slice(14);
    initialSplit = initialSlice.split(' ');
    // console.log(initialSplit.length)

    teamName = '';
    if (initialSplit.length === 25) {
      teamName = initialSplit[0] + ' ' + initialSplit[1];
    } else if (initialSplit.length === 24) {
      teamName = initialSplit[0];
    }

    // console.log('*************\n teamName: \n*************\n', teamName)
    teams.push({
      teamName : teamName
    })

    ///////////////////////////////
    /////   Create initial match
    /////   object to be filled in
    ///////////////////////////////
    let matchObj = {
      matchUrl : matchUrl,
      teams : teams
    }
    // console.log('Teams: ', teams)
    // console.log('URL: ', matchUrl)

    ///////////////////////////////
    /////   For each team in match
    ///////////////////////////////
    for(let i = 0; i < teams.length; i++) {
      // console.log(i , teams[i])

      ///////////////////////////////
      /////   Add team url based on
      /////   team names
      ///////////////////////////////
      let teamUrl = 'http://www.hltv.org/?pageid=152&query=' + teams[i].teamName + '&m=yes';
      teams[i].teamUrl = teamUrl;

      ///////////////////////////////
      /////   Scrape team information
      ///////////////////////////////
      request(teams[i].teamUrl , function (error, response, html2) {
        let $ = cheerio.load(html2);
        // console.log(html)
        let teamLogoSelect = $('img');
        // console.log(teamLogoSelect);

        ///////////////////////////////
        /////   Add team logo url
        ///////////////////////////////
        let teamLogoUrl = teamLogoSelect[0].attribs.src
        teams[i].teamLogoUrl = teamLogoUrl;
        // console.log(teams[i].teamName)

        ///////////////////////////////
        /////   Get and add player name,
        /////   url, id and image
        ///////////////////////////////
        let playersSelect = $('td a');
        teams[i].players = [];
        for (let j = 0; j < playersSelect.length; j++) {
          // console.log(playersSelect[j].attribs.href)
          if(playersSelect[j].attribs.href.includes('/player/')) {
            // console.log(playersSelect[i].attribs.href)
            let playerUrl = 'http://www.hltv.org' + playersSelect[j].attribs.href + '&m=yes';
            let playerName = playerUrl.split('-')[1].split('&')[0];
            let playerID = playerUrl.split('-')[0].split('/')[4];
            let playerImg = 'http://static.hltv.org/images/playerprofile/thumb/' + playerID + '/400.jpeg?v=1'
            teams[i].players.push({
              playerName : playerName,
              playerID : playerID,
              playerUrl : playerUrl,
              playerImg : playerImg
            })

          }
        }
        console.log(teams[i].teamName);

        ///////////////////////////////
        /////   For each player in team
        /////   Get and add player stats
        /////   (rating,kpr,dpr,headshots)
        ///////////////////////////////
        for (let k = 0; k < teams[i].players.length; k++) {
          // console.log(teams[i].players[k].playerUrl)
          request(teams[i].players[k].playerUrl , function (error, response, html3) {
            let $ = cheerio.load(html3);
            // console.log(html3)
            let statContainer = $('.flexContainer');
            // console.log('****************\n\nstatcontainer\n' + teams[i].players[k].playerName + '\n*****************', statContainer[0].children[1].children[0].children[0].data)
            teams[i].players[k].rating = statContainer[0].children[1].children[0].children[0].data;

            // console.log('****************\n\nstatcontainer\n' + teams[i].players[k].playerName + '\n*****************', statContainer[0].children[5].children[0].children[0].data)
            teams[i].players[k].killsPerRound = statContainer[0].children[5].children[0].children[0].data;

            // console.log('****************\n\nstatcontainer\n' + teams[i].players[k].playerName + '\n*****************', statContainer[0].children[9].children[0].children[0].data)
            teams[i].players[k].deathsPerRound = statContainer[0].children[9].children[0].children[0].data;

            // console.log('****************\n\nstatcontainer\n' + teams[i].players[k].playerName + '\n*****************', statContainer[0].children[11].children[0].children[0].data)
            teams[i].players[k].headshots = statContainer[0].children[11].children[0].children[0].data

            // console.log('****************\n\nstatcontainer\n' + teams[i].players[k].playerName + '\n*****************', statContainer[0].children[13].children[0].children[0].data)
            teams[i].players[k].roundsContributed = statContainer[0].children[13].children[0].children[0].data;


            // console.log(teams[i].teamLogoUrl)

          })
        }
      })

    }
    ///////////////////////////////
    /////  Pass completed match
    /////  object on to be saved
    ///////////////////////////////
    // console.log(matchObj.teams[0].players, matchObj.teams[1].players);
    // setTimeout(function() {
    // },1000);

    setTimeout(function() {
      console.log(matchObj)
      saveMatch(matchObj);
    },5000);


  })
} // end scrapeMatch


function saveMatch(matchObj) {
  // console.log(matchObj.teams[0].teamName, matchObj.teams[1].teamName);
  // console.log(matchObj);

  let newMatch = new Match(matchObj);

  newMatch.save(function(error, nmatch) {
    if (error) { console.error('ERROR SAVING MATCH!', error); }
    else {
      console.log('Match Saved');
    }
  });

}




// Match.remove({}, function(err) {
//    console.log('Matches Cleared')
//
//    var lounge = require('csgolounge-api');
//
//    lounge.getMatches(function(matches){
//      let time = matches[0].timestamp;
//      for (match of matches) {
//        let newMatch = new Match(match);
//        // console.log(newMatch.id)
//        Match.find({id: newMatch.id}, function(error, matches) {
//            if (error) { console.error('ERROR FINDING MATCHES!', error); }
//            else {
//                addNewMatch(matches)
//            }
//        });
//
//        function addNewMatch(matches) {
//
//         //  console.log(newMatch)
//          getTeamRosters(newMatch, saveMatch);
//
//          function saveMatch(matchToSave) {
//            // console.log(matches.length)
//            if (matches.length === 0) {
//              newMatch.save(function(error, nmatch) {
//                   if (error) { console.error('ERROR SAVING MATCH!', error); }
//                   else {
//                     console.log('Match Saved');
//                   }
//              });
//            }
//          }
//
//
//        }
//      }
//     //  console.log(matches.length);
//     //  console.log('Matches Saved Successfully')
//     //  Match.find({}, function(error, matches) {
//     //      if (error) { console.error('ERROR FINDING MATCHES!', error); }
//     //      else {
//     //          console.log(matches.length);
//     //      }
//     //  });
//    });
// });


// function getTeamRosters(newMatch, saveMatch) {
//   // console.log(newMatch.teams[0].name)
//
//   let teamRosters = [];
//   for(let i = 0; i < 2; i++) {
//     request('http://www.hltv.org/?pageid=152&query=' + newMatch.teams[i].name, function (error, response, html) {
//         // console.log(response, error)
//         if (!error && response.statusCode == 200) {
//             // console.log(html)
//             // pass DOM to cheerio
//             let $ = cheerio.load(html);
//             let playersRef = $('table a')
//             // console.log(players)
//             players = []
//             // console.log(players.length)
//             for (let i = 0; i < playersRef.length; i++) {
//               let playerName = playersRef[i].children[0].data
//               // console.log(playerName)
//               let playerID = playersRef[i].attribs.href.slice(22);
//               // console.log(playerID)
//               if (playerID === '') {
//                 console.log('detour');
//                 playerID = playersRef[i].attribs.href.split('/')[2].split('-')[0];
//               }
//               let playerImg = 'http://static.hltv.org/images/playerprofile/thumb/' + playerID + '/400.jpeg?v=1'
//
//               // console.log(playerID)
//               players.push({
//                 playerID : playerID,
//                 playerName : playerName,
//                 playerUrl : playersRef[i].attribs.href,
//                 playerImg : playerImg
//               });
//             }
//             // console.log(players)
//             teamRosters.push(players);
//             addTeamRosterToRosters(teamRosters);
//         }
//     })
//   }
//
//   function addTeamRosterToRosters(teamRosters) {
//     console.log(teamRosters.length)
//     if (teamRosters.length === 2) {
//       newMatch.teamRosters = teamRosters;
//       saveMatch(newMatch);
//     }
//   }
// }
