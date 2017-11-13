let fs = require('fs');
let afterload = require('after-load');
let jsdiff = require('diff');

let original_path = './storage/original.html';
let target_path = './storage/target.html';
let url = 'http://115.178.77.138:8080/cb/tracker/62621';

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

    let diff = jsdiff.diffLines(original, target);
    diff.forEach(function(part){
        if(part.added) {
            let changed_value = part.value;
            console.log('Diff found.');
            console.log(changed_value);
            move_file();
        } else {
            console.log('Not diff found.');
            move_file();
        }
    });
}

function move_file() {
    fs.unlink(original_path, function(err) {
        if(err) throw err;
        fs.rename(target_path, original_path, function(err) {
            if(err) throw err;
        });
    });
}


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