let request = require('request');
let cheerio = require('cheerio');
let fs = require('fs');

let url = 'https://www.naver.com'

/*
request(url, function(error, response, body) {
  if (error) throw error;
    console.log(body);
});

*/
let input = 'Test text';

fs.writeFile('text.txt', input, 'utf8', function(err) {
    console.log('비동기적 파일 쓰기 완료');
});

let text1 = fs.readFileSync('./storage/text1.txt', 'utf8');
let text2 = fs.readFileSync('./storage/text2.txt', 'utf8');

console.log(text1==text2);

request(url, function(error, response, body) {
    if(error) throw error;
    
    let $ = cheerio.load(body);

    let post_elements = $('body');
    post_elements.each(function() {
        let post_title = $(this).text();
        let post_url = $(this).find('a').attr('href');

        console.log();
    });
});