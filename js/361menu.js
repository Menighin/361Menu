var DEBUG = true
var D_RADIUS = 32;
var D_SUBMENU_RADIUS = 16;
var D_TIME_TO_HIDE = 1000;
var D_SUB_ANIMATION_TIME = 200;
var D_SUBMENU_PADDING = 4;

/*

{
	root: "id",
	minX: 0px,
	minY: 0px,
	maxX: 0px,
	maxY: 0px,
	radius: 64px, 
	subRadius: 16px,
	submenuPadding: 4px,
	timeToHide: 1000ms,
	
}

*/

function MenuAnimation361 (menu361) {

	var handle = menu361;

	this.transition = {
		update: function(c) {
			var currentTime = Date.now();
			var positionInAnimation = (currentTime - c.startTime) / c.duration;
			
			var xPosition = positionInAnimation * c.translate.x;
			var yPosition = positionInAnimation * c.translate.y;
			
			c.target.style.left = c.origin.x + xPosition + 'px';
			c.target.style.top  = c.origin.y + yPosition + 'px';

			if (positionInAnimation <= 1)
				requestAnimationFrame(function() {c.update(c)});
			else {
				c.target.style.left = c.origin.x + c.translate.x + 'px';
				c.target.style.top  = c.origin.y + c.translate.y + 'px';
				if (typeof c.callback != 'undefined' && c.callback != null)
					c.callback(menu361);
			}
			
		},
		start: function(target, origin, translate, duration, callback) {
			this.startTime = Date.now();
			this.duration = duration;
			this.origin = origin;
			this.translate = translate;
			this.callback = callback;
			this.target = target;
			var self = this;
			requestAnimationFrame(function() {self.update(self);});
		}
	}
	
	this.bounce = {
		update: function(c) {
			var currentTime = Date.now();
			var positionInAnimation = (currentTime - c.startTime) / c.duration;
			
			//log(positionInAnimation);
			var xPosition = positionInAnimation * c.translate.x;
			var yPosition = positionInAnimation * c.translate.y;
			
			c.target.style.left = c.origin.x + xPosition + 'px';
			c.target.style.top  = c.origin.y + yPosition + 'px';

			if (positionInAnimation <= 1)
				requestAnimationFrame(function() {c.update(c)});
			else {
				c.target.style.left = c.origin.x + c.translate.x + 'px';
				c.target.style.top  = c.origin.y + c.translate.y + 'px';
				if (typeof c.callback != 'undefined' && c.callback != null)
					c.callback(menu361);
			}
			
		},
		start: function(target, origin, translate, duration, callback) {
			this.startTime = Date.now();
			this.duration = duration;
			this.origin = origin;
			this.translate = translate;
			this.callback = callback;
			this.target = target;
			var self = this;
			requestAnimationFrame(function() {self.update(self);});
		}
	}
	
}

