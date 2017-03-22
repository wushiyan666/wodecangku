
//从本地缓存的 cookie中取出 petname的值
var petname=$.cookie('petname')
console.log(petname)
$('#ask').click(function(){
	petname?location.href='ask.html':location.href='login.html'
})

//判断是否有cookie 决定 user 图片样式和行为
if(petname){
	$('#user').find('span').last().text(petname)
}else{
	$('#user').find('span').last().text('登录').end().end().removeAttr('data-toggle').
	click(function(){
		location.href='login.html'
	})
}

//获取首页数据
$.get('/question/all',function(resData){
	console.log(resData)
})











