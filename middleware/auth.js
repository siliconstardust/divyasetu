// middleware/auth.js – session-based auth guards

// Ensure user is logged in
exports.isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) return next();
    req.flash('error', 'Please log in to access this page.');
    res.redirect('/auth/login');
};

// Ensure admin is logged in
exports.isAdmin = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') return next();
    req.flash('error', 'Admin access required.');
    res.redirect('/auth/login');
};

// Pass user to all views
exports.setLocals = (req, res, next) => {
    res.locals.currentUser  = req.session.user || null;
    res.locals.success_msg  = req.flash('success');
    res.locals.error_msg    = req.flash('error');
    next();
};
