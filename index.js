let fs = require('fs');
let afterload = require('after-load');

let original_path = './storage/original.html';
let target_path = './storage/target.html';
let url = 'http://115.178.77.138:8080/cb/tracker/62621';
let target = '';

console.log('Updating original file..');
afterload(url,function(body, $) {
    let parsed_content = $('#trackerItems tbody').html();
    fs.writeFile(original_path, parsed_content, 'utf8', function(err) {
        if (err) throw err;
        console.log('Original file created in '+ original_path);
        create_target();
    });
});

function compare() {
    let original = '';
    fs.readFileSync(original_path,'utf8', function(err, data) {
        if(err) throw err;
        original = data;
        console.log('hello');
    });
    console.log('hello2');
    fs.readFile(target_path, function(err) {
        if(err) throw err;
    });
    if(original == target) {
        console.log('Same file each other, moving target file to original.');
        /*fs.unlink(original_path, function(err) {
            if(err) throw err;
        });
        fs.rename(target_path, original_path, function(err) {
            if(err) throw err;
        });*/
    } else {
        console.log('File change detected, comparing and message send to mattermost');
    }
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
    setTimeout(create_target,30000);
}