
function filter(what, value) {
  var actives = [];
  for (key in BIB) {
    if (BIB[key][what].indexOf(value.toLowerCase()) != -1) {
      actives.push(key);
    }
  }
  BIB['ACTIVE'][what] = actives;
  showentries();
}

function showentries() {
  var out = '';
  for (var i=0,entry; entry=BIB['ACTIVE']['freetext'][i]; i++) {
    out += '<p>'+BIB[entry]['html']+'</p>';
  }
  document.getElementById('bibliography').innerHTML = out;
}


