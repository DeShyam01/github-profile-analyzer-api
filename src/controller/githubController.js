const pool = require("../config/db");

const {fetchProfile, fetchRepos, analyzeRepos} = require("../services/githubService");

function formatGitHubDate(dateString) {
  if (!dateString) return null;

  return new Date(dateString).toISOString().slice(0, 19).replace('T', ' ');
}

async function getUser(req, res) {
  try {
    const { username } = req.params;

    const profile = await fetchProfile(username);

    const repos = await fetchRepos(username);

    const insights = await analyzeRepos(repos);

    await pool.query(
      `
      INSERT INTO profiles
      (
        username,
        name,
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
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
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
      message: "Profile analyzed successfully",
      username: profile.login,
      name: profile.name,
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
    res.status(500).json({error: err.message,});
  }
}

async function getProfiles(req, res) {
  const [rows] = await pool.query("SELECT * FROM profiles");

  res.json(rows);
}

async function getProfile(req, res) {
  const { username } = req.params;

  const [rows] = await pool.query("SELECT * FROM profiles WHERE username = ?", [
    username,
  ]);

  if (!rows.length) {
    return res.status(404).json({
      message: "Profile not found",
    });
  }

  res.json(rows[0]);
}

module.exports = {
  getUser,
  getProfiles,
  getProfile,
};
