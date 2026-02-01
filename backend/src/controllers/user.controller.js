import { User } from "../models/user.model.js";

const registerUser = async (req, res) => {
try {
    let { surname, lastname, email, password, birthday } = req.body;

    // sanitize
    surname = surname?.trim().title();
    lastname = lastname?.trim().title();
    email = email?.trim()?.toLowerCase();
    password = password?.trim();

    // basic validation
    if (!surname || !lastname || !email || !password) {
        return res.status(400).json({ message: "surname, lastname, email and password are required" });
    }

    const emailRegex = new RegExp([
        "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*)",
        "|",
        "\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")",
        "@",
        "(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?",
        "|",
        "\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}",
        "(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:",
        "(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)",
        "\\]"
    ].join(""));

    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    // if (password.length < 6) {
    //     return res.status(400).json({ message: "Password must be at least 6 characters" });
    // }

    // require password: min 8 chars, at least one uppercase, one lowercase, one digit, one special
    const pwdRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[.#\/\+\-#!@$%^&*\_]).{8,}$/;
    if (!pwdRegex.test(password)) {
        return res.status(400).json({
            message: "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character."
        });
    }
    
    // check if user exists already (by email or lastname)
    const existing = await User.findOne({ $or: [{ email }, { lastname }] });
    if (existing) {
        if (existing.email === email) {
            return res.status(400).json({ message: "Email already in use" });
        }
        return res.status(400).json({ message: "Lastname already taken" });
    }

    // parse/validate birthday if provided
    let birthdayDate = undefined;
    if (birthday) {
        birthdayDate = new Date(birthday);
        if (isNaN(birthdayDate.getTime())) {
            return res.status(400).json({ message: "Invalid birthday date" });
        }
    }

    // create user
    const user = await User.create({
        surname,
        lastname,
        email,
        password,
        birthday: birthdayDate
    });

    return res.status(201).json({
        message: "User registered!",
        user: { id: user._id, email: user.email, username: user.username }
    });

} catch (error) {
    // handle duplicate key (e.g. unique index) and validation errors
    if (error && error.code === 11000) {
        const key = Object.keys(error.keyValue || {})[0] || "field";
        return res.status(400).json({ message: `${key} already exists` });
    }
    if (error && error.name === "ValidationError") {
        const errors = Object.values(error.errors || {}).map(e => e.message);
        return res.status(400).json({ message: "Validation error", errors });
    }

    console.error("registerUser error:", error);
    res.status(500).json({ message: "Internal server error" });
}
};

const loginUser = async (req, res) => {
    try {
        
        // checking if the user already exists
        const { email, password } = req.body;
       
        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if(!user) return res.status(400).json({
             message: "User not found"
        });

       
        // compare passwords
        const isMatch = await user.comparePassword(password);
        if(!isMatch) return res.status(400).json({
            message: "Invalid credentials"

        })

        res.status(200).json({
            message: "User Logged in",
            user: {
                id: user._id,
                email: user.email,
                username: user.username 
            }
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

const logoutuser = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({
            email
        });

        if(!user) return res.status(404).json({
            message: "User not found"
        });
         
        res.status(200).json({
            message: "Logout successful"
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error", error
        });
    }
}

const checkEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        res.status(200).json({
            exists: !!user
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error", error: error.message
        });
    }
}

export {
    registerUser,
    loginUser,
    logoutuser,
    checkEmail
};