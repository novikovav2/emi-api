import {User} from "../models/user";
import {Token} from "../models/token";

const run = async () => {
    try {
        console.log('Creating Users table...')
        await User.sync({force: true})

        console.log('Creating Token table...')
        await Token.sync({force: true})
    } catch (e) {
        console.log(e)
    }
}
run()

// npx ts-node src/db/mysql-setupDB.ts
