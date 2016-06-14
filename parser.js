/**
 * Created by taylangocmen on 6/10/16.
 */

'use strict';

var cheerio = require('cheerio');
var fs = require('fs');
var replaceAll = require("./functions");

function parse_everything() {
    var $ = cheerio.load(fs.readFileSync('Tabular.xml'), {
        xmlMode: true
    });

    var everything = {};

    var initialize_AZ = () => {
        var A = 65;
        for (var i = 0; i<26; i++)
            everything[String.fromCharCode(A + i)] = {};
    };

    var initialize_everything = (index, element) => {
        everything[(element.tagName)] = {};
    };

    var initialize_elements = (index, element) => {
        var modifiedIndex = (element.tagName === 'chapter') ? (index + '') :
            ((element.tagName === 'section') ? (element.attribs.id) :
                    ('error index'));
        everything[element.tagName][modifiedIndex] = {};
    };

    var set_names = (index, element) => {
        var modifiedIndex = (element.tagName === 'chapter') ? (index + '') :
            ((element.tagName === 'section') ? (element.attribs.id) :
                ('error index'));
        let text = $(element).children('desc').text().trim();

        if(text != '') everything[element.tagName][modifiedIndex]['desc']
            = text;
    };

    var set_inclusions = (index, element) => {
        var modifiedIndex = (element.tagName === 'chapter') ? (index + '') :
            ((element.tagName === 'section') ? (element.attribs.id) :
                ('error index'));
        let text = $(element).children('includes').text().trim();

        if(text != '') everything[element.tagName][modifiedIndex]['inc']
            = ('- ' + text.replaceAll("\r\n      ", "\r- "));
    };

    var set_exclusions = (index, element) => {
        var modifiedIndex = (element.tagName === 'chapter') ? (index + '') :
            ((element.tagName === 'section') ? (element.attribs.id) :
                ('error index'));
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

        if(finalText != '') everything[element.tagName][modifiedIndex]['exc'] = finalText;
    };

    var set_use_additional_codes = (index, element) => {
        var modifiedIndex = (element.tagName === 'chapter') ? (index + '') :
            ((element.tagName === 'section') ? (element.attribs.id) :
                ('error index'));
        let text = $(element).children('useAdditionalCode').text().trim();

        if(text != '') everything[element.tagName][modifiedIndex]['uac']
            = ('- ' + text.replaceAll("\r\n      ", "\r- "));
    };

    var set_notes = (index, element) => {
        var modifiedIndex = (element.tagName === 'chapter') ? (index + '') :
            ((element.tagName === 'section') ? (element.attribs.id) :
                ('error index'));
        let text = $(element).children('notes').text().trim();

        if(text != '') everything[element.tagName][modifiedIndex]['notes']
            = ('- ' + text.replaceAll("\r\n      ", "\r- "));
    };

    var set_code_firsts = (index, element) => {
        var modifiedIndex = (element.tagName === 'chapter') ? (index + '') :
            ((element.tagName === 'section') ? (element.attribs.id) :
                ('error index'));
        let text = $(element).children('codeFirst').text().trim();

        if(text != '') everything[element.tagName][modifiedIndex]['cFirst']
            = ('- ' + text.replaceAll("\r\n      ", "\r- "));
    };

    var set_code_alsos = (index, element) => {
        var modifiedIndex = (element.tagName === 'chapter') ? (index + '') :
            ((element.tagName === 'section') ? (element.attribs.id) :
                ('error index'));
        let text = $(element).children('codeAlso').text().trim();

        if(text != '') everything[element.tagName][modifiedIndex]['cAlso']
            = ('- ' + text.replaceAll("\r\n      ", "\r- "));
    };

    var set_inclusion_terms = (index, element) => {
        var modifiedIndex = (element.tagName === 'chapter') ? (index + '') :
            ((element.tagName === 'section') ? (element.attribs.id) :
                ('error index'));
        let text = $(element).children('inclusionTerm').text().trim();

        if(text != '') everything[element.tagName][modifiedIndex]['incTerm']
            = ('- ' + text.replaceAll("\r\n      ", "\r- "));
    };

    var set_section_indices = (index, element) => {
        var modifiedIndex = (element.tagName === 'chapter') ? (index + '') :
            ((element.tagName === 'section') ? (element.attribs.id) :
                ('error index'));
        var sections = [];
        $(element).children('sectionIndex').children('sectionRef')
            .each((i,e) => {
                sections[i] = (e.attribs.id + ': ' + e.children[0].data
                    .replaceAll("\r\n         ", "")
                    .replaceAll("\r\n      ", ""));
            });
        (everything[element.tagName][modifiedIndex]['secs'] = ('- ' + sections.join('\r- ')));
    };

    var set_diags = (index, element) => {
        console.log(element.tagName, $(element).children('name').text());
    };

    // var  = (index, element) =>
    //     (  );

    var allsubsivs = {};

    var TBR_print_imm_children = (index, element) => {
        // console.log(index, element.tagName);
        ($(element).children().each(
            function (i, e) {
                allsubsivs[(e.tagName)] = '';
                // if (e.tagName != 'diag') console.log('\t', i, e.tagName);

            }
        ));
    }
    // var  = (index, element) =>
    //     (  );


    var chapters = $('chapter');
    chapters
        .each(initialize_everything)
        .each(initialize_elements)
        .each(set_names)
        .each(set_inclusions)
        .each(set_exclusions)
        .each(set_use_additional_codes)
        .each(set_notes)
        .each(set_section_indices)
    ;

    var sections = $('section');
    sections
        .each(initialize_everything)
        .each(initialize_elements)
        .each(set_names)
        .each(set_inclusions)
        .each(set_exclusions)
        .each(set_use_additional_codes)
        .each(set_notes)
        .each(set_code_firsts)
        .each(set_code_alsos)
        .each(set_inclusion_terms)
    ;

    // initialize_AZ();
    // var alldiags = $('diag');
    // var diags = $('section').children('diag');
    // var sub1diags = $('section').children('diag').children('diag');
    // var sub2diags = $('section').children('diag').children('diag').children('diag');
    // var sub3diags = $('section').children('diag').children('diag').children('diag').children('diag');
    // console.log('diag: ', diags.first());
    // sub3diags
    //     .each(set_diags)
    // ;
    // diags
    //     .each(set_diags)
    // ;
    //
    // subdiags
    //     .each(set_subdiags)
    // ;
    // console.log(allsubsivs);

    return everything;
};

// parse_everything();

console.log(parse_everything());

