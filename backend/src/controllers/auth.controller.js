import User from '../models/user.model.js';

// Check if email exists in database
export const checkEmail = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ 
                success: false,
                message: 'Email is required' 
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        
        return res.status(200).json({
            success: true,
            exists: !!user
        });
    } catch (error) {
        console.error('Error checking email:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Simple password comparison (in production, use bcrypt)
        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                email: user.email,
                name: user.name,
                birthday: user.birthday
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Register new user
export const register = async (req, res) => {
    try {
        const { email, password, name, birthday } = req.body;
        
        if (!email || !password || !name || !birthday) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Create new user (in production, hash the password with bcrypt)
        const user = new User({
            email: email.toLowerCase(),
            password,
            name,
            birthday: new Date(birthday)
        });

        await user.save();

        return res.status(201).json({
            success: true,
            message: 'Registration successful',
            user: {
                email: user.email,
                name: user.name,
                birthday: user.birthday
            }
        });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
