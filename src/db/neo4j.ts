const neo4j = require('neo4j-driver');
import * as dotenv from "dotenv"

dotenv.config()
const loggingConfig = {logging: neo4j.logging.console('debug')};

const driver = new neo4j.driver(process.env.NEO4J_URL, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS), loggingConfig);

export = driver
