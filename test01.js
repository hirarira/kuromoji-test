"use strict"
const kuromoji = require('kuromoji');
console.log("test");
kuromoji.builder({
  dicPath: './node_modules/kuromoji/dict'
})
.build((err, tokenizer)=>{
  if(err) {
    console.log(err);
    return;
  }
  let str = '私は今日一日何もせず遊びもしないでダラダラと過ごして一日が終わってしまった。かなしい';
  let res = tokenizer.tokenize(str);
  console.log(res);
});
