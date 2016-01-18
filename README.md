# Uber Coding Challenge

### The goal:
Create a service that shows on a map where movies have been filmed in San Francisco. The user should be able to filter the view using autocompletion search.

The data is available on [DataSF: Film Locations](https://data.sfgov.org/Culture-and-Recreation/Film-Locations-in-San-Francisco/yitu-d5am).

### Font-end focused.
I focused on a front-end solution due to the time restraint. I also felt that in a 'proof of concept' type project, a full stack solution was overkill. This project is structured so that a backend can be quickly added if the 'project' moved forward.

### Technical choices

#### Overview
I chose to implement a typical JavaScript project that uses Node.js for local hosting and build tools. Version control of the code is through Github, and it is hosted on Heroku.
Heroku and Github play really well together and really simplify the 'devops' part of protoyping projects.

#### Build tools

- **package management** : NPM (Node.js) | Bower (In-browser packages)

- **build tool** : Grunt.js

  - file minification
  - CSS processing
  - Assets compilation
  - so many etcs
  
#### Front-end framework and libraries
I chose Vue.js as a lightweight framework to handle binding data to the DOM. I knew this was only going to have a single view, so I didn't see the need for something larger like Backbone.js or Angular.js.

Smaller libraries used: 

- Underscore.js for functional programming helpers
- Async.js to keep API calls in sync
- Leatlet.js to render map components
- jQuery for XHR requests

#### Trade-offs

Since there isn't a backend and rate limits on the geocoding API, rendering pins the first time for a movie is a little slow. If I had more time I would spin up a Node.js server with a cronjob that gets hits the movies API, adds geolocating data, and saves the whole thing to a MongoDB document. There are also a few bugs to work out.

Mobile devices are supported, but both the desktop and mobile UI's need to be polished

Linkedin profile:
https://www.linkedin.com/in/tomwolber

View it here (mobile friendly)
http://uber-sf-movies.herokuapp.com/
