let config = {}

config.GITHUB_API_URL = "https://api.github.com"
config.GITHUB_OAUTH_URL = "https://github.com/login/oauth"
config.GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
config.GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET

module.exports = config;