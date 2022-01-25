const express = require('express');
const router = express.Router();
const userSchema = require('../models/user');
const profileSchema = require('../models/profile');
const userProfileSchema = require('../models/userProfile');
const jwt = require('jsonwebtoken');

router.get('/:username', (req, res) => {
    const { username } = req.params;
    const accessToken = req.headers['authorization'];
        if(!accessToken || accessToken.slice(0, 7) !== 'Bearer '){
            userSchema.findOne({username})
                .then( user => {
                    if(user){
                        profileSchema.findOne({user: user._id})
                            .then( profile => {
                                res.status(201).json({ profile : { username, bio: profile.bio, image: profile.image, following: false }});
                            })
                            .catch( () => {
                                res.status(422).send();
                            })
                    }else{
                        res.status(422).json({errors: ["Usuario no existe"]})
                    }
                })
                .catch( () => {
                    res.status(422).send();
                })
        }else{
            jwt.verify(accessToken.slice(7), process.env.JSON_TOKEN, (err, user) => {
                if(err){
                    res.status(422).json({errors: ["Token Inválido"]});
                }else{
                    userSchema.findOne({email: user.email})
                        .then( user => {
                            userSchema.findOne({username})
                                .then( userParam => {
                                    if(userParam){
                                        profileSchema.findOne({user: userParam._id})
                                            .then( profile => {
                                                userProfileSchema.findOne({user: user._id, profile: profile._id})
                                                    .then( userProfile => {
                                                        if(userProfile){
                                                            res.status(201).json({profile: { username, bio: profile.bio, image: profile.image, following: userProfile.following }});
                                                        }else{
                                                            const userProfile = new userProfileSchema({user: user._id, profile: profile._id})
                                                            userProfile.save()
                                                                .then( userPrf => {
                                                                    res.status(201).json({profile: { username, bio: profile.bio, image: profile.image, following: userPrf.following }});
                                                                })
                                                                .catch(() => {
                                                                    res.status(422).send();
                                                                })
                                                        }
                                                    })
                                                    .catch( () => {
                                                        res.status(422).send();
                                                    })
                                            })
                                            .catch( () => {
                                                res.status(422).send();
                                            })
                                    }
                                })
                                .catch( () => {
                                    res.status(422).send();
                                })
                        })
                        .catch( () => {
                            res.status(422).send();
                        })
                }
            });
        }
})

router.get('/:username/follow', (req, res) => {
    const accessToken = req.headers['authorization'];
    const { username } = req.params;
    if(!accessToken || accessToken.slice(0, 7) !== 'Bearer'){
        res.status(401).send();
    }else{
        jwt.verify(accessToken.slice(7), process.env.JSON_TOKEN, (err, user) => {
            if(err){
                res.status(422).json({errors: ["Token Inválido"]});
            }else{
                userSchema.findOne({email: user.email})
                    .then(  user => {
                        userSchema.findOne({username})
                            .then( userParam => {
                                if(userParam){

                                }else{
                                    res.status(422).json({errors: "User not Exist"})
                                }
                            })
                    })
            }
        });
    }
})

module.exports = router;