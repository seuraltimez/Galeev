jQuery(function(){
	initStickyScrollBlock();
	initMobileNav();
	initMenu();
	initScroll();
	initSmoothScroll();
});

function initSmoothScroll(){
	$(document).ready(function(){
		$("#wrapper").smoothWheel()
	});
}

function initScroll(){
	$(function() {
		$.scrollify({
			section : "section",
			easing: "easeInOutCubic",
			touchScroll:false,
		});
	});
}

Element.onclick = function(e){
	e.preventDefault();
	document.querySelector(this.hash).scrollIntoView();
}

$(function() {  
	$('.btn')
	.on('mouseenter', function(e) {
		var parentOffset = $(this).offset(),
		relX = e.pageX - parentOffset.left,
		relY = e.pageY - parentOffset.top;
		$(this).find('span').css({top:relY, left:relX})
	})
	.on('mouseout', function(e) {
		var parentOffset = $(this).offset(),
		relX = e.pageX - parentOffset.left,
		relY = e.pageY - parentOffset.top;
		$(this).find('span').css({top:relY, left:relX})
	});
	$('[href=#]').click(function(){return false});
});

function initMenu() {
	var lastId,
	topMenu = $(".nav ul li"),
	topMenuHeight = topMenu.outerHeight()+15,
	menuItems = topMenu.find("a"),
	scrollItems = menuItems.map(function(){
		var item = $($(this).attr("href"));
		if (item.length) { return item; }
	});

	$(window).scroll(function(){
		var fromTop = $(this).scrollTop()+topMenuHeight;
		var cur = scrollItems.map(function(){
			if ($(this).offset().top < fromTop)
				return this;
		});
		cur = cur[cur.length-1];
		var id = cur && cur.length ? cur[0].id : "";
		if (lastId !== id) {
			lastId = id;
			menuItems
			.parent().removeClass("active")
			.end().filter("[href='#"+id+"']").parent().addClass("active");
		}                   
	});

	var lastId,
	topMenu = $(".header_mobile ul li"),
	topMenuHeight = topMenu.outerHeight()+15,
	menuItems = topMenu.find("a"),
	scrollItems = menuItems.map(function(){
		var item = $($(this).attr("href"));
		if (item.length) { return item; }
	});

	$(window).scroll(function(){
		var fromTop = $(this).scrollTop()+topMenuHeight;
		var cur = scrollItems.map(function(){
			if ($(this).offset().top < fromTop)
				return this;
		});
		cur = cur[cur.length-1];
		var id = cur && cur.length ? cur[0].id : "";
		if (lastId !== id) {
			lastId = id;
			menuItems
			.parent().removeClass("active")
			.end().filter("[href='#"+id+"']").parent().addClass("active");
		}                   
	});
}

$(function() {
	$(document).ready(function() {
		"use strict";
		if (window.innerWidth >1050) {
			var waitingTimeScroll = 0;
		}else{
			var waitingTimeScroll = 600;
		}
  //All the links:
  $('a[href^="#"]').on("click",smoothScroll);
  function smoothScroll(event) {
  	event.preventDefault();
  	var target = $(this.getAttribute('href'));
  	if( target.length ) {
  		setTimeout(function(){ 
  			$('html, body').stop().animate({
  				scrollTop: target.offset().top-0
  			}, 2000, "easeInOutExpo");
  		}, waitingTimeScroll);
  	} 
  	return false; 
  }
});
});

// mobile menu init
function initMobileNav() {
	jQuery('body').mobileNav({
		menuActiveClass: 'nav-active',
		menuOpener: '.nav-opener',
		hideOnClickOutside: true,
		menuDrop: '.navbar'
	});
}

function initStickyScrollBlock() {
	ResponsiveHelper.addRange({
		'1024..': {
			on: function() {
				jQuery('.header-main').stickyScrollBlock({
					setBoxHeight: false,
					activeClass: 'fixed-position',
					positionType: 'fixed',
					extraTop: function() {
						var totalHeight = 0;
						jQuery('10').each(function() {
							totalHeight += jQuery(this).outerHeight();
						});
						return totalHeight;
					},
					showAfterScrolled: false
				});
			},
			off: function() {
				jQuery('.header-main').stickyScrollBlock('destroy');
			}
		},
		'..1023': {
			on: function() {
				jQuery('.header-main').stickyScrollBlock({
					setBoxHeight: true,
					activeClass: 'fixed-position',
					positionType: 'fixed',
					extraTop: function() {
						var totalHeight = 0;
						jQuery('0').each(function() {
							totalHeight += jQuery(this).outerHeight();
						});
						return totalHeight;
					},
					showAfterScrolled: false
				});
			},
			off: function() {
				jQuery('.header-main').stickyScrollBlock('destroy');
			}
		}
	});
}

/*
 * jQuery sticky box plugin 
 */
 ;(function($, $win) {
 	'use strict';
 	function StickyScrollBlock($stickyBox, options) {
 		this.options = options;
 		this.$stickyBox = $stickyBox;
 		this.init();
 	}

 	var StickyScrollBlockPrototype = {
 		init: function() {
 			this.findElements();
 			this.attachEvents();
 			this.makeCallback('onInit');
 		},

 		findElements: function() {
      // find parent container in which will be box move 
      this.$container = this.$stickyBox.closest(this.options.container);
      // define box wrap flag
      this.isWrap = this.options.positionType === 'fixed' && this.options.setBoxHeight;
      // define box move flag
      this.moveInContainer = !!this.$container.length;
      // wrapping box to set place in content
      if (this.isWrap) {
      	this.$stickyBoxWrap = this.$stickyBox.wrap('<div class="' + this.getWrapClass() + '"/>').parent();
      }
      //define block to add active class
      this.parentForActive = this.getParentForActive();
      this.isInit = true;
    },

    attachEvents: function() {
    	var self = this;

      // bind events
      this.onResize = function() {
      	if (!self.isInit) return;
      	self.resetState();
      	self.recalculateOffsets();
      	self.checkStickyPermission();
      	self.scrollHandler();
      };

      this.onScroll = function() {
      	self.scrollHandler();
      };

      // initial handler call
      this.onResize();

      // handle events
      $win.on('load resize orientationchange', this.onResize)
      .on('scroll', this.onScroll);
    },

    defineExtraTop: function() {
      // define box's extra top dimension
      var extraTop;

      if (typeof this.options.extraTop === 'number') {
      	extraTop = this.options.extraTop;
      } else if (typeof this.options.extraTop === 'function') {
      	extraTop = this.options.extraTop();
      }

      this.extraTop = this.options.positionType === 'absolute' ?
      extraTop :
      Math.min(this.winParams.height - this.data.boxFullHeight, extraTop);
    },

    checkStickyPermission: function() {
      // check the permission to set sticky
      this.isStickyEnabled = this.moveInContainer ?
      this.data.containerOffsetTop + this.data.containerHeight > this.data.boxFullHeight + this.data.boxOffsetTop + this.options.extraBottom :
      true;
    },

    getParentForActive: function() {
    	if (this.isWrap) {
    		return this.$stickyBoxWrap;
    	}

    	if (this.$container.length) {
    		return this.$container;
    	}

    	return this.$stickyBox;
    },

    getWrapClass: function() {
      // get set of container classes
      try {
      	return this.$stickyBox.attr('class').split(' ').map(function(name) {
      		return 'sticky-wrap-' + name;
      	}).join(' ');
      } catch (err) {
      	return 'sticky-wrap';
      }
    },

    resetState: function() {
      // reset dimensions and state
      this.stickyFlag = false;
      this.$stickyBox.css({
      	'-webkit-transition': '',
      	'-webkit-transform': '',
      	transition: '',
      	transform: '',
      	position: '',
      	width: '',
      	left: '',
      	top: ''
      }).removeClass(this.options.activeClass);

      if (this.isWrap) {
      	this.$stickyBoxWrap.removeClass(this.options.activeClass).removeAttr('style');
      }

      if (this.moveInContainer) {
      	this.$container.removeClass(this.options.activeClass);
      }
    },

    recalculateOffsets: function() {
      // define box and container dimensions
      this.winParams = this.getWindowParams();

      this.data = $.extend(
      	this.getBoxOffsets(),
      	this.getContainerOffsets()
      	);

      this.defineExtraTop();
    },

    getBoxOffsets: function() {
    	function offetTop(obj){
    		obj.top = 0;
    		return obj
    	}
    	var boxOffset = this.$stickyBox.css('position') ==='fixed' ? offetTop(this.$stickyBox.offset()) : this.$stickyBox.offset();
    	var boxPosition = this.$stickyBox.position();

    	return {
        // sticky box offsets
        boxOffsetLeft: boxOffset.left,
        boxOffsetTop: boxOffset.top,
        // sticky box positions
        boxTopPosition: boxPosition.top,
        boxLeftPosition: boxPosition.left,
        // sticky box width/height
        boxFullHeight: this.$stickyBox.outerHeight(true),
        boxHeight: this.$stickyBox.outerHeight(),
        boxWidth: this.$stickyBox.outerWidth()
      };
    },

    getContainerOffsets: function() {
    	var containerOffset = this.moveInContainer ? this.$container.offset() : null;

    	return containerOffset ? {
        // container offsets
        containerOffsetLeft: containerOffset.left,
        containerOffsetTop: containerOffset.top,
        // container height
        containerHeight: this.$container.outerHeight()
      } : {};
    },

    getWindowParams: function() {
    	return {
    		height: window.innerHeight || document.documentElement.clientHeight
    	};
    },

    makeCallback: function(name) {
    	if (typeof this.options[name] === 'function') {
    		var args = Array.prototype.slice.call(arguments);
    		args.shift();
    		this.options[name].apply(this, args);
    	}
    },

    destroy: function() {
    	this.isInit = false;
      // remove event handlers and styles
      $win.off('load resize orientationchange', this.onResize)
      .off('scroll', this.onScroll);
      this.resetState();
      this.$stickyBox.removeData('StickyScrollBlock');
      if (this.isWrap) {
      	this.$stickyBox.unwrap();
      }
      this.makeCallback('onDestroy');
    }
  };

  var stickyMethods = {
  	fixed: {
  		scrollHandler: function() {
  			this.winScrollTop = $win.scrollTop();
  			var isActiveSticky = this.winScrollTop -
  			(this.options.showAfterScrolled ? this.extraTop : 0) -
  			(this.options.showAfterScrolled ? this.data.boxHeight + this.extraTop : 0) >
  			this.data.boxOffsetTop - this.extraTop;

  			if (isActiveSticky) {
  				this.isStickyEnabled && this.stickyOn();
  			} else {
  				this.stickyOff();
  			}
  		},

  		stickyOn: function() {
  			if (!this.stickyFlag) {
  				this.stickyFlag = true;
  				this.parentForActive.addClass(this.options.activeClass);
  				this.$stickyBox.css({
  					width: this.data.boxWidth,
  					position: this.options.positionType
  				});
  				if (this.isWrap) {
  					this.$stickyBoxWrap.css({
  						height: this.data.boxFullHeight
  					});
  				}
  				this.makeCallback('fixedOn');
  			}
  			this.setDynamicPosition();
  		},

  		stickyOff: function() {
  			if (this.stickyFlag) {
  				this.stickyFlag = false;
  				this.resetState();
  				this.makeCallback('fixedOff');
  			}
  		},

  		setDynamicPosition: function() {
  			this.$stickyBox.css({
  				top: this.getTopPosition(),
  				left: this.data.boxOffsetLeft - $win.scrollLeft()
  			});
  		},

  		getTopPosition: function() {
  			if (this.moveInContainer) {
  				var currScrollTop = this.winScrollTop + this.data.boxHeight + this.options.extraBottom;

  				return Math.min(this.extraTop, (this.data.containerHeight + this.data.containerOffsetTop) - currScrollTop);
  			} else {
  				return this.extraTop;
  			}
  		}
  	},
  	absolute: {
  		scrollHandler: function() {
  			this.winScrollTop = $win.scrollTop();
  			var isActiveSticky = this.winScrollTop > this.data.boxOffsetTop - this.extraTop;

  			if (isActiveSticky) {
  				this.isStickyEnabled && this.stickyOn();
  			} else {
  				this.stickyOff();
  			}
  		},

  		stickyOn: function() {
  			if (!this.stickyFlag) {
  				this.stickyFlag = true;
  				this.parentForActive.addClass(this.options.activeClass);
  				this.$stickyBox.css({
  					width: this.data.boxWidth,
  					transition: 'transform ' + this.options.animSpeed + 's ease',
  					'-webkit-transition': 'transform ' + this.options.animSpeed + 's ease',
  				});

  				if (this.isWrap) {
  					this.$stickyBoxWrap.css({
  						height: this.data.boxFullHeight
  					});
  				}

  				this.makeCallback('fixedOn');
  			}

  			this.clearTimer();
  			this.timer = setTimeout(function() {
  				this.setDynamicPosition();
  			}.bind(this), this.options.animDelay * 1000);
  		},

  		stickyOff: function() {
  			if (this.stickyFlag) {
  				this.clearTimer();
  				this.stickyFlag = false;

  				this.timer = setTimeout(function() {
  					this.setDynamicPosition();
  					setTimeout(function() {
  						this.resetState();
  					}.bind(this), this.options.animSpeed * 1000);
  				}.bind(this), this.options.animDelay * 1000);
  				this.makeCallback('fixedOff');
  			}
  		},

  		clearTimer: function() {
  			clearTimeout(this.timer);
  		},

  		setDynamicPosition: function() {
  			var topPosition = Math.max(0, this.getTopPosition());

  			this.$stickyBox.css({
  				transform: 'translateY(' + topPosition + 'px)',
  				'-webkit-transform': 'translateY(' + topPosition + 'px)'
  			});
  		},

  		getTopPosition: function() {
  			var currTopPosition = this.winScrollTop - this.data.boxOffsetTop + this.extraTop;

  			if (this.moveInContainer) {
  				var currScrollTop = this.winScrollTop + this.data.boxHeight + this.options.extraBottom;
  				var diffOffset = Math.abs(Math.min(0, (this.data.containerHeight + this.data.containerOffsetTop) - currScrollTop - this.extraTop));

  				return currTopPosition - diffOffset;
  			} else {
  				return currTopPosition;
  			}
  		}
  	}
  };

  // jQuery plugin interface
  $.fn.stickyScrollBlock = function(opt) {
  	var args = Array.prototype.slice.call(arguments);
  	var method = args[0];

  	var options = $.extend({
  		container: null,
      positionType: 'fixed', // 'fixed' or 'absolute'
      activeClass: 'fixed-position',
      setBoxHeight: true,
      showAfterScrolled: false,
      extraTop: 0,
      extraBottom: 0,
      animDelay: 0.1,
      animSpeed: 0.2
    }, opt);

  	return this.each(function() {
  		var $stickyBox = jQuery(this);
  		var instance = $stickyBox.data('StickyScrollBlock');

  		if (typeof opt === 'object' || typeof opt === 'undefined') {
  			StickyScrollBlock.prototype = $.extend(stickyMethods[options.positionType], StickyScrollBlockPrototype);
  			$stickyBox.data('StickyScrollBlock', new StickyScrollBlock($stickyBox, options));
  		} else if (typeof method === 'string' && instance) {
  			if (typeof instance[method] === 'function') {
  				args.shift();
  				instance[method].apply(instance, args);
  			}
  		}
  	});
  };

  // module exports
  window.StickyScrollBlock = StickyScrollBlock;
}(jQuery, jQuery(window)));


/*
 * Responsive Layout helper
 */
 window.ResponsiveHelper = (function($){
  // init variables
  var handlers = [],
  prevWinWidth,
  win = $(window),
  nativeMatchMedia = false;

  // detect match media support
  if(window.matchMedia) {
  	if(window.Window && window.matchMedia === Window.prototype.matchMedia) {
  		nativeMatchMedia = true;
  	} else if(window.matchMedia.toString().indexOf('native') > -1) {
  		nativeMatchMedia = true;
  	}
  }

  // prepare resize handler
  function resizeHandler() {
  	var winWidth = win.width();
  	if(winWidth !== prevWinWidth) {
  		prevWinWidth = winWidth;

      // loop through range groups
      $.each(handlers, function(index, rangeObject){
        // disable current active area if needed
        $.each(rangeObject.data, function(property, item) {
        	if(item.currentActive && !matchRange(item.range[0], item.range[1])) {
        		item.currentActive = false;
        		if(typeof item.disableCallback === 'function') {
        			item.disableCallback();
        		}
        	}
        });

        // enable areas that match current width
        $.each(rangeObject.data, function(property, item) {
        	if(!item.currentActive && matchRange(item.range[0], item.range[1])) {
            // make callback
            item.currentActive = true;
            if(typeof item.enableCallback === 'function') {
            	item.enableCallback();
            }
          }
        });
      });
    }
  }
  win.bind('load resize orientationchange', resizeHandler);

  // test range
  function matchRange(r1, r2) {
  	var mediaQueryString = '';
  	if(r1 > 0) {
  		mediaQueryString += '(min-width: ' + r1 + 'px)';
  	}
  	if(r2 < Infinity) {
  		mediaQueryString += (mediaQueryString ? ' and ' : '') + '(max-width: ' + r2 + 'px)';
  	}
  	return matchQuery(mediaQueryString, r1, r2);
  }

  // media query function
  function matchQuery(query, r1, r2) {
  	if(window.matchMedia && nativeMatchMedia) {
  		return matchMedia(query).matches;
  	} else if(window.styleMedia) {
  		return styleMedia.matchMedium(query);
  	} else if(window.media) {
  		return media.matchMedium(query);
  	} else {
  		return prevWinWidth >= r1 && prevWinWidth <= r2;
  	}
  }

  // range parser
  function parseRange(rangeStr) {
  	var rangeData = rangeStr.split('..');
  	var x1 = parseInt(rangeData[0], 10) || -Infinity;
  	var x2 = parseInt(rangeData[1], 10) || Infinity;
  	return [x1, x2].sort(function(a, b){
  		return a - b;
  	});
  }

  // export public functions
  return {
  	addRange: function(ranges) {
      // parse data and add items to collection
      var result = {data:{}};
      $.each(ranges, function(property, data){
      	result.data[property] = {
      		range: parseRange(property),
      		enableCallback: data.on,
      		disableCallback: data.off
      	};
      });
      handlers.push(result);

      // call resizeHandler to recalculate all events
      prevWinWidth = null;
      resizeHandler();
    }
  };
}(jQuery));

