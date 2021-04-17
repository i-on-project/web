# Image version from which we'll build our app.
FROM node:14

ENV OPERATION_MODE="core-data"
ENV CORE_URI="http://172.17.0.1:10023"
ENV CORE_READ_TOKEN="l7kowOOkliu21oXxNpuCyM47u2omkysxb8lv3qEhm5U"

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