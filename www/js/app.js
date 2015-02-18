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
	
	//popup funstion
	 $('.btn-popup1').click(function(e) {
	//var input = document.getElementById("textInput").value;
	
	var MatchScore = Parse.Object.extend("MatchScore");
    var matchScore = new MatchScore();
      //matchScore.save({Player1ID: "1", Player2ID: "2", P1score: "3". P2Score: "1", victor:"3"}, {
	  matchScore.save({Player1ID: "1", Player2ID: "2", P1score: "3", P2Score: "1", victor:"3"}, {
		  success: function(object) {
			alert("Score Successfully Added");
		  },
		  error: function(model, error) {
			alert("Error Score not uploaded. Please try again later");
		  }
      });
	});
	//popup funstion
	function testParse(){
	//var input = document.getElementById("textInput").value;
	alert("1");
	};

	$('.btn-logout').click(function(e) {
      // execute logout script
		
        //var widget = new Auth0Lock(cid, domain);
		localStorage.removeItem('token');
		userProfile = null;
        $('.logged-in-box').hide();
		$('.login-box').show();
    });
	
	//parse intilaisation
	
	Parse.initialize("5N1zo8DBnukiwCvOwuSiXByNtVNefFr7DS6YKvoy", "JbmB3R9Rj7ld8sAN7un9lTqI4PUQB4W1JIt5qLSQ");
	
	//parse test
	//function testParse() {
	
	//alert("1");
		//var TestObject = Parse.Object.extend("TestObject");
		//var testObject = new TestObject();
		//testObject.save({foo: "dave"}).then(function(object) {
			//alert("yay! it worked");
		//});
	//};
	
	//save score function
	//$('.btn-saveScore').click(function(e) {
	/*function saveScore() {
    var MatchScore = Parse.Object.extend("MatchScore");
    var matchScore = new MatchScore();
      //matchScore.save({Player1ID: "1", Player2ID: "2", P1score: "3". P2Score: "1", victor:"3"}, {
	  matchScore.save({Player1ID: "2", Player2ID: "3", P1score: "2", P2Score: "3", victor:"3"}, {
		  success: function(object) {
			alert("sucess");
		  },
		  error: function(model, error) {
			alert("failure");;
		  }
      });
	};
	
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
