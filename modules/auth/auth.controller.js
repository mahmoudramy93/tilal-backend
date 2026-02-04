const User = require('./auth.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { successResponse } = require('../../utils/response');

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        successResponse(res, {
            id: user._id,
            email: user.email,
            role: user.role,
        }, 'User registered', 201);

    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !user.isActive) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        successResponse(res, {
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
            },
        }, 'Login successful');

    } catch (error) {
        next(error);
    }
};
