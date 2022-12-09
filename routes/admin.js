var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Param = require('../models/param');
var csrf = require('csurf');
var csrfProtection = csrf();
var config_passport = require('../config/passport.js');
var moment = require('moment');
var Leave = require('../models/leave');
var Attendance = require('../models/attendance');


router.use('/', isLoggedIn, function isAuthenticated(req, res, next) {
    next();
});

router.get('/', function viewHome(req, res, next) {
    res.render('Admin/adminHome', {
        title: 'Admin Home',
        csrfToken: req.csrfToken(),
        userName: req.session.user.name
    });
});



router.get('/view-profile', function viewProfile(req, res, next) {

    User.findById(req.session.user._id, function getUser(err, user) {
        if (err) {
            console.log(err);
        }
        res.render('Admin/viewProfile', {
            title: 'Profile',
            csrfToken: req.csrfToken(),
            employee: user,
            moment: moment,
            userName: req.session.user.name
        });
    });

});



router.get('/settingparam', function viewAllParam(req, res, next) {

    var paramChunks = [];
    var chunkSize = 3;
    err=0;
    //find is asynchronous function
    Param.find({}).sort({_id: -1}).exec(function getParams(err, docs) {
        for (var i = 0; i < docs.length; i++) {
            paramChunks.push(docs[i]);
        }
        res.render('Admin/settingparam', {
            title: 'Setting Parameter',
            csrfToken: req.csrfToken(),
            param: paramChunks,
            moment: moment,
            hasErrors:err,
            userName: req.session.user.name
        });
        console.log(paramChunks)
    });


});




router.get('/view-all-employees', function viewAllEmployees(req, res, next) {

    var userChunks = [];
    var chunkSize = 3;
    //find is asynchronous function
    User.find({$or: [{type: 'Admin'}, {type: 'Approval'}, {type: 'Pegawai'}]}).sort({_id: -1}).exec(function getUsers(err, docs) {
        for (var i = 0; i < docs.length; i++) {
            userChunks.push(docs[i]);
        }
        res.render('Admin/viewAllEmployee', {
            title: 'All Employees',
            csrfToken: req.csrfToken(),
            users: userChunks,
            userName: req.session.user.name
        });
    });


});



router.get('/add-employee', function addEmployee(req, res, next) {
    var messages = req.flash('error');
    var newUser = new User();

    res.render('Admin/addEmployee', {
        title: 'Add Employee',
        csrfToken: req.csrfToken(),
        user: config_passport.User,
        messages: messages,
        hasErrors: messages.length > 0,
        userName: req.session.user.name
    });

});

router.get('/view-param/:id', function addParam(req, res, next) {
    var messages = req.flash('error');
    var newparam = new Param();

    res.render('Admin/viewParam', {
        title: 'View Parameter',
        csrfToken: req.csrfToken(),
        user: config_passport.User,
        messages: messages,
        hasErrors: messages.length > 0,
        userName: req.session.user.name
    });

});

router.get('/settingparam', function addParam(req, res, next) {
    var messages = req.flash('error');
    var newParam = new Param();

    res.render('Admin/settingparam', {
        title: 'Setting Parameter',
        csrfToken: req.csrfToken(),
        user: config_passport.User,
        messages: messages,
        hasErrors: messages.length > 0,
        userName: req.session.user.name
    });

});





router.get('/employee-profile/:id', function getEmployeeProfile(req, res, next) {
    var employeeId = req.params.id;
    User.findById(employeeId, function getUser(err, user) {
        if (err) {
            console.log(err);
        }
        res.render('Admin/employeeProfile', {
            title: 'Employee Profile',
            employee: user,
            csrfToken: req.csrfToken(),
            moment: moment,
            userName: req.session.user.name
        });

    });
});




router.get('/edit-employee/:id', function editEmployee(req, res, next) {
    var employeeId = req.params.id;
    User.findById(employeeId, function getUser(err, user) {
        if (err) {
            res.redirect('/admin/');
        }
        res.render('Admin/editEmployee', {
            title: 'Edit Employee',
            csrfToken: req.csrfToken(),
            employee: user,
            moment: moment,
            message: '',
            userName: req.session.user.name
        });


    });

});


router.get('/redirect-employee-profile', function viewEmployeeProfile(req, res, next) {
    var employeeId = req.user.id;
    User.findById(employeeId, function getUser(err, user) {
        if (err) {
            console.log(err);
        }
        res.redirect('/admin/employee-profile/' + employeeId);

    });

});

router.get('/redirect-setting-param', function viewParamSetting(req, res, next) {
    var paramId = req.newparam;
    Param.findById(paramId, function getParam(err, param) {
        if (err) {
            console.log(err);
        }
        res.redirect('/admin/view-param/' + paramId);

    });

});


