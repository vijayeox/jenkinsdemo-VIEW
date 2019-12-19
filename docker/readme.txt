++++++++++++++++++++++++
For docker build setup +
++++++++++++++++++++++++

TO BUILD THE DOCKERFILE IMAGE

$ docker build -t view .

THEN GO BACK TO VIEW FOLDER

$ cd ..

TO RUN THE IMAGE CONTAINER

$ docker run -it -v ${PWD}:/app -p 8081:8081 view ./build.sh

TO RUN INTO CONTAINER SHELL

$ docker run -it -v ${PWD}/..:/app -p 8081:8081 view bash


Note- Use 'sudo' if not previliged USER
