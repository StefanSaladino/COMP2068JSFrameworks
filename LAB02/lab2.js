var prompt = require('prompt');

// Define the schema for the input
const schema = {
    properties: {
      userSelection: {
        description: 'Choose ROCK, PAPER, or SCISSORS',
        pattern: /^(rock|paper|scissors)$/i,
        message: 'Selection must be ROCK, PAPER, or SCISSORS',
        required: true,
        before: function(value) {
          return value.trim().toLowerCase();
        }
      }
    }
  };
    
// Prompt the user for input
function userInput(){
prompt.get(schema, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
  
    // Store the processed input in userSelection
    const userSelection = result.userSelection;
  
    // Output the processed input
    console.log(`You selected: ${userSelection}`);

    var prompt = require('prompt');

  // Start the prompt
  prompt.start();
  computerChoice(userSelection);
// Define the schema for the input
})
};
    
//computer turn
function computerChoice(userSelection){
const randomFloat = Math.random();
let compThrow;

if (randomFloat< 0.35){
    compThrow = 'paper'
}

else if (randomFloat> 0.34 && randomFloat< 0.68){
    compThrow = 'rock'
}

else{
    compThrow = 'scissors'
}

console.log('Computer selected: ' + compThrow);

determineWinner(userSelection, compThrow);
}

function determineWinner(userSelection, compThrow){
  if (userSelection == 'rock' && compThrow == 'scissors' || userSelection == 'paper' && compThrow == 'rock' ||
  userSelection == 'scissors' && compThrow == 'paper')
  {
    console.log('YOU WIN');
  }
  else if (userSelection == compThrow){
    console.log('TIE GAME');
  }
  else {
    console.log('YOU LOSE');
  }
}

userInput();
