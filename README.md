# QAService

Questions and Answers service for Project-Greenfield API

# Configuration

Navigate into the project folder, make a .env file and fill in the following paramters:

- PORT (port you will run the node.js server on, NOT the postgres server)
- DBUSERNAME
- DBPASSWORD
- DB (name of database in postgres)
- DBHOST (ip address of host)
- DBPORT (port number of postgres, will default to 5432)
- MAXCLIENTS (max number of clients to pool. optional.)
- LOADERIO (optional, but can use to change a loader.io verification endpoint)
- REDISHOST (connetion protocol for redis. If you use the provided docker-compose, this shouldn't need to be entered)
