const neo4j = require('neo4j-driver');
const loggingConfig = {logging: neo4j.logging.console('debug')};
const driver = new neo4j.driver("neo4j://localhost:7687", neo4j.auth.basic("neo4j", "password"), loggingConfig);

export = driver
