import mysql2, { PoolOptions } from "mysql2/promise";
import fs from "fs";
import path from "path";

const access: PoolOptions = {
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME ?? "github_analyzer",
};

export const pool = mysql2.createPool(access);

export async function initDB(): Promise<void> {
  try {
    const sql = fs.readFileSync(
      path.join(__dirname, "../../schema.sql"),
      "utf8",
    );
    await pool.query(sql);
    console.log("Database initialized successfully");
  } catch (err) {
    console.error("Error initializing database:", err);
  }
}
