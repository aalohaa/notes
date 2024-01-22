const express = require('express')
const router = express.Router()
const request = require('request')
const fdb = require('../firebase').fdb


router.get('/get', (req, res) => {
    var city = req.session.city;
    var options = {
        'method': 'GET',
        'url': `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=4ef8ae364832b393f26d1759f336a4a6&units=metric`,
        'headers': {
        }
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        var weather = JSON.parse(response.body).main;
        var data = {
            temperature: weather.temp,
            feels: weather.feels_like,
            city: city
        }
        res.send(data)

    });

})

router.get('/send', (req, res) => {
    var name = 'Era';
    var phone = '88005553535';
    var email = 'era@gmail.com';

    var options = {
        'method': 'GET',
        'url': 'https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTY5MDYzMTA0MzU1MjZkNTUzMTUxMzYi_pc?name='+ name + '&phone= ' + phone + '&email= ' + email,
        'headers': {
            'Cookie': 'ci_connect_pabbly_sesion=t63p4gk5e51jbed5uunikrkvqee0r3t2; csrf_pabbly_connect_cookie_name=b858dd141d9d96118bf73fc47bce44da'
        }
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
        res.send(response.body);
    });
})

router.get('/test', async(req, res) => {
    var email = req.query.email;
    let user_data = null
    await fdb.collection('users').where('email', '==', email).get().then((users)=> {
        users.forEach((user) => {
            user_data = user.data();
            res.send(user_data);
        })
    })

    setTimeout(()=> {
        if(user_data == null) res.send('user not found')
    }, 5000)


})


module.exports = router