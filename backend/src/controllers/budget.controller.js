import Budget from "../models/budget.model.js";


export const createBudget = async (req, res) => {
    try {
        const userId = req.body.userId;
        if (!userId) return res.status(401).json({ message: 'Authentication required' });
        const { amount, category } = req.body;
        if (typeof amount === 'undefined' || typeof category === 'undefined') {
            return res.status(400).json({ message: 'amount and category are required' });
        }

        const budget = new Budget({
            userId,
            amount,
            category: category.trim()
        });
        await budget.save();
        return res.status(201).json(budget);      
    } catch (err) {
        console.error('createBudget error:', err);
        return res.status(500).json({ message: 'Could not create budget', error: err.message });
    }
};

export const getBudgets = async (req, res) => {
    try {
        const userId = req.body.userId;
        if (!userId) return res.status(401).json({ message: 'Authentication required' });
        const budget = await Budget.findOne({ userId });
        if (!budget) return res.status(404).json({ message: 'Budget not found' });
        return res.json(budget);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// export const getBudget = async (req, res) => {
//     try {
//         const userId = req.body.userId;
//         const { id } = req.params;
//         const budget = await Budget.findOne({ _id: id, userId });
//         if (!budget) return res.status(404).json({ message: 'Budget not found' });
//         return res.json(budget);
//     } catch (error) {
//         console.error('getBudget error:', error);
//     }
// };

export const updateBudget = async (req, res) => {
    try {
        const userId = req.body.userId;
        const { id } = req.params;
        const updates = {};
        if (typeof req.body.amount !== 'undefined') updates.amount = req.body.amount;
        if (typeof req.body.category !== 'undefined') updates.category = req.body.category.trim();

        const budget = await Budget.findOneAndUpdate(
            { _id: id, userId: userId },
            { $set: updates },
            { new: true, runValidators: true }
        );
        if (!budget) return res.status(404).json({ message: 'Budget not found' });
        return res.json(budget);
    } catch (error) {
        console.error('updateBudget error:', error);
        return res.status(500).json({message: 'Could not update budget', error: error.message });
    }
};

export const deleteBudget = async (req, res) => {
    try {
        const userId = req.body.userId;
        const { id } = req.params;
        const budget = await Budget.findOneAndDelete({ _id: id, userId });
        if (!budget) return res.status(404).json({ message: 'Budget not found' });
        return res.json({ message: 'Budget deleted successfully' });
    } catch (error) {
        console.error('deleteBudget error:', error);
        return res.status(500).json({ message: 'Could not delete budget', error: error.message });
    }
};

