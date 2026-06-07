CREATE TABLE IF NOT EXISTS profiles(
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE,
    name VARCHAR(100),
    avatar_url VARCHAR(255),
    bio TEXT,
    public_repos INT,
    followers INT,
    following INT,
    location VARCHAR(100),
    company VARCHAR(100),
    blog VARCHAR(255),
    github_created_at DATETIME,
    github_updated_at DATETIME,
    total_stars INT,
    top_language VARCHAR(50),
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);