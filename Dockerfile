FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# works but.. not in fargate for w/e reason.
#CMD ["npm", "run", "dev", "--", "--host"]

#copilot said to use this
CMD ["npm", "run", "preview", "--", "--host", "--port", "5173"]
