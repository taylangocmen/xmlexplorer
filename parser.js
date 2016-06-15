/**
 * Created by taylangocmen on 6/10/16.
 */

// 'use strict';

var cheerio = require('cheerio');
var fs = require('fs');
var replaceAll = require("./functions");
// var prompt = require('prompt');

function exist_char_in_str(aChar, aStr) {
    if (aStr.indexOf(aChar) === -1)
        return false;
    else
        return true;
}

function parse_keyword($, keyword) {

    var everything = {};

    var initialize_elements = (index, element) => {
        var modifiedIndex = (element.tagName === 'chapter') ? (index + '') :
            ((element.tagName === 'section') ? (element.attribs.id) :
                    ($(element).children('name').text().trim()));
        everything[modifiedIndex] = {};
    };

    var set_names = (index, element) => {
        var modifiedIndex = (element.tagName === 'chapter') ? (index + '') :
            ((element.tagName === 'section') ? (element.attribs.id) :
                ($(element).children('name').text().trim()));
        let text = $(element).children('desc').text().trim();

        if(text != '') everything[modifiedIndex]['dsc']
            = text;
    };

    var set_inclusions = (index, element) => {
        var modifiedIndex = (element.tagName === 'chapter') ? (index + '') :
            ((element.tagName === 'section') ? (element.attribs.id) :
                ($(element).children('name').text().trim()));
        let text = $(element).children('includes').text().trim();

        if(text != '') everything[modifiedIndex]['inc']
            = ('- ' + text.replaceAll("\r\n      ", "\r- "));
    };

    var set_exclusions = (index, element) => {
        var modifiedIndex = (element.tagName === 'chapter') ? (index + '') :
            ((element.tagName === 'section') ? (element.attribs.id) :
                ($(element).children('name').text().trim()));
        let text1 = $(element).children('excludes1').text().trim();
        let text2 = $(element).children('excludes2').text().trim();
        let finalText = (
            (text1 === '' ?
                ('') : ('- ' + text1.replaceAll("\r\n      ", "\r- ")))
                +
            (text2 === ''?
                ('') :
                (( text1 === '' ? ('') : ('\r- '))
                    + text2.replaceAll("\r\n      ", "\r- "))));

        if(finalText != '') everything[modifiedIndex]['exc'] = finalText;
    };

    var set_use_additional_codes = (index, element) => {
        var modifiedIndex = (element.tagName === 'chapter') ? (index + '') :
            ((element.tagName === 'section') ? (element.attribs.id) :
                ($(element).children('name').text().trim()));
        let text = $(element).children('useAdditionalCode').text().trim();

        if(text != '') everything[modifiedIndex]['uac']
            = ('- ' + text.replaceAll("\r\n      ", "\r- "));
    };

    var set_notes = (index, element) => {
        var modifiedIndex = (element.tagName === 'chapter') ? (index + '') :
            ((element.tagName === 'section') ? (element.attribs.id) :
                ($(element).children('name').text().trim()));
        let text = $(element).children('notes').text().trim();

        if(text != '') everything[modifiedIndex]['nts']
            = ('- ' + text.replaceAll("\r\n      ", "\r- "));
    };

    var set_code_firsts = (index, element) => {
        var modifiedIndex = (element.tagName === 'chapter') ? (index + '') :
            ((element.tagName === 'section') ? (element.attribs.id) :
                ($(element).children('name').text().trim()));
        let text = $(element).children('codeFirst').text().trim();

        if(text != '') everything[modifiedIndex]['cft']
            = ('- ' + text.replaceAll("\r\n      ", "\r- "));
    };

    var set_code_alsos = (index, element) => {
        var modifiedIndex = (element.tagName === 'chapter') ? (index + '') :
            ((element.tagName === 'section') ? (element.attribs.id) :
                ($(element).children('name').text().trim()));
        let text = $(element).children('codeAlso').text().trim();

        if(text != '') everything[modifiedIndex]['cal']
            = ('- ' + text.replaceAll("\r\n      ", "\r- "));
    };

    var set_inclusion_terms = (index, element) => {
        var modifiedIndex = (element.tagName === 'chapter') ? (index + '') :
            ((element.tagName === 'section') ? (element.attribs.id) :
                ($(element).children('name').text().trim()));
        let text = $(element).children('inclusionTerm').text().trim();

        if(text != '') everything[modifiedIndex]['ict']
            = ('- ' + text.replaceAll("\r\n      ", "\r- "));
    };

    var set_section_indices = (index, element) => {
        var modifiedIndex = (element.tagName === 'chapter') ? (index + '') :
            ((element.tagName === 'section') ? (element.attribs.id) :
                ($(element).children('name').text().trim()));
        var sections = [];
        $(element).children('sectionIndex').children('sectionRef')
            .each((i,e) => {
                sections[i] = (e.attribs.id + ': ' + e.children[0].data
                    .replaceAll("\r\n         ", "")
                    .replaceAll("\r\n      ", ""));
            });
        var text = sections.join('\r- ');
        if(text != '') everything[modifiedIndex]['scr'] = ('- ' + text);
    };

    var set_seven_chr_note = (index, element) => {
        var modifiedIndex = (element.tagName === 'chapter') ? (index + '') :
            ((element.tagName === 'section') ? (element.attribs.id) :
                ($(element).children('name').text().trim()));
        let text = $(element).children('sevenChrNote').text().trim();

        if(text != '') everything[modifiedIndex]['7cn']
            = ('- ' + text.replaceAll("\r\n      ", "\r- "));
    };

    var set_seven_chr_def = (index, element) => {
        var modifiedIndex = (element.tagName === 'chapter') ? (index + '') :
            ((element.tagName === 'section') ? (element.attribs.id) :
                ($(element).children('name').text().trim()));
        var text = '';
        $(element).children('sevenChrDef').children().each(
            (i, e) => {
                if(e.tagName === 'extension') {
                    text = text + '- Ext.' + e.attribs.char + ': ' + $(e).text().trim() + '\r';
                } else if (e.tagName === 'note') {
                    text = text + '- Note: ' + $(e).text().trim() + '\r';
                } else {
                    text = text;
                }
            }
        );
        if(text != '') {
            text = text.slice(0, -2);
            everything[modifiedIndex]['7cd']
                = ('- ' + text.replaceAll("\r\n      ", "\r- "));
        };
    };

    // var set_visual_impairment = (index, element) => {
    //     // visualImpairment not going to do visual impairment
    // };

    $(keyword)
        .each(initialize_elements)
        .each(set_names)
        .each(set_inclusions)
        .each(set_exclusions)
        .each(set_use_additional_codes)
        .each(set_notes)
        .each(set_section_indices)
        .each(set_code_firsts)
        .each(set_code_alsos)
        .each(set_inclusion_terms)
        .each(set_seven_chr_note)
        .each(set_seven_chr_def);

    return everything;
};

