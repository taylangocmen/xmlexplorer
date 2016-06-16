/**
 * Created by taylangocmen on 6/14/16.
 */

// 'use strict';

var cheerio = require('cheerio');
var fs = require('fs');

var write_obj_to_JSON = (anObj, aFileName) => {

    var aPath = './JSONs/' + aFileName;

    if(aPath.slice(-4) != '.json') aPath = aPath + ".json";

    // ASYNC MODE
    // fs.writeFile(aPath, JSON.stringify(anObj, null, 4), (err) => {
    //
    //     if(err) {
    //         throw new Error('@*Wrong input for write_obj_to_JSON!*@  ====>  ┻━┻ ヘ╰( •̀ε•́ ╰) ====> '+ anObj, aFileName);
    //     } else {
    //         console.log("Your object has been converted to JSON and saved to " + aPath);
    //     }
    // });

    // SYNC MODE
    fs.writeFileSync(aPath, JSON.stringify(anObj, null, 4), 'utf8');

};

var $ = cheerio.load(fs.readFileSync('Index.xml'), {
    xmlMode: true
});

var apprKeys ={
    // nemod: 'nemod',
    title: 'title',
    code: 'code',
    term: 'term',
    see: 'see',
    seeAlso: 'seealso',
    manif: 'manif',
    seecat: 'seecat',
    subcat: 'subcat'
};

var cap_first = (string) => (string.charAt(0).toUpperCase() + string.slice(1));

var convert_key = (givenKey) => (apprKeys[givenKey]);

var index_term = (index, element) => {

    var mainterm = {};

    // console.log($(element).children('title').text());
    $(element).children().each((i, e) => {

        let aKey = convert_key(e.tagName);
        if(aKey != undefined && aKey != 'title') {
            mainterm[aKey] = {};
            if (aKey != 'term') {
                mainterm[aKey] = $(e).text().trim();
            } else {
                aKey = $(e).children('title').text().trim();
                mainterm[aKey] = index_term(i,e);
            }
        }
    })
    ;
    return mainterm;

};

var index_letter = (index, element) => {


    var letter = {};

    var mainTerms = $(element).children('mainTerm');

    $(mainTerms)
        .each((i,e) => {
            let mtTitle = $(e).children('title').text();

            if(letter[cap_first(mtTitle.slice(1,2))] === undefined)
                letter[cap_first(mtTitle.slice(1,2))] = {};

            if (letter[cap_first(mtTitle.slice(1,2))][cap_first(mtTitle.slice(2,3))] === undefined)
                letter[cap_first(mtTitle.slice(1,2))][cap_first(mtTitle.slice(2,3))] = {};

            letter[cap_first(mtTitle.slice(1,2))][cap_first(mtTitle.slice(2,3))][mtTitle] = index_term(i,e);
        })
    ;

    return letter;
};

function index_everything() {

    var everything = {};
    var letters = $('letter');

    $(letters)
        .each((i,e) => {
            everything[$(e).children('title').text()] = index_letter(i,e);
        })
    ;

    return (everything);
}

// Thanks to ..
// a SYNCHRONOUS & BLOCKING readline prompt solution that's not a huge node package
// https://github.com/Jeff-Russ/node-readline-sync
var read_line = function () {
    return require('child_process')
        .execSync('read reply </dev/tty; echo "$reply"',{stdio:'pipe'})
        .toString().replace(/\n$/, '');
};

function do_interface(){

    console.log('Parse Index.xml again? : y(es)/n(o)');
    var yorn = read_line();

    var indexed_data = {};
    if(yorn === 'y') {
        indexed_data = index_everything();
        write_obj_to_JSON(indexed_data, 'indexed_everything');
    } else
        indexed_data = JSON.parse(fs.readFileSync('./JSONs/indexed_everything.json', 'utf8'));

    // let aPath = '';
    do {
        console.log('Three letters:');
        var tlet = read_line();
        console.log(indexed_data[cap_first(tlet.slice(0,1))][cap_first(tlet.slice(1,2))][cap_first(tlet.slice(2,3))]);
    } while (tlet != 'quit');

    console.log('Done, exiting.');
}

do_interface();
// write_obj_to_JSON(index_everything(), 'indexed_everything');
