# Docker/Swarm exercise

## Simple swarm  deployed in play-with-docker with a reverse proxy
Platform to test docker swarms enviroments 
https://platzi.com/cursos/docker-swarm/
1.- Create a swarm without using the templates (1 manager and 4 workes)
```
#Command to initialize swarm
$docker swarm init --advertise-addr eth0

#Command to join worker
$docker swarm join --token ${token}
```

2.- Add a Visualizer to the swarm using a swarm manager
```
#visualizer needs the swarm state thats why you must bind the docker.socket to the container and run it from a manager
$docker service create -d --name viz -p 8080:8080 --constraint=node.role==manager --mount=type=bind,src=/var/run/docker.sock,dst=/var/run/docker.sock dockersamples/visualizer
```

3.- Copy stack file into node manager ann run it
```
$docker stack deploy --compose-file docker-swarm.yml stack
```

4.- Create overlay network to connect services

```
$docker network create --driver overlay proxy-net
```

5.- Update each service to 4 replicas, rollout mode and env variable
```
$docker service update --replicas 4  --env-add SECRET='Update secret of service 1' --update-parallelism 2 --label-add traefik.port=3000 --network-add proxy-net stack_app1 
$docker service update --replicas 4  --env-add SECRET='Update secret of service 2' --update-parallelism 2 --label-add traefik.port=3000 --network-add proxy-net stack_app2 
```

6.- Create Traefik service
```
#Traefik also needs the swarm state thats why you must bind the docker.socket to the container and run it from a manager
$docker service create --name proxy --constraint=node.role==manager -p 80:80 -p 9090:8080 --mount type=bind,src=/var/run/docker.sock,dst=/var/run/docker.sock --network proxy-net traefik --docker --docker.swarmMode --docker.domain=test-service.com --docker.watch --api
```

7.- Test with curl
```
#In this case Play-with-docker needs the domain but with can still test the access to the services using Curl
$curl -H "Host:stack-app1.test-service.com" http://localhost
$curl -H "Host:stack-app2.test-service.com" http://localhost
```





