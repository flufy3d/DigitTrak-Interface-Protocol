//refer to http://codepen.io/pouretrebelle/pen/udbFC
$(document).ready(function() {
jQuery.fn.pickify = function() {
	return this.each(function() {
		$picker = $(this);
		$input = $picker.children('input.change');
		$board = $picker.children('.board');
		$choice = $board.children();
		$rainbow = $picker.children('.rainbow');
    
		var colors = $picker.attr('data-xy').split(',');
		$picker.data('xy', {x: colors[0], y: colors[1] })

		$input.val("xy kenshin1987")

		
		// making things happen
		$rainbow.slider({
      	value: colors[0],
      	min: 0,
      	max: 360,
			slide: function(event, ui) {console.log(ui.value)},
			stop: function() {console.log('$rainbow.slider stop')}
    	})
		$choice.draggable({
			containment: '.board',
			cursor: 'crosshair',
			create: function() {$choice.css({'left': colors[1]*1.8, 'top': 180-colors[2]*1.8});},
			drag: function(event, ui) {console.log(ui.position.left, ui.position.top)},
			stop: function() {console.log('$choice.draggable stop')}
		});
		$board.on('click', function(e) {
			var left = e.pageX-$board.offset().left;
			var top = e.pageY-$board.offset().top;
			$choice.css({'left': left, 'top': top});

		});
		
		
		// input change
		$input.keyup(function(e) {
      if (e.which != (37||39)) {
				inputChange($input.val());
    	}
		});
		function inputChange(val) {
			console.log(val)
		}

	

	});
};

$('.picker').pickify();

});