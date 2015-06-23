var mongoose = require('mongoose');
mongoose.connect('127.0.0.1');

var EavesdropperSchema = new mongoose.Schema({
  ip: String,
  time: Date,
  count: Number
});

var UrlSchema = new mongoose.Schema({
  url: String,
  time: Date,
  view_id: String,
  data: Array,
  pk: Array,
  records: Array,
  link: String
});

var Url = mongoose.model('Url', UrlSchema);