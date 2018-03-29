
//...........................
// Initialize Firebase
//...........................

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

//..........................
// Global Variables
//..........................

var player1 = null;
var player2 = null;
var userName = null;

var user = null;
var opponent = null;
var p1onceExisted = false;
var p2onceExisted = false;
var inFirst = "";

var countEnabled = true;
var buttonsEnabled = false;
var multiplayerEnabled = false;
var computerEnabled = false;
var computerGuess = "";

var battle = new Audio('assets/audio/ninja.mp3');

//..............................................................................................................
// first we need to listen for any connected users and store or delete our local objects
// this will fire everytime anything in the database changes
// I'm being very careful not to break anything, but I can probably DRY up this section by merging repeats into:
//// 1) an 'if ( !(player1.exists()) || !(player2.exists()) )'  and
//// 2) the 'if (player1.exists() && player2.exists())'
//..............................................................................................................

database.ref("/players/").on("value", function(snapshot) {

	// Check for existence of player 1 in the database       //// if player 1 exists ////
  if (snapshot.child("player1").exists()) {
    console.log("Player 1 exists");
    p1onceExisted = true;
    if (!(snapshot.child("player2").exists())) {inFirst = "1"};

    // Record player1 data
    player1 = snapshot.val().player1;
    
    // if the user has submitted their name and became assigned as player1
    if (userName == player1.name && userName !== null) {
      user = player1;
      user.player = "1";
      if (!multiplayerEnabled) {  //we don't want nested code to run during multiplayer game
        computerEnabled = true;
        buttonsEnabled = true;
        $('.weapon').addClass('pointer');
        $('#user').text(`${user.displayName}: ${user.winsVScomp}`).addClass('pointer');
        $('#opponent').text(`Computer: ${user.compWins}`).removeClass('pointer');
        setTimeout(function() {  //set timeout is important to allow the welcome message upon login to be readable
          $('#message1').text("waiting for an opponent...");
          $('#message2').text("Use this time to practice against the computer.");
        }, 3000);
      }
    } else {
      opponent = player1;
      opponent.player = 1;
      if (!multiplayerEnabled) {
        setTimeout(function() {
          $('#message1').text('Your opponent awaits!!!');
          $('#opponent').text(`${opponent.displayName}: ${opponent.wins}`).addClass('pointer');
        }, 2990);
      }
    }
  } else {                                           //// if player 1 does NOT exist ////
    console.log("Player 1 does NOT exist");
    player1 = null; // this is key for login order
    multiplayerEnabled = false;
    if (p1onceExisted) {
      if (!computerEnabled) {
        $('#message1').text("Opponent has disconnected!");
        $('#message2').text("Hmmm.");
        opponent = null;
        if (userName !== null) {  //prevent the message below if user hasn't logged in
          setTimeout(function() {
            $('#message1').text("waiting for an opponent...");
            $('#message2').text("Use this time to practice against the computer.");
            $('#user').text(`${user.displayName}: ${user.winsVScomp}`).addClass('pointer');
            $('#opponent').text(`Computer: ${user.compWins}`).removeClass('pointer');
          }, 3000);
        }
      }
      computerEnabled = true;
    }
  }

  // Check for existence of player 2 in the database      //// if player 2 exists ////
  if (snapshot.child("player2").exists()) {
    console.log("Player 2 exists");
    p2onceExisted = true;
    if (!(snapshot.child("player1").exists())) {inFirst = "2"};

    // Record player2 data
    player2 = snapshot.val().player2;

    // if the user has submitted their name
    if (userName == player2.name && userName !== null) {
      user = player2;
      user.player = "2";
      if (!multiplayerEnabled) {
        $('#user').text(`${user.displayName}: ${user.winsVScomp}`).addClass('pointer');
        $('#opponent').text(`Computer: ${user.compWins}`).removeClass('pointer');
        buttonsEnabled = true;
        $('.weapon').addClass('pointer');
        setTimeout(function() {
          $('#message1').text("waiting for an opponent...");
          $('#message2').text("Use this time to practice against the computer.");
        }, 3000);
      }
    } else {
      opponent = player2;
      opponent.player = 2;
      if (!multiplayerEnabled) {
        setTimeout(function() {
          $('#message1').text('Your opponent awaits!!!');
          $('#opponent').text(`${opponent.displayName}: ${opponent.wins}`).addClass('pointer');
        }, 3000);
      }
    }
  } else {                                             //// if player 2 does NOT exist ////
    console.log("Player 2 does NOT exist");
    player2 = null; // this is key for login order
    multiplayerEnabled = false;
    if (p2onceExisted) {
      if (!computerEnabled) {
        $('#message1').text("Opponent has disconnected!");
        $('#message2').text("Hmmm.");
        opponent = null;
        setTimeout(function() {
          $('#message1').text("waiting for an opponent...");
          $('#message2').text("Use this time to practice against the computer.");
          $('#user').text(`${user.displayName}: ${user.winsVScomp}`).addClass('pointer');
          $('#opponent').text(`Computer: ${user.compWins}`).removeClass('pointer');
        }, 3000);
      }
      computerEnabled = true;
    }
  }

  //check if two players are logged in and introduce the game once               ///////
  if (snapshot.child("player1").exists() && snapshot.child("player2").exists()) {
    if (!multiplayerEnabled) { // this happens once per double-login
      multiplayerEnabled = true;
      if (user.player == inFirst) {
        $('#message1').text('opponent found!');
        $('#message2').text('Yay!');
      }
      computerEnabled = false;
      buttonsEnabled = false;
      countEnabled = true;
      $('.weapon').removeClass('pointer');
      $('.p1-weapon img').attr('src', "assets/images/qm.png");
      $('.p2-weapon img').attr('src', "assets/images/qm.png");
      $('#user').text(`${user.displayName}: ${user.wins}`).addClass('pointer');
      $('#opponent').text(`${opponent.displayName}: ${opponent.wins}`).addClass('pointer');
      setTimeout(function() {
        battle.play();
        $('#message1').text('time to game.');
        $('#message2').text('Get ready!');
      }, 3000);
    }
    $('#user').text(`${user.displayName}: ${user.wins}`);
    $('#opponent').text(`${opponent.displayName}: ${opponent.wins}`);
    if (user.choice !== "" && opponent.choice !== "") {
      console.log("super cool");
      compareMulti();
    }
    setTimeout(countItOff, 5000);
  }

  // if no players exist                                                    ///////
  if (!(snapshot.child("player1").exists() || snapshot.child("player2").exists())) {
    buttonsEnabled = false;
    p1onceExisted = false;
    p2onceExisted = false;
    console.log('Neither player exists');
    $('.weapon').removeClass('pointer');
    setTimeout(function() {
      $('#message1').text('looking for online players...');
      $('#message2').addClass("hide");
      $('#user').text('???').removeClass('pointer');
      $('#opponent').text('???').removeClass('pointer');
    }, 3000);
  }
});

