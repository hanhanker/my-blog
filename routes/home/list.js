var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('objectid');

const url = "mongodb://127.0.0.1:27017/blogs";

router.get('/', function(req, res, next) {
	let cat = req.query.title;
	MongoClient.connect( url , ( err, db ) => {
		if( err ) throw err;
		let cats = db.collection('cats');
		cats.find().toArray( (err, result) => {
			if(err) throw err;
			let posts = db.collection('posts');
			posts.find({ cat: cat}).toArray( (err, result2) => {
				if(err) throw err;
				posts.find().sort({count: -1}).limit(8).toArray((err, result3) => {
					if(err) throw err;
					res.render('home/index', { data : result, article : result2, hot: result3});
				});
				
			} ); 
		} );
	} );
});

module.exports = router;
