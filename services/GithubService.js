const needle = require('needle');
const config = require('../config');

exports.reqAccessToken = async function(access_code) {
    const body = {
        client_id: config.GITHUB_CLIENT_ID,
        client_secret: config.GITHUB_CLIENT_SECRET,
        code: access_code
    }

    return needle('post', `${config.GITHUB_OAUTH_URL}/access_token`, body, { json: true })
        .then(function (res) {
            return res.body.access_token
        })
        .catch(function (err) {
            console.log(err)
        })
}

exports.reqUserProfile = async function (access_token) {
    return needle('get', `${config.GITHUB_API_URL}/user`, {
            headers: {
                Authorization: `token ${access_token}`,
                accept: 'application/json'
            }
        })
        .then(function (res) {
            let user = {}
            user['username'] = res.body.login
            user['avatar_url'] = res.body.avatar_url
            
            return user
        })
        .catch(function (err) {
            console.log(err)
        })
}

exports.reqUsersRepo = async function(username){
    return needle('get', `${config.GITHUB_API_URL}/users/${username}/repos`, { json: true })
            .then(function (res) {
                return res.body
            })
            .catch(function (err) {
                console.log(err)
            })
}


