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
import expensesRouter from './routes/expenses.route.js';
import categoriesRouter from './routes/categories.route.js';

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter)
app.use("/api/v1/expenses", expensesRouter);
app.use("/api/v1/categories", categoriesRouter);

// example route: http://localhost:4000/api/v1/users/register

export default app;