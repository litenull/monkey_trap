var $ = 
	require('./bower_components/jquery/jquery.min.js');
var monkey_trap = require('./monkey_trap');

monkey_trap.initialize();

window.monkey_trap = monkey_trap;

$(document).ready(function() {
	$('#create_link').on('click', function() {
		var keypair, data, password;
		password = $('#secret_password').val();
		keypair = monkey_trap.generateKeyPair(password);

		data = {
			context: $('#context').val(),
			link: $('#redirect_url').val(),
			pk: keypair.boxPk
		};

		$.post('/api/generate', data, function(data) {
			$('#secret_key').html(password);
			$('#link').html('/' + data.url);
			$('#view_id').html(data.view_id);
			$('.link').fadeIn();
		});
	});

	$('#get_data').on('click', function() {
		var data, secret, keypair;

		secret = $('#secret').val();

		data = {
			id: $('#id').val()
		}

		keypair = monkey_trap.generateKeyPair(secret);

		$.get('/data/' + data.id, function(data) {
			var nonce, msg, pk, key, box;

			$('.data').html('');
			data.records.forEach(function(record) {
				if (record.data) {
					try {
						nonce = new Uint8Array(monkey_trap.obj2arr(record.nonce.data));
						msg = new Uint8Array(monkey_trap.obj2arr(record.data));
						pk = new Uint8Array(monkey_trap.obj2arr(record.pk));
						key = keypair.boxSk;
						box = monkey_trap.openBox(
							msg,
							nonce,
							pk,
							key
						);
						$('.data').append('<div>' + box + '</div>');
					}catch(e) {
					}
				}
			})
		});
	});
});



