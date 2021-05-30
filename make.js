const fs = require('fs').promises;
const kuromoji = require('kuromoji');
const builder = kuromoji.builder({
  dicPath: 'node_modules/kuromoji/dict'
});

class KuromojiMaker {
  constructor(fileName) {
    this.posList = [
      '記号',   // 0
      '名詞',   // 1
      '助詞',   // 2
      '動詞',   // 3
      '助動詞', // 4
      '連体詞', // 5
      '副詞',   // 6
      '形容詞', // 7
      '接続詞', // 8
      '接頭詞'  // 9
    ]
    return new Promise((resolve, reject) => {
      builder.build(async (err, tokenizer)=>{
        if(err) {
          reject(err);
        }
        const resdAllStr = await fs.readFile(fileName, 'utf-8');
        const oneLines = resdAllStr.split('\n');
        this.allWords = oneLines.reduce((base, line) => {
          let lineWords = tokenizer.tokenize(line);
          return base.concat(lineWords);
        }, []);
        // 重複を除外
        this.allWords = Array.from(new Set(this.allWords));
        // 品詞ごとに用途を分解
        this.posWords = {};
        this.allWords.map((word)=>{
          if(Array.isArray(this.posWords[word.pos])) {
            this.posWords[word.pos].push(word);
          }
          else {
            this.posWords[word.pos] = [word];
          }
        });
        resolve(this);
      })
    })
  }
  getAnyWord(pos) {
    const list = this.posWords[pos];
    return list[Math.floor(Math.random()*list.length)].surface_form;
  }
  getPosOrderSentence(list) {
    return list.reduce((sentence, pos) => {
      return `${sentence}/${this.getAnyWord(this.posList[pos])}`
    }, '');
  }
  test() {
    console.log( Object.keys(this.posWords) );
    // 名詞->助詞->動詞
    console.log( this.getPosOrderSentence([1, 2, 3]) );
    // 名詞->動詞->連体詞->名詞->助詞->動詞
    console.log( this.getPosOrderSentence([1, 3, 5, 1, 2, 3]) );
  }
  getRandWord(num) {
    return [...Array(num)].reduce((base)=>{
      const word = this.allWords[Math.floor(Math.random()*this.allWords.length)];
      return `${base}${word.surface_form}`
    }, '');
  }
}

(async ()=>{
  const fileName = './sample.txt';
  const kuromojiWords = await new KuromojiMaker(fileName);
  kuromojiWords.test();
})();