/*
 * Simple Mobile Navigation
 */
 ;(function($) {
 	function MobileNav(options) {
 		this.options = $.extend({
 			container: null,
 			hideOnClickOutside: false,
 			menuActiveClass: 'nav-active',
 			menuOpener: '.nav-opener',
 			menuDrop: '.nav-drop',
 			toggleEvent: 'click',
 			outsideClickEvent: 'click touchstart pointerdown MSPointerDown'
 		}, options);
 		this.initStructure();
 		this.attachEvents();
 	}
 	MobileNav.prototype = {
 		initStructure: function() {
 			this.page = $('html');
 			this.container = $(this.options.container);
 			this.opener = this.container.find(this.options.menuOpener);
 			this.drop = this.container.find(this.options.menuDrop);
 		},
 		attachEvents: function() {
 			var self = this;

 			if(activateResizeHandler) {
 				activateResizeHandler();
 				activateResizeHandler = null;
 			}

 			this.outsideClickHandler = function(e) {
 				if(self.isOpened()) {
 					var target = $(e.target);
 					if(!target.closest(self.opener).length && !target.closest(self.drop).length) {
 						self.hide();
 					}
 				}
 			};

 			this.openerClickHandler = function(e) {
 				e.preventDefault();
 				self.toggle();
 			};

 			this.opener.on(this.options.toggleEvent, this.openerClickHandler);
 		},
 		isOpened: function() {
 			return this.container.hasClass(this.options.menuActiveClass);
 		},
 		show: function() {
 			this.container.addClass(this.options.menuActiveClass);
 			if(this.options.hideOnClickOutside) {
 				this.page.on(this.options.outsideClickEvent, this.outsideClickHandler);
 			}
 		},
 		hide: function() {
 			this.container.removeClass(this.options.menuActiveClass);
 			if(this.options.hideOnClickOutside) {
 				this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
 			}
 		},
 		toggle: function() {
 			if(this.isOpened()) {
 				this.hide();
 			} else {
 				this.show();
 			}
 		},
 		destroy: function() {
 			this.container.removeClass(this.options.menuActiveClass);
 			this.opener.off(this.options.toggleEvent, this.clickHandler);
 			this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
 		}
 	};

 	var activateResizeHandler = function() {
 		var win = $(window),
 		doc = $('html'),
 		resizeClass = 'resize-active',
 		flag, timer;
 		var removeClassHandler = function() {
 			flag = false;
 			doc.removeClass(resizeClass);
 		};
 		var resizeHandler = function() {
 			if(!flag) {
 				flag = true;
 				doc.addClass(resizeClass);
 			}
 			clearTimeout(timer);
 			timer = setTimeout(removeClassHandler, 500);
 		};
 		win.on('resize orientationchange', resizeHandler);
 	};

 	$.fn.mobileNav = function(options) {
 		return this.each(function() {
 			var params = $.extend({}, options, {container: this}),
 			instance = new MobileNav(params);
 			$.data(this, 'MobileNav', instance);
 		});
 	};
 }(jQuery));

/*
 * Responsive Layout helper
 */
 window.ResponsiveHelper = (function($){
  // init variables
  var handlers = [],
  prevWinWidth,
  win = $(window),
  nativeMatchMedia = false;

  // detect match media support
  if(window.matchMedia) {
  	if(window.Window && window.matchMedia === Window.prototype.matchMedia) {
  		nativeMatchMedia = true;
  	} else if(window.matchMedia.toString().indexOf('native') > -1) {
  		nativeMatchMedia = true;
  	}
  }

  // prepare resize handler
  function resizeHandler() {
  	var winWidth = win.width();
  	if(winWidth !== prevWinWidth) {
  		prevWinWidth = winWidth;

      // loop through range groups
      $.each(handlers, function(index, rangeObject){
        // disable current active area if needed
        $.each(rangeObject.data, function(property, item) {
        	if(item.currentActive && !matchRange(item.range[0], item.range[1])) {
        		item.currentActive = false;
        		if(typeof item.disableCallback === 'function') {
        			item.disableCallback();
        		}
        	}
        });

        // enable areas that match current width
        $.each(rangeObject.data, function(property, item) {
        	if(!item.currentActive && matchRange(item.range[0], item.range[1])) {
            // make callback
            item.currentActive = true;
            if(typeof item.enableCallback === 'function') {
            	item.enableCallback();
            }
          }
        });
      });
    }
  }
  win.bind('load resize orientationchange', resizeHandler);

  // test range
  function matchRange(r1, r2) {
  	var mediaQueryString = '';
  	if(r1 > 0) {
  		mediaQueryString += '(min-width: ' + r1 + 'px)';
  	}
  	if(r2 < Infinity) {
  		mediaQueryString += (mediaQueryString ? ' and ' : '') + '(max-width: ' + r2 + 'px)';
  	}
  	return matchQuery(mediaQueryString, r1, r2);
  }

  // media query function
  function matchQuery(query, r1, r2) {
  	if(window.matchMedia && nativeMatchMedia) {
  		return matchMedia(query).matches;
  	} else if(window.styleMedia) {
  		return styleMedia.matchMedium(query);
  	} else if(window.media) {
  		return media.matchMedium(query);
  	} else {
  		return prevWinWidth >= r1 && prevWinWidth <= r2;
  	}
  }

  // range parser
  function parseRange(rangeStr) {
  	var rangeData = rangeStr.split('..');
  	var x1 = parseInt(rangeData[0], 10) || -Infinity;
  	var x2 = parseInt(rangeData[1], 10) || Infinity;
  	return [x1, x2].sort(function(a, b){
  		return a - b;
  	});
  }

  // export public functions
  return {
  	addRange: function(ranges) {
      // parse data and add items to collection
      var result = {data:{}};
      $.each(ranges, function(property, data){
      	result.data[property] = {
      		range: parseRange(property),
      		enableCallback: data.on,
      		disableCallback: data.off
      	};
      });
      handlers.push(result);

      // call resizeHandler to recalculate all events
      prevWinWidth = null;
      resizeHandler();
    }
  };
}(jQuery));

 /*
 * jQuery Open/Close plugin
 */
 ;(function($) {
 	function OpenClose(options) {
 		this.options = $.extend({
 			addClassBeforeAnimation: true,
 			hideOnClickOutside: false,
 			activeClass: 'active',
 			opener: '.opener',
 			slider: '.slide',
 			animSpeed: 400,
 			effect: 'fade',
 			event: 'click'
 		}, options);
 		this.init();
 	}
 	OpenClose.prototype = {
 		init: function() {
 			if (this.options.holder) {
 				this.findElements();
 				this.attachEvents();
 				this.makeCallback('onInit', this);
 			}
 		},
 		findElements: function() {
 			this.holder = $(this.options.holder);
 			this.opener = this.holder.find(this.options.opener);
 			this.slider = this.holder.find(this.options.slider);
 		},
 		attachEvents: function() {
      // add handler
      var self = this;
      this.eventHandler = function(e) {
      	e.preventDefault();
      	if (self.slider.hasClass(slideHiddenClass)) {
      		self.showSlide();
      	} else {
      		self.hideSlide();
      	}
      };
      self.opener.on(self.options.event, this.eventHandler);

      // hover mode handler
      if (self.options.event === 'hover') {
      	self.opener.on('mouseenter', function() {
      		if (!self.holder.hasClass(self.options.activeClass)) {
      			self.showSlide();
      		}
      	});
      	self.holder.on('mouseleave', function() {
      		self.hideSlide();
      	});
      }

      // outside click handler
      self.outsideClickHandler = function(e) {
      	if (self.options.hideOnClickOutside) {
      		var target = $(e.target);
      		if (!target.is(self.holder) && !target.closest(self.holder).length) {
      			self.hideSlide();
      		}
      	}
      };

      // set initial styles
      if (this.holder.hasClass(this.options.activeClass)) {
      	$(document).on('click touchstart', self.outsideClickHandler);
      } else {
      	this.slider.addClass(slideHiddenClass);
      }
    },
    showSlide: function() {
    	var self = this;
    	if (self.options.addClassBeforeAnimation) {
    		self.holder.addClass(self.options.activeClass);
    	}
    	self.slider.removeClass(slideHiddenClass);
    	$(document).on('click touchstart', self.outsideClickHandler);

    	self.makeCallback('animStart', true);
    	toggleEffects[self.options.effect].show({
    		box: self.slider,
    		speed: self.options.animSpeed,
    		complete: function() {
    			if (!self.options.addClassBeforeAnimation) {
    				self.holder.addClass(self.options.activeClass);
    			}
    			self.makeCallback('animEnd', true);
    		}
    	});
    },
    hideSlide: function() {
    	var self = this;
    	if (self.options.addClassBeforeAnimation) {
    		self.holder.removeClass(self.options.activeClass);
    	}
    	$(document).off('click touchstart', self.outsideClickHandler);

    	self.makeCallback('animStart', false);
    	toggleEffects[self.options.effect].hide({
    		box: self.slider,
    		speed: self.options.animSpeed,
    		complete: function() {
    			if (!self.options.addClassBeforeAnimation) {
    				self.holder.removeClass(self.options.activeClass);
    			}
    			self.slider.addClass(slideHiddenClass);
    			self.makeCallback('animEnd', false);
    		}
    	});
    },
    destroy: function() {
    	this.slider.removeClass(slideHiddenClass).css({
    		display: ''
    	});
    	this.opener.off(this.options.event, this.eventHandler);
    	this.holder.removeClass(this.options.activeClass).removeData('OpenClose');
    	$(document).off('click touchstart', this.outsideClickHandler);
    },
    makeCallback: function(name) {
    	if (typeof this.options[name] === 'function') {
    		var args = Array.prototype.slice.call(arguments);
    		args.shift();
    		this.options[name].apply(this, args);
    	}
    }
  };

  // add stylesheet for slide on DOMReady
  var slideHiddenClass = 'js-slide-hidden';
  (function() {
  	var tabStyleSheet = $('<style type="text/css">')[0];
  	var tabStyleRule = '.' + slideHiddenClass;
  	tabStyleRule += '{position:absolute !important;left:-9999px !important;top:-9999px !important;display:block !important}';
  	if (tabStyleSheet.styleSheet) {
  		tabStyleSheet.styleSheet.cssText = tabStyleRule;
  	} else {
  		tabStyleSheet.appendChild(document.createTextNode(tabStyleRule));
  	}
  	$('head').append(tabStyleSheet);
  }());

  // animation effects
  var toggleEffects = {
  	slide: {
  		show: function(o) {
  			o.box.stop(true).hide().slideDown(o.speed, o.complete);
  		},
  		hide: function(o) {
  			o.box.stop(true).slideUp(o.speed, o.complete);
  		}
  	},
  	fade: {
  		show: function(o) {
  			o.box.stop(true).hide().fadeIn(o.speed, o.complete);
  		},
  		hide: function(o) {
  			o.box.stop(true).fadeOut(o.speed, o.complete);
  		}
  	},
  	none: {
  		show: function(o) {
  			o.box.hide().show(0, o.complete);
  		},
  		hide: function(o) {
  			o.box.hide(0, o.complete);
  		}
  	}
  };

  // jQuery plugin interface
  $.fn.openClose = function(opt) {
  	var args = Array.prototype.slice.call(arguments);
  	var method = args[0];

  	return this.each(function() {
  		var $holder = jQuery(this);
  		var instance = $holder.data('OpenClose');

  		if (typeof opt === 'object' || typeof opt === 'undefined') {
  			$holder.data('OpenClose', new OpenClose($.extend({
  				holder: this
  			}, opt)));
  		} else if (typeof method === 'string' && instance) {
  			if (typeof instance[method] === 'function') {
  				args.shift();
  				instance[method].apply(instance, args);
  			}
  		}
  	});
  };
}(jQuery));

