var DEBUG = true
var DEFAULT_RADIUS = 32;
var DEFAULT_SUBMENU_RADIUS = 16;

/*

{
	root: ID ROOT,
	minX: 0,
	minY: 0,
	maxX: 0,
	maxY: 0,
	radius: 64, 

*/


var Menu361 = {

	obj : null,
	
	init : function(p) {
		
		if(DEBUG) log('Initializing 361º Menu');
		
		if (!p || typeof p == 'undefined')
			p = {};
		
		var handle = document.createElement('div');
		handle.id = 'menu361-handle';
		
		handle.style.width  = 2 * (p.radius ? p.radius : DEFAULT_RADIUS) + "px";
		handle.style.height = 2 * (p.radius ? p.radius : DEFAULT_RADIUS) + "px";
		
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
		handle.subMenu.items = handle.root.getElementsByTagName("li");
		handle.subMenu.initialPosition = (p.radius ? p.radius : DEFAULT_RADIUS) - DEFAULT_SUBMENU_RADIUS;
		handle.subMenu.resetPosition = function() {
			var items = this.items;
			for (var i = 0; i < items.length; i++) {
				items[i].style.left = items[i].style.top = this.initialPosition + "px";
			}
		}
		handle.subMenu.resetPosition();
		
		handle.onmouseover = Menu361.showSubMenu;
		handle.onmouseout = Menu361.hideSubMenu;
		
		handle.root.insertBefore(handle, handle.root.firstChild);
		handle.radius = p.radius ? p.radius : DEFAULT_RADIUS;
		
		Menu361.obj = handle;
		
		
	},

	start : function(e) {
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
		document.onmousemove = null;
		document.onmouseup   = null;
		Menu361.obj.root.onDragEnd(	parseInt(Menu361.obj.root.style.left), parseInt(Menu361.obj.root.style.top));
	},
	
	showSubMenu : function() {
		
		var handle = Menu361.obj;
		if (!handle.subMenu.isActive) {
			var items = handle.subMenu.items;
			var sections = Math.trunc(360 / items.length);
			var degrees = -90;
			for (var i = 0; i < items.length; i++) {
				items[i].style.top  = parseInt(items[i].style.top ) + Math.round(Math.sin(toRadians(degrees)) * handle.radius) + "px";
				items[i].style.left = parseInt(items[i].style.left) + Math.round(Math.cos(toRadians(degrees)) * handle.radius) + "px";
				degrees += sections;
			}
			
			handle.subMenu.isActive = true;
		}
	},
	
	hideSubMenu : function(e) {
		e = Menu361.fixE(e);
		var hoveredElement = document.elementFromPoint(e.clientX, e.clientY);
		if (hoveredElement && hoveredElement.tagName != "LI") {
			Menu361.obj.subMenu.resetPosition();
			Menu361.obj.subMenu.isActive = false;
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