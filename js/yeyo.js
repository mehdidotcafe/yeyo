var remote = require("remote");
var dialog = remote.require("dialog");
var ipc = require("ipc");
var uiRender = new uiRender();
var am = new audioManager();
var albums = [];

am.setOnSeek(uiRender.renderSeek);
am.setOnVolume(uiRender.renderVolume);
am.setOnPlay(uiRender.renderOnPlay);

document.getElementById("filter-container").addEventListener('keyup', function(e)
{
  filterDom(e.srcElement.value, albums);
});

function filterDom(value)
{
  uiRender.filterDom(value, albums)
}

function exit()
{
  ipc.send("exit");
}

function maximize()
{
  ipc.send("maximize");
}

function reduce()
{
  ipc.send("reduce");
}

function settings()
{
  console.log("je fais des settings");
}

function openFile()
{
  dialog.showOpenDialog({filter: [{name: 'All Files', extensions: ['mp3']}], properties: ["openFile", "multiSelections"]}, function(fileNames)
  {
    if (fileNames)
      ipc.send("addDirectory", fileNames);
  });
}

function playAlbum(e)
{
  am.playAlbum(e, e.srcElement.parentElement.parentElement.album);
  uiRender.togglePlay(am.getCurrentAlbum().container, am.isPlaying());
}

function loveAlbum(e)
{
  var ca = e.srcElement.parentElement.parentElement.album;

  ca.isLoved = !ca.isLoved;
  ipc.send("loveAlbum", {id: ca._id, isLoved: ca.isLoved});
  uiRender.loveAlbum(ca);
}

function playPrev()
{
  am.playPrevMusic();
}

function playNext()
{
  am.playNextMusic();
}

function toggleMusic()
{
  if (!am.isCurrentMusic())
    am.play(null, am.getRandomSong(), 1);
  else if (am.isPlaying())
    am.stop();
  else
    am.continueCurrentMusic();
  uiRender.togglePlay(am.getCurrentAlbum().container, am.isPlaying());
}

function shuffle()
{
  am.shuffle();
  uiRender.shuffle();
}

function repeat()
{
  am.repeat();
  uiRender.repeat();
}

function renderPlaylist(collection)
{
  for (var i = 0; i < collection.playlist.length; i++)
  {
    appendElementToDom("playlist-container", createElement(collection.playlist[i], i));
  }
}

function renderLovedAlbums(collection)
{

}

function appendSongToAlbum(song, elem)
{
  if (!albumsObject[elem]) albumsObject[elem] = [];
    albumsObject[elem].push(song);
}

function playSimpleSong(e)
{
  var song = e.srcElement.parentElement.parentElement.song;

  if (am.isPlaying() && am.getCurrentSong() == song)
    am.stop();
  else if (am.isPaused() && am.getCurrentSong() == song)
    am.continueCurrentMusic();
  else
  {
    if (am.isPlaying())
      am.stop();
    am.playNewMusic(song, null, true);
  }
  uiRender.toggleSimpleSong(false, song, e.srcElement, am.isPlaying());
}

function loveSimpleSong(e)
{
  var song = e.srcElement.parentElement.parentElement.song;
}

function renderAlbum(album)
{
  uiRender.renderAlbum(album, playAlbum, loveAlbum, playSimpleSong, loveSimpleSong, uiRender.showAlbum);
}

ipc.on("getAlbums", function(nAlbums)
{
  for (var i = 0; i < nAlbums.length; i++)
  {
    nAlbums[i].songsArray = [];
    albums.push(nAlbums[i]);
    renderAlbum(nAlbums[i]);
  }
  am.setAlbums(albums);
});

ipc.on("getSongs", function(songs)
{
  var isPushed;
  var idxToRm;

  while (songs.length > 0)
  {
    isPushed = false;
    for (var j = 0; j < albums.length && isPushed == false; j++)
    {
      if ((idxToRm = albums[j].songs.indexOf(songs[0]._id)) != -1)
      {
        delete albums[j].songs[idxToRm];
        albums[j].songsArray.push(songs[0]);
        songs[0].album = albums[j];
        isPushed = true;
      }
    }
    songs.shift();
  }
});
