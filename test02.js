const fs = require('fs').promises;
const kuromoji = require('kuromoji');
const builder = kuromoji.builder({
  dicPath: 'node_modules/kuromoji/dict'
});

class KuromojiWords {
  constructor(fileName) {
    return new Promise((resolve, reject) => {
      builder.build(async (err, tokenizer)=>{
        if(err) {
          reject(err);
        }
        const resdAllStr = await fs.readFile(fileName, 'utf-8');
        const oneLines = resdAllStr.split('\n');
        this.words = oneLines.reduce((base, line) => {
          let lineWords = tokenizer.tokenize(line);
          return base.concat(lineWords);
        }, []);
        // 重複を除外
        this.words = Array.from(new Set(this.words));
        resolve(this);
      })
    })
  }
  getRandWord(num) {
    return [...Array(num)].reduce((base)=>{
      const word = this.words[Math.floor(Math.random()*this.words.length)];
      return `${base}${word.surface_form}`
    }, '');
  }
}

(async ()=>{
  const fileName = './sample.txt';
  const kuromojiWords = await new KuromojiWords(fileName);
  console.log(kuromojiWords.getRandWord(20));
})();
