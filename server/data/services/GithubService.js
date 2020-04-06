const axios = require('axios');

module.exports = {
    url: `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`,
    async authorize(code) {
        const redirectURL = 'https://github.com/login/oauth/access_token';
        const response = await axios.post(
            redirectURL,
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code
            },
            {
                headers: { Accept: 'application/json' }
            }
        );
        return response.data.access_token;
    }
};
