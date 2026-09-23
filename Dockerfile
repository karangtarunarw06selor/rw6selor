FROM php:8.4-apache

RUN docker-php-ext-install mysqli pdo_mysql \
    && a2enmod rewrite headers expires

COPY . /var/www/html/

RUN chown -R www-data:www-data /var/www/html

EXPOSE 80
