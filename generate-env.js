const fs = require('fs');
const dotenv = require('dotenv');

const env = dotenv.config().parsed;

const envScriptContent = `window.env = ${JSON.stringify(env)};`;

fs.writeFileSync('./js/env.js', envScriptContent);
