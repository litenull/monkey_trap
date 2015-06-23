var mongoose = require('mongoose');
var uuid = require('node-libuuid');
var fs = require('fs');

var Url = mongoose.model('Url');

function addRoutes(app) {
  /*
    This API generates the link and the public/private key.
    The public key is stored in DB, which we will use to unlock
    all the data and store it safely.
  */

  app.post('/api/generate', function (req, res) {
    var context, id, pk, view_id, url, data;
    pk = req.body.pk || null;
    context = req.body.context || null;
    link = req.body.link;
    if (!pk || !context) return res.send(400);

    id = uuid.v4();
    view_id = uuid.v4();
    url = new Url({
      url: id + '/' + context,
      time: new Date(),
      view_id: view_id,
      pk: pk,
      data: data,
      link: link
    });
    
    url.save(function(err) {
      if (err) {
        return res.send(500, err.toString());
      }
      
      res.send({
        url: url.url,
        view_id: url.view_id
      }); 
    });
  });

  /*
    This API is used to track records
  */

  app.get('/view/:id/:context', function(req, res) {
    fs.readFile(__dirname + '/public/view.html', 'utf8', function(err, text){
        res.send(text);
    });
  });

  app.post('/store/:id/:context', function(req, res) {
    var url, ip, pk, data, nonce;
    url = req.params.id + '/' + req.params.context;
    pk  = req.body.pk;
    data = req.body.data || null;
    nonce = req.body.nonce;

    Url.findOne({ url: url }, function(err, docs) {
      if (err) {
        console.log('there was an error with the request ' + err.toString());
        res.send(200)
        return true;
      }

      if (docs) {
        docs.records.push({
          pk: pk,
          data: data,
          nonce: nonce
        });

        docs.save(function(err) {
          if (err) {
            console.log('there was an error with the request ' + err.toString());
          }
        });

        res.send({
          link: docs.link
        })
      }else{
        res.send(200);
      }
    });
  });

  /*
    This is the report API
  */

  app.get('/data/:id', function(req, res) {
    var id = req.params.id || null;
    if (!id) return res.send(400);
    
    Url.findOne({view_id: id}, function(err, url) {
      res.send({
        url: url.url,
        records: url.records
      });
    });
  });

  app.get('/ping/:id/:context', function(req, res) {
    var url;
    url = req.params.id + '/' + req.params.context;

    Url.findOne({ url: url }, function(err, docs) {
      if (err) {
        console.log('there was an error with the request ' + err.toString());
        return true;
      }

      if (docs) {
        res.send({
          ip: req.ip,
          pk: docs.pk
        });
      }
    });
  })
}

module.exports = {
  addRoutes: addRoutes
}