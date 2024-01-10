FROM nginx:1.21.5-alpine
#
# The dhparams.pem file defines how OpenSSL performs the Diffie-Hellman (DH)
# key-exchange. I generated this file locally using:
# ---
# openssl dhparam -out dhparam.pem 4096
# ---
#
COPY ../dhparams.pem /etc/ssl/private/

#
# This defines the site configuration for the production nginx.
#
COPY ./default.conf /etc/nginx/conf.d/default.conf