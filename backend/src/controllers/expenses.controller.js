import Category from "../models/category.model.js";
import Expense from "../models/expenses.model.js";

/**
 * Helper to obtain current user id from request (supports different auth middlewares)
 */
const getUserId = (req) => req.userId || req.user?.id || req.user?._id;

export const createExpense = async (req, res) => {
    try {
        const userId = getUserId(req);
        const { title, amount, date, category, costType, notes } = req.body;

        if (!title || typeof amount === 'undefined') {
            return res.status(400).json({ message: 'title and amount are required' });
        }

        const expense = new Expense({
            title: title.trim(),
            amount,
            date: date ? new Date(date) : undefined,
            userId,
            category: category || null,
            costType: costType || null,
            notes: notes ? notes.trim() : undefined
        })
    }

}

export const getExpenses = async (req, res) => {

}

export const getExpense = async (req, res) => {

}

export const updateExpense = async (req, res) => {

}

export const deleteExpense = async (req, res) => {

}

export {
    createExpense,
    getExpenses,
    getExpense,
    updateExpense,
    deleteExpense
};