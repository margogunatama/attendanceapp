var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var csrf = require('csurf');
var csrfProtection = csrf();
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs');
router.use(csrfProtection);
require('dotenv').config();

router.get('/forgotpass', function signUp(req, res, next) {

    var messages = req.flash('error');
    res.render('forgotpass', {
        title: 'Lupa Password',
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    });
});

router.get('/signup', function signUp(req, res, next) {

    var messages = req.flash('error');
    res.render('signup', {
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    });
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/signup',
    failureRedirect: '/signup',
    failureFlash: true,
}));


router.get('/', function viewLoginPage(req, res, next) {
    var messages = req.flash('error');

    res.render('login', {
        title: 'Log In',
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    });
});

router.get('/logout', isLoggedIn, function logoutUser(req, res, next) {
    req.session.destroy();
    res.clearCookie();
    req.logout();
    res.redirect('/');
});


router.get('/dummy', function (req, res, next) {
    var userChunks = [];
    var chunkSize = 3;
    //find is asynchronous function
    User.find({ type: 'employee' }, function (err, docs) {
        for (var i = 0; i < docs.length; i++) {
            userChunks.push(docs[i]);
        }
        res.render('dummy', { title: 'Dummy', users: userChunks });
    });

});

router.get('/check-type', function checkTypeOfLoggedInUser(req, res, next) {
    req.session.user = req.user;
    if (req.user.type == "Approval") {
        res.redirect('/manager/');
    }

    else if (req.user.type == "Pegawai") {
        res.redirect('/employee/');
    }
    else {
        res.redirect('/admin/');
    }

});

router.post('/resetfailed', passport.authenticate('local.reset', {
    successRedirect: '/',
    failureRedirect: '/reset',
    failureFlash: true,
}));

router.post('/login', passport.authenticate('local.signin', {
    successRedirect: '/check-type',
    failureRedirect: '/',
    failureFlash: true

}));

router.get('/google', passport.authenticate('google', {
    scope:
        ['email', 'profile']
}));

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/check-type',
    failureRedirect: '/logout',
}),
    function (req, res) {
        res.redirect('/');
        res.send("Email Not Registered");
    });

router.post('/reset', async (req, res) => {
    try {
        req.flash('email', req.body.email)
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            req.flash('error', 'Email not found')
            return res.redirect('/forgotpass')
        }

        console.log(user)

        const newPassword = Math.random().toString(36).slice(-8);
        const passwordHash = await bcrypt.hashSync(newPassword, bcrypt.genSaltSync(5), null);

        await user.update({ password: passwordHash });
        
        await sendEmail(req.body.email, newPassword);
        res.redirect('/');
        
    } catch (error) {
        console.log(error)
        res.redirect('/');
    }

})

const sendEmail = async (email, newPassword, res) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAILER_USER,
                pass: process.env.MAILER_PASSWORD
            }
        });

        await transporter.sendMail({
            from: process.env.MAILER_USER,
            to: email,
            subject: 'Password Reset',
            text: `Your new password is ${newPassword}. You can use this password to log in to your account.`
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = sendEmail;
module.exports = router;

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
