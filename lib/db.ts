import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;

  const dbPath = path.join(process.cwd(), 'skillswap.db');
  db = new Database(dbPath);

  // Enable WAL mode for better concurrency
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      avatar TEXT NOT NULL,
      title TEXT,
      location TEXT,
      level INTEGER DEFAULT 1,
      trust_score INTEGER DEFAULT 50,
      credits INTEGER DEFAULT 10,
      bio TEXT,
      is_pro INTEGER DEFAULT 0,
      tags TEXT DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      user_name TEXT NOT NULL,
      avatar TEXT NOT NULL,
      type TEXT NOT NULL,
      distance TEXT,
      image TEXT NOT NULL,
      rating REAL DEFAULT 0,
      lessons INTEGER DEFAULT 0,
      speaks TEXT,
      price INTEGER DEFAULT 1,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      skill TEXT,
      title TEXT,
      partner TEXT,
      "with" TEXT,
      avatar TEXT NOT NULL,
      date TEXT,
      time TEXT NOT NULL,
      status TEXT,
      room_link TEXT,
      meeting_link TEXT,
      rated INTEGER DEFAULT 0,
      rating INTEGER
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      avatar TEXT NOT NULL,
      last_msg TEXT,
      time TEXT,
      unread INTEGER DEFAULT 0,
      status TEXT DEFAULT 'offline',
      skill TEXT
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contact_id INTEGER NOT NULL,
      sender TEXT NOT NULL,
      text TEXT,
      time TEXT,
      type TEXT DEFAULT 'text',
      status TEXT,
      skill_me TEXT,
      skill_them TEXT,
      time_slot TEXT,
      icon TEXT,
      FOREIGN KEY (contact_id) REFERENCES contacts(id)
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT,
      user_name TEXT NOT NULL,
      avatar TEXT NOT NULL,
      image TEXT,
      likes INTEGER DEFAULT 0,
      comments INTEGER DEFAULT 0,
      tag TEXT,
      time TEXT
    );

    CREATE TABLE IF NOT EXISTS community_updates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      time TEXT NOT NULL,
      icon TEXT NOT NULL,
      color TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_name TEXT NOT NULL,
      avatar TEXT NOT NULL,
      rating INTEGER NOT NULL,
      date TEXT NOT NULL,
      text TEXT NOT NULL,
      class TEXT
    );

    CREATE TABLE IF NOT EXISTS similar_experts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      image TEXT NOT NULL,
      lessons INTEGER DEFAULT 0,
      rating REAL DEFAULT 0,
      price TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      content TEXT,
      image TEXT,
      likes INTEGER DEFAULT 0,
      comments INTEGER DEFAULT 0,
      time TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS exchange_feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_name TEXT NOT NULL,
      avatar TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT,
      image TEXT,
      likes INTEGER DEFAULT 0,
      comments INTEGER DEFAULT 0,
      tag TEXT,
      time TEXT,
      skill_me TEXT,
      skill_them TEXT,
      partner TEXT,
      partner_avatar TEXT,
      progress_updates TEXT DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS nfts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      skill_me TEXT NOT NULL,
      skill_them TEXT NOT NULL,
      partner_name TEXT NOT NULL,
      partner_avatar TEXT,
      contribution_me INTEGER NOT NULL,
      contribution_them INTEGER NOT NULL,
      story TEXT,
      created_at TEXT NOT NULL,
      timeline TEXT DEFAULT '[]',
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  return db;
}
