const fs = require('fs-extra')
const path = require('path')

const data_dir = path.resolve(__dirname, '../data')
fs.ensureDir(data_dir)

module.exports = {
  api_url: process.env.GITHUB_API,
  access_token: process.env.GITHUB_ACCESS_TOKEN,
  github_username: process.env.GITHUB_USER,
  data_dir
}
