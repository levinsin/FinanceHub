import Category from "../models/category.model.js";
import Expense from "../models/expenses.model.js";

/**
 * Helper to obtain current user id from request (supports different auth middlewares)
 */
const getUserId = (req) => req.userId || req.user?.id || req.user?._id;

export const createCategory = async (req, res) => {
    try {
        const userId = getUserId(req);
        const { name, isGlobal = false } = req.body;
        if (!name) return res.status(400).json({ message: 'name is required' });

        const cat = new Category({
            name: name.trim(),
            userId: isGlobal ? null : userId,
            isGlobal: !!isGlobal
        });

        await cat.save();
        return res.status(201).json(cat);
    } catch (err) {
        if (err.code === 11000) return res.status(409).json({ message: 'Category with that name already exists' });
        return res.status(500).json({ message: 'Could not create category', error: err.message });
    }
};

export const getCategories = async (req, res) => {
    try {
        const userId = getUserId(req);
        const categories = await Category.find({ $or: [{ userId }, { isGlobal: true }] }).sort({ name: 1 });
        return res.json(categories);
    } catch (err) {
        return res.status(500).json({ message: 'Could not fetch categories', error: err.message });
    }
};

export const getCategory = async (req, res) => {
    try {
        const userId = getUserId(req);
        const { id } = req.params;
        const category = await Category.findOne({ _id: id, $or: [{ userId }, { isGlobal: true }] });
        if (!category) return res.status(404).json({ message: 'Category not found' });
        return res.json(category);
    } catch (err) {
        return res.status(500).json({ message: 'Could not fetch category', error: err.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const userId = getUserId(req);
        const { id } = req.params;
        const updates = {};
        if (req.body.name) updates.name = req.body.name.trim();
        if (typeof req.body.isGlobal !== 'undefined') updates.isGlobal = !!req.body.isGlobal;

        const category = await Category.findOneAndUpdate(
            { _id: id, $or: [{ userId }, { isGlobal: true }] },
            { $set: updates },
            { new: true, runValidators: true }
        );
        if (!category) return res.status(404).json({ message: 'Category not found or not editable' });
        return res.json(category);
    } catch (err) {
        if (err.code === 11000) return res.status(409).json({ message: 'Category with that name already exists' });
        return res.status(500).json({ message: 'Could not update category', error: err.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const userId = getUserId(req);
        const { id } = req.params;

        // prevent deleting categories that still have expenses
        const used = await Expense.exists({ category: id });
        if (used) return res.status(400).json({ message: 'Category has expenses. Reassign or delete them first.' });

        const result = await Category.deleteOne({ _id: id, $or: [{ userId }, { isGlobal: true }] });
        if (result.deletedCount === 0) return res.status(404).json({ message: 'Category not found or not deletable' });
        return res.json({ message: 'Category deleted' });
    } catch (err) {
        return res.status(500).json({ message: 'Could not delete category', error: err.message });
    }
};