var config = {
    apiKey: "AIzaSyCpE8FIZuSs2-5Ffnh2CRueI2hQbH9bp8E",
    authDomain: "rock-paper-scissors-a427a.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-a427a.firebaseio.com",
    projectId: "rock-paper-scissors-a427a",
    storageBucket: "",
    messagingSenderId: "948689549246"
};

firebase.initializeApp(config);
var database = firebase.database();

var player1 = null;
var player2 = null;
var userName = null;

var user = null;
var opponent = null;
var computerEnabled = true;
var countEnabled = true;

//// first we need to listen for any connected users and store or delete our local objects
database.ref("/players/").on("value", function(snapshot) {
    
	// Check for existence of player 1 in the database
	if (snapshot.child("player1").exists()) {
		console.log("Player 1 exists");

		// Record player1 data
		player1 = snapshot.val().player1;
        if (userName == player1.name && userName !== null) {
            user = player1;
            $('#user').text(user.displayName);
            setTimeout(function() {
                $('#message1').text("waiting for opponent...");
                $('#message2').text("Use this time to practice against the computer.");
            }, 3000);
        } else {
            opponent = player1;
            $('#message1').text('Your opponent awaits!!!');
        }
    } else {
		console.log("Player 1 does NOT exist");
		player1 = null;
    }
    if (snapshot.child("player2").exists()) {
		console.log("Player 2 exists");

		// Record player2 data
		player2 = snapshot.val().player2;
        if (userName = player2.name && userName !== null) {
            user = player2;
            $('#user').text(user.displayName);
            setTimeout(function() {
                $('#message1').text("waiting for opponent...");
                $('#message2').text("Use this time to practice against the computer.");
            }, 3000);
        } else {
            opponent = player2;
            $('#message1').text('Your opponent awaits!!!');
        }
    } else {
		console.log("Player 2 does NOT exist");
		player2 = null;
    }
    if (snapshot.child("player1").exists() && snapshot.child("player2").exists()) {
        $('#message1').text('time to game.');
        $('#message2').text('Get ready!');
        countItOff();
    }
});

function countItOff() {
    if (countEnabled) {
        countEnabled = false;
        setTimeout(function() {
            $('#message1').text('rock...');
            $('#message2').text('Fuck it up!');
        }, 3000);
        setTimeout(function() {
            $('#message1').text('rock...');
        },3333);
        setTimeout(function() {
            $('#message1').text('paper...');
        },3666);
        setTimeout(function() {
            $('#message1').text('scissors...');
        },4000);
        setTimeout(function() {
            $('#message1').text('(batman ozzy lizard spock)');
        },4333);
        setTimeout(function() {
            $('#message1').text('SHOOT!');
            $('#message2').text('Oh baby!');
        },4888);
    }
}

$('#submit').click(function() {

    event.preventDefault();

    // if both players aren't queued...
    if ( ($('#fname').val().trim() !== "" && $('#lname').val().trim() !== "") && !(player1 && player2) ) { 

        // check if player 1 exists and if not, write to local object player1 and set it to the database
        if (player1 == null) {
            userName = $('#fname').val().trim() + " " + $('#lname').val().trim();
            displayName = $('#fname').val().trim() + " " + $('#lname').val().trim().charAt(0);
            player1 = {
                name: userName,
                displayName: displayName,
                wins: 0,
                losses: 0,
                globalWins: 0,
                globalLosses: 0,
                choice: "",
                rock: 0,
                paper: 0,
                scissors: 0,
                batman: 0,
                ozzy: 0,
                lizard: 0,
                spock: 0
            };

            // check if the user has played before and retrieve his/her data
            database.ref('/users/').once('value').then(function(snapshot) {
                if (snapshot.child(userName).exists()) {
                    $('#message1').text("Welcome back, " + userName + ".");
                    $('#message2').text("We missed you bud!");
                    console.log(snapshot.child(userName).val());
                    player1 = snapshot.child(userName).val();
                }
                // set updated player stats to database
                database.ref().child("/players/player1").set(player1);
                database.ref().child("/users/" + userName).set(player1);
            });

            // if user disconnects, remove player
            database.ref("/players/player1").onDisconnect().remove();

        // check if player 2 exists and if not, write to local object player2 and set it to the database
        } else if (player2 == null) {
            
            userName = $('#fname').val().trim() + " " + $('#lname').val().trim();
            displayName = $('#fname').val().trim() + " " + $('#lname').val().trim().charAt(0);
            player2 = {
                name: userName,
                displayName: displayName,
                wins: 0,
                losses: 0,
                globalWins: 0,
                globalLosses: 0,
                choice: "",
                rock: 0,
                paper: 0,
                scissors: 0,
                batman: 0,
                ozzy: 0,
                lizard: 0,
                spock: 0
            };

            // check if the user has played before and retrieve his/her data
            database.ref('/users/').once('value').then(function(snapshot) {
                if (snapshot.child(userName).exists()) {
                    $('#message1').text("Welcome back, " + userName + ".");
                    $('#message2').text("We missed you bud!");
                    console.log(snapshot.child(userName).val());
                    player2 = snapshot.child(userName).val();
                }
                // set updated player stats to database
                database.ref().child("/players/player2").set(player2);
                database.ref().child("/users/" + userName).set(player2);
            });

            // if user disconnects, remove player
            database.ref("/players/player2").onDisconnect().remove();
        }

        $('form').addClass("invisible");
        $('#message2').removeClass("hide");
    }

});

$('#rules-link').click(function() {
    $('.rules img').toggleClass("hide");
});
$('#keybd-shortcuts-link').click(function() {
    $('#keybd-shortcuts').toggleClass("hide");
});

$('.weapon').click(function() {
	$('.weapon').each(function() {
		$(this).attr('src', $(this).attr('src').replace("2.png", ".png"));
	});

	$('.p1-weapon img').attr("src", $(this).attr("src"));
	$(this).attr('src', $(this).attr('src').replace(".png", "2.png"));
	$('.comp-w img').attr('src', "qm.png");
});

var wins = 0;
var losses = 0;
var ties = 0;

// Creates an array that lists out all of the options (Rock, Paper, or Scissors).
var computerChoices = ["r", "p", "s", "b", "o", "l", "k"];

// This function is run whenever the user presses a key.
document.onkeydown = function(e) {

    // Determines which key was pressed.
    if (e.ctrlKey && e.key == "r") {e.preventDefault();$('.rock').trigger('click');}
    else if (e.ctrlKey && e.key == "p") {e.preventDefault();$('.paper').trigger('click');}
    else if (e.ctrlKey && e.key == "s") {e.preventDefault();$('.scissors').trigger('click');}
    else if (e.ctrlKey && e.key == "b") {e.preventDefault();$('.batman').trigger('click');}
    else if (e.ctrlKey && e.key == "o") {e.preventDefault();$('.ozzy').trigger('click');}
    else if (e.ctrlKey && e.key == "l") {e.preventDefault();$('.lizard').trigger('click');}
    else if (e.ctrlKey && e.key == "k") {e.preventDefault();$('.spock').trigger('click');}

};