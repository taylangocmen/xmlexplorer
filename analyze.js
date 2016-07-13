/**
 * Created by taylangocmen on 6/27/16.
 */


var fs = require('fs');

var dx = JSON.parse(fs.readFileSync('./JSONs/indexed_diagnoses_empty_keys_removed.json', 'utf8'));


// TODO: are there any diagnoses w/ no code or see attr nor children

function withItem(arr, el){

}


function nodify(x){
  return {
    title: x.title,
    see: x.see,
    seeAlso: x.seeAlso,
    code: x.code,
    chilrens: x.children.length
  };
}

function check(node, parentNodes = []){
  if(node.children.length){
    node.children.forEach(x => check(x, parentNodes.concat([node])));
  } else {
    if(!node.see && !node.code){
      console.log(
        "No code or see\n",
        parentNodes.concat([node]).map(nodify),
        nodify(node)
      );
    }
    if(node.see){
      console.log(
        "Checking 'See' node: "+exists(node.see)+" "+node.see+"\n",
        nodify(node)
      )
    }
  }
}
function checkAll(){
  dx.map(x => check(x, []));
}


var dict = {};
function index(node, parentTitles){
  dict[parentTitles.concat([node.title]).join(", ")] = nodify(node);
  node.children.map(x => index(x , parentTitles.concat([node.title])));
}
dx.map(x => index(x, []));

function exists(title){
  return !!dict[title];
}


//console.log(dict["Puncture, wrist"]);
console.log(dict["Puncture, tympanum"]);
//console.log(dict);
//checkAll();