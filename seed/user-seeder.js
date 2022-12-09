var User= require('../models/user');
var bcrypt=require('bcrypt-nodejs');
var mongoose= require('mongoose');
mongoose.Promise = global.Promise;
//mongoose.connect('localhost:27017/HRMS');
var mongoDB = process.env.MONGO_URI;
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});
var users=[

    new User({
        type: 'Approval',
        email: 'margogunatama@gmail.com',
        password: bcrypt.hashSync('123456', bcrypt.genSaltSync(5), null),
        name: 'Margo Gunatama',
        dateOfBirth: new Date('1990-05-26'),
        contactNumber: '0333-4552191',
        department: 'Divisi IT',
    }),
    
    new User({
        type: 'Pegawai',
        email: 'famurtadho@gmail.com',
        password: bcrypt.hashSync('123456', bcrypt.genSaltSync(5), null),
        name: 'Faishal M',
        dateOfBirth: new Date('1990-05-26'),
        contactNumber: '0333-4552191',
        department: 'Divisi IT',
    }),
    new User({
        type: 'Approval',
        email: 'alif@gmail.com',
        password: bcrypt.hashSync('123456', bcrypt.genSaltSync(5), null),
        name: 'Alif Syahdan',
        dateOfBirth: new Date('1990-05-26'),
        contactNumber: '0333-4552191',
        department: 'Divisi Umum',
    }),
    
    new User({
        type: 'Pegawai',
        email: 'gibran@gmail.com',
        password: bcrypt.hashSync('123456', bcrypt.genSaltSync(5), null),
        name: 'Gibran Rafi',
        dateOfBirth: new Date('1990-05-26'),
        contactNumber: '0333-4552191',
        department: 'Divisi Umum',
    }),
    
 
    new User({

        type: 'Admin',
        email: 'astri219@gmail.com',
        password: bcrypt.hashSync('123456', bcrypt.genSaltSync(5), null),
        name: 'Astri Budiarti',
        dateOfBirth: new Date('1990-05-26'),
        contactNumber: '0300-4297859',
        department: 'Divisi Human Capital',
    }),
];
//save function is asynchronous
//so we need to ceck all itmes are saved before we disconnect to db
done=0;
for (i=0;i<users.length;i++){
    users[i].save(function(err,result){
        done++;
        if(done==users.length){
            console.log('selesai')
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}