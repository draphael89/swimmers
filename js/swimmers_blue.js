var mobile = false;
var mobileBreak = 768;
if($(window).width() <= mobileBreak){mobile = true;}
var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
var path = '';
function freezePage(){$('body').css({'width':'100%','height':'100%','overflow':'hidden'});}
function unfreezePage(){$('body').css({'width':'','height':'','overflow':''});}
function animScroll(sec, speed, offset){
	activeOffset = $(sec).offset().top+offset;	
	TweenMax.to('html,body', speed, {scrollTop:activeOffset, ease:Expo.easeInOut});
}

// disable interval while tab is open

var pageInactive = false;
$(window).focus(function() {
	pageInactive = false;
});

$(window).blur(function() {
    pageInactive = true;
});
/*
$('body').click(function(){
	$('.hasAnim').removeClass('on');
})
*/





/*! - GLOBAL ***************************** */





//! - GLOBAL: 0 RESIZE

var winW;
var winH;
$(window).resize(function(){
	winW = $(window).width();
	winH = window.innerHeight;
	//console.log(winW+' / '+winH);
	
	if(winW<=mobileBreak && !mobile){
		mobile = true;
		
		if(stickyOpen){			
			$('#stickyBar').removeClass('open');
			stickyOpen = false;
		}
	}
	if(winW>mobileBreak && mobile){
		mobile = false;
		
		// if already scrolled, set sticky
		if(sT>0 && !stickyOpen){
			setSticky();
		}
	}
	
	// global scale updates
	if($('.hasScale').length > 0){
		updateScales();
	}
	
	// update scrollmagic
	if(smLoaded && winW>1024){
		updateSM();
	}

})
$(window).resize();




//! - GLOBAL: 1 HELPERS

function updateScales(){
	$('.hasScale').each(function(){
		if(winW<Number($(this).attr('data-limit'))){
			fullW = Number($(this).attr('data-width'));
			trgW = $(this).find('.sizer').width();
			scDif = Number(trgW/fullW);
			if(scDif > 1){scDif = 1;}
			if(scDif > 0){
				TweenMax.set($(this).find('.willScale'), {scaleX:scDif, scaleY:scDif});
			}
		} else {
			$(this).find('.willScale').attr({'style':''});
		}
	})	
}
// figure out cut off width: X = (Box Width) / Container %

function sizeRetina(){
	$('.retina').each(function(){
		tmpW = Math.round($(this).find('img').width());
		$(this).find('img').css({'width':'100%','height':'auto','max-width':tmpW/2+'px'});
		$(this).removeClass('retina');
	})
}

// give ID to section for on enter animations if none

$('#facts').find('.bubble-group').addClass('hasAnim');

c = 0;
$('.hasAnim').each(function(){
	if($(this).attr('id') == undefined){
		$(this).attr('id','anim'+c);
		c++;
	}
})


// CTA auto scroll to sections

$('#stickyBar, #hero').find('a[href="#facts"]').click(function(){
	animScroll('#facts', .75, -100);
	return false;
})
$('#stickyMobile').find('a[href="#facts"]').click(function(){
	animScroll('#facts', .75, -30);
	closeStickyCTA();
	return false;
})


// scroll back to top

$('#stickyBar .logo').click(function(){
	animScroll('#hero', .75, 0);
})





//! - GLOBAL: 2 LOADER

freezePage();
$(window).on('load', function(){
	
	$(window).resize();
		
	TweenMax.to('#loader', .5, {delay:.2, opacity:0, 'display':'none', onComplete:function(){
		unfreezePage();
	}});
})





//! - GLOBAL: 3 FORM SUBMIT

var formSent = false;
var formURL = $('#contactForm').attr('action');

$('.global-form').submit(function(){
	if(validateForm($(this))){
		sendForm($(this));
	}
	return false;
});

function sendForm(formObj){

// animation actions

var formData = formObj.serialize();

$.ajax({
    url: formURL,
    type: 'POST',
    data: formData,
        
    success: function(result){					
		formSent = true;
    }
});

}

function validateForm(formObj){	
	var vNum = 0;
	$(formObj).find('[data-type="req"]').each(function(){
		if($(this).val() == ""){
			vNum++;
			$(this).parents('.field-wrap').addClass('error');
		}
	});
	if(vNum==0){
		return true;
	} else {
		return false;
	}
}

// reset error on click

$('[data-type="req"]').on('focus click',function(){
	if($(this).parents('.field-wrap').hasClass('error')){
		$(this).parents('.field-wrap').removeClass('error');
	}
})





//! - GLOBAL: 4 OVERLAYS

var overlayOpen = false;

