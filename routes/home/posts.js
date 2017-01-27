var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var multiparty = require('multiparty');
var ObjectId = require('objectid');
var markdown = require('markdown').markdown;

var url = 'mongodb://127.0.0.1:27017/blogs';
/* GET home page. */
// router.get('/', function(req, res, next){
// 		let id = req.query.id;
// 		MongoClient.connect( url , ( err, db ) => {
// 			if( err ) throw err;
// 			let posts = db.collection('posts');
// 			posts.find( { _id : ObjectId(id) } ).toArray( ( err, result ) => {
// 				if(err) throw err;
// 				let article = {
// 					title : result[0].title,
// 					time : result[0].time,
// 					count : result[0].count,
// 					summary : result[0].summary,
// 					content: result[0].content
// 				}
// 				console.log(article);
// 				res.render('home/posts', { data: article });
// 			});
// 		} );
// });

router.get('/', function(req, res, next){
	let id = req.query.id;
	MongoClient.connect( url , ( err, db ) => {
		if( err ) throw err;
		let posts = db.collection('posts');
		posts.find( { _id : ObjectId(id) } ).toArray( ( err, result ) => {
			if(err) throw err;
			var article = {
						title : result[0].title,
						time : result[0].time,
						count : result[0].count,
						summary :result[0].summary,
						content: result[0].content
					};

			var cats = db.collection('cats');
			cats.find().toArray( (err, result2) =>{
				// results2 为文章分类
				if(err) throw err;
				posts.find().sort({count : -1}).limit(8).toArray((err, result3) => {
					//result3为热门文章
					if(err) throw err;
					res.render('home/posts', { data: article, data1 : result2, hot: result3});
				});
				
			} );

		});
	} );
});

// MongoClient.connect( url, ( err, db ) => {
// 		if(err) throw err;
// 		let cats = db.collection('cats');
// 		cats.find().toArray( (err, result) => {
// 			if(err) throw err;
// 			let posts = db.collection('posts');
// 			posts.find().toArray( (err, result2) => {
// 				if(err) throw err;
// 				console.log( result2 );
// 				res.render('home/index', { data : result, article : result2});
// 			} ); 
// 		} );
// 	});
module.exports = router;
