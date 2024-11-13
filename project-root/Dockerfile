FROM golang:1.20-alpine

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go.mod and go.sum files
COPY go.mod go.sum ./

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
COPY . .

# Ensure scripts have execute permissions
RUN chmod +x ./scripts/*.sh

# Build the Go app
RUN go build -o main ./cmd/api/

# Expose port 8080 to the outside world
EXPOSE 8080

# Command to run the migration script and then the executable
CMD ["sh", "-c", "./scripts/migrate.sh && ./main"]