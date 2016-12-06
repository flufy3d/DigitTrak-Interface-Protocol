//refer to http://codepen.io/pouretrebelle/pen/udbFC
$(document).ready(function() {
jQuery.fn.pickify = function() {
	return this.each(function() {
		$picker = $(this);
		$input = $picker.children('input.change');
		$board = $picker.children('.board');
		$choice = $board.children();
		$rainbow = $picker.children('.rainbow');

		// making things happen
		$rainbow.slider({
      	value: 100,
      	min: 0,
      	max: 360,
			slide: function(event, ui) {console.log('slide:'+ui.value)},
			stop: function() {}
    	})
    
		var xy = $picker.attr('data-xy').split(',');		
		$picker.data('xy', {x: Number(xy[0]), y: Number(xy[1])})

		$choice.draggable({
			containment: '.board',
			cursor: 'crosshair',
			create: function() {change_xy($picker.data('xy').x,$picker.data('xy').y)},
			drag: function(event, ui) {change_xy(ui.position.left, ui.position.top)},
			stop: function() {}
		});
		$board.on('click', function(e) {
			var left = e.pageX-$board.offset().left;
			var top = e.pageY-$board.offset().top;
			change_xy(left,top);
		});
		
		// input change
		$input.keyup(function(e) {
			console.log($input.val())
		});

		function change_xy(x,y)
		{
			$picker.data('xy', {x:x, y:y});
			$choice.css({'left': x, 'top': y});
			$input.val('D: '+ x + ' V: ' + y);
			
		}

	

	});
};

$('.picker').pickify();

});