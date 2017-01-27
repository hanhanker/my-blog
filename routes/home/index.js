var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var multiparty = require('multiparty');
var ObjectId = require('objectid');
var url = 'mongodb://127.0.0.1:27017/blogs';

/* GET home page. */
router.get('/', function(req, res, next) {
	// console.log('start');
	MongoClient.connect( url, ( err, db ) => {
		if(err) throw err;
		let cats = db.collection('cats');
		cats.find().toArray( (err, result) => {
			if(err) throw err;
			let posts = db.collection('posts');
			posts.find().sort({time: -1}).toArray( (err, result2) => {
				if(err) throw err;
				posts.find().sort({count: -1}).limit(8).toArray( (err, result3) => {
					// console.log(result2 + 'aaaaaaaaaaaaaa');
					res.render('home/index', { data : result, article : result2, hot: result3});
				} );
			} ); 
		} );
	});

});
// 首页右上的search 框
router.get( '/search', function(req, res, next){
	let keyword = req.query.keyword;
	MongoClient.connect( url, (err, db) => {
		if(err) throw err;
		let coll = db.collection('search');
		let reg = new RegExp( '^' + keyword, 'i');
		coll.find( {keyword : reg}, {_id: 0}).toArray( (err, result) => {
			if(err) throw err;
			res.json( result );
		} );
	} );
});
module.exports = router;
