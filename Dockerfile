FROM node:18-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

# Dep install
RUN npm install

# Copy source
COPY . .

ENV NODE_ENV production

# Set the base URL build argument
ARG VITE_BASE_URL
ENV VITE_BASE_URL $VITE_BASE_URL

# Set the java Gateway URL build argument
ARG VITE_JAVA_GATEWAY_URL
ENV VITE_JAVA_GATEWAY_URL $VITE_JAVA_GATEWAY_URL

# Set the java API URL build argument
ARG VITE_JAVA_URL
ENV VITE_JAVA_URL $VITE_JAVA_URL

# Build
RUN npm run build


FROM nginx:alpine AS runner

# Copy source
COPY --from=dependencies /app/dist /usr/share/nginx/html

# Set the base URL build argument
ARG VITE_BASE_URL
ENV VITE_BASE_URL $VITE_BASE_URL

# Create nginx conf
RUN echo "server {" >  /etc/nginx/conf.d/default.conf && \
    echo "    listen       80;" >> /etc/nginx/conf.d/default.conf && \
    echo "    listen  [::]:80;" >> /etc/nginx/conf.d/default.conf && \
    echo "    server_name  localhost;" >> /etc/nginx/conf.d/default.conf && \
    echo "    root /usr/share/nginx/html;" >> /etc/nginx/conf.d/default.conf && \
    echo "    location ${VITE_BASE_URL}assets/ {" >> /etc/nginx/conf.d/default.conf && \
    echo "        rewrite ^${VITE_BASE_URL}assets/(.*)$ /assets/\$1 break;" >> /etc/nginx/conf.d/default.conf && \
    echo "        try_files \$uri =404;" >> /etc/nginx/conf.d/default.conf && \
    echo "    }" >> /etc/nginx/conf.d/default.conf && \
    echo "    location / {" >> /etc/nginx/conf.d/default.conf && \
    echo "        try_files \$uri \$uri/ /index.html;" >> /etc/nginx/conf.d/default.conf && \
    echo "    }" >> /etc/nginx/conf.d/default.conf && \
    echo "}" >> /etc/nginx/conf.d/default.conf

EXPOSE 80

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]
