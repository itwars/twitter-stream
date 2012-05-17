var filters='';
var socket = io.connect();
socket.on('message', function(json) {
    data = JSON.parse(json);
    var replacePattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    var replacedText = (data.text).replace(replacePattern, '<a href="$1" target="_blank">$1</a>');
    filters.forEach(function(str) {
        var search = new RegExp(str, "gim");
        replacedText = replacedText.replace(search, '<span class="label label-important">'+str+'</span>');
    });
	$("<li></li>").html("[" + data.user.screen_name + "] " + replacedText)
      	.prependTo("ul.unstyled")
      	.css({opacity:0}).slideDown("slow").animate({opacity:1},"slow");
});
socket.on("connect", function() {
    socket.emit('getfilter', function() {
    });
    console.log("connected");
});
socket.on("disconnect", function() {
    console.log("disconnected");
});
socket.on('pushfilter', function(f) {
    filters=f;
    $('#tracker').empty();    
    filters.forEach(function(str) {
	$('<div class="alert alert-block alert-error fade in" id="'+str+'"><a class="close" data-dismiss="alert" id="'+str+'" href="#">&times;</a><p>'+str+'</p></div></div>').prependTo("#tracker");
    });
});

function addTrack() {
    socket.emit( 'data', '+', $('#data').attr('value'));
    $('#data').val('');
    socket.disconnect();
    socket.socket.reconnect();
}
$("#tracker").delegate('a', 'click', function() { 
    socket.emit( 'data', '-', $(this).attr('id'));
    socket.disconnect();
    socket.socket.reconnect();
});
