//refer to http://codepen.io/pouretrebelle/pen/udbFC
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


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
			v = Number(v.toFixed(2))

			var d = - Math.acos(vec.x/vec_length)/Math.PI * 180 + 90
			d = Number(d.toFixed(2))

			$input.val('D: '+ d + ' V: ' + v);

			$picker.data('yaw', d);
			$picker.data('velocity', v);

		}

		$wait = $picker.children('#wait');
		$ready = $picker.children('#ready');
		$shot = $picker.children('#shot');
		$connect = $picker.children('#connect');
		$url = $picker.children('#url');


		$wait.on('click', function(e) {
		    data = {}
		    data.cmd = 5
		    data.broadcast = {"state": 0}
		    $picker.data('websocket').send(JSON.stringify(data));
		});

		$ready.on('click', function(e) {
		    data = {}
		    data.cmd = 5
		    data.broadcast = {"state": 1}
		    $picker.data('websocket').send(JSON.stringify(data));
		});

		$shot.on('click', function(e) {

			if($picker.data('shotting') == 1)
			{
				console.log('shotting...');
				return;
			}
			$picker.data('shotting',1)
				

			var websocket = $picker.data('websocket')

			data = {}
		    data.cmd = 5
		    data.broadcast = {"state": 2}
		    websocket.send(JSON.stringify(data));

		    sleep(20)

			data = {}
		    data.cmd = 5
		    data.broadcast = {
		    	"data": {
			    	"confidence": $picker.data('confidence'), 
			    	"sidespin": $picker.data('sidespin'), 
			    	"yaw": $picker.data('yaw'), 
			    	"backspin": $picker.data('backspin'), 
			    	"pitch": $picker.data('pitch'), 
			    	"velocity": $picker.data('velocity')
		    	}, 
		    	"type": 0
		    }
		    websocket.send(JSON.stringify(data));


			sleep(20)

			data = {}
		    data.cmd = 5
		    data.broadcast = {"state": 3}
		    websocket.send(JSON.stringify(data));

		    setTimeout(function() {
				data = {}
			    data.cmd = 5
			    data.broadcast = {"data": {"ball_offset": -0.02, "club_horiz": 0.54, "club_vert": 16, "club_velocity": 13.2}, "type": 1}
			    websocket.send(JSON.stringify(data));
			    $picker.data('shotting',0)
		    },1000)


		    

		});

		$connect.on('click', function(e) {
			var url = $url[0].value
		    var websocket = new WebSocket(url);
		    websocket.onopen = function(evt) { console.log('onopen') };
		    websocket.onclose = function(evt) { console.log('onclose');$connect.removeAttr('disabled');};
		    websocket.onmessage = function(evt) { console.log(evt.data) };
		    websocket.onerror = function(evt) { alert('connect error');$connect.removeAttr('disabled');};

		    $picker.data('websocket', websocket);


			$wait.removeAttr('disabled');
			$ready.removeAttr('disabled');
			$shot.removeAttr('disabled');
			$connect.attr('disabled','disabled');	    
		});	

	});
};

$('.picker').pickify();

});