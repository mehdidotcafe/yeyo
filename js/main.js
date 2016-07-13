var app = require("app");
var fs = require("fs");
var BrowerWindow = require("browser-window");
var ipc = require("ipc");
var yeyoData;
var mainWindow = null;

require("crash-reporter").start();

ipc.on("addDirectory", function(event, dirs)
{
  console.log(dirs);
});

ipc.on("exit", function()
{
  mainWindow = null;
  app.quit();
})

app.on("window-all-closed", function()
{
  if (process.platform != "darwin")
    app.quit();
});

function parseConfigFile(err, data)
{
  if (err)
    console.log(err);
  else
    console.log(data);
}

function parseFile(err, data)
{
  if (err)
    console.log(err);
  else
    yeyoData = JSON.parse(data);
}

app.on("ready", function()
{
  mainWindow = new BrowerWindow({width: 1600, height: 900, frame: false});
  mainWindow.loadUrl("file://" + __dirname + "/views/view.html");
  // mainWindow.openDevTools();
  mainWindow.on("closed", function()
  {
    mainWindow = null;
  });
  fs.readFile("./config/conf.json", "utf-8", parseFile);
});
