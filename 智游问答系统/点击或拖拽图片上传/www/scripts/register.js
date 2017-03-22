
//返回上一页
$('#goBack').click(function(){
	history.go(-1)
})

//返回首页
$('#home').click(function(){
	location.href="index.html"
})

//提交表单
$('form').submit(function(event){
	//阻止表单默认提交事件
	event.preventDefault()
	
	//比较密码和确认密码是否一致
	var passwords=$('input[type=password]').map(function(){
		//遍历出两个密码输入框中的内容
		return $(this).val()
	})
	
	if(passwords[0]!=passwords[1]){
		//提示用户两次密码输入不一致
		$('.modal-body').text('两次密码输入不一致,请重新输入')
		$('#myModal').modal('show')
		return;
	}
	//发送注册请求
	//这是原生获取表单数据的方法
//	var data=new FormData(this)
//	console.log(this)
	
	//用提交表单的元素的值编译成字符串
	var data = $(this).serialize()
	console.log(data)
	
//	发送post请求进行注册
	$.post('/user/register',data,function(resData){
		//提示用户的注册结果
		$('.modal-body').text(resData.message)
//		显示模态	hide.bs.modal:模态消失时触发该事件
		$('#myModal').modal('show').on('hide.bs.modal',function(){
			if(resData.code==3){
				location.href='login.html'
			}
		})
	})
	
})















