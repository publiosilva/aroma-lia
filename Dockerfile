# Stage 1: Rust build
FROM rust:latest as rust-build

WORKDIR /usr/src

# Copy only necessary files for Rust build
COPY ./lib/source-code-parser /usr/src/lib/source-code-parser

WORKDIR /usr/src/lib/source-code-parser/source-code-parser-web

# Build Rust application
RUN cargo build --release

# Stage 2: Node.js build
FROM node:16 as node-build

WORKDIR /usr/src

# Copy only necessary files for Node.js build
COPY package*.json ./
COPY tsconfig.json ./
COPY ./src ./src

# Install dependencies and build frontend
RUN npm install && npm run build

# Stage 3: Final image
FROM debian:bullseye-slim as final

# Install required runtime dependencies
RUN apt-get update && apt-get install -y \
    supervisor && rm -rf /var/lib/apt/lists/*

# Copy built artifacts from Rust build stage
COPY --from=rust-build /usr/src/lib/source-code-parser/target/release/source-code-parser-web /app/source-code-parser-web

# Copy built frontend from Node.js build stage
COPY --from=node-build /usr/src/dist /app/aromalia

# Copy Supervisor configuration
WORKDIR /etc/supervisor
COPY supervisord.conf ./supervisord.conf

# Expose application ports
EXPOSE 8080 3000

# Define default command
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]
