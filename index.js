let fs = require('fs');
let afterload = require('after-load');

let original_path = './storage/original.html';
let target_path = './storage/target.html';
let url = 'https://codebeamer.com/cb/tracker/93958';

console.log('Updating original file..');
afterload(url,function(body, $) {
    let parsed_content = $('#trackerItems tbody').html();
    fs.writeFile(original_path, parsed_content, 'utf8', function(error) {
        if (error) throw error;
        console.log('Original file created in '+ original_path);
    });
});
create_target();

function compare() {
    let original = fs.readFile(original_path);
    let target = fs.readFile(target_path);
    if(original == target) {
        console.log('Same file each other, moving target file to original.');
        fs.copyFile(original_path, target_path, {
            done: function(error) {
                if (error) throw error;
                console.log('File moved.');
            }
        });
        fs.unlink(original_path);
    } else {
        console.log('File change detected, comparing and message send to mattermost');
    }
}

function create_target() {
    console.log('Updating comparison target file..');
    afterload(url,function(body, $) {
        let parsed_content = $('#trackerItems tbody').html();
        fs.writeFile(target_path, parsed_content, 'utf8', function(error) {
            if (error) throw error;
            console.log('Compare file created in'+ target_path);
            compare();
        });
    });
    setTimeout(create_target,30000);
}