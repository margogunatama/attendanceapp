var express = require('express');
var router = express.Router();
var User = require('../models/user');

//var UserSalary = require('../models/user_salary');
//var PaySlip = require('../models/payslip');
var Leave = require('../models/leave');
var Attendance = require('../models/attendance');
var moment = require('moment');
//var Project = require('../models/project');
//var PerformanceAppraisal = require('../models/performance_appraisal');
var flash = require('connect-flash');
var csrf = require('csurf');
var csrfProtection = csrf();

router.use('/', isLoggedIn, function checkAuthentication(req, res, next) {
    next();
});


router.get('/', function viewHomePage(req, res, next) {

    res.render('Manager/managerHome', {
        title: 'Manager Home',
        csrfToken: req.csrfToken(),
        userName: req.session.user.name
    });
});

router.get('/view-employees', function viewAllEmployees(req, res, next) {

    var userChunks = [];
    var chunkSize = 3;
    //find is asynchronous function
    //department:req.session.user.department
    User.find({$or: [{type: 'Pegawai',}]}).sort({_id: -1}).exec(function getUsers(err, docs) {
        for (var i = 0; i < docs.length; i++) {
            userChunks.push(docs[i]);
        }
        res.render('Manager/managerviewAllEmployee', {
            title: 'All Employees',
            csrfToken: req.csrfToken(),
            users: userChunks,
            userName: req.session.user.name
        });
    });


});



router.get('/leave-applications', function getLeaveApplications(req, res, next) {

    var leaveChunks = [];
    var employeeChunks = [];
    var temp;
    //find is asynchronous function
    Leave.find({}).sort({}).exec(function findAllLeaves(err, docs) {
        var hasLeave = 0;
        if (docs.length > 0) {
            hasLeave = 1;
        }
        for (var i = 0; i < docs.length; i++) {
            leaveChunks.push(docs[i])
        }
        for (var i = 0; i < leaveChunks.length; i++) {

            User.findById(leaveChunks[i].applicantID, function getUser(err, user) {
                if (err) {
                    console.log(err);
                }
                employeeChunks.push(user);

            })
        }

        // call the rest of the code and have it execute after 3 seconds
        setTimeout(render_view, 900);
        function render_view() {
            res.render('Manager/allApplications', {
                title: 'Approval Lembur',
                csrfToken: req.csrfToken(),
                hasLeave: hasLeave,
                leaves: leaveChunks,
                employees: employeeChunks, 
                moment: moment, 
                userName: req.session.user.name
            });
        }
    });

});



router.get('/respond-application/:leave_id/:employee_id', function respondApplication(req, res, next) {
    var leaveID = req.params.leave_id;
    var employeeID = req.params.employee_id;
    Leave.findById(leaveID, function getLeave(err, leave) {

        if (err) {
            console.log(err);
        }
        User.findById(employeeID, function getUser(err, user) {
            if (err) {
                console.log(err);
            }
            res.render('Manager/applicationResponse', {
                title: 'Approval Lembur',
                csrfToken: req.csrfToken(),
                leave: leave,
                employee: user,
                moment: moment, userName: req.session.user.name
            });


        })


    });


});



router.get('/view-attendance-current', function viewCurrentMarkedAttendance(req, res, next) {

    var attendanceChunks = [];

    Attendance.find({
        employeeID: req.user._id,
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
        res.render('Manager/viewAttendance', {
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

router.get('/view-profile', function viewProfile(req, res, next) {

    User.findById(req.user._id, function getUser(err, user) {
        if (err) {
            console.log(err);

        }
        res.render('Manager/viewManagerProfile', {
            title: 'Profile',
            csrfToken: req.csrfToken(),
            employee: user,
            moment: moment,
            userName: req.session.user.name
        });
    });

});

router.post('/view-attendance', function viewAttendance(req, res, next) {

    var attendanceChunks = [];
    Attendance.find({
        employeeID: req.user._id,
        month: req.body.month,
        year: req.body.year
    }).sort({_id: -1}).exec(function getAttendanceSheet(err, docs) {
        var found = 0;
        if (docs.length > 0) {
            found = 1;
        }
        for (var i = 0; i < docs.length; i++) {
            attendanceChunks.push(docs[i]);
        }
        res.render('Manager/viewAttendance', {
            title: 'Attendance Sheet',
            month: req.body.month,
            csrfToken: req.csrfToken(),
            found: found,
            attendance: attendanceChunks,
            moment: moment,
            userName: req.session.user.name
        });
    });


});



router.post('/mark-manager-attendance', function markAttendance(req, res, next) {

    Attendance.find({
        employeeID: req.user._id,
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
            newAttendance.employeeID = req.user._id;
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
        res.redirect('/manager/view-attendance-current');

    });


});
module.exports = router;



function isLoggedIn(req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}