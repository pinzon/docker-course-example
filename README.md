# Docker/Swarm sample excercise

## Simple swarm  deployed in play-with-docker with a reverse proxy
Platform to test docker swarms enviroments 

1.- Create a swarm without using the templates (1 manager and 4 workes)
```
#Command to initialize swarm
$docker swarm init --advertise-addr eth0

#Command to join worker
$docker swarm join --token ${token}
```

2.- Add a Visualizer to the swarm using a swarm manager
```
$docker service create -d --name viz -p 8080:8080 --constraint=node.role==manager --mount=type=bind,src=/var/run/docker.sock,dst=/var/run/docker.sock dockersamples/visualizer
```

3.- Copy stack file into node manager ann run it
```
$docker stack deploy --compose-file docker-swarm.yml stack_1
```

4.- Update each service to 4 replicas, rollout mode and env variable
```
$docker service update --replicas 4  --env-add SECRET='Update secret of service 1' --update-parallelism 2 stack_1_app1
$docker service update --replicas 4  --env-add SECRET='Update secret of service 2' --update-parallelism 2 stack_1_app2 
```

TODO:
Installation of reverse proxy traefik


