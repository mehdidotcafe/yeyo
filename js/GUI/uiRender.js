function uiRender()
{
  var songTable = document.getElementById("song-table");
  var currentSongGui = document.getElementById("current-song-container");
  var seekUnderGui = document.getElementById("seek-under-gui");
  var volumeUnderValue = document.getElementById("volume-under-value");
  var volumeUnderGui = document.getElementById("volume-under-gui");
  var playButton = document.getElementById("play-button");
  var stopButton = document.getElementById("stop-button");
  var shuffleButton = document.getElementById("shuffle-button");
  var repeatButton = document.getElementById("repeat-button");
  var currentSongButton;
  var currentAlbumPlayButton;

  this.cleanFilter = function(albums)
  {
    document.getElementById("filter-container").value = "";
    this.filterDom("", albums);
  }

  function showElement(list)
  {
    if (list.contains("filter-hidden"))
      list.remove("filter-hidden");
    if (!list.contains("filter-visible"))
      list.add("filter-visible");
  }

  function hideElement(list)
  {
    if (list.contains("filter-visible"))
      list.remove("filter-visible");
    if (!list.contains("filter-hidden"))
      list.add("filter-hidden");
  }

  this.filterDom = function(value, albums)
  {
    value = value.toLowerCase();
    if (value.startsWith("::"))
    {
      if (value === "::love")
      {
        albums.forEach(function(album)
        {
          if (album.isLoved) return (showElement(album.container.classList));
          return (hideElement(album.container.classList));
        });
      }
      else return (hideElement(album.container.classList));
    }
    else
    {
      albums.forEach(function(album)
      {
        if (album.album.toLowerCase().indexOf(value) != -1) return (showElement(album.container.classList));
        if (album.artist.join(" ").toLowerCase().indexOf(value) != -1) return (showElement(album.container.classList));
        if (album.year.toString().toLowerCase().indexOf(value) != -1) return (showElement(album.container.classList));
        for (var i = 0; i < album.songsArray.length; i++)
        {
          if (album.songsArray[i].title.toLowerCase().indexOf(value) != -1)
            return (showElement(album.container.classList));
        }
        return (hideElement(album.container.classList));
      });
    }
  }

  this.shuffle = function()
  {
    shuffleButton.classList.toggle("checked");
  }

  this.repeat = function()
  {
    repeatButton.classList.toggle("checked");
  }

  this.toggleSimpleSong = function(isOldElementInDom, song, button, isPlaying)
  {
    if (isOldElementInDom && currentSongButton)
      currentSongButton.src = "../resources/images/music-control-ui/play.svg";
    currentSongButton = button;
    if (isPlaying)
      button.setAttribute("src", "../resources/images/music-control-ui/pause.svg");
    else
      button.setAttribute("src", "../resources/images/music-control-ui/play.svg");
  }

  this.showAlbum = function(e, onplaysong, onlovesong)
  {
    var album = e.srcElement.parentElement.parentElement.album;
    var loveElem;
    var playElem;
    var tr;
    var nametd;
    var lovedtd;
    var lengthtd;
    var playTr;

    songTable.innerHTML = '';
    if (!album || !album.songsArray)
      return ;
    for (var i = 0; i < album.songsArray.length; i++)
    {
      tr = document.createElement("tr");
      numbertd = document.createElement("td");
      nametd = document.createElement("td");
      lovedtd = document.createElement("td");
      lengthtd = document.createElement("td");
      playtd = document.createElement("td");

      numbertd.insertAdjacentHTML("afterBegin", album.songsArray[i].track);

      loveElem = document.createElement("img");
      if (!album.songsArray[i].isLoved)
        loveElem.src = "../resources/images/nolove.svg";
      else
        loveElem.src = "../resources/images/love.svg";
      loveElem.classList.add("tr-love")
      lovedtd.appendChild(loveElem);
      lovedtd.onclick = onlovesong;

      playElem = document.createElement("img");
      playElem.src = "../resources/images/music-control-ui/play.svg";
      playtd.appendChild(playElem);
      playElem.classList.add("tr-love");
      playElem.onclick = onplaysong;

      nametd.insertAdjacentHTML("afterBegin", album.songsArray[i].title);
      lengthtd.insertAdjacentHTML("afterBegin", album.songsArray[i].duration);

      tr.appendChild(numbertd);
      tr.appendChild(lovedtd);
      tr.appendChild(playtd);
      tr.appendChild(nametd);
      tr.appendChild(lengthtd);
      songTable.appendChild(tr);
      album.songsArray[i].container = tr;
      tr.song = album.songsArray[i];
    }
  }

  this.loveAlbum = function(album)
  {
    if (album.isLoved)
      album.container.childNodes[0].childNodes[1].src = "../resources/images/love.svg";
    else
      album.container.childNodes[0].childNodes[1].src = "../resources/images/nolove.svg";
  }

  this.togglePlay =  function(element, isPlaying)
  {
    element = element.childNodes[0].childNodes[2];
    if (isPlaying)
    {
      stopButton.style.display = "inline";
      playButton.style.display = "none";
      element.setAttribute("src", "../resources/images/music-control-ui/pause.svg");
    }
    else
    {
      stopButton.style.display = "none";
      playButton.style.display = "inline";
      element.setAttribute("src", "../resources/images/music-control-ui/play.svg");
    }
  }

  this.renderOnPlay = function(e, song, isPlaying)
  {
    var blob;
    var reader;

    if (currentAlbumPlayButton)
      currentAlbumPlayButton.setAttribute("src", "../resources/images/music-control-ui/play.svg");
    currentAlbumPlayButton = song.album.container.childNodes[0].childNodes[2];
    if (song.album.picture)
    {
      blob = new Blob([song.album.picture]);
      reader = new FileReader();
      reader.onload = function(event)
      {
        currentSongGui.childNodes[1].setAttribute("src", 'data:image/png;base64,'+ event.target.result || "../resources/images/default-pictures/logo.png");
      };
      reader.readAsBinaryString(blob);
    }
    else
      currentSongGui.childNodes[1].setAttribute("src", "../resources/images/default-pictures/logo.png")
    currentSongGui.childNodes[3].childNodes[1].textContent = song.title;
    currentSongGui.childNodes[3].childNodes[3].textContent = song.artist.join(" ");
    currentSongGui.childNodes[3].childNodes[5].textContent = song.album.album;
    document.getElementById("title").textContent = "yeyo | " + song.title;
    if (isPlaying)
    {
      stopButton.style.display = "inline";
      playButton.style.display = "none";
      song.album.container.childNodes[0].childNodes[2].src = "../resources/images/music-control-ui/pause.svg";
    }
    else
    {
      stopButton.style.display = "none";
      playButton.style.display = "inline";
      song.album.container.childNodes[0].childNodes[2].src = "../resources/images/music-control-ui/play.svg";
    }
  }

  this.renderSeek = function(now, length)
  {
    if (now == 0)
      seekUnderGui.style.width = "0%";
    else
      seekUnderGui.style.width = now * 100 / length + "%";
  }

  this.renderVolume = function(volume)
  {
    volumeUnderGui.style.width = volume * 100 + "%";
    volumeUnderValue.textContent = (volume * 100).toFixed(2) + "%";
  }

  function isAppened(album)
  {
    var albums = document.getElementById("album-container").getElementsByClassName("album-info-container");

    for (var i = 0; i < albums.length ; i++)
    {
      if (albums[i].getElementsByClassName("album-name")[0].textContent == album)
        return (albums[i]);
    }
    return (false);
  }

  function createElement(element, onplay, onlove, onplaysong, onlovesong, onclick)
  {
    var container = document.createElement("div");
    var preview = document.createElement("div");
    var img = document.createElement("img");
    var loveButton = document.createElement("img");
    var playButton = document.createElement("img");
    var albumArtist = document.createElement("div");
    var albumName = document.createElement("div");

    loveButton.classList.add("shrt");
    loveButton.classList.add("love");
    loveButton.setAttribute("src", element.isLoved ? "../resources/images/love.svg": "../resources/images/nolove.svg");
    loveButton.onclick = onlove;

    playButton.classList.add("shrt");
    playButton.classList.add("play");
    playButton.setAttribute("src", "../resources/images/music-control-ui/play.svg");
    playButton.onclick = onplay;

    img.classList.add("preview-img");
    if (element.picture)
    {
      var blob = new Blob([element.picture]);
      var reader = new FileReader();

      reader.onload = function(e)
      {
        img.setAttribute("src", 'data:image/png;base64,'+ e.target.result || "../resources/images/default-pictures/logo.png");
      };
      reader.readAsBinaryString(blob);
    }
    else
      img.setAttribute("src", "../resources/images/default-pictures/logo.png")
    preview.classList.add("preview");
    preview.appendChild(img);
    preview.appendChild(loveButton);
    preview.appendChild(playButton);

    albumArtist.classList.add("album-artist");
    albumArtist.classList.add("album-info");
    albumArtist.classList.add("album-name");
    albumArtist.insertAdjacentHTML("afterBegin", element.album || "Playlist");

    albumName.classList.add("album-artist");
    albumName.classList.add("album-info");
    albumName.classList.add("album-artist-name");
    albumName.insertAdjacentHTML("afterBegin", element.artist[0] || "");

    container.classList.add("album-info-container");
    container.classList.add("filter-visible");
    container.appendChild(preview);
    container.appendChild(albumArtist);
    container.appendChild(albumName);
    container.onclick = function(e)
    {
      var onplaysongT = onplaysong;
      var onlovesongT = onlovesong;

      onclick(e, onplaysongT, onlovesong);
    };
    container.album = element;
    element.container = container;

    return (container);
  }

  function appendElementToDom(id, container)
  {
    document.getElementById(id).appendChild(container);
    return (container);
  }

  this.renderAlbum = function(album, onplay, onlove, onplaysong, onlovesong, onclick)
  {
    appendElementToDom("album-container", createElement(album, onplay, onlove, onplaysong, onlovesong, onclick));
  }
}