router.post('/view-attendance', function viewAttendance(req, res, next) {
    var attendanceChunks = [];
    Attendance.find({
        employeeID: req.session.user._id,
        month: req.body.month,
        year: req.body.year
    }).sort({_id: -1}).exec(function viewAttendanceSheet(err, docs) {
        var found = 0;
        if (docs.length > 0) {
            found = 1;
        }
        for (var i = 0; i < docs.length; i++) {
            attendanceChunks.push(docs[i]);
        }
        res.render('Admin/viewAttendanceSheet', {
            title: 'Attendance Sheet',
            month: req.body.month,
            csrfToken: req.csrfToken(),
            found: found,
            attendance: attendanceChunks,
            userName: req.session.user.name,
            moment: moment
        });
    });


});


router.get('/view-attendance-current', function viewCurrentlyMarkedAttendance(req, res, next) {
    var attendanceChunks = [];

    Attendance.find({
        employeeID: req.session.user._id,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    }).sort({_id: -1}).exec(function getAttendanceSheet(err, docs) {
        var found = 0;
        if (docs.length > 0) {
            found = 1;
        }
        for (var i = 0; i < docs.length; i++) {
            attendanceChunks.push(docs[i]);
        }
        res.render('Admin/viewAttendanceSheet', {
            title: 'Attendance Sheet',
            month: new Date().getMonth() + 1,
            csrfToken: req.csrfToken(),
            found: found,
            attendance: attendanceChunks,
            moment: moment,
            userName: req.session.user.name
        });
    });

});





router.post('/add-employee', passport.authenticate('local.add-employee', {
    successRedirect: '/admin/redirect-employee-profile',
    failureRedirect: '/admin/add-employee',
    failureFlash: true,
}));

router.post('/add-settingparam/', function addParam(req, res, next) {

    var newparam = new Param();
   
    newparam.clockin = req.body.clockin;
    newparam.clockout = req.body.clockout;
    newparam.earlyclockin = req.body.earlyclockin;
    newparam.earlyclockout = req.body.earlyclockout;
    newparam.jamlembur = req.body.jamlembur;
    var byid='6391dcbe6b70a64ad8d8ce58';
    Param.remove({}, function(err, result) { 
        if (err) {
            console.log(err);
        }

    
    newparam.save().then(function(docs,err) {
            console.log(docs)
            if (err) {
                console.log(err);
            }
           
        });
        res.redirect('/admin/settingparam');
    });  
    

});




router.post('/respond-application', function respondApplication(req, res) {

    Leave.findById(req.body.leave_id, function getLeave(err, leave) {
        leave.adminResponse = req.body.status;
        leave.save(function saveLeave(err) {
            if (err) {
                console.log(err);
            }
            res.redirect('/manager/leave-applications');
        })
    })


});


router.post('/edit-employee/:id', function editEmployee(req, res) {
    var employeeId = req.params.id;
    var newUser = new User();
    newUser.email = req.body.email;
    if (req.body.type == "Admin") {
        newUser.type = "Admin";
    }
    else if (req.body.type == "Pegawai") {
        newUser.type = "Pegawai";
    }
    else {
        newUser.type = "Approval";
    }
    newUser.name = req.body.name,
    newUser.department = req.body.department;
    newUser.type = req.body.type;

    User.findById(employeeId, function getUser(err, user) {
        if (err) {
            res.redirect('/admin/');
        }
        if (user.email != req.body.email) {
            User.findOne({'email': req.body.email}, function getUser(err, user) {
                if (err) {
                    res.redirect('/admin/');
                }
                if (user) {
                    res.render('Admin/editEmployee', {
                        title: 'Edit Employee',
                        csrfToken: req.csrfToken(),
                        employee: newUser,
                        moment: moment,
                        message: 'Email is already in use', userName: req.session.user.name
                    });

                }
            });
        }
        user.email = req.body.email;
        if (req.body.type == "Admin") {
            user.type = "Admin";
        }
        else if (req.body.type == "Pegawai") {
            user.type = "Pegawai";
        }
        else {
            user.type = "Approval";
        }
        user.name = req.body.name,          
        user.department = req.body.department;
        user.type = req.body.type;

        user.save(function saveUser(err) {
            if (err) {
                console.log(error);
            }
            res.redirect('/admin/employee-profile/' + employeeId);

        });
    });

});

router.post('/delete-employee/:id', function deleteEmployee(req, res) {
    var id = req.params.id;
    User.findByIdAndRemove({_id: id}, function deleteUser(err) {
        if (err) {
            console.log('unable to delete employee');
        }
        else {
            res.redirect('/admin/view-all-employees');
        }
    });
});





router.post('/mark-attendance', function markAttendance(req, res, next) {

    Attendance.find({
        employeeID: req.session.user._id,
        date: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    }, function getAttendance(err, docs) {
        var found = 0;
        if (docs.length > 0) {
            found = 1;
        }
        else {

            var newAttendance = new Attendance();
            newAttendance.employeeID = req.session.user._id;
            newAttendance.year = new Date().getFullYear();
            newAttendance.month = new Date().getMonth() + 1;
            newAttendance.date = new Date().getDate();
            newAttendance.present = 1;
            newAttendance.save(function saveAttendance(err) {
                if (err) {
                    console.log(err);
                }

            });
        }
        res.redirect('/admin/view-attendance-current');

    });

});
module.exports = router;



function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}


function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}