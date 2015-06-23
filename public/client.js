var nacl_factory = 
	require('./bower_components/js-nacl/lib/nacl_factory.js');
var xmlhttp = new XMLHttpRequest();
function sendRequest(url, method, data, callback) {
	xmlhttp.onreadystatechange=function() {
	  if (xmlhttp.readyState==4 && xmlhttp.status==200) {
	    callback(xmlhttp);
	  }
	};

	xmlhttp.open(method, url, true);
	if (method === 'POST') {
		xmlhttp.setRequestHeader('Content-Type', 'application/json');
	}
	xmlhttp.send(JSON.stringify(data));
}

var data;
id = window.location.href.replace(window.location.origin + '/view/', '').split('/');

var nacl = nacl_factory.instantiate(16777216);
var senderKeypair, message, nonce, packet, decoded, ip, package, obj;

sendRequest('/ping/' + id[0] + '/' + id[1], 'GET', null, function(data) {
	if (!data) return console.log('error');

	senderKeypair = nacl.crypto_box_keypair();
	ip = JSON.parse(data.response).ip;
	nonce = nacl.crypto_box_random_nonce();

	package = {
		ip: ip
	};

	message = nacl.encode_utf8(JSON.stringify(package));
	packet = nacl.crypto_box(message, nonce,
		new Uint8Array(JSON.parse(data.response).pk), senderKeypair.boxSk);

	obj = {
		data: packet,
		pk: senderKeypair.boxPk,
		nonce: nonce
	};

	sendRequest('/store/' + id[0] + '/' + id[1], 'POST', obj, function(data) {
		var a = JSON.parse(data.response)
		window.location = a.link;
	});
});



