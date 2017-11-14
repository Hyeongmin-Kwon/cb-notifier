const fs = require('fs');
const afterload = require('after-load');
const jsdiff = require('diff');

const original_path = './storage/original.html';
const target_path = './storage/target.html';
const url = 'http://115.178.77.138:8080/cb/tracker/62621';

console.log('Updating original file..');
afterload(url,function(body, $) {
    let parsed_content = $('#trackerItems tbody').html();
    fs.writeFile(original_path, parsed_content, 'utf8', function(err) {
        if(err) throw err;
        console.log('Original file created in '+ original_path);
        create_target();
    });
});

function compare() {
    let original = fs.readFileSync(original_path, 'utf8');
    let target = fs.readFileSync(target_path, 'utf8');
    
    const original_session = original.substr(original.indexOf('jsessionid=') + 11, 32);
    const target_session = target.substr(target.indexOf('jsessionid=') + 11, 32);
    const original_check = new RegExp(original_session,'gi');
    const target_check = new RegExp(target_session,'gi');

    original = original.replace(original_check, '');
    target = target.replace(target_check, '');

    const diff = jsdiff.diffLines(original, target);
    diff.forEach(function(part){
        if(part.added) {
            let changed_value = part.value;
            console.log('Diff found.');
            let summary_check = changed_value.indexOf('textSummaryData');
            let status_check = changed_value.indexOf('issueStatus');
            console.log(status_check);
            if(summary_check != -1) {
                //let line_split = changed_value.split('\n');
                //let all_remove = changed_value.replace(/(<([^>]+)>)/gi, '');
                //let splited = all_remove.split('\n');
                let data = tag_remove(changed_value);
                console.log(data);
            } else if(status_check != -1) {
                let data = tag_remove(changed_value);
                console.log(data);
            }
        } else {
            console.log('Not diff found.');
        }
    });
}

function tag_remove(data) {
    let removed_data = data.replace(/(<([^>]+)>)/gi, '');
    let splited_data = removed_data.split('\n');
    splited_data = splited_data.filter(n => n != '');
    return splited_data;
}

/*
function move_file() {
    fs.rename(target_path, original_path, function(err) {
        if(err) throw err;
    });
}
*/

function create_target() {
    console.log('Updating comparison target file..');
    afterload(url,function(body, $) {
        let parsed_content = $('#trackerItems tbody').html();
        fs.writeFile(target_path, parsed_content, 'utf8', function(err) {
            if(err) throw err;
            console.log('Compare file created in '+ target_path);
            compare();
        });
    });
    setTimeout(create_target,10000);
}