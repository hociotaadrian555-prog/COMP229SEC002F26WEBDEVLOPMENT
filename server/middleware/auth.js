
import jwt from "jsonwebtoken";

// Verify the user's JWT token
const requireAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Attach authenticated user information
        req.auth = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

// Check whether the logged-in user is an Admin
export const requireAdmin = (req, res, next) => {
    if (!req.auth || req.auth.role !== "Admin") {
        return res.status(403).json({
            message: "Access denied. Admin privileges required."
        });
    }

    next();
};

export default requireAuth;
