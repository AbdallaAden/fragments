# A Dockerfile defines a set of instructions used by the Docker Engine to create a Docker Image. This Docker Image can be used to create a running Docker Container

#Every Dockerfile must begin with a FROM instruction. This specifies the parent (or base) image to use as a starting point for our own image
FROM node:18.13.0

#Some metadata about the image. The LABEL instruction adds key=value pairs with arbitrary metadata about your image.
LABEL maintainer="Abdalla Aden <aaaden1@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into the working dir (/app)
COPY package*.json ./

# Install node dependencies defined in package-lock.json
RUN npm install

# Copy src to /app/src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Start the container by running our server
CMD npm start

# We run our service on port 8080
EXPOSE 8080