/*!
 * jQuery Scrollify
 * Version 1.0.20
 * https://github.com/lukehaas/Scrollify
 */
 (function (global,factory) {
 	"use strict";
 	if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], function($) {
    	return factory($, global, global.document);
    });
  } else if (typeof module === 'object' && module.exports) {
    // Node/CommonJS
    module.exports = factory(require('jquery'), global, global.document);
  } else {
    // Browser globals
    factory(jQuery, global, global.document);
  }
}(typeof window !== 'undefined' ? window : this, function ($, window, document, undefined) {
	"use strict";
	var heights = [],
	names = [],
	elements = [],
	overflow = [],
	index = 0,
	currentIndex = 0,
	interstitialIndex = 1,
	hasLocation = false,
	timeoutId,
	timeoutId2,
	$window = $(window),
	portHeight,
	top = $window.scrollTop(),
	scrollable = false,
	locked = false,
	scrolled = false,
	manualScroll,
	swipeScroll,
	util,
	disabled = false,
	scrollSamples = [],
	scrollTime = new Date().getTime(),
	firstLoad = true,
	initialised = false,
	destination = 0,
	wheelEvent = 'onwheel' in document ? 'wheel' : document.onmousewheel !== undefined ? 'mousewheel' : 'DOMMouseScroll',
	settings = {
      //section should be an identifier that is the same for each section
      section: ".section",
      sectionName: "section-name",
      interstitialSection: "",
      easing: "easeOutExpo",
      scrollSpeed: 1100,
      offset: 0,
      scrollbars: true,
      target:"html,body",
      standardScrollElements: false,
      setHeights: true,
      overflowScroll:true,
      updateHash: true,
      touchScroll:true,
      before:function() {},
      after:function() {},
      afterResize:function() {},
      afterRender:function() {}
    };
    function getportHeight() {
    	return (window.innerHeight + settings.offset);
    }
    function animateScroll(index,instant,callbacks,toTop) {
    	if(currentIndex===index) {
    		callbacks = false;
    	}
    	if(disabled===true) {
    		return true;
    	}
    	if(names[index]) {
    		scrollable = false;
    		if(firstLoad===true) {
    			firstLoad = false;
    			settings.afterRender();
    		}
    		if(callbacks) {
    			if( typeof settings.before == 'function' && settings.before(index,elements) === false ){
    				return true;
    			}
    		}
    		interstitialIndex = 1;
    		destination = (!index) ? 0 : heights[index];
    		if(firstLoad===false && currentIndex>index && toTop===false) {
        //We're going backwards
        if(overflow[index]) {
        	portHeight = getportHeight();

        	interstitialIndex = parseInt(elements[index].outerHeight()/portHeight);

        	destination = parseInt(heights[index])+(elements[index].outerHeight()-portHeight);
        }
      }


      if(settings.updateHash && settings.sectionName && !(firstLoad===true && index===0)) {
      	if(history.pushState) {
      		try {
      			history.replaceState(null, null, names[index]);
      		} catch (e) {
      			if(window.console) {
      				console.warn("Scrollify warning: Page must be hosted to manipulate the hash value.");
      			}
      		}

      	} else {
      		window.location.hash = names[index];
      	}
      }

      currentIndex = index;
      if(instant) {
      	$(settings.target).stop().scrollTop(destination);
      	if(callbacks) {
      		settings.after(index,elements);
      	}
      } else {
      	locked = true;
      	if( $().velocity ) {
      		$(settings.target).stop().velocity('scroll', {
      			duration: settings.scrollSpeed,
      			easing: settings.easing,
      			offset: destination,
      			mobileHA: false
      		});
      	} else {
      		$(settings.target).stop().animate({
      			scrollTop: destination
      		}, settings.scrollSpeed,settings.easing);
      	}

      	if(window.location.hash.length && settings.sectionName && window.console) {
      		try {
      			if($(window.location.hash).length) {
      				console.warn("Scrollify warning: ID matches hash value - this will cause the page to anchor.");
      			}
      		} catch (e) {}
      	}
      	$(settings.target).promise().done(function(){
      		locked = false;
      		firstLoad = false;
      		if(callbacks) {
      			settings.after(index,elements);
      		}
      	});
      }

    }
  }

  function isAccelerating(samples) {
  	function average(num) {
  		var sum = 0;

  		var lastElements = samples.slice(Math.max(samples.length - num, 1));

  		for(var i = 0; i < lastElements.length; i++){
  			sum += lastElements[i];
  		}

  		return Math.ceil(sum/num);
  	}

  	var avEnd = average(10);
  	var avMiddle = average(70);

  	if(avEnd >= avMiddle) {
  		return true;
  	} else {
  		return false;
  	}
  }
  var scrollify = function(options) {
  	initialised = true;
  	$.easing['easeOutExpo'] = function(x, t, b, c, d) {
  		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
  	};

  	manualScroll = {
  		handleMousedown:function() {
  			if(disabled===true) {
  				return true;
  			}
  			scrollable = false;
  			scrolled = false;
  		},
  		handleMouseup:function() {
  			if(disabled===true) {
  				return true;
  			}
  			scrollable = true;
  			if(scrolled) {
          //instant,callbacks
          manualScroll.calculateNearest(false,true);
        }
      },
      handleScroll:function() {
      	if(disabled===true) {
      		return true;
      	}
      	if(timeoutId){
      		clearTimeout(timeoutId);
      	}

      	timeoutId = setTimeout(function(){
      		scrolled = true;
      		if(scrollable===false) {
      			return false;
      		}
      		scrollable = false;
          //instant,callbacks
          manualScroll.calculateNearest(false,true);
        }, 200);
      },
      calculateNearest:function(instant,callbacks) {
      	top = $window.scrollTop();
      	var i =1,
      	max = heights.length,
      	closest = 0,
      	prev = Math.abs(heights[0] - top),
      	diff;
      	for(;i<max;i++) {
      		diff = Math.abs(heights[i] - top);

      		if(diff < prev) {
      			prev = diff;
      			closest = i;
      		}
      	}
      	if((atBottom() && closest>index) || atTop()) {
      		index = closest;
          //index, instant, callbacks, toTop
          animateScroll(closest,instant,callbacks,false);
        }
      },
      wheelHandler:function(e) {
      	if(disabled===true) {
      		return true;
      	} else if(settings.standardScrollElements) {
      		if($(e.target).is(settings.standardScrollElements) || $(e.target).closest(settings.standardScrollElements).length) {
      			return true;
      		}
      	}
      	if(!overflow[index]) {
      		e.preventDefault();
      	}
      	var currentScrollTime = new Date().getTime();


      	e = e || window.event;
      	var value;
      	if (e.originalEvent) {
      		value = e.originalEvent.wheelDelta || -e.originalEvent.deltaY || -e.originalEvent.detail;
      	} else {
      		value = e.wheelDelta || -e.deltaY || -e.detail;
      	}
      	var delta = Math.max(-1, Math.min(1, value));

        //delta = delta || -e.originalEvent.detail / 3 || e.originalEvent.wheelDelta / 120;

        if(scrollSamples.length > 149){
        	scrollSamples.shift();
        }
        //scrollSamples.push(Math.abs(delta*10));
        scrollSamples.push(Math.abs(value));

        if((currentScrollTime-scrollTime) > 200){
        	scrollSamples = [];
        }
        scrollTime = currentScrollTime;


        if(locked) {
        	return false;
        }
        if(delta<0) {
        	if(index<heights.length-1) {
        		if(atBottom()) {
        			if(isAccelerating(scrollSamples)) {
        				e.preventDefault();
        				index++;
        				locked = true;
                //index, instant, callbacks, toTop
                animateScroll(index,false,true, false);
              } else {
              	return false;
              }
            }
          }
        } else if(delta>0) {
        	if(index>0) {
        		if(atTop()) {
        			if(isAccelerating(scrollSamples)) {
        				e.preventDefault();
        				index--;
        				locked = true;
                //index, instant, callbacks, toTop
                animateScroll(index,false,true, false);
              } else {
              	return false
              }
            }
          }
        }

      },
      keyHandler:function(e) {
      	if(disabled===true || document.activeElement.readOnly===false) {
      		return true;
      	} else if(settings.standardScrollElements) {
      		if($(e.target).is(settings.standardScrollElements) || $(e.target).closest(settings.standardScrollElements).length) {
      			return true;
      		}
      	}
      	if(locked===true) {
      		return false;
      	}
      	if(e.keyCode==38 || e.keyCode==33) {
      		if(index>0) {
      			if(atTop()) {
      				e.preventDefault();
      				index--;
              //index, instant, callbacks, toTop
              animateScroll(index,false,true,false);
            }
          }
        } else if(e.keyCode==40 || e.keyCode==34) {
        	if(index<heights.length-1) {
        		if(atBottom()) {
        			e.preventDefault();
        			index++;
              //index, instant, callbacks, toTop
              animateScroll(index,false,true,false);
            }
          }
        }
      },
      init:function() {
      	if(settings.scrollbars) {
      		$window.on('mousedown', manualScroll.handleMousedown);
      		$window.on('mouseup', manualScroll.handleMouseup);
      		$window.on('scroll', manualScroll.handleScroll);
      	} else {
      		$("body").css({"overflow":"hidden"});
      	}
      	window.addEventListener(wheelEvent, manualScroll.wheelHandler, { passive: false });
        //$(document).bind(wheelEvent,manualScroll.wheelHandler);
        $window.on('keydown', manualScroll.keyHandler);
      }
    };

    swipeScroll = {
    	touches : {
    		"touchstart": {"y":-1,"x":-1},
    		"touchmove" : {"y":-1,"x":-1},
    		"touchend"  : false,
    		"direction" : "undetermined"
    	},
    	options:{
    		"distance" : 30,
    		"timeGap" : 800,
    		"timeStamp" : new Date().getTime()
    	},
    	touchHandler: function(event) {
    		if(disabled===true) {
    			return true;
    		} else if(settings.standardScrollElements) {
    			if($(event.target).is(settings.standardScrollElements) || $(event.target).closest(settings.standardScrollElements).length) {
    				return true;
    			}
    		}
    		var touch;
    		if (typeof event !== 'undefined'){
    			if (typeof event.touches !== 'undefined') {
    				touch = event.touches[0];
    				switch (event.type) {
    					case 'touchstart':
    					swipeScroll.touches.touchstart.y = touch.pageY;
    					swipeScroll.touches.touchmove.y = -1;

    					swipeScroll.touches.touchstart.x = touch.pageX;
    					swipeScroll.touches.touchmove.x = -1;

    					swipeScroll.options.timeStamp = new Date().getTime();
    					swipeScroll.touches.touchend = false;
    					case 'touchmove':
    					swipeScroll.touches.touchmove.y = touch.pageY;
    					swipeScroll.touches.touchmove.x = touch.pageX;
    					if(swipeScroll.touches.touchstart.y!==swipeScroll.touches.touchmove.y && (Math.abs(swipeScroll.touches.touchstart.y-swipeScroll.touches.touchmove.y)>Math.abs(swipeScroll.touches.touchstart.x-swipeScroll.touches.touchmove.x))) {
                  //if(!overflow[index]) {
                  	event.preventDefault();
                  //}
                  swipeScroll.touches.direction = "y";
                  if((swipeScroll.options.timeStamp+swipeScroll.options.timeGap)<(new Date().getTime()) && swipeScroll.touches.touchend == false) {

                  	swipeScroll.touches.touchend = true;
                  	if (swipeScroll.touches.touchstart.y > -1) {

                  		if(Math.abs(swipeScroll.touches.touchmove.y-swipeScroll.touches.touchstart.y)>swipeScroll.options.distance) {
                  			if(swipeScroll.touches.touchstart.y < swipeScroll.touches.touchmove.y) {

                  				swipeScroll.up();

                  			} else {
                  				swipeScroll.down();

                  			}
                  		}
                  	}
                  }
                }
                break;
                case 'touchend':
                if(swipeScroll.touches[event.type]===false) {
                	swipeScroll.touches[event.type] = true;
                	if (swipeScroll.touches.touchstart.y > -1 && swipeScroll.touches.touchmove.y > -1 && swipeScroll.touches.direction==="y") {

                		if(Math.abs(swipeScroll.touches.touchmove.y-swipeScroll.touches.touchstart.y)>swipeScroll.options.distance) {
                			if(swipeScroll.touches.touchstart.y < swipeScroll.touches.touchmove.y) {
                				swipeScroll.up();

                			} else {
                				swipeScroll.down();

                			}
                		}
                		swipeScroll.touches.touchstart.y = -1;
                		swipeScroll.touches.touchstart.x = -1;
                		swipeScroll.touches.direction = "undetermined";
                	}
                }
                default:
                break;
              }
            }
          }
        },
        down: function() {

        	if(index<heights.length) {

        		if(atBottom() && index<heights.length-1) {

        			index++;
            //index, instant, callbacks, toTop
            animateScroll(index,false,true,false);
          } else {
          	portHeight = getportHeight();
          	if(Math.floor(elements[index].height()/portHeight)>interstitialIndex) {

          		interstitialScroll(parseInt(heights[index])+(portHeight*interstitialIndex));
          		interstitialIndex += 1;

          	} else {
          		interstitialScroll(parseInt(heights[index])+(elements[index].outerHeight()-portHeight));
          	}

          }
        }
      },
      up: function() {
      	if(index>=0) {
      		if(atTop() && index>0) {

      			index--;
            //index, instant, callbacks, toTop
            animateScroll(index,false,true,false);
          } else {

          	if(interstitialIndex>2) {
          		portHeight = getportHeight();

          		interstitialIndex -= 1;
          		interstitialScroll(parseInt(heights[index])+(portHeight*interstitialIndex));

          	} else {

          		interstitialIndex = 1;
          		interstitialScroll(parseInt(heights[index]));
          	}
          }

        }
      },
      init: function() {
      	if (document.addEventListener && settings.touchScroll) {
      		var eventListenerOptions = {
      			passive: false
      		};
      		document.addEventListener('touchstart', swipeScroll.touchHandler, eventListenerOptions);
      		document.addEventListener('touchmove', swipeScroll.touchHandler, eventListenerOptions);
      		document.addEventListener('touchend', swipeScroll.touchHandler, eventListenerOptions);
      	}
      }
    };


    util = {
    	refresh:function(withCallback,scroll) {
    		clearTimeout(timeoutId2);
    		timeoutId2 = setTimeout(function() {
          //retain position
          sizePanels(true);
          //scroll, firstLoad
          calculatePositions(scroll,false);
          if(withCallback) {
          	settings.afterResize();
          }
        },400);
    	},
    	handleUpdate:function() {
        //callbacks, scroll
        //changed from false,true to false,false
        util.refresh(false,false);
      },
      handleResize:function() {
        //callbacks, scroll
        util.refresh(true,false);
      },
      handleOrientation:function() {
        //callbacks, scroll
        util.refresh(true,true);
      }
    };
    settings = $.extend(settings, options);

    //retain position
    sizePanels(false);

    calculatePositions(false,true);

    if(true===hasLocation) {
      //index, instant, callbacks, toTop
      animateScroll(index,false,true,true);
    } else {
    	setTimeout(function() {
        //instant,callbacks
        manualScroll.calculateNearest(true,false);
      },200);
    }
    if(heights.length) {
    	manualScroll.init();
    	swipeScroll.init();

    	$window.on("resize",util.handleResize);
    	if (document.addEventListener) {
    		window.addEventListener("orientationchange", util.handleOrientation, false);
    	}
    }
    function interstitialScroll(pos) {
    	if( $().velocity ) {
    		$(settings.target).stop().velocity('scroll', {
    			duration: settings.scrollSpeed,
    			easing: settings.easing,
    			offset: pos,
    			mobileHA: false
    		});
    	} else {
    		$(settings.target).stop().animate({
    			scrollTop: pos
    		}, settings.scrollSpeed,settings.easing);
    	}
    }

    function sizePanels(keepPosition) {
    	if(keepPosition) {
    		top = $window.scrollTop();
    	}

    	var selector = settings.section;
    	overflow = [];
    	if(settings.interstitialSection.length) {
    		selector += "," + settings.interstitialSection;
    	}
    	if(settings.scrollbars===false) {
    		settings.overflowScroll = false;
    	}
    	portHeight = getportHeight();
    	$(selector).each(function(i) {
    		var $this = $(this);

    		if(settings.setHeights) {
    			if($this.is(settings.interstitialSection)) {
    				overflow[i] = false;
    			} else {
    				if(($this.css("height","auto").outerHeight()<portHeight) || $this.css("overflow")==="hidden") {
    					$this.css({"height":portHeight});

    					overflow[i] = false;
    				} else {

    					$this.css({"height":$this.outerHeight()});

    					if(settings.overflowScroll) {
    						overflow[i] = true;
    					} else {
    						overflow[i] = false;
    					}
    				}

    			}

    		} else {

    			if(($this.outerHeight()<portHeight) || (settings.overflowScroll===false)) {
    				overflow[i] = false;
    			} else {
    				overflow[i] = true;
    			}
    		}
    	});
    	if(keepPosition) {
    		$window.scrollTop(top);
    	}
    }
    function calculatePositions(scroll,firstLoad) {
    	var selector = settings.section;
    	if(settings.interstitialSection.length) {
    		selector += "," + settings.interstitialSection;
    	}
    	heights = [];
    	names = [];
    	elements = [];
    	$(selector).each(function(i){
    		var $this = $(this);
    		if(i>0) {
    			heights[i] = parseInt($this.offset().top) + settings.offset;
    		} else {
    			heights[i] = parseInt($this.offset().top);
    		}
    		if(settings.sectionName && $this.data(settings.sectionName)) {
    			names[i] = "#" + $this.data(settings.sectionName).toString().replace(/ /g,"-");
    		} else {
    			if($this.is(settings.interstitialSection)===false) {
    				names[i] = "#" + (i + 1);
    			} else {
    				names[i] = "#";
    				if(i===$(selector).length-1 && i>1) {
    					heights[i] = heights[i-1] + (parseInt($($(selector)[i-1]).outerHeight()) - parseInt($(window).height())) + parseInt($this.outerHeight());
    				}
    			}
    		}
    		elements[i] = $this;
    		try {
    			if($(names[i]).length && window.console) {
    				console.warn("Scrollify warning: Section names can't match IDs - this will cause the browser to anchor.");
    			}
    		} catch (e) {}

    		if(window.location.hash===names[i]) {
    			index = i;
    			hasLocation = true;
    		}

    	});

    	if(true===scroll) {
        //index, instant, callbacks, toTop
        animateScroll(index,false,false,false);
      }
    }

    function atTop() {
    	if(!overflow[index]) {
    		return true;
    	}
    	top = $window.scrollTop();
    	if(top>parseInt(heights[index])) {
    		return false;
    	} else {
    		return true;
    	}
    }
    function atBottom() {
    	if(!overflow[index]) {
    		return true;
    	}
    	top = $window.scrollTop();
    	portHeight = getportHeight();

    	if(top<parseInt(heights[index])+(elements[index].outerHeight()-portHeight)-28) {

    		return false;

    	} else {
    		return true;
    	}
    }
  }

  function move(panel,instant) {
  	var z = names.length;
  	for(;z>=0;z--) {
  		if(typeof panel === 'string') {
  			if (names[z]===panel) {
  				index = z;
          //index, instant, callbacks, toTop
          animateScroll(z,instant,true,true);
        }
      } else {
      	if(z===panel) {
      		index = z;
          //index, instant, callbacks, toTop
          animateScroll(z,instant,true,true);
        }
      }
    }
  }
  scrollify.move = function(panel) {
  	if(panel===undefined) {
  		return false;
  	}
  	if(panel.originalEvent) {
  		panel = $(this).attr("href");
  	}
  	move(panel,false);
  };
  scrollify.instantMove = function(panel) {
  	if(panel===undefined) {
  		return false;
  	}
  	move(panel,true);
  };
  scrollify.next = function() {
  	if(index<names.length) {
  		index += 1;
      //index, instant, callbacks, toTop
      animateScroll(index,false,true,true);
    }
  };
  scrollify.previous = function() {
  	if(index>0) {
  		index -= 1;
      //index, instant, callbacks, toTop
      animateScroll(index,false,true,true);
    }
  };
  scrollify.instantNext = function() {
  	if(index<names.length) {
  		index += 1;
      //index, instant, callbacks, toTop
      animateScroll(index,true,true,true);
    }
  };
  scrollify.instantPrevious = function() {
  	if(index>0) {
  		index -= 1;
      //index, instant, callbacks, toTop
      animateScroll(index,true,true,true);
    }
  };
  scrollify.destroy = function() {
  	if(!initialised) {
  		return false;
  	}
  	if(settings.setHeights) {
  		$(settings.section).each(function() {
  			$(this).css("height","auto");
  		});
  	}
  	$window.off("resize",util.handleResize);
  	if(settings.scrollbars) {
  		$window.off('mousedown', manualScroll.handleMousedown);
  		$window.off('mouseup', manualScroll.handleMouseup);
  		$window.off('scroll', manualScroll.handleScroll);
  	}
    // $window.off(wheelEvent,manualScroll.wheelHandler);
    window.removeEventListener(wheelEvent,manualScroll.wheelHandler);
    $window.off('keydown', manualScroll.keyHandler);

    if (document.addEventListener && settings.touchScroll) {
    	document.removeEventListener('touchstart', swipeScroll.touchHandler, false);
    	document.removeEventListener('touchmove', swipeScroll.touchHandler, false);
    	document.removeEventListener('touchend', swipeScroll.touchHandler, false);
    }
    heights = [];
    names = [];
    elements = [];
    overflow = [];
    firstLoad=true;
    initialised=false;
  };
  scrollify.update = function() {
  	if(!initialised) {
  		return false;
  	}
  	util.handleUpdate();
  };
  scrollify.current = function() {
  	return elements[index];
  };
  scrollify.currentIndex = function() {
  	return index;
  };
  scrollify.disable = function() {
  	disabled = true;
  };
  scrollify.enable = function() {
  	disabled = false;
  	if (initialised) {
      //instant,callbacks
      manualScroll.calculateNearest(false,false);
    }
  };
  scrollify.isDisabled = function() {
  	return disabled;
  };
  scrollify.setOptions = function(updatedOptions) {
  	if(!initialised) {
  		return false;
  	}
  	if(typeof updatedOptions === "object") {
  		settings = $.extend(settings, updatedOptions);
  		util.handleUpdate();
  	} else if(window.console) {
  		console.warn("Scrollify warning: setOptions expects an object.");
  	}
  };
  $.scrollify = scrollify;
  return scrollify;
}));

