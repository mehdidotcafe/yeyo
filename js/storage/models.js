module.exports =
{
  song: function(song, path)
  {
    var newSong = {
      "title": song.title,
      "artist": song.artist,
      "album": song.album,
      "year": song.year,
      "track": song.track.no,
      "genre": song.genre,
      "duration": song.duration,
      "path": path,
      "isLoved": false
    };
    return (newSong);
  },

  album: function(song)
  {
    var album = {
      "artist": song.albumartist,
      "album": song.album,
      "year": song.year,
      "songs": [],
      "isLoved": false
    };
    if (song.picture[0] && song.picture[0].data)
      album.picture = song.picture[0].data.toString('base64');
    else
      album.picture = "";
    return (album);
  }
}
