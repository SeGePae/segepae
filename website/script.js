/* stores the keywords */
var ENTRIES = {};

function filter(what) {
  var filters = ['freetext', 'author', 'keyword', 'year'];
  /* get filters which are set */
  var active_filters = {};
  for (var i=0,filter; filter = filters[i]; i++) {
    var val = document.getElementById(filter).value;
    if (val.length > 1) {
      active_filters[filter] = val;
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
        if (BIB[key][filter].toLowerCase().indexOf(active_filters[filter].toLowerCase()) == -1) {
          check = false;
          break;
        }
      }
      else if (filter == 'keyword') {
        ENTRIES[key] = [];
        var tmp_check = false;
        var keywords = active_filters['keyword'].split(',');
        keywords = keywords.slice(0, keywords.length-1);
        var bibkeywords = [];
        for (var k=0,keyword; keyword=BIB[key]['keyword'][k]; k++) {
          bibkeywords.push(keyword.toLowerCase());
        }
        for (var k=0,keyword; keyword=keywords[k]; k++) {
          var tmp_check = false;
          if (bibkeywords.indexOf(keyword.toLowerCase().trim()) != -1) {
            tmp_check = true;
            ENTRIES[key].push(keyword);
          }
          else {
            tmp_check = false;
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

function showCat(category) {
  BIB['ACTIVE'] = KAT[category];
  showentries();

}

function fakeAlert(text){
  var falert = document.createElement('div');
  falert.id = 'fake';
  var out = '<div class="message">';
  out += '<button type="button" onclick="$(\'#fake\').remove();" class="pull-right btn btn-primary close" style="margin-left:5px;opacity:0.75;"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
  out += '<p>' + text + '</p>';
  out += '<span class="btn btn-primary" onclick="' + "$('#fake').remove();" + '")> OK </span></div>';
  falert.className = 'fake_alert';

  document.body.appendChild(falert);
  falert.innerHTML = out;
  document.onkeydown = function(event){$('#fake').remove();};
}

function showBibTex(key){
  fakeAlert('<div style="text-align:justify;"><h4>BibTex Entry</h4><pre>'+BIB[key]['bibtex']+'</pre></div>');
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

function showAbstract(key){
  var text = BIB[key]['abstract'];
  fakeAlert('<div style="text-align:justify"><h4>Abstract</h4>'+text+'</div>');
}
function showKeywords(key){
  if (key in COOC) {
    var neighbors = Object.keys(COOC[key]);
  }
  else {
    var neighbors = [];
  }
  var text = '<ul>';
  var freq = KW[key];
  var english = TRAN[key];
  neighbors.sort(function(x,y) {
    if(COOC[key][x].length < COOC[key][y].length){return 1;}
    else if(COOC[key][x].length > COOC[key][y].length){return -1;}
    else {return 0;}
  });
  for (var i=0,neighbor; neighbor=neighbors[i]; i++) {
    if (neighbor in TRAN) {
      var english = ' (<em>'+TRAN[neighbor]+'</em>, ';
    }
    else {
      var english = ' (';
    }
    if (COOC[key][neighbor].length == 1) {
      var kook = ' Kookkurrenz';
    }
    else {
      var kook = ' Kookkurrenzen';
    }
    text += '<li>'+neighbor+english+COOC[key][neighbor].length+kook+')</li>';
    if (i > 9) {
      break;
    }
  }
  text += '</ul>';
  fakeAlert('<div style="text-align:justify"><h4>Häufig mit «'+key+'» zusammen verwendete Schlagwörter:</h4>'+text+'</div>');
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
      var kw = 0;
      var visited = [];
      if (entry in ENTRIES) {
        for (var k=0,keyword; keyword=ENTRIES[entry][k]; k++){
          out += ' <a class="resource keyword" onclick="showKeywords(\''+keyword+'\');">'+keyword+'</a>';
          kw += 1;
          visited.push(keyword);
        }
      }
      for (var k=0,keyword; keyword=BIB[entry]['keyword'][k]; k++) {
        if (k+kw < 6 && visited.indexOf(keyword) == -1) {
          out += ' <a class="resource keyword" onclick="showKeywords(\''+keyword+'\');">'+keyword+'</a>';
        }
      }
      out +='</span>';
      out += '<span class="tags">';
      var abs = '';
      if (typeof BIB[entry]['abstract'] != 'undefined') {
        abs = '<a class="abstract resource" onclick="showAbstract(\''+entry+'\');">ABSTRACT</a> ';
      }

      out += '<a class="bibid resource">ID: '+entry+'</a> ' + abs + 
        '<a class="bibtex resource" onclick="showBibTex(\''+entry+'\')">BIBTEX</a> ' +
        '<a class="category resource" onclick="showCategories(\''+entry+'\')">KATEGORIEN</a> ';
      if ('isbn' in BIB[entry]['data']) {
        out += '<a target="_blank" href="https://www.worldcat.org/search?q=bn%3A'+BIB[entry]['data']['isbn']+'" class="doi resource">ISBN</a>';

      }
      if ('doi' in BIB[entry]['data']) {
        out += '<a target="_blank" href="http://dx.doi.org/'+BIB[entry]['data']['doi']+'" class="doi resource">DOI</a>';
      }
      out += '</span></li>';
    }
  }
  document.getElementById('bibliography').innerHTML = out;
}


$( function() {
  var availableTags = Object.keys(KW);
  function split( val ) {
    return val.split( /,\s*/ );
  }
  function extractLast( term ) {
    return split( term ).pop();
  }

  $( "#keyword" )
    // don't navigate away from the field on tab when selecting an item
    .on( "keydown", function( event ) {
      if ( event.keyCode === $.ui.keyCode.TAB &&
          $( this ).autocomplete( "instance" ).menu.active ) {
        event.preventDefault();
      }
    })
    .autocomplete({
      minLength: 0,
      source: function( request, response ) {
        // delegate back to autocomplete, but extract the last term
        response( $.ui.autocomplete.filter(
          availableTags, extractLast( request.term ) ) );
      },
      focus: function() {
        // prevent value inserted on focus
        return false;
      },
      select: function( event, ui ) {
        var terms = split( this.value );
        // remove the current input
        terms.pop();
        // add the selected item
        terms.push( ui.item.value );
        // add placeholder to get the comma-and-space at the end
        terms.push( "" );
        this.value = terms.join( ", " );
        filter('keyword');
        return false;
      }
    });
} );

var url = window.location.href;
if (url.indexOf('?') != -1) {
  var params = url.split('?')[1];
  if (params == 'headless'){
    $('h1.main').toggle();
    document.getElementById('content').style.backgroundColor="white";
    $('body')[0].style.backgroundColor="white";
    $('.footer').toggle();
    
  }
}
