import SavingsGoal from "../models/savingsGoal.model.js";

export const createSavingsGoal = async (req, res) => {
    try {
        const userId = req.body.userId;
        if (!userId) return res.status(401).json({ message: 'Authentication required' });
        const { deadline, targetAmount } = req.body;
        if (typeof targetAmount === 'undefined' || typeof deadline === 'undefined') {
            return res.status(400).json({ message: 'targetAmount and deadline are required' });
        };

        const savingsGoal = new SavingsGoal({
            userId,
            targetAmount,
            deadline
        });
        await savingsGoal.save();
        return res.status(201).json(savingsGoal);
    } catch (error) {
        console.error('createSavingsGoal error:', error);
        return res.status(500).json({ message: error.message });
    }
};

export const getSavingsGoals = async (req, res) => {
    try {
        const userId = req.body.userId;
        if (!userId) return res.status(401).json({ message: 'Authentication required' });
        const savingsGoal = await SavingsGoal.find({ userId });
        return res.json(savingsGoal);
    } catch (error) {
        console.error('getSavingsGoal error:', error);
        return res.status(500).json({ message: error.message });
    }
};

export const updateSavingsGoal = async (req, res) => {
    try {
        const userId = req.body.userId;
        const { id } = req.params;
        const updates = {};
        if (typeof req.body.targetAmount !== 'undefined') updates.targetAmount = req.body.targetAmount;
        if (typeof req.body.deadline !== 'undefined') updates.deadline = req.body.deadline;

        const savingsGoal = await SavingsGoal.findOneAndUpdate(
            { _id: id, userId },
            { $set: updates },
            { new: true, runValidators: true }
        );
        if (!savingsGoal) return res.status(404).json({ message: 'Savings goal not found or not editable' });
        return res.json(savingsGoal);
    } catch (error) {
        console.error('updateSavingsGoal error:', error);
        return res.status(500).json({ message: error.message });
    }
};

export const deleteSavingsGoal = async (req, res) => {
    try {
        const userId = req.body.userId;
        const { id } = req.params;
        const savingsGoal = await SavingsGoal.findOneAndDelete({ _id: id, userId });
        if (!savingsGoal) return res.status(404).json({ message: 'Savings goal not found or not deletable' });
        return res.json({ message: 'Savings goal deleted successfully' });
    } catch (error) {
        console.error('deleteSavingsGoal error:', error);
        return res.status(500).json({ message: error.message });
    }
};