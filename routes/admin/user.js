var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('objectid');
var url = 'mongodb://127.0.0.1:27017/blogs';

router.get('/login', function(req, res, next) {
	if(req.session.isLogin){
		res.resdirect('/admin');
	}else{

		res.render('admin/login', { title: 'Express' });
	}
});

router.post('/login', function(req, res, next) {
	let username = req.body.username;
	let password = req.body.password;
	MongoClient.connect( url , ( err, db ) => {
		if( err ) throw err;
		let user = db.collection('user');
		user.find({username: username, password: password}).toArray( ( err, result ) => {
			if(err) throw err;
			//返回的result为一个数组，当查询不到相应数组的时候返回的是一个空数组
			//我们使用result.length来检查是否有对应的用户名
			if( result.length ){
				req.session.isLogin = 1;
				res.redirect('/admin');
			}else{
				res.redirect('/user/login');
			}
		});
	} );
});

router.get( '/logout', function(req, res, next){
	req.session.isLogin = 0;
	res.redirect('/user/login');
} )
module.exports = router;
