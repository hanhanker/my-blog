var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var multiparty = require('multiparty');
var ObjectId = require('objectid');
var fs = require('fs');
var markdown = require('markdown').markdown;

var url = 'mongodb://127.0.0.1:27017/blogs';
//文章列表
router.get('/article_list', function(req, res, next) {
	MongoClient.connect( url, ( err, db) => {
		if(err) throw err;
		let posts = db.collection('posts');
		posts.find().toArray( (err, result) => { 
			if(err) throw err;
			// article = {
			// 	title : result[0].title,
			// 	summary : markdown.toHTML(result[0].summary),
			// }
			res.render('admin/article_list', {data : result});
		} );
	});

});
// 文章添加
router.get('/article_add', function(req, res, next) {
	MongoClient.connect( url , ( err, db ) => {
		if( err ) throw err;
		let cats = db.collection('cats');
		cats.find().toArray( ( err, result ) => {
			if(err) throw err;
			res.render('admin/article_add', { cats: result });
		});
	} );
});

router.post('/article_add', function(req, res, next){
	//设置临时上传文件的路径
	let form = new multiparty.Form({uploadDir : "public/tmp"});
	form.parse(req, (err, fields, files) => {
		// console.log(fields);
		// console.log(files);
		// 把临时文件上传至服务器端的路径
		fs.renameSync(files.cover[0].path, 'public/uploads/' + files.cover[0].originalFilename);
		let article = {
			title : fields.title[0],
			cat : fields.cat[0],
			summary : fields.summary[0],
			content : fields.content[0],
			time : new Date(),
			count : Math.ceil( Math.random() * 1000),
			cover : "uploads/" + files.cover[0].originalFilename //还需要保存图片的路径
		};
		MongoClient.connect( url, (err, db) => {
			if(err) throw err;
			let posts = db.collection('posts');
			posts.insert( article, (err, result) => {
				if(err){
					res.render('admin/message', { message: '上传失败'});
				}else{
					res.render('admin/message', { message: '上传成功'});
				}
			});
		} );
	});
});

//文章列表中的操作 (eidt) 
router.get('/article_edit', (req, res) => {
	let id = req.query.id;
	MongoClient.connect( url , ( err, db ) => {
		if( err ) throw err;
		let posts = db.collection('posts');
		posts.find( {_id: ObjectId(id)} ).toArray( (err, result) => {
			if(err) throw err;
			console.log(result);
			res.render( 'admin/article_edit', { data : result });
		} );
		
	} );
} );
// (修改)
router.post('/article_edit', (req, res) => {
//设置临时上传文件的路径
let form = new multiparty.Form({uploadDir : 'public/tmp'});
form.parse( req, (err, fields, files) => {
		// console.log(fields);
		// console.log(files);
		// 把临时文件上传至服务器端的路径
		fs.renameSync(files.cover[0].path, 'public/uploads/' + files.cover[0].originalFilename);
		let article = {
			id : fields.id[0],
			title : fields.title[0],
			cat : fields.cat[0],
			summary : fields.summary[0],
			content : fields.content[0],
			time : new Date(),
			count : Math.ceil( Math.random() * 1000),
			cover : "uploads/" + files.cover[0].originalFilename //还需要保存图片的路径
		};
		console.log(article);
		MongoClient.connect( url, (err, db) => {
			if(err) throw err;
			let posts = db.collection('posts');
			posts.update( {_id: ObjectId(article.id)}, article, (err, result) => {
				if(err){
					res.render('admin/message', { message: '更新失败'});
				}else{
					res.render('admin/message', { message: '更新成功'});
				}
			} );
			
		} );
	});
});

//删除article_del
router.get('/article_del', (req, res) => {
	let id = req.query.id;
	MongoClient.connect( url , ( err, db ) => {
		if( err ) throw err;
		let posts = db.collection('posts');
		posts.remove( {_id: ObjectId(id)}, (err, result) => {
			if(err){
				res.render('admin/message', {message: '删除失败'});
			}else{
				res.render('admin/message', {message: '删除成功'});
			}

		} );
		
	} );
} );
module.exports = router;