const http = require('http');
const os = require('os-utils');

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.url === '/cpu-usage') {
    os.cpuUsage((cpuUsage) => {
      const responseData = {
        cpuUsage: cpuUsage
      };
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(responseData));
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const port = 3030;

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
