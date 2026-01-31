import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();  // create an express app

app.use(express.json());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../../frontend')));

// routes import
import userRouter from './routes/user.route.js'; 
import postRouter from './routes/post.route.js';


// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter)

// example route: http://localhost:4000/api/v1/users/register

export default app;