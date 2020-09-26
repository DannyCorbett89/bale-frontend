## Pre-requesites
The server running this application needs the following before it will work:
- The [backend](https://github.com/DannyCorbett89/bale) application needs to be running
- Docker and docker-compose need to be installed
# Usage
1. Edit [config.js](src/config.js) to contain the URL of the backend, including the port
   - This must be a publically accessible URL or IP. If this application and the backend are both running on the same server, the internal (`192.168...`) IP will not work as it is the client's browser that makes the request, not the application on the host
2. Run this command: `docker-compose up -d --build`
