# Project Setup

This project consists of a backend and a frontend. The backend is a Go application, and the frontend is a React application using Vite.

## Prerequisites

- Docker
- Docker Compose

## Backend Setup

### Dockerfile

The backend Dockerfile is located in the project root and is used to build the backend service.


# Use an official Go runtime as a parent image
FROM golang:1.20-alpine

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go.mod and go.sum files
COPY go.mod go.sum ./

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the rest of the application code
COPY . .

# Ensure scripts have execute permissions
RUN chmod +x ./scripts/*.sh

# Build the Go app
RUN go build -o main ./cmd/api/

# Expose port 8080 to the outside world
EXPOSE 8080

# Command to run the migration script and then the executable
CMD ["sh", "-c", "./scripts/migrate.sh && ./main"]



Docker Compose
The docker-compose.yml file is located in the project root and is used to set up the backend services, including PostgreSQL and Redis.

version: "3.8"
services:
  postgres:
    image: postgres:latest
    container_name: postgres-comp
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: gamedb
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
  redis:
    image: redis:latest
    container_name: redis-comp
    ports:
      - "6379:6379"
  backend:
    build: .
    container_name: backend
    ports:
      - "8080:8080"
    depends_on:
      - postgres
      - redis
    environment:
      POSTGRES_CONN_STRING: "postgres://user:password@postgres:5432/gamedb?sslmode=disable"
      REDIS_ADDR: "redis:6379"
volumes:
  postgres-data:



Running the Backend
To build and run the backend services, use the following commands:

docker-compose up --build



This will start the PostgreSQL, Redis, and backend services. The backend service will be accessible at http://localhost:8080.

Frontend Setup
Dockerfile
The frontend Dockerfile is located in the frontend/my-vite-project directory and is used to build the frontend service.



# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy [package.json](http://_vscodecontentref_/0) and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 5173
EXPOSE 5173

# Run the application in development mode
CMD ["npm", "run", "dev"]


Running the Frontend
To build and run the frontend service, use the following commands:

Navigate to the frontend/my-vite-project directory:

cd frontend/my-vite-project


cd frontend/my-vite-project

Build the Docker image:

docker build -t my-vite-project .


Run the Docker container:

docker run -p 5173:5173 my-vite-project

The frontend service will be accessible at http://localhost:5173.

Accessing the Application
Once both the backend and frontend services are running, you can access the application by navigating to http://localhost:5173 in your web browser. The frontend will communicate with the backend service running at http://localhost:8080.

Troubleshooting
Ensure Docker and Docker Compose are installed and running.
Check the logs of the Docker containers for any errors.
Verify that the ports 5173 and 8080 are not being used by other applications.
