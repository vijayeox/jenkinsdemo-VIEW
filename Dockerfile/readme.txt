++++++++++++++++++++++++
For docker build setup +
++++++++++++++++++++++++

TO BUILD THE DOCKERFILE IMAGE

$ docker build -t view . ; cd ../

TO RUN THE IMAGE CONTAINER

$ docker run -t -v ${PWD}:/app -p 8081:8081 view ./build.sh

TO RUN INTO CONTAINER SHELL

$ docker run -it -v ${PWD}:/app -p 8081:8081 view bash


Note- Use 'sudo' if not previliged USER
