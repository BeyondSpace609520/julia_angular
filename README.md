# Julia

## Start locally (without server)

### Preparations (first time only)

Copy proxy.conf-sample.json to proxy.conf.json and change its contents based on your settings.

```bash
npm run start:local
```
## Start locally with https (without server)

### Preparations (first time only)

Copy proxy.conf-sample.json to proxy.conf.json and change its contents based on your settings.

Add certificate as trusted root certificate to your system
 * On Windows
   1. Launch `mmc`
   2. Choose *File > Add/Remove Snap-ins*
   3. Choose *Certificates*, then *Add*
   4. Choose *Computer Account*
   5. Press *OK*
   6. On the left side find *Certificates (Local machine) > Trusted root certificates > Certificates*
   7. Right click, then select *All Tasks > Import*
   8. Press *Next*, then select the *ssl/localhost.crt* from the project folder, then press *Next* until the final screen says *Finish*
 * On Linux
   * ...to be added
 * On MacOS
   * ...to be added

Add entries to your hosts file:
 * easybooking.host pointing to 127.0.0.1
 * optionally easybooking.dev pointing to your development api server

### Starting the server

```bash
npm run start:localssl
```

The application can be accessed on https://easybooking.host:4200

## Start with remote server

- Login on https://test-eb-3.easy-booking.at/loginScreen/
- Copy `juliaAngularToken` cookie from remote app
- run `npm run start`
- prevent redirection from localhost: add breakpoint to Devtools -> Sources -> Event Listeners Breakpoints -> Load -> load
- set `juliaAngularToken`, `l_id` and `c_id` on localhost

## Build

- for general use: run `npm run build`
- for staging: run `npm run build:staging`
- for production: run `npm run build:prod`

## Deploy

Create .env file in root folder with the text

```
SSH_KEY=<path to private SSH key>
SSH_USER=<username>
SSH_HOST=test-eb-3.easy-booking.at
DEPLOY_TARGET=/var/www/html/testJuliaAngular
```
