# Good Picks

<img src="./public/images/goodpicks-screenshot.png">

##### Table of Contents

[Description](#description)  
 [Installation](#installation)  
 [Usage](#usage)   
 [Deployed Site](#deployed-site)   
 [Contributions](#contributions)   
 [Project Contributors](#project-contributors)  
 [Pitch Deck](#pitch-deck)  

## Description
Good Picks is a web application designed to help users manage their favorite songs, albums, and artists. It provides a user-friendly interface to organize and retrieve music-related data efficiently.



## Installation
### Clone the repository:
```
git clone https://github.com/dgomie/good-picks.git
```
### Navigate to the project directory:
```
cd good-picks
```

### Install the required dependencies:
```
npm install
```

### Set up the MySQL database:

Create a database named goodpicks_db.
Import the provided SQL file to set up the initial database schema:
```
mysql -u yourusername -p goodpicks_db < db/schema.sql;
```

### Set up a Spotify Web Developer Account:
Sign in to Spotify's web developer site and create up a new app. Spotify instructions can be found here:  

https://developer.spotify.com/documentation/web-api

### Set up environment variables:

Create a .env file in the root directory and add the following:
```
DB_HOST=your_db_host
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=goodpicks_db
CLIENT_ID=your_spotify_client_id
CLIENT_SECRET=your_spotify_client_secret
CALLBACK_URL=your_spotify_callback_url
```

### Optional:  
Seed database with placeholder data using
```
npm run seed
```

## Usage
Start the server:
```
npm start
```

Open your web browser to http://localhost:3001

Create a new account or use placeholder accounts to login to the site. Authorize Goodpicks access to Spotify account. Once authorized the full site will be accessible. 



## Deployed Site
Deployed application can be found at:  
https://hidden-depths-01820-f84c3739770d.herokuapp.com/

## Contributions
### Components and Design Resources

- Navbar: Implemented using components from [Flowbite Navbar](https://flowbite.com/docs/components/navbar/).

- Sign-in Forms: Utilized sign-in forms from [Tailwind UI](https://tailwindui.com/components/application-ui/forms/sign-in-forms).

- Registration Form: Created with blocks from [Flowbite Marketing Register](https://flowbite.com/blocks/marketing/register/).

### Image Credits
### Icons
- Avatar Icon: Sourced from [Iconduck Avatar Default Light](https://iconduck.com/icons/311796/avatar-default-light).

- Material Letter Icons: Sourced from [Iconduck Material Letter Icons](https://iconduck.com/sets/material-letter-icons).

### Code References
- Spotify Authorization Flow: Based on the example provided by [Adan Zweig](https://github.com/adanzweig) in his [node-js-spotify repo](https://github.com/adanzweig/nodejs-spotify/blob/master/index.js).


## Project Contributors
- Kayla Freeman
- Francisco Ortiz
- Wayne Perry
- Daniel Gomez

## Pitch Deck
[Canva Presentation](https://www.canva.com/design/DAGFhzaCXsM/cz4qv5v8KXCvTbWye7vdDQ/view?utm_content=DAGFhzaCXsM&utm_campaign=designshare&utm_medium=link&utm_source=editor)

