import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🚀 SERVER STARTET JETZT...");
console.log("DB-URI vorhanden:", process.env.MONGODB_URI ? "Ja": "Nein");

// server
const server = http.createServer((req, res) => {

    let fileName = req.url === '/' ? 'firstside.html' : req.url;
    const filePath = path.join(__dirname, fileName);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('404 Not Found');
        }

        let contentType = 'text/plain';
        if (fileName.endsWith('.html')) contentType = 'text/html';
        if (fileName.endsWith('.js')) contentType = 'text/javascript';
        if (fileName.endsWith('.css')) contentType = 'text/css';
        res.writeHead(200, {'Content-Type': contentType});
        res.end(data);

    });

});

const app = express();  // create an express app

app.get('/api/data', (req, res) => {
    res.json({message: "Hallo vom Backend!"})
});

app.listen(4000, '0.0.0.0', () => {
    console.log("Server running on port 4000");
});

app.use(express.json());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../../frontend')));

// routes import
import userRouter from './routes/user.route.js'; 
import postRouter from './routes/post.route.js';
import http from "http";
import fs from "fs";


// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter)

// example route: http://localhost:4000/api/v1/users/register

export default app;

