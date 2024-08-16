const jwt = require('jsonwebtoken');

const verifiedAdmin = {
    verifyToken: (req, res, next) => {
        const authHeader = req.headers.token;
        if (authHeader) {
            const token = authHeader.split(" ")[1];
            jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    res.status(403).json({ message: 'Invalid token' });
                } else {
                    req.user = user;
                    next();
                }
            });
        } else {
            res.status(401).json({ message: 'You are not authenticated' });
        }
    },
    verifyAdmin: (req, res, next) => {
        verifiedAdmin.verifyToken(req, res, () => {
            if (req.user.admin || (req.user.id === req.params.id)) {
                next();
            } else {
                res.status(403).json({ message: 'You are not allowed to do this' });
            }
        });
    }
};

module.exports = verifiedAdmin;