function parse_everything() {
    var $ = cheerio.load(fs.readFileSync('Tabular.xml'), {
        xmlMode: true
    });

    var everything = {};

    everything['chapter'] = parse_keyword($, 'chapter');
    everything['section'] = parse_keyword($, 'section');

    var diagnoses = parse_keyword($, 'diag');

    for (var aKey in diagnoses) {
        if (diagnoses.hasOwnProperty(aKey)) {
            let p = {
                one: aKey.slice(0, 1),
                two: aKey.slice(1, 3),
                thr: aKey.slice(4, 5),
                fou: aKey.slice(5, 6),
                fiv: aKey.slice(6, 7)};

            if(p.one!=''&&(!everything.hasOwnProperty(p.one)))
                everything[p.one] = {};
            if(p.two!=''&&(!everything[p.one].hasOwnProperty(p.two)))
                everything[p.one][p.two] = {};
            if(p.thr!=''&&(!everything[p.one][p.two].hasOwnProperty(p.thr)))
                everything[p.one][p.two][p.thr] = {};
            if(p.fou!=''&&(!everything[p.one][p.two][p.thr].hasOwnProperty(p.fou)))
                everything[p.one][p.two][p.thr][p.fou] = {};

            if (aKey.length === 3)
                everything[p.one][p.two] = diagnoses[aKey];
            if (aKey.length === 5)
                everything[p.one][p.two][p.thr] = diagnoses[aKey];
            if (aKey.length === 6)
                everything[p.one][p.two][p.thr][p.fou] = diagnoses[aKey];
            if (aKey.length === 7)
                everything[p.one][p.two][p.thr][p.fou][p.fiv] = diagnoses[aKey];

        }
    };

    return everything;
};

