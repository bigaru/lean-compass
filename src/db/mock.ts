import { addDaysToDate } from '@/utils'
import * as SQLite from 'expo-sqlite'

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
const randomBool = (proba: number) => Math.random() < proba

export async function insertMockData(db: SQLite.SQLiteDatabase) {
	let sql = `INSERT INTO foods (name, createdAt, cal, fat, carb, protein, weight) VALUES`

	for (const n of [...Array(60).keys()]) {
		const millis = addDaysToDate(-n).valueOf()
		if (randomBool(0.4)) {
			sql += ` ('Mango', ${millis}, 0, 0, 13, 0, ${randomInt(100, 500)} ), `
		}
		if (randomBool(0.8)) {
			sql += ` ('Potato', ${millis}, 0, 0, 16, 2, ${randomInt(100, 500)} ), `
		}
		if (randomBool(0.3)) {
			sql += `('Sausage', ${millis}, 0, 23, 0, 13, ${randomInt(100, 500)} ),`
		}
		if (randomBool(0.5)) {
			sql += `('Zopf', ${millis}, 0, 8, 48, 9.6, ${randomInt(100, 500)} ),`
		}
		if (randomBool(0.8)) {
			sql += `('Spaghetti', ${millis}, 0, 3, 68, 14, ${randomInt(100, 500)} ),`
		}
		if (randomBool(0.8)) {
			sql += `('Gnocchi', ${millis}, 0, 1, 30, 4, ${randomInt(100, 500)} ),`
		}
	}

	const completedSql = sql.slice(0, sql.lastIndexOf(',')) + ';'
	await db.execAsync(completedSql)
}
