# whatdoyouwannado
A web app, designed mobile first (who carries their laptop around everywhere they go!) to pick what you're going to do next! I made this web app to solve the issue between my partner and I never being able to decide what we want to do next. She made a list of suggestions that we would pick from but whenever we needed it, it seemed to not be around. Leading to the creation of *whatdoyouwannado*.

I have decided to let it go open source so anyone can change it to their liking, but would love to see some traffic on my end. 

The premise is quite simple, there are a list of suggestions that are default, when you request a suggestion, a random suggestion will be displayed, you're supposed to pick the first one (but I have allowed to keep outputting suggestions). The suggestions require your location as tracks your position, grabs the weather from an API request, and filters the suggestions based on what the weather is like in your city. No point in suggestion going for a bike ride when there is torrential downpour! 

You also have the option of creating an account to be able to create/remove your own suggestions. When an account is created you also get the default list of suggestions that can be modified. 

##Usage
Currently the site is not live, but feel free to clone this repo and upload the files/folders to your server. Making PR would be appreciated too!

##Build
The technical stuff :)
This web app was built with AngularJS as the front-end and PHP as the backend (to create some RESTful API's). Geolocation is being used to get location and [Open Weather][1] to retrieve the weather for your location through their API. Authentication was built on JWT and [angular-jwt][2] along with [JWT-PHP][3] for server side JWT authentication. 

##Notes

 - My apologies for not using a `.gitignore` file, the cloning process might take longer with all the node modules.
 -  My database config files,  especially the password, are not legitimate. 
 - The JWT token is not the same one that will be used for production :)

[1]:http://openweathermap.org
[2]:https://github.com/auth0/angular-jwt
[3]:https://github.com/cfrett/JWT-PHP
