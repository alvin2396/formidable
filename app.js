// Required Modules
var formidable = require('formidable'),
    http = require('http'),
    util = require('util'),
    fs   = require('fs-extra');

    // create server
    http.createServer(function(req, res) {

   // Form uploading Process code
   //Upload route
console.log(req.url);
   if (req.url == '/upload' && req.method.toLowerCase() == 'post') {

 // creates a new incoming form.
 var form = new formidable.IncomingForm();

 // parse a file upload
    form.parse(req, function(err, fields, files) {
      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('Upload received :\n');
      res.end(util.inspect({fields: fields, files: files}));
    });
 form.on('end', function(fields, files) {
        /* Temporary location of our uploaded file */
        var temp_path = this.openedFiles[0].path;
        /* The file name of the uploaded file */
		var datenow = new Date();
        var file_name = datenow.getTime() + '_' + this.openedFiles[0].name;
        /* Location where we want to copy the uploaded file */
        var new_location = __dirname + '//uploaded_images/';
        fs.copy(temp_path, new_location + file_name, function(err) {
            if (err) {
                console.error(err);
            } else {
                console.log("success!")
            }
        });
    });
    return;
  }
  else if(req.url.indexOf('.js') != -1){ //req.url has the pathname, check if it contains '.js'

      fs.readFile(__dirname + req.url, function (err, data) {
        if (err) console.log(err);
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.write(data);
        res.end();
      });
  }
  else if(req.url.indexOf('.css') != -1){ //req.url has the pathname, check if it contains '.css'

	console.log(__dirname+req.url);
	console.log(req.url);
	  fs.readFile(__dirname + req.url, function (err, data) {
		if (err) console.log(err);
		res.writeHead(200, {'Content-Type': 'text/css'});
		res.write(data);
		res.end();
	  });
	// res.end()

  }
  else if(req.url.indexOf('.png') != -1 || req.url.indexOf('.jpg') != -1 || req.url.indexOf('.gif') != -1){ //req.url has the pathname, check if it contains '.css'

	console.log(__dirname+req.url);
	console.log(req.url);
	  fs.readFile(__dirname + req.url, function (err, data) {
		if (err) console.log(err);
		res.writeHead(200, {'Content-Type': 'image/jpg'});
		res.write(data);
		res.end();
	  });
	// res.end()

  }
  else if(req.url == '/'){
    fs.readFile('./index.html',function(err, html){
		console.log(fs);
      if (err) {
        throw err;
      } else {
		/* Displaying file upload form. */
		  res.writeHead(200, {'content-type': 'text/html'});
		  res.write(html);
	  }
	  res.end();
    })
  } else if(req.url == '/list'){
    fs.readFile('./lightbox.html',function(err, html){
	//console.log(html);
      if (err) {
		//console(err);
        throw err;
		res.end();
      } else {
		res.writeHead(200, {'content-type': 'text/html'});
		console.log(res.body);
		// res.write(html);
		fs.readdir(__dirname + '/uploaded_images', function(err, filenames)
		{
			//console.log(__dirname + '/images/upload/');
			var headerS = fs.readFileSync("header.html", "utf8");
			var footerS = fs.readFileSync("footer.html", "utf8");
			var image_text = "";
			filenames.forEach(function(filename) {
				// console.log(filename)
				var ext = filename.split(".")[1];
				if(ext== "jpg" || ext== "png" || ext== "gif")
					image_text += '<a class="example-image-link" href="uploaded_images/'+filename+'" data-lightbox="example-set" data-title="Click the right half of the image to move forward."><img class="example-image" src="uploaded_images/'+filename+'" alt=""/></a>';
			});
			res.write(headerS);
			res.write(image_text);
			res.write(footerS);
			res.end();
		});
		// res.writeHead(200, {'content-type': 'text/html'});
	  }
    })
  }
}).listen(8123);
