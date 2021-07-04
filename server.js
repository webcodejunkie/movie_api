const http = require('http'),
  fs = require('fs'),
  url = require('url');

  http.createServer((request, responce) => {
    let addr = request.url,
    q = url.parse(addr, true),
    filePath = '';

    fs.appendFile('logs.text', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Added to log.');
      }
    });

    if (q.pathname.includes('documentation')) {
      filePath = (__dirname + '/documentation.html');
    } else {
      filePath = 'index.html';
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        throw err;
      }

      responce.writeHead(200, { 'Content-Type': 'text/html' });
      responce.write(data);
      responce.end();

    });

  }).listen(8080);
  console.log('My test server is running on Port 8080.');
