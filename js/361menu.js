var event = window.event;
var isDragging = false;
var DEBUG = true;

$(document).ready(function () {

});

function startDrag(div) {
	if(DEBUG) console.log('Start dragging...');
	isDragging = true;
	$('.menu361-background').css("height", "100%");
	$('.menu361-background').css("width", "100%");
}

function drag(div) {
	if (isDragging) {
		if(DEBUG) console.log('Is dragging...');
		$(div).css("top", event.clientY - 32);
		$(div).css("left", event.clientX - 32);
	}
}

function endDrag(div) {
	if(DEBUG) console.log('End dragging...');
	isDragging = false;
	$('.menu361-background').css("height", "2px");
	$('.menu361-background').css("width", "2px");
}