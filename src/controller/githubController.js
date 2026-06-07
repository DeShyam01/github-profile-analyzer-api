const pool = require("../config/db");

const {fetchProfile, fetchRepos, analyzeRepos} = require("../services/githubService");

function formatGitHubDate(dateString) {
  if (!dateString) return null;

  return new Date(dateString).toISOString().slice(0, 19).replace('T', ' ');
}

async function getUser(req, res) {
  try {
    const { username } = req.params;

    if(!username){
      return res.status(400).json({message: "Username is required"});
    }

    const profile = await fetchProfile(username);
    const repos = await fetchRepos(username);
    const insights = await analyzeRepos(repos);

    const [results, field] = await pool.query(
      `
      INSERT INTO profiles
      (
        username,
        name,
        avatar_url,
        bio,
        public_repos,
        followers,
        following,
        location,
        company,
        blog,
        github_created_at,
        github_updated_at,
        total_stars,
        top_language
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        avatar_url = VALUES(avatar_url),
        bio = VALUES(bio),
        public_repos = VALUES(public_repos),
        followers = VALUES(followers),
        following = VALUES(following),
        location = VALUES(location),
        company = VALUES(company),
        blog = VALUES(blog),
        github_created_at = VALUES(github_created_at),
        github_updated_at = VALUES(github_updated_at),
        total_stars = VALUES(total_stars),
        top_language = VALUES(top_language)
      `,
      [
        profile.login,
        profile.name,
        profile.avatar_url,
        profile.bio,
        profile.public_repos,
        profile.followers,
        profile.following,
        profile.location,
        profile.company,
        profile.blog,
        formatGitHubDate(profile.created_at),
        formatGitHubDate(profile.updated_at),
        insights.totalStars,
        insights.topLanguages
      ],
    );

    res.status(201).json({
      username: profile.login,
      name: profile.name,
      avatar_url: profile.avatar_url,
      bio: profile.bio,
      public_repos: profile.public_repos,
      followers: profile.followers,
      following: profile.following,
      location: profile.location,
      company: profile.company,
      blog: profile.blog,
      github_created_at: formatGitHubDate(profile.created_at),
      github_updated_at: formatGitHubDate(profile.updated_at),
      total_stars: insights.totalStars,
      top_language: insights.topLanguages
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err.message});
  }
}

async function getProfiles(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM profiles");

    res.status(200).json(rows);
  } catch (e) {
    res.status(500).json({message: e.message});
  }
}

async function getProfile(req, res) {
  const { username } = req.params;

  if(!username){
    return res.status(400).json({message: "Username is required"})
  }

  const [rows] = await pool.query("SELECT * FROM profiles WHERE username = ?", [
    username,
  ]);

  if (!rows.length) {
    return res.status(404).json({ message: "Profile not found", });
  }

  res.json(rows[0]);
}

module.exports = {
  getUser,
  getProfiles,
  getProfile,
};