/**
 * Created by IntelliJ IDEA.
 *
 * User: phil
 * Date: 15/11/12
 * Time: 11:04 AM
 *
 */
 (function ($) {

 	var self = this, container, running=false, currentY = 0, targetY = 0, oldY = 0, maxScrollTop= 0, minScrollTop, direction, onRenderCallback=null,
            fricton = 0.95, // higher value for slower deceleration
            vy = 0,
            stepAmt = 1,
            minMovement= 0.1,
            ts=0.1;

            var updateScrollTarget = function (amt) {
            	targetY += amt;
            	vy += (targetY - oldY) * stepAmt;

            	oldY = targetY;


            }
            var render = function () {
            	if (vy < -(minMovement) || vy > minMovement) {

            		currentY = (currentY + vy);
            		if (currentY > maxScrollTop) {
            			currentY = vy = 0;
            		} else if (currentY < minScrollTop) {
            			vy = 0;
            			currentY = minScrollTop;
            		}

            		container.scrollTop(-currentY);

            		vy *= fricton;

         //   vy += ts * (currentY-targetY);
            // scrollTopTweened += settings.tweenSpeed * (scrollTop - scrollTopTweened);
            // currentY += ts * (targetY - currentY);

            if(onRenderCallback){
            	onRenderCallback();
            }
          }
        }
        var animateLoop = function () {
        	if(! running)return;
        	requestAnimFrame(animateLoop);
        	render();
        //log("45","animateLoop","animateLoop", "",stop);
      }
      var onWheel = function (e) {
      	e.preventDefault();
      	var evt = e.originalEvent;

      	var delta = evt.detail ? evt.detail * -1 : evt.wheelDelta / 40;
      	var dir = delta < 0 ? -1 : 1;
      	if (dir != direction) {
      		vy = 0;
      		direction = dir;
      	}

        //reset currentY in case non-wheel scroll has occurred (scrollbar drag, etc.)
        currentY = -container.scrollTop();
        
        updateScrollTarget(delta);
      }

    /*
     * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
     */
     window.requestAnimFrame = (function () {
     	return  window.requestAnimationFrame ||
     	window.webkitRequestAnimationFrame ||
     	window.mozRequestAnimationFrame ||
     	window.oRequestAnimationFrame ||
     	window.msRequestAnimationFrame ||
     	function (callback) {
     		window.setTimeout(callback, 1000 / 60);
     	}; 


     })();

    /*
     * http://jsbin.com/iqafek/2/edit
     */
     var normalizeWheelDelta = function () {
        // Keep a distribution of observed values, and scale by the
        // 33rd percentile.
        var distribution = [], done = null, scale = 30;
        return function (n) {
            // Zeroes don't count.
            if (n == 0) return n;
            // After 500 samples, we stop sampling and keep current factor.
            if (done != null) return n * done;
            var abs = Math.abs(n);
            // Insert value (sorted in ascending order).
            outer: do { // Just used for break goto
            	for (var i = 0; i < distribution.length; ++i) {
            		if (abs <= distribution[i]) {
            			distribution.splice(i, 0, abs);
            			break outer;
            		}
            	}
            	distribution.push(abs);
            } while (false);
            // Factor is scale divided by 33rd percentile.
            var factor = scale / distribution[Math.floor(distribution.length / 3)];
            if (distribution.length == 500) done = factor;
            return n * factor;
          };
        }();


        $.fn.smoothWheel = function () {
        //  var args = [].splice.call(arguments, 0);
        var options = jQuery.extend({}, arguments[0]);
        return this.each(function (index, elm) {

        	if(!('ontouchstart' in window)){
        		container = $(this);
        		container.bind("mousewheel", onWheel);
        		container.bind("DOMMouseScroll", onWheel);

                //set target/old/current Y to match current scroll position to prevent jump to top of container
                targetY = oldY = container.get(0).scrollTop;
                currentY = -targetY;
                
                minScrollTop = container.get(0).clientHeight - container.get(0).scrollHeight;
                if(options.onRender){
                	onRenderCallback = options.onRender;
                }
                if(options.remove){
                	log("122","smoothWheel","remove", "");
                	running=false;
                	container.unbind("mousewheel", onWheel);
                	container.unbind("DOMMouseScroll", onWheel);
                }else if(!running){
                	running=true;
                	animateLoop();
                }

              }
            });
      };


    })(jQuery);

