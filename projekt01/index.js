import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { URL } from "node:url";

const html = readFileSync("public/index.html");
const icon = readFileSync("public/favicon.ico");
const server = createServer((req, res) => {
	const request_url = new URL(`http://${host}${req.url}`);
	const path = request_url.pathname;
	console.log(`Request: ${req.method} ${request_url.pathname}`);

	if (path === "/") {
		if (req.method !== 'GET'){
				res.writeHead(405, { 'Content-Type': 'text/plain' });
				res.end('Zła metoda\n');
		}
		else {
				res.writeHead(200, { 'Content-Type': 'text/html' });
				res.end(html);
		}
	}

	else if (path === "/favicon.ico") {
		if(req.method !== 'GET') {
				res.writeHead(405, { 'Content-Type': 'text/plain' });
				res.end('Zła metoda\n');
		}
		else{
				res.writeHead(200, { 'Content-Type': 'image/x-icon'});
				res.end(icon);
		}
	}
	if (!res.writableEnded) {
		res.writeHead(404, { 'Content-Type': 'text/plain' });
		res.end('Strona nie znaleziona!\n');
	}
});

const port = 8000;
const host = "localhost";

server.listen(port, host, () => {
		console.log(`Server listening on http://${host}:${port}`);
});