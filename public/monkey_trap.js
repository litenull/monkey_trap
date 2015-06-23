var nacl_factory = 
	require('./bower_components/js-nacl/lib/nacl_factory.js');

var monkey_trap = {};

// Initialize NaCl module
monkey_trap.initialize = function() {
	monkey_trap.nacl = nacl_factory.instantiate(16777216);
}

// Generate Key pair
// @params
// User key (String) 
monkey_trap.generateKeyPair = function(key) {
	var keypair;
	keypair = this.nacl.crypto_box_keypair_from_seed(this.nacl.encode_utf8(key));
	return keypair;
}

// Convert object to array
// @params
// obj Object
monkey_trap.obj2arr = function(obj) {
	return Object.keys(obj).map(function (key) {return obj[key]});
}

// Get a new nonce
monkey_trap.getNonce = function() {
	return this.nacl.crypto_box_random_nonce();
}

// Open the box!
// Returns the content
monkey_trap.openBox = function(msg, nonce, pk, key) {
	var m, msg;
	m = this.nacl.crypto_box_open(msg, nonce, pk, key);
	msg = this.nacl.decode_utf8(m);
	return msg;
}


module.exports = monkey_trap;