$(document).ready(function() {
    var lock = new Auth0Lock(
      // All these properties are set in auth0-variables.js
      AUTH0_CLIENT_ID,
      AUTH0_DOMAIN
    );
	
    var userProfile;

    $('.btn-login').click(function(e) {
      e.preventDefault();
      lock.show(function(err, profile, token) {
        if (err) {
          // Error callback
          console.log("There was an error");
          alert("There was an error logging in");
        } else {
          // Success calback

          // Save the JWT token.
          localStorage.setItem('userToken', token);

          // Save the profile
          userProfile = profile;

          $('.login-box').hide();
          $('.logged-in-box').show();
          $('.nickname').text(profile.nickname);
          $('.nickname').text(profile.name);
          $('.avatar').attr('src', profile.picture);
        }
      });
    });
	
	//logout
	$('.btn-logout').click(function(e) {
      // execute logout script
		
        //var widget = new Auth0Lock(cid, domain);
		localStorage.removeItem('token');
		userProfile = null;
        $('.logged-in-box').hide();
		$('.login-box').show();
    });
	
	$('.btn-ShowTextPopup').click(function(e) {
		alert("Hello");
    });
	
	$('.btn-ShowSelectPopup').click(function(e) {
		var input2 = document.getElementById("selectInput").value;
		alert("input2");
    });
	
	//popup funstion
	function showPopupText(){
	var input = document.getElementById("textInput").value;
	alert("input");
	}
	
	function showPopupSelect(){
	var input2 = document.getElementById("selectInput").value;
	alert("input");
	}
	

	// Add result functions 3
	// Add result function 1 populate Opponent field
	$(document).on("pagebeforecreate","#uploadResult",function(){
		var select = document.getElementById("selectOpponentPlayer2");
		var options = ["1", "2", "3"];
		var opponentUsername = Parse.Object.extend("User");
		var query = new Parse.Query(opponentUsername);
		query.notEqualTo("objectId", "pHtwexlcv6"); //need to change so the objectId is whoever the current user is
		query.find({
			success: function(results) {
			//do something with this object,,,, list it
			var select = document.getElementById("selectOpponentPlayer2");
			  for (var i = 0; i < results.length; i++) {
				var object = results[i];
				var el = document.createElement("option");
				el.textContent = "hi";
				el.value = "hi";
				select.appendChild(el);
				}
			},
			error: function(error) {
				alert("Error: playerId couldnt be collected");
			}
		});
	});*/
	
	$(document).on("pagebeforecreate","#uploadResult",function(){
		//var select = document.getElementById("selectOpponentPlayer2");
		var options = ["1", "2", "3", "4", "5"];
		var opponentUsername = Parse.Object.extend("User");
		var query = new Parse.Query(opponentUsername);
		query.notEqualTo("objectId", "pHtwexlcv6"); //need to change so the objectId is whoever the current user is
		//query.find({
			//success: function(results) {
				for(var i = 0; i < options.length; i++) {
					var opt = options[i];
					var el = document.createElement("option");
					//el.setAttribute("id", "test44");
					el.textContent = opt;
					el.value = opt;
					var select = document.getElementById("selectOpponentPlayer2");
					select.appendChild(el);
					//var test44 = document.getElementById("test44");
					//alert(test44.value);//option element el is created, why is it not visible
					//alert(select); //that is evaluated
				}
			/*},
			error: function(error) {
				alert("Error: playerId couldnt be collected");
				}
		});*/
	});
	
	/*$(document).on("pagebeforecreate","#uploadResult",function(){
		//var select = document.getElementById("selectOpponentPlayer2");
		var options = ["1", "2", "3", "4", "5"];
		var opponentUsername = Parse.Object.extend("User");
		var query = new Parse.Query(opponentUsername);
		var testArray = new Array();
		query.notEqualTo("objectId", "pHtwexlcv6"); //need to change so the objectId is whoever the current user is
		query.find({
			success: function(results) {
				
				for(var i = 0; i < options.length; i++) {
					var opt = results[i];
					var playerUserId = opt.get('username');
					testArray[testArray.length] = playerUserId;
					alert(testArray[0]);
					//var el = document.createElement("option");
					//el.textContent = opt;
					//el.value = opt;
					//var select = document.getElementById("selectOpponentPlayer2");
					//select.appendChild(el);
					
				}
			},
			error: function(error) {
				alert("Error: playerId couldnt be collected");
				}
		});
	});
	
	//addresult populate opponent 1 //not working just yet
	/*$(document).on("pagebeforecreate","#uploadResult",function(){
		//add comment about challenges here
		var select = document.getElementById("selectOpponentPlayer2");
		var opponentUsername = Parse.Object.extend("User");
		var query = new Parse.Query(opponentUsername);
		query.notEqualTo("objectId", "pHtwexlcv6"); //need to change so the objectId is whoever the current user is
		query.find({
			success: function(results) {
			//do something with this object,,,, list it
			  for (var i = 0; i < results.length; i++) {
				var object = results[i];
				//add select list elements 
				var playerUserId = object.get('playerID');
				var z = document.createElement("option");
				z.textContent = playerUserId;
				z,value = playerUserId;
				select.appendChild(z);
			  }
			},
			error: function(error) {
				alert("Error: playerId couldnt be collected");
			}
		});
	});*/
	
	//Add Result Function 3 submit Form
	//addResult
	//This Currently Works for playerID2 field
	$('.btn-addResult').click(function(e) {
	//var input = document.getElementById("textInput").value;
	var selectOpponentPlayer2 = document.getElementById("selectOpponentPlayer2").value;
	var player1Score = document.getElementById("player1Score").value;
	var player2Score = document.getElementById("player2Score").value;
	var matchWinner = document.getElementById("matchWinner").value;
	
	var MatchScore = Parse.Object.extend("MatchScore");
    var matchScore = new MatchScore();
      //matchScore.save({Player1ID: "1", Player2ID: "2", P1score: "3". P2Score: "1", victor:"3"}, {
	  matchScore.save({Player1ID: 1, Player2ID: selectOpponentPlayer2, P1score: player1Score, P2Score: player2Score, victor:matchWinner}, {
		  success: function(object) {
			alert("Score Successfully Added");
		  },
		  error: function(model, error) {
			alert("Error Score not uploaded. Please try again later");
		  }
      });
	});
	
	//Leaderboard
	$(document).on("pagebeforecreate","#leaderboard",function(){
		
		var LeaderBoard = Parse.Object.extend("LeaderBoard");
		var query = new Parse.Query(LeaderBoard);
		query.notEqualTo("Ranking", 0); //when having opting include a function that sets new (and if you opt out) to 0
		query.include("playerID");
		query.find({
		  success: function(results) {
			//do something with this object,,,, list it
			for (var i = 0; i < results.length; i++) {
				var object = results[i];
				//create a row in the table for each player with a unique ID 
				var playerRow = document.createElement("TR");
				var playerRowId = "playerRow" + i;
				playerRow.setAttribute("id", playerRowId);
				document.getElementById("LeaderboardTable").appendChild(playerRow);
				
				//create a data entry for column 1 Rank
				//Generates a rank number based on the length of players to be inserted into the table
				var z = document.createElement("TD");
				var t = document.createTextNode(i+1);
				z.appendChild(t);
				document.getElementById(playerRowId).appendChild(z);
				
				//create a data entry for column 2 Player
				//pulls the users unique objectID need to change this to their username
				var playerUserId = object.get('playerID');
				var z = document.createElement("TD");
				var t = document.createTextNode(playerUserId.get('username'));
				z.appendChild(t);
				document.getElementById(playerRowId).appendChild(z);
				
				
				//create a data entry for column 3 Points
				//pulls the rank stored in the db probably will change this to wins and games played
				var z = document.createElement("TD");
				var t = document.createTextNode(object.get('Ranking'));
				z.appendChild(t);
				document.getElementById(playerRowId).appendChild(z);
				
			}
		  },
		  error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		  }
		});
	});
	
	//parse intilaisation
	Parse.initialize("5N1zo8DBnukiwCvOwuSiXByNtVNefFr7DS6YKvoy", "JbmB3R9Rj7ld8sAN7un9lTqI4PUQB4W1JIt5qLSQ");
	
	/* Setting up ajax for secure server calls
    $.ajaxSetup({
      'beforeSend': function(xhr) {
        if (localStorage.getItem('userToken')) {
          xhr.setRequestHeader('Authorization',
                'Bearer ' + localStorage.getItem('userToken'));
        }
      }
    });

    $('.btn-api').click(function(e) {
      // Just call your API here. The header will be sent
      $.ajax({
        url: 'http://localhost:3001/secured/ping',
        method: 'GET'
      }).then(function(data, textStatus, jqXHR) {
        alert("The request to the secured enpoint was successfull");
      }, function() {
        alert("You need to download the server seed and start it to call this API");
      });
    });*/
	


});
