const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    if (req.session.isAuth){
        let username = req.session.username
    
        console.log(req.session.username)
        res.render('index', {
            username: username
        })
    } else {
        res.render('sign_in')
    }

})
router.get('/signup', (req, res) => {
    res.render('sign_up')
})
router.get('/signin', (req, res) => {
    res.render('sign_in')
})




module.exports = router