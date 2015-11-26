/*BOSlider 0.7.0 
*
*
*Copyright (C) 2015 BeginnerO
*BOSlider is released under MIT license.
*http://opensource.org/licenses/MIT
*/

(function($){
	jQuery.fn.exists = function(){return this.length>0;}

	$.fn.boslider = function(parms){
		var bo = $(this),
			bo_content = $(this).children('ul'), // Contents Selector
			bo_slide_num = bo_content.children('li').length, // Number of sliders.
			bo_window_width = bo_content.parent().outerWidth(); // Size of Each Content.
			page_defaults = [];

		for(var each_page = 1;each_page <= bo_slide_num;each_page++){
			page_defaults.push(each_page);
		}

		var Options = $.extend({},$.fn.boslider.defaults,parms);
		//Window Sizing
		if(Options.Height.indexOf('px') == -1){
			var Window_Rate = Options.Height.split(":");
			var Window_Height = $(this).outerWidth()*Window_Rate[1]/Window_Rate[0];
		}else{
			var Window_Height = parseInt(Options.Height);
		}

		if(Options.Min_Height > Window_Height){
			Window_Height = Options.Min_Height;
		}if(Options.Max_Height < Window_Height){
			Window_Height = Options.Max_Height;
		}
		//Parse Content Height whether px or ratio
		$(this)
			.css('height',Window_Height+"px")
		.children('ul')
			.css('height',(Window_Height+"px"))
		.children('li')
			.css('height',Window_Height+"px");

		var Content_Default = {
		};
		for(var each_page = 1;each_page <= bo_slide_num;each_page++){
			Content_Default[each_page] = '1/2.5';
		};

		var Content_Options = $.extend({},Content_Default,Options.Content),
			Content_wrapper = $(this).children('ul');
		for(each_page in Content_Options){
			var each_height = Content_Options.each_page;
			if(Content_Options[each_page].indexOf('px') == -1){
				var Content_Rate = Content_Options[each_page].split('/');
				Content_wrapper.children('li:nth-child('+each_page+')').children('div')
					.css('padding-top',Window_Height*Content_Rate[0]/Content_Rate[1]+"px")
					.css('height',(Window_Height+"px"));
			}else{
				Content_wrapper.children('li:nth-child('+each_page+')').children('div')
					.css('padding-top',parseInt(Content_Options[each_page])+"px")
					.css('height',(Window_Height+"px"));
			}
		}
		//Slide Function
		function bo_Slide(page_index){
			if(page_index < 0) page_index = bo_slide_num-1;
			else if(page_index == bo_slide_num) page_index = 0;

			var bo_active_content = bo_content.children('.bo-active');
			var bo_active_index = bo_content.index();

			if(bo_active_content.index() < page_index){
				bo_active_content
					.removeClass('bo-active')
					.css('transform','translateX(-100%)')
				.find('*').not('div')
					.css('opacity','0')
					.css('transform','translateX(-110px)');

				bo_content.children('li:lt('+(page_index+1)+')')
					.css('transform','translateX(-100%)')
				.find('*').not('div')
					.css('opacity','0')
					.css('transform','translateX(-110px)');

				bo_content.children('li:nth-child('+(page_index+1)+')')
					.addClass('bo-active')
					.css('transform','translateX(0)')
				.find('*').not('div')
					.delay(2000)
					.css('opacity','1')
					.css('transform','translateX(0)');

			}else if(bo_active_content.index() > page_index){
				bo_active_content
					.removeClass('bo-active')
					.css('transform','translateX(100%)')
				.find('*').not('div')
					.css('opacity','0')
					.css('transform','translateX(110px)');

				bo_content.children('li:gt('+(page_index)+')')
					.css('transform','translateX(100%)')
				.find('*').not('div')
					.css('opacity','0')
					.css('transform','translateX(110px)');

				bo_content.children('li:nth-child('+(page_index+1)+')')
					.addClass('bo-active')
					.css('transform','translateX(0)')
				.find('*').not('div')
					.delay(2000)
					.css('opacity','1')
					.css('transform','translateX(0)');

			}
			if(Options.Nav.On){
				var bo_active_nav = bo_nav.children('.bo-nav-active');
				bo_active_nav.removeClass('bo-nav-active');
				bo_nav.children('span:nth-child('+(page_index+1)+')').addClass('bo-nav-active');
			}
		}

		//Mover Part
		var Mover_Default = {
				On : false,
				Gradient : true,
				Width : 20,
			};
		var Mover_Options = $.extend({},Mover_Default,Options.Mover);

		if(Mover_Options.On){
			var Mover_Content = '<div class="bo-mover bo-left-mover"><span>&lang;</span></div><div class="bo-mover bo-right-mover"><span>&rang;</span></div>';

			$(this).append(Mover_Content);
			$(this).children('.bo-mover')
				.css('height',Window_Height+"px")
				.css('font-size',"60px")
				.css('width',(bo_window_width*parseInt(Mover_Options.Width)/100)+"px");

			var This_Height = $(this).children('.bo-mover').children('span').height();
			$(this).children('.bo-mover').children('span')
				.css('margin-top',(Window_Height - This_Height)/2+'px');

			//Mover Click Event Binding
			$(this).find('.bo-left-mover').on('click',function(){
				bo_Slide(bo_content.children('.bo-active').index()-1);
			});
			$(this).find('.bo-right-mover').on('click',function(){
				bo_Slide(bo_content.children('.bo-active').index()+1);
			});
			//Gradient 
			if(!Mover_Options.Gradient){
				$(this).children('.bo-left-mover')
					.css('background','none');
				$(this).children('.bo-right-mover')
					.css('background','none');
			}
		}

		/*Assign 'active' class to first li tag*/
		if(!bo_content.children('.bo-active').exists()){
			bo_content.children('li:nth-child(1)').addClass('bo-active');
		}

		//Initialing Slides.
		for(var bo_i = 1; bo_i <= bo_slide_num;bo_i++){
			var bo_current = bo_content.children('li:nth-child('+bo_i+')');
			if(bo_current.hasClass('bo-active')) continue;
			if(bo_current.index() < bo_content.find('.bo-active').index()) 
				bo_current
					.css('transform','translateX(-100%)')
				.find('*').not('div')
					.css('opacity','0')
					.css('transform','translateX(-110px)');
			else 
				bo_current
					.css('transform','translateX(100%)')
				.find('*').not('div')
					.css('opacity','0')
					.css('transform','translateX(110px)');
		}

		/*Navigation*/
		var Nav_Default = {
				On : true,
				Shape : 'Circle',
			}
		var Nav_Options = $.extend({},Nav_Default,Options.Nav);

		if(Nav_Options.On){
			switch(Nav_Options.Shape){
				case 'Circle' : Nav_Shape = '&bull;';break;
				case 'Square' : Nav_Shape = '&#9608';break;
			}
			
			$(this).append('<div class="bo-nav"></div>');
			for(bo_i = 0;bo_i < bo_slide_num;bo_i++){
				if(bo_i == bo_content.find('.bo-active').index()){
					$(this).children('.bo-nav').append('<span class="bo-nav-active">'+Nav_Shape+'</span>');
				}else{
					$(this).children('.bo-nav').append('<span>'+Nav_Shape+'</span>');
				}
			}
			var bo_nav = $(this).children('.bo-nav');

			/*Nav Click Binding*/
			$(this).find('span').on('click',function(){
				var bo_active_content = bo_content.children('.bo-active');
				var bo_nav_index = $(this).index();
				bo_Slide(bo_nav_index);
			});
		}

		/*AutoSlide Part*/
		var AutoSlide_Default = {
				On : false,
				Duration : 5000,
			}
			var AutoSlide_Options = $.extend({},AutoSlide_Default,Options.AutoSlide);
		if(AutoSlide_Options.On){
			setInterval(function(){
					bo_Slide(bo_content.children('.bo-active').index()+1);
			},AutoSlide_Options.Duration);	
		}

		//CSS
		if(Options.Reactivity){
			var CSS_content = $(this).children('ul'),
				CSS_nav = $(this).children('.bo-nav'),
				CSS_inner_content = CSS_content.children('li');//.children('div');

			if(bo_window_width <= 679){
				$(this).children('.bo-nav')
					.css('top','85%');
				$(this).children('ul').children('li').children('div')
				.children('.bo-button-sharp')
					.css('font-size','15px')
					.css('top','15px')
					.css('padding','5px 15px 5px 15px');
				$(this).children('ul').children('li').children('div')
				.children('.bo-button-soft')
					.css('font-size','15px')
					.css('top','15px')
					.css('padding','5px 15px 5px 15px');
				CSS_inner_content.find('h1')
					.css('font-size','30px');
				CSS_inner_content.find('h2')
					.css('font-size','25px');
				CSS_inner_content.find('h3')
					.css('font-size','20px');
				CSS_inner_content.find('h4')
					.css('font-size','15px');
				CSS_inner_content.find('h5')
					.css('font-size','10px');
				CSS_inner_content.find('p')
					.css('font-size','9px');
			}else if(bo_window_width <= 1179){
				$(this).children('.bo-nav')
					.css('top','90%');
				$(this).children('ul').children('li').children('div')
				.children('.bo-button-sharp')
					.css('top','25px')
					.css('padding','10px 30px 10px 30px');
				$(this).children('ul').children('li').children('div')
				.children('.bo-button-soft')
					.css('top','25px')
					.css('padding','10px 15px');
				CSS_inner_content.children('h1')
					.css('font-size','45px');
				CSS_inner_content.children('h2')
					.css('font-size','40px');
				CSS_inner_content.children('h3')
					.css('font-size','35px');
				CSS_inner_content.children('h4')
					.css('font-size','30px');
				CSS_inner_content.children('h5')
					.css('font-size','25px');
				CSS_inner_content.children('p')
					.css('font-size','18px');
			}else{
				$(this).children('.bo-nav')
					.css('top','90%');
				$(this).children('ul').children('li').children('div')
				.children('.bo-button-sharp')
					.css('top','40px')
					.css('padding','15px 35px 15px 35px');
				$(this).children('ul').children('li').children('div')
				.children('.bo-button-soft')
					.css('top','40px')
					.css('padding','10px 35px');
				CSS_inner_content.children('h1')
					.css('font-size','45px');
				CSS_inner_content.children('h2')
					.css('font-size','40px');
				CSS_inner_content.children('h3')
					.css('font-size','35px');
				CSS_inner_content.children('h4')
					.css('font-size','30px');
				CSS_inner_content.children('h5')
					.css('font-size','25px');
				CSS_inner_content.children('p')
					.css('font-size','18px');
			}
		}
		return this.each(function(){
			$(this);
		});

	}//function boslider 

	$.fn.boslider.defaults = {
		Reactivity : true,
		Min_Height : 0,
		Max_Height : 1920,
		Height : "2:1",
		AutoSlide : {
			On : false,
			Duration : 5000,
		},
		Nav : {
			On : true,
			Shape : 'Circle',
		},
		Content : {
		},
		Mover : {
			On : false,
			Width : 20,
			Gradient : true,
		},
		transit : {
			componant : {

			}
		},
	}//boslider default setting.

	$.fn.boButton = function(css_rule,other_properties){
		var parent = $(this),
			bo_slide_num = parent.children('ul').children('li').length,
			button_defaults = {
				Page : [],
				Which : 'sharp',
				Min_Width : 0,
				Max_Width : 10000,
			};

		for(var each_page = 1;each_page <= bo_slide_num;each_page++){
			button_defaults.Page.push(each_page);
		}
		button_defaults = $.extend({},button_defaults,other_properties);
		button_defaults.Page.forEach(function(value,index,ar){
			for(var css_name in css_rule){
				var cover_width = parent.outerWidth();
				if(button_defaults.Min_Width < cover_width && cover_width < button_defaults.Max_Width){
					var css_value = css_rule[css_name];
					parent.children('ul')
					.children('li:nth-child('+value+')')
					.children('div')
					.children('.bo-button-'+button_defaults.Which)
						.css(css_name,css_value);
					}
				}
		});
		return this.each(function(){
			$(this);
		});
	}

	$.fn.boTypo = function(css_rule,other_properties){

		var parent = $(this),
			bo_slide_num = parent.children('ul').children('li').length,
			cover_width = $(this).parent().outerWidth(),
			page_defaults = [];

		for(var each_page = 1;each_page <= bo_slide_num;each_page++){
			page_defaults.push(each_page);
		}
		var typo_defaults = {
				Page : page_defaults,
				Which : ['h1','h2','h3','h4','h5','p'],
			};
		typo_defaults = $.extend({},typo_defaults,other_properties);
		console.log(typo_defaults.Which);
		typo_defaults.Page.forEach(function(value,index,ar){
			for(var css_name in css_rule){
				var css_value = css_rule[css_name];
				typo_defaults.Which.forEach(function(tag,tag_index,arr){
					var rest = css_value.split(':');
					if(rest[1] == undefined){
						parent.children('ul')
							.children('li:nth-child('+value+')')
							.children('div')
							.children(tag)
								.css(css_name,rest[0]);
					}else{
						rest[1] = rest[1].replace('[','');
						rest[1] = rest[1].replace(']','');
						var Each_val = rest[1].split('|');
						var Min_val = Each_val[0];
						var Max_val = Each_val[1];
						if(parseInt(Min_val) < cover_width && cover_width < parseInt(Max_val)){
							console.log('hi');
							parent.children('ul')
								.children('li:nth-child('+value+')')
								.children('div')
								.children(tag)
									.css(css_name,rest[0]);
						}
					}
				});
			}
		});

		return this.each(function(){
			$(this);
		});
	}

})(jQuery);