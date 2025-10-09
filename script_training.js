// Boolean
let isOffside = true;
let isOnside = false;

console.log("Việt vị", isOffside);
console.log("Không việt vị", isOnside);

// Null
let goal = null;
console.log("Goal: ", goal);

// Undefined
let match;
console.log("Next Match:", match);

match = "1/1/2026";
console.log("Next Match (Updated):", match);

// Symbol
const playerA = Symbol("team");
const playerB = Symbol("team");
console.log("Player A and Player B are the same person:", playerA === playerB);

// Object
var theGoat = {
  name = "Ronaldo";
  age = 40;
  born = "Portugal";
  theSignature = function(){
    alert("Siuuu!");
  }
};

console.log("Cristiano Ronaldo:", theGoat);

// Array
var topTeam = ["Man City", "Real Madrid", "Bayern Munich"];
console.log(topTeam);
