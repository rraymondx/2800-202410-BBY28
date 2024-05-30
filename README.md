## 1. About Us
Team Name: BBY-28
Project Name: DisaterNot
Team Members: 
- Raymond Xie
- Lucas Lavioeltte
- Beck Harper
- Pouyan Norouzi Iranzadeh	
- Abdullah Durrani
## 2. Project Description
BBY-28 is developing a web application, DisasterNot, to help people who are worried about how to prepare for a natural disaster, using AI to predict the damages of disasters before they happen
## 3. Technology Used
### Front-end:
- HTML
- CSS
- EJS
- Bootstrap
### Back-end:
- Javascript
- Jquery
- Nodejs
    - Express
    - Nodemailer
    - DotENV
    - EJS
    - Joi
- Mongodb
- OpenAI
- Axios
- Cloudinary
## 4. Contents of Folder
```
├── index.js # The server side code of the app
├── modules 
│   ├── authentication.js # Some server side scripts verifying login and signup and stoing it in the database
│   ├── database.js # Server side script for creating a connection to our Mongodb database
│   └── utils.js # Includes a function called include that helps with require importing packages
├── package.json # Json file including node packege dependencies and project info
├── .gitignore # File making sure some things are not pushed to our repo
├── public
│   ├── audio # sound effects for disaster page easter eggs
│   │   ├── avalanche.mp3 
│   │   ├── earthquake.mp3
│   │   ├── flood.mp3
│   │   ├── thunder.mp3
│   │   ├── tornado.mp3
│   │   ├── tsunami.mp3
│   │   └── wildfire.mp3
│   ├── css # Styles for different pages on our pages
│   │   ├── 404.css
│   │   ├── avalanche.css
│   │   ├── checklist.css
│   │   ├── contacts.css
│   │   ├── disasterList.css
│   │   ├── earthquake.css
│   │   ├── flood.css
│   │   ├── forgot-password.css
│   │   ├── index.css
│   │   ├── landing.css
│   │   ├── login.css
│   │   ├── profile.css
│   │   ├── reset-password.css
│   │   ├── signup.css
│   │   ├── smartAI.css
│   │   ├── storm.css
│   │   ├── style.css # General style of the websites pages
│   │   ├── tornado.css
│   │   ├── tsunami.css
│   │   ├── volunteer.css
│   │   └── wildfire.css
│   └── img # Images used around our website
│   	├── a.png # Avalanche picture
│   	├── bot-icon.png # Bot icon for our chatbot page 
│   	├── checklist.png # Picture of checklist for our home page
│   	├── DisasterNOT-Icon.jpeg # our apps icon as jpeg
│   	├── disrel.jpg 
│   	├── earthquake.jpg # Picture of earthquake for our earthquake disaster page
│   	├── ems.jpg 
│   	├── favicon.ico # Our websites favicon
│   	├── flood.webp # Picture of flood for our flood disaster page
│   	├── fl.png 
│   	├── icon.png # our apps icon as png with transparent background to use in landing page
│   	├── search.jpg 
│   	├── StJohns.jpg
│   	├── storm.png # Picture of storm for our storm disaster page
│   	├── tornado.jpg # Picture of tornado for our tornado disaster page
│   	├── tsunami.png # Picture of tsunami for our tsunami disaster page
│   	├── user-icon.png # User icon for our chatbot page 
│   	└── wildfire.jpg # Picture of wildfire for our wildfire disaster page
├── README.md # Readme file which is the current file you are reading!
├── scripts # Client side JS scripts
│   ├── avalancheEffect.js # Script for avalanche page easter egg
│   ├── checklist.js # Script for checklist page and saving the checklist to the database
│   ├── earthquake.js # Script for avalanche page easter egg
│   ├── flood.js # Script for avalanche page easter egg
	├──	predictButton.js # Script for the predict damage button on the bottom of the disaster pages
│   ├── profile.js # Script for saving profile page changes
│   ├── script.js # Script for go back button
│   ├── smartAI.js # Script for interactions with the chatbot and sending the request to OpenAI API
│   ├── stormEffect.js # Script for storm page easter egg
│   ├── tornado.js # Script for tornado page easter egg
│   ├── tsunami.js # Script for tsunami page easter egg
│   └── wildfire.js # Script for wildfire page easter egg
└── views
	├── 404.ejs # Page for when the result user wants could not be found
	├── checklist.ejs # Page for checklist for important supply to have to be ready for natural disasters that saves to the database
	├── contacts.ejs # Page for important numbers for natural disasters
	├── disasterList.ejs # The list of disaster pages
	├── disasters # Pages with information about natural disasters
	│   ├── avalanche.ejs
	│   ├── earthquake.ejs
	│   ├── flood.ejs
	│   ├── storm.ejs
	│   ├── tornado.ejs
	│   ├── tsunami.ejs
	│   └── wildfire.ejs
	├── error.ejs # Page to show what went wrong disaplaying an error
	├── forgotPassword.ejs # Page for users who have forgotten their password to put in their email in order to reset it
	├── home.ejs # The home page
	├── landing.ejs # The landing page for users who have not logged in
	├── login.ejs # The login page
	├── profile.ejs # Page for users to update their information like name email and profile picture
	├── resetPassword.ejs # Page for users to enter their new password
	├── signup.ejs # Signup page
	├── smartAI.ejs # Page for users to interact with our SmartAI
	├── templates 
	│   ├── footer.ejs # Sticky footer with helpfule nav links
	│   ├── headerAfterLogin.ejs # The header after the user has been authenticated
	│   ├── headerBeforeLogin.ejs # The header before the user has been authencticated
	│   └── header.ejs # Header of the application with important links
	└── volunteer.ejs # Page with informtion about volunteering page
```
## 5. How to run project
1. Download the project to your device
2. Install nodejs from this [link](https://nodejs.org/en/download/prebuilt-installer) 
3. Install dependencies
	- go to where you have the project files
	- open terminal in that location
	- run the command: npm i
4. get .env file set up
	- change the name of sample.env file to just .env
	- fill the different fields with your own valid values
		- PORT is the port you want the app to run on (ex: 3000)
		- MONGODB_HOST is the last part of the mongodb uri (ex: clusterName.stuff.mongodb.net)
		- MONGODB_USER is the name of the mongodb user (ex: fredTheDatabaseUser)
		- MONGODB_PASSWORD is the password of the mongodb user (ex: password, but preferably not)
		- MONGODB_DATABASE is the name of the database you want the info to be stored in (ex: disasterNot)
		- MONGODB_SESSION_SECRET is a random guid genrated by a random guid generator (duh!) like https://guidgenerator.com/ (ex: ce1f9d63-283c-4aaf-9112-e400a44db8ab)
		- NODE_SESSION_SECRET is another random guid 
		- NODEMAILER_USER is the gmail that you use to send reset password emails (ex: disasternotresetpass@gmail.com)
		- OAUTH_CLIENT_ID  is the client id for google api oauth if you are using gmail could be aquired from https://console.cloud.google.com/apis/credentials?authuser=4&project=disasternot&supportedpurview=project (ex: randomNumbers-randomLetters.apps.googleusercontent.com)
		- OAUTH_CLIENT_SECRET is the client secret from the link above (ex: GOCSPX-moreStuff)
		- OAUTH_REFRESH_TOKEN is the token used to refresh access tokens when they run out of time. get it from [here](https://developers.google.com/oauthplayground/) set the scope to https://mail.google.com/ (ex: 1//04bVXgZGJRL5ECgYIARAAGAQSNwF-moreStuff)
		- OAUTH_ACCESS_TOKEN is the access token used to access the gmail api
		- OPEN_AI_KEY your OpenAI API key (ex: sk-proj-moreStuff)
		- CLOUDINARY_CLOUD_NAME is your cloud name form cloudinary get it from [here](https://cloudinary.com/users/login)
		- CLOUDINARY_CLOUD_KEY is the key for that cloud
		- CLOUDINARY_CLOUD_SECRET is the secret for that cloud
5. You should be done.
To find our test logs, click here. https://docs.google.com/spreadsheets/d/16QcdfLTzWcYJ8Do98CWHG2VD5uJnFOizjR9DY9lrKBI/edit#gid=345362433
 
## 6. How to use Product
After creating an account and logging in, you can access our features from the home page. We have a list of 7 natural disasters with information on how to be prepared in the event of one. We also have an AI chatbot that you can ask any questions you have about disasters. There is a checklist for supplies that you would need during a disaster that you can keep track of, a volunteer page that links to volunteering sites, and a profile page that you can customize.
## 7. Credits, References, and Licences 

Libraries and Frameworks
Node.js: JavaScript runtime used for building the back-end server.
Express: Web framework for Node.js used to build APIs and handle routing.
Nodemailer: Module for Node.js applications to send emails.
DotENV: Module for loading environment variables from a .env file.
EJS: Embedded JavaScript templating engine used for rendering HTML.
Joi: Data validation library for JavaScript.
Mongodb: NoSQL database used for data storage.
Axios: Promise-based HTTP client for making requests.
Cloudinary: Cloud-based service for managing and delivering media assets.
Tools and Services
OpenAI API: Used for integrating AI chatbot functionalities.
Bootstrap: Front-end framework for developing responsive and mobile-first websites.
Google OAuth: For authentication and authorization.
Guidgenerator.com: For generating random GUIDs for session secrets.
External Resources
Node.js Documentation: For understanding and implementing Node.js functionalities.
Express Documentation: For guidance on using Express framework.
Nodemailer Documentation: For setting up email functionalities.
DotENV Documentation: For managing environment variables.
Joi Documentation: For implementing data validation.
MongoDB Documentation: For database setup and queries.
OpenAI API Documentation: For integrating AI capabilities.
Axios Documentation: For making HTTP requests.
Cloudinary Documentation: For managing media assets.
Bootstrap Documentation: For front-end styling and responsive design.
Google OAuth Documentation: For implementing OAuth authentication.

## 8. AI use
- We used OpenAI API for our chatbot called smartAI.

- Most of us ended up using it for some styling suggestions for our css files. For instance, our fancy “Predic the Damage” buttons were styled with help from AI. We also used AI to debug certain parts of code that we could not figure out such as playing a sound when an image is clicked. It also made messy code into more readable code layout.

-We implemented AI in 2 ways to our app. We have an AI chatbot that will answer all questions about natural disasters, and a button on each page that will predict what will happen if a natural disaster hits a city and send that info to the app.

- We did not use AI to create data sets. We did not need to use data sets.

-We had originally struggled to implement our “predict the damage” button on each of our disaster pages. We tried to use the city that the user had inputted and send that to the OpenAI prompt to predict what would happen if a disaster of a certain type hit their city. This proved more difficult than planned, and we had to ask each other for help to finish this feature. Luckily, after having a new set of eyes on the problem, we managed to finish it successfully. 

## 9. Contact Info
beckharper13@gmail.com
rraymondxie@gmail.com