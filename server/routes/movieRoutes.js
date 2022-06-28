const router = require('express').Router()
const fetch = require('node-fetch')
const pgp = require('pg-promise')();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const API_KEY = 'fc66060400d3927a27256d6560a12851'
const BASE_URL = 'https://api.themoviedb.org/3'
const API_URL = BASE_URL + '/discover/movie?api_key='+ API_KEY + '&sort_by=popularity.desc'

//database config
const config = {
	connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Minenhle!28@localhost:5432/movie_favorites',
};
const db = pgp(config)


//verify the token
const verifyToken = (req, res, next) => {
    //get auth header value
    const bearerHeader = req.headers['authorization']

    //check if bearer is undefined
    if(typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(' ')[1]
        req.token = bearerToken
        next()
    }else {
        res.sendStatus(403)
    }
}

router.get('/mostpopular', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err){
            res.sendStatus(403)
        }else{
            fetch(API_URL)
            .then(res => res.json())
            .then((data, error) => {
                if(error){
                    console.log(error)
                }else{
                    let movies = data.results
                    res.json({
                        movies: movies,
                        authData
                    })
                }
            })
        }
    })
    
})

router.post('/register', async (req, res) => {
    const user = {
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        username: req.body.regusername,
        password: req.body.regpassword
    }
    let userCheck = await db.any('select * from users where username = $1', [user.username])
    if(userCheck.length !== 0){
        res.json({
            message: 'User already Exists'
        })
    }else{
        //hash password and store it
        bcrypt.genSalt(5, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                db.none('insert into users (first_name, last_name, username, password) values ($1, $2, $3, $4)', [user.first_name, user.last_name, user.username, hash])
            });
        });
        res.json({
            message: 'Successfully registered'
        })
    }
})


router.post('/login', async (req, res) => {
    const user = {
        username: req.body.username,
        password: req.body.password
    }
    let userCheck = await db.any('select * from users where username = $1', [user.username])
    let hashedPassword = userCheck[0].password

    bcrypt.compare(user.password, hashedPassword, function(err, result) {
        if(result){
            jwt.sign({user}, 'secretkey', { expiresIn: '24h' }, (err, token) => {
                res.json({
                    token
                })
            })
        }else{
            res.json({
                message: 'Incorrect username and password combination'
            })
        }
    })
})

router.get('/search/:name', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (error, authData) => {
        if(error){
            res.sendStatus(403)
        }else{
            let movie = req.params['name']
            fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${movie}`)
            .then(res => res.json())
            .then((data, error) => {
                if(error){
                    console.log(error)
                }else{
                    res.json({data})
                }
            })
        }
    })
    
})



module.exports = router