function onErr(err) {
    console.log(err);
    return 1;
}

// Thanks to ..
// a SYNCHRONOUS & BLOCKING readline prompt solution that's not a huge node package
// https://github.com/Jeff-Russ/node-readline-sync
var readln = function () {
    return require('child_process')
        .execSync('read reply </dev/tty; echo "$reply"',{stdio:'pipe'})
        .toString().replace(/\n$/, '');
};

function do_interface(){
    console.log('Wait for ICD10...');
    var parsed_data = parse_everything();
    console.log('...built ICD10.');
    // console.log(parsed_data.A['37']['1']['1']);

    let aPath = '';
    do {

        console.log('A program ask for aPath: ');
        aPath = readln();
        if(aPath != 'quit' && aPath != '') {

            console.log('aPath was:', aPath);

            var result = {};

            if(aPath.slice(0,7) === 'chapter'){
                console.log(aPath.slice(0,7), aPath.slice(8,15), aPath.slice(16,19));
                result = parsed_data[aPath.slice(0,7)];
                if(aPath.slice(8,14) != ''){
                    result = result[aPath.slice(8,15)];
                    if(result != {})
                        if(aPath.slice(16,19) != '')
                            result = result[aPath.slice(16,19)];
                }
            } else if (aPath.slice(0,7) === 'section') {
                console.log(aPath.slice(0,7), aPath.slice(8,9), aPath.slice(10,13));
                result = parsed_data[aPath.slice(0, 7)];
                if (aPath.slice(8, 9) != '') {
                    result = result[aPath.slice(8, 9)];
                    if (result != {})
                        if (aPath.slice(10, 13) != '')
                            result = result[aPath.slice(10, 13)];
                }
            } else {
                console.log(aPath.slice(0,1), aPath.slice(2,4), aPath.slice(5,6), aPath.slice(7,8), aPath.slice(9,10), aPath.slice(11,14));

                result = parsed_data[aPath.slice(0,1)]; // A
                if(result != {})
                    if(aPath.slice(2,4) != ''){
                        result = result[aPath.slice(2,4)]; // 00

                        if(result != {})
                            if(aPath.slice(5,6) != '') {
                                if(exist_char_in_str('.', aPath.slice(5, 8)) || (aPath.slice(5).length === 1)){
                                    result = result[aPath.slice(5, 6)]; // 1

                                    if (result != {})
                                        if (aPath.slice(7, 8) != '') {
                                            if (exist_char_in_str('.', aPath.slice(7, 10)) || (aPath.slice(7).length === 1)) {
                                                result = result[aPath.slice(7, 8)]; // 1

                                                if (result != {})
                                                    if (aPath.slice(9, 10) != '') {
                                                        if (exist_char_in_str('.', aPath.slice(9, 12)) || (aPath.slice(9).length === 1)) {
                                                            result = result[aPath.slice(9, 10)]; // 1

                                                            if (result != {})
                                                                if (aPath.slice(11, 14) != '')
                                                                    result = result[aPath.slice(11, 14)]; // dsc
                                                        } else {
                                                            result = result[aPath.slice(9, 12)];
                                                        }
                                                    }
                                            } else {
                                                result = result[aPath.slice(7, 10)];
                                            }
                                        }
                                } else {
                                    result = result[aPath.slice(5,8)];
                                }
                            }
                        }
                    }

            console.log('Result:', result);
        }
    } while (aPath != 'quit');

    console.log('Done, exiting.');
};

do_interface();
