//refer to http://codepen.io/pouretrebelle/pen/udbFC
$(document).ready(function() {
jQuery.fn.pickify = function() {
	return this.each(function() {
		$picker = $(this);
		$input = $picker.children('input.change');
		$board = $picker.children('.board');
		$choice = $board.children();

		$pitch = $picker.children('#pitch');
		$backspin = $picker.children('#backspin');
		$sidespin = $picker.children('#sidespin');
		$confidence = $picker.children('#confidence');


		// making things happen

    
		var xy = $picker.attr('data-xy').split(',');	
		change_xy(Number(xy[0]),Number(xy[1]));


		function init_comp(obj ,min ,max ,def ,tag )
		{

			$picker.data(tag, def);
			obj.slider({
	      	value: $picker.data(tag),
	      	min: min,
	      	max: max,
	      		create: function(){obj.children('label').text(tag + ': ' + $picker.data(tag));},
				slide: function(event, ui) {
					obj.children('label').text(tag + ': ' + ui.value);
					$picker.data(tag, ui.value);
				},
				stop: function() {}
	    	})


		}

		init_comp($pitch,0,90,18,"pitch");
		init_comp($backspin,0,9000,7000,"backspin");
		init_comp($sidespin,-1000,1000,418,"sidespin");
		init_comp($confidence,0,1.0,1,"confidence");


	

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
			$choice.css({'left': x, 'top': y});

			var width = 180;
			var height = 180;
			var start = {x:width/2,y:height};
			var end = {x:x, y:y};

			$picker.data('xy', end);

			var vec = {x:end.x-start.x,y:end.y-start.y}
			
			var vec_length = Math.sqrt(vec.x*vec.x + vec.y*vec.y)

			var all_length = Math.sqrt(width*width + height*height)

			var v = vec_length/all_length * 120.0

			var d = - Math.acos(vec.x/vec_length)/Math.PI * 180 + 90

			$input.val('D: '+ d.toFixed(2) + ' V: ' + v.toFixed(2));

			$picker.data('yaw', d);
			$picker.data('velocity', v);

		}

	

	});
};

$('.picker').pickify();

});