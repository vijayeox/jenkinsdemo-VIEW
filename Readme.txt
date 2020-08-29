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

------------------------------------------------------
Note on Windows use git bash to run the above commands
------------------------------------------------------
