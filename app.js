// Required Modules
var express = require('express'),
    formidable = require('formidable'),

    fs = require('fs-extra');

//Required Variables
var app = express();
app.use(express.static(__dirname + '/'));
app.set('view engine', 'pug');
var img_folder = 'uploaded_images';


/*==================================================
 * GET INDEX.html
 * show: Upload Image form
 *
 * menggunakan method GET untuk menuju halaman Utama -> Index.html
 */
app.get('/', function (req, res){
  res.render('index')
})

/*==================================================
 * POST INDEX.html
 *
 * menggunakan method POST untuk untuk proses upload gambar
 */
app.post('/', function(req, res){
  // set method IncomingForm sebagai variabel FORM
  var form = new formidable.IncomingForm();

  // proses Parsing Request yang merupakan uploaded file data
  form.parse(req);

  // setelah proses Parsing
  // pada event type 'fileBegin' dilakukan pemindahan file
  // ke folder yang ditentukan
  form.on('fileBegin', function(name,file){
    file.path = __dirname + '/' + img_folder + '/' + file.name;
  })

  // pada event type 'file' dilakukan pengecekan status
  // menggunakan console.log
  form.on('file',function(name, file){
    console.log('Uploaded ' + file.name);
  })

  // render views/index.pug
  res.render('index')
})

/*==================================================
 * GET list.html
 * show: list of picture in thumbnail
 *
 * menggunakan method GET untuk menuju halaman list -> list.html
 */
app.get('/list', function (req, res){
  // deklarasi variabel array kosong
  var arrImgName = [];

  // mulai baca file di folder gambar
  fs.readdir(__dirname + '/' + img_folder, function(err, filenames)
  {
    // lakukan looping untuk tiap file yang dibaca di folder yang dimaksud
    filenames.forEach(function(item, index) {
      // melakukan filter ektensi file hanya untuk gambar
      var ext = item.split(".")[1];
      if(ext== "jpg" || ext== "png" || ext== "gif") {
        // masukkan nama file ke variabel gambar
        arrImgName.push(item)
      }
    });
    // kirim variabel dan render views/list.pug
    res.render('list', { arrImg: arrImgName})
  })

})

/*==================================================
 * Running Application on PORT 8123
 */
app.listen(8123, function() {
	console.log("Running at port 8123")
});
