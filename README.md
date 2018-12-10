# Usage
This is the frontend part of the BaLe application. It is a React application, start that up (in development mode) by running `npm start` from the `bale-frontend/src` directory

Production is managed through docker. To deploy a production build, run this command:
```
docker-compose up -d --build
```

# Pre-requesites
This application requires the backend service to be running, the location of which can be configured in `bale-frontend/src/config.js`

Some React dependencies are needed for the frontend, which can be downloaded by running:
```
npm install
```
