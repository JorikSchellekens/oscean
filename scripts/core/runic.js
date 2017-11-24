function Runic(raw)
{
  this.raw = raw;

  this.runes = {
    "&":{tag:"p"},
    "-":{tag:"list",stash:true},
    "#":{tag:"code",stash:true},
    "?":{tag:"note"},
    ":":{tag:"info"},
    "*":{tag:"h2"},
    "=":{tag:"h3"},
    "+":{tag:"hs"},
    "|":{tag:"tr",sub:"td",rep:true},
    "»":{tag:"tr",sub:"th",rep:true},
    ">":{tag:""}
  }    

  this.format = function(r,html)
  {
    if(!this.runes[r]){ return "Unknown rune:("+r+")"; }
    var rune = this.runes[r];
    var result = "<"+rune.tag+">"+html+"</"+rune.tag+">";
    return result
  }

  this.markup = function(html)
  {
    html = html.replace(/{_/g,"<i>").replace(/_}/g,"</i>")
    html = html.replace(/{\*/g,"<b>").replace(/\*}/g,"</b>")

    var parts = html.split("{{")
    for(id in parts){
      var part = parts[id].split("}}")[0];
      var target = part.indexOf("|") > -1 ? part.split("|")[1] : "/"+part;
      var name = part.indexOf("|") > -1 ? part.split("|")[0] : part;
      html = html.replace("{{"+part+"}}","<a href='"+target+"'>"+name+"</a>")
    }

    return html;
  }

  this.parse = function(raw = this.raw)
  {
    var html = "";
    var lines = raw;
    if(!raw){ return "";}
    var lines = !Array.isArray(raw) ? raw.split("\n") : raw;

    for(id in lines){
      var rune = lines[id].substr(0,1);
      var trail = lines[id].substr(1,1);
      var line = this.markup(lines[id].substr(2));
      if(!line || line.trim() == ""){ continue; }
      if(trail != " "){ console.warn("Runic","Non-rune["+trail+"] at:"+id+"("+line+")"); continue; }
      html += this.format(rune,line);
    }
    return html;
  }

  this.html = this.parse(raw);
}

invoke.seal("core","runic");