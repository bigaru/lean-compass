import { addDaysToDate } from '@/utils'
import * as SQLite from 'expo-sqlite'

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
const randomBool = (proba: number) => Math.random() < proba

export async function insertMockData(db: SQLite.SQLiteDatabase) {
	let sql = `INSERT INTO foods (name, createdAt, cal, fat, carb, protein, weight) VALUES`

	const pastN = [...Array(60).keys()].map((i) => -i)
	const futureN = [...Array(3).keys()].slice(1)

	for (const n of [...pastN, ...futureN]) {
		const millis = addDaysToDate(n).valueOf()
		if (randomBool(0.4)) {
			sql += ` ('Mango', ${millis}, 0, 0, 13, 0, ${randomInt(50, 100)} ), `
		}
		if (randomBool(0.7)) {
			sql += ` ('Potato', ${millis}, 0, 0, 16, 2, ${randomInt(300, 400)} ), `
		}
		if (randomBool(0.3)) {
			sql += `('Sausage', ${millis}, 0, 23, 0, 13, ${randomInt(100, 200)} ),`
		}
		if (randomBool(0.4)) {
			sql += `('Zopf', ${millis}, 0, 8, 48, 9.6, ${randomInt(50, 100)} ),`
		}
		if (randomBool(0.7)) {
			sql += `('Spaghetti', ${millis}, 0, 3, 68, 14, ${randomInt(300, 500)} ),`
		}
		if (randomBool(0.4)) {
			sql += `('Gnocchi', ${millis}, 0, 1, 30, 4, ${randomInt(300, 400)} ),`
		}
		if (randomBool(0.3)) {
			sql += `('Feta', ${millis}, 0, 24, 0, 17, ${randomInt(50, 100)} ),`
		}
		if (randomBool(0.2)) {
			sql += `('Camembert', ${millis}, 0, 29, 0, 15, ${randomInt(50, 80)} ),`
		}
		if (randomBool(0.9)) {
			sql += `('Egg', ${millis}, 0, 10, 0, 13, ${randomInt(50, 150)} ),`
		}
		if (randomBool(0.4)) {
			sql += `('Broccoli', ${millis}, 0, 0, 3, 3, ${randomInt(30, 60)} ),`
		}
		if (randomBool(0.7)) {
			sql += `('Apple', ${millis}, 0, 0, 12, 0, ${randomInt(50, 80)} ),`
		}
		if (randomBool(0.6)) {
			sql += `('Poulet', ${millis}, 0, 2, 0, 25, ${randomInt(100, 300)} ),`
		}
	}

	const completedSql = sql.slice(0, sql.lastIndexOf(',')) + ';'
	await db.execAsync(completedSql)
}