$('.bio-btn').click(function(){
	id = $(this).attr('data-id');
	$('.bio-contents').hide();
	$('#team-overlay').find('.bio-contents[data-id="'+id+'"]').show();
	
	TweenMax.to('#team-overlay', .5, {opacity:1, 'display':'block'})
	freezePage();
	overlayOpen = true;
	return false;
})

$('.close-btn, .overlayWrap').click(function(){
	TweenMax.to('#team-overlay', .5, {opacity:0, 'display':'none', onComplete:function(){
		overlayOpen = false;
		unfreezePage();
	}})
	return false;
})

$('.bio-contents').click(function(e){
	e.stopPropagation();
})




//! - GLOBAL: 5 VIDEO

var videoFile = 'SwimmersBot';
var vid1 = document.getElementById("bgvid1"); 
var vid2 = document.getElementById("bgvid2"); 
var vid3 = document.getElementById("bgvid3");
var chkVid;

vid1.addEventListener('loadedmetadata', function() {
	$('#hero').addClass('vidReady');
}, false);
vid2.addEventListener('loadedmetadata', function() {
	$('#fact-row4').addClass('vidReady');
}, false);
vid3.addEventListener('loadedmetadata', function() {
	$('#globalFooter').addClass('vidReady');
}, false);

function startVideo(obj){
	if(obj == '#hero'){tmpVid = vid1;}
	if(obj == '#fact-row4'){tmpVid = vid2;}
	if(obj == '#globalFooter'){tmpVid = vid3;}
	
	clearInterval(chkVid);
	chkVid = setInterval(function(){
		if($(obj).hasClass('vidReady')){
			tmpVid.currentTime = 8;
			tmpVid.play();
			clearInterval(chkVid);
		}
	}, 100)
}
function stopVideo(obj){
	if(obj == '#hero'){vid1.pause();}
	if(obj == '#fact-row4'){vid2.pause();}
	if(obj == '#globalFooter'){vid3.pause();}
}




/*! - SCROLLING ***************************** */





//! - SCROLLING: 0 STICKY ELEMENTS

var sT;
var stickyOpen = false;
//var stickyBreak = 768;
var stickyBreak = 0;
var stickyH = 66;
var lastSt = 0;
var autoOff = false;

$(window).on("scrollstart",function(){
	scroll_interval = setInterval(function(){			
	
		sT = $(this).scrollTop();
		
		// set sticky bar
		//if(winW>mobileBreak){
		setSticky();
		//}	
		
	}, 10);
})

$(window).on("scrollstop",function(){
	if(scroll_interval){
		clearInterval(scroll_interval);
	}
})

function setSticky(){
	
	// drop sticky bar on scroll up
	if(sT<lastSt && winW>=stickyBreak){	
		if(!stickyOpen && sT > stickyH){
			$('#stickyBar').addClass('open on');
			stickyOpen = true;
		}	
		
		// remove sticky if top of page
		if(stickyOpen && sT <= stickyH){
			$('#stickyBar').removeClass('open');
			setTimeout(function(){$('#stickyBar').removeClass('on');}, 300);
			stickyOpen = false;
		}
	}
	
	// remove sticky on scroll down
	if(sT>lastSt){
		if(stickyOpen){
			$('#stickyBar').removeClass('open');
			stickyOpen = false;
		}
	}

	lastSt = sT;
}


// mobile sticky tab

var mobBtnW = 160;

$('#stickyMobile .sticky-btn').click(function(){
	$('#stickyMobile').addClass('open');
	TweenMax.to($('#stickyMobile .sticky-btn'), .75, {width:mobBtnW, ease:Power3.easeInOut})
	TweenMax.to($('#stickyMobile').find('.close-btn'), .5, {delay:.5, opacity:1, scaleX:1, scaleY:1, 'display':'block', ease:Power3.easeInOut})
})

$('#stickyMobile .close-btn').click(function(){	
	closeStickyCTA();
})

function closeStickyCTA(){
	TweenMax.to($('#stickyMobile .sticky-btn'), .75, {width:63, ease:Power3.easeInOut, onComplete:function(){
		$('#stickyMobile').removeClass('open');
	}})
	TweenMax.to($('#stickyMobile').find('.close-btn'), .5, {opacity:0, scaleX:0, scaleY:0, 'display':'none', ease:Power3.easeOut})
}





//! - SCROLLING: 1 SCROLLMAGIC

var smLoaded = false;
var controller = new ScrollMagic.Controller();
var factsSidebarScene;

