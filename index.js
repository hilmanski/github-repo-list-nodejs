require('dotenv').config();

const express = require('express');
const app     = express();

const config = require('./config');
const GithubService = require('./services/GithubService')

//set view engine
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.redirect(`${config.GITHUB_OAUTH_URL}/authorize?client_id=${config.GITHUB_CLIENT_ID}`);
});

app.get('/oauth_callback', async function(req, res) {

    try {
        const access_token = await GithubService.reqAccessToken(req.query.code)
        const user = await GithubService.reqUserProfile(access_token)
        const repositories = await GithubService.reqUsersRepo(user.username)

        res.render('index', { user: user, repositories: repositories })
    } catch (err) {
        console.log(err)
        return res.status(500).send();
    }
});

app.listen(process.env.PORT || 3000);

// Created by: hilmanski
// source code: https://github.com/hilmanski/github-repo-list-nodejs