const fs = require('fs').promises;
const kuromoji = require('kuromoji');
const builder = kuromoji.builder({
  dicPath: 'node_modules/kuromoji/dict'
});

class KuromojiWords {
  constructor(baseWords, tokenizer) {
    const oneLines = baseWords.split('\n');
    this.words = oneLines.reduce((base, line) => {
      let lineWords = tokenizer.tokenize(line);
      return base.concat(lineWords);
    }, []);
    // 重複を除外
    this.words = Array.from(new Set(this.words));
  }
  getRandWord(num) {
    return [...Array(num)].reduce((base)=>{
      const word = this.words[Math.floor(Math.random()*this.words.length)];
      return `${base}${word.surface_form}`
    }, '');
  }
}

builder.build(async (err, tokenizer)=>{
  if(err) {
    console.log(err);
    return;
  }
  const fileName = './sample.txt';
  const resdAllStr = await fs.readFile(fileName, 'utf-8');
  const kuromojiWords = new KuromojiWords(resdAllStr, tokenizer);
  console.log(kuromojiWords.getRandWord(20));
})