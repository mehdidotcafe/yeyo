var fs        = require("fs");
var models    = require("./models.js");
var Datastore = require("nedb");
var dbAlbums;
var dbSongs;
var dbArtists;
var dbPlaylists;
var collection;
var path = undefined;

module.exports =
{
  add: function(mmSong, path, onAlbumAdd, onSongAdd)
  {
    var song = models.song(mmSong, path);

    dbSongs.findOne({path: path}, function(err, data)
    {
      if (err) throw err;
      if (!data)
      {
        dbSongs.insert(song, function(err, data)
        {
          var album;

          if (err) throw err;
          album = models.album(mmSong);
          dbAlbums.findOne({album: album.album}, function(err, a)
          {
            if (err) throw err;
            if (!a)
            {
              onAlbumAdd && onAlbumAdd(album);
              dbAlbums.insert(album, function(err, dbAlbum)
              {
                if (err) throw err;

                if (dbAlbum.songs.indexOf(data._id) == -1)
                {
                  dbAlbums.update({_id: dbAlbum._id}, {$push : {songs: data._id}}, function(err, data)
                  {
                    if (err) throw err;
                    onSongAdd && onSongAdd(song);
                  });
                }
              });
            }
            else
            {
              var song = models.song(mmSong, path);

              if (a.songs.indexOf(data._id) == -1)
              {
                dbAlbums.update({_id: a._id}, {$push : {songs: data._id}}, function(err, data)
                {
                  if (err) throw err;
                  onSongAdd && onSongAdd(song);
                });
              }
            }
          });
        });
      }
    });
  },

  read: function(directSend, cbAlbums, cbSongs)
  {
    if (!dbSongs)
      dbSongs = new Datastore({filename: "./config/storage-songs", autoload: true});
    if (!dbAlbums)
      dbAlbums = new Datastore({filename: "./config/storage-albums", autoload: true});
    if (directSend)
    {
      dbAlbums.find({}, function(err, a)
      {
        if (err) throw err;
        cbAlbums && cbAlbums(a);
        dbSongs.find({}, function(err, s)
        {
          if (err) throw err;
          cbSongs && cbSongs(s);
        });
      });
    }
  },

  update: function(type, model)
  {
    if (type == 'album')
    {
      dbAlbums.update({_id: model.id}, {$set: model}, function(err, res)
      {
        if (err) throw err;
      });
    }
  }
}
