const bcrypt = require('bcrypt');

// Middleware function to hash passwords
const hashPassword = async (req, res, next) => {
    try {
        if (!req.body.password) {
            return res.status(400).json({ error: 'Password is required' });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10); 
        req.body.hashedpassword = hashedPassword;
        next();
    } catch (error) {
        console.error('Error hashing password:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = hashPassword;
