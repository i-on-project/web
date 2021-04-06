# Image version from which we'll build our app.
FROM node:14

# Create a directory to hold the application code inside the image, this will be the working directory for the application
WORKDIR /web

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

CMD [ "node", "i-on-web-server.js" ]