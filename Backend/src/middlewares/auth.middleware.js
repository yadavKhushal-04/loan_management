import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Token should be in format: "Bearer <token>"
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Access token missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded; // Attach user info to request
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