//.........................................
//
// Click Handlers ( and keydown handlers )
//
//.........................................

//.........................................
// Submit button (form)
//.........................................

$('#submit').click(function() {

  event.preventDefault();

  // if login fields are good AND both players aren't queued...
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
        winsVScomp: 0,
        compWins: 0,
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
          player1.wins = 0; player1.losses = 0; player1.choice = "";
        } else {
          $('#message1').text("Hi, " + userName + ".");
          $('#message2').text("Thank you for joining!");
        }
        // set updated player stats to database
        database.ref().child("/players/player1").set(player1);
        database.ref().child("/users/" + userName).set(player1);
      });

      // if player disconnects, remove player from database
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
        winsVScomp: 0,
        compWins: 0,
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
          player2.wins = 0; player2.losses = 0; player2.choice = "";
        } else {
          $('#message1').text("Hi, " + userName + ".");
          $('#message2').text("Thank you for joining!");
        }
        // set updated player stats to database
        database.ref().child("/players/player2").set(player2);
        database.ref().child("/users/" + userName).set(player2);
      });

      // if player disconnects, remove player from database
      database.ref("/players/player2").onDisconnect().remove();
    }

    $('form').addClass("invisible");
    $('#message2').removeClass("hide");
  }

});

//....................................
// Rules Map expand
//....................................

$('#rules-link').click(function() {
  $('.rules img').toggleClass("hide");
});

//....................................
// Keyboard Shortcuts expand
//....................................

$('#keybd-shortcuts-link').click(function() {
  $('#keybd-shortcuts').toggleClass("hide");
});

//....................................
// Player Data 
//....................................

$('#user').click(function() {
  if (user !== null) {
    console.log(user); // UI later
  }
});

$('#opponent').click(function() {
  if (opponent !== null) {
    console.log(opponent); // UI later
  }
});

//....................................
// Weapon Select
//....................................

