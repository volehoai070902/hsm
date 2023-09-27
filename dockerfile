# FROM ubuntu:22.04
# WORKDIR /app
# COPY . .
# RUN apt-get update && apt-get -y install gcc
# RUN apt-get -y install libssl-dev
# RUN apt-get update && apt-get -y install make
# RUN apt-get update && apt-get -y install curl
# RUN apt-get update && apt-get -y install opensc-pkcs11
# RUN apt-get update && curl -sL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh && bash nodesource_setup.sh && apt-get -y install nodejs
# RUN apt-get -y install libtool
# RUN apt-get -y install automake
# RUN apt-get -y install build-essential
# RUN apt-get -y install wget
# RUN wget http://dist.opendnssec.org/source/softhsm-2.3.0.tar.gz
# RUN tar -xzf softhsm-2.3.0.tar.gz
# RUN cd /app/softhsm-2.3.0 && ./configure --disable-gost
# RUN cd /app/softhsm-2.3.0 && make
# RUN cd /app/softhsm-2.3.0 && make install
# ENV SOFTHSM2_CONF = /etc/softhsm2.conf
# RUN apt-get --update --no-cache add opensc && \
#     echo "0:/var/lib/softhsm/slot0.db" > /etc/softhsm2.conf && \
#     softhsm2-util --init-token --slot 0 --label key --pin 1234 --so-pin 1234
# # RUN cd /app/softhsm-2.3.0 && ./configure --disable-gost && make
# # RUN cd /app/softhsm-2.3.0 && gmake install
# RUN npm install
# CMD [ "node", "/app/index.js" ]

# FROM ubuntu:22.04
# WORKDIR /app
# COPY . .
# RUN apt-get update && apt-get -y install gcc
# RUN apt-get -y install libssl-dev
# RUN apt-get update && apt-get -y install opensc-pkcs11
# RUN apt-get update && apt-get -y install curl
# RUN apt-get update && curl -sL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh && bash nodesource_setup.sh && apt-get -y install nodejs
# RUN apt-get -y install libtool
# RUN apt-get -y install automake
# RUN apt-get -y install build-essential
# RUN apt-get -y install wget
# ENV SOFTHSM2_CONF = /app/softhsm2.conf
# RUN npm install
# CMD [ "node", "/app/index.js" ]

# FROM alpine:3.8

# ENV SOFTHSM_VERSION=2.5.0
# WORKDIR /app
# COPY . .
# # install build dependencies
# RUN apk --update --no-cache add \
#         alpine-sdk \
#         autoconf \
#         automake \
#         git \
#         libtool \
#         libseccomp-dev \
#         cmake \
#         p11-kit-dev \
#         openssl-dev \
#         stunnel
# ENV PYTHONUNBUFFERED=1
# RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
# RUN python3 -m ensurepip
# RUN pip3 install --no-cache --upgrade pip setuptools
# # build and install
# RUN git clone https://github.com/opendnssec/SoftHSMv2.git /tmp/softhsm2
# WORKDIR /tmp/softhsm2

# RUN git checkout ${SOFTHSM_VERSION} -b ${SOFTHSM_VERSION} \
#     && sh autogen.sh \
#     && ./configure \
#     && make \
#     && make install

# RUN git clone https://github.com/SUNET/pkcs11-proxy /tmp/pkcs11-proxy && \
#     cd /tmp/pkcs11-proxy && \
#     cmake . && make && make install

# RUN rm -fr /tmp/softhsm2 /tmp/pkcs11-proxy
# WORKDIR /root


# # install pkcs11-tool
# RUN apk --update --no-cache add opensc && \
#     echo "0:/var/lib/softhsm/slot0.db" > /etc/softhsm2.conf && \
#     softhsm2-util --init-token --slot 0 --label key --pin 1234 --so-pin 0000

# EXPOSE 5657
# ENV PKCS11_DAEMON_SOCKET="tcp://0.0.0.0:5657"
# CMD [ "/usr/local/bin/pkcs11-daemon", "/usr/local/lib/softhsm/libsofthsm2.so"]
# CMD [ "node", "/app/index.js"]

FROM ubuntu:22.04
RUN apt-get update && apt-get -y install make
RUN apt-get -y install libtool
RUN apt-get -y install automake
RUN apt-get -y install build-essential
RUN apt-get -y install libssl-dev
RUN apt-get update && apt-get -y install gcc
RUN apt-get update && apt-get -y install opensc-pkcs11
RUN apt-get update && apt-get -y install curl
RUN apt-get update && curl -sL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh && bash nodesource_setup.sh && apt-get -y install nodejs
WORKDIR /

COPY softhsm-2.3.0.tar.gz /
RUN tar -xzf softhsm-2.3.0.tar.gz
RUN cd /softhsm-2.3.0 && ./configure --disable-gost && make
RUN cd /softhsm-2.3.0 && make install
ENV export SOFTHSM2_CONF = /etc/softhsm2.conf
RUN softhsm2-util --init-token --slot 0 --label "My token" --pin 1234 --so-pin 1234
WORKDIR /app
COPY . .
CMD ["npm", "start"]