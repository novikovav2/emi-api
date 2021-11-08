import * as dotenv from "dotenv"
import mysql from "mysql2";
import {Sequelize} from "sequelize";

dotenv.config()

export const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
})

export const sequelize = new Sequelize(<string>process.env.MYSQL_DB,
                                        <string>process.env.MYSQL_USER,
                                        <string>process.env.MYSQL_PASS, {
                                        host: process.env.MYSQL_HOST,
                                        dialect: "mysql"
})
