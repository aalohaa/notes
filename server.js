//libraries
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const mysql = require('mysql')
const session = require('express-session')
const uuid = require('uuid-v4')
const multer = require('multer')
const fs = require('fs')
const storage = require('./firebase').storage
const port = 3000


//routes
const auth = require('./routes/auth')
const notes = require('./routes/notes')
const index = require('./routes/index')
const weather = require('./routes/weather')

const multer_storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'temp_path/');
    },
    filename(req, file, cb) {
        cb(null, `${file.originalname}`);
    }
});

const limits = {
    fileSize: 1024 * 1024 * 50
}

const upload = multer({
    storage: multer_storage,
    limits: limits
});




//use
app.use('/views', express.static(path.join(__dirname + '/views')))
app.use('/public', express.static(path.join(__dirname + '/public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(upload.single('note_img'))

//session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'alizhanchik1234',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
}))
//view engine
app.set('views', path.join(__dirname, 'views'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')


//routes use
app.use('/', index)
app.use('/auth', auth)
app.use('/notes', notes)
app.use('/weather', weather)



//endpoints
//sql
/*var con = mysql.createConnection({
    host: "localhost",
    user: "alizhan",
    password: "qwe123",
    database: "notes",
});


con.connect(function (err) {
    if (err) throw err;
    console.log("SQL Connected!");
});

app.post('/adduser', (req, res) => {
    var r = { r: 0 }
    var email = req.body.email;
    var name = req.body.name;
    var password = req.body.password;

    var insertUser = `INSERT INTO users (email, password, name) VALUES (?, ?, ?)`;
    con.query(insertUser, [email, password, name], function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        r['r'] = 1
        res.send(r)
    });
})

app.get('/getusers', (req, res) => {
    var selectUsers = `SELECT * FROM users;`

    con.query(selectUsers, function (err, results) {
        if (err) throw err;
        console.log(results);
        res.send(results);
    })
})

app.post('/login', (req, res) => {
    var r = { r: 0 };
    var email = req.body.email;
    var password = req.body.password;

    var selectUsers = `SELECT * FROM users WHERE email="${email}"`

    con.query(selectUsers, function (err, result) {
        if (err) throw err;
        if (result.length) {
            var user = result[0];
            if (password == user.password) {
                r['r'] = 1;
                res.send(r);
            } else {
                res.send(r)
            }
        } else {
            r['r'] = 2;
            res.send(r);
        }
    })
})

app.post('/updateuser', (req, res) => {
    var r = { r: 0 };

    var id = req.body.id;
    var new_name = req.body.new_name;

    var updateUser = `UPDATE users SET name="${new_name}" WHERE id=${id}`

    con.query(updateUser, function (err, result) {
        if (err) throw err;
        if (result.changedRows) {
            r['r'] = 1;
            res.send(r);
        } else {
            res.send(r);
        }
    })
})

app.post('/deleteuser', (req,res)=>{
    var r = {r:0};
    var id = req.body.id;

    var deleteUser = `DELETE FROM users WHERE id=${id}`

    con.query(deleteUser, function(err, result) {
        if(err) throw err;
        if(result.affectedRows) {
            r['r'] = 1;
            res.send(r);
        } else {
            res.send(r);
        }
    })
})
*/





//listen on port
app.listen(port, () => {
    console.log('app listening at port http://localhost:3000')
})