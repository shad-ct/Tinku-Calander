const authenticateAdmin = (req, res, next) => {
    const adminPass = process.env.ADMIN_PASS;
    const requestPass = req.headers['x-admin-password'];

    if (!adminPass || requestPass === adminPass) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized: Invalid Admin Password' });
    }
};

module.exports = authenticateAdmin;
