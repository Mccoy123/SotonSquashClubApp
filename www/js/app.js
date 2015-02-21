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
	
	//addResult
	//This Currently Works for playerID2 field
	$('.btn-addResult').click(function(e) {
	//var input = document.getElementById("textInput").value;
	var selectOpponentPlayer2 = document.getElementById("selectOpponentPlayer2").value;
	//var selectOpponentPlayer2 = document.getElementById("selectOpponentPlayer2").value;
	//var player1Score = document.getElementById("player1Score").value;
	//var player2Score = document.getElementById("player2Score").value;
	//var matchWinner = document.getElementById("matchWinner").value;
	
	var MatchScore = Parse.Object.extend("MatchScore");
    var matchScore = new MatchScore();
      //matchScore.save({Player1ID: "1", Player2ID: "2", P1score: "3". P2Score: "1", victor:"3"}, {
	  matchScore.save({Player1ID: 1, Player2ID: selectOpponentPlayer2, P1score: "3", P2Score: "1", victor:"4"}, {
		  success: function(object) {
			alert("Score Successfully Added");
		  },
		  error: function(model, error) {
			alert("Error Score not uploaded. Please try again later");
		  }
      });
	});
	
	//create table test
	$('.btn-testTable').click(function(e) {

    var playerRow = document.createElement("TR");
    playerRow.setAttribute("id", "playerRow");
    document.getElementById("testTable").appendChild(playerRow);

    var z = document.createElement("TD");
    var t = document.createTextNode("cell");
    z.appendChild(t);
    document.getElementById("playerRow").appendChild(z);
	alert("done");
	});
	
	//Leaderboard
	$('.btn-testLeaderboard').click(function(e) {
		
		var LeaderBoard = Parse.Object.extend("LeaderBoard");
		var query = new Parse.Query(LeaderBoard);
		query.notEqualTo("Ranking", 0); //when having opting include a function that sets new (and if you opt out) to 0
		query.find({
		  success: function(results) {
			alert("Successfully retrieved" + results.length + "Rankings");
			//do something with this object,,,, list it
			for (var i = 0; i < results.length; i++) {
				var object = results[i];
				//create a row in the table for each player with a unique ID 
				var playerRow = document.createElement("TR");
				var playerRowId = "playerRow" + i
				playerRow.setAttribute("id", playerRowId);
				document.getElementById("testTable").appendChild(playerRow);
				
				//create a data entry for column 1
				var z = document.createElement("TD");
				var t = document.createTextNode(i+1);
				z.appendChild(t);
				document.getElementById(playerRowId).appendChild(z);
				
				
				alert(object.id + ' - ' + object.get('Ranking'));
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
