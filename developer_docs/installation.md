# Manual Installation.
Note: The installation steps assume you are using Window or MacOS.

Follow these steps to run in development mode:
1. Fork this repository and [auxify-backend](https://github.com/vulongphan/auxify-backend) into your own GitHub account and clone it to your local computer if you have not already.

2. You need to create an `.env` file in the root directory by first copy the content of `.env.example`
```
$ cp .env.example .env` # for MacOS
$ copy .env.example .env` # for Windows
```

3. You need to update `.env` with your own Spotify credentials and Pusher App credentials that you have created during the installation of [auxify-backend](https://github.com/vulongphan/auxify-backend) 

4. Navigate into the project folder and install all its necessary dependencies with npm.
```
$ cd auxify-frontend
$ npm install
```
or with yarn (recommended)
```
$ cd auxify-frontend
$ yarn install
```

6. Start the development process for the repo by navigating to the repository and run 
```
npm run dev
```