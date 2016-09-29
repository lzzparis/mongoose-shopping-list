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
//          storage.items.should.be.a('array');
//          storage.items.should.have.length(4);
//          storage.items[3].should.be.a('object');
//          storage.items[3].should.have.property('id');
//          storage.items[3].should.have.property('name');
//   //       storage.items[3].id.should.be.a('number');
//          storage.items[3].name.should.be.a('string');
//          storage.items[3].name.should.equal('Kale');
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
//				storage.items[2].name.should.equal("Peppers");
//				storage.items[2].id.should.equal(2);
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
          console.log("from mocha:",res.body);
  				should.equal(err,null);
	  			res.should.have.status(201);
		  		res.body.should.be.a('object');
			  	res.body.should.have.property('name');
  				res.body.should.have.property('_id');
	  			res.body.name.should.be.a('string');
		//  		res.body.id.should.be.a('number');
			  	res.body.name.should.equal('potatoes');
//				storage.items.should.be.a('array');
//				storage.items.should.have.length(4);
//				storage.items[3].name.should.equal('potatoes');
//				storage.items[3].id.should.equal(3);
				  done();
        });
			});	
		});
//temp		it('should fail gracefully for put with no id',function(done){
//temp			chai.request(app)
//temp			.put('/items/')
//temp			.end(function(err, res){
//temp				res.should.have.status(404);
//temp//        storage.items.should.have.length(4);
//temp//        storage.items[0].name.should.equal("Broad beans");
//temp//        storage.items[0].id.should.equal(0);
//temp//        storage.items[1].name.should.equal("Tomatoes");
//temp//        storage.items[1].id.should.equal(1);
//temp//        storage.items[2].name.should.equal("Peppers");
//temp//        storage.items[2].id.should.equal(2);
//temp//        storage.items[3].name.should.equal("potatoes");
//temp//        storage.items[3].id.should.equal(3);
//temp				done();
//temp			});
//temp		}
//temp    
//temp    );
//temp		it('should use the body ID when it differs from the endpoint id',function(done){
//temp			chai.request(app)
//temp			.put('/items/3')
//temp			.send({'name':'bananas','id':2})
//temp			.end(function(err, res){
//temp				should.equal(err, null);
//temp				res.should.have.status(200);
//temp				res.body.name.should.equal('bananas');
//temp				res.body.id.should.equal(2);
//temp//				storage.items[2].name.should.equal('bananas');
//temp//				storage.items[2].id.should.equal(2);
//temp//				storage.items[3].name.should.equal('potatoes');
//temp//				storage.items[3].id.should.equal(3);
//temp				done();	
//temp			});
//temp		});
//temp		it('should create a new item when ID doesn\'t exist in put',function(done){
//temp			chai.request(app)
//temp			.put('/items/75')
//temp			.send({'name':'kiwi','id':75})
//temp			.end(function(err, res){
//temp				should.equal(err, null);
//temp				res.should.have.status(200);
//temp				res.body.name.should.equal('kiwi');	
//temp				res.body.id.should.equal(75);	
//temp//				storage.items.should.have.length(5);
//temp//				storage.items[4].name.should.equal('kiwi');	
//temp//				storage.items[4].id.should.equal(75);	
//temp				done();
//temp			});
//temp		});
//temp		it('should fail gracefully for bad JSON during a put');
//temp
//temp		it('should fail gracefully for invalid body during put');
//temp    it('should delete an item on delete',function(done){
//temp			chai.request(app)
//temp			.delete('/items/3')
//temp			.end(function(err, res){
//temp				should.equal(err, null);
//temp				res.should.have.status(200);
//temp//				storage.items.should.have.length(4);
//temp//				storage.items[0].name.should.equal("Broad beans");
//temp//				storage.items[0].id.should.equal(0);
//temp//				storage.items[1].name.should.equal("Tomatoes");
//temp//				storage.items[1].id.should.equal(1);
//temp//				storage.items[2].name.should.equal("bananas");
//temp//				storage.items[2].id.should.equal(2);
//temp//				storage.items[3].name.should.equal("kiwi");
//temp//				storage.items[3].id.should.equal(75);
//temp				done();
//temp			});
//temp		});
//temp		it('should fail gracefully on delete with no ID',function(done){
//temp			chai.request(app)
//temp			.delete('/items/')
//temp			.end(function(err, res){
//temp				res.should.have.status(404);
//temp//        storage.items.should.have.length(4);
//temp//        storage.items[0].name.should.equal("Broad beans");
//temp//        storage.items[0].id.should.equal(0);
//temp//        storage.items[1].name.should.equal("Tomatoes");
//temp//        storage.items[1].id.should.equal(1);
//temp//        storage.items[2].name.should.equal("bananas");
//temp//        storage.items[2].id.should.equal(2);
//temp//        storage.items[3].name.should.equal("kiwi");
//temp//        storage.items[3].id.should.equal(75);
//temp				done();
//temp			});
//temp		});
//temp		
//temp		it('should fail gracefully on delete with nonexistent ID', function(done){
//temp			chai.request(app)
//temp			.delete('/items/-1')
//temp			.end(function(err, res){
//temp        res.should.have.status(404);
//temp        res.body.status.should.equal("ERROR");
//temp//        storage.items.should.have.length(4);
//temp//        storage.items[0].name.should.equal("Broad beans");
//temp//        storage.items[0].id.should.equal(0);
//temp//        storage.items[1].name.should.equal("Tomatoes");
//temp//        storage.items[1].id.should.equal(1);
//temp//        storage.items[2].name.should.equal("bananas");
//temp//        storage.items[2].id.should.equal(2);
//temp//        storage.items[3].name.should.equal("kiwi");
//temp//        storage.items[3].id.should.equal(75);
//temp        done();
//temp
//temp
//temp			});
//temp		});
  after(function(done) {
    Item.remove(function() {
      done();
    });
  });
});

