let request = require('request');
let cheerio = require('cheerio');
let fs = require('fs');
let afterload = require('after-load');


let url = 'https://codebeamer.com/cb/tracker/93958';

afterload(url,function(body, $){
    let a = $('.ui-layout-center .contentArea #browseTrackerForm .contentWithMargins').html();
    fs.writeFile('./storage/super_test.html', a, 'utf8', function(error) {
        if (error) throw error;
        console.log('확인용 HTML 파일 작성');
    });
});

request(url, {timeout: 10000}, function (error, response, body) {
    if(error) throw error;

    fs.writeFile('./storage/super_test2.html', body, 'utf8', function(error) {
        if (error) throw error;
        console.log('확인용 HTML2 파일 작성');
    });
});

/*
request(url, function (error, response, body) {
    if(error) throw error;
    
    let $ = cheerio.load(body);
    let a = $('.ui-layout-center .contentArea #browseTrackerForm .contentWithMargins').html();
    fs.writeFile('./storage/super_test.html', a, 'utf8', function(error) {
        if (error) throw error;
        console.log('확인용 HTML 파일 작성');
    });

});
*/