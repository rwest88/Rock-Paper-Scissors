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
var player1Name = null;
var player2Name = null;
var userName;
var displayName;
var turn = 1;

var user;

//// first we need to listen for any connected users and store or delete our local objects
database.ref("/players/").on("value", function(snapshot) {
    
	// Check for existence of player 1 in the database
	if (snapshot.child("player1").exists()) {
		console.log("Player 1 exists");

		// Record player1 data
		player1 = snapshot.val().player1;
		player1Name = player1.name;
    } else {
		console.log("Player 1 does NOT exist");

		player1 = null;
        player1Name = "";
    }
    if (snapshot.child("player2").exists()) {
		console.log("Player 2 exists");

		// Record player2 data
		player2 = snapshot.val().player2;
        player2Name = player2.name;
    } else {
		console.log("Player 2 does NOT exist");

		player2 = null;
		player2Name = "";
    }
});

// Attach a listener to the database /turn/ node to listen for any changes

//once("value", snapshot => snapshot.forEach(child => console.log(child.val()))

// database.ref().on("value", function(snapshot) {
//     console.log(snapshot.val().logins);
//     logins = snapshot.val().logins;
// });

////////////////////////////

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
                    console.log("welcome back");
                    console.log(snapshot.child(userName + "/globalWins").val());
                    player1.globalWins = snapshot.child(userName + "/globalWins").val();
                    player1.globalLosses = snapshot.child(userName + "/globalWins").val();
                }
                // set updated player stats to database
                database.ref().child("/players/player1").set(player1);
                database.ref().child("/users/" + userName).set(player1);
                database.ref().child("/turn/").set(1);
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
                    console.log("welcome back");
                    console.log(snapshot.child(userName + "/globalWins").val());
                    player2.globalWins = snapshot.child(userName + "/globalWins").val();
                    player2.globalLosses = snapshot.child(userName + "/globalWins").val();
                }
                // set updated player stats to database
                database.ref().child("/players/player2").set(player2);
                database.ref().child("/users/" + userName).set(player2);
                database.ref().child("/turn/").set(1);
            });

            // if user disconnects, remove player
            database.ref("/players/player2").onDisconnect().remove();
        }
        $('form').addClass("hide");
        $('#play-computer').removeClass("hide");
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