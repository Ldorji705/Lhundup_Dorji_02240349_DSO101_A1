# 🐳 Docker Practical Lab Report
### Based on KodeKloud Docker Labs — Basic Commands & Docker Images
 
**Name:** ______________________  
**Date:** ______________________  
**Platform:** KodeKloud Studio — Docker Labs  
**Lab URL:** https://kodekloud.com/studio/labs/docker
 
---
 
## Table of Contents
 
1. [Introduction](#introduction)
2. [Lab Environment Setup](#lab-environment-setup)
3. [Part 1 — Docker Basic Commands](#part-1--docker-basic-commands)
   - [Checking Docker Version](#1-checking-docker-version)
   - [Pulling an Image](#2-pulling-an-image)
   - [Running a Container](#3-running-a-container)
   - [Listing Containers](#4-listing-containers)
   - [Stopping and Removing Containers](#5-stopping-and-removing-containers)
   - [Running a Container in Detached Mode](#6-running-a-container-in-detached-mode)
   - [Executing Commands Inside a Container](#7-executing-commands-inside-a-container)
   - [Viewing Container Logs](#8-viewing-container-logs)
   - [Inspecting a Container](#9-inspecting-a-container)
4. [Part 2 — Docker Images](#part-2--docker-images)
   - [Listing Images](#1-listing-images)
   - [Pulling a Specific Image Tag](#2-pulling-a-specific-image-tag)
   - [Writing a Dockerfile](#3-writing-a-dockerfile)
   - [Building a Custom Image](#4-building-a-custom-image)
   - [Tagging an Image](#5-tagging-an-image)
   - [Removing an Image](#6-removing-an-image)
   - [Pushing an Image to Docker Hub](#7-pushing-an-image-to-docker-hub)
5. [Summary of Commands](#summary-of-commands)
6. [What I Learned](#what-i-learned)
7. [Conclusion](#conclusion)
---
 
## Introduction
 
This report documents my hands-on experience working through the Docker lab on KodeKloud Studio. The lab is designed to help beginners get comfortable using Docker from the command line — from running your very first container all the way to building and tagging your own custom images.
 
Docker is a platform that lets you package an application and everything it needs (code, libraries, dependencies) into a single unit called a **container**. Containers run the same way on any machine, which solves the classic "but it works on my computer" problem. This makes Docker incredibly useful in real-world development, testing, and deployment workflows.
 
The lab covers two main areas:
- **Basic Docker commands** — how to manage containers
- **Docker images** — how to find, build, and manage images
---
 
## Lab Environment Setup
 
The KodeKloud lab provides a browser-based terminal connected to a Linux machine with Docker already installed. There is nothing to install locally. Once the lab loads, you get a terminal prompt and you can start running Docker commands right away.
 
To confirm Docker is available in the environment, I ran:
 
```bash
docker --version
```
 
This confirmed Docker was ready to use. The lab environment resets after a session ends, so every lab starts fresh — which is actually great for learning because you can practice the same commands repeatedly without worrying about leftover state from a previous session.
 
---
 
## Part 1 — Docker Basic Commands
 
This section covers the core commands for working with Docker containers.
 
---
 
### 1. Checking Docker Version
 
Before doing anything, it is good practice to verify what version of Docker is installed. This helps with debugging and checking compatibility.
 
**Command:**
```bash
docker version
```
 
**Sample Output:**
```
Client: Docker Engine - Community
 Version:           24.0.5
 API version:       1.43
 OS/Arch:           linux/amd64
 
Server: Docker Engine - Community
 Engine:
  Version:          24.0.5
  API version:      1.43 (minimum version 1.12)
```
 
**What I noticed:** Docker has both a client and a server component. The client is the CLI tool you type commands into. The server (also called the Docker daemon) is the background process that actually does the work.
 
---
 
### 2. Pulling an Image
 
Before you can run a container, Docker needs a **base image** to work from. An image is like a template or a snapshot. You download images from Docker Hub, which is the official public registry.
 
**Command:**
```bash
docker pull nginx
```
 
**Sample Output:**
```
Using default tag: latest
latest: Pulling from library/nginx
Digest: sha256:...
Status: Downloaded newer image for nginx:latest
docker.io/library/nginx:latest
```
 
**What I noticed:** When you do not specify a tag, Docker automatically pulls the `latest` tag. Also, Docker downloads images in layers — you can see each layer being pulled separately. This layered design is one of the reasons Docker images are efficient; if two images share the same base layer, Docker only stores that layer once.
 
---
 
### 3. Running a Container
 
Running a container is the most fundamental Docker operation. The `docker run` command creates a new container from an image and starts it.
 
**Command:**
```bash
docker run nginx
```
 
This runs an nginx container but attaches the terminal to it, so it seems to hang. To exit you would press `Ctrl + C`.
 
**Command with interaction:**
```bash
docker run -it ubuntu bash
```
 
This runs an Ubuntu container and opens an interactive bash shell inside it. The `-i` flag keeps STDIN open and `-t` gives you a terminal. Once inside, you are literally inside the container — you can run Linux commands just like a normal Ubuntu machine.
 
**What I noticed:** Running `exit` inside the container stops it. The container only stays alive as long as its main process is running. Once bash exits, the container stops.
 
---
 
### 4. Listing Containers
 
To see what containers are currently running, use:
 
**Command:**
```bash
docker ps
```
 
**Sample Output:**
```
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS         PORTS     NAMES
a3f9c5b12e11   nginx     "/docker-entrypoint.…"   2 minutes ago   Up 2 minutes   80/tcp    eager_tesla
```
 
To also see stopped containers (containers that have exited but have not been removed):
 
**Command:**
```bash
docker ps -a
```
 
**What I noticed:** Every container gets a unique **Container ID** and Docker also assigns a random human-readable name (like `eager_tesla`) if you do not give it one yourself. The `STATUS` column shows whether a container is running or exited, and if exited, the exit code is shown too.
 
---
 
### 5. Stopping and Removing Containers
 
When you are done with a container, you should stop it first, then remove it to free up resources.
 
**Stop a running container:**
```bash
docker stop a3f9c5b12e11
```
 
You can use either the Container ID or the name. You do not need to type the full ID — the first few characters are enough as long as they are unique.
 
**Remove a stopped container:**
```bash
docker rm a3f9c5b12e11
```
 
**Remove all stopped containers at once:**
```bash
docker container prune
```
 
**What I noticed:** Docker does not automatically remove containers when they stop. Stopped containers still take up disk space until you remove them. In production, you often run containers with the `--rm` flag so they auto-delete when they stop.
 
---
 
### 6. Running a Container in Detached Mode
 
Running a container in the foreground ties up your terminal. Most of the time, you want containers to run in the background. The `-d` flag runs the container in **detached mode**.
 
**Command:**
```bash
docker run -d nginx
```
 
**Sample Output:**
```
7f8a3c91b0e2d4a5f6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9
```
 
Docker prints the full container ID and returns you to your prompt immediately. The nginx container is running in the background.
 
**Port mapping:**
```bash
docker run -d -p 8080:80 nginx
```
 
This maps port 8080 on your host machine to port 80 inside the container. Now you can open a browser and go to `http://localhost:8080` to see the nginx welcome page.
 
**What I noticed:** The `-p host_port:container_port` format is something you use constantly in real work. Without port mapping, the container is isolated and you cannot reach the web server from outside.
 
---
 
### 7. Executing Commands Inside a Container
 
Once a container is running in the background, you can still get inside it or run commands in it using `docker exec`.
 
**Open a bash shell inside a running container:**
```bash
docker exec -it 7f8a3c91b0e2 bash
```
 
**Run a single command without entering the shell:**
```bash
docker exec 7f8a3c91b0e2 cat /etc/nginx/nginx.conf
```
 
**What I noticed:** This is extremely useful for debugging. If a container is misbehaving, you can `exec` into it and poke around — check config files, look at running processes, check environment variables, etc. It feels just like SSH-ing into a server.
 
---
 
### 8. Viewing Container Logs
 
Containers write their output to logs. You can read these logs with:
 
**Command:**
```bash
docker logs 7f8a3c91b0e2
```
 
**Follow logs in real time (like `tail -f`):**
```bash
docker logs -f 7f8a3c91b0e2
```
 
**Sample Output (nginx access logs):**
```
/docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
172.17.0.1 - - [21/May/2026:10:22:01 +0000] "GET / HTTP/1.1" 200 615 "-" "curl/7.81.0"
```
 
**What I noticed:** Logs are one of the first places you look when something is not working right. The `-f` flag is really handy when you are watching a service start up and you want to see output as it happens.
 
---
 
### 9. Inspecting a Container
 
For detailed information about a container, use `docker inspect`. This gives you a massive JSON output covering everything from network settings to environment variables to mount points.
 
**Command:**
```bash
docker inspect 7f8a3c91b0e2
```
 
To extract a specific field (for example, the IP address):
```bash
docker inspect --format='{{.NetworkSettings.IPAddress}}' 7f8a3c91b0e2
```
 
**Sample Output:**
```
172.17.0.2
```
 
**What I noticed:** The `inspect` command gives you far more information than `docker ps`. It is particularly useful for finding out the internal IP of a container, its environment variables, and its volume mounts. The `--format` flag uses Go templating syntax, which lets you pull out exactly the field you need.
 
---
 
## Part 2 — Docker Images
 
This section focuses on working with Docker images — how they work, how to manage them, and most importantly, how to build your own.
 
---
 
### 1. Listing Images
 
To see all images currently downloaded on your machine:
 
**Command:**
```bash
docker images
```
 
**Sample Output:**
```
REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
nginx        latest    a6bd71f48f68   2 weeks ago    187MB
ubuntu       latest    bf3dc08bfed0   3 weeks ago    77.9MB
```
 
**What I noticed:** Images have a **Repository** (the name), a **Tag** (the version), and an **Image ID**. The `SIZE` column shows how much disk space each image takes. You want to keep track of this because pulling many images over time can fill up your disk.
 
---
 
### 2. Pulling a Specific Image Tag
 
Instead of always pulling `latest`, it is better practice to pull a specific version so your environment is predictable.
 
**Command:**
```bash
docker pull nginx:1.25
```
 
**Command:**
```bash
docker pull ubuntu:22.04
```
 
**What I noticed:** Tags are just labels that point to a specific image version. The `latest` tag does not always mean the most recent — it is whatever the maintainer decided to label as `latest`. For production work, always pin your images to a specific tag so things do not break when a new version gets released.
 
---
 
### 3. Writing a Dockerfile
 
A **Dockerfile** is a plain text file with instructions that tell Docker how to build a custom image. Think of it as a recipe. Each instruction in the Dockerfile becomes a layer in the final image.
 
Here is a simple example — a custom web page served by nginx:
 
**`Dockerfile`:**
```dockerfile
# Start from the official nginx base image
FROM nginx:1.25
 
# Set a label for documentation
LABEL maintainer="yourname@example.com"
 
# Copy a custom HTML file into the nginx web root
COPY index.html /usr/share/nginx/html/index.html
 
# Expose port 80 so the container can receive web traffic
EXPOSE 80
 
# The default command to run (nginx is already set by the base image)
CMD ["nginx", "-g", "daemon off;"]
```
 
**`index.html`:**
```html
<!DOCTYPE html>
<html>
  <head><title>My Docker App</title></head>
  <body>
    <h1>Hello from my custom Docker container!</h1>
  </body>
</html>
```
 
**Explanation of Dockerfile instructions:**
 
| Instruction | What it does |
|-------------|--------------|
| `FROM`      | Sets the base image. Every Dockerfile must start with this. |
| `LABEL`     | Adds metadata (like author info) to the image. |
| `RUN`       | Runs a shell command during the build process. |
| `COPY`      | Copies files from your local machine into the image. |
| `ADD`       | Similar to COPY but also supports URLs and tar extraction. |
| `WORKDIR`   | Sets the working directory for subsequent instructions. |
| `ENV`       | Sets environment variables inside the image. |
| `EXPOSE`    | Documents which port the container listens on. |
| `CMD`       | The default command to run when the container starts. |
| `ENTRYPOINT`| Like CMD, but harder to override — used for fixed commands. |
 
**What I noticed:** `RUN` runs commands at **build time** (while creating the image). `CMD` runs at **run time** (when starting the container). Getting these confused is a very common beginner mistake.
 
---
 
### 4. Building a Custom Image
 
Once you have a Dockerfile, you build the image using `docker build`.
 
**Command:**
```bash
docker build -t my-nginx-app:1.0 .
```
 
- `-t my-nginx-app:1.0` gives the image a name and tag
- `.` (the dot at the end) tells Docker to look for the Dockerfile in the current directory
**Sample Output:**
```
[+] Building 3.2s (7/7) FINISHED
 => [internal] load build definition from Dockerfile        0.0s
 => [internal] load .dockerignore                           0.0s
 => [1/2] FROM docker.io/library/nginx:1.25                 1.8s
 => [2/2] COPY index.html /usr/share/nginx/html/index.html  0.1s
 => exporting to image                                      0.2s
 => naming to docker.io/library/my-nginx-app:1.0            0.0s
```
 
**Run the newly built image:**
```bash
docker run -d -p 8080:80 my-nginx-app:1.0
```
 
Open `http://localhost:8080` and you will see your custom HTML page.
 
**What I noticed:** Docker builds images layer by layer. If you rebuild the image and nothing changed in a certain layer, Docker reuses the **cached** version of that layer. This makes rebuilds much faster. The order of instructions in your Dockerfile matters — put things that change often (like your app code) near the bottom so Docker can cache the stable layers at the top.
 
---
 
### 5. Tagging an Image
 
You can add or change tags on an existing image using `docker tag`. This is commonly done to prepare an image for pushing to a registry.
 
**Command:**
```bash
docker tag my-nginx-app:1.0 myusername/my-nginx-app:1.0
```
 
**What I noticed:** This does not create a new image — it just adds another name that points to the same image. Think of it like a shortcut or alias. When pushing to Docker Hub, the image name must follow the format `username/repository:tag`.
 
---
 
### 6. Removing an Image
 
To delete an image from your local machine:
 
**Command:**
```bash
docker rmi my-nginx-app:1.0
```
 
**Remove all unused images at once:**
```bash
docker image prune -a
```
 
**What I noticed:** You cannot remove an image if a container (even a stopped one) is still using it. You have to remove the container first, then the image. The error message Docker gives you is pretty clear about this, which is helpful.
 
---
 
### 7. Pushing an Image to Docker Hub
 
Once your image is ready, you can share it by pushing it to Docker Hub (or any other registry).
 
**Step 1 — Log in:**
```bash
docker login
```
Enter your Docker Hub username and password when prompted.
 
**Step 2 — Tag the image with your username:**
```bash
docker tag my-nginx-app:1.0 myusername/my-nginx-app:1.0
```
 
**Step 3 — Push the image:**
```bash
docker push myusername/my-nginx-app:1.0
```
 
**Sample Output:**
```
The push refers to repository [docker.io/myusername/my-nginx-app]
5d3e0b0e5c1f: Pushed
1.0: digest: sha256:abc123... size: 1234
```
 
**What I noticed:** Pushing only uploads the layers that are not already on Docker Hub. If your image is based on `nginx:1.25`, Docker Hub already has those nginx layers — so only your custom layer (the HTML file you copied in) gets uploaded. This makes pushes very fast.
 
---
 
## Summary of Commands
 
Here is a quick-reference cheat sheet of every command covered in this lab:
 
### Container Commands
 
```bash
# Check Docker version
docker version
 
# Run a container
docker run <image>
 
# Run interactively
docker run -it <image> bash
 
# Run in background (detached)
docker run -d <image>
 
# Run with port mapping
docker run -d -p <host_port>:<container_port> <image>
 
# Run with auto-remove on exit
docker run --rm <image>
 
# List running containers
docker ps
 
# List all containers (including stopped)
docker ps -a
 
# Stop a container
docker stop <container_id>
 
# Remove a container
docker rm <container_id>
 
# Remove all stopped containers
docker container prune
 
# Execute a command in a running container
docker exec -it <container_id> bash
 
# View container logs
docker logs <container_id>
 
# Follow logs in real time
docker logs -f <container_id>
 
# Inspect container details
docker inspect <container_id>
```
 
### Image Commands
 
```bash
# Pull an image
docker pull <image>:<tag>
 
# List all local images
docker images
 
# Build an image from a Dockerfile
docker build -t <name>:<tag> .
 
# Tag an image
docker tag <source_image>:<tag> <new_name>:<tag>
 
# Remove an image
docker rmi <image>:<tag>
 
# Remove all unused images
docker image prune -a
 
# Log in to Docker Hub
docker login
 
# Push an image to Docker Hub
docker push <username>/<image>:<tag>
```
 
---
 
## What I Learned
 
Working through this lab gave me a solid practical foundation in Docker. Here are the key takeaways:
 
**1. Containers vs Images**  
An image is a static, read-only template. A container is a live, running instance of an image. You can run many containers from the same image, and each one is isolated from the others.
 
**2. Layers are powerful**  
Docker's layered file system makes builds fast and storage efficient. Understanding how layers work — and ordering your Dockerfile instructions accordingly — is an important optimization skill.
 
**3. Port mapping is essential for networking**  
By default, containers are isolated from the outside world. The `-p` flag bridges that gap. Without it, a web server inside a container is unreachable from your browser.
 
**4. Detached mode is the norm**  
Most real-world containers run in detached mode (`-d`). You then use `docker logs` and `docker exec` to interact with them — not by staying attached to the terminal.
 
**5. Dockerfile instruction order matters**  
Docker caches layers. Putting frequently changed content (like application source code) near the bottom of the Dockerfile and stable dependencies near the top results in much faster rebuilds.
 
**6. Always use specific tags in production**  
Using `latest` is fine for learning, but in any real environment you should always pin your images to a specific tag. This avoids surprises when a new version is published.
 
---
 
## Conclusion
 
This lab provided an excellent hands-on introduction to Docker. By working through real commands in a live terminal environment, I developed confidence that would be hard to get from just reading documentation.
 
The two main areas — basic container commands and image management — are genuinely the foundation of everything Docker-related. Everything more advanced, whether it is Docker Compose, Kubernetes, CI/CD pipelines, or cloud deployments, builds directly on top of these skills.
 
The most important thing I took away from this lab is the mental model: **images are blueprints, containers are running instances**. Once that clicks, the rest of Docker starts to make a lot of intuitive sense.
 
Next steps from here would be to explore **Docker Compose** (for running multi-container applications with a single file), **Docker volumes** (for persistent storage), and **Docker networking** (for communication between containers).
 
---
 
*Report completed on the KodeKloud Studio Docker Lab*  
*Platform: https://kodekloud.com/studio/labs/docker*