
function filter(what) {
  var filters = ['freetext', 'author', 'keyword', 'year'];
  /* get filters which are set */
  var active_filters = {};
  for (var i=0,filter; filter = filters[i]; i++) {
    var val = document.getElementById(filter).value;
    if (val.length > 1) {
      active_filters[filter] = val.toLowerCase();
    }
  }
  if (Object.keys(active_filters).length == 0) {
    BIB['ACTIVE'] = [];
    showentries();
    return;
  }
  console.log(active_filters)
  var keys = BIB['keys'];
  var actives = [];
  for (var i=0,key; key=keys[i]; i++) {
    var check = true;
    for (filter in active_filters) {
      if (filter in BIB[key] && typeof BIB[key][filter] == 'string'){
        if (BIB[key][filter].toLowerCase().indexOf(active_filters[filter]) == -1) {
          check = false;
          break;
        }
      }
      else if (filter == 'keyword') {
        var tmp_check = false;
        for (var k=0,keyword; keyword=BIB[key]['keyword'][k]; k++) {
          if (keyword.toLowerCase().indexOf(active_filters['keyword']) != -1) {
            tmp_check = true;
            break;
          }
        }
        if (!tmp_check) {
          check = false;
          break;
        }
      }
    }
    if (check) {
      actives.push(key);
    }
  }
  actives.sort(function (x, y) {
    if (BIB[x]['author'] < BIB[y]['author']) {return -1};
    if (BIB[x]['author'] > BIB[y]['author']) {return 1};
    return 0;});
  BIB['ACTIVE'] = actives;
  showentries();
}

function fakeAlert(text){
  var falert = document.createElement('div');
  falert.id = 'fake';
  var text = '<div class="message"><p>' + text + '</p>';
  text += '<span class="btn btn-primary" onclick="' + "$('#fake').remove();" + '")> OK </span></div>';
  falert.className = 'fake_alert';

  document.body.appendChild(falert);
  falert.innerHTML = text;
  document.onkeydown = function(event){$('#fake').remove();};
}

function showBibTex(key){
  fakeAlert('<code style="text-align:justify">'+BIB[key]['bibtex']+'</code>');
}

function showCategories(key){
  var kats = KAT[key].split('; ');
  var text = '<ul><li>'+kats[0]+'</li>';
  var stack = '</ul>';
  var level = 1;
  for (var i=1,kat; kat=kats[i]; i++) {
    var splits = kat.split('\u00a0');
    if (splits[0].split('.').length == 1) {
      text += stack;
      stack = '</ul>';
    }
    if (level != splits[0].split('.').length) {
      text += '<ul>';
      stack += '</ul>';
    }
    text += '<li>'+splits[0] + ': ' + splits[1]+'</li>';
    stack += '</ul>';
    level = splits[0].split('.').length;
  }
  fakeAlert('<div style="text-align:justify"><h4>Kategorien</h4>'+text+stack+'</div>');
}

function showentries() {
  var out = '';
  if (BIB['ACTIVE'].length > 0) {
    var num = BIB['ACTIVE'].length;
    out += '<p style="color:DarkBlue">'+ num +' Einträge gefunden</p>';
  }
  else {
    out += '<p>Keine Einträge gefunden.</p>';
  }
  for (var i=0,entry; entry=BIB['ACTIVE'][i]; i++) {
    if (entry != 'ACTIVE') {
      out += '<li class="paper bibentry">'+BIB[entry]['html'];
      out += '<p class="resources" style="display:flex;justify-content:space-between;" >';
      out += '<span class="keywords">';
      for (var k=0,keyword; keyword=BIB[entry]['keyword'][k]; k++) {
        if (k < 4) {
          out += ' <a class="resource keyword">'+keyword+'</a>';
        }
      }
      out +='</span>';
      out += '<span class="tags">';
      out += '<a class="bibid resource">ID: '+entry+'</a> ' + 
        '<a class="bibtex resource" onclick="showBibTex(\''+entry+'\')">BIBTEX</a> ' +
        '<a class="category resource" onclick="showCategories(\''+entry+'\')">KATEGORIEN</a> ';
      if ('doi' in BIB[entry]['data']) {
        out += '<a target="_blank" href="http://dx.doi.org/'+BIB[entry]['data']['doi']+'" class="doi resource">DOI</a>';
      }
      out += '</span></li>';
    }
  }
  document.getElementById('bibliography').innerHTML = out;
}


