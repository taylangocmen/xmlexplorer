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

    var initialize_everything = () =>
        (everything['ch'] = {});

    var initialize_chapters = (index, element) =>
        (everything.ch[index+1] = {});

    var set_chapter_name = (index, element) =>
        (everything.ch[index+1]['desc'] =
            $(element).children('desc').text().trim());

    var set_inclusions = (index, element) =>
        (everything.ch[index+1]['inc'] =
            ('- ' + $(element).children('includes').text().trim()
                .replaceAll("\r\n      ", "\r- ")));

    var set_exclusions = (index, element) =>
        (everything.ch[index+1]['exc'] =
            ('- ' + $(element).children('excludes1').text().trim()
                .replaceAll("\r\n      ", "\r- ") + "\r- "
            + $(element).children('excludes2').text().trim()
                .replaceAll("\r\n      ", "\r- ")));

    var set_use_additional_code = (index, element) =>
        (everything.ch[index+1]['uac'] =
            ('- ' + $(element).children('useAdditionalCode').text().trim()
                .replaceAll("\r\n      ", "\r- ")));

    var set_notes = (index, element) =>
        (everything.ch[index+1]['notes'] =
            ('- ' + $(element).children('notes').text().trim()
                .replaceAll("\r\n      ", "\r- ")));

    var set_section_indices = (index, element) => {
        var sections = [];
        $(element).children('sectionIndex').children('sectionRef')
            .each((i,e) => {
                sections[i] = (e.attribs.id + ': ' + e.children[0].data
                    .replaceAll("\r\n         ", "")
                    .replaceAll("\r\n      ", ""));
            });
        return (everything.ch[index + 1]['secs'] = ('- ' + sections.join('\r- ')));
    };

    // var  = (index, element) =>
    //     (  );

    var TBR_print_imm_children = (index, element) =>
        ($(element).children().each(
            function(i, e){
                if( e.tagName != 'section') console.log(i, e.tagName);
            }
        ));
    // var  = (index, element) =>
    //     (  );

    initialize_everything();

    var chapters = $('chapter');

    chapters
        // .each(TBR_print_imm_children)
        .each(initialize_chapters)
        .each(set_chapter_name)
        .each(set_inclusions)
        .each(set_exclusions)
        .each(set_use_additional_code)
        .each(set_notes)
        .each(set_section_indices)
    ;

    var sections = $('section');

    // sections
    //     .each()
    // ;

    return everything;
};

// parse_everything();

console.log(parse_everything());
