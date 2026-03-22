# Build Stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production Stage
FROM httpd:alpine
# Install Node.js and NPM as requested by the user
RUN apk add --no-cache nodejs npm

# Copy the built files from the build stage to the Apache public directory
COPY --from=build /app/dist/ /usr/local/apache2/htdocs/

# Copy the .htaccess file (already in public/ which is copied to dist/ during build)
# Note: Apache needs to be configured to allow .htaccess (AllowOverride All)
# or we can add the rules directly to httpd.conf
RUN sed -i '/<Directory "\/usr\/local\/apache2\/htdocs">/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /usr/local/apache2/conf/httpd.conf \
    && sed -i 's/#LoadModule rewrite_module/LoadModule rewrite_module/' /usr/local/apache2/conf/httpd.conf

# Expose port 80
EXPOSE 80
