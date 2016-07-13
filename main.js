var app = require('app');
var fs = require('fs');
var BrowerWindow = require('browser-window');
var ipc = require('ipc');
var collection = require('./js/storage/collection.js');
var models = require('./js/storage/models.js');
var mm = require('musicmetadata');
// var mount = require('./mount/mount.cc');
var stackFile = [];
var window = null;

require('crash-reporter').start();

function onSongAdd(song)
{
  // console.log("Je balance un song");
  window.webContents.send("getSongs", song);
}

function onAlbumAdd(album)
{
  console.log(album.songs);
  window.webContents.send("getAlbums", [album]);
}

function getMetadata(file, isLast)
{
  mm(fs.createReadStream(file), function(err, data)
  {
    if (err) throw err;
    else
      collection.add(data, file, onAlbumAdd, onSongAdd);
  });
}

ipc.on("addDirectory", function(event, files)
{
  var i;
  var ffiles = [];

  for (i = 0; i < files.length; ++i)
  {
    if (files[i].endsWith(".mp3") || files[i].endsWith(".m4a") || files[i].endsWith(".ogg"))
      ffiles.push(files[i]);
  }
  for (i = 0; i < ffiles.length; ++i)
    getMetadata(ffiles[i], i == ffiles.length - 1);
});

ipc.on("exit", function()
{
  window = null;
  app.quit();
});

ipc.on("maximize", function()
{
  if (window.isMaximized())
    window.unmaximize();
  else
    window.maximize();
});

ipc.on("reduce", function()
{
  if (!window.isMinimized())
    window.minimize();
  else
    window.restore();
});

ipc.on("loveAlbum", function(e, toChange)
{
  collection.update('album', toChange)
});

app.on("window-all-closed", function()
{
  if (process.platform != "darwin")
    app.quit();
});

app.on("ready", function()
{
  window = new BrowerWindow({width: 1600, height: 900, frame: false});
  window.loadUrl("file://" + __dirname + "/views/view.html");
  window.on("closed", function()
  {
    window = null;
  });
  collection.read(true, function(albums)
  {
    window.webContents.send("getAlbums", albums);
  }, function(songs)
  {
    window.webContents.send("getSongs", songs);
  });
});