$('.weapon').click(function() {
  if (buttonsEnabled) {
    $('.weapon').each(function() {
      $(this).attr('src', $(this).attr('src').replace("2.png", ".png"));
    });
    $('.p1-weapon img').attr("src", $(this).attr("src"));
    $(this).attr('src', $(this).attr('src').replace(".png", "2.png"));

    user.choice = $(this).data('key');

    if (multiplayerEnabled) {
      if (user.player == "1") {
        database.ref('/players/').once('value').then(function(snapshot) {
          opponent.choice = snapshot.child("player2/choice").val();
        });
        database.ref().child("/players/player1").set(user);
      } else {
        database.ref('/players/').once('value').then(function(snapshot) {
          opponent.choice = snapshot.child("player1/choice").val();
        });
        database.ref().child("/players/player2").set(user);
      }

    } else if (computerEnabled) {
      compareComputer();

    } else {
      console.log('error!');
    }
  }
});

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

//.............................................
//
// More Functions
//
//.............................................

//.............................................
// Countdown for each multiplayer round
//.............................................

function countItOff() {
  if (countEnabled) {
    countEnabled = false;
    $('.p1-weapon img').attr('src', "assets/images/qm.png");
    $('.p2-weapon img').attr('src', "assets/images/qm.png");
    setTimeout(function() {
      $('#message1').text('rock...');
      $('#message2').text('Fuck it up!');
    }, 3000);
    setTimeout(function() {
      $('#message1').text('rock...');
    }, 3333);
    setTimeout(function() {
      $('#message1').text('paper...');
    }, 3666);
    setTimeout(function() {
      $('#message1').text('scissors...');
    }, 4000);
    setTimeout(function() {
      $('#message1').text('(batman ozzy lizard spock)');
    }, 4333);
    setTimeout(function() {
      $('#message1').text('SHOOT!');
      $('#message2').text('Oh baby!');
      buttonsEnabled = true;
      $('.weapon').addClass('pointer');
    }, 4888);
  }
}

//.................................................
// Comparison for Computer Mode
//.................................................