var Menu361 = {

	obj : null,
	
	init : function(p) {
		
		if(DEBUG) log('Initializing 361º Menu');
		
		if (!p || typeof p == 'undefined')
			p = {};
		
		var handle = document.createElement('div');
		handle.id = 'menu361-handle';
		
		handle.parameters = p;
		
		handle.style.width  = 2 * (p.radius ? p.radius : D_RADIUS) + "px";
		handle.style.height = 2 * (p.radius ? p.radius : D_RADIUS) + "px";
		
		handle.onmousedown = Menu361.start; 
		
		var rootId = p.menu && p.menu != null ? p.menu : 'menu361';
		handle.root = document.getElementById(rootId);
		
		if (!handle.root || typeof handle.root == 'undefined') {
			log('Div with id equals to "' + rootId + '" not found. Exiting...');
			return;
		}
		
		handle.root.style.left = (p.initialX ? p.initialX : 0) + "px";
		handle.root.style.top  = (p.initialY ? p.initialY : 0) + "px";

		handle.minX	= typeof p.minX != 'undefined' ? p.minX : null;
		handle.minY	= typeof p.minY != 'undefined' ? p.minY : null;
		handle.maxX	= typeof p.maxX != 'undefined' ? p.maxX : null;
		handle.maxY	= typeof p.maxY != 'undefined' ? p.maxY : null;

		handle.root.onDragStart	= new Function();
		handle.root.onDragEnd	= new Function();
		handle.root.onDrag		= new Function();
		
		// Initializing submenus
		handle.subMenu = {};
		handle.subMenu.isActive = false;
		handle.subMenu.timeToHide = p.timeToHide ? p.timeToHide : D_TIME_TO_HIDE;
		
		// Positioning
		handle.subMenu.items = handle.root.getElementsByTagName('li');
		handle.subMenu.initialPosition = (p.radius ? p.radius : D_RADIUS) - (p.subRadius ? p.subRadius : D_SUBMENU_RADIUS);
		handle.subMenu.resetPosition = function(menu) {
			var items = menu.subMenu.items;
			for (var i = 0; i < items.length; i++) {
				items[i].style.left = items[i].style.top = menu.subMenu.initialPosition + 'px';
			}
		}
		
		handle.subMenu.resetPosition(handle);
		
		var items = handle.subMenu.items;
		for (var i = 0; i < items.length; i++) {
			items[i].onmouseover = this.showSubMenu;
			items[i].style.height = 2 * (p.subRadius ? p.subRadius : D_SUBMENU_RADIUS) + 'px';
			items[i].style.width  = 2 * (p.subRadius ? p.subRadius : D_SUBMENU_RADIUS) + 'px';
		}
		
		handle.onmouseover = Menu361.showSubMenu;
		handle.onmouseout  = Menu361.hideSubMenu;
		
		handle.root.insertBefore(handle, handle.root.firstChild);
		handle.radius = p.radius ? p.radius : D_RADIUS;
		
		Menu361.obj = handle;
		
		
	},

	start : function(e) {
	
		if (DEBUG) log("Start dragging...");
		
		var handle = this;
		
		e = Menu361.fixE(e);
		var y = parseInt(handle.root.style.top);
		var x = parseInt(handle.root.style.left);
		handle.root.onDragStart(x, y);

		handle.lastMouseX = e.clientX;
		handle.lastMouseY = e.clientY;

		if (handle.minX != null) handle.minMouseX = e.clientX - x + handle.minX;
		if (handle.maxX != null) handle.maxMouseX = handle.minMouseX + handle.maxX - handle.minX;

		if (handle.minY != null) handle.minMouseY = e.clientY - y + handle.minY;
		if (handle.maxY != null) handle.maxMouseY = handle.minMouseY + handle.maxY - handle.minY;

		document.onmousemove = Menu361.drag;
		document.onmouseup = Menu361.end;

		return false;
	},

	drag : function(e) {
		
		if (DEBUG) log("Dragging...");
	
		e = Menu361.fixE(e);
		var handle = Menu361.obj;
		
		var ey	= e.clientY;
		var ex	= e.clientX;
		var y = parseInt(handle.root.style.top);
		var x = parseInt(handle.root.style.left);
		var nx, ny;
		
		if (handle.minX != null) ex = Math.max(ex, handle.minMouseX);
		if (handle.maxX != null) ex = Math.min(ex, handle.maxMouseX);
		if (handle.minY != null) ey = Math.max(ey, handle.minMouseY);
		if (handle.maxY != null) ey = Math.min(ey, handle.maxMouseY);

		nx = x + (ex - handle.lastMouseX);
		ny = y + (ey - handle.lastMouseY);
		
	
		Menu361.obj.root.style.left = nx + "px";
		Menu361.obj.root.style.top = ny + "px";
		Menu361.obj.lastMouseX	= ex;
		Menu361.obj.lastMouseY	= ey;

		Menu361.obj.root.onDrag(nx, ny);
		return false;
	},

	end : function() {
	
		if (DEBUG) log("Stopped dragging...");
		
		document.onmousemove = null;
		document.onmouseup   = null;
		Menu361.obj.root.onDragEnd(	parseInt(Menu361.obj.root.style.left), parseInt(Menu361.obj.root.style.top));
	},
	
	showSubMenu : function() {
		
		if(DEBUG) log("Showing sub-menus...");
		
		var handle = Menu361.obj;
		if (!handle.subMenu.isActive) {
			var items = handle.subMenu.items;
			var sections = Math.trunc(360 / items.length);
			var degrees = -90;
			for (var i = 0; i < items.length; i++) {
				var anim = new MenuAnimation361(handle);
				
				var origin = { x: handle.subMenu.initialPosition, y: handle.subMenu.initialPosition };
				
				
				var translate = {
					x: parseInt(Math.round(Math.cos(toRadians(degrees)) * (handle.radius + parseInt(items[i].style.width) / 2 + (handle.parameters.submenuPadding ? handle.parameters.submenuPadding : D_SUBMENU_PADDING)))),
					y: parseInt(Math.round(Math.sin(toRadians(degrees)) * (handle.radius + parseInt(items[i].style.height) / 2 + (handle.parameters.submenuPadding ? handle.parameters.submenuPadding : D_SUBMENU_PADDING))))
				};
				
				anim.bounce.start( items[i], origin, translate, D_SUB_ANIMATION_TIME);
				degrees += sections;
			}
			
			handle.subMenu.isActive = true;
		} else if (handle.subMenu.outTimer)  {
			clearTimeout(handle.subMenu.outTimer);
		}
	},
	
	hideSubMenu : function(e) {
	
		if(DEBUG) log("Hiding sub-menus...");
	
		e = Menu361.fixE(e);
		var handle = Menu361.obj;
		
		var hoveredElement = document.elementFromPoint(e.clientX, e.clientY);
		
		if (hoveredElement && hoveredElement.tagName != "LI") {
			clearTimeout(handle.subMenu.outTimer);
			handle.subMenu.outTimer = setTimeout(function() {
					Menu361.obj.subMenu.isActive = false;
					Menu361.obj.subMenu.outTimer = null;
					
					
					var items = Menu361.obj.subMenu.items;
					var degrees = -90;
					var sections = Math.trunc(360 / items.length);
					for (var i = 0; i < items.length; i++) {
						var anim = new MenuAnimation361(handle);
						
						var origin = { x: parseInt(items[i].style.left), y: parseInt(items[i].style.top) };
						
						var destin = {
							x: -parseInt(Math.round(Math.cos(toRadians(degrees)) * (handle.radius + parseInt(items[i].style.width)/2+(handle.parameters.submenuPadding ? handle.parameters.submenuPadding : D_SUBMENU_PADDING)))),
							y: -parseInt(Math.round(Math.sin(toRadians(degrees)) * (handle.radius + parseInt(items[i].style.height)/2+(handle.parameters.submenuPadding ? handle.parameters.submenuPadding : D_SUBMENU_PADDING))))
						};
						
						anim.transition.start( items[i], origin, destin, D_SUB_ANIMATION_TIME, Menu361.obj.subMenu.resetPosition);
						degrees += sections;
					}
					
					
				}, handle.subMenu.timeToHide);
		} else if(hoveredElement) {
			hoveredElement.onmouseout = Menu361.hideSubMenu;
		}
	},

	fixE : function(e) {
		if (typeof e == 'undefined') e = window.event;
		if (typeof e.layerX == 'undefined') e.layerX = e.offsetX;
		if (typeof e.layerY == 'undefined') e.layerY = e.offsetY;
		return e;
	}
};

function log(s) {
	console.log(s);
}

function toRadians(x) {
	return x * (Math.PI / 180);
}