$(document).ready(function() {
    var lock = new Auth0Lock(
      // All these properties are set in auth0-variables.js
      AUTH0_CLIENT_ID,
      AUTH0_DOMAIN
    );
	
	window.location.href = '#one'; //set navigation on login maybe put inside a function??
	makePageScrollable(); //sets up making pages scrollable
	
    var userProfile; //declere userProfile

	//log-in
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
          userProfile = profile; //set userProfile
          $('.login-box').hide();
          $('.logged-in-box').show();
          $('.nickname').text(profile.nickname);
          $('.nickname').text(profile.name);
          $('.avatar').attr('src', profile.picture);
		  $('.sessionIdTest').text(profile.parse_session_token); //session token 
		  
		  //set current user in Parse
		  setParseUser(profile.parse_session_token);
        }
      });
    });
	
	//set current user in Parse
	function setParseUser(parseToken){
		Parse.User.become(parseToken).then(function (user) {
		  // The current user is now set to user.
		  currentUser = Parse.User.current();
		  alert(currentUser.get("username"));
		}, function (error) {
		  // The token could not be validated.
		  alert("parse user could not be set");
		});
	}
	
	//GlobalFunctions
	function makePageScrollable(){
		//any page of class scrollable will be scrollable
		$(".scrollable5").css({
			height: (window.innerHeight - 30)
		});
	}
	
	
	//MyProfile Functions 4
	//show correct button 1
	$(document).on("pagebeforeshow","#profile",function(){
		if (currentUser.get("Leaderboard") == true) {
			$('#joinLeaderboard').hide();
			$('#leaveLeaderboard').show();
		}
		else {
			$('#joinLeaderboard').show();
			$('#leaveLeaderboard').hide();
		}
	});
	
	//logout 2
	$('.btn-logout').click(function(e) {
      // execute logout script
		
        //var widget = new Auth0Lock(cid, domain);
		localStorage.removeItem('token');
		userProfile = null;
        $('.logged-in-box').hide();
		$('.login-box').show();
    });
	
	//adds user to the leaderboard 3
	$('.btn-joinLeaderboard').click(function(e) {
		Parse.Cloud.run('joinLeaderboard', {}, {
		success: function(result) {
			// result is 'My Cloud Code!'
			alert(result);
			$('#joinLeaderboard').hide();
			$('#leaveLeaderboard').show();
		  },
		  error: function(error) {
		    alert(error);
		  }
		});
    });
	
	//removes user from the leaderboard 4
	$('.btn-leaveLeaderboard').click(function(e) {
		Parse.Cloud.run('leaveLeaderboard', {}, {
		success: function(result) {
			// result is 'My Cloud Code!'
			alert(result);
			$('#leaveLeaderboard').hide();
			$('#joinLeaderboard').show();
		  },
		  error: function(error) {
		    alert(error);
		  }
		});
    });
	//end of My Profile Function
	
	//Home Test Functions
	$('.btn-ShowTextPopup').click(function(e) {
		alert("Hello");
		makePageScrollable();
		//var pageHeight = document.getElementById("page1Content");
		//alert(pageHeight.offsetHeight);
		//alert($(window).height());
		//alert($(window).innerHeight());
    });
	$('.btn-ParseCloudCode').click(function(e) {
		alert("Hello");
		Parse.Cloud.run('hello', {}, {
		success: function(result) {
			// result is 'My Cloud Code!'
			alert(result);
		  },
		  error: function(error) {
		    alert(error);
		  }
		});
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
	//End OF home Test functions
	
	//Add Result functions 3
	// reset the form on hide 1
	$(document).on("pagehide","#uploadResult",function(){
	document.getElementById("addResultForm").reset();
	});

	// uploadresult functions 2
	$(document).on("pagebeforecreate","#uploadResult",function(){
	populateOpponent(); 
	populateUserPlayer();
	});

	// populate Opponent field 2.1
	function populateOpponent(){
		var select = document.getElementById("selectOpponentPlayer2");
		var opponentUsername = Parse.Object.extend("User");
		var query = new Parse.Query(opponentUsername);
		query.notEqualTo("objectId", currentUser.id);
		query.find({
			success: function(results) {
				for(var i = 0; i < results.length; i++) {
					var opt = results[i].id;
					var opt2 = results[i].get("username");
					var el = document.createElement("option");
					
					var elId = "el" + i;
					el.setAttribute("id", elId);
					el.value = opt;
					el.textContent = opt2;
					var select = document.getElementById("selectOpponentPlayer2");
					
					/*tests
					alert(select); // returns a object html select element
					alert(el); // returns a object html option element
					alert(el.value); //returns the user objectId
					alert(el.textContent); //returns the username
					*/
								
					try { 
					select.appendChild(el);
					} catch(err) {
					alert (err.message);
					}
				}
			},
			error: function(error) {
				alert("Error 105: playerId couldn't be collected");
				}
		});
	};
	
	//addresult populate opponent 2.2
	function populateUserPlayer(){
		//add comment about challenges here
		var player1 = document.getElementById("selectOpponentPlayer1");
		var z = document.createElement("option");
		z.textContent = currentUser.get("username");
		z.value  = currentUser.id;
		player1.appendChild(z);
		};
	
	//Add Result Function 3 submit Form
	$('.btn-addResult').click(function(e) {
		var player2Id = document.getElementById("selectOpponentPlayer2").value;//Gets the opponents user ObjectID
		var opponent = Parse.Object.extend("User");
		var query = new Parse.Query(opponent);
		//queries user class returning the opponents user object
		query.get(player2Id, {
			success: function(player2) {
				var player1Score = document.getElementById("player1Score").value; //get player1s score
				var player2Score = document.getElementById("player2Score").value; //get player2s score
				var matchWinner = document.getElementById("matchWinner").value; //get the matchWinner value player1 or player2
				//validation
					if (player1Score == 3 || player2Score == 3){ //Validation1: Check someone won to 3
						if (player1Score <= 3 && player1Score >= 0 && player2Score <= 3 && player2Score >= 0){ //Validation 2 check both score are in correct range
							if (player1Score == 3 && player2Score == 3){ //Validation 3 Check match is not a draw
								alert("Error 106: Match cannot be a draw");
							}
							else {
								//set match winner validate
								if (player1Score > player2Score){
									var matchWinnerValidate = 1;
								}
								else {
									var matchWinnerValidate = 2;
								}
								if (matchWinner == matchWinnerValidate) { //validation 4: check winner is correct
									//submit result
									var MatchScore = Parse.Object.extend("MatchScore");
									var matchScore = new MatchScore(); //create a new matchScore object
									//save the result
									matchScore.save({Player1ID: currentUser, Player2ID: player2, P1Score: player1Score, P2Score: player2Score, victor: matchWinner}, {
										  success: function(object) {
											alert("Score Successfully Added"); //User success message
											window.location.href = '#leaderboard'; //navigate the user to the leaderboard page
										  },
										  error: function(model, error) {
											alert("Error 104: Score not uploaded. Please Make sure an opponent is selected. Or try again later!"); //user error message
										  }
									});
								}
								else {
									alert("Error 107: Scores do not match winner");
								}
							}
						}
						else {
							alert("Error 101: Matches are first to 3 games");
						}
					}
					else {
						alert("Error 102: Matches are first to 3 games");
					}
			},
			error: function(object, error) {
				alert("Error 103: Opponent could not be found");
			}
		});
	});
	//end of add result functions
	
	//Newsfeed
	$(document).on("pagebeforeshow","#homeTest",function(){
		Parse.Cloud.run('newsfeed', {}, {
			success: function(newsFeed) {
				//alert(newsFeed);
				//alert(newsFeed.length); //works perfectly
				//alert(newsFeed[0]); //works perfectly
				//alert(newsFeed[0].content); //works perfectly
				//newsFeed.sort();
				//alert(newsFeed[0].length); //undefined
				for (i=0; i<newsFeed.length; i++){
					
					var newsFeedRow = document.createElement("TR");
					var newsFeedRowId = "newsFeedRow" + i;
					newsFeedRow.setAttribute("id", newsFeedRowId);
					newsFeedRow.setAttribute("class", "newsfeedRow");
					document.getElementById("NewsfeedTable").appendChild(newsFeedRow); //append to table in DOM
					
					//populate newsfeed row
					var newsFeedItem = document.createElement("TD");
					newsFeedItem.innerHTML = '<img class="newsfeedlogoImage" id="newsfeedLogo" src="' + newsFeed[i].userThumbnail + '" />';
					document.getElementById(newsFeedRowId).appendChild(newsFeedItem); //append to newsfeed table in dom
					
					var newsFeedItem2 = document.createElement("TD");
					newsFeedItem2.setAttribute("class", "newsfeedContent");
					var newsFeedData = document.createTextNode(newsFeed[i].content);
					newsFeedItem2.appendChild(newsFeedData);	
					document.getElementById(newsFeedRowId).appendChild(newsFeedItem2); //append to newsfeed table in dom
					
					if (newsFeed[i].media !== "1") { 
						//if an attachment has been added display it
						var newsFeedRowMedia = document.createElement("TR");
						var newsFeedMediaRowId = "newsFeedRowMedia" + i;
						newsFeedRowMedia.setAttribute("id", newsFeedMediaRowId);
						newsFeedRowMedia.setAttribute("class", "newsFeedRowMedia");
						document.getElementById("NewsfeedTable").appendChild(newsFeedRowMedia); //append to table in DOM
						//add the attachement
						var newsFeedMediaItem = document.createElement("TD");
						newsFeedMediaItem.setAttribute("colspan", "2");
						newsFeedMediaItem.innerHTML = '<img class="newsFeedMediaImage" id="newsFeedMediaItem" src="' + newsFeed[i].media + '" />';
						document.getElementById(newsFeedMediaRowId).appendChild(newsFeedMediaItem); //append to newsfeed table in dom
					}
				}
			},
			error: function(error){
			
			}
		});
	});
	$(document).on("pagebeforehide","#homeTest",function(){
		var rowCount = $('#NewsfeedTable tr').length; //return number of rows in table
		var NewsfeedTable = document.getElementById("NewsfeedTable"); //get table element
		for (i=0; i < rowCount; i++){
			NewsfeedTable.deleteRow(0); //delete all table rows except header
		}
	});
	
	//Leaderboard
	$(document).on("pagebeforeshow","#leaderboard",function(){
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
	$(document).on("pagebeforehide","#leaderboard",function(){
		var rowCount = $('#LeaderboardTable tr').length; //return number of rows in table
		var ladderTable = document.getElementById("LeaderboardTable"); //get table element
		for (i=1; i < rowCount; i++){
			ladderTable.deleteRow(1); //delete all table rows except header
		}
	});
	//end of leaderboard functions
	
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
