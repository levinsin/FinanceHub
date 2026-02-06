import Category from "../models/category.model.js";
import Expense from "../models/expenses.model.js";

/**
 * Helper to obtain current user id from request (supports different auth middlewares)
 */
// const getUserId = (req) => {
//     // primary: value set by auth middleware
//     const fromAuth = req.userId || req.user?.id || req.user?._id;
//     if (fromAuth) return fromAuth;
//     // fallback: allow client-provided userId (non-ideal for security, but requested)
//     if (req && req.body && req.body.userId) return req.body.userId;
//     return null;
// };

export const createExpense = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) return res.status(401).json({ message: 'Authentication required' });
        const { title, amount, date, category, costType, notes } = req.body;

        if (!title || typeof amount === 'undefined') {
            return res.status(400).json({ message: 'title and amount are required' });
        }

        const expense = new Expense({
            title: title.trim(),
            amount,
            date: date ? new Date(date) : new Date(),
            userId,
            category: category || null,
            costType: costType || null,
            notes: notes ? notes.trim() : null
        });
        await expense.save();
        return res.status(201).json(expense);
    } catch (err) {
        console.error('createExpense error:', err);
        return res.status(500).json({ message: 'Could not create expense', error: err.message });
    }

};

export const getExpenses = async (req, res) => {
    try {
        const userId = req.body.userId;
        if (!userId) return res.status(401).json({ message: 'Authentication required' });
        const expenses = await Expense.find({ userId });
        return res.json(expenses);
    } catch (err) {
        console.error('getExpenses error:', err);
        return res.status(500).json({ message: 'Could not fetch expenses', error: err.message });
    }

};

// export const getExpense = async (req, res) => {
//     try {
//         const userId = req.body.userId;
//         const { id } = req.params;
//         const expense = await Expense.findOne({ _id: id, userId });
//         if (!expense) return res.status(404).json({ message: 'Expense not found' });
//         return res.json(expense);
//     } catch (err) {
//         console.error('getExpense error:', err);
//         return res.status(500).json({ message: 'Could not fetch expense', error: err.message });
//     }
// };

export const updateExpense = async (req, res) => {
    try {
        const userId = req.body.userId;
        const { id } = req.params;
        const updates = {};
        if (req.body.title) updates.title = req.body.title.trim();
        if (typeof req.body.amount !== 'undefined') updates.amount = req.body.amount;
        if (req.body.date) updates.date = new Date(req.body.date);
        if (req.body.category) updates.category = req.body.category;
        if (req.body.costType) updates.costType = req.body.costType;
        if (req.body.notes) updates.notes = req.body.notes.trim();

        const expense = await Expense.findOneAndUpdate(
            { _id: id, userId: userId },
            { $set: updates },
            { new: true, runValidators: true }
        );
        if (!expense) return res.status(404).json({ message: 'Expense not found or not editable' });
        return res.json(expense);
    } catch (err) {
        console.error('updateExpense error:', err);
        return res.status(500).json({ message: 'Could not update expense', error: err.message });
    }
};

export const deleteExpense = async (req, res) => {
    try {
        const userId = req.body.userId;
        const { id } = req.params;

        const expense = await Expense.findOneAndDelete({ _id: id, userId });
        if (!expense) return res.status(404).json({ message: 'Expense not found or not deletable' });
        return res.json({ message: 'Expense deleted successfully' });
    } catch (err) {
        console.error('deleteExpense error:', err);
        return res.status(500).json({ message: 'Could not delete expense', error: err.message });
    }
};