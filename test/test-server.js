global.DATABASE_URL = 'mongodb://localhost/shopping-list-test';

var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('../server.js');
var Item = require('../models/item');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

debugger
describe('Shopping List', function() {
  before(function(done) {
    server.runServer(function() {
      Item.create({name: 'Broad beans'},
                  {name: 'Tomatoes'},
                  {name: 'Peppers'}, 
                  function() {
                    done();
                  });
    });
  });

  it('should list items on get',function(done){
		chai.request(app)
	  	.get('/items')
				.end(function(err, res){
		  		res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.length(3);
          res.body[0].should.be.a('object');
          res.body[0].should.have.property('_id');
          res.body[0].should.have.property('name');
//          res.body[0].id.should.be.a('number');
          res.body[0].name.should.be.a('string');
          res.body[0].name.should.equal('Broad beans');
          res.body[1].name.should.equal('Tomatoes');
          res.body[2].name.should.equal('Peppers');
					done();
	
				});
		});
    it('should add an item on post when id exists', function(done){
      chai.request(app)
        .post('/items')
        .send({'name': 'Kale'})
        .end(function(err, res) {
          should.equal(err, null);
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('name');
          res.body.should.have.property('_id');
         res.body.name.should.be.a('string');
   //       res.body.id.should.be.a('number');
          res.body.name.should.equal('Kale');
          done();
        });
		});

		it('should fail gracefully for invalid body during post', function(done){
			chai.request(app)
			.post('/items')
			.send({'height':'60in'})
			.end(function(err, res){
//        console.log("lizzie",res);
				res.should.have.status(500);
//				res.statusMessage.should.equal("Internal Server Error");
				done();
			});
		});

    it('should edit an item on put',function(done){
			chai.request(app)
      .get('/items')
      .end(function(err,res1){
        var potatoesId = res1.body[3]._id;
        chai.request(app)
        .put('/items/'+potatoesId)
			  .send({'name':'potatoes','id':potatoesId})
			  .end(function(err, res){
  	  		res.should.have.status(201);
					chai.request(app)
					.get('/items')
					.end(function(err, res){
    				should.equal(err,null);
  	  			res.should.have.status(200);
  		  		res.body[3].should.be.a('object');
  			  	res.body[3].should.have.property('name');
    				res.body[3].should.have.property('_id');
  	  			res.body[3].name.should.be.a('string');
  			  	res.body[3].name.should.equal('potatoes');
  				  done();
					});
        });
			});	
		});
		it('should fail gracefully for put with no id',function(done){
			chai.request(app)
			.put('/items/')
			.end(function(err, res){
				res.should.have.status(404);
				done();
			});
		}
    
    );
		it('should use the body ID when it differs from the endpoint id',function(done){
			var bananasId;
			chai.request(app)
			.get('/items')
			.end(function(err, res){
					bananasId = res.body[2]._id;
					chai.request(app)
					.put('/items/3')
					.send({'name':'bananas','id':bananasId})
					.end(function(err, res){
							should.equal(err, null);
							res.should.have.status(201);
							chai.request(app)
							.get('/items')
							.end(function(err,res){
									res.should.have.status(200);
									res.body[2].name.should.equal('bananas');
									done();	
							});
					});
			});
		});
		it('should create a new item when ID doesn\'t exist in put',function(done){
			chai.request(app)
			.put('/items/75')
			.send({'name':'kiwi','id':75})
			.end(function(err, res){
					should.equal(err, null);
					res.should.have.status(201);
					chai.request(app)
					.get('/items')
					.end(function(err, res){
						var last = res.body.length-1;
						res.body[last].name.should.equal('kiwi');	
//						res.body[last].id.should.equal(75);	
						done();
					});
			});
		});
//		it('should fail gracefully for bad JSON during a put');

//		it('should fail gracefully for invalid body during put');

    it('should delete an item on delete',function(done){
			chai.request(app)
			.get('/items')
			.end(function(err, res){
					var deleteId = res.body[1]._id;
					console.log(deleteId);
					chai.request(app)
					.delete('/items/'+deleteId)
					.end(function(err, res){
							should.equal(err, null);
							res.should.have.status(201);
							done();
					});
			});
		});
		it('should fail gracefully on delete with no ID',function(done){
			chai.request(app)
			.delete('/items')
			.end(function(err, res){
				res.should.have.status(404);
				done();
			});
		});
		
		it('should fail gracefully on delete with nonexistent ID', function(done){
			chai.request(app)
			.delete('/items/-1')
			.end(function(err, res){
        res.should.have.status(500);
        done();


			});
		});
  after(function(done) {
    Item.remove(function() {
      done();
    });
  });
});

