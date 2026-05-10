# DSO101 - Continuous Integration and Continuous Deployment
## Lhundup Dorji | Student ID: 02240349 | Bachelor of Engineering in Software Engineering

---

## Overview

This report documents the work completed across Assignments 1, 2, and 3 for the DSO101 module on Continuous Integration and Continuous Deployment. Throughout these assignments, I built a full stack to-do list web application and progressively automated its build, testing, and deployment using industry standard DevOps tools including Docker, Jenkins, GitHub Actions, and Render.com.

### Live Links
- Frontend: https://fe-todo-02240349.onrender.com
- Backend: https://be-todo-02240349.onrender.com
- GitHub Repository: https://github.com/Ldorji705/Lhundup_Dorji_02240349_DSO101_A1

---

## Assignment 1 - Docker and Render Deployment

### Objective
The goal of this assignment was to containerize a full stack Node.js application and deploy it to Render.com using Docker images.

### Application Overview
I built a to-do list application with a Node.js and Express backend, a Vite and React frontend, and a PostgreSQL database hosted on Render. The application supports full CRUD operations, allowing users to add, edit, delete, and complete tasks.

### Steps Taken

**Step 1: Building the Application**
I created the backend using Node.js and Express with PostgreSQL as the database. The backend exposes REST API endpoints at `/tasks` for GET, POST, PUT, and DELETE operations. The frontend was built using Vite and React, communicating with the backend through environment variables.

**Step 2: Dockerizing the Application**
I created separate Dockerfiles for the frontend and backend. The backend Dockerfile uses `node:18-alpine` as the base image and exposes port 5000. The frontend Dockerfile uses a multi-stage build, first building the Vite app with `node:20-alpine` and then serving the static files using Nginx on port 80.

**Step 3: Pushing to DockerHub**
I built and pushed both images to DockerHub using the following commands with my student ID as the image tag:

```bash
docker buildx build --platform linux/amd64 -t ldorji705/be-todo:02240349 --push .
docker buildx build --platform linux/amd64 -t ldorji705/fe-todo:02240349 --push .
```

**Step 4: Deploying on Render**
I created a PostgreSQL database on Render and used the connection credentials as environment variables for the backend service. I deployed the backend and frontend as separate Web Services on Render using the existing Docker images from DockerHub.

**Step 5: render.yaml for Automated Deployment (Part B)**
I created a `render.yaml` file in the repository root to define both services as a Blueprint, enabling automated deployment directly from the GitHub repository whenever a new commit is pushed.

### Challenges Faced
- The Docker images were initially built for Mac's ARM architecture. Render requires `linux/amd64` so I had to use the `--platform linux/amd64` flag.
- Vite requires Node.js version 20 or higher so the frontend Dockerfile had to use `node:20-alpine` instead of `node:18-alpine`.
- The `VITE_API_URL` environment variable was not being picked up during the Docker build because Vite bakes environment variables at compile time. I fixed this by passing it as a build argument using `--build-arg`.
- The frontend was initially showing a 404 error because it needed an `nginx.conf` file to handle client-side routing.

### Learning Outcomes
- How to write Dockerfiles for both frontend and backend applications
- How to build and push multi-platform Docker images to DockerHub
- How to deploy containerized applications on Render.com
- How to manage environment variables securely in production
- How to configure a PostgreSQL database on Render and connect it to a backend service

---
### Frontend Deployed From Render.
![alt text](<images /Screenshot 2026-05-10 at 12.21.32 AM.png>)
### DockerHub
![alt text](<images /Screenshot 2026-05-10 at 12.22.29 AM.png>)
### Render Web services
![alt text](<images /Screenshot 2026-05-10 at 12.21.40 AM.png>)
## Assignment 2 - Jenkins CI/CD Pipeline

### Objective
The goal of this assignment was to configure a Jenkins pipeline to automate the build, test, and deployment of the to-do list application from Assignment 1.

### Steps Taken

**Step 1: Installing and Configuring Jenkins**
I installed Jenkins on my local machine using Homebrew and accessed it at `http://localhost:8080`. I installed the required plugins including NodeJS Plugin, Pipeline, GitHub Integration, and Docker Pipeline.

**Step 2: Configuring Node.js in Jenkins**
I went to Manage Jenkins, then Tools, and added a NodeJS installation named `to-do-list` with Node.js LTS version 20.

**Step 3: Adding GitHub Credentials**
I generated a Personal Access Token from GitHub with `repo` and `admin:repo_hook` permissions and added it to Jenkins as a Username and Password credential with the ID `github-creds`.

**Step 4: Writing the Jenkinsfile**
I created a Jenkinsfile in the root of the repository with six stages: Checkout, Install Backend, Install Frontend, Build Frontend, Test Backend, and Deploy. The Deploy stage uses curl to trigger Render deploy webhooks instead of Docker commands, which avoided compatibility issues on Mac.

**Step 5: Setting Up Jest Tests**
I installed Jest and jest-junit in the backend and created a test file at `Backend/tests/tasks.test.js` with three unit tests. I updated the test script in `package.json` to generate JUnit reports for Jenkins to parse.

