function AuthenticatedUserOnly (req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Login to continue'
        });
    }
    next();
}

function AuthorOnly (req, res, next) {
    const authUserId = req.user.id;
    const { userId } = req.params;

    if (authUserId !== userId) {
        return res.status(403).json({
            success: false,
            message: 'Forbidden'
        });
    }
    next();
}

export { AuthenticatedUserOnly, AuthorOnly }