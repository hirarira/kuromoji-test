var fs = require('fs');
var MarkovChain = require('markov-chain-kuromoji');
var markov = new MarkovChain(fs.readFileSync('sample.txt', 'utf8'));

markov.start(5, function(output) {
  console.log(output);
});
