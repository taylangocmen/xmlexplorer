/**
 * Created by taylangocmen on 6/16/16.
 */

// 'use strict';

var cheerio = require('cheerio');
var fs = require('fs');

var write_obj_to_JSON = (anObj, aFileName) => {
    var aPath = './JSONs/' + aFileName;
    if(aPath.slice(-4) != '.json') aPath = aPath + ".json";
    fs.writeFileSync(aPath, JSON.stringify(anObj, null, 4), 'utf8');
};

var adjust_diagnosis = (diagnosis, diagObj) => {

    var diagObjV2 = {
        title: diagnosis,
        code: '',
        see: '',
        seeAlso: '',
        manif: '',
        seecat: '',
        subcat: '',
        subdiagnoses: []
    };

    for (var aKey in diagObj) {
        if(diagObj.hasOwnProperty(aKey)) {

            if (diagObjV2.hasOwnProperty(aKey)) {
                diagObjV2[aKey] = diagObj[aKey];
            } else {
                diagObjV2.subdiagnoses.push(adjust_diagnosis(aKey, diagObj[aKey]));
            }
        }
    }
    return diagObjV2;
};

var construct_indexV2 = (anObj) => {

    var indexV2 = [];

    for (var a1key in anObj) {
        if (anObj.hasOwnProperty(a1key)) {

            for (var a2key in anObj[a1key]) {
                if (anObj[a1key].hasOwnProperty(a2key)) {

                    for (var a3key in anObj[a1key][a2key]) {
                        if (anObj[a1key][a2key].hasOwnProperty(a3key)) {

                            for (var diagnosis in anObj[a1key][a2key][a3key]) {
                                if (anObj[a1key][a2key][a3key].hasOwnProperty(diagnosis)) {

                                    // console.log(diagnosis);
                                    indexV2.push(adjust_diagnosis(diagnosis, anObj[a1key][a2key][a3key][diagnosis]));

                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // console.log(indexV2[614]
    //     .subdiagnoses[17] // level1
    //     .subdiagnoses[0] // level2
    //     .subdiagnoses[2] // level3
    //     .subdiagnoses[0] // level4
    //     .subdiagnoses[0] // level5
    //     .subdiagnoses[0] // level6
    //     .subdiagnoses[1] // level7
    //     .subdiagnoses[1] // level8
    //     .subdiagnoses[1]); // level9

    return indexV2;
};


var read_line = function () {
    return require('child_process')
        .execSync('read reply </dev/tty; echo "$reply"',{stdio:'pipe'})
        .toString().replace(/\n$/, '');
};

function do_interface(){
    var indexed_data = JSON.parse(fs.readFileSync('./JSONs/indexed_everything.json', 'utf8'));

    console.log('Reconstruct indexfileV2.json again? : y(es)/n(o)');
    var yorn = read_line();

    if(yorn === 'y')
        write_obj_to_JSON(construct_indexV2(indexed_data), 'indexed_everythingV2');

    var indexV2_data = JSON.parse(fs.readFileSync('./JSONs/indexed_everythingV2.json', 'utf8'));

    do {
        var input = read_line();
        console.log(indexV2_data[614]
            .subdiagnoses[17] // level1
            .subdiagnoses[0] // level2
            .subdiagnoses[2] // level3
            .subdiagnoses[0] // level4
            .subdiagnoses[0] // level5
            .subdiagnoses[0] // level6
            .subdiagnoses[1] // level7
            .subdiagnoses[1] // level8
            .subdiagnoses[1]); // level9


    } while (input != 'quit');

    console.log('Done, exiting.');
}

do_interface();

// write_obj_to_JSON(
//     construct_indexV2(
//         JSON.parse(
//             fs.readFileSync('./JSONs/indexed_everything.json', 'utf8'))),
//     'indexed_everythingV2');
