$(document).ready(function(){

	var mark = new Remarkable({
		html: true,
		linkify: true
	});

	$('main textarea').keyup(function(e){
		var markdown = e.target.value
		$('aside').html(mark.render(markdown))
	})

})