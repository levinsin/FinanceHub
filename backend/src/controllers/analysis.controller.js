import Expense from "../models/expense.model.js";
import Income from "../models/income.model.js";
import mongoose from "mongoose";

export const getIncomeExpenseAnalysis = async(req, res) => {
    try {
        const userId = req.user.id;
        const duration = req.body.duration || 6;
        if (!userId) return res.status(401).json({ message: 'Authentication required' });

        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth() - duration + 1, 1);

        // relevante Monate laden
        const incomes = await Income.find({
            userId,
            date: { $gte: startDate }
        });

        const expenses = await Expense.find({
            userId,
            date: { $gte: startDate }
        });

        const analysisMap = {};

        // Monate korrekt berechnen (inkl. Jahreswechsel)
        for (let i = 0; i < duration; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            analysisMap[key] = { income: 0, expense: 0 };
        }

        // Income addieren
        incomes.forEach(income => {
            const date = new Date(income.date);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

            if (analysisMap[key]) {
                analysisMap[key].income += income.amount;
            }
        });

        // Expense addieren
        expenses.forEach(expense => {
            const date = new Date(expense.date);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

            if (analysisMap[key]) {
                analysisMap[key].expense += expense.amount;
            }
        });

        return res.json(analysisMap);

    } catch (err) {
        console.error('getIncomeExpenseAnalysis error:', err);
        return res.status(500).json({
            message: 'Could not fetch analysis data',
            error: err
        });
    }
};


// get category breakdown over time (last 6 months) for expenses
export const getCategoryTimeSeriesAnalysis = async(req, res) => {
    try {
        const userId = req.user.id;
        const duration = req.body.duration || 6;
        if (!userId) return res.status(401).json({ message: 'Authentication required' });

        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth() - duration + 1, 1);

        const categoryExpenses = await Expense.aggregate([{
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        category: "$category",
                        month: {
                            $dateToString: { format: "%Y-%m", date: "$date" }
                        }
                    },
                    total: { $sum: "$amount" }
                }
            }
        ]);

        // Map vorbereiten
        const categoryAnalysisMap = {};

        for (let i = 0; i < duration; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            categoryAnalysisMap[key] = {};
        }

        // Aggregierte Daten einfügen
        categoryExpenses.forEach(ce => {
            const key = ce._id.month;
            const category = ce._id.category;

            if (categoryAnalysisMap[key]) {
                categoryAnalysisMap[key][category] = ce.total;
            }
        });

        return res.json(categoryAnalysisMap);

    } catch (err) {
        console.error('getCategoryTimeSeriesAnalysis error:', err);
        return res.status(500).json({
            message: 'Could not fetch category time series analysis data',
            error: err
        });
    }
};