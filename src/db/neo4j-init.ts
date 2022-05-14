import driver from './neo4j'



const constraints = [
    'CREATE CONSTRAINT IF NOT EXISTS ROOM_UNIQUE_NAME ON (room:Room) ASSERT room.title IS UNIQUE'
]

const run = async () => {
    const session = driver.session();

    try {
        for (const constraint of constraints) {
            try {
                await session.writeTransaction((tx: any) => {
                    tx.run(constraint)
                    console.log(`Constraint "${constraint}" created`)
                })
            } catch (error) {
                console.log(error)
            }
        }
    } catch (error) {
        console.log(`Constraint failed with error: `, error)
    } finally {
        await session.close()
        await driver.close()
    }
}


run()

// npx ts-node src/db/neo4j-init.ts

// Автоматическая генерация uuid:
// ПОдробности тут: https://neo4j.com/labs/apoc/4.4/graph-updates/uuid/#automatic-uuids
// CREATE CONSTRAINT ON (person:Person)
// ASSERT person.uuid IS UNIQUE

// CALL apoc.uuid.install('Room')
// YIELD label, installed, properties
// RETURN label, installed, properties

