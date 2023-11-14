FROM node:lts-alpine
ENV NODE_ENV=deployed
WORKDIR /usr/src/app

# Installing Dependencies
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../

# Copy Application Code
COPY . .

# Expose the port
EXPOSE 3000

# Make applicable for node User
RUN chown -R node /usr/src/app
USER node

# add commands
CMD ["npm", "start"]