function compareComputer() {
  var computerChoices = ["r", "p", "s", "b", "o", "l", "k"];
  computerGuess = computerChoices[Math.floor(Math.random() * 7)];
  $('.p2-weapon img').attr('src', $(`[data-key=${computerGuess}]`).attr('src'));
  console.log(computerGuess);
  if (computerGuess == user.choice) {$('#message1').text("Tie!");}

  if (user.choice == "r") {user.rock++;
    if (computerGuess == "s") {$('#message1').text("You Win! Rock smashes Scissors."); user.winsVScomp++;}
    if (computerGuess == "b") {$('#message1').text("You Win! Rock crushes Batman."); user.winsVScomp++;}
    if (computerGuess == "l") {$('#message1').text("You Win! Rock smashes Lizard."); user.winsVScomp++;}
    if (computerGuess == "p") {$('#message1').text("You Lose! Paper covers Rock."); user.compWins++;}
    if (computerGuess == "o") {$('#message1').text("You Lose! Ozzy smokes Rock."); user.compWins++;}
    if (computerGuess == "k") {$('#message1').text("You Lose! Spock vaporizes Rock."); user.compWins++;}
  }

  if (user.choice == "p") {user.paper++;
    if (computerGuess == "b") {$('#message1').text("You Win! Paper (money) spoils Batman."); user.winsVScomp++;}
    if (computerGuess == "k") {$('#message1').text("You Win! Paper disproves Spock."); user.winsVScomp++;}
    if (computerGuess == "r") {$('#message1').text("You Win! Paper covers Rock."); user.winsVScomp++;} 
    if (computerGuess == "o") {$('#message1').text("You Lose! Ozzy smokes Paper."); user.compWins++;} 
    if (computerGuess == "s") {$('#message1').text("You Lose! Scissors cuts Paper."); user.compWins++;}
    if (computerGuess == "l") {$('#message1').text("You Lose! Lizard eats Paper."); user.compWins++;}
  }

  if (user.choice == "s") {user.scissors++;
    if (computerGuess == "o") {$('#message1').text("You Win! Scissors dehair Ozzy."); user.winsVScomp++;}
    if (computerGuess == "l") {$('#message1').text("You Win! Scissors decapitates Lizard."); user.winsVScomp++;}
    if (computerGuess == "p") {$('#message1').text("You Win! Scissors cuts paper."); user.winsVScomp++;} 
    if (computerGuess == "r") {$('#message1').text("You Lose! Rock smashes Scissors."); user.compWins++;}  
    if (computerGuess == "b") {$('#message1').text("You Lose! Batman deflects Scissors."); user.compWins++;}
    if (computerGuess == "k") {$('#message1').text("You Lose! Spock smashes Scissors."); user.compWins++;}
  }

  if (user.choice == "b") {user.batman++;
    if (computerGuess == "o") {$('#message1').text("You Win! Batman decapitates Ozzy."); user.winsVScomp++;} 
    if (computerGuess == "k") {$('#message1').text("You Win! Batman outvoices Spock."); user.winsVScomp++;} 
    if (computerGuess == "s") {$('#message1').text("You Win! Batman deflects Scissors."); user.winsVScomp++;} 
    if (computerGuess == "l") {$('#message1').text("You Lose! Lizard poisons Batman."); user.compWins++;}
    if (computerGuess == "r") {$('#message1').text("You Lose! Rock crushes Batman."); user.compWins++;}
    if (computerGuess == "p") {$('#message1').text("You Lose! Paper (money) spoils Batman."); user.compWins++;}
  }

  if (user.choice == "o") {user.ozzy++;
    if (computerGuess == "l") {$('#message1').text("You Win! Ozzy decapitates lizard."); user.winsVScomp++;}
    if (computerGuess == "r") {$('#message1').text("You Win! Ozzy smokes Rock."); user.winsVScomp++;}
    if (computerGuess == "p") {$('#message1').text("You Win! Ozzy smokes Paper."); user.winsVScomp++;} 
    if (computerGuess == "k") {$('#message1').text("You Lose! Spock outsmarts Ozzy."); user.compWins++;} 
    if (computerGuess == "s") {$('#message1').text("You Lose! Scissors dehair Ozzy."); user.compWins++;} 
    if (computerGuess == "b") {$('#message1').text("You Lose! Batman decapitates Ozzy."); user.compWins++;} 
  }

  if (user.choice == "l") {user.lizard++;
    if (computerGuess == "p") {$('#message1').text("You Win! Lizard eats Paper."); user.winsVScomp++;}
    if (computerGuess == "b") {$('#message1').text("You Win! Lizard poisons Batman."); user.winsVScomp++;} 
    if (computerGuess == "k") {$('#message1').text("You Win! Lizard poisons Spock."); user.winsVScomp++;}  
    if (computerGuess == "r") {$('#message1').text("You Lose! Rock smashes Lizard."); user.compWins++;}
    if (computerGuess == "s") {$('#message1').text("You Lose! Scissors decapitate Lizard."); user.compWins++;}
    if (computerGuess == "o") {$('#message1').text("You Lose! Ozzy decapitates Lizard."); user.compWins++;} 
  }

  if (user.choice == "k") {user.spock++;
    if (computerGuess == "r") {$('#message1').text("You Win! Spock vaporizes Rock."); user.winsVScomp++;}
    if (computerGuess == "s") {$('#message1').text("You Win! Spock smashes Scissors."); user.winsVScomp++;} 
    if (computerGuess == "o") {$('#message1').text("You Win! Spock outsmarts Ozzy."); user.winsVScomp++;}  
    if (computerGuess == "p") {$('#message1').text("You Lose! Paper disproves Spock."); user.compWins++;}
    if (computerGuess == "b") {$('#message1').text("You Lose! Batman outvoices Spock."); user.compWins++;}
    if (computerGuess == "l") {$('#message1').text("You Lose! Lizard poisons Spock."); user.compWins++;} 
  }

  $('#user').text(`${user.displayName}: ${user.winsVScomp}`);
  $('#opponent').text(`Computer: ${user.compWins}`);

  // setTimeout(function() {
    if (user.player == "1") {
      database.ref().child("/players/player1").set(user);
      //.once should go here for opponent
    } else {
      database.ref().child("/players/player2").set(user);
    }
  // }, 4000);
  database.ref().child("/users/" + user.name).set(user);
}

//.................................................
// Comparison for Multiplayer Mode
//.................................................

