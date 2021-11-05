import {db} from './mysql'


const commands = [
    `CREATE TABLE USERS (
        id INT auto_increment PRIMARY KEY,
        email varchar(100),
        password varchar(100)
    )`,
    `CREATE TABLE PROJECTS (
        id INT auto_increment PRIMARY KEY,
        name varchar(50),
        user_id INT,
        active boolean,
        foreign key (user_id) references Users(id)
    );`
]

const run = async () => {
    const session = db.promise()

    try {
        for (let command of commands) {
            console.log(`Command "${command}" executed with result:`)
            try {
                const result = await session.query(command)
                console.log(result)
            } catch (error) {
                console.log(error)
            }
        }
    } catch (error) {
        console.log('Error: ', error)
    } finally {
        await session.end()
    }
    return 'OK'
}

run()

// npx ts-node src/db/mysql-init.ts
