# Docker/Swarm exercise
The result of this exercise is a example enviroment where you have several  services in a Docker swarm. This project was developed using skills learned on [Platzi](https://platzi.com/cursos/docker-swarm/ "Platzi").

The result it's the following enviroment:
[![Diagram](https://raw.githubusercontent.com/pinzon/docker-course-example/master/pictures/diagram.png "Diagram")](https://raw.githubusercontent.com/pinzon/docker-course-example/master/pictures/diagram.png "Diagram")

In this case I used [Play with Docker](https://labs.play-with-docker.com/ "Play with Docker") because it offers free resources for a limited time, enough to do testing.

**Remember to change $repo_image for with the name you want**

1.- Clone this project.
```sh
git clone git@github.com:pinzon/docker-course-example.git
```

2.- Build your image and test it. 
```sh
docker build -t $repo_image .
docker run -it -p 3000:3000 $repo_image
```

3.- Push your image to docker hub.
```sh
docker push $repo_image
```

4.- Create a swarm without using the templates (1 manager and 4 workes).
```sh
#Command to initialize swarm
docker swarm init --advertise-addr eth0

#Command to join worker
docker swarm join --token $token
```

5.- Add a Visualizer to the swarm using a swarm manager. *Visualizer needs the swarm state thats why you must bind the docker.socket to the container and run it from a manager.*
```sh
docker service create -d --name viz -p 8080:8080 --constraint=node.role==manager --mount=type=bind,src=/var/run/docker.sock,dst=/var/run/docker.sock dockersamples/visualizer
```

6.- Start your services.
```sh
docker create service $repo_image --name stack_app1
docker create service $repo_image --name stack_app2
```

7.- Create overlay network to connect services.

```sh
docker network create --driver overlay proxy-net
```

8.- Update each service to 4 replicas, rollout mode and env variable.
```sh
docker service update --replicas 4  --env-add SECRET='Update secret of service 1' --update-parallelism 2 --label-add traefik.port=3000 --network-add proxy-net stack_app1 
docker service update --replicas 4  --env-add SECRET='Update secret of service 2' --update-parallelism 2 --label-add traefik.port=3000 --network-add proxy-net stack_app2 
```

9.- Create the Traefik service. *Traefik also needs the swarm state thats why you must bind the docker.socket to the container and run it from a manager.*
```sh
docker service create --name proxy --constraint=node.role==manager -p 80:80 -p 9090:8080 --mount type=bind,src=/var/run/docker.sock,dst=/var/run/docker.sock --network proxy-net traefik --docker --docker.swarmMode --docker.domain=test-service.com --docker.watch --api
```

10.- Test your environment with curl.
```sh
#In this case Play-with-docker needs the domain but with can still test the access to the services using Curl
$curl -H "Host:stack-app1.test-service.com" http://localhost
$curl -H "Host:stack-app2.test-service.com" http://localhost
```

#### NOTE: Most of this project can be done with a single compose file.