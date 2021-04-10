# Image version from which we'll build our app.
FROM node:14

ENV I_ON_WEB_OPERATION_MODE="mock-data" 
#ENV I_ON_WEB_OPERATION_MODE="core-data" 
ENV CORE_URI="http://localhost:10023"
ENV CORE_READ_TOKEN="l7kowOOkliu21oXxNpuCyM47u2omkysxb8lv3qEhm5U"
ENV CORE_WRITE_TOKEN="hfk0DXJ9LIPuhvrjDEmhYRv5Z0YRhOl1DMEEPIp42ok"

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