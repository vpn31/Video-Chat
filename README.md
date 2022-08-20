# VChat Video Call
This project was done under Microsoft Engage Mentorship Programme 2021. Server side programming was done on nodejs. In this we basically made a web app where one has to register on the server by giving their details, after which they can video call their peers and chat along with it.  <br><br>

## Dependencies used

   * [Mongoose](https://mongoosejs.com/docs/)
   * [EJS](https://ejs.co/)
   * [Express](http://expressjs.com/)
   * [Passport](http://www.passportjs.org/docs/)
## Usage

In order to run the website locally on your computer , follow the steps given below:

* Clone this github repo.
* Open the terminal and change the directory to the downloaded folder then run the command 

```sh
 npm install
```

* The above command will install all the required packages and dependencies required for the project 
* The final step is to run the following command

```sh
 npm start
# Or run with Nodemon
 npm run serve

 ```
 `Visit http://localhost:5000`


 
 Before that open "config/keys.js" and add your MongoDB URI :<br>
 `module.exports = {
    MongoURI : 'mongodb+srv://<username>:<password>@cluster0.0dovlvb.mongodb.net/?retryWrites=true&w=majority/'
}`

## Welcome page
![Welcome](https://user-images.githubusercontent.com/75882984/185735926-9ea3d3c3-fa29-4cfe-976f-5d4e7e74521a.png)



## Signin/Signup page
![Login](https://user-images.githubusercontent.com/75882984/185735934-ecfdcdbf-6bfe-4629-bcdd-80b3a23b47f9.png)
![Register](https://user-images.githubusercontent.com/75882984/185735935-d1792eda-02e9-469c-b4c2-914109a69036.png)


## Dashboard
![Dashboard](https://user-images.githubusercontent.com/75882984/185735938-62139672-55f0-4198-b0fe-42fc317e8e89.png)


## Video Call
![Video Call Window](https://user-images.githubusercontent.com/75882984/185735941-128c8849-3d4e-4cb2-b53d-c02e78059545.png)


 
 > This web app was built by me:
   * [Vatsal Pravin](https://github.com/nobody8925)
