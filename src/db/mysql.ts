import * as dotenv from "dotenv"
import mysql from "mysql2";

dotenv.config()

export const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
})
