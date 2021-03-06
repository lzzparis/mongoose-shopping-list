var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");


var config = require("./config");

var app = express();

app.use(bodyParser.json());
app.use(express.static("public"));

var Item = require("./models/item");
app.get("/items",function(req,res){
  Item.find(function(err, items){
    if(err || !items){
      return res.status(500).json({
        message: "Internal Server Error"
      });
    }
    res.status(200).json(items);
  });

});

app.post("/items", function(req, res){
  var name = {
    name: req.body.name
  }

  Item.create(name, function(err, item){
    if(err || !item){
      return res.status(500).json({
        message: "Internal Server Error"
      });
    }

    res.status(201).json(item);
  });
});

app.put("/items/:id", function(req, res){
  var name = {
    name: req.body.name
  }
  var id = req.body.id;
  Item.findOneAndUpdate({_id:id},name, function(err, item){
    if(err || !item){
			Item.create(name, function(err, item2){
		 	  if(err || !item2){
		      return res.status(500).json({
    	    	message: "Internal Server Error"
      		});
				}
    		res.status(201).json(item2);
			});
    }
		else{
	    res.status(201).json(item);
		}
  });
});

app.delete("/items/:id",function(req,res){
  var id = req.params.id;
  Item.findOneAndRemove({_id:id}, function(err, item){
    if(err || !item){
      return res.status(500).json({
        message: "Internal Server Error"
      });
    }
    res.status(201).json(item);
  });
});

app.use("*", function(req, res){
	console.log("Tater tots");
  res.status(404).json({
    message: "Not Found"
  });
});


var runServer = function(callback){
  mongoose.connect(config.DATABASE_URL, function(err){
    if(err && callback){
      return callback(err);
    }
    app.listen(config.PORT, function(){
      console.log("Listenting on localhost:" + config.PORT);
      if (callback){
        callback();
      }
    });
  });
};

if (require.main === module){
  runServer(function(err){
    if(err){
      console.error(err);
    }
  });
}

exports.app = app;
exports.runServer = runServer;
