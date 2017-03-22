//返回上一页
$('#goBack').click(function(){
	history.go(-1)
})

//去注册按钮的点击事件
$('#register').click(function(){
	location.href='register.html'
})

//提交数据
$('form').submit(function(event){
	//阻止默认事件
	event.preventDefault()
	
	//发送登录请求
	var data=$(this).serialize()
	$.post('/user/login',data,function(resData){
		$('.modal-body').text(resData.message)
		$('#myModal').modal('show').on('hide.bs.modal',function(){
			if(resData.code==3){
				location.href='index.html'
			}
		})
	})
})




