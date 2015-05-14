FROM centos:centos7
MAINTAINER Ira W. Snyder <isnyder@lcogt.net>

# install packages
RUN yum -y install epel-release \
        && yum -y install nginx supervisor \
        && yum -y update

# webserver configuration
COPY docker/processes.ini /etc/supervisord.d/processes.ini
COPY docker/nginx/* /etc/nginx/

# nginx on port 80
EXPOSE 80

# run under supervisord
ENTRYPOINT [ "/usr/bin/supervisord", "-n", "-c", "/etc/supervisord.conf" ]

# copy webapp files
COPY . /var/www/html/
