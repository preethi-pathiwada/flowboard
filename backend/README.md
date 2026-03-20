install pg
setup backend, start server
setup db..create config inside src and db.js file
create pool containing host, port, username, password, database
create .env file, store jwt secret, port
load dotnev from config --> require("dotenv").config()
create routes, controllers, middleware in src
get a router instance in each file
LEARNING: {mergeParams:true} in Router() means explicitly saying to get the data from params instead of body if we skip any