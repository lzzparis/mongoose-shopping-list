exports.DATABASE_URL  =	 "mongodb://ds041566.mlab.com:41566/mongoose-shopping-list" ||
												process.env.DATABASE_URL ||
                        global.DATABASE_URL ||
                        (process.env.NODE_ENV === "production" ?
                          "mongodb://ds041566.mlab.com:41566/mongoose-shopping-list" :
                          "mongodb://localhost/shopping-list-dev");

exports.PORT = process.env.PORT || 8080;


//set these env variables like this:

//single command:
//PORT=5000 node server.js

//whole session:
//export PORT=5000
//node server.js
