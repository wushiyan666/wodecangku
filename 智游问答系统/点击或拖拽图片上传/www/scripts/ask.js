//返回上一页
$('#goBack').click(function(){
	history.go(-1)
})

//返回首页
$('#home').click(function(){
	location.href='index.html'
})

//提交问题
$('form').submit(function(event){
	event.preventDefault()
	var data=$(this).serialize()
	$.post('/question/ask',data,function(resData){
		$('.modal-body').text(resData.message)
		$('#myModal').modal('show').on('hide.bs.modal',function(){
			if(resData.code==3){
				location.href='index.html'
			}
		})
	})
})






