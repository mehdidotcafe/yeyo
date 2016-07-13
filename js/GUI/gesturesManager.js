var resizeIt = document.getElementById("resize-it");
var info = document.getElementById("info");
var container = document.getElementById("song-container");
var isInMove = false;

resizeIt.addEventListener('mousedown', function()
{
  isInMove = true;
});

document.addEventListener('mouseup', function()
{
  isInMove = false;
});

document.addEventListener('mousemove', function(e)
{
  if (isInMove)
  {
    if (e.clientY < document.getElementById("toolbar").offsetHeight)
    {
      info.style.top = document.getElementById("toolbar").offsetHeight + "px";
      info.style.height = window.clientY - document.getElementById("toolbar").offsetHeight + "px";
    }
    else
    {
      info.style.top = e.clientY + "px";
      info.style.height = window.clientY - e.clientY + "px";
    }
  }
});
