Follow instructions given in the readme files under the specific apps.

To build the complete view run the following command
$ npm run build

To clean all view project
$ npm run clean

To start the node server
$ npm run serve

Incase of client's application development, you will have to serve the view from the docker. 
To build the docker
$ docker build -t view docker/
To start the docker and use it
$ docker run --network="host" -it -v "${PWD}/..:/app" view bash
$ npm run serve
###########################################################################33
------------------------------------------------------
Note on Windows use git bash to run the above commands
------------------------------------------------------


-----------------------------------------
To connect UI with an external api server
-----------------------------------------

Server Side API ports are:-

1) 9080 -- https(SSL) For example http://dev3.eoxvantage.com:8080
2) 8080 -- http(non-SSL) For example https://dev3.eoxvantage.com:9080


Please update the URL for api in the following files.

1) view/bos/src/client/local.js
2) view/bos/src/server/local.js
3) view/bos/src/osjs-server/.env
