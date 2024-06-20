# KuroSora
 Probably yet another messenger...

### Technologies used:
 - [Angular](https://angular.dev/)
 - [Electron](https://www.electronjs.org/)
 - [Electron Builder](https://github.com/electron-userland/electron-builder)
 - [dotenv](https://github.com/motdotla/dotenv)
 - [nodemailer](https://nodemailer.com/)
 - [mysql2/promise](https://github.com/sidorares/node-mysql2)
 - [cryptoJS](https://github.com/sidorares/node-mysql2)
 - [ngx-emoji-mart](https://github.com/scttcper/ngx-emoji-mart)
 - [bootstrap](https://getbootstrap.com/)

 ### Commands to install dependencies:
 ```sh
 npm install
 cd ./frontend
 npm install
 ```

 ### Command to start HTTP server:
 ```sh
 npm run server
 ```

 ### Command to build exe:
 ```sh
 npm run dist
 ```

 ### Create .env file inside root directory.
 #### Copy following text and paste it inside the file:
 ```properties
 NOREPLY_MAIL_PASSWORD = "REPLACE_IT_WITH_YOUR_NOREPLY_MAIL_PASS"
 DB_PASSWORD = "REPLACE_IT_WITH_YOUR_DB_PASS"
 ```