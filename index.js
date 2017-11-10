let request = require('request');
let cheerio = require('cheerio');
let fs = require('fs');

let url = 'https://codebeamer.com/cb/tracker/93958';

request(url, function (error, response, body) {
    if(error) throw error;
    
    let $ = cheerio.load(body);
    let a = $('tr.trackerItem').html();
    console.log(a);
    

    let post_elements = $('#trackerItems');
    post_elements.each(function() {
        // /contentWithMargins
        let head_file = $(this).html();
        console.log(head_file);
        fs.writeFile('./storage/text.html', head_file, 'utf8', function(error) {
            if (error) throw error;
            console.log('비동기적 파일 쓰기 완료');
        });
    });
});
