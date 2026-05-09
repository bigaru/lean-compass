import { CalDay, Food } from '@/types'
import { addDaysToDate, CAL_OF_CARB, CAL_OF_FAT, CAL_OF_PROTEIN } from '@/utils'
import * as SQLite from 'expo-sqlite'

const currentMillis = addDaysToDate(0).valueOf()
const pastMillis = addDaysToDate(-1).valueOf()
const oldMillis = addDaysToDate(-2).valueOf()

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
	('past-Sausage', ${pastMillis}, 0, 23, 0, 13, 200 ),
	('old-Mango', ${oldMillis}, 0, 0, 13, 0, 100 ),
	('old-Potato', ${oldMillis}, 0, 0, 16, 2, 2000 ),
	('old-Sausage', ${oldMillis}, 0, 23, 0, 13, 200 )

	;


`)
}

export async function loadAllByDate(dateVal: number) {
	return db!.getAllAsync<Food>(`SELECT * FROM foods WHERE createdAt=${dateVal};`)
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
