import * as SQLite from 'expo-sqlite'
import { Food } from './types'

const currentDate = new Date()
currentDate.setHours(0, 0, 0, 0)
const currentMillis = currentDate.getMilliseconds()

let db: SQLite.SQLiteDatabase | null = null

export async function getDB() {
	if (!db) {
		db = await SQLite.openDatabaseAsync('leancompass.db')

		await db.execAsync(`
PRAGMA journal_mode = WAL;
DROP TABLE IF EXISTS foods;

CREATE TABLE IF NOT EXISTS foods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  createdAt INTEGER NOT NULL,
  cal REAL NOT NULL,
  fat REAL NOT NULL,
  carb REAL NOT NULL,
  protein REAL NOT NULL,
  weight REAL NOT NULL
);

INSERT INTO foods (name, createdAt, cal, fat, carb, protein, weight) VALUES
	('Mango', ${currentMillis}, 0, 0, 13, 0, 100 ),
	('Potato', ${currentMillis}, 0, 0, 16, 2, 2000 ),
	('Sausage', ${currentMillis}, 0, 23, 0, 13, 200 );


`)
	}

	return db
}

export async function loadFoods(date: Date) {
	const currentDb = await getDB()
	return currentDb.getAllAsync<Food>(`SELECT * FROM foods WHERE createdAt=${date.getMilliseconds()};`)
}
