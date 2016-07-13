function audioManager()
{
  var self = this;
  var history = [];
  var idx = 0;
  var interval;
  var volume = 1;
  var albums = [];

  // 0 pour rien
  // 1 pour album
  // 2 pour playlist
  var currentType = 0;
  var currentAlbum;
  var currentAudio;
  var currentSong;

  var isPlayingAudio = false;
  var isPaused = false;

  var onSeek;
  var onVolume;
  var onPlay;

  var isShuffle = false;
  var isRepeat = false;

  this.setOnVolume = function(nOnVolume)
  {
    onVolume = nOnVolume;
    onVolume(volume);
  }

  this.setOnSeek = function(nOnSeek)
  {
    onSeek = nOnSeek;
  }

  this.setOnPlay = function(nOnPlay)
  {
    onPlay = nOnPlay;
  }

  this.setAlbums = function(nAlbums)
  {
    albums = nAlbums;
  }

  this.shuffle = function()
  {
    console.log("Je Shuffle");
    isShuffle = !isShuffle;
  }

  this.repeat = function()
  {
    console.log("Je repeat");
    isRepeat = !isRepeat;
  }

  this.getCurrentAlbum = function()
  {
    return (currentSong.album);
  }

  this.getCurrentSong = function()
  {
    return (currentSong);
  }

  this.isPlaying = function()
  {
    return (isPlayingAudio);
  }

  this.isCurrentMusic = function()
  {
    return (currentAudio);
  }

  this.getRandomSong = function()
  {
    var randomAlbum = albums[parseInt(Math.random() * 100000) % albums.length];

    return (randomAlbum.songsArray[parseInt(Math.random() * 100000) % randomAlbum.songsArray.length]);
  }

  this.playNextMusic = function()
  {
    if (currentAudio)
      this.pauseCurrentSong();
    if (history[++idx] && !isShuffle)
      this.changeCurrentMusic(history[idx], 0);
    else
      this.changeCurrentMusic(this.getRandomSong(), 1);
  }

  this.playPrevMusic = function()
  {
    if (currentAudio)
      this.pauseCurrentSong();
    if (idx > 0)
      this.changeCurrentMusic(history[--idx], 0);
    else
      this.changeCurrentMusic(this.getRandomSong(), 2);
  }

  /*
   * In history :
   * 0 -> Not in
   * 1 -> last
   * 2 -> first
   */

  this.addInHistory = function(song, pos)
  {
    if (pos == 0) return ;

    function historyPush(s)
    {
      history.push(s);
      if (history.length > 50)
      {
        --idx;
        history.shift();
      }
    }

    function historyUnshift(s)
    {
      if (history.length > 49)
      {
        --idx;
        history.shift();
      }
      history.unshift(s);
    }

    if (Array.isArray(song))
    {
      for (var i = 0; i < song.length; i++)
      {
        if (pos == 1)
          historyPush(song[i]);
        else
          historyUnshift(song[i]);
      }
    }
    else
    {
      if (pos == 1)
        historyPush(song);
      else
        historyUnshift(song);
    }
  }

  this.changeCurrentMusic = function(song, inHistory)
  {
    if (isPlayingAudio)
      this.playNewMusic(song, null, inHistory);
    else
    {
      try
      {
        currentAudio = new Audio(song.path);
        currentSong = song;
        currentAudio.volume = volume;
      }
      catch (err)
      {
        throw err;
      }
      onSeek && onSeek(0);
      // clearInterval(interval);
      onPlay && onPlay(null, song, isPlayingAudio);
    }
  }

  this.playNewMusic = function(song, e, inHistory)
  {
    try
    {
      currentAudio = new Audio(song.path);
      currentSong = song;
      currentAudio.volume = volume;
      currentAudio.play();
    }
    catch (err)
    {
      throw err;
    }
    onSeek && onSeek(0);
    isPlayingAudio = true;
    this.addInHistory(song, inHistory);
    onPlay && onPlay(e, song, isPlayingAudio);
    interval = setInterval(function()
    {
      onSeek && onSeek(currentAudio.currentTime, currentAudio.duration);
      if (currentAudio.currentTime == currentAudio.duration)
        self.playNextMusic();
    }, 200);
  }

  this.stop = function(song)
  {
    isPlayingAudio = false;
    clearInterval(interval);
    if (currentAudio)
    {
      currentAudio.pause();
      isPaused = true;
    }
  }

  this.continueCurrentMusic = function()
  {
    isPaused = false;
    isPlayingAudio = true;
    if (currentAudio)
      currentAudio.play();
  }

  this.pauseCurrentSong = function()
  {
    currentAudio.pause();
  }

  this.isPaused = function()
  {
    return (isPaused);
  }

  this.play = function(e, song, inHistory)
  {
    isPaused = false;
    if (currentSong && song.path != currentSong.path)
    {
      this.pauseCurrentSong();
      this.playNewMusic(song, e, inHistory);
    }
    else
    {
      if (!isPlayingAudio && !currentAudio)
        this.playNewMusic(song, e, inHistory);
      else if (!isPlayingAudio)
        this.continueCurrentMusic();
      else
      {
        isPaused = true;
        this.stop();
      }
    }
  }

  this.playAlbum = function(e, album)
  {
    currentAlbum = album;
    this.addInHistory(album.songsArray);
    this.play(e, album.songsArray[0], false);
  }

  this.setVolume = function(event)
  {
    volume = event.offsetX * 100 / 210 / 100;
    if (currentAudio)
      currentAudio.volume = volume;
    onVolume(volume);
  }

  this.setSeek = function(event)
  {
    if (currentAudio)
    {
      seek = (event.offsetX * 100 / 210) * currentAudio.duration / 100;
      currentAudio.currentTime = seek;
      onSeek(seek, currentAudio.duration);
    }
  }
}
