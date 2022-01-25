const express = require('express');
const router = express.Router();
const userSchema = require('../model/user');
const profileSchema = require('../model/profile');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post('/users/register', (req, res) => {
    const { username, email, password } = req.body.user
    userSchema.find({email, username}).then( ([user]) => {
            if(user){
                return res.status(422).json({message: "User Exist"})
            }else{
                bcrypt.hash(password, saltRounds, (err, hash) => {
                    if(err){
                        return res.status(422).json({message: err})
                    }
                    else{
                        const user = new userSchema({username, email, password: hash});
                        user.save()
                            .then( user => {
                                const profile = new profileSchema({user: user._id})
                                profile.save()
                                    .then(  profile => {
                                        res.status(201).json({ user: { username: user.username, email: user.email, token: jwt.sign({email: user.email, password }, process.env.JSON_TOKEN, {expiresIn:'1d'}), bio: profile.bio, image: profile.image }})
                                    })
                                    .catch( err => {
                                        res.status(422).json({message: "Error al crear el perfil"})
                                    })
                            })
                            .catch( err => {
                                res.status(422).json({message: err})
                            })
                        
                    }
                });
            }
        })
        .catch( () => {
            res.status(422).send()
        })
})  

router.post('/users/login', (req, res) => {
    const {email, password} = req.body.user
    userSchema.findOne({email})
        .then( user => {
            if(user){
                bcrypt.compare(password, user.password).then( result => {

                    if(!result) return res.status(422).send();
                    
                    const accessToken = jwt.sign({email: user.email, password }, process.env.JSON_TOKEN, {expiresIn:'1d'});
                    profileSchema.findOne({id: user._id})
                        .then( profile => { 
                            res.status(201).json({ user: { email: user.email, username: user.username, token: accessToken, bio: profile.bio, image: profile.image }})
                        })
                        .catch( err => {
                            res.status(422).send()
                        })
                })
                .catch( err => {
                    res.status(422).send()
                });
            }else{

            }
        })
        .catch( err => {
            res.status(422).send()
        });
})

router.get('/user', (req, res) => {
    const accessToken = req.headers['authorization'];
        if(!accessToken || accessToken.slice(0,7)!== 'Bearer '){
            res.status(401).send()
        }else{
            jwt.verify(accessToken.slice(7), process.env.JSON_TOKEN, (err, user) => {
                if(err){
                    res.status(403).json({
                        message: "Token invalido, vuelva a iniciar sesión"
                    })
                }else{
                    userSchema.findOne({email: user.email})
                        .then( user => {
                            profileSchema.findOne({id: user._id})
                                .then( profile => {
                                    res.status(201).json({user: {email: user.email, username: user.username, token: jwt.sign({email: user.email, password: user.password }, process.env.JSON_TOKEN, {expiresIn:'1d'}), bio: profile.bio, image: profile.image }})
                                })
                        })
                }
            });
        }
})

module.exports = router;