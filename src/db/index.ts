import { CalDay, Food } from '@/types'
import { addDaysToDate } from '@/utils'
import * as SQLite from 'expo-sqlite'
import { insertMockData } from './mock'

//per gram
const CAL_OF_FAT = 9
const CAL_OF_CARB = 4
const CAL_OF_PROTEIN = 4

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

	await insertMockData(db)
}

export async function loadAllByDate(dateVal: number) {
	const sql = `
SELECT
	*,
	ROUND(
		CASE
		WHEN cal != 0 THEN cal * (weight / 100)
		ELSE (${CAL_OF_FAT} * fat + ${CAL_OF_CARB} * carb + ${CAL_OF_PROTEIN} * protein) * (weight / 100)
		END
	) as totalCalories
FROM foods
WHERE createdAt=${dateVal};
`
	return db!.getAllAsync<Food>(sql)
}

export async function remove(foodId: number) {
	return db!.runAsync(`DELETE FROM foods WHERE id=${foodId};`)
}

export async function add(food: Food) {
	const { name, createdAt, cal, fat, carb, protein, weight } = food
	const result = await db!.runAsync(
		`INSERT INTO foods (name, createdAt, cal, fat, carb, protein, weight) VALUES ('${name}',${createdAt},${cal},${fat},${carb},${protein},${weight});`
	)
	return result.lastInsertRowId
}

export async function getLastSeven(page: number) {
	const upperBound = addDaysToDate(page * 7 + 1)
	const lowerBound = addDaysToDate(page * 7 - 6)
	const sql = `
SELECT
	createdAt,
	SUM ((${CAL_OF_FAT} * fat) * (weight / 100)) as fat,
	SUM ((${CAL_OF_CARB} * carb) * (weight / 100)) as carb,
	SUM ((${CAL_OF_PROTEIN} * protein) * (weight / 100)) as protein,
	SUM (
	  CASE
      	WHEN cal != 0 THEN cal * (weight / 100)
      	ELSE (${CAL_OF_FAT} * fat + ${CAL_OF_CARB} * carb + ${CAL_OF_PROTEIN} * protein) * (weight / 100)
	  END
	) as cal
FROM foods
WHERE ${lowerBound.valueOf()} <= createdAt
  AND createdAt < ${upperBound.valueOf()}
GROUP BY createdAt
ORDER BY createdAt ASC;
`
	return db!.getAllAsync<CalDay>(sql)
}
