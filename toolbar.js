(function($){
  $.fn.toolBar = function(option, settings){
		if(typeof option === 'object'){
			settings = option;
		}
		else if(typeof option === 'string'){
			var values = [];
			var elements = this.each(function(){
				var data = $(this).data('_toolBar');
				if(data){
					if(option === 'visible'){
						if(settings !== undefined){
							data.visible(settings);
						}
						else{
							values.push(data.settings[option]);
						}
					}
					else{
						if(settings !== undefined){
							data.settings[option] = settings;
						}
						else{
							values.push(data.settings[option]);
						}
					}
				}
			});
			if(values.length === 1) { return values[0]; }
			if(values.length > 0) { return values; }
			else { return elements; }
		}

		return this.each(function(){
			var container = $(this);
			var $settings = $.extend({}, $.fn.toolBar.defaults, settings || {});
			var preventSelection = new PreventSelection();
			var toolbar = new ToolBar($settings,preventSelection);
			var $el = toolbar.generate();
			$(this).prepend($el);
			toolbar.visible(toolbar.settings.visible);
			$(this).data('_toolBar',toolbar);
		});
	}

	$.fn.toolBar.defaults = {
		visible: false,
		buttons : [
								{id: 'btnEdit',  name: 'Добавить', bimage: 'images/filter.png', hidename: true, tooltip: 'Корегувати список IC', onpress: Function()},
								{id: 'btnExpand',  name: 'Развернуть', bimage: 'images/expand.gif', hidename: true, tooltip: 'Развернуть все', onpress: Function()},
								{id: 'btnCollapse',  name: 'Свернуть', bimage: 'images/collapse.gif', hidename: true, tooltip: 'Свернуть все', onpress: Function()},
								// {id: 'btnAction',  name: 'Выполнить',  hidename: false, tooltip: 'Выполнить', onpress: test},
								{separator: true}
							]
	};
function PreventSelection(){
		this.preventSelection = false;
		return this;
	}

	PreventSelection.prototype = {
		addHandler: function (element, event, handler){
	    if (element.attachEvent)
	      element.attachEvent('on' + event, handler);
	    else if (element.addEventListener)
	       element.addEventListener(event, handler, false);
	  },
		removeSelection: function()
		{
	    if (window.getSelection) { window.getSelection().removeAllRanges(); }
	    else if (document.selection && document.selection.clear)
	      document.selection.clear();
		},
		killCtrlA: function(event)
		{
	    var event = event || window.event;
	    var sender = event.target || event.srcElement;
	    if (sender.tagName.match(/INPUT|TEXTAREA/i))
	      return;
	    var key = event.keyCode || event.which;
	    if (event.ctrlKey && key == 'A'.charCodeAt(0))  // 'A'.charCodeAt(0) можно заменить на 65
	    {
	      this.removeSelection();
	      if (event.preventDefault)
	        event.preventDefault();
	      else
	        event.returnValue = false;
	    }
		},
		On: function(element){
			var preventSel = this
		  this.addHandler(element, 'mousemove', function(){
		    if(preventSel.preventSelection)
		      preventSel.removeSelection();
		  });
		  this.addHandler(element, 'mousedown', function(event){
		    var event = event || window.event;
		    var sender = event.target || event.srcElement;
		    preventSel.preventSelection = !sender.tagName.match(/INPUT|TEXTAREA/i);
		  });
		  this.addHandler(element, 'mouseup', function(){
		    if (preventSel.preventSelection)
		      preventSel.removeSelection();
		    preventSel.preventSelection = false;
		  });
		  this.addHandler(element, 'keydown', this.killCtrlA);
		  this.addHandler(element, 'keyup', this.killCtrlA);
		}
	}

	function ToolBar(settings,PreventSelection){
		this.toolbar = null;
		this.buttons = settings.buttons;
		this.settings = settings;
		this.PreventSelection = PreventSelection;
		return this;
	}

	ToolBar.prototype = {
		generate: function(){
			var $this = this;
			var $tDiv = $('<div class="divToolBar"></div>');
			this.buttons.forEach(function(el,i){
				if(el.hasOwnProperty('name')){
					var paddingL = (el.hidename ? (el.bimage ? 10 : 2) :  (el.bimage ? 20 : (el.bclass ? 20 : 2)));
					var button =
					$('<div class="fbutton"></div>')
					.append(
						$('<div></div>')
						.append(
						  $('<span>' + (el.hidename ? '&nbsp;' : el.name) + '</span>').css('paddingLeft',paddingL)
						)
					);

					if (el.bclass){
						$('span', button[0]).addClass(el.bclass);
					}

					if (el.bimage){
						$('span',button[0]).css( 'background', 'url('+el.bimage+') no-repeat center left' );
					}

					if (el.tooltip)
						$('span',button[0])[0].title = el.tooltip;

					button[0].onpress = el.onpress;
					button[0].name = el.name;
					if (el.id) {
						button[0].id = el.id;
					}

					$tDiv.append(button);

					if (el.onpress) {
						button.click(function () {
							console.log('system event: ' + (this.id || this.name));
							this.onpress(this.id || this.name, $tDiv[0]);
						});
					}

					button
					.mousedown(function(){
						this.style.borderStyle = 'solid';
						this.style.borderColor = '#ccc';
						this.style.borderWidth = '1px';
					})
					.mouseup(function(){
						this.style.borderStyle = 'solid';
						this.style.borderColor = '#B4B4B4';
						this.style.borderWidth = '1px';
					})
				}
				else if(el.hasOwnProperty('separator')){
					if(el.separator){
						var button = 	$('<div class="btnseparator"></div>')
						$tDiv.append(button);
					}
				}
			});
			$this.toolbar = $('<div class="toolBar"></div>').append($tDiv)
			.append(
				$('<div></div>').css({'clear':'both'})
			);
			return $this.toolbar;
		},
		visible: function(state){
			var $this = this;
			this.settings.visible = state;
			$this.toolbar.css({'display':(state ? '' : 'none')});
			// if(state){
			// 	var container = this.toolbar.parents(0),
			// 	bDiv = this.toolbar.parents(0).find('.divBody'),
			// 	th = container.height() - bDiv[0].offsetTop;;
			// 	bDiv.css('height',th);
			// 	console.log('height: ' + th);
			// }
		}
	}
})(jQuery);
