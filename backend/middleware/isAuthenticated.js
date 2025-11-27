import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';

export const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authorization token missing or invalid'
            });
        }

        const token = authHeader.split(' ')[1];

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ success: false, message: 'Token has expired' });
            }
            return res.status(401).json({ success: false, message: 'Token verification failed' });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        req.userId = user._id;
        next();
    } catch (error) {
        console.error('isAuthenticated error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
