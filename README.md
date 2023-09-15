Creation by Taron Avagyan, Ivan Lee, and Chase Sobey 

Custom implementation of RequestBin development tool done as a Launch School Project during Capstone

# SETUP / INSTALLATION

upon pulling the git repo into your local environment there is some setup required to get
request-bin-ultra up and running. 

run "npm install" to update all dependencies in the project

The first step is to set up your local PostgreSQL database

### POSTGRESQL SETUP
run the following commands from your terminal:

`createdb request-bin-ultra`

`psql -d request-bin-ultra < schema.sql`

This creates a new database that request-bin-ultra will use to store webhook information,
then it sets up the schema for the database


### MONGODB ATLAS SETUP
request-bin-ultra utilizes Atlas cloud database to house the many webhook requests sent to request-bin-ultra and as such, you must set up Atlas cloud for this program to function. Follow the instructions provided by MongoDB Atlas if you dont already have an Atlas account set up.

Sign into your Atlas account and find the connection string to the database you would like to use (you will need the connection string later)


### .ENV SETUP
you must have a .env file for request-bin-ultra to work
that .env file MUST have the following variables present in it:

HOST="localhost" (request-bin-ultra relies on your local psql database so this must be the value of "localhost")

PORT= set this value to any open port on your device

POSTGRES_HOST="localhost" (request-bin-ultra relies on your local psql database so this must be the value of "localhost")

POSTGRES_DB="request-bin-ultra" (this name must be chosen for request-bin-ultra to work)

POSTGRES_USERNAME= set this value equal to the name of the psql user you wish to use ("postgres" is the default user)

POSTGRES_PASSWORD= set this value equal to the password for the psql user you have chosen

ATLAS_URI= set this value to the connection string provided to you by Atlas cloud, see Atlas documentation for where to find the connection string

## HOW TO USE REQUEST BIN ULTRA

At its core, request-bin-ultra is a warehouse for webhook requests. You would create a new bin with the 'Create Bin' button on the home page and then connect any webhooks you wish to listen to to the newly created URL of the bin you just created. That bin will now house and display all the information contained by any http_requests webhooks send to your bin! This provides a convienient place to tail your logs whenever its necessary.

As many bins as you need to logically divide up the webhook communication you wish to listen to can be created and there are buttons to empty any bin or delete an entire bin along with all the data housed by the bin.
