require('dotenv').config();

const express = require('express');
const app     = express();
const axios   = require('axios');
const path    = require('path');

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const GITHUB_OAUTH_URL = 'https://github.com/login/oauth';
const GITHUB_API_URL   = 'https://api.github.com';
let user = {};
let access_token = '';

//set view engine
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.redirect(`${GITHUB_OAUTH_URL}/authorize?client_id=${CLIENT_ID}`);
});

axios.defaults.baseURL = GITHUB_OAUTH_URL
axios.defaults.headers.accept = 'application/json'

function showCompleteProfile(code, res) {
    reqAccessToken(code, res)
}

function reqAccessToken(code, res) {
    const body = {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code
    }

    axios.post('/access_token', body)
        .then(_res => {
            access_token = _res.data.access_token
            reqUserProfile(res)
         }).catch(err => {
            res.status(400).json({ message: err.message })
        });
}

function reqUserProfile(res) {
    axios.get(`${GITHUB_API_URL}/user`, 
            { headers: { authorization: `token ${access_token}` }})
            .then(_res => {
                user['username'] = _res.data.login
                user['avatar_url'] = _res.data.avatar_url

                reqUsersRepo(res)

            }).catch(err => {
                res.status(400).json({ message: err.message })
            });
}

function reqUsersRepo(res) {
    axios.get(`${GITHUB_API_URL}/users/${user['username']}/repos`)
        .then(_res => {
            user['repositories'] = _res.data
            res.render('index', {user: user})
        }).catch(err => {
            res.status(400).json({ message: err.message })
        });
}

app.get('/oauth_callback', (req, res) => {
    showCompleteProfile(req.query.code, res)
});

app.listen(process.env.PORT || 3000);

// Created by: hilmanski
// source code: https://github.com/hilmanski/github-repo-list-nodejs