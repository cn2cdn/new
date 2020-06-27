

	
	/*触屏*/
	$(".slider .inner").bind("swipeleft",function(){
		
	});
	
	$(".slider .inner").bind("swiperight",function(){
		
	});
	
	
	$('.user_post .icons .love').click(function(){
		$(this).addClass('love_on');
		return false;
	})
	//详情
	if($('.main_view ').length>0){
		var swiper = new Swiper('.main_view  .swiper-container',{
	
			observer:true,
			    //observeParents:true,
		    	//slidesPerView: 5,
		    	//slidesPerGroup:5,
		    	 //spaceBetween: 10,
		
		    	pagination:  '.main_view .swiper-pagination',
				prevButton:'.main_view .swiper-button-prev',
		nextButton:'.main_view .swiper-button-next',
		    	paginationType: 'fraction', //缺省是原点
			    
		    });
	}
	
	//分享
	if($('.post_share').length>0){
		
	}
	
	//复制
	if($('#urlbtn').length>0){
		var clipboard = new Clipboard('#urlbtn', {
	        text: function() {
	            return $('#urltxt').val();
	        }
	    });
	
	    clipboard.on('success', function(e) {
	        alert("复制成功");
	    });
	
	    clipboard.on('error', function(e) {
	         alert("请手动复制");
	    });
		
	}
	
	//发布
	$('.right_btns .up').click(function(){
		$('.mask, .post_nav').fadeIn();
		return false;
	})
	
	$('.post_nav #text').click(function(){
		$('.post_nav').fadeOut();
		$('.post_add').fadeIn();
		return false;
	})
	
	$('.post_add .form_ft input').click(function(){
		$('.mask , .post_add').fadeOut();
		return false;
	})
	
	$('.mask').click(function(){
		$('.mask , .post_nav, .post_add, .post_share').fadeOut();

	})
	
	//分享
	$(document).on('click','.right_icons .reblog',function(){

		$('.mask, .post_share').fadeIn();
		var swiper_share = new Swiper('.post_share .swiper-container',{
	
			observer:true,
			    //observeParents:true,
		    	slidesPerView: 5,
		    	slidesPerGroup:5,
		    	 spaceBetween: 10,
		
		    	pagination:  '.post_share .swiper-pagination',
				prevButton:'.post_share .swiper-button-prev',
		nextButton:'.post_share .swiper-button-next',
		    	paginationType: 'fraction', //缺省是原点
			    
		    });
		return false;
	})
	
	//爱心
	$(document).on('click','.right_icons .love',function(){
		$(this).addClass('love_on');
		return false;
	})
	
	//标签
	if($('#tag_eidtor').length>0){
		$('#tag_eidtor').tagEditor({
			 initialTags: ['Hello', 'World', 'Example', 'Tags'], delimiter: '# ', placeholder: 'Enter tags ...' 
		});
	}
	
