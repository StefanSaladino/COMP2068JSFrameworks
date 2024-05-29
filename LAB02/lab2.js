var prompt = require("prompt");
var colors = require("@colors/colors/safe");

prompt.start();

prompt.message = ''; // Empty string to remove the prefix

// Define the schema for the input
const schema = {
  properties: {
    userSelection: {
      description: colors.rainbow("Choose ROCK, PAPER, or SCISSORS"),
      pattern: /^(rock|paper|scissors|r|p|s)$/i,
      message: colors.red("Selection must be ROCK, PAPER, or SCISSORS"),
      required: true,
      before: function (value) {
        return value.trim().toLowerCase();
      },
    },
  },
};

const replaySchema = {
  properties: {
    playAgain: {
      description: colors.magenta("Play Again"),
      pattern: /^(yes|no|y|n)$/i,
      message: colors.red("Selection must be yes or no"),
      required: true,
      before: function (value) {
        return value.trim().toLowerCase();
      },
    },
  },
};

// Prompt the user for input
function userInput() {

  prompt.get(schema, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }

    if(result.userSelection == 'rock' || result.userSelection == 'r'){
      result.userSelection = 'rock';
    }
    else if(result.userSelection == 'scissors' || result.userSelection == 's'){
      result.userSelection = 'scissors';
    }
    else if(result.userSelection == 'paper' || result.userSelection == 'p'){
      result.userSelection = 'paper';
    }
    // Store the processed input in userSelection
    const userSelection = result.userSelection;

    // Output the processed input
    console.log(colors.green(`You selected: ${userSelection}`));

    computerChoice(userSelection);
  });
}

//computer turn
function computerChoice(userSelection) {
  const randomFloat = Math.random();
  let compThrow;

  if (randomFloat < 0.35) {
    compThrow = "paper";
  } else if (randomFloat > 0.34 && randomFloat < 0.68) {
    compThrow = "rock";
  } else {
    compThrow = "scissors";
  }

  console.log(colors.red("Computer selected: " + compThrow));

  determineWinner(userSelection, compThrow);
}

function determineWinner(userSelection, compThrow) {
  if (
    (userSelection == "rock" && compThrow == "scissors") ||
    (userSelection == "paper" && compThrow == "rock") ||
    (userSelection == "scissors" && compThrow == "paper")
  ) {
    console.log(colors.america("YOU WIN"));
  } else if (userSelection == compThrow) {
    console.log(colors.yellow("TIE GAME"));
  } else {
    console.log(colors.red("YOU LOSE"));
  }
  replay();
}

//prompting user to play again or not
function replay() {
  //second prompt
  prompt.get(replaySchema, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    const playAgainSelection = result.playAgain;

    //returned to main prompt if user wants to play again
    if(playAgainSelection == 'yes' || playAgainSelection == 'y'){
      console.log('New game loading\n')
      userInput();
    }
    //game exits if user doesn't want to play again
    else if (playAgainSelection == 'no' || playAgainSelection == 'n'){
      console.log('Goodbye');
      process.exit();
    }
}
)};

userInput();
