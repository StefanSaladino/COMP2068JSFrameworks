var prompt = require("prompt");

prompt.start();

// Define the schema for the input
const schema = {
  properties: {
    userSelection: {
      description: "Choose ROCK, PAPER, or SCISSORS",
      pattern: /^(rock|paper|scissors)$/i,
      message: "Selection must be ROCK, PAPER, or SCISSORS",
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
      description: "Play Again",
      pattern: /^(yes|no)$/i,
      message: "Selection must be yes or no",
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

    // Store the processed input in userSelection
    const userSelection = result.userSelection;

    // Output the processed input
    console.log(`You selected: ${userSelection}`);

    computerChoice(userSelection);
    // Define the schema for the input
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

  console.log("Computer selected: " + compThrow);

  determineWinner(userSelection, compThrow);
}

function determineWinner(userSelection, compThrow) {
  if (
    (userSelection == "rock" && compThrow == "scissors") ||
    (userSelection == "paper" && compThrow == "rock") ||
    (userSelection == "scissors" && compThrow == "paper")
  ) {
    console.log("YOU WIN");
  } else if (userSelection == compThrow) {
    console.log("TIE GAME");
  } else {
    console.log("YOU LOSE");
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
    if(playAgainSelection == 'yes'){
      console.log('New game loading\n')
      userInput();
    }
    //game exits if user doesnt want to play again
    else if (playAgainSelection == 'no'){
      console.log('Goodbye');
      process.exit();
    }

}
)};

userInput();
