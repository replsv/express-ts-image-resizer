FROM centos:7
RUN yum groupinstall "Development tools" -y
RUN yum install epel-release -y
RUN yum install libevent -y
RUN yum update -y \
    && yum install -y https://centos7.iuscommunity.org/ius-release.rpm \
    && yum install -y python36u python36u-libs python36u-devel python36u-pip \
    && yum install -y which gcc \ 
    && yum install -y openldap-devel  
RUN pip3.6 install pipenv
RUN ln -s /usr/bin/pip3.6 /bin/pip
RUN pip install --upgrade pip
RUN rm /usr/bin/python
RUN ln -s /usr/bin/python3.6 /usr/bin/python
RUN pip install locustio
RUN pip install ipaddress
RUN pip install uuid
RUN pip install pycryptodome
RUN pip install pyquery
RUN CFLAGS='-std=c99' pip install gevent

EXPOSE 8089