// ==================================================
// fancyBox v3.3.5
// ==================================================
!function(t,e,n,o){"use strict";function i(t,e){var o,i,a=[],s=0;t&&t.isDefaultPrevented()||(t.preventDefault(),e=t&&t.data?t.data.options:e||{},o=e.$target||n(t.currentTarget),i=o.attr("data-fancybox")||"",i?(a=e.selector?n(e.selector):t.data?t.data.items:[],a=a.length?a.filter('[data-fancybox="'+i+'"]'):n('[data-fancybox="'+i+'"]'),s=a.index(o),s<0&&(s=0)):a=[o],n.fancybox.open(a,e,s))}if(t.console=t.console||{info:function(t){}},n){if(n.fn.fancybox)return void console.info("fancyBox already initialized");var a={loop:!1,gutter:50,keyboard:!0,arrows:!0,infobar:!0,smallBtn:"auto",toolbar:"auto",buttons:["zoom","thumbs","close"],idleTime:3,protect:!1,modal:!1,image:{preload:!1},ajax:{settings:{data:{fancybox:!0}}},iframe:{tpl:'<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen allowtransparency="true" src=""></iframe>',preload:!0,css:{},attr:{scrolling:"auto"}},defaultType:"image",animationEffect:"zoom",animationDuration:366,zoomOpacity:"auto",transitionEffect:"fade",transitionDuration:366,slideClass:"",baseClass:"",baseTpl:'<div class="fancybox-container" role="dialog" tabindex="-1"><div class="fancybox-bg"></div><div class="fancybox-inner"><div class="fancybox-infobar"><span data-fancybox-index></span>&nbsp;/&nbsp;<span data-fancybox-count></span></div><div class="fancybox-toolbar">{{buttons}}</div><div class="fancybox-navigation">{{arrows}}</div><div class="fancybox-stage"></div><div class="fancybox-caption"></div></div></div>',spinnerTpl:'<div class="fancybox-loading"></div>',errorTpl:'<div class="fancybox-error"><p>{{ERROR}}</p></div>',btnTpl:{download:'<a download data-fancybox-download class="fancybox-button fancybox-button--download" title="{{DOWNLOAD}}" href="javascript:;"><svg viewBox="0 0 40 40"><path d="M13,16 L20,23 L27,16 M20,7 L20,23 M10,24 L10,28 L30,28 L30,24" /></svg></a>',zoom:'<button data-fancybox-zoom class="fancybox-button fancybox-button--zoom" title="{{ZOOM}}"><svg viewBox="0 0 40 40"><path d="M18,17 m-8,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0 M24,22 L31,29" /></svg></button>',close:'<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}"><svg viewBox="0 0 40 40"><path d="M10,10 L30,30 M30,10 L10,30" /></svg></button>',smallBtn:'<button data-fancybox-close class="fancybox-close-small" title="{{CLOSE}}"><svg viewBox="0 0 32 32"><path d="M10,10 L22,22 M22,10 L10,22"></path></svg></button>',arrowLeft:'<a data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}" href="javascript:;"><svg viewBox="0 0 40 40"><path d="M18,12 L10,20 L18,28 M10,20 L30,20"></path></svg></a>',arrowRight:'<a data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}" href="javascript:;"><svg viewBox="0 0 40 40"><path d="M10,20 L30,20 M22,12 L30,20 L22,28"></path></svg></a>'},parentEl:"body",autoFocus:!1,backFocus:!0,trapFocus:!0,fullScreen:{autoStart:!1},touch:{vertical:!0,momentum:!0},hash:null,media:{},slideShow:{autoStart:!1,speed:4e3},thumbs:{autoStart:!1,hideOnClose:!0,parentEl:".fancybox-container",axis:"y"},wheel:"auto",onInit:n.noop,beforeLoad:n.noop,afterLoad:n.noop,beforeShow:n.noop,afterShow:n.noop,beforeClose:n.noop,afterClose:n.noop,onActivate:n.noop,onDeactivate:n.noop,clickContent:function(t,e){return"image"===t.type&&"zoom"},clickSlide:"close",clickOutside:"close",dblclickContent:!1,dblclickSlide:!1,dblclickOutside:!1,mobile:{idleTime:!1,clickContent:function(t,e){return"image"===t.type&&"toggleControls"},clickSlide:function(t,e){return"image"===t.type?"toggleControls":"close"},dblclickContent:function(t,e){return"image"===t.type&&"zoom"},dblclickSlide:function(t,e){return"image"===t.type&&"zoom"}},lang:"en",i18n:{en:{CLOSE:"Close",NEXT:"Next",PREV:"Previous",ERROR:"The requested content cannot be loaded. <br/> Please try again later.",PLAY_START:"Start slideshow",PLAY_STOP:"Pause slideshow",FULL_SCREEN:"Full screen",THUMBS:"Thumbnails",DOWNLOAD:"Download",SHARE:"Share",ZOOM:"Zoom"},de:{CLOSE:"Schliessen",NEXT:"Weiter",PREV:"Zurück",ERROR:"Die angeforderten Daten konnten nicht geladen werden. <br/> Bitte versuchen Sie es später nochmal.",PLAY_START:"Diaschau starten",PLAY_STOP:"Diaschau beenden",FULL_SCREEN:"Vollbild",THUMBS:"Vorschaubilder",DOWNLOAD:"Herunterladen",SHARE:"Teilen",ZOOM:"Maßstab"}}},s=n(t),r=n(e),c=0,l=function(t){return t&&t.hasOwnProperty&&t instanceof n},d=function(){return t.requestAnimationFrame||t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||t.oRequestAnimationFrame||function(e){return t.setTimeout(e,1e3/60)}}(),u=function(){var t,n=e.createElement("fakeelement"),i={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(t in i)if(n.style[t]!==o)return i[t];return"transitionend"}(),f=function(t){return t&&t.length&&t[0].offsetHeight},p=function(t,e){var o=n.extend(!0,{},t,e);return n.each(e,function(t,e){n.isArray(e)&&(o[t]=e)}),o},h=function(t,o,i){var a=this;a.opts=p({index:i},n.fancybox.defaults),n.isPlainObject(o)&&(a.opts=p(a.opts,o)),n.fancybox.isMobile&&(a.opts=p(a.opts,a.opts.mobile)),a.id=a.opts.id||++c,a.currIndex=parseInt(a.opts.index,10)||0,a.prevIndex=null,a.prevPos=null,a.currPos=0,a.firstRun=!0,a.group=[],a.slides={},a.addContent(t),a.group.length&&(a.$lastFocus=n(e.activeElement).trigger("blur"),a.init())};n.extend(h.prototype,{init:function(){var i,a,s,r=this,c=r.group[r.currIndex],l=c.opts,d=n.fancybox.scrollbarWidth;n.fancybox.getInstance()||l.hideScrollbar===!1||(n("body").addClass("fancybox-active"),!n.fancybox.isMobile&&e.body.scrollHeight>t.innerHeight&&(d===o&&(i=n('<div style="width:100px;height:100px;overflow:scroll;" />').appendTo("body"),d=n.fancybox.scrollbarWidth=i[0].offsetWidth-i[0].clientWidth,i.remove()),n("head").append('<style id="fancybox-style-noscroll" type="text/css">.compensate-for-scrollbar { margin-right: '+d+"px; }</style>"),n("body").addClass("compensate-for-scrollbar"))),s="",n.each(l.buttons,function(t,e){s+=l.btnTpl[e]||""}),a=n(r.translate(r,l.baseTpl.replace("{{buttons}}",s).replace("{{arrows}}",l.btnTpl.arrowLeft+l.btnTpl.arrowRight))).attr("id","fancybox-container-"+r.id).addClass("fancybox-is-hidden").addClass(l.baseClass).data("FancyBox",r).appendTo(l.parentEl),r.$refs={container:a},["bg","inner","infobar","toolbar","stage","caption","navigation"].forEach(function(t){r.$refs[t]=a.find(".fancybox-"+t)}),r.trigger("onInit"),r.activate(),r.jumpTo(r.currIndex)},translate:function(t,e){var n=t.opts.i18n[t.opts.lang];return e.replace(/\{\{(\w+)\}\}/g,function(t,e){var i=n[e];return i===o?t:i})},addContent:function(t){var e,i=this,a=n.makeArray(t);n.each(a,function(t,e){var a,s,r,c,l,d={},u={};n.isPlainObject(e)?(d=e,u=e.opts||e):"object"===n.type(e)&&n(e).length?(a=n(e),u=a.data()||{},u=n.extend(!0,{},u,u.options),u.$orig=a,d.src=i.opts.src||u.src||a.attr("href"),d.type||d.src||(d.type="inline",d.src=e)):d={type:"html",src:e+""},d.opts=n.extend(!0,{},i.opts,u),n.isArray(u.buttons)&&(d.opts.buttons=u.buttons),s=d.type||d.opts.type,c=d.src||"",!s&&c&&((r=c.match(/\.(mp4|mov|ogv)((\?|#).*)?$/i))?(s="video",d.opts.videoFormat||(d.opts.videoFormat="video/"+("ogv"===r[1]?"ogg":r[1]))):c.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i)?s="image":c.match(/\.(pdf)((\?|#).*)?$/i)?s="iframe":"#"===c.charAt(0)&&(s="inline")),s?d.type=s:i.trigger("objectNeedsType",d),d.contentType||(d.contentType=n.inArray(d.type,["html","inline","ajax"])>-1?"html":d.type),d.index=i.group.length,"auto"==d.opts.smallBtn&&(d.opts.smallBtn=n.inArray(d.type,["html","inline","ajax"])>-1),"auto"===d.opts.toolbar&&(d.opts.toolbar=!d.opts.smallBtn),d.opts.$trigger&&d.index===i.opts.index&&(d.opts.$thumb=d.opts.$trigger.find("img:first")),d.opts.$thumb&&d.opts.$thumb.length||!d.opts.$orig||(d.opts.$thumb=d.opts.$orig.find("img:first")),"function"===n.type(d.opts.caption)&&(d.opts.caption=d.opts.caption.apply(e,[i,d])),"function"===n.type(i.opts.caption)&&(d.opts.caption=i.opts.caption.apply(e,[i,d])),d.opts.caption instanceof n||(d.opts.caption=d.opts.caption===o?"":d.opts.caption+""),"ajax"===d.type&&(l=c.split(/\s+/,2),l.length>1&&(d.src=l.shift(),d.opts.filter=l.shift())),d.opts.modal&&(d.opts=n.extend(!0,d.opts,{infobar:0,toolbar:0,smallBtn:0,keyboard:0,slideShow:0,fullScreen:0,thumbs:0,touch:0,clickContent:!1,clickSlide:!1,clickOutside:!1,dblclickContent:!1,dblclickSlide:!1,dblclickOutside:!1})),i.group.push(d)}),Object.keys(i.slides).length&&(i.updateControls(),e=i.Thumbs,e&&e.isActive&&(e.create(),e.focus()))},addEvents:function(){var o=this;o.removeEvents(),o.$refs.container.on("click.fb-close","[data-fancybox-close]",function(t){t.stopPropagation(),t.preventDefault(),o.close(t)}).on("touchstart.fb-prev click.fb-prev","[data-fancybox-prev]",function(t){t.stopPropagation(),t.preventDefault(),o.previous()}).on("touchstart.fb-next click.fb-next","[data-fancybox-next]",function(t){t.stopPropagation(),t.preventDefault(),o.next()}).on("click.fb","[data-fancybox-zoom]",function(t){o[o.isScaledDown()?"scaleToActual":"scaleToFit"]()}),s.on("orientationchange.fb resize.fb",function(t){t&&t.originalEvent&&"resize"===t.originalEvent.type?d(function(){o.update()}):(o.$refs.stage.hide(),setTimeout(function(){o.$refs.stage.show(),o.update()},n.fancybox.isMobile?600:250))}),r.on("focusin.fb",function(t){var o=n.fancybox?n.fancybox.getInstance():null;o.isClosing||!o.current||!o.current.opts.trapFocus||n(t.target).hasClass("fancybox-container")||n(t.target).is(e)||o&&"fixed"!==n(t.target).css("position")&&!o.$refs.container.has(t.target).length&&(t.stopPropagation(),o.focus())}),r.on("keydown.fb",function(t){var e=o.current,i=t.keyCode||t.which;if(e&&e.opts.keyboard&&!(t.ctrlKey||t.altKey||t.shiftKey||n(t.target).is("input")||n(t.target).is("textarea")))return 8===i||27===i?(t.preventDefault(),void o.close(t)):37===i||38===i?(t.preventDefault(),void o.previous()):39===i||40===i?(t.preventDefault(),void o.next()):void o.trigger("afterKeydown",t,i)}),o.group[o.currIndex].opts.idleTime&&(o.idleSecondsCounter=0,r.on("mousemove.fb-idle mouseleave.fb-idle mousedown.fb-idle touchstart.fb-idle touchmove.fb-idle scroll.fb-idle keydown.fb-idle",function(t){o.idleSecondsCounter=0,o.isIdle&&o.showControls(),o.isIdle=!1}),o.idleInterval=t.setInterval(function(){o.idleSecondsCounter++,o.idleSecondsCounter>=o.group[o.currIndex].opts.idleTime&&!o.isDragging&&(o.isIdle=!0,o.idleSecondsCounter=0,o.hideControls())},1e3))},removeEvents:function(){var e=this;s.off("orientationchange.fb resize.fb"),r.off("focusin.fb keydown.fb .fb-idle"),this.$refs.container.off(".fb-close .fb-prev .fb-next"),e.idleInterval&&(t.clearInterval(e.idleInterval),e.idleInterval=null)},previous:function(t){return this.jumpTo(this.currPos-1,t)},next:function(t){return this.jumpTo(this.currPos+1,t)},jumpTo:function(t,e){var i,a,s,r,c,l,d,u=this,p=u.group.length;if(!(u.isDragging||u.isClosing||u.isAnimating&&u.firstRun)){if(t=parseInt(t,10),a=u.current?u.current.opts.loop:u.opts.loop,!a&&(t<0||t>=p))return!1;if(i=u.firstRun=!Object.keys(u.slides).length,!(p<2&&!i&&u.isDragging)){if(r=u.current,u.prevIndex=u.currIndex,u.prevPos=u.currPos,s=u.createSlide(t),p>1&&((a||s.index>0)&&u.createSlide(t-1),(a||s.index<p-1)&&u.createSlide(t+1)),u.current=s,u.currIndex=s.index,u.currPos=s.pos,u.trigger("beforeShow",i),u.updateControls(),l=n.fancybox.getTranslate(s.$slide),s.isMoved=(0!==l.left||0!==l.top)&&!s.$slide.hasClass("fancybox-animated"),s.forcedDuration=o,n.isNumeric(e)?s.forcedDuration=e:e=s.opts[i?"animationDuration":"transitionDuration"],e=parseInt(e,10),i)return s.opts.animationEffect&&e&&u.$refs.container.css("transition-duration",e+"ms"),u.$refs.container.removeClass("fancybox-is-hidden"),f(u.$refs.container),u.$refs.container.addClass("fancybox-is-open"),f(u.$refs.container),s.$slide.addClass("fancybox-slide--previous"),u.loadSlide(s),s.$slide.removeClass("fancybox-slide--previous").addClass("fancybox-slide--current"),void u.preload("image");n.each(u.slides,function(t,e){n.fancybox.stop(e.$slide)}),s.$slide.removeClass("fancybox-slide--next fancybox-slide--previous").addClass("fancybox-slide--current"),s.isMoved?(c=Math.round(s.$slide.width()),n.each(u.slides,function(t,o){var i=o.pos-s.pos;n.fancybox.animate(o.$slide,{top:0,left:i*c+i*o.opts.gutter},e,function(){o.$slide.removeAttr("style").removeClass("fancybox-slide--next fancybox-slide--previous"),o.pos===u.currPos&&(s.isMoved=!1,u.complete())})})):u.$refs.stage.children().removeAttr("style"),s.isLoaded?u.revealContent(s):u.loadSlide(s),u.preload("image"),r.pos!==s.pos&&(d="fancybox-slide--"+(r.pos>s.pos?"next":"previous"),r.$slide.removeClass("fancybox-slide--complete fancybox-slide--current fancybox-slide--next fancybox-slide--previous"),r.isComplete=!1,e&&(s.isMoved||s.opts.transitionEffect)&&(s.isMoved?r.$slide.addClass(d):(d="fancybox-animated "+d+" fancybox-fx-"+s.opts.transitionEffect,n.fancybox.animate(r.$slide,d,e,function(){r.$slide.removeClass(d).removeAttr("style")}))))}}},createSlide:function(t){var e,o,i=this;return o=t%i.group.length,o=o<0?i.group.length+o:o,!i.slides[t]&&i.group[o]&&(e=n('<div class="fancybox-slide"></div>').appendTo(i.$refs.stage),i.slides[t]=n.extend(!0,{},i.group[o],{pos:t,$slide:e,isLoaded:!1}),i.updateSlide(i.slides[t])),i.slides[t]},scaleToActual:function(t,e,i){var a,s,r,c,l,d=this,u=d.current,f=u.$content,p=n.fancybox.getTranslate(u.$slide).width,h=n.fancybox.getTranslate(u.$slide).height,g=u.width,b=u.height;!d.isAnimating&&f&&"image"==u.type&&u.isLoaded&&!u.hasError&&(n.fancybox.stop(f),d.isAnimating=!0,t=t===o?.5*p:t,e=e===o?.5*h:e,a=n.fancybox.getTranslate(f),a.top-=n.fancybox.getTranslate(u.$slide).top,a.left-=n.fancybox.getTranslate(u.$slide).left,c=g/a.width,l=b/a.height,s=.5*p-.5*g,r=.5*h-.5*b,g>p&&(s=a.left*c-(t*c-t),s>0&&(s=0),s<p-g&&(s=p-g)),b>h&&(r=a.top*l-(e*l-e),r>0&&(r=0),r<h-b&&(r=h-b)),d.updateCursor(g,b),n.fancybox.animate(f,{top:r,left:s,scaleX:c,scaleY:l},i||330,function(){d.isAnimating=!1}),d.SlideShow&&d.SlideShow.isActive&&d.SlideShow.stop())},scaleToFit:function(t){var e,o=this,i=o.current,a=i.$content;!o.isAnimating&&a&&"image"==i.type&&i.isLoaded&&!i.hasError&&(n.fancybox.stop(a),o.isAnimating=!0,e=o.getFitPos(i),o.updateCursor(e.width,e.height),n.fancybox.animate(a,{top:e.top,left:e.left,scaleX:e.width/a.width(),scaleY:e.height/a.height()},t||330,function(){o.isAnimating=!1}))},getFitPos:function(t){var e,n,o,i,a,s=this,r=t.$content,c=t.width||t.opts.width,l=t.height||t.opts.height,d={};return!!(t.isLoaded&&r&&r.length)&&(i={top:parseInt(t.$slide.css("paddingTop"),10),right:parseInt(t.$slide.css("paddingRight"),10),bottom:parseInt(t.$slide.css("paddingBottom"),10),left:parseInt(t.$slide.css("paddingLeft"),10)},e=parseInt(s.$refs.stage.width(),10)-(i.left+i.right),n=parseInt(s.$refs.stage.height(),10)-(i.top+i.bottom),c&&l||(c=e,l=n),o=Math.min(1,e/c,n/l),c=Math.floor(o*c),l=Math.floor(o*l),"image"===t.type?(d.top=Math.floor(.5*(n-l))+i.top,d.left=Math.floor(.5*(e-c))+i.left):"video"===t.contentType&&(a=t.opts.width&&t.opts.height?c/l:t.opts.ratio||16/9,l>c/a?l=c/a:c>l*a&&(c=l*a)),d.width=c,d.height=l,d)},update:function(){var t=this;n.each(t.slides,function(e,n){t.updateSlide(n)})},updateSlide:function(t,e){var o=this,i=t&&t.$content,a=t.width||t.opts.width,s=t.height||t.opts.height;i&&(a||s||"video"===t.contentType)&&!t.hasError&&(n.fancybox.stop(i),n.fancybox.setTranslate(i,o.getFitPos(t)),t.pos===o.currPos&&(o.isAnimating=!1,o.updateCursor())),t.$slide.trigger("refresh"),o.$refs.toolbar.toggleClass("compensate-for-scrollbar",t.$slide.get(0).scrollHeight>t.$slide.get(0).clientHeight),o.trigger("onUpdate",t)},centerSlide:function(t,e){var i,a,s=this;s.current&&(i=Math.round(t.$slide.width()),a=t.pos-s.current.pos,n.fancybox.animate(t.$slide,{top:0,left:a*i+a*t.opts.gutter,opacity:1},e===o?0:e,null,!1))},updateCursor:function(t,e){var o,i=this,a=i.current,s=i.$refs.container.removeClass("fancybox-is-zoomable fancybox-can-zoomIn fancybox-can-drag fancybox-can-zoomOut");a&&!i.isClosing&&(o=i.isZoomable(),s.toggleClass("fancybox-is-zoomable",o),n("[data-fancybox-zoom]").prop("disabled",!o),o&&("zoom"===a.opts.clickContent||n.isFunction(a.opts.clickContent)&&"zoom"===a.opts.clickContent(a))?i.isScaledDown(t,e)?s.addClass("fancybox-can-zoomIn"):a.opts.touch?s.addClass("fancybox-can-drag"):s.addClass("fancybox-can-zoomOut"):a.opts.touch&&"video"!==a.contentType&&s.addClass("fancybox-can-drag"))},isZoomable:function(){var t,e=this,n=e.current;if(n&&!e.isClosing&&"image"===n.type&&!n.hasError){if(!n.isLoaded)return!0;if(t=e.getFitPos(n),n.width>t.width||n.height>t.height)return!0}return!1},isScaledDown:function(t,e){var i=this,a=!1,s=i.current,r=s.$content;return t!==o&&e!==o?a=t<s.width&&e<s.height:r&&(a=n.fancybox.getTranslate(r),a=a.width<s.width&&a.height<s.height),a},canPan:function(){var t,e=this,n=!1,o=e.current;return"image"===o.type&&(t=o.$content)&&!o.hasError&&(n=e.getFitPos(o),n=Math.abs(t.width()-n.width)>1||Math.abs(t.height()-n.height)>1),n},loadSlide:function(t){var e,o,i,a=this;if(!t.isLoading&&!t.isLoaded){switch(t.isLoading=!0,a.trigger("beforeLoad",t),e=t.type,o=t.$slide,o.off("refresh").trigger("onReset").addClass(t.opts.slideClass),e){case"image":a.setImage(t);break;case"iframe":a.setIframe(t);break;case"html":a.setContent(t,t.src||t.content);break;case"video":a.setContent(t,'<video class="fancybox-video" controls controlsList="nodownload"><source src="'+t.src+'" type="'+t.opts.videoFormat+"\">Your browser doesn't support HTML5 video</video");break;case"inline":n(t.src).length?a.setContent(t,n(t.src)):a.setError(t);break;case"ajax":a.showLoading(t),i=n.ajax(n.extend({},t.opts.ajax.settings,{url:t.src,success:function(e,n){"success"===n&&a.setContent(t,e)},error:function(e,n){e&&"abort"!==n&&a.setError(t)}})),o.one("onReset",function(){i.abort()});break;default:a.setError(t)}return!0}},setImage:function(e){var o,i,a,s,r,c=this,l=e.opts.srcset||e.opts.image.srcset;if(e.timouts=setTimeout(function(){var t=e.$image;!e.isLoading||t&&t[0].complete||e.hasError||c.showLoading(e)},350),l){s=t.devicePixelRatio||1,r=t.innerWidth*s,a=l.split(",").map(function(t){var e={};return t.trim().split(/\s+/).forEach(function(t,n){var o=parseInt(t.substring(0,t.length-1),10);return 0===n?e.url=t:void(o&&(e.value=o,e.postfix=t[t.length-1]))}),e}),a.sort(function(t,e){return t.value-e.value});for(var d=0;d<a.length;d++){var u=a[d];if("w"===u.postfix&&u.value>=r||"x"===u.postfix&&u.value>=s){i=u;break}}!i&&a.length&&(i=a[a.length-1]),i&&(e.src=i.url,e.width&&e.height&&"w"==i.postfix&&(e.height=e.width/e.height*i.value,e.width=i.value),e.opts.srcset=l)}e.$content=n('<div class="fancybox-content"></div>').addClass("fancybox-is-hidden").appendTo(e.$slide.addClass("fancybox-slide--image")),o=e.opts.thumb||!(!e.opts.$thumb||!e.opts.$thumb.length)&&e.opts.$thumb.attr("src"),e.opts.preload!==!1&&e.opts.width&&e.opts.height&&o&&(e.width=e.opts.width,e.height=e.opts.height,e.$ghost=n("<img />").one("error",function(){n(this).remove(),e.$ghost=null}).one("load",function(){c.afterLoad(e)}).addClass("fancybox-image").appendTo(e.$content).attr("src",o)),c.setBigImage(e)},setBigImage:function(t){var e=this,o=n("<img />");t.$image=o.one("error",function(){e.setError(t)}).one("load",function(){var n;t.$ghost||(e.resolveImageSlideSize(t,this.naturalWidth,this.naturalHeight),e.afterLoad(t)),t.timouts&&(clearTimeout(t.timouts),t.timouts=null),e.isClosing||(t.opts.srcset&&(n=t.opts.sizes,n&&"auto"!==n||(n=(t.width/t.height>1&&s.width()/s.height()>1?"100":Math.round(t.width/t.height*100))+"vw"),o.attr("sizes",n).attr("srcset",t.opts.srcset)),t.$ghost&&setTimeout(function(){t.$ghost&&!e.isClosing&&t.$ghost.hide()},Math.min(300,Math.max(1e3,t.height/1600))),e.hideLoading(t))}).addClass("fancybox-image").attr("src",t.src).appendTo(t.$content),(o[0].complete||"complete"==o[0].readyState)&&o[0].naturalWidth&&o[0].naturalHeight?o.trigger("load"):o[0].error&&o.trigger("error")},resolveImageSlideSize:function(t,e,n){var o=parseInt(t.opts.width,10),i=parseInt(t.opts.height,10);t.width=e,t.height=n,o>0&&(t.width=o,t.height=Math.floor(o*n/e)),i>0&&(t.width=Math.floor(i*e/n),t.height=i)},setIframe:function(t){var e,i=this,a=t.opts.iframe,s=t.$slide;t.$content=n('<div class="fancybox-content'+(a.preload?" fancybox-is-hidden":"")+'"></div>').css(a.css).appendTo(s),s.addClass("fancybox-slide--"+t.contentType),t.$iframe=e=n(a.tpl.replace(/\{rnd\}/g,(new Date).getTime())).attr(a.attr).appendTo(t.$content),a.preload?(i.showLoading(t),e.on("load.fb error.fb",function(e){this.isReady=1,t.$slide.trigger("refresh"),i.afterLoad(t)}),s.on("refresh.fb",function(){var n,i,s=t.$content,r=a.css.width,c=a.css.height;if(1===e[0].isReady){try{n=e.contents(),i=n.find("body")}catch(t){}i&&i.length&&i.children().length&&(s.css({width:"",height:""}),r===o&&(r=Math.ceil(Math.max(i[0].clientWidth,i.outerWidth(!0)))),r&&s.width(r),c===o&&(c=Math.ceil(Math.max(i[0].clientHeight,i.outerHeight(!0)))),c&&s.height(c)),s.removeClass("fancybox-is-hidden")}})):this.afterLoad(t),e.attr("src",t.src),s.one("onReset",function(){try{n(this).find("iframe").hide().unbind().attr("src","//about:blank")}catch(t){}n(this).off("refresh.fb").empty(),t.isLoaded=!1})},setContent:function(t,e){var o=this;o.isClosing||(o.hideLoading(t),t.$content&&n.fancybox.stop(t.$content),t.$slide.empty(),l(e)&&e.parent().length?(e.parent().parent(".fancybox-slide--inline").trigger("onReset"),t.$placeholder=n("<div>").hide().insertAfter(e),e.css("display","inline-block")):t.hasError||("string"===n.type(e)&&(e=n("<div>").append(n.trim(e)).contents(),3===e[0].nodeType&&(e=n("<div>").html(e))),t.opts.filter&&(e=n("<div>").html(e).find(t.opts.filter))),t.$slide.one("onReset",function(){n(this).find("video,audio").trigger("pause"),t.$placeholder&&(t.$placeholder.after(e.hide()).remove(),t.$placeholder=null),t.$smallBtn&&(t.$smallBtn.remove(),t.$smallBtn=null),t.hasError||(n(this).empty(),t.isLoaded=!1)}),n(e).appendTo(t.$slide),n(e).is("video,audio")&&(n(e).addClass("fancybox-video"),n(e).wrap("<div></div>"),t.contentType="video",t.opts.width=t.opts.width||n(e).attr("width"),t.opts.height=t.opts.height||n(e).attr("height")),t.$content=t.$slide.children().filter("div,form,main,video,audio").first().addClass("fancybox-content"),t.$slide.addClass("fancybox-slide--"+t.contentType),this.afterLoad(t))},setError:function(t){t.hasError=!0,t.$slide.trigger("onReset").removeClass("fancybox-slide--"+t.contentType).addClass("fancybox-slide--error"),t.contentType="html",this.setContent(t,this.translate(t,t.opts.errorTpl)),t.pos===this.currPos&&(this.isAnimating=!1)},showLoading:function(t){var e=this;t=t||e.current,t&&!t.$spinner&&(t.$spinner=n(e.translate(e,e.opts.spinnerTpl)).appendTo(t.$slide))},hideLoading:function(t){var e=this;t=t||e.current,t&&t.$spinner&&(t.$spinner.remove(),delete t.$spinner)},afterLoad:function(t){var e=this;e.isClosing||(t.isLoading=!1,t.isLoaded=!0,e.trigger("afterLoad",t),e.hideLoading(t),t.pos===e.currPos&&e.updateCursor(),!t.opts.smallBtn||t.$smallBtn&&t.$smallBtn.length||(t.$smallBtn=n(e.translate(t,t.opts.btnTpl.smallBtn)).prependTo(t.$content)),t.opts.protect&&t.$content&&!t.hasError&&(t.$content.on("contextmenu.fb",function(t){return 2==t.button&&t.preventDefault(),!0}),"image"===t.type&&n('<div class="fancybox-spaceball"></div>').appendTo(t.$content)),e.revealContent(t))},revealContent:function(t){var e,i,a,s,r=this,c=t.$slide,l=!1,d=!1;return e=t.opts[r.firstRun?"animationEffect":"transitionEffect"],a=t.opts[r.firstRun?"animationDuration":"transitionDuration"],a=parseInt(t.forcedDuration===o?a:t.forcedDuration,10),t.pos===r.currPos&&(t.isComplete?e=!1:r.isAnimating=!0),!t.isMoved&&t.pos===r.currPos&&a||(e=!1),"zoom"===e&&(t.pos===r.currPos&&a&&"image"===t.type&&!t.hasError&&(d=r.getThumbPos(t))?l=r.getFitPos(t):e="fade"),"zoom"===e?(l.scaleX=l.width/d.width,l.scaleY=l.height/d.height,s=t.opts.zoomOpacity,"auto"==s&&(s=Math.abs(t.width/t.height-d.width/d.height)>.1),s&&(d.opacity=.1,l.opacity=1),n.fancybox.setTranslate(t.$content.removeClass("fancybox-is-hidden"),d),f(t.$content),void n.fancybox.animate(t.$content,l,a,function(){r.isAnimating=!1,r.complete()})):(r.updateSlide(t),e?(n.fancybox.stop(c),i="fancybox-animated fancybox-slide--"+(t.pos>=r.prevPos?"next":"previous")+" fancybox-fx-"+e,c.removeAttr("style").removeClass("fancybox-slide--current fancybox-slide--next fancybox-slide--previous").addClass(i),t.$content.removeClass("fancybox-is-hidden"),f(c),void n.fancybox.animate(c,"fancybox-slide--current",a,function(e){c.removeClass(i).removeAttr("style"),t.pos===r.currPos&&r.complete()},!0)):(f(c),t.$content.removeClass("fancybox-is-hidden"),void(t.pos===r.currPos&&r.complete())))},getThumbPos:function(o){var i,a=this,s=!1,r=o.opts.$thumb,c=r&&r.length&&r[0].ownerDocument===e?r.offset():0,l=function(e){for(var o,i=e[0],a=i.getBoundingClientRect(),s=[];null!==i.parentElement;)"hidden"!==n(i.parentElement).css("overflow")&&"auto"!==n(i.parentElement).css("overflow")||s.push(i.parentElement.getBoundingClientRect()),i=i.parentElement;return o=s.every(function(t){var e=Math.min(a.right,t.right)-Math.max(a.left,t.left),n=Math.min(a.bottom,t.bottom)-Math.max(a.top,t.top);return e>0&&n>0}),o&&a.bottom>0&&a.right>0&&a.left<n(t).width()&&a.top<n(t).height()};return c&&l(r)&&(i=a.$refs.stage.offset(),s={top:c.top-i.top+parseFloat(r.css("border-top-width")||0),left:c.left-i.left+parseFloat(r.css("border-left-width")||0),width:r.width(),height:r.height(),scaleX:1,scaleY:1}),s},complete:function(){var t=this,o=t.current,i={};!o.isMoved&&o.isLoaded&&(o.isComplete||(o.isComplete=!0,o.$slide.siblings().trigger("onReset"),t.preload("inline"),f(o.$slide),o.$slide.addClass("fancybox-slide--complete"),n.each(t.slides,function(e,o){o.pos>=t.currPos-1&&o.pos<=t.currPos+1?i[o.pos]=o:o&&(n.fancybox.stop(o.$slide),o.$slide.off().remove())}),t.slides=i),t.isAnimating=!1,t.updateCursor(),t.trigger("afterShow"),o.$slide.find("video,audio").filter(":visible:first").trigger("play"),(n(e.activeElement).is("[disabled]")||o.opts.autoFocus&&"image"!=o.type&&"iframe"!==o.type)&&t.focus())},preload:function(t){var e=this,n=e.slides[e.currPos+1],o=e.slides[e.currPos-1];n&&n.type===t&&e.loadSlide(n),o&&o.type===t&&e.loadSlide(o)},focus:function(){var t,e=this.current;this.isClosing||e&&e.isComplete&&e.$content&&(t=e.$content.find("input[autofocus]:enabled:visible:first"),t.length||(t=e.$content.find("button,:input,[tabindex],a").filter(":enabled:visible:first")),t=t&&t.length?t:e.$content,t.trigger("focus"))},activate:function(){var t=this;n(".fancybox-container").each(function(){var e=n(this).data("FancyBox");e&&e.id!==t.id&&!e.isClosing&&(e.trigger("onDeactivate"),e.removeEvents(),e.isVisible=!1)}),t.isVisible=!0,(t.current||t.isIdle)&&(t.update(),t.updateControls()),t.trigger("onActivate"),t.addEvents()},close:function(t,e){var o,i,a,s,r,c,l,p=this,h=p.current,g=function(){p.cleanUp(t)};return!p.isClosing&&(p.isClosing=!0,p.trigger("beforeClose",t)===!1?(p.isClosing=!1,d(function(){p.update()}),!1):(p.removeEvents(),h.timouts&&clearTimeout(h.timouts),a=h.$content,o=h.opts.animationEffect,i=n.isNumeric(e)?e:o?h.opts.animationDuration:0,h.$slide.off(u).removeClass("fancybox-slide--complete fancybox-slide--next fancybox-slide--previous fancybox-animated"),h.$slide.siblings().trigger("onReset").remove(),i&&p.$refs.container.removeClass("fancybox-is-open").addClass("fancybox-is-closing"),p.hideLoading(h),p.hideControls(),p.updateCursor(),"zoom"!==o||t!==!0&&a&&i&&"image"===h.type&&!h.hasError&&(l=p.getThumbPos(h))||(o="fade"),"zoom"===o?(n.fancybox.stop(a),s=n.fancybox.getTranslate(a),c={top:s.top,left:s.left,scaleX:s.width/l.width,scaleY:s.height/l.height,width:l.width,height:l.height},r=h.opts.zoomOpacity,"auto"==r&&(r=Math.abs(h.width/h.height-l.width/l.height)>.1),r&&(l.opacity=0),n.fancybox.setTranslate(a,c),f(a),n.fancybox.animate(a,l,i,g),!0):(o&&i?t===!0?setTimeout(g,i):n.fancybox.animate(h.$slide.removeClass("fancybox-slide--current"),"fancybox-animated fancybox-slide--previous fancybox-fx-"+o,i,g):g(),!0)))},cleanUp:function(t){var e,o=this,i=n("body");o.current.$slide.trigger("onReset"),o.$refs.container.empty().remove(),o.trigger("afterClose",t),o.$lastFocus&&o.current.opts.backFocus&&o.$lastFocus.trigger("focus"),o.current=null,e=n.fancybox.getInstance(),e?e.activate():(i.removeClass("fancybox-active compensate-for-scrollbar"),n("#fancybox-style-noscroll").remove())},trigger:function(t,e){var o,i=Array.prototype.slice.call(arguments,1),a=this,s=e&&e.opts?e:a.current;return s?i.unshift(s):s=a,i.unshift(a),n.isFunction(s.opts[t])&&(o=s.opts[t].apply(s,i)),o===!1?o:void("afterClose"!==t&&a.$refs?a.$refs.container.trigger(t+".fb",i):r.trigger(t+".fb",i))},updateControls:function(t){var e=this,n=e.current,o=n.index,i=n.opts.caption,a=e.$refs.container,s=e.$refs.caption;n.$slide.trigger("refresh"),e.$caption=i&&i.length?s.html(i):null,e.isHiddenControls||e.isIdle||e.showControls(),a.find("[data-fancybox-count]").html(e.group.length),a.find("[data-fancybox-index]").html(o+1),a.find("[data-fancybox-prev]").toggleClass("disabled",!n.opts.loop&&o<=0),a.find("[data-fancybox-next]").toggleClass("disabled",!n.opts.loop&&o>=e.group.length-1),"image"===n.type?a.find("[data-fancybox-zoom]").show().end().find("[data-fancybox-download]").attr("href",n.opts.image.src||n.src).show():n.opts.toolbar&&a.find("[data-fancybox-download],[data-fancybox-zoom]").hide()},hideControls:function(){this.isHiddenControls=!0,this.$refs.container.removeClass("fancybox-show-infobar fancybox-show-toolbar fancybox-show-caption fancybox-show-nav")},showControls:function(){var t=this,e=t.current?t.current.opts:t.opts,n=t.$refs.container;t.isHiddenControls=!1,t.idleSecondsCounter=0,n.toggleClass("fancybox-show-toolbar",!(!e.toolbar||!e.buttons)).toggleClass("fancybox-show-infobar",!!(e.infobar&&t.group.length>1)).toggleClass("fancybox-show-nav",!!(e.arrows&&t.group.length>1)).toggleClass("fancybox-is-modal",!!e.modal),t.$caption?n.addClass("fancybox-show-caption "):n.removeClass("fancybox-show-caption")},toggleControls:function(){this.isHiddenControls?this.showControls():this.hideControls()}}),n.fancybox={version:"3.3.5",defaults:a,getInstance:function(t){var e=n('.fancybox-container:not(".fancybox-is-closing"):last').data("FancyBox"),o=Array.prototype.slice.call(arguments,1);return e instanceof h&&("string"===n.type(t)?e[t].apply(e,o):"function"===n.type(t)&&t.apply(e,o),e)},open:function(t,e,n){return new h(t,e,n)},close:function(t){var e=this.getInstance();e&&(e.close(),t===!0&&this.close())},destroy:function(){this.close(!0),r.add("body").off("click.fb-start","**")},isMobile:e.createTouch!==o&&/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),use3d:function(){var n=e.createElement("div");return t.getComputedStyle&&t.getComputedStyle(n)&&t.getComputedStyle(n).getPropertyValue("transform")&&!(e.documentMode&&e.documentMode<11)}(),getTranslate:function(t){var e;return!(!t||!t.length)&&(e=t[0].getBoundingClientRect(),{top:e.top||0,left:e.left||0,width:e.width,height:e.height,opacity:parseFloat(t.css("opacity"))})},setTranslate:function(t,e){var n="",i={};if(t&&e)return e.left===o&&e.top===o||(n=(e.left===o?t.position().left:e.left)+"px, "+(e.top===o?t.position().top:e.top)+"px",n=this.use3d?"translate3d("+n+", 0px)":"translate("+n+")"),e.scaleX!==o&&e.scaleY!==o&&(n=(n.length?n+" ":"")+"scale("+e.scaleX+", "+e.scaleY+")"),n.length&&(i.transform=n),e.opacity!==o&&(i.opacity=e.opacity),e.width!==o&&(i.width=e.width),e.height!==o&&(i.height=e.height),t.css(i)},animate:function(t,e,i,a,s){var r=!1;n.isFunction(i)&&(a=i,i=null),n.isPlainObject(e)||t.removeAttr("style"),n.fancybox.stop(t),t.on(u,function(o){(!o||!o.originalEvent||t.is(o.originalEvent.target)&&"z-index"!=o.originalEvent.propertyName)&&(n.fancybox.stop(t),r&&n.fancybox.setTranslate(t,r),
	n.isPlainObject(e)?s===!1&&t.removeAttr("style"):s!==!0&&t.removeClass(e),n.isFunction(a)&&a(o))}),n.isNumeric(i)&&t.css("transition-duration",i+"ms"),n.isPlainObject(e)?(e.scaleX!==o&&e.scaleY!==o&&(r=n.extend({},e,{width:t.width()*e.scaleX,height:t.height()*e.scaleY,scaleX:1,scaleY:1}),delete e.width,delete e.height,t.parent().hasClass("fancybox-slide--image")&&t.parent().addClass("fancybox-is-scaling")),n.fancybox.setTranslate(t,e)):t.addClass(e),t.data("timer",setTimeout(function(){t.trigger("transitionend")},i+16))},stop:function(t){t&&t.length&&(clearTimeout(t.data("timer")),t.off("transitionend").css("transition-duration",""),t.parent().removeClass("fancybox-is-scaling"))}},n.fn.fancybox=function(t){var e;return t=t||{},e=t.selector||!1,e?n("body").off("click.fb-start",e).on("click.fb-start",e,{options:t},i):this.off("click.fb-start").on("click.fb-start",{items:this,options:t},i),this},r.on("click.fb-start","[data-fancybox]",i),r.on("click.fb-start","[data-trigger]",function(t){i(t,{$target:n('[data-fancybox="'+n(t.currentTarget).attr("data-trigger")+'"]').eq(n(t.currentTarget).attr("data-index")||0),$trigger:n(this)})})}}(window,document,window.jQuery||jQuery),function(t){"use strict";var e=function(e,n,o){if(e)return o=o||"","object"===t.type(o)&&(o=t.param(o,!0)),t.each(n,function(t,n){e=e.replace("$"+t,n||"")}),o.length&&(e+=(e.indexOf("?")>0?"&":"?")+o),e},n={youtube:{matcher:/(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(watch\?(.*&)?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&list=(.*))(.*)/i,params:{autoplay:1,autohide:1,fs:1,rel:0,hd:1,wmode:"transparent",enablejsapi:1,html5:1},paramPlace:8,type:"iframe",url:"//www.youtube.com/embed/$4",thumb:"//img.youtube.com/vi/$4/hqdefault.jpg"},vimeo:{matcher:/^.+vimeo.com\/(.*\/)?([\d]+)(.*)?/,params:{autoplay:1,hd:1,show_title:1,show_byline:1,show_portrait:0,fullscreen:1,api:1},paramPlace:3,type:"iframe",url:"//player.vimeo.com/video/$2"},instagram:{matcher:/(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/i,type:"image",url:"//$1/p/$2/media/?size=l"},gmap_place:{matcher:/(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(((maps\/(place\/(.*)\/)?\@(.*),(\d+.?\d+?)z))|(\?ll=))(.*)?/i,type:"iframe",url:function(t){return"//maps.google."+t[2]+"/?ll="+(t[9]?t[9]+"&z="+Math.floor(t[10])+(t[12]?t[12].replace(/^\//,"&"):""):t[12]+"").replace(/\?/,"&")+"&output="+(t[12]&&t[12].indexOf("layer=c")>0?"svembed":"embed")}},gmap_search:{matcher:/(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(maps\/search\/)(.*)/i,type:"iframe",url:function(t){return"//maps.google."+t[2]+"/maps?q="+t[5].replace("query=","q=").replace("api=1","")+"&output=embed"}}};t(document).on("objectNeedsType.fb",function(o,i,a){var s,r,c,l,d,u,f,p=a.src||"",h=!1;s=t.extend(!0,{},n,a.opts.media),t.each(s,function(n,o){if(c=p.match(o.matcher)){if(h=o.type,f=n,u={},o.paramPlace&&c[o.paramPlace]){d=c[o.paramPlace],"?"==d[0]&&(d=d.substring(1)),d=d.split("&");for(var i=0;i<d.length;++i){var s=d[i].split("=",2);2==s.length&&(u[s[0]]=decodeURIComponent(s[1].replace(/\+/g," ")))}}return l=t.extend(!0,{},o.params,a.opts[n],u),p="function"===t.type(o.url)?o.url.call(this,c,l,a):e(o.url,c,l),r="function"===t.type(o.thumb)?o.thumb.call(this,c,l,a):e(o.thumb,c),"youtube"===n?p=p.replace(/&t=((\d+)m)?(\d+)s/,function(t,e,n,o){return"&start="+((n?60*parseInt(n,10):0)+parseInt(o,10))}):"vimeo"===n&&(p=p.replace("&%23","#")),!1}}),h?(a.opts.thumb||a.opts.$thumb&&a.opts.$thumb.length||(a.opts.thumb=r),"iframe"===h&&(a.opts=t.extend(!0,a.opts,{iframe:{preload:!1,attr:{scrolling:"no"}}})),t.extend(a,{type:h,src:p,origSrc:a.src,contentSource:f,contentType:"image"===h?"image":"gmap_place"==f||"gmap_search"==f?"map":"video"})):p&&(a.type=a.opts.defaultType)})}(window.jQuery||jQuery),function(t,e,n){"use strict";var o=function(){return t.requestAnimationFrame||t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||t.oRequestAnimationFrame||function(e){return t.setTimeout(e,1e3/60)}}(),i=function(){return t.cancelAnimationFrame||t.webkitCancelAnimationFrame||t.mozCancelAnimationFrame||t.oCancelAnimationFrame||function(e){t.clearTimeout(e)}}(),a=function(e){var n=[];e=e.originalEvent||e||t.e,e=e.touches&&e.touches.length?e.touches:e.changedTouches&&e.changedTouches.length?e.changedTouches:[e];for(var o in e)e[o].pageX?n.push({x:e[o].pageX,y:e[o].pageY}):e[o].clientX&&n.push({x:e[o].clientX,y:e[o].clientY});return n},s=function(t,e,n){return e&&t?"x"===n?t.x-e.x:"y"===n?t.y-e.y:Math.sqrt(Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2)):0},r=function(t){if(t.is('a,area,button,[role="button"],input,label,select,summary,textarea,video,audio')||n.isFunction(t.get(0).onclick)||t.data("selectable"))return!0;for(var e=0,o=t[0].attributes,i=o.length;e<i;e++)if("data-fancybox-"===o[e].nodeName.substr(0,14))return!0;return!1},c=function(e){var n=t.getComputedStyle(e)["overflow-y"],o=t.getComputedStyle(e)["overflow-x"],i=("scroll"===n||"auto"===n)&&e.scrollHeight>e.clientHeight,a=("scroll"===o||"auto"===o)&&e.scrollWidth>e.clientWidth;return i||a},l=function(t){for(var e=!1;;){if(e=c(t.get(0)))break;if(t=t.parent(),!t.length||t.hasClass("fancybox-stage")||t.is("body"))break}return e},d=function(t){var e=this;e.instance=t,e.$bg=t.$refs.bg,e.$stage=t.$refs.stage,e.$container=t.$refs.container,e.destroy(),e.$container.on("touchstart.fb.touch mousedown.fb.touch",n.proxy(e,"ontouchstart"))};d.prototype.destroy=function(){this.$container.off(".fb.touch")},d.prototype.ontouchstart=function(o){var i=this,c=n(o.target),d=i.instance,u=d.current,f=u.$content,p="touchstart"==o.type;if(p&&i.$container.off("mousedown.fb.touch"),(!o.originalEvent||2!=o.originalEvent.button)&&c.length&&!r(c)&&!r(c.parent())&&(c.is("img")||!(o.originalEvent.clientX>c[0].clientWidth+c.offset().left))){if(!u||d.isAnimating||d.isClosing)return o.stopPropagation(),void o.preventDefault();if(i.realPoints=i.startPoints=a(o),i.startPoints.length){if(o.stopPropagation(),i.startEvent=o,i.canTap=!0,i.$target=c,i.$content=f,i.opts=u.opts.touch,i.isPanning=!1,i.isSwiping=!1,i.isZooming=!1,i.isScrolling=!1,i.startTime=(new Date).getTime(),i.distanceX=i.distanceY=i.distance=0,i.canvasWidth=Math.round(u.$slide[0].clientWidth),i.canvasHeight=Math.round(u.$slide[0].clientHeight),i.contentLastPos=null,i.contentStartPos=n.fancybox.getTranslate(i.$content)||{top:0,left:0},i.sliderStartPos=i.sliderLastPos||n.fancybox.getTranslate(u.$slide),i.stagePos=n.fancybox.getTranslate(d.$refs.stage),i.sliderStartPos.top-=i.stagePos.top,i.sliderStartPos.left-=i.stagePos.left,i.contentStartPos.top-=i.stagePos.top,i.contentStartPos.left-=i.stagePos.left,n(e).off(".fb.touch").on(p?"touchend.fb.touch touchcancel.fb.touch":"mouseup.fb.touch mouseleave.fb.touch",n.proxy(i,"ontouchend")).on(p?"touchmove.fb.touch":"mousemove.fb.touch",n.proxy(i,"ontouchmove")),n.fancybox.isMobile&&e.addEventListener("scroll",i.onscroll,!0),!i.opts&&!d.canPan()||!c.is(i.$stage)&&!i.$stage.find(c).length)return void(c.is(".fancybox-image")&&o.preventDefault());n.fancybox.isMobile&&(l(c)||l(c.parent()))||o.preventDefault(),(1===i.startPoints.length||u.hasError)&&(i.instance.canPan()?(n.fancybox.stop(i.$content),i.$content.css("transition-duration",""),i.isPanning=!0):i.isSwiping=!0,i.$container.addClass("fancybox-controls--isGrabbing")),2===i.startPoints.length&&"image"===u.type&&(u.isLoaded||u.$ghost)&&(i.canTap=!1,i.isSwiping=!1,i.isPanning=!1,i.isZooming=!0,n.fancybox.stop(i.$content),i.$content.css("transition-duration",""),i.centerPointStartX=.5*(i.startPoints[0].x+i.startPoints[1].x)-n(t).scrollLeft(),i.centerPointStartY=.5*(i.startPoints[0].y+i.startPoints[1].y)-n(t).scrollTop(),i.percentageOfImageAtPinchPointX=(i.centerPointStartX-i.contentStartPos.left)/i.contentStartPos.width,i.percentageOfImageAtPinchPointY=(i.centerPointStartY-i.contentStartPos.top)/i.contentStartPos.height,i.startDistanceBetweenFingers=s(i.startPoints[0],i.startPoints[1]))}}},d.prototype.onscroll=function(t){var n=this;n.isScrolling=!0,e.removeEventListener("scroll",n.onscroll,!0)},d.prototype.ontouchmove=function(t){var e=this,o=n(t.target);return void 0!==t.originalEvent.buttons&&0===t.originalEvent.buttons?void e.ontouchend(t):e.isScrolling||!o.is(e.$stage)&&!e.$stage.find(o).length?void(e.canTap=!1):(e.newPoints=a(t),void((e.opts||e.instance.canPan())&&e.newPoints.length&&e.newPoints.length&&(e.isSwiping&&e.isSwiping===!0||t.preventDefault(),e.distanceX=s(e.newPoints[0],e.startPoints[0],"x"),e.distanceY=s(e.newPoints[0],e.startPoints[0],"y"),e.distance=s(e.newPoints[0],e.startPoints[0]),e.distance>0&&(e.isSwiping?e.onSwipe(t):e.isPanning?e.onPan():e.isZooming&&e.onZoom()))))},d.prototype.onSwipe=function(e){var a,s=this,r=s.isSwiping,c=s.sliderStartPos.left||0;if(r!==!0)"x"==r&&(s.distanceX>0&&(s.instance.group.length<2||0===s.instance.current.index&&!s.instance.current.opts.loop)?c+=Math.pow(s.distanceX,.8):s.distanceX<0&&(s.instance.group.length<2||s.instance.current.index===s.instance.group.length-1&&!s.instance.current.opts.loop)?c-=Math.pow(-s.distanceX,.8):c+=s.distanceX),s.sliderLastPos={top:"x"==r?0:s.sliderStartPos.top+s.distanceY,left:c},s.requestId&&(i(s.requestId),s.requestId=null),s.requestId=o(function(){s.sliderLastPos&&(n.each(s.instance.slides,function(t,e){var o=e.pos-s.instance.currPos;n.fancybox.setTranslate(e.$slide,{top:s.sliderLastPos.top,left:s.sliderLastPos.left+o*s.canvasWidth+o*e.opts.gutter})}),s.$container.addClass("fancybox-is-sliding"))});else if(Math.abs(s.distance)>10){if(s.canTap=!1,s.instance.group.length<2&&s.opts.vertical?s.isSwiping="y":s.instance.isDragging||s.opts.vertical===!1||"auto"===s.opts.vertical&&n(t).width()>800?s.isSwiping="x":(a=Math.abs(180*Math.atan2(s.distanceY,s.distanceX)/Math.PI),s.isSwiping=a>45&&a<135?"y":"x"),s.canTap=!1,"y"===s.isSwiping&&n.fancybox.isMobile&&(l(s.$target)||l(s.$target.parent())))return void(s.isScrolling=!0);s.instance.isDragging=s.isSwiping,s.startPoints=s.newPoints,n.each(s.instance.slides,function(t,e){n.fancybox.stop(e.$slide),e.$slide.css("transition-duration",""),e.inTransition=!1,e.pos===s.instance.current.pos&&(s.sliderStartPos.left=n.fancybox.getTranslate(e.$slide).left-n.fancybox.getTranslate(s.instance.$refs.stage).left)}),s.instance.SlideShow&&s.instance.SlideShow.isActive&&s.instance.SlideShow.stop()}},d.prototype.onPan=function(){var t=this;return s(t.newPoints[0],t.realPoints[0])<(n.fancybox.isMobile?10:5)?void(t.startPoints=t.newPoints):(t.canTap=!1,t.contentLastPos=t.limitMovement(),t.requestId&&(i(t.requestId),t.requestId=null),void(t.requestId=o(function(){n.fancybox.setTranslate(t.$content,t.contentLastPos)})))},d.prototype.limitMovement=function(){var t,e,n,o,i,a,s=this,r=s.canvasWidth,c=s.canvasHeight,l=s.distanceX,d=s.distanceY,u=s.contentStartPos,f=u.left,p=u.top,h=u.width,g=u.height;return i=h>r?f+l:f,a=p+d,t=Math.max(0,.5*r-.5*h),e=Math.max(0,.5*c-.5*g),n=Math.min(r-h,.5*r-.5*h),o=Math.min(c-g,.5*c-.5*g),l>0&&i>t&&(i=t-1+Math.pow(-t+f+l,.8)||0),l<0&&i<n&&(i=n+1-Math.pow(n-f-l,.8)||0),d>0&&a>e&&(a=e-1+Math.pow(-e+p+d,.8)||0),d<0&&a<o&&(a=o+1-Math.pow(o-p-d,.8)||0),{top:a,left:i}},d.prototype.limitPosition=function(t,e,n,o){var i=this,a=i.canvasWidth,s=i.canvasHeight;return n>a?(t=t>0?0:t,t=t<a-n?a-n:t):t=Math.max(0,a/2-n/2),o>s?(e=e>0?0:e,e=e<s-o?s-o:e):e=Math.max(0,s/2-o/2),{top:e,left:t}},d.prototype.onZoom=function(){var e=this,a=e.contentStartPos,r=a.width,c=a.height,l=a.left,d=a.top,u=s(e.newPoints[0],e.newPoints[1]),f=u/e.startDistanceBetweenFingers,p=Math.floor(r*f),h=Math.floor(c*f),g=(r-p)*e.percentageOfImageAtPinchPointX,b=(c-h)*e.percentageOfImageAtPinchPointY,m=(e.newPoints[0].x+e.newPoints[1].x)/2-n(t).scrollLeft(),y=(e.newPoints[0].y+e.newPoints[1].y)/2-n(t).scrollTop(),v=m-e.centerPointStartX,x=y-e.centerPointStartY,w=l+(g+v),$=d+(b+x),S={top:$,left:w,scaleX:f,scaleY:f};e.canTap=!1,e.newWidth=p,e.newHeight=h,e.contentLastPos=S,e.requestId&&(i(e.requestId),e.requestId=null),e.requestId=o(function(){n.fancybox.setTranslate(e.$content,e.contentLastPos)})},d.prototype.ontouchend=function(t){var o=this,s=Math.max((new Date).getTime()-o.startTime,1),r=o.isSwiping,c=o.isPanning,l=o.isZooming,d=o.isScrolling;return o.endPoints=a(t),o.$container.removeClass("fancybox-controls--isGrabbing"),n(e).off(".fb.touch"),e.removeEventListener("scroll",o.onscroll,!0),o.requestId&&(i(o.requestId),o.requestId=null),o.isSwiping=!1,o.isPanning=!1,o.isZooming=!1,o.isScrolling=!1,o.instance.isDragging=!1,o.canTap?o.onTap(t):(o.speed=366,o.velocityX=o.distanceX/s*.5,o.velocityY=o.distanceY/s*.5,o.speedX=Math.max(.5*o.speed,Math.min(1.5*o.speed,1/Math.abs(o.velocityX)*o.speed)),void(c?o.endPanning():l?o.endZooming():o.endSwiping(r,d)))},d.prototype.endSwiping=function(t,e){var o=this,i=!1,a=o.instance.group.length;o.sliderLastPos=null,"y"==t&&!e&&Math.abs(o.distanceY)>50?(n.fancybox.animate(o.instance.current.$slide,{top:o.sliderStartPos.top+o.distanceY+150*o.velocityY,opacity:0},200),i=o.instance.close(!0,200)):"x"==t&&o.distanceX>50&&a>1?i=o.instance.previous(o.speedX):"x"==t&&o.distanceX<-50&&a>1&&(i=o.instance.next(o.speedX)),i!==!1||"x"!=t&&"y"!=t||(e||a<2?o.instance.centerSlide(o.instance.current,150):o.instance.jumpTo(o.instance.current.index)),o.$container.removeClass("fancybox-is-sliding")},d.prototype.endPanning=function(){var t,e,o,i=this;i.contentLastPos&&(i.opts.momentum===!1?(t=i.contentLastPos.left,e=i.contentLastPos.top):(t=i.contentLastPos.left+i.velocityX*i.speed,e=i.contentLastPos.top+i.velocityY*i.speed),o=i.limitPosition(t,e,i.contentStartPos.width,i.contentStartPos.height),o.width=i.contentStartPos.width,o.height=i.contentStartPos.height,n.fancybox.animate(i.$content,o,330))},d.prototype.endZooming=function(){var t,e,o,i,a=this,s=a.instance.current,r=a.newWidth,c=a.newHeight;a.contentLastPos&&(t=a.contentLastPos.left,e=a.contentLastPos.top,i={top:e,left:t,width:r,height:c,scaleX:1,scaleY:1},n.fancybox.setTranslate(a.$content,i),r<a.canvasWidth&&c<a.canvasHeight?a.instance.scaleToFit(150):r>s.width||c>s.height?a.instance.scaleToActual(a.centerPointStartX,a.centerPointStartY,150):(o=a.limitPosition(t,e,r,c),n.fancybox.setTranslate(a.$content,n.fancybox.getTranslate(a.$content)),n.fancybox.animate(a.$content,o,150)))},d.prototype.onTap=function(e){var o,i=this,s=n(e.target),r=i.instance,c=r.current,l=e&&a(e)||i.startPoints,d=l[0]?l[0].x-n(t).scrollLeft()-i.stagePos.left:0,u=l[0]?l[0].y-n(t).scrollTop()-i.stagePos.top:0,f=function(t){var o=c.opts[t];if(n.isFunction(o)&&(o=o.apply(r,[c,e])),o)switch(o){case"close":r.close(i.startEvent);break;case"toggleControls":r.toggleControls(!0);break;case"next":r.next();break;case"nextOrClose":r.group.length>1?r.next():r.close(i.startEvent);break;case"zoom":"image"==c.type&&(c.isLoaded||c.$ghost)&&(r.canPan()?r.scaleToFit():r.isScaledDown()?r.scaleToActual(d,u):r.group.length<2&&r.close(i.startEvent))}};if((!e.originalEvent||2!=e.originalEvent.button)&&(s.is("img")||!(d>s[0].clientWidth+s.offset().left))){if(s.is(".fancybox-bg,.fancybox-inner,.fancybox-outer,.fancybox-container"))o="Outside";else if(s.is(".fancybox-slide"))o="Slide";else{if(!r.current.$content||!r.current.$content.find(s).addBack().filter(s).length)return;o="Content"}if(i.tapped){if(clearTimeout(i.tapped),i.tapped=null,Math.abs(d-i.tapX)>50||Math.abs(u-i.tapY)>50)return this;f("dblclick"+o)}else i.tapX=d,i.tapY=u,c.opts["dblclick"+o]&&c.opts["dblclick"+o]!==c.opts["click"+o]?i.tapped=setTimeout(function(){i.tapped=null,f("click"+o)},500):f("click"+o);return this}},n(e).on("onActivate.fb",function(t,e){e&&!e.Guestures&&(e.Guestures=new d(e))})}(window,document,window.jQuery||jQuery),function(t,e){"use strict";e.extend(!0,e.fancybox.defaults,{btnTpl:{slideShow:'<button data-fancybox-play class="fancybox-button fancybox-button--play" title="{{PLAY_START}}"><svg viewBox="0 0 40 40"><path d="M13,12 L27,20 L13,27 Z" /><path d="M15,10 v19 M23,10 v19" /></svg></button>'},slideShow:{autoStart:!1,speed:3e3}});var n=function(t){this.instance=t,this.init()};e.extend(n.prototype,{timer:null,isActive:!1,$button:null,init:function(){var t=this;t.$button=t.instance.$refs.toolbar.find("[data-fancybox-play]").on("click",function(){t.toggle()}),(t.instance.group.length<2||!t.instance.group[t.instance.currIndex].opts.slideShow)&&t.$button.hide()},set:function(t){var e=this;e.instance&&e.instance.current&&(t===!0||e.instance.current.opts.loop||e.instance.currIndex<e.instance.group.length-1)?e.timer=setTimeout(function(){e.isActive&&e.instance.jumpTo((e.instance.currIndex+1)%e.instance.group.length)},e.instance.current.opts.slideShow.speed):(e.stop(),e.instance.idleSecondsCounter=0,e.instance.showControls())},clear:function(){var t=this;clearTimeout(t.timer),t.timer=null},start:function(){var t=this,e=t.instance.current;e&&(t.isActive=!0,t.$button.attr("title",e.opts.i18n[e.opts.lang].PLAY_STOP).removeClass("fancybox-button--play").addClass("fancybox-button--pause"),t.set(!0))},stop:function(){var t=this,e=t.instance.current;t.clear(),t.$button.attr("title",e.opts.i18n[e.opts.lang].PLAY_START).removeClass("fancybox-button--pause").addClass("fancybox-button--play"),t.isActive=!1},toggle:function(){var t=this;t.isActive?t.stop():t.start()}}),e(t).on({"onInit.fb":function(t,e){e&&!e.SlideShow&&(e.SlideShow=new n(e))},"beforeShow.fb":function(t,e,n,o){var i=e&&e.SlideShow;o?i&&n.opts.slideShow.autoStart&&i.start():i&&i.isActive&&i.clear()},"afterShow.fb":function(t,e,n){var o=e&&e.SlideShow;o&&o.isActive&&o.set()},"afterKeydown.fb":function(n,o,i,a,s){var r=o&&o.SlideShow;!r||!i.opts.slideShow||80!==s&&32!==s||e(t.activeElement).is("button,a,input")||(a.preventDefault(),r.toggle())},"beforeClose.fb onDeactivate.fb":function(t,e){var n=e&&e.SlideShow;n&&n.stop()}}),e(t).on("visibilitychange",function(){var n=e.fancybox.getInstance(),o=n&&n.SlideShow;o&&o.isActive&&(t.hidden?o.clear():o.set())})}(document,window.jQuery||jQuery),function(t,e){"use strict";var n=function(){for(var e=[["requestFullscreen","exitFullscreen","fullscreenElement","fullscreenEnabled","fullscreenchange","fullscreenerror"],["webkitRequestFullscreen","webkitExitFullscreen","webkitFullscreenElement","webkitFullscreenEnabled","webkitfullscreenchange","webkitfullscreenerror"],["webkitRequestFullScreen","webkitCancelFullScreen","webkitCurrentFullScreenElement","webkitCancelFullScreen","webkitfullscreenchange","webkitfullscreenerror"],["mozRequestFullScreen","mozCancelFullScreen","mozFullScreenElement","mozFullScreenEnabled","mozfullscreenchange","mozfullscreenerror"],["msRequestFullscreen","msExitFullscreen","msFullscreenElement","msFullscreenEnabled","MSFullscreenChange","MSFullscreenError"]],n={},o=0;o<e.length;o++){var i=e[o];if(i&&i[1]in t){for(var a=0;a<i.length;a++)n[e[0][a]]=i[a];return n}}return!1}();if(!n)return void(e&&e.fancybox&&(e.fancybox.defaults.btnTpl.fullScreen=!1));var o={request:function(e){e=e||t.documentElement,e[n.requestFullscreen](e.ALLOW_KEYBOARD_INPUT)},exit:function(){t[n.exitFullscreen]()},toggle:function(e){e=e||t.documentElement,this.isFullscreen()?this.exit():this.request(e)},isFullscreen:function(){return Boolean(t[n.fullscreenElement])},enabled:function(){return Boolean(t[n.fullscreenEnabled])}};e.extend(!0,e.fancybox.defaults,{btnTpl:{fullScreen:'<button data-fancybox-fullscreen class="fancybox-button fancybox-button--fullscreen" title="{{FULL_SCREEN}}"><svg viewBox="0 0 40 40"><path d="M9,12 v16 h22 v-16 h-22 v8" /></svg></button>'},fullScreen:{autoStart:!1}}),e(t).on({"onInit.fb":function(t,e){var n;e&&e.group[e.currIndex].opts.fullScreen?(n=e.$refs.container,n.on("click.fb-fullscreen","[data-fancybox-fullscreen]",function(t){t.stopPropagation(),t.preventDefault(),o.toggle()}),e.opts.fullScreen&&e.opts.fullScreen.autoStart===!0&&o.request(),e.FullScreen=o):e&&e.$refs.toolbar.find("[data-fancybox-fullscreen]").hide()},"afterKeydown.fb":function(t,e,n,o,i){e&&e.FullScreen&&70===i&&(o.preventDefault(),e.FullScreen.toggle())},"beforeClose.fb":function(t,e){e&&e.FullScreen&&e.$refs.container.hasClass("fancybox-is-fullscreen")&&o.exit()}}),e(t).on(n.fullscreenchange,function(){var t=o.isFullscreen(),n=e.fancybox.getInstance();n&&(n.current&&"image"===n.current.type&&n.isAnimating&&(n.current.$content.css("transition","none"),n.isAnimating=!1,n.update(!0,!0,0)),n.trigger("onFullscreenChange",t),n.$refs.container.toggleClass("fancybox-is-fullscreen",t))})}(document,window.jQuery||jQuery),function(t,e){"use strict";var n="fancybox-thumbs",o=n+"-active",i=n+"-loading";e.fancybox.defaults=e.extend(!0,{btnTpl:{thumbs:'<button data-fancybox-thumbs class="fancybox-button fancybox-button--thumbs" title="{{THUMBS}}"><svg viewBox="0 0 120 120"><path d="M30,30 h14 v14 h-14 Z M50,30 h14 v14 h-14 Z M70,30 h14 v14 h-14 Z M30,50 h14 v14 h-14 Z M50,50 h14 v14 h-14 Z M70,50 h14 v14 h-14 Z M30,70 h14 v14 h-14 Z M50,70 h14 v14 h-14 Z M70,70 h14 v14 h-14 Z" /></svg></button>'},thumbs:{autoStart:!1,hideOnClose:!0,parentEl:".fancybox-container",axis:"y"}},e.fancybox.defaults);var a=function(t){this.init(t)};e.extend(a.prototype,{$button:null,$grid:null,$list:null,isVisible:!1,isActive:!1,init:function(t){var e,n,o=this;o.instance=t,t.Thumbs=o,o.opts=t.group[t.currIndex].opts.thumbs,e=t.group[0],e=e.opts.thumb||!(!e.opts.$thumb||!e.opts.$thumb.length)&&e.opts.$thumb.attr("src"),t.group.length>1&&(n=t.group[1],n=n.opts.thumb||!(!n.opts.$thumb||!n.opts.$thumb.length)&&n.opts.$thumb.attr("src")),o.$button=t.$refs.toolbar.find("[data-fancybox-thumbs]"),o.opts&&e&&n&&e&&n?(o.$button.show().on("click",function(){o.toggle()}),o.isActive=!0):o.$button.hide()},create:function(){var t,o=this,a=o.instance,s=o.opts.parentEl,r=[];o.$grid||(o.$grid=e('<div class="'+n+" "+n+"-"+o.opts.axis+'"></div>').appendTo(a.$refs.container.find(s).addBack().filter(s)),o.$grid.on("click","li",function(){a.jumpTo(e(this).attr("data-index"))})),o.$list||(o.$list=e("<ul>").appendTo(o.$grid)),e.each(a.group,function(e,n){t=n.opts.thumb||(n.opts.$thumb?n.opts.$thumb.attr("src"):null),t||"image"!==n.type||(t=n.src),r.push('<li data-index="'+e+'" tabindex="0" class="'+i+'"'+(t&&t.length?' style="background-image:url('+t+')" />':"")+"></li>")}),o.$list[0].innerHTML=r.join(""),"x"===o.opts.axis&&o.$list.width(parseInt(o.$grid.css("padding-right"),10)+a.group.length*o.$list.children().eq(0).outerWidth(!0))},focus:function(t){var e,n,i=this,a=i.$list,s=i.$grid;i.instance.current&&(e=a.children().removeClass(o).filter('[data-index="'+i.instance.current.index+'"]').addClass(o),n=e.position(),"y"===i.opts.axis&&(n.top<0||n.top>a.height()-e.outerHeight())?a.stop().animate({scrollTop:a.scrollTop()+n.top},t):"x"===i.opts.axis&&(n.left<s.scrollLeft()||n.left>s.scrollLeft()+(s.width()-e.outerWidth()))&&a.parent().stop().animate({scrollLeft:n.left},t))},update:function(){var t=this;t.instance.$refs.container.toggleClass("fancybox-show-thumbs",this.isVisible),t.isVisible?(t.$grid||t.create(),t.instance.trigger("onThumbsShow"),t.focus(0)):t.$grid&&t.instance.trigger("onThumbsHide"),t.instance.update()},hide:function(){this.isVisible=!1,this.update()},show:function(){this.isVisible=!0,this.update()},toggle:function(){this.isVisible=!this.isVisible,this.update()}}),e(t).on({"onInit.fb":function(t,e){var n;e&&!e.Thumbs&&(n=new a(e),n.isActive&&n.opts.autoStart===!0&&n.show())},"beforeShow.fb":function(t,e,n,o){var i=e&&e.Thumbs;i&&i.isVisible&&i.focus(o?0:250)},"afterKeydown.fb":function(t,e,n,o,i){var a=e&&e.Thumbs;a&&a.isActive&&71===i&&(o.preventDefault(),a.toggle())},"beforeClose.fb":function(t,e){var n=e&&e.Thumbs;n&&n.isVisible&&n.opts.hideOnClose!==!1&&n.$grid.hide()}})}(document,window.jQuery||jQuery),function(t,e){"use strict";function n(t){var e={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;"};return String(t).replace(/[&<>"'`=\/]/g,function(t){return e[t]})}e.extend(!0,e.fancybox.defaults,{btnTpl:{share:'<button data-fancybox-share class="fancybox-button fancybox-button--share" title="{{SHARE}}"><svg viewBox="0 0 40 40"><path d="M6,30 C8,18 19,16 23,16 L23,16 L23,10 L33,20 L23,29 L23,24 C19,24 8,27 6,30 Z"></svg></button>'},share:{url:function(t,e){return!t.currentHash&&"inline"!==e.type&&"html"!==e.type&&(e.origSrc||e.src)||window.location},tpl:'<div class="fancybox-share"><h1>{{SHARE}}</h1><p><a class="fancybox-share__button fancybox-share__button--fb" href="https://www.facebook.com/sharer/sharer.php?u={{url}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m287 456v-299c0-21 6-35 35-35h38v-63c-7-1-29-3-55-3-54 0-91 33-91 94v306m143-254h-205v72h196" /></svg><span>Facebook</span></a><a class="fancybox-share__button fancybox-share__button--tw" href="https://twitter.com/intent/tweet?url={{url}}&text={{descr}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m456 133c-14 7-31 11-47 13 17-10 30-27 37-46-15 10-34 16-52 20-61-62-157-7-141 75-68-3-129-35-169-85-22 37-11 86 26 109-13 0-26-4-37-9 0 39 28 72 65 80-12 3-25 4-37 2 10 33 41 57 77 57-42 30-77 38-122 34 170 111 378-32 359-208 16-11 30-25 41-42z" /></svg><span>Twitter</span></a><a class="fancybox-share__button fancybox-share__button--pt" href="https://www.pinterest.com/pin/create/button/?url={{url}}&description={{descr}}&media={{media}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m265 56c-109 0-164 78-164 144 0 39 15 74 47 87 5 2 10 0 12-5l4-19c2-6 1-8-3-13-9-11-15-25-15-45 0-58 43-110 113-110 62 0 96 38 96 88 0 67-30 122-73 122-24 0-42-19-36-44 6-29 20-60 20-81 0-19-10-35-31-35-25 0-44 26-44 60 0 21 7 36 7 36l-30 125c-8 37-1 83 0 87 0 3 4 4 5 2 2-3 32-39 42-75l16-64c8 16 31 29 56 29 74 0 124-67 124-157 0-69-58-132-146-132z" fill="#fff"/></svg><span>Pinterest</span></a></p><p><input class="fancybox-share__input" type="text" value="{{url_raw}}" /></p></div>'}}),e(t).on("click","[data-fancybox-share]",function(){var t,o,i=e.fancybox.getInstance(),a=i.current||null;a&&("function"===e.type(a.opts.share.url)&&(t=a.opts.share.url.apply(a,[i,a])),o=a.opts.share.tpl.replace(/\{\{media\}\}/g,"image"===a.type?encodeURIComponent(a.src):"").replace(/\{\{url\}\}/g,encodeURIComponent(t)).replace(/\{\{url_raw\}\}/g,n(t)).replace(/\{\{descr\}\}/g,i.$caption?encodeURIComponent(i.$caption.text()):""),e.fancybox.open({src:i.translate(i,o),type:"html",opts:{animationEffect:!1,afterLoad:function(t,e){i.$refs.container.one("beforeClose.fb",function(){t.close(null,0)}),e.$content.find(".fancybox-share__links a").click(function(){return window.open(this.href,"Share","width=550, height=450"),!1})}}}))})}(document,window.jQuery||jQuery),function(t,e,n){"use strict";function o(){var t=e.location.hash.substr(1),n=t.split("-"),o=n.length>1&&/^\+?\d+$/.test(n[n.length-1])?parseInt(n.pop(-1),10)||1:1,i=n.join("-");return{hash:t,index:o<1?1:o,gallery:i}}function i(t){var e;""!==t.gallery&&(e=n("[data-fancybox='"+n.escapeSelector(t.gallery)+"']").eq(t.index-1).trigger("click.fb-start"))}function a(t){var e,n;return!!t&&(e=t.current?t.current.opts:t.opts,n=e.hash||(e.$orig?e.$orig.data("fancybox"):""),""!==n&&n)}n.escapeSelector||(n.escapeSelector=function(t){var e=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g,n=function(t,e){return e?"\0"===t?"�":t.slice(0,-1)+"\\"+t.charCodeAt(t.length-1).toString(16)+" ":"\\"+t};return(t+"").replace(e,n)}),n(function(){n.fancybox.defaults.hash!==!1&&(n(t).on({"onInit.fb":function(t,e){var n,i;e.group[e.currIndex].opts.hash!==!1&&(n=o(),i=a(e),i&&n.gallery&&i==n.gallery&&(e.currIndex=n.index-1))},"beforeShow.fb":function(n,o,i,s){var r;i&&i.opts.hash!==!1&&(r=a(o),r&&(o.currentHash=r+(o.group.length>1?"-"+(i.index+1):""),e.location.hash!=="#"+o.currentHash&&(o.origHash||(o.origHash=e.location.hash),o.hashTimer&&clearTimeout(o.hashTimer),o.hashTimer=setTimeout(function(){"replaceState"in e.history?(e.history[s?"pushState":"replaceState"]({},t.title,e.location.pathname+e.location.search+"#"+o.currentHash),s&&(o.hasCreatedHistory=!0)):e.location.hash=o.currentHash,o.hashTimer=null},300))))},"beforeClose.fb":function(n,o,i){var s;i.opts.hash!==!1&&(s=a(o),o.currentHash&&o.hasCreatedHistory?e.history.back():o.currentHash&&("replaceState"in e.history?e.history.replaceState({},t.title,e.location.pathname+e.location.search+(o.origHash||"")):e.location.hash=o.origHash),o.currentHash=null,clearTimeout(o.hashTimer))}}),n(e).on("hashchange.fb",function(){var t,e=o();n.each(n(".fancybox-container").get().reverse(),function(e,o){var i=n(o).data("FancyBox");if(i.currentHash)return t=i,!1}),t?!t.currentHash||t.currentHash===e.gallery+"-"+e.index||1===e.index&&t.currentHash==e.gallery||(t.currentHash=null,t.close()):""!==e.gallery&&i(e)}),setTimeout(function(){n.fancybox.getInstance()||i(o())},50))})}(document,window,window.jQuery||jQuery),function(t,e){"use strict";var n=(new Date).getTime();e(t).on({"onInit.fb":function(t,e,o){e.$refs.stage.on("mousewheel DOMMouseScroll wheel MozMousePixelScroll",function(t){var o=e.current,i=(new Date).getTime();e.group.length<2||o.opts.wheel===!1||"auto"===o.opts.wheel&&"image"!==o.type||(t.preventDefault(),t.stopPropagation(),o.$slide.hasClass("fancybox-animated")||(t=t.originalEvent||t,i-n<250||(n=i,e[(-t.deltaY||-t.deltaX||t.wheelDelta||-t.detail)<0?"next":"previous"]())))})}})}(document,window.jQuery||jQuery);


!function(n){"function"==typeof define&&define.amd?define(["jquery"],function(e){return n(e)}):"object"==typeof module&&"object"==typeof module.exports?exports=n(require("jquery")):n(jQuery)}(function(n){function e(n){var e=7.5625,t=2.75;return n<1/t?e*n*n:n<2/t?e*(n-=1.5/t)*n+.75:n<2.5/t?e*(n-=2.25/t)*n+.9375:e*(n-=2.625/t)*n+.984375}void 0!==n.easing&&(n.easing.jswing=n.easing.swing);var t=Math.pow,u=Math.sqrt,r=Math.sin,i=Math.cos,a=Math.PI,c=1.70158,o=1.525*c,s=2*a/3,f=2*a/4.5;n.extend(n.easing,{def:"easeOutQuad",swing:function(e){return n.easing[n.easing.def](e)},easeInQuad:function(n){return n*n},easeOutQuad:function(n){return 1-(1-n)*(1-n)},easeInOutQuad:function(n){return n<.5?2*n*n:1-t(-2*n+2,2)/2},easeInCubic:function(n){return n*n*n},easeOutCubic:function(n){return 1-t(1-n,3)},easeInOutCubic:function(n){return n<.5?4*n*n*n:1-t(-2*n+2,3)/2},easeInQuart:function(n){return n*n*n*n},easeOutQuart:function(n){return 1-t(1-n,4)},easeInOutQuart:function(n){return n<.5?8*n*n*n*n:1-t(-2*n+2,4)/2},easeInQuint:function(n){return n*n*n*n*n},easeOutQuint:function(n){return 1-t(1-n,5)},easeInOutQuint:function(n){return n<.5?16*n*n*n*n*n:1-t(-2*n+2,5)/2},easeInSine:function(n){return 1-i(n*a/2)},easeOutSine:function(n){return r(n*a/2)},easeInOutSine:function(n){return-(i(a*n)-1)/2},easeInExpo:function(n){return 0===n?0:t(2,10*n-10)},easeOutExpo:function(n){return 1===n?1:1-t(2,-10*n)},easeInOutExpo:function(n){return 0===n?0:1===n?1:n<.5?t(2,20*n-10)/2:(2-t(2,-20*n+10))/2},easeInCirc:function(n){return 1-u(1-t(n,2))},easeOutCirc:function(n){return u(1-t(n-1,2))},easeInOutCirc:function(n){return n<.5?(1-u(1-t(2*n,2)))/2:(u(1-t(-2*n+2,2))+1)/2},easeInElastic:function(n){return 0===n?0:1===n?1:-t(2,10*n-10)*r((10*n-10.75)*s)},easeOutElastic:function(n){return 0===n?0:1===n?1:t(2,-10*n)*r((10*n-.75)*s)+1},easeInOutElastic:function(n){return 0===n?0:1===n?1:n<.5?-(t(2,20*n-10)*r((20*n-11.125)*f))/2:t(2,-20*n+10)*r((20*n-11.125)*f)/2+1},easeInBack:function(n){return(c+1)*n*n*n-c*n*n},easeOutBack:function(n){return 1+(c+1)*t(n-1,3)+c*t(n-1,2)},easeInOutBack:function(n){return n<.5?t(2*n,2)*(7.189819*n-o)/2:(t(2*n-2,2)*((o+1)*(2*n-2)+o)+2)/2},easeInBounce:function(n){return 1-e(1-n)},easeOutBounce:e,easeInOutBounce:function(n){return n<.5?(1-e(1-2*n))/2:(1+e(2*n-1))/2}})});
