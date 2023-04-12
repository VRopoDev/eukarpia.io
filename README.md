# Welcome to Eukarpia

Eukarpia is a web-based agriculture management system developed with the MERN stack.
This porject created for Birkbeck University of London.

## Running Eukarpia

You can run Eukarpia with the 2 following ways:

### Docker container:

#### `docker-compose up`

Run the command in the parent directory for docker to build and start the Eukarpia container.
Note: Docker needs to be installed on your machine to run this command.
Open [http://localhost:3000](http://localhost:3000) to view Eukarpia in your browser.

### Node:

#### `npm run start`

Run this command in the server direcory.

This will start the Node application of Eukarpia and serve the React build.
Important note: You will need to create a .env file in the server directory with the following values:
MONGO_URL="Your Mongo database URL"
PORT=8080
TOKEN_SECRET="A long String to be used for encryption"
Note: build folder needs to exists in the client directory. (See below for building the Eukarpia client.)
Open [http://localhost:8080](http://localhost:8080) to view Eukarpia in your browser.

## Developing Eukarpia

To customise Eukarpia and start developing follow the steps below:

### `npm run dev`

Run this command in the server direcory.
Before running this command, remove the client references from the index.js file in the server directory.
Note: If you don't, Node will serve the client build if exists.
Important note: You will need to create a .env file in the server directory with the following values:
MONGO_URL="Your Mongo database URL"
PORT=8080
TOKEN_SECRET="A long String to be used for encryption"
If you don't the app will fail to start.

### `npm run start`

After starting the Node application of Eukarpia, run this command in the client direcotry to start the React app.
Open [http://localhost:3000](http://localhost:3000) to view Eukarpia in your browser.
Note: Eukarpia's React app will communicate with the Node application on port 8080.
Important note: You will need to create a .env.local file in the client directory with the following value:
[REACT_APP_BASE_URL=http://localhost:8080/api]

## Deployment

To deploy your Eukarpia insantce with your customisations follow the steps below:

### `npm run build`

Run this command in the client directory to make a production build of your changes in the React app of Eukarpia, if any.
Deploy the entire eukarpia project and make sure to specify the required environment variables.

### `npm run start`

Run this command from the server you deployed, in the server directory. Eukarpia can be accessed in the port you specified in the enviroment variables.
Alternatively, build the docker image by specifing your values in the docker-compose.yml file, and deploy the container.
Eukarpia will run in 3000 port if not changed in the docker settings.

## Learn More

You can learn more in the [Eukarpia documentation](https://bump.sh/vropodev/doc/eukarpia).
