const axios=require('axios');

const headers={};

if(process.env.GITHUB_TOKEN){
    headers.Authorization=`Bearer ${process.env.GITHUB_TOKEN}`;
}

async function fetchProfile(username) {
    const res = await axios.get(`https://api.github.com/users/${username}`, {headers});
    return res.data;
}

async function fetchRepos(username) {
  const res = await axios.get(
    `https://api.github.com/users/${username}/repos`,
    { headers }
  );

  return res.data;
}

async function analyzeRepos(repos) {
    let totalStars = 0;
    const totalLanguages = {};
    
    repos.forEach((repo) => {
        totalStars += repo.stargazers_count;

        if(repo.language){
            totalLanguages[repo.language] = (totalLanguages[repo.language] || 0) + 1;
        }
    });

    const topLanguages = Object.keys(totalLanguages).sort((a, b) => totalLanguages[b] - totalLanguages[a])[0] || 'NULL';
    
    return { totalStars, topLanguages };
}

module.exports = {
    fetchProfile,
    fetchRepos,
    analyzeRepos
};