
var express = require('express')

var bodyParser=require('body-parser')
//处理文件上传
var multer=require('multer')

//处理cookie
var cookieParser=require('cookie-parser')

var fs=require('fs')
//创建服务器对象
var app=express()
//配置静态文件夹
app.use(express.static('www'))


//解析cookie对象
app.use(cookieParser())

//解析form表单用的
app.use(bodyParser.urlencoded({extended:true}))  


//解析字符串
//app.use(bodyParser.text())

/*----------------注册的接口--------------------------*/

app.post('/user/register',function(req,res){
	//判断有没有users这个文件夹
	fs.exists('users',function(exi){
		if(exi){
			//存在的情况下直接写入数据
			writeFile()
		}else{
			//文件不存在的话,先创建文件
			fs.mkdir('users',function(err){
				if(err){
					//创建文件夹失败
					res.status(200).json({code:0,message:'系统创建文件夹失败'})
				}else{
					//创建文件夹成功
					writeFile()
				}
			})
		}
	})
	//封装一个将用户注册信息写入本地的方法
	function writeFile(){
		//判断用户是否已经注册过
		var fileName = 'users/' + req.body.petname+'.txt'
		fs.exists(fileName,function(exi){
			if(exi){
				//用户存在,已被注册
				res.status(200).json({code:1,message:'用户名已存在,请重新注册'})
			}else{
				//用户不存在,进行注册
				//在body中加入ip和time属性
				req.body.ip=req.ip
				req.body.time=new Date()
				//未注册时,把用户信息写入本地
				fs.writeFile(fileName,JSON.stringify(req.body),function(err){
					if(err){
						//写入失败
						res.status(200).json({code:2,message:'系统错误,写入文件失败'})
					}else{
						//保存成功
						res.status(200).json({code:3,message:'注册成功'})
					}
				})
			}
		})
	}
})


/*-------------------------登录--------------------------------*/
app.post('/user/login',function(req,res){
	//根据 req.body.petname 去users文件夹中匹配文件
	var fileName='users/'+req.body.petname+'.txt'
	//查看users文件夹中是否有当前用户
	fs.exists(fileName,function(exi){
		if(exi){
			//文件存在
			//读取 fileName 路径的文件,进行密码的比较
			fs.readFile(fileName,function(err,data){
				if(err){
					//系统错误,读取文件失败
					res.status(200).json({code:1,message:'系统错误,读取文件失败'})
				}else{
					//读取成功,进行密码的比较
					var user = JSON.parse(data)
					if(req.body.password==user.password){
						//登录成功
						//设置应用发起http请求时提交的cookie值,调用此接口所有的请求都生效
						//把petname设置到 cookie中(把petname储存到当前网页内
//						1.有利于下次登录		2.保存用户信息)
						var expires = new Date()
						expires.setMonth(expires.setMonth() + 1)
						res.cookie('petname',req.body.petname,{expires})
						res.status(200).json({code:3,message:'登录成功'})
					}else{
						//密码错误,登录失败
						res.status(200).json({code:2,message:'密码错误,请重新输入'})
					}
				}
			})
		}else{
			//文件不存在
			res.status(200).json({code:0,message:'用户不存在'})
		}
	})
})


/*-------------------提问------------------------*/
app.post('/question/ask',function(req,res){
	//判断有没有在cookie中把petname传递过来
	if(!req.cookies.petname){
		//比如:确实是登录了,但是某些清除垃圾的软件会把储存的cookie清除掉
		//或者自己登录了自己把cookie清除了(或者时间戳到了)
		res.status(200).json({code:0,message:'登录异常,请重新登录'})
		return;
	}
	
	//判断储存提问的文件夹是否存在
	fs.exists('questions',function(exi){
		if(exi){
			//文件夹存在(写入文件)
			writeFile()
		}else{
			//文件不存在.需要创建
			fs.mkdir('questions',function(err){
				if(err){
					//文件创建失败
					res.status(200).json({code:1,message:'系统创建文件失败'})
				}else{
					//写入文件
					writeFile()
				}
			})
		}
	})
	//封装写入问题的方法
	function writeFile(){
		//生成提问问题的文件名
		var date=new Date()
		var fileName='questions/'+date.getTime()+'.txt'
		//生成储存信息
		req.body.petname=req.cookies.petname
		req.body.ip=req.ip
		req.body.time=date
		//写入文件
		fs.writeFile(fileName,JSON.stringify(req.body),function(err){
			if(err){
				//写入失败
				res.status(200).json({code:2,message:'系统错误,写入文件失败'})
			}else{
				//写入成功
				res.status(200).json({code:3,message:'提交问题成功'})
			}
		})
	}
})

/*-------------------------首页数据------------------------------*/
app.get('/question/all',function(req,res){
	//返回所有的问题
	fs.readdir('questions',function(err,files){
		if(err){
			//读取文件失败
			res.status(200).json({code:0,message:'读取文件失败'})
		}else{
			//读取文件成功
			//数组反序,目的是让最新的提问的问题排在最前面
			files=files.reverse()
			
			//创建一个数组容器,存放所有问题的对象
			var questions=[]
			for (var i=0;i<files.length;i++) {
				var file=files[i]
				//拼接文件的路径
				var filePath='questions/'+file
				//readFile:异步读取文件的方法,可能会导致结果还没有读取就完成就res了,没有数据返回
				//readFileSync:同步读取文件,
				var data=fs.readFileSync(filePath)
				//把字符串转换成json对象,然后存到数组中
				var obj=JSON.parse(data)
				questions.push(obj)
			}
			res.status(200).json(questions)
		}
	})
})





























app.listen(1000,function(){
	console.log('服务器已启动!!!')
})
