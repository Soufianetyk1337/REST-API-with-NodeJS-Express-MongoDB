
# REST-API-with-NodeJS-Express-MongoDB
Make sure you have 
- Latest version of Docker 

## Run Locally

Clone the project

```bash
  git clone https://github.com/Soufianetyk1337/REST-API-with-NodeJS-Express-MongoDB.git my-project
```

Go to the project directory

```bash
  cd my-project
```
first create a `.env` file and populate it: 
```bash
cp .env_example .env 
```
<!---
generate your own RSA keys using openSSL

 ```bash
  cd src && mkdir keys && cd keys \
  openssl genrsa -out private_key.pem 3072 \
  openssl rsa -in private_key.pem -pubout -out public_key.pem
 ```
-->
get your own API KEY from  https://emailverification.whoisxmlapi.com and paste it in .env file
```bash
EMAIL_VERIFICATION=YOUR_API_KEY
```    
Build the image for the API 

```bash
  make build 
```

Start the server

```bash
  make up 
```


## Features
- Login, logout, and registration
- Email confirmation ("Confirm your email")
- Email Availability
- Password reset ("Forgot password")
- Password confirmation ("Re-enter your password")
- Forgot password
- Rate limiting ("Too many requests")


## API Reference




| Method   |  URI                              | Middleware                         |
| :--------| :------------------------------  | :--------------------------------- |
| `POST`   | `/api/v1/users/register`         | userIsGuest , checkEmailExistence, |
| `POST`   | `/api/v1/users/login`            | userIsGuest , checkEmailExistence, |
| `DELETE` | `/api/v1/users/logout`           |                                    |
| `PATCH`  | `/api/v1/users/password/reset`   | userIsGuest, checkEmailExistence,  |
| `POST`   | `/api/v1/users/password/confirm` | userIsLoggedIn, userIsVerified,    |
| `POST`   | `/api/v1/users/password/verify`  | userIsGuest                        |


## Related

if you faced problems with Nodemailer using gmail account 
u might find this helpful

[Nodemailer with gmail](https://stackoverflow.com/questions/19877246/nodemailer-with-gmail-and-nodejs)

