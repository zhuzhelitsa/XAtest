/*
Reset = "\x1b[0m"
Bright = "\x1b[1m"
Dim = "\x1b[2m"
Underscore = "\x1b[4m"
Blink = "\x1b[5m"
Reverse = "\x1b[7m"
Hidden = "\x1b[8m"

FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"

BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"
*/

const colours = {
  "Reset": "\x1b[0m",
  "Bright": "\x1b[1m",
  "Fg": {
    "Black": "\x1b[30m",
    "Red": "\x1b[31m",
    "Green": "\x1b[32m",
    "Yellow": "\x1b[33m",
    "Blue": "\x1b[34m",
    "Magenta": "\x1b[35m",
    "Cyan": "\x1b[36m",
    "White": "\x1b[37m"
  },
  "Bg": {
    "Black": "\x1b[40m",
    "Red": "\x1b[41m",
    "Green": "\x1b[42m",
    "Yellow": "\x1b[43m",
    "Blue": "\x1b[44m",
    "Magenta": "\x1b[45m",
    "Cyan": "\x1b[46m",
    "White": "\x1b[47m"
  }
};

function colour_switcher(args,type_c=null){
  let ans=[]
  switch(type_c) {
    case null:
      ans=[colours.Fg["Cyan"], colours.Fg["Cyan"]];
      break;
    case 0:
      ans=[colours["Bright"]+colours.Fg["Cyan"], colours["Bright"]+colours.Fg["Cyan"]];
      break;
    case 1:
      ans=[colours.Fg["Green"], colours["Bright"]+colours.Fg["Green"]];
      break;
    case 2:
      ans=[colours.Fg["Yellow"], colours["Bright"]+colours.Fg["Yellow"]];
      break;
    case 3:
      ans=[colours["Bright"]+colours.Fg["Blue"], colours.Fg["Blue"]];
      break;
    case 4:
      ans=[colours["Bright"]+colours.Fg["Blue"], colours.Fg["Red"]];
      break;
    };
    if (args.length!=2){
      data=""
      for (alt of args){
        data+=ans[0]+alt;
      };
      return data;
    }
    else {
      return ans[0]+args[0]+colours["Reset"]+ans[1]+args[1]+colours["Reset"];
    };
};

function test(){
  console.log(colour_switcher(["Message:", "data"]));
  for (let i=0;i<5;i++){
    console.log(colour_switcher(["Message:", "data"],i));
  };
};

function msg(data,type_c){console.log(colour_switcher(data,type_c))};

//test();

module.exports = { colours, colour_switcher, msg };


