# Ready2Go
An application that helps to control the access into a determined location  
based on configurable factors such as authorization or other requirements.  
By providing a valid ID, the system returns information to easily determine  
if a person is allowed into the facility or not.  

## Link to app
Visit [Ready2Go](https://ready2go.herokuapp.com/) now.

## Screenshots
### Splash Page:
Contains the demo details. You'll be directed here everytime you click on  
"Help" inside the demo.  
By clicking on the buttons at the top of the user level's table you'll be   
auto logged-in under that level.  

<img src="/screenshots/splash.png" width="350">

### Basic User Level:
To check out the information at this level, no account is needed.  
Click on the orange icon to get some ids to try the app.  

<img src="/screenshots/basic.png" width="350">

<img src="/screenshots/basic-results.png" width="350">

### Overview User Level:
When you create an account, this is the user level you get.  
This user can get the employees' information searching them by id or   
looking for them on a list.  

<img src="/screenshots/overview.png" width="350">

<img src="/screenshots/overview-results.png" width="350">


### Public User Level:
This user level can only be granted by another user holding a public  
or admin level.   
This user is allowed to read all the information (employees, trainings,   
departments, employers and users) and to create or to update an employee.  

<img src="/screenshots/public.png" width="350">

### Admin User Level:
Only another admin user can grant someone this level. This user has all  
permissions to read, create, update and delete all the information  
included except for updating other users' information.  

<img src="/screenshots/public-edit.png" width="350">

## Environment Setup
Node.js, Express, MongoDB, Mongoose, Chai, Mocha, JavaScript, JQuery and CSS.

## Features
* Easily validate if a person is authorized to enter or not a facility by entering his/her   
  ID or by finding him/her on a list.  
* Create user account.  
* Log in using username and password.  
* The system is configured to store and manipulate information about the app users, the people   
  that will be seeking entrance into the facility, and other information as needed including the  
  requirements that will be validated in order to grant a person entrance or not.  
* Display different information and allow different functions (create, update, delete)   
  depending on the user's level.  

## Author
Adriana Suarez
