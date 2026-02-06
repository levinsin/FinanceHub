import Income from "../models/income.model.js";

export const createIncome = async (req, res) => {
    try {
        const userId = req.body.userId;
        if (!userId) return res.status(401).json({ message: 'Authentication required' });
        const { amount, source } = req.body;
        if (typeof amount === 'undefined' || typeof source === 'undefined') {
            return res.status(400).json({ message: 'amount and source are required' });
        }

        const income = new Income({
            userId,
            amount,
            source: source.trim()
        });
        await income.save();
        return res.status(201).json(income);      
    } catch (err) {
        console.error('createIncome error:', err);
        return res.status(500).json({ message: 'Could not create income', error: err.message });
    }
};

export const getIncomes = async (req, res) => {
    try {
        const userId = req.body.userId;
        if (!userId) return res.status(401).json({ message: 'Authentication required' });
        const incomes = await Income.find({ userId });
        return res.json(incomes);
    } catch (err) {
        console.error('getIncomes error:', err);
        return res.status(500).json({ message: 'Could not fetch incomes', error: err.message });
    }
}

// export const getIncome = async (req, res) => {
//     try {
//         const userId = req.body.userId;
//         const { id } = req.params;
//         const income = await Income.findOne({ _id: id, userId });
//         if (!income) return res.status(404).json({ message: 'Income not found' });
//         return res.json(income);
//     } catch (err) {
//         console.error('getIncome error:', err);
//         return res.status(500).json({ message: 'Could not fetch income', error: err.message }); 
//     }
// };

export const updateIncome = async (req, res) => {
    try {
        const userId = req.body.userId;
        const { id } = req.params;
        const updates = {};
        if (typeof req.body.amount !== 'undefined') updates.amount = req.body.amount;
        if (typeof req.body.source !== 'undefined') updates.source = req.body.source.trim();

        const income = await Income.findOneAndUpdate(
            { _id: id, userId: userId },
            { $set: updates },
            { new: true, runValidators: true }
        );
        if (!income) return res.status(404).json({ message: 'Income not found' });
        return res.json(income);
    } catch (err) {
        console.error('updateIncome error:', err);
        return res.status(500).json({ message: 'Could not update income', error: err.message });
    }
};

export const deleteIncome = async (req, res) => {
    try {
        const userId = req.body.userId;
        const { id } = req.params;
        const income = await Income.findOneAndDelete({ _id: id, userId });
        if (!income) return res.status(404).json({ message: 'Income not found' });
        return res.json({ message: 'Income deleted successfully' });
    } catch (err) {
        console.error('deleteIncome error:', err);
        return res.status(500).json({ message: 'Could not delete income', error: err.message });
    }
};