**Step 6: Running the Pipeline**
I created a new Pipeline item in Jenkins, configured it to read the Jenkinsfile from the GitHub repository using SCM, and ran the pipeline successfully with all six stages passing.

### Jenkinsfile Pipeline Stages
```groovy
pipeline {
    agent any
    tools {
        nodejs 'to-do-list'
    }
    stages {
        stage('Checkout') { ... }
        stage('Install Backend') { ... }
        stage('Install Frontend') { ... }
        stage('Build Frontend') { ... }
        stage('Test Backend') { ... }
        stage('Deploy') { ... }
    }
}
```

### Challenges Faced
- The NodeJS tool name in the Jenkinsfile did not match the name configured in Jenkins Tools, causing the pipeline to fail. I fixed this by matching the name exactly.
- The Docker plugin did not work correctly on Mac, showing a `MissingPropertyException` error. I replaced the Docker deploy stage with curl commands to trigger Render webhooks instead.
- Jest could not parse ES module syntax initially. I resolved this by using `node --experimental-vm-modules` in the test script.

### Pipeline Results
All six stages completed successfully:
- Checkout ✅
- Install Backend ✅
- Install Frontend ✅
- Build Frontend ✅
- Test Backend ✅ (3 tests passed)
- Deploy ✅

### Learning Outcomes
- How to install and configure Jenkins on a local machine
- How to write a multi-stage Jenkinsfile for a full stack application
- How to integrate Jest unit tests into a Jenkins pipeline
- How to publish JUnit test reports in Jenkins
- How to trigger remote deployments using webhooks from a Jenkins pipeline

---
### Jeankins Piplines
![alt text](<images /Screenshot 2026-05-10 at 12.31.23 AM.png>)

## Assignment 3 - GitHub Actions CI/CD

### Objective
The goal of this assignment was to configure a GitHub Actions workflow to automatically build Docker images, push them to DockerHub, and deploy the application on Render whenever code is pushed to the main branch.

### Steps Taken

**Step 1: Verifying Repository Setup**
I confirmed the GitHub repository was public and that both frontend and backend had the correct Dockerfiles and package.json scripts.

**Step 2: Creating GitHub Secrets**
I added four secrets to the GitHub repository: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `RENDER_DEPLOY_HOOK_BACKEND`, and `RENDER_DEPLOY_HOOK_FRONTEND`. The DockerHub token was generated from DockerHub Account Settings with Read, Write, and Delete permissions.

**Step 3: Creating the Workflow File**
I created `.github/workflows/deploy.yml` with six steps: checking out the repository, logging into DockerHub, building and pushing the backend image, building and pushing the frontend image with the backend URL as a build argument, and triggering both Render deploy webhooks.

```yaml
name: Build and Deploy
on:
  push:
    branches: ["main"]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Login to DockerHub
        uses: docker/login-action@v3
      - name: Build and Push Backend Image
        run: docker build & push ...
      - name: Build and Push Frontend Image
        run: docker build & push ...
      - name: Trigger Backend Deployment
        run: curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK_BACKEND }}
      - name: Trigger Frontend Deployment
        run: curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK_FRONTEND }}
```

**Step 4: Testing the Workflow**
I pushed the workflow file to GitHub which automatically triggered the Actions run. After fixing the folder name casing issue and the DockerHub token permissions, the workflow completed successfully.

### Challenges Faced
- The folder names in the repository were `Backend` and `Frontend` with capital letters but the workflow file referenced `./backend` and `./frontend` in lowercase, causing a path not found error. I fixed this by updating the workflow to use the correct capitalised names.
- The initial DockerHub token only had Read permissions. The push failed with an `insufficient scopes` error so I generated a new token with Read, Write, and Delete permissions.

### Workflow Results
All steps completed successfully:
- Checkout Repository ✅
- Login to DockerHub ✅
- Build and Push Backend Image ✅
- Build and Push Frontend Image ✅
- Trigger Backend Deployment ✅
- Trigger Frontend Deployment ✅

### Learning Outcomes
- How to create and configure GitHub Actions workflows
- How to securely store credentials using GitHub Secrets
- How to automate Docker image builds and pushes in a CI/CD pipeline
- How to trigger Render deployments automatically via webhooks
- How to debug and fix workflow errors from GitHub Actions logs

---
### GitHub Secrets
![alt text](<images /Screenshot 2026-05-10 at 12.33.56 AM.png>)

### Git Action 
![alt text](<images /Screenshot 2026-05-10 at 12.33.13 AM.png>)
## Overall Learning Outcomes

Working through these three assignments gave me practical experience with the core tools and concepts used in modern DevOps workflows. I learned how to containerize applications using Docker and manage multi-platform builds, how to set up automated CI/CD pipelines using both Jenkins and GitHub Actions, and how to deploy and manage cloud services on Render. I also gained experience writing unit tests and integrating them into automated pipelines so that code is tested before every deployment. The biggest takeaway was understanding how each tool fits into the larger DevOps workflow and how automation reduces the risk of human error in the deployment process.