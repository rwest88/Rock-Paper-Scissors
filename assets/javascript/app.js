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




var player = {
    userName: userName,
    whichPlayer: null,
    choice: null,
    turn: null,
    name: null,
    wins: null,
    losses: null,
    globalWins: null,
    globalLosses: null,
    rock: null,
    paper: null,
    scissors: null,
    batman: null,
    ozzy: null,
    lizard: null,
    spock: null
};


///////////////////////////////////
var whichPlayer = 1;
// if player 1 exists in database, whichPlayer = 2
// else create player 1
function whoseturnisit() {}
function playerleaves() {}

var userName;
var logins = 0;

function writePlayerData(player, key, value) {
    var obj = [];
    obj[key] = value;
    database.ref('/players/' + player).set(obj);
}

function playerExists() {
    firebase.database().ref('/players/').once('value').then(function(snapshot) {
        if (snapshot.child(userName).exists()) {
            console.log("exists");
            return true;
        }
    });
}
//once("value", snapshot => snapshot.forEach(child => console.log(child.val()))
database.ref().on("value", function(snapshot) {
    console.log(snapshot.val().logins);
    logins = snapshot.val().logins;
});

////////////////////////////

$('#submit').click(function() {
    event.preventDefault();
    $('form').addClass("hide");
    player.userName = $('#fname').val().trim() + " " + $('#lname').val().trim();
    logins++;
    //database.ref().set({logins: logins});
    // database.ref("/players/" + userName).set(player);
    writePlayerData(player.userName, 'peepee', 0);
    writePlayerData(player.userName, 'poopoo', 23);

});

