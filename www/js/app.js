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
		//when testing set to 30 phonegap test app detects screen size differently
		//when deployed to device set to 260
		$(".scrollable5").css({
			height: (window.innerHeight - 260)
		});
		alert("test");
	} 
	
	//reuseable function to make a given make a page reload and update the content
	function pageRefresh(currentPage) {
		var originalPage = window.location.href;
		$(":mobile-pagecontainer").pagecontainer("change", currentPage, {
			allowSamePageTransition: true,
			transition: 'fade',
			showLoadMsg: true,
			changeHash: false
		});
	}
	//test example for a button on leaderboard page delete when no longer needed 
	$('.btn-pageRefresh').click(function(e) {
		var currentPage = "#leaderboard";
		pageRefresh(currentPage);
	});
	
	
	
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
	
	//chalengePlayer Functions
	$(document).on("pagebeforeshow","#challengePlayer",function(){
		populateOpponentChallenge();
	});
	
	function populateOpponentChallenge(){
		Parse.Cloud.run('fetchOpponents', {}, {
			success: function(opponentArray) {
				var select = document.getElementById('selectOpponentChallenge');
				for(var i = 0; i < opponentArray.length; i++) {
					var oppObj = opponentArray[i].value;
					var oppName = opponentArray[i].text;
					select.options[select.options.length] = new Option(oppName, oppObj);
				} 
			},
			error: function(error) {
				alert("Error 105: playerId couldn't be collected");
			}
		});
	}
	
	$('.btn-challengePlayer').click(function(e) {
		var chalengeeObjectID = document.getElementById("selectOpponentChallenge").value; //Gets the challengees user Object
		var User = Parse.Object.extend("User");
		var query = new Parse.Query(User);
		query.get(chalengeeObjectID, {
			success: function(challengeeObject) {
				var challengerObj = currentUser; //Gets the challengers user Object
				var challengeeObj = challengeeObject; //Gets the challengees user Object
				//save new Challenge Object
				var Challenges = Parse.Object.extend("Challenges");
				var challenge = new Challenges();
				//validation
				//make sure there is not already an active challenge between player
				//put validation here
				challenge.save({ChallengerID: challengerObj, ChallengeeID: challengeeObj, Active: true, Accepted: false}, {
					success: function(challenge) {
						alert("Challenge Successfully Sent");
						 window.location.href = '#myChallenges'; //navigate the user to the myChallenges page
					},
					error: function(challenge, error) {
						alert("Error 109: Challenge not recorded. Please try again later"); //user error message						  
					}
				});
			},
			error: function(object, error) {
				alert("Error 110: Opponent could not be identified");
			}
		});
	});
	
	$(document).on("pagebeforehide","#challengePlayer",function(){
		var optionCount = $('#selectOpponentChallenge option').length; //return number of rows in table
		$("#selectOpponentChallenge").find('option').remove();
	});
	
	//end of challenge player functions
	
	
	//Add Result functions 3
	// uploadresult functions 2
	$(document).on("pagebeforeshow","#uploadResult",function(){
		populateOpponent(); 
		resetForm();
	});
	function resetForm(){
		document.getElementById("addResultForm").reset();
	}
	
	// populate Opponent field 2.1
	function populateOpponent(){
		Parse.Cloud.run('fetchOpponentsAddResult', {}, {
			success: function(opponentArray) {
				//Display to user number of open challenges
				document.getElementById("numberOpenChallenges").innerHTML = "You have " +  opponentArray.length + " outstanding challenges";
				var select = document.getElementById('selectOpponentPlayer2');				
				for(var i = 0; i < opponentArray.length; i++) {
					var valueRaw = {opponentID: opponentArray[i].opponentId, challengeID: opponentArray[i].challengeObbID};
					var value = JSON.stringify(valueRaw);
					var text = opponentArray[i].opponentName;
					select.options[select.options.length] = new Option(text, value);
				} 
			},
			error: function(error) {
				alert("Error 105: Opponent data couldn't be collected");
			}
		});
	}
	$(document).on("pagebeforehide","#uploadResult",function(){
		var optionCount = $('#selectOpponentPlayer2 option').length; //return number of rows in table
		$("#selectOpponentPlayer2").find('option').remove();
	});
	
	//Add Result Function 3 submit Form
	$('.btn-addResult').click(function(e) {
		var matchInfo = document.getElementById("selectOpponentPlayer2").value;//Gets the opponents user ObjectID
		var matchInfoObj = JSON.parse(matchInfo); //convert the raw text back to valid JSON
		var challengeID = matchInfoObj.challengeID //retrieve the matchID
		var player2Id = matchInfoObj.opponentID; //retrieve the players id
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
					  var VictorID = Parse.User.current();
					  var VictorScore = player1Score;
					  var LoserID = player2;
					  var LoserScore = player2Score;
					}
					else {
					  var matchWinnerValidate = 2;
					  var VictorID = player2;
					  var VictorScore = player2Score;
					  var LoserID = Parse.User.current();
					  var LoserScore = player1Score;
					}
					if (matchWinner == matchWinnerValidate) { //validation 4: check winner is correct
					  //submit result
					  var MatchScore = Parse.Object.extend("MatchScore");
					  var matchScore = new MatchScore(); //create a new matchScore object
					  //save the result
					  matchScore.save({VictorID: VictorID, LoserID: LoserID, VictorScore: VictorScore, LoserScore: LoserScore}, {
					  success: function(object) {
						  alert("Score Successfully Added"); //User success message
						  closeChallenge(challengeID);
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
	
	function closeChallenge(challengeID){
		var Challenge = Parse.Object.extend("Challenges");
		var queryChallenge = new Parse.Query(Challenge);
		queryChallenge.get(challengeID, {
			success: function(challengeObj) {
				challengeObj.set("Active", false);
				challengeObj.save();
			},
			error: function(object, error){
				alert("Challenge not closed");
			}
		});
	}
	//end of add result functions
	
	//myChallenges function
	$(document).on("pagebeforeshow","#myChallenges",function(){
		Parse.Cloud.run('newChallenges', {}, {
			success: function(newChallengeArray) {
				//Display to user number of new challenges
				document.getElementById("numberNewChallenges").innerHTML = "You have " +  newChallengeArray.length + " outstanding challenges";
				//code to display new challenges in a drop down box
				var select = document.getElementById('newMatchChallenges');				
				for(var i = 0; i < newChallengeArray.length; i++) {
					var challengeSentDate = newChallengeArray[i].challengeSentDate;
					var challengerName = newChallengeArray[i].challengerName;
					var challengeObbID = newChallengeArray[i].challengeObbID;
					//var challengeMatchDate = newChallengeArray[i].challengeMatchDate; //add when date picker implemented
					//add data to drop down box
					select.options[select.options.length] = new Option(challengerName, challengeObbID);
				}
			},
			error: function(error){
				alert("Error 177: New challenges could not be fetched. please check internet connction");
			}
		});
		Parse.Cloud.run('activeChallenges', {}, {
			success: function(activeChallengesArray) {
				for(var i = 0; i < activeChallengesArray.length; i++) {
					var challengeDetails = activeChallengesArray[i].challengeDetails;
					var challengeStatus = activeChallengesArray[i].challengeStatus;
					var challengeStatusMessage = activeChallengesArray[i].challengeStatusMessage;
					//add data to table
					//$('#myActiveChallengesTable tr:last').after('<tr class="' + challengeStatus + '"><td>'+ challengeDetails +'</td></tr><tr class="' + challengeStatus + '"><td>'+ challengeStatusMessage +'</td></tr>');
					$('#myActiveChallengesTable tr:last').after('<tr class=" activeChallengeRow ' + challengeStatus + '"><td><p>'+ challengeDetails + '</p><p>' + challengeStatusMessage +'</p></td></tr>');
				} 
			},
			error: function(error) {
				alert("Error 187: Active Challenges could not be fetched");
			}
		});
	});
	$(document).on("pagebeforehide","#myChallenges",function(){
		var optionCount = $('#newMatchChallenges option').length; //return number of rows in table
		$("#newMatchChallenges").find('option').remove();
		//new to remove active challenge table too.
		var rowCount = $('#myActiveChallengesTable tr').length; //return number of rows in table
		var activeChallengesTable = document.getElementById("myActiveChallengesTable"); //get table element
		for (i=1; i < rowCount; i++){
			activeChallengesTable.deleteRow(1); //delete all table rows except placeholder
		}
	});
	
	$('.btn-AcceptChallenge').click(function(e) {
		var challengeObjectID = document.getElementById("newMatchChallenges").value; //Gets the challenge ObjectId
		var Challenge = Parse.Object.extend("Challenges");
		var query = new Parse.Query(Challenge);
		//retrieve the challenge object
		query.get(challengeObjectID, {
			success: function(challengeObject) {
				challengeObject.set("Accepted", true); //set accepted flag to true
				challengeObject.save();
				alert("Challenge Accepted and Opponent has been notified");
				var currentPage = "#myChallenges";
				pageRefresh(currentPage); //refresh page
			},
			error: function(error) {
				alert("Challenge could not be Accepted check internet connection");
			}
		});
	});
	$('.btn-DeclineChallenge').click(function(e) {
		 $('.confirmDecline').show();
	});
	$('.btn-DeclineChallengeCancel').click(function(e) {
		 $('.confirmDecline').hide();
	});
	$('.btn-DeclineChallengeConfirm').click(function(e) {
		var challengeObjectID = document.getElementById("newMatchChallenges").value; //Gets the challenge ObjectId
		Parse.Cloud.run('declineChallenge', {challengeObjectID: challengeObjectID}, {
			success: function(result) {
				//Display success/error message
				alert(result);
				$('.confirmDecline').hide();
				var currentPage = "#myChallenges";
				pageRefresh(currentPage);
			},
			error: function(error){
				alert("Error 207: Challenged could not be declined. please check internet connection");
			}
		});
	});
	
	
	//Newsfeed
	//note this is actually the newsfeed, just neeed to update the href once the test home page is removed
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
					
					//create a newsfeed item
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
						//add the attachment
						var newsFeedMediaItem = document.createElement("TD");
						newsFeedMediaItem.setAttribute("colspan", "2");
						newsFeedMediaItem.innerHTML = '<img class="newsFeedMediaImage" id="newsFeedMediaItem" src="' + newsFeed[i].media + '" />';
						document.getElementById(newsFeedMediaRowId).appendChild(newsFeedMediaItem); //append to newsfeed table in dom
					}
				}
			},
			error: function(error){
				alert("Newsfeed could not be loaded check internet connection");
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
	//end of Newsfeed functions
	
	//Leaderboard
	$(document).on("pagebeforeshow","#leaderboard",function(){
		Parse.Cloud.run('fetchLeaderboard', {}, {
			success: function(leaderboardArray) {
				for(var i = 0; i < leaderboardArray.length; i++) {
					var playerRank = leaderboardArray[i].playerRank;
					var playerName = leaderboardArray[i].playerName;
					//add data to table
					$('#LeaderboardTable tr:last').after('<tr><td>'+ playerRank +'</td><td>'+ playerName +'</td></tr>');
				} 
			},
			error: function(error) {
				alert("Error 137: leaderboard couldn't be generated");
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
