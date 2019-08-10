const axios = require('axios');
const fs = require('fs-extra');
const config = require('./config');
const path = require('path');

let whitelist = [];
if (fs.existsSync(path.resolve(config.data_dir, 'whitelist.json'))) {
  whitelist = require('../data/whitelist');
}

const username = config.github_username;
const URL = `${config.api_url}/users/${username}/repos`;

async function fetchRepos(url) {
  const repos = [];
  let page = 1;
  let stopFinding = false;
  while (!stopFinding) {
    await axios.get(url, {
      params: {
        page,
        access_token: config.access_token,
      },
    }).then(res => {
      if (res.data.length === 0) {
        stopFinding = true;
        return;
      }
      const forkedRepos = res.data.filter(repo => {
        if (whitelist && whitelist.indexOf(repo.full_name) !== -1) {
          return false;
        } else {
          return repo.fork;
        }
      }).map(repo => repo.full_name);
      console.log(
          `[Page ${page}] Found ${forkedRepos.length} forked repo(s) out of ${
              res.data.length
              }:`,
      );
      console.log(forkedRepos.join('\n') + '\n');
      repos.push(...forkedRepos);
      page++;
    }).catch(err => {
      console.error(`Error fetching page ${page}: ${err}`);
      stopFinding = true;
    });
  }
  return repos;
}

fetchRepos(URL).then(result => {
  console.log('Forked repos found:', result.length);
  console.log(result.join('\n'));
  fs.writeFileSync(path.join(config.data_dir, 'reposForDeletion.json'), JSON.stringify(result, null, 2));
});