$('.rules h4 span').click(function() {
    $('.rules img').toggleClass("hide");
});
$('.shortcuts h4 span').click(function() {
    $('.shortcuts div').toggleClass("hide");
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

    // if (userGuess == "r") {var userGuessLong = "rock";}
    // if (userGuess == "p") {var userGuessLong = "paper";}
    // if (userGuess == "s") {var userGuessLong = "scissors";}
    // if (userGuess == "b") {var userGuessLong = "batman";}
    // if (userGuess == "o") {var userGuessLong = "ozzy";}
    // if (userGuess == "l") {var userGuessLong = "lizard";}
    // if (userGuess == "k") {var userGuessLong = "spock";}

    // // Randomly chooses a choice from the options array. This is the Computer's guess.
    // var computerGuess = computerChoices[Math.floor(Math.random() * computerChoices.length)];
    // if (computerGuess == "r") {var computerGuessLong = "rock";}
    // if (computerGuess == "p") {var computerGuessLong = "paper";}
    // if (computerGuess == "s") {var computerGuessLong = "scissors";}
    // if (computerGuess == "b") {var computerGuessLong = "batman";}
    // if (computerGuess == "o") {var computerGuessLong = "ozzy";}
    // if (computerGuess == "l") {var computerGuessLong = "lizard";}
    // if (computerGuess == "k") {var computerGuessLong = "spock";}
    
    // // Alerts the key the user pressed (userGuess).
    // alert("User guess: " + userGuessLong + ",  Computer guess: " + computerGuessLong);

    // if (computerGuess == userGuess) {alert("Tie!"); ties++;}

    // if (userGuess == "r" && computerGuess == "s") {alert("You Win! Rock smashes Scissors."); wins++;}
    // if (userGuess == "r" && computerGuess == "b") {alert("You Win! Rock crushes Batman."); wins++;}
    // if (userGuess == "r" && computerGuess == "l") {alert("You Win! Rock smashes Lizard."); wins++;}
    // if (userGuess == "r" && computerGuess == "p") {alert("You Lose! Paper covers Rock."); losses++;}
    // if (userGuess == "r" && computerGuess == "o") {alert("You Lose! Ozzy smokes Rock."); losses++;}
    // if (userGuess == "r" && computerGuess == "k") {alert("You Lose! Spock vaporizes Rock."); losses++;}

    // if (userGuess == "p" && computerGuess == "b") {alert("You Win! Paper (money) spoils Batman."); wins++;}
    // if (userGuess == "p" && computerGuess == "k") {alert("You Win! Paper disproves Spock."); wins++;}
    // if (userGuess == "p" && computerGuess == "r") {alert("You Win! Paper covers Rock."); wins++;} 
    // if (userGuess == "p" && computerGuess == "o") {alert("You Lose! Ozzy smokes Paper."); losses++;} 
    // if (userGuess == "p" && computerGuess == "s") {alert("You Lose! Scissors cuts Paper."); losses++;}
    // if (userGuess == "p" && computerGuess == "l") {alert("You Lose! Lizard eats Paper."); losses++;}

    // if (userGuess == "s" && computerGuess == "o") {alert("You Win! Scissors dehair Ozzy."); wins++;}
    // if (userGuess == "s" && computerGuess == "l") {alert("You Win! Scissors decapitates Lizard."); wins++;}
    // if (userGuess == "s" && computerGuess == "p") {alert("You Win! Scissors cuts paper."); wins++;} 
    // if (userGuess == "s" && computerGuess == "r") {alert("You Lose! Rock smashes Scissors."); losses++;}  
    // if (userGuess == "s" && computerGuess == "b") {alert("You Lose! Batman deflects Scissors."); losses++;}
    // if (userGuess == "s" && computerGuess == "k") {alert("You Lose! Spock smashes Scissors."); losses++;}

    // if (userGuess == "b" && computerGuess == "o") {alert("You Win! Batman decapitates (extracts revenge upon) Ozzy."); wins++;} 
    // if (userGuess == "b" && computerGuess == "k") {alert("You Win! Batman outvoices Spock."); wins++;} 
    // if (userGuess == "b" && computerGuess == "s") {alert("You Win! Batman deflects Scissors."); wins++;} 
    // if (userGuess == "b" && computerGuess == "l") {alert("You Lose! Lizard poisons Batman."); losses++;}
    // if (userGuess == "b" && computerGuess == "r") {alert("You Lose! Rock crushes Batman."); losses++;}
    // if (userGuess == "b" && computerGuess == "p") {alert("You Lose! Paper (money) spoils Batman."); losses++;}

    // if (userGuess == "o" && computerGuess == "l") {alert("You Win! Ozzy decapitates lizard."); wins++;}
    // if (userGuess == "o" && computerGuess == "r") {alert("You Win! Ozzy smokes Rock."); wins++;}
    // if (userGuess == "o" && computerGuess == "p") {alert("You Win! Ozzy smokes Paper."); wins++;} 
    // if (userGuess == "o" && computerGuess == "k") {alert("You Lose! Spock outsmarts Ozzy."); losses++;} 
    // if (userGuess == "o" && computerGuess == "s") {alert("You Lose! Scissors dehair Ozzy."); losses++;} 
    // if (userGuess == "o" && computerGuess == "b") {alert("You Lose! Batman decapitates (extracts revenge upon) Ozzy."); losses++;} 

    // if (userGuess == "l" && computerGuess == "p") {alert("You Win! Lizard eats Paper."); wins++;}
    // if (userGuess == "l" && computerGuess == "b") {alert("You Win! Lizard poisons Batman."); wins++;} 
    // if (userGuess == "l" && computerGuess == "k") {alert("You Win! Lizard poisons Spock."); wins++;}  
    // if (userGuess == "l" && computerGuess == "r") {alert("You Lose! Rock smashes Lizard."); losses++;}
    // if (userGuess == "l" && computerGuess == "s") {alert("You Lose! Scissors decapitate Lizard."); losses++;}
    // if (userGuess == "l" && computerGuess == "o") {alert("You Lose! Ozzy decapitates Lizard."); losses++;} 

    // if (userGuess == "k" && computerGuess == "r") {alert("You Win! Spock vaporizes Rock."); wins++;}
    // if (userGuess == "k" && computerGuess == "s") {alert("You Win! Spock smashes Scissors."); wins++;} 
    // if (userGuess == "k" && computerGuess == "o") {alert("You Win! Spock outsmarts Ozzy."); wins++;}  
    // if (userGuess == "k" && computerGuess == "p") {alert("You Lose! Paper disproves Spock."); losses++;}
    // if (userGuess == "k" && computerGuess == "b") {alert("You Lose! Batman outvoices Spock."); losses++;}
    // if (userGuess == "k" && computerGuess == "l") {alert("You Lose! Lizard poisons Spock."); losses++;} 


    // alert("Wins: " + wins + ",  Losses: " + losses + ",  Ties: " + ties);

};