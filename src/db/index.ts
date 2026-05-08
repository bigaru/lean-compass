import { Food } from '@/types'
import { addDaysToDate } from '@/utils'
import * as SQLite from 'expo-sqlite'

const currentMillis = addDaysToDate(0).valueOf()
const pastMillis = addDaysToDate(-1).valueOf()

let db: SQLite.SQLiteDatabase | null = null

export async function init() {
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
`)

	await insertMockData()
}

async function insertMockData() {
	await db!.execAsync(`
INSERT INTO foods (name, createdAt, cal, fat, carb, protein, weight) VALUES
	('Mango', ${currentMillis}, 0, 0, 13, 0, 100 ),
	('Potato', ${currentMillis}, 0, 0, 16, 2, 2000 ),
	('Sausage', ${currentMillis}, 0, 23, 0, 13, 200 ),
	('past-Mango', ${pastMillis}, 0, 0, 13, 0, 100 ),
	('past-Potato', ${pastMillis}, 0, 0, 16, 2, 2000 ),
	('past-Sausage', ${pastMillis}, 0, 23, 0, 13, 200 )

	;


`)
}

export async function loadAllByDate(date: Date) {
	return db!.getAllAsync<Food>(`SELECT * FROM foods WHERE createdAt=${date.valueOf()};`)
}

export async function add(food: Food) {
	const { name, createdAt, cal, fat, carb, protein, weight } = food
	const result = await db!.runAsync(
		`INSERT INTO foods (name, createdAt, cal, fat, carb, protein, weight) VALUES ('${name}',${createdAt},${cal},${fat},${carb},${protein},${weight});`
	)
	return result.lastInsertRowId
}
