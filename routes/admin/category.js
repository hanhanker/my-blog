var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('objectid');
var url = 'mongodb://127.0.0.1:27017/blogs';

router.get('/category_add', function(req, res, next) {
	res.render('admin/category_add', { title: 'Express' });
});
router.get('/category_list', function(req, res, next) {
	res.render('admin/category_list', { title: 'Express' });
});


router.get('/category_show', function(req, res, next) {
	MongoClient.connect( url , ( err, db ) => {
		if( err ) throw err;
		let cats = db.collection('cats');
		cats.find().toArray( ( err, result ) => {
			if(err) throw err;
			res.render('admin/category_show', { data: result });
		});
	} );
});


router.post('/category_add', function(req, res, next) {
	let title = req.body.title;
	let sort = req.body.sort;
	MongoClient.connect( url, ( err, db ) => {
		// if( err ) throw err;
		let cats = db.collection('cats');
		cats.insert( { title: title, sort : sort }, ( err, result ) => {
			if( err ){
				res.render('admin/message', { message: '添加失败'});
			}else{
				res.render('admin/message', { message: '添加成功'});
			}

		});
	} );
});

router.get( '/category_del', (req, res, next) => {
	let id = req.query.id;
	MongoClient.connect( url, (err, db) => {
		if(err) throw err;
		let cats = db.collection('cats');
		cats.remove( {_id : ObjectId(id)}, (err, result) => {
			if(err){
				res.render('admin/message', {message: '删除失败'});
			}else{
				res.render('admin/message', {message: '删除成功'});
			}
		} );
	} );
});

router.get('/category_edit', (req, res, next) => {
	let id = req.query.id;	
	MongoClient.connect( url , ( err, db ) => {
		if( err ) throw err;
		let cats = db.collection('cats');
		cats.find({ _id: ObjectId(id)}).toArray( ( err, result ) => {
			if(err) throw err;
			res.render('admin/category_edit', { cat: result[0] });
		});
	} );
});

router.post( '/category_edit', (req, res) => {
	let title = req.body.title;
	let sort = req.body.sort;
	let id = req.body.id;
	MongoClient.connect( url, (err, db) =>{
		if(err) throw err;
		let cats = db.collection('cats');
		cats.update( { _id: ObjectId(id) }, {title: title,sort: sort}, (err, result)=>{
			if(err){
				res.render('admin/message', {message: '更新失败'});
			}else{
				res.render('admin/message', {message: '更新成功'});
			}

		} );
	} );
} );
module.exports = router;