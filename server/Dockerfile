# A dockerfile must always start by importing the base image.
# We use the keyword 'FROM' to do that.
# In our example, we want import the node image.
# So we write 'node' for the image name and 'lts-alpine' for the version.
FROM node:lts-alpine

ENV NODE_ENV=production

# Next we create a directory to hold the application code
# inside the image, this will be the working directory for your application:
WORKDIR /usr/my-application-code/
COPY ["package.json", "./prisma/schema.prisma", "./"]

RUN yarn --production

# In order to launch our js code, we must import it into our image.
# We use the keyword 'COPY' to do that.
# The first parameter 'build' is the name of the folder on the host.
# The second parameter '/' is the path where to put the file on the image.
# Here we put the file at the image root folder.
RUN mkdir build
COPY ./build/ ./build/

# Here we expose the port that the js code listens to.
EXPOSE 3456

RUN chown -R node /usr/my-application-code/

USER node

RUN echo && echo Node version: 							&& node --version			&& echo
RUN echo && echo Files in pwd 							&& ls -lh							&& echo
RUN echo && echo Files in ./build 					&& ls -lh ./build/		&& echo
RUN echo && echo Size of pwd 								&& du -sh							&& echo

RUN yarn prisma generate

# We need to define the command to launch when we are going to run the image.
# We use the keyword 'CMD' to do that.
CMD ["yarn", "start:server"]
