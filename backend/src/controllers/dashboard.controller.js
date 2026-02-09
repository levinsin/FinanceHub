import Expense from "../models/expenses.model.js";
import Income from "../models/income.model.js";
import Budget from "../models/budget.model.js";
import SavingsGoal from "../models/savingsGoal.model.js";
import Category from "../models/category.model.js";
import mongoose from "mongoose";

export const getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) return res.status(401).json({ message: 'Authentication required' });

        const incomes = await Income.find({ userId });
        const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
        
        const expenses = await Expense.find({ userId });
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

        const savingsTarget = await SavingsGoal.find({ userId , enum: 'monthly'});
        const totalSavings = savingsTarget.reduce((sum, goal) => sum + goal.targetAmount, 0);
        const availableMoney = totalIncome - totalExpenses - savingsTarget;

        return res.json({
            income: totalIncome,
            expenses:totalExpenses,
            savings: totalSavings,
            available: availableMoney,
        });

    } catch (err) {
        console.error('getDashboardData error:', err);
        return res.status(500).json({ message: 'Could not fetch dashboard data', error: err });
    }
};

export const getCategoryBreakdown = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) return res.status(401).json({ message: 'Authentication required' });

        const categoryExpenses = await Expense.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $group: { 
                _id: "$category",
                total: { $sum: "$amount"},
                count: { $sum: 1 }
            }}
        ]);
        

        const budgets = await Budget.find({ userId });
        const budgetMap = {};
        budgets.forEach(budget => {
            budgetMap[budget.category.toString()] = budget.amount; // maybe no string but objectId
        });

        const categoryIds = categoryExpenses.map(ce => ce._id);
        const categories = await Category.find({ _id: { $in: categoryIds } });
        
        const categoryMap = {};
        categories.forEach(cat => {
            categoryMap[cat._id.toString()] = cat.name; // maybe no string but objectId
        });

        const pieChartData = categoryExpenses.map(ce => {
            const categoryId = ce._id.toString(); // maybe no string but objectId
            const categoryName = categoryMap[categoryId] || "Uncategorized";
            const spent = ce.total;
            const budget = budgetMap[categoryId] || null;

            let status = 'no-budget';
            let remaining = 0
            if (budget !== null) {
                if (spent <= budget) { 
                    status = 'under-budget'; 
                    remaining = budget - spent;
                } else {
                    status = 'over-budget';
                    remaining = spent - budget;
                }
            }

            return {
                categoryId,
                categoryName,
                spent,
                budget,
                status,
                remaining,
                count: ce.count
            };
        });
        console.log('PieChartdata', pieChartData)
        console.log('categoryExpenses', categoryExpenses)
        return res.json({
            categories: pieChartData,
            totalSpent: categoryExpenses.reduce((sum, ce) => sum + ce.total, 0)
        });
    } catch (err) {
        console.error('getCategoryBreakdown error:', err);
        return res.status(500).json({ message: 'Could not fetch category breakdown', error: err.message });
    }
};

        

