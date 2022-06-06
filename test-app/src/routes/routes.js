const e = require('express');
const {Router, json} = require('express');
const router = Router();

// ==================================================================================================================
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


MongoClient.connect(url, function(err, db) {
  var dbo = db.db("tripleT");

  dbo.collection("users").findOne({}, function(err, result) {
    console.log(result.name);
    //db.close();

  });

  const alumnos = require('./data.json');

  const usersDB = require('./ttt_usersDB.json');
  const tournamentsDB = require('./ttt_tournamentsDB.json');
  const gamesDB = require('./ttt_matchesDB.json')
  
  router.get('/', (req,res) => {
      res.json(usersDB)
  });
  
  // receive user through post and return json with boolean permission and message.
  router.post('/login', (req,res) => {
    const {name, psk} = req.body;

    dbo.collection("users").find({name:name}).toArray(function(err, result) {
      var userData = result[0];
      var msg = "fuck you";
      var permission = false;
      if(userData.psk == psk){
          msg = "you're in bitch";
          permission = true;
      }
      
      const res2send = {
          "username":userData.name,
          "permission":permission,
          "message":msg
      }
      res.json(res2send)

    });
  });
  
  // receive user and return the tournaments and the next games players
  router.post('/dashboard', (req,res) => {
      // get body
      const {name} = req.body;
      var finalResponse = []
      var tournaments2send = [];
      var res2send2 = [];
      var activeTournaments = [];
      var finishedTournaments = [];


      dbo.collection("users").find({name:name}).toArray(function(err, result) {
        var userData = result[0];
        
        //console.log(userData);

        dbo.collection("tournaments").find({}).toArray(function(err, resultTournaments) {
            //console.log(result);

            // loop through elements in tournaments to find player tournaments
            userData.tournaments.forEach(element => {
                resultTournaments.forEach(element2 => {
                    if(element == element2.id){
                        var temp = [[element2.name, element2.status]]
                        if(element2.status == "active"){
                            if(element2.admin == userData.id){
                                temp = [[element2.name, element2.status, true]]
                            }
                            activeTournaments.push(temp)
                        }
                        else if(element2.status == "inactive"){
                            temp = [element2.name, element2.status, element2.winner]
                            finishedTournaments.push(temp)
                        }
                        else{console.log("Error: Tourney does not have status defined");}

                        tournaments2send.push(element2);

                        res2send2.push(temp)
                    }
                })
            })

            dbo.collection("matches").find({}).toArray(function(err, resultMatches){

                cont = 0;
                tournaments2send.forEach(selectedTourney => {
                    resultMatches.forEach(selectedMatch => {
                        flag = true;
                        if(selectedMatch.tournament == selectedTourney.id && flag){
                            if(selectedMatch.status == "unfinished"){
                                //console.log(selectedTourney.name+ " next match is: "+ selectedMatch.id);
                                flag = false;
                                activeTournaments[cont].push(selectedMatch)
                                cont ++;

                            }
                        }
                    })
                })

                dbo.collection("users").find({}).toArray(function(err, resultUsers){
                    var tempUserData = [];
                    activeTournaments.forEach(selectedTourney => {
                        // -------------- push in selectedTourney.push()
                        resultUsers.forEach(selectedUser => {
                            tempUserData = [];
                            if(selectedUser.id == selectedTourney[1].opponents[0] || selectedUser.id == selectedTourney[1].opponents[1]){
                                tempUserData.push([selectedUser.name, selectedUser.pp])
                                //console.log("user for game is: "+selectedUser.name);
                                selectedTourney.push(tempUserData);
                            }

                            // look for finished Tournaments users
                            finishedTournaments.forEach(selectedFinished => {
                                if(selectedFinished[2] == selectedUser.name){
                                    selectedFinished.push(selectedUser.pp)
                                }
                            })

                        })


                    })
                    
                    console.log("active Tournaments");
                    console.log(activeTournaments);
                    console.log("-------------------------");
                    console.log(activeTournaments[0][3]);
                    finalResponse.push(activeTournaments);
                    finalResponse.push(finishedTournaments);
                    res.json(finalResponse)
                })

            });

          });
        
      });

  });
  
  // ------------------------------------------------------------------------------------------------------
  
  router.post('/tests', (req,res) => {
      const {name, psk} = req.body;

      dbo.collection("users").find({name:name}).toArray(function(err, result) {
        var userData = result[0];
        var msg = "fuck you";
        var permission = false;
        if(userData.psk == psk){
            msg = "you're in bitch";
            permission = true;
        }

        const res2send = {
            "username":userData.name,
            "password":userData.psk,
            "permission":permission,
            "message":msg
        }
        res.json(res2send)

      });
  });
  
  // ---------------------------------------------------------------------------------------------------------------

});

// ==================================================================================================================
  // Export until END
module.exports = router;



// ==================================================================================================================
