# GitHub Analyzer API

A lightweight Express API that fetches GitHub user data, analyzes repository metrics, and stores profile summaries in a MySQL database.

## Project structure

- `server.js` — Express app entry point
- `src/config/db.js` — MySQL connection and schema initialization
- `src/routes/githubRoutes.js` — API route definitions
- `src/controller/githubController.js` — request handling and DB persistence
- `src/services/githubService.js` — GitHub API calls and repo analysis
- `schema.sql` — database table definition

## Setup instructions

1. Clone repository:

   ```bash
   git clone https://github.com/DeShyam01/github-profile-analyzer.git
   cd github-profile-analyzer
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root with these values:

   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=your_mysql_port
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=github_analyzer
   GITHUB_TOKEN=your_github_token   # optional, improves GitHub rate limits
   ```

4. Start the app:

   ```bash
   npm run start
   ```

5. Confirm the server is running:
   - `http://localhost:3000`

## Database schema

The application initializes the MySQL schema automatically on startup using `schema.sql`.

### `profiles` table

- `id` — INT, primary key, auto-increment
- `username` — VARCHAR(100), unique GitHub login
- `name` — VARCHAR(100)
- `bio` — TEXT
- `public_repos` — INT
- `followers` — INT
- `following` — INT
- `location` — VARCHAR(100)
- `company` — VARCHAR(100)
- `blog` — VARCHAR(255)
- `github_created_at` — DATETIME
- `github_updated_at` — DATETIME
- `total_stars` — INT
- `top_language` — VARCHAR(50)
- `analyzed_at` — TIMESTAMP DEFAULT CURRENT_TIMESTAMP

## API endpoints

| Method | Path                             | Description                                            |
| ------ | -------------------------------- | ------------------------------------------------------ |
| POST   | `/api/github/analyze/:username`  | Fetch and analyze GitHub profile, then persist summary |
| GET    | `/api/github/profiles/`          | List all analyzed profiles                             |
| GET    | `/api/github/profiles/:username` | Retrieve a single analyzed profile                     |

## Testing the API

Use `curl`, Postman, or any HTTP client.

### Analyze a GitHub user

```bash
curl -X POST http://localhost:3000/api/github/analyze/octocat
```

Expected response:

```json
{
  "message": "Profile analyzed successfully",
  "username": "octocat"
}
```

### Get all stored profiles

```bash
curl http://localhost:3000/api/github/profiles/
```

### Get one stored profile

```bash
curl http://localhost:3000/api/github/profiles/octocat
```

## Notes

- The app uses `axios` to fetch GitHub data and `mysql2` for database access.
- `src/config/db.js` reads `schema.sql` on startup and creates the `profiles` table if it does not exist.
- Providing `GITHUB_TOKEN` is recommended for higher GitHub API rate limits.
