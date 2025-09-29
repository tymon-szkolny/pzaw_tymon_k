import { createServer } from 'node:http';
import { URL } from "node:url";

// Create a HTTP server
const server = createServer((req, res) => {
  const request_url = new URL(`http://${host}${req.url}`);
  console.log(`Request: ${req.method} ${request_url.pathname}`);

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('hello world!\n');
});

const port = 8000;
const host = "localhost";

// Start the server
server.listen(port, host, () => {
    console.log(`Server listening on http://${host}:${port}`);
});