To build te complete view run the following command
$ npm run build

To clean all view project
$ npm run clean

To start the node server
$ npm run serve

------------------------------------------------------
Note on Windows use git bash to run the above commands
------------------------------------------------------


++++++++++++++++++++++++
For docker build setup +
++++++++++++++++++++++++

TO BUILD THE DOCKERFILE IMAGE

$docker build -t view .

TO RUN THE IMAGE CONTAINER

$ docker run -t -v ${PWD}:/app -p 8081:8081 view ./dockerbuild.sh

TO RUN INTO CONTAINER SHELL

$ docker run -it -v ${PWD}:/app -p 8081:8081 view bash
