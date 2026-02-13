import Settings from "../models/settings.model.js";

export const getSettings = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const settings = await Settings.findOneAndUpdate(
            { userId },
            { $setOnInsert: { userId } },
            { new: true, upsert: true, runValidators: true }
        );
        if (!settings) return res.status(404).json({ message: 'Settings not found' });
        return res.json(settings);
    } catch (err) {
        console.error('getSettings error:', err);
        return res.status(500).json({message: 'Could not fetch settings', error: err.message });
    }
};

export const updateSettings = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const updates = {};
        if (typeof req.body.currency !== 'undefined') updates.currency = req.body.currency;

        const settings = await Settings.findOneAndUpdate(
            { userId },
            { $set: updates },
            { new: true, runValidators: true }
        );
        if (!settings) return res.status(404).json({ message: 'Settings not found or not editable' });
        return res.json(settings);
    } catch (err) {
        console.error('updateSettings error:', err);
        return res.status(500).json({ message: 'Could not update settings', error: err.message });
    }
};

