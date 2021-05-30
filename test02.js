const fs = require('fs').promises;
const kuromoji = require('kuromoji');
const builder = kuromoji.builder({
  dicPath: 'node_modules/kuromoji/dict'
});

builder.build(async (err, tokenizer)=>{
  if(err) {
    console.log(err);
    return;
  }
  const fileName = './sample.txt';
  const resdAllStr = await fs.readFile(fileName, 'utf-8');
  const oneLines = resdAllStr.split('\n');
  let words = oneLines.reduce((base, line) => {
    let lineWords = tokenizer.tokenize(line)
    .map((word) => {
      return word.surface_form
    });
    return base.concat(lineWords);
  }, []);
  words = Array.from(new Set(words));
  console.log(words);
})