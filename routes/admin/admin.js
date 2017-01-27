var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://127.0.0.1:27017/blogs'
/* GET home page.  res.render 文件夹名/模板名 */  
router.get('/', function(req, res, next) {
  res.render('admin/admin', { title: 'Express' });
});

module.exports = router;
