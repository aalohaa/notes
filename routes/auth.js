const express = require('express')
const router = express.Router()
const fdb = require('../firebase').fdb
const fauth = require('../firebase').fauth


router.post('/signin', async (req, res) => {
    var r = { r: 0 }
    let email = req.body.email.toLowerCase()
    let password = req.body.password

    if (!email || !password) {
        return res.send(r)
    }

    await fauth.signInWithEmailAndPassword(fauth.getAuth(), email, password).then(async (userCredential) => {
        await fdb.collection('users').doc(userCredential.user.uid).get().then((user) => {
            r['r'] = 1
            req.session.username = user.data().username
            req.session.isAuth = true
            req.session.user_id = user.id
            req.session.city = user.data().city
            res.send(r)

        })
    }).catch((e) => {
        console.log(e);
        if (e.code == 'auth/invalid-email') {
            r['r'] = 2
        }
        if (e.code == 'auth/missing-password') {
            r['r'] = 3

        }
        if (e.code == 'auth/invalid-credential') {
            r['r'] = 4
        }
        if (e.code == 'auth/too-many-requests') {
            r['r'] = 5

        }
        res.send(r);
    })
})

router.post('/signup', async (req, res) => {
    var r = { r: 0 }
    let username = req.body.username
    let email = req.body.email.toLowerCase().trim();
    let password = req.body.password
    let city = req.body.city.trim();

    if (!email || !username || !password) {
        return res.send(r);
    }

    await fauth.createUserWithEmailAndPassword(fauth.getAuth(), email, password).then(async (userCredential) => {

        await fdb.collection('users').doc(userCredential.user.uid).set({
            user_id: userCredential.user.uid,
            username: username,
            email: email,
            city: city
        }).then(() => {
            r['r'] = 1
            req.session.isAuth = true
            req.session.username = username
            req.session.user_id = userCredential.user.uid
            req.session.city = city
            res.send(r)
        }).catch((e) => {
            console.log(e);
            res.send(r)
        })

    }).catch((e) => {
        console.log(e);
        if (e.code == 'auth/missing-password') {
            r['r'] = 2

        }
        if (e.code == 'auth/weak-password') {
            r['r'] = 3

        }
        if (e.code == 'auth/email-already-in-use') {
            r['r'] = 4

        }
        if (e.code == 'auth/too-many-requests') {
            r['r'] = 5

        }

        res.send(r);
    })
})




module.exports = router