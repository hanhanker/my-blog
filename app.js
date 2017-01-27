// 引入必要的模块
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
//使用会话机制session来确定用户（管理员）是否登陆。
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

//引入自定义模块 
//前台
var posts = require('./routes/home/posts.js');
var index = require('./routes/home/index.js');
var list = require('./routes/home/list.js');
//后台
var admin = require('./routes/admin/admin.js');
var cats = require('./routes/admin/category.js');
var article = require('./routes/admin/article.js');
var user = require('./routes/admin/user.js');

var app = express();

//使用session中间键
app.use( session({
	secret: 'blog',
	resave: false,
	saveUninitialized: true,
	cookie: {}
}) );

//自定义一个中间键，判断用户是否登陆
function checkLogin( req, res, next ){
	//文件头如果没有传来一个（或传来的是0）则回到登陆界面
	if( !req.session.isLogin ){
		res.redirect('/user/login');
		//结束这个函数
		return;
	}
	next();
}
// view engine setup 把html类型的作为模板
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//引入必要的第三方模块（第三方中间键）
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


//将public进行静态托管(前台的静态资源)(内置中间键)
app.use(express.static(path.join(__dirname, 'public')));
//将后台的views/admin目录也进行静态托管（后台的静态资源）
app.use(express.static(path.join(__dirname, 'views/admin')));

//（应用级中间键）
//后台路由
//对所有/admin开头的路由进行路由检查
// app.use('/admin', checkLogin);
app.use('/admin',admin);
app.use('/admin/cats',cats);
app.use('/admin/article',article);
//前台路由
app.use('/user', user);
app.use('/', index);
app.use('/posts', posts);
app.use('/list', list);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler（错误处理中间键）
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