function initScrollMagic(){
	
	
// global: sections with animations

$('.hasAnim').each(function(){
    var currentElem = '#'+$(this).attr('id');
    os = 0;
    if($(this).attr('data-offset') != ''){
    	os = $(this).attr('data-offset');
    }
    var scene = new ScrollMagic.Scene({triggerElement: currentElem, triggerHook: 2, offset:os, duration: winH+$(currentElem).outerHeight()})
        .addTo(controller);
        scene.setClassToggle(currentElem, "on");
});


// hero sperm swim 

var hero_tl = new TimelineMax();
var hero_tween1 = new TweenMax($('#hero').find('.sperm-group'), 10, {startAt:{x:0, y:0}, x:1000, y:-800, ease:Power3.easeInOut});
	hero_tl.add(hero_tween1, 0);
	  
	hero_tween1 = new ScrollMagic.Scene({
			triggerElement: "#hero",
			offset: winH/9,
			duration: winH+$('#hero').find('.sperm-group').outerHeight()
		})
		.setTween(hero_tl)
		.addTo(controller);
		
		
// hero video

$('.hasVideo').each(function(){
	var currentElem = '#'+$(this).attr('id');
	var videoScene = new ScrollMagic.Scene({	
		triggerElement: currentElem,
		triggerHook: 2,
		duration: winH+$(currentElem).outerHeight()
	})
	.on('enter',function(){
		startVideo(currentElem);
	})
	.on('leave',function(){
		stopVideo(currentElem);
	})	
	.addTo(controller);
})


		

// facts: add/remove side tab

factsSidebarScene = new ScrollMagic.Scene({
	triggerElement: "#facts",
	triggerHook: 2,
	duration: $("#facts").outerHeight(),
	offset: winH/2,
})
.addTo(controller);
factsSidebarScene.setClassToggle('#facts-progress', 'open');


// facts: update nav

$('#facts').find('.content-row').each(function(){
    var currentElem = '#'+$(this).attr('id');
    var scene = new ScrollMagic.Scene({triggerElement: currentElem, triggerHook: 0, duration: $(currentElem).outerHeight()})
        .on('enter',function(){  
			updateFactsNav($(currentElem).attr('data-num'));
		})
        .addTo(controller);
});


// facts line draw

var facts_tl1 = new TimelineMax();
var facts_tween1 = new TweenMax($('#path-draw1 path'), 10, {startAt:{drawSVG:'100% 100%'}, drawSVG:'0% 100%', ease:Quad.easeInOut});

	facts_tl1.add(facts_tween1);
	
	facts_t1 = new ScrollMagic.Scene({
			triggerElement: "#path-draw1",
			offset: 0,
			triggerHook: 1,
			duration: $('#path-draw1').outerHeight()+winH*.8
		})
		.setTween(facts_tl1)
		.addTo(controller);
		
var facts_tl2 = new TimelineMax();
var facts_tween2 = new TweenMax($('#path-draw2 path'), 10, {startAt:{drawSVG:'100% 100%'}, drawSVG:'0% 100%', ease:Quad.easeInOut});

	facts_tl2.add(facts_tween2);
	
	facts_t2 = new ScrollMagic.Scene({
			triggerElement: "#path-draw2",
			offset: 100,
			triggerHook: 1,
			duration: $('#path-draw2').outerHeight()+winH*.8
		})
		.setTween(facts_tl2)
		.addTo(controller);
		
var facts_tl3 = new TimelineMax();
var facts_tween3 = new TweenMax($('#path-draw3 path'), 10, {startAt:{drawSVG:'0% 0%'}, drawSVG:'0% 100%', ease:Quad.easeInOut});

	facts_tl3.add(facts_tween3);
	
	facts_t3 = new ScrollMagic.Scene({
			triggerElement: "#path-draw3",
			offset: 100,
			triggerHook: 1,
			duration: $('#path-draw3').outerHeight()+winH*.8
		})
		.setTween(facts_tl3)
		.addTo(controller);
		
	
}

function updateSM(){
	factsSidebarScene.duration($("#facts").outerHeight());
}

initScrollMagic();




/*! - SECTION ***************************** */





//! - SECTION: 1 FACTS

var pageMoving = false;

function updateFactsNav(id){
	//console.log('on '+elem);
	
	if(!pageMoving){
		
		// update nav
		$('#facts-progress').find('.prog-section').removeClass('on');
		$('#facts-progress').find('.prog-section[data-num="'+id+'"]').addClass('on');
		
	}
}

$('#facts-progress').find('.prog-section').click(function(){
	id = $(this).attr('data-num');
	activeOffset = $('#fact-row'+id).offset().top;	
	pageMoving = true;
	
	$('#facts-progress').find('.prog-section').removeClass('on');
	$(this).addClass('on');
	
	TweenMax.to('html,body', 1, {scrollTop:activeOffset, ease:Expo.easeInOut, onComplete:function(){
		pageMoving = false;
	}});
})

// start paths hidden

TweenMax.set($('#facts .row-div path'), {drawSVG:'100% 100%'})