function compareMulti() {
  buttonsEnabled = false;
  $('.weapon').removeClass('pointer');
  $('.p2-weapon img').attr('src', $(`[data-key=${opponent.choice}]`).attr('src'));

  if (opponent.choice == user.choice) {$('#message1').text("Tie!");}

  if (user.choice == "r") {user.rock++;
    if (opponent.choice == "s") {$('#message1').text("You Win! Rock smashes Scissors."); $('#message2').text("Classic."); user.wins++; user.globalWins++;}
    if (opponent.choice == "b") {$('#message1').text("You Win! Rock crushes Batman."); $('#message2').text("Batman forgot his paper."); user.wins++; user.globalWins++;}
    if (opponent.choice == "l") {$('#message1').text("You Win! Rock smashes Lizard."); $('#message2').text("Poor little guy."); user.wins++; user.globalWins++;}
    if (opponent.choice == "p") {$('#message1').text("You Lose! Paper covers Rock."); $('#message2').text("Classic, albeit ridiculous."); user.losses++; user.globalLosses++;}
    if (opponent.choice == "o") {$('#message1').text("You Lose! Ozzy smokes Rock."); $('#message2').text("He may have, a time or two."); user.losses++; user.globalLosses++;}
    if (opponent.choice == "k") {$('#message1').text("You Lose! Spock vaporizes Rock."); $('#message2').text("So says Sheldon."); user.losses++; user.globalLosses++;}
  }

  if (user.choice == "p") {user.paper++;
    if (opponent.choice == "b") {$('#message1').text("You Win! Paper spoils Batman."); $('#message2').text("Get it? Like, paper as in money? Am I right???"); user.wins++; user.globalWins++;}
    if (opponent.choice == "k") {$('#message1').text("You Win! Paper disproves Spock."); $('#message2').text("The pen is mightier than the logic."); user.wins++; user.globalWins++;}
    if (opponent.choice == "r") {$('#message1').text("You Win! Paper covers Rock."); $('#message2').text("Classic, albeit ridiculous."); user.wins++;} user.globalWins++; 
    if (opponent.choice == "o") {$('#message1').text("You Lose! Ozzy smokes Paper."); $('#message2').text("Likely with other stuff inside."); user.losses++; user.globalLosses++;} 
    if (opponent.choice == "s") {$('#message1').text("You Lose! Scissors cuts Paper."); $('#message2').text("Classic!"); user.losses++; user.globalLosses++;}
    if (opponent.choice == "l") {$('#message1').text("You Lose! Lizard eats Paper."); $('#message2').text("Why not?"); user.losses++; user.globalLosses++;}
  }

  if (user.choice == "s") {user.scissors++;
    if (opponent.choice == "o") {$('#message1').text("You Win! Scissors dehair Ozzy."); $('#message2').text("Hard to picture..."); user.wins++; user.globalWins++;}
    if (opponent.choice == "l") {$('#message1').text("You Win! Scissors decapitates Lizard."); $('#message2').text("Because."); user.wins++; user.globalWins++;}
    if (opponent.choice == "p") {$('#message1').text("You Win! Scissors cuts paper."); $('#message2').text("Classic!"); user.wins++;} user.globalWins++; 
    if (opponent.choice == "r") {$('#message1').text("You Lose! Rock smashes Scissors."); $('#message2').text("A true classic!"); user.losses++; user.globalLosses++;}  
    if (opponent.choice == "b") {$('#message1').text("You Lose! Batman deflects Scissors."); $('#message2').text("Fuck a scissor."); user.losses++; user.globalLosses++;}
    if (opponent.choice == "k") {$('#message1').text("You Lose! Spock smashes Scissors."); $('#message2').text("Because looks like scissors but bigger?"); user.losses++; user.globalLosses++;}
  }

  if (user.choice == "b") {user.batman++;
    if (opponent.choice == "o") {$('#message1').text("You Win! Batman decapitates Ozzy."); $('#message2').text("Cold revenge for his bat friends."); user.wins++; user.globalWins++;} 
    if (opponent.choice == "k") {$('#message1').text("You Win! Batman outvoices Spock."); $('#message2').text("WHERE'S THE TRIGGER?!?!"); user.wins++; user.globalWins++;} 
    if (opponent.choice == "s") {$('#message1').text("You Win! Batman deflects Scissors."); $('#message2').text("Fuck a scissor."); user.wins++; user.globalWins++;} 
    if (opponent.choice == "l") {$('#message1').text("You Lose! Lizard poisons Batman."); $('#message2').text("I dunno. The game had to work."); user.losses++; user.globalLosses++;}
    if (opponent.choice == "r") {$('#message1').text("You Lose! Rock crushes Batman."); $('#message2').text("Batman forgot his paper."); user.losses++; user.globalLosses++;}
    if (opponent.choice == "p") {$('#message1').text("You Lose! Paper spoils Batman."); $('#message2').text("Get it? Like, paper as in money? Am I right???"); user.losses++; user.globalLosses++;}
  }

  if (user.choice == "o") {user.ozzy++;
    if (opponent.choice == "l") {$('#message1').text("You Win! Ozzy decapitates lizard."); $('#message2').text("With his mouf."); user.wins++; user.globalWins++;}
    if (opponent.choice == "r") {$('#message1').text("You Win! Ozzy smokes Rock."); $('#message2').text("He may have, a time or two."); user.wins++; user.globalWins++;}
    if (opponent.choice == "p") {$('#message1').text("You Win! Ozzy smokes Paper."); $('#message2').text("Likely with other stuff inside."); user.wins++; user.globalWins++;} 
    if (opponent.choice == "k") {$('#message1').text("You Lose! Spock outsmarts Ozzy."); $('#message2').text("Obvi."); user.losses++; user.globalLosses++;} 
    if (opponent.choice == "s") {$('#message1').text("You Lose! Scissors dehair Ozzy."); $('#message2').text("Hard to picture..."); user.losses++; user.globalLosses++;} 
    if (opponent.choice == "b") {$('#message1').text("You Lose! Batman decapitates Ozzy."); $('#message2').text("Cold revenge for his bat friends."); user.losses++; user.globalLosses++;} 
  }

  if (user.choice == "l") {user.lizard++;
    if (opponent.choice == "p") {$('#message1').text("You Win! Lizard eats Paper."); $('#message2').text("Why not?"); user.wins++; user.globalWins++;}
    if (opponent.choice == "b") {$('#message1').text("You Win! Lizard poisons Batman."); $('#message2').text("I dunno. The game had to work."); user.wins++; user.globalWins++;} 
    if (opponent.choice == "k") {$('#message1').text("You Win! Lizard poisons Spock."); $('#message2').text("Whatever."); user.wins++; user.globalWins++;}  
    if (opponent.choice == "r") {$('#message1').text("You Lose! Rock smashes Lizard."); $('#message2').text("Poor little guy."); user.losses++; user.globalLosses++;}
    if (opponent.choice == "s") {$('#message1').text("You Lose! Scissors decapitates Lizard."); $('#message2').text("Because."); user.losses++; user.globalLosses++;}
    if (opponent.choice == "o") {$('#message1').text("You Lose! Ozzy decapitates Lizard."); $('#message2').text("With his mouf."); user.losses++; user.globalLosses++;} 
  }

  if (user.choice == "k") {user.spock++;
    if (opponent.choice == "r") {$('#message1').text("You Win! Spock vaporizes Rock."); $('#message2').text("So says Sheldon."); user.wins++; user.globalWins++;}
    if (opponent.choice == "s") {$('#message1').text("You Win! Spock smashes Scissors."); $('#message2').text("Because looks like scissors but bigger?"); user.wins++; user.globalWins++;} 
    if (opponent.choice == "o") {$('#message1').text("You Win! Spock outsmarts Ozzy."); $('#message2').text("Obvi."); user.wins++; user.globalWins++;}  
    if (opponent.choice == "p") {$('#message1').text("You Lose! Paper disproves Spock."); $('#message2').text("The pen is mightier than the logic."); user.losses++; user.globalLosses++;}
    if (opponent.choice == "b") {$('#message1').text("You Lose! Batman outvoices Spock."); $('#message2').text("WHERE'S THE TRIGGER?!?!"); user.losses++; user.globalLosses++;}
    if (opponent.choice == "l") {$('#message1').text("You Lose! Lizard poisons Spock."); $('#message2').text("Whatever."); user.losses++; user.globalLosses++;} 
  }

  $('#user').text(`${user.displayName}: ${user.wins}`);
  $('#opponent').text(`${opponent.displayName}: ${opponent.wins}`); // doesn't actually

  user.choice = "";

  // setTimeout(function() {
    if (user.player == "1") {
      database.ref().child("/players/player1").set(user);
    } else {
      database.ref().child("/players/player2").set(user);
    }
  // }, 4000);

  database.ref().child("/users/" + user.name).set(user);

  countEnabled = true;
}

//......................................
// future development
//......................................
// 
// a chatbox *maybe*
// buttons disable after first mover chooses (medium-hard)
// UI for stats (with nice organization (most and least chosen)) (hard)
// clickable rules map (hard)
// a leaderboard *maybe* (win-lose ratio) (hard)
// show 'please wait, a game is in progress' when appropriate (easy)
// when one user logs out, the other's wins and losses get cleared (use opponent.wins) (easy)
// fix console error on double-exit
// cleaner buttons (hard)
// better timeouts (hard)
// cleaner code? (very hard)
// 
// ....................................