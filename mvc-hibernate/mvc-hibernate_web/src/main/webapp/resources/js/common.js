/** 页面返回 **/
function fanHui(){
	var url="javascript:history.go(-1);";
    window.location.href=url;
}

/**
 * 显示LOADING框
 */
function showZjLoading() {
	var mask = $('<div class="mask zj-loading"></div>');

	var loadingImg = $('<img src="' + webRoot
			+ 'resources/img/loading.gif"></img>');
	mask.append(loadingImg);
	$('body').append(mask);
	
	mask.css({
		"z-index" : "99998",
	});

	mask.show();

	mask.click(function() {
		$(".zj-loading").remove();
	});
	
	scrollToTop();
}

function removeZjLoading() {
	$(".zj-loading").remove();
}
function scrollToTop() {
	$("html,body").stop(true);
	$("html,body").animate({
		scrollTop : 0
	}, 100);
}
/** 回到顶部 **/
$(function() {
	$.fn.manhuatoTop = function(options) {
		var defaults = {			
			showHeight : 0,
			speed : 1000
		};
		var options = $.extend(defaults,options);
		$("body").prepend("<div id='totop'><a href='javascript:;'>返回顶部</a></div>");
		var $toTop = $(this);
		var $top = $("#totop");
		var $ta = $("#totop a");
		$toTop.scroll(function(){
			var scrolltop=$(this).scrollTop();		
			if(scrolltop>=options.showHeight){				
				$top.show();
			}
			else{
				$top.hide();
			}
		});	
		$ta.hover(function(){ 		
			$(this).addClass("cur");	
		},function(){			
			$(this).removeClass("cur");		
		});	
		$top.click(function(){
			$("html,body").animate({scrollTop: 0}, options.speed);	
		});
	}
});

//JavaScript Document
/**
 * ie和fifox兼容性测试
 */
if (!console) {
	var console = {
		debug : function(){return false;},
		info : function(){return false;},
		warn : function(){return false;},
		error : function(){return false;},
		trace : function(){return false;},
		dir : function(){return false;},
		log : function(){return false;}
	};
}

// 左部菜单切换
$(function(){
	$(".mgm-main-menu dt").click(function(){
	    var par=$(this).parent();
	    if(par.hasClass("now-menu")){
	        par.removeClass("now-menu");
	    }
	    else {
	        par.addClass("now-menu").siblings().removeClass("now-menu");
	    }
	    
	    showstate();
	});
	
	function showstate(){
	    $(".mgm-main-menu .now-menu dd").animate({height:$(".mgm-main-menu .now-menu dd ul").height()});
	    $(".mgm-main-menu .now-menu").siblings().find("dd").animate({height:0});
	    if($(".mgm-main-menu .now-menu").length<1){$(".mgm-main-menu dd").animate({height:0});}
	};
	
});
