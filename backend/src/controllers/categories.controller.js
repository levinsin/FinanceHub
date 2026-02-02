import Category from "../models/category.model.js";
import Expense from "../models/expenses.model.js";

/**
 * Helper to obtain current user id from request (set by auth middleware)
 */
// const getUserId = (req) => req.userId || req.user?.id || req.user?._id;
const getUserId = (req) => req.user.id;


export const createCategory = async (req, res) => {
    try {
        const userId = getUserId(req);
        // Do not trust client-provided userId; determine from authenticated request
        const { name, isGlobal = false } = req.body; // default to user-specific
        if (!name) return res.status(400).json({ message: 'name is required' });

        if (!isGlobal && !userId) {
            return res.status(401).json({ message: 'Authentication required to create user categories' });
        }

        const cat = new Category({
            name: name.trim(),
            userId: isGlobal ? null : userId,
            isGlobal: !!isGlobal
        });

        await cat.save();
        return res.status(201).json(cat);
    } catch (err) {
        // added detailed logging for debugging
        console.error('createCategory failed', {
            message: err.message,
            stack: err.stack,
            body: req.body,
            userId: getUserId(req)
        });
        if (err.code === 11000) return res.status(409).json({ message: 'Category with that name already exists' });
        return res.status(500).json({ message: 'Could not create category', error: err.message });
    }
};

export const getCategories = async (req, res) => {
    try {
        const userId = getUserId(req);
        const categories = await Category.find({ $or: [{ userId }, { isGlobal: false }] }).sort({ name: 1 });
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

// export const deleteCategory = async (req, res) => {
//   try {
//     console.log('Incoming headers:', {
//       authorization: req.get('Authorization') || req.get('authorization'),
//       all: req.headers
//     });
//     const userId = getUserId(req);
//     const { id } = req.params;
//     console.log('deleteCategory called', { id, userId, body: req.body });

//     // find category
//     const cat = await Category.findById(id);
//     if (!cat) return res.status(404).json({ message: 'Not found' });

//     // authorize: allow if owner or global handling policy
//     if (cat.userId && String(cat.userId) !== String(userId)) {
//       return res.status(403).json({ message: 'Not allowed' });
//     }

//     await Category.deleteOne({ _id: id });
//     return res.json({ success: true });
//   } catch (err) {
//     console.error('deleteCategory error', err);
//     return res.status(500).json({ message: 'Could not delete', error: err.message });
//   }
// };

export const deleteCategory = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const cat = await Category.findById(id);
    if (!cat) return res.status(404).json({ message: 'Not found' });

    if (cat.isGlobal) {
      return res.status(403).json({ message: 'Global categories cannot be deleted' });
    }

    if (String(cat.userId) !== String(userId)) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    await Category.deleteOne({ _id: id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Could not delete', error: err.message });
  }
};