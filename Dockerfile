################################################################################
#
# Runs the LCOGT VirtualSky webapp using nginx 
#
#
# Build with
# docker build -t registry.lcogt.net/virtualsky:latest .
#
# Push to Registry with
# docker push registry.lcogt.net/virtualsky:latest
#
# To run with nginx + uwsgi both exposed:
# docker run -d -p 8500:80  -m="64m" --name=virtualsky registry.lcogt.net/virtualsky:latest
#
# See the notes in the code below about NFS mounts.
#
################################################################################
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
