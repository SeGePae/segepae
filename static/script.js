var myToggles = [];

function toggle(elm) {
  var a = document.getElementById(elm+'-short');
  var b = document.getElementById(elm+'-long');
  console.log(elm, a, b);


  if (a.style.display == 'none') {
    a.style.display = 'block';
    b.style.display = 'none';
  }
  else {
    a.style.display = 'none';
    b.style.display = 'block';
  }
}

function toggleNews(what) {
  var a = document.getElementById('news');
  var b = document.getElementById('archive');
  if (a.style.backgroundColor != 'white' && what == 'news') {
    b.style.backgroundColor = '#2d6ca2';
    a.style.backgroundColor = '#550000';
    b.style.opacity = 0.75;
    a.style.opacity = 1;
    document.getElementById('archive-items').style.display = 'none';
    document.getElementById('news-items').style.display = 'block';
  }
  else if (b.style.backgroundColor != 'white' && what == 'archive') {
    a.style.backgroundColor = '#2d6ca2';
    b.style.backgroundColor = '#550000';
    a.style.opacity = 0.75;
    b.style.opacity = 1;
    document.getElementById('archive-items').style.display = 'block';
    document.getElementById('news-items').style.display = 'none';
  }
}


function toggleMenu()
{
  $('#nav').toggleClass('hide');
  $('#menubutton').toggleClass('pressed');
  $('#menubutton').toggleClass('unpressed');
}

function makeMenu()
{
  $('.mfoc a').click(
    function(e)
      {
	if(e.target.className == 'bighref')
	{
	  e.preventDefault();
	  var t = e.target.href.split('/');
	  var tt = t[t.length-1].replace(/\.php/,'');
	  var tl = document.getElementById(tt);
	  $('#'+tt).toggleClass('hide');
	}
	else if(e.target.className == 'innera')
	{
	  e.preventDefault();
    $('#prestuff').html('<div id="progress">Loading...</div>');
  	$('#prestuff').load(e.target.href + ' #content'
      //function () {$('#progress').remove();}
);
	  $('#introduction a').html(e.target.innerHTML);
	}
      }
  );
}

function showBibTex(event,key) {
  event.preventDefault();

  var check = myToggles.indexOf(key);

  if (check != -1) {
    $('#'+key+'_bibtex').remove();
    delete myToggles[check];
    return;
  }

  var myid = document.getElementById(key);

  var newel = document.createElement('div');
  newel.innerHTML = '<br><iframe id="'+key+'_iframe"'+' width="80%" style="border: 4px solid DarkGreen;border-radius:10px;background-color:lightgray;min-height:200px;" class="bibframe" src="http://bibliography.lingpy.org/raw.php?key='+key+'"' + 
    ' frameborder="false">Your browser doesn\'t support iframes.</iframe>';
  newel.className = 'bibtex_iframe';
  newel.id = key+'_bibtex';
  myid.appendChild(newel);
  myToggles.push(key);
  var ifr = document.getElementById(key+'_iframe');
  setIframeHeight(ifr);
  //console.log(ifr.contentWindowdocument.innerHeight, ifr.document.body.scrollHeight);
}

function setIframeHeight(iframe) {
  if (iframe) {
    var iframeWin = iframe.contentWindow; // || iframe.contentDocument.parentWindow;
    if (iframeWin.document.body) {
      iframe.height = iframeWin.document.documentElement.scrollHeight;// || iframeWin.document.body.scrollHeight;
    }
    console.log(iframe.height);
  }
  else {
    console.logt(iframe);
  }
};


function showKeywords(keyword) {
  
  var papers = document.getElementsByClassName('paper');
  for (var i=0,paper; paper=papers[i]; i++) {
    if (paper.innerHTML.indexOf(keyword) == -1) {
      paper.style.display = "hidden";
    }
    else {
      paper.style.display = "visible";
    }
  }
}


function showKeywords(keyword) {
  
  var papers = document.getElementsByClassName('paper');
  if (keyword.style.backgroundColor == "LightBlue") {
    keyword.style.backgroundColor = "white";
    for (var i=0,paper; paper=papers[i]; i++) {
      paper.style.display = "block";
    }
  }
  else {
    keyword.style.backgroundColor = "LightBlue";
    for (var i=0,paper; paper=papers[i]; i++) {
      if (paper.innerHTML.indexOf(keyword.dataset["value"]) == -1) {
        paper.style.display = "none";
      }
      else {
        paper.style.display = "block";
      }
    }
  }
}



function showresource(what) {
  console.log(what)
  var template = '<div class="content child" style="padding:20px;display:flex;color:{FG};background:{BG};border:2px solid {FG}" id="{ID}" data-bg="{BG}" data-fg="{FG}"><span class="text2">'
    +'<a title="Open URL" href="{URL}" target="_blank" style="text-decoration:none;color:{FG};">'
    +'{TITLE}</a><hr style="color:{FG};border:1px solid {FG}"/>'
    +'<span class="small">{LONGNAME}</span><hr style="color:{FG};border:1px solid {FG};"/> '
    +'<div class="rotate" style="color:{FG};">{TYPE}<span style="width:5px"></span>{STATUS}</div></span></div>'
    ;
  var txt = "";
  var keys = Object.keys(DATA);
  console.log(DATA);
  for (var i=0,key1; key1=keys[i]; i++) {
    var new_template = template.replace('{TITLE}', key1);
    new_template = new_template.replace('{ID}', key1);
    if(DATA[key1]['TYPE'].toLowerCase() == what) { 
      for (var key2 in DATA[key1]) {
	if (key2 == 'STATUS') {
      	  if (DATA[key1][key2] == 'alpha') {
      	    var repl = '<span class="type alpha">ALPHA</span>';
      	  }
      	  else if (DATA[key1][key2] == 'beta') {
      	    var repl = '<span class="type beta">BETA</span>';
      	  }
      	  else {
      	    var repl = '<span class="type version">'+DATA[key1][key2].split(':')[1]+'</span>';
      	  }
      	}
      	else if (key2 == 'TYPE') {
      	  if (DATA[key1][key2] == 'DATA') {
      	    var repl = '<span class="type data">DATA</span>';
      	  }
      	  else if (DATA[key1][key2] == 'APP') {
      	    var repl = '<span class="type app">APP</span>';
      	  }
      	  else {
      	    var repl = '<span class="type tool">TOOL</span>';
      	  }
      	}
      	else {
      	  var repl = DATA[key1][key2];
      	}
      	var reg = RegExp('{'+key2+'}','g')
      	new_template = new_template.replace(reg, repl);
      }
      txt += new_template;
    }
  }
  document.getElementById('resources').innerHTML = txt;
  
  if (what == 'data') {
    document.getElementById('software-button').style.backgroundColor = '#2d6ca2';
    document.getElementById('tool-button').style.backgroundColor = '#2d6ca2';
    document.getElementById('data-button').style.backgroundColor = '#550000';
  }
  else if (what == 'tool') {
    document.getElementById('software-button').style.backgroundColor = '#2d6ca2';
    document.getElementById('tool-button').style.backgroundColor = '#550000';
    document.getElementById('data-button').style.backgroundColor = '#2d6ca2';
  }
  else if (what == 'software') {
    document.getElementById('software-button').style.backgroundColor = '#550000';
    document.getElementById('tool-button').style.backgroundColor = '#2d6ca2';
    document.getElementById('data-button').style.backgroundColor = '#2d6ca2';

  }


  var children = document.getElementsByClassName('child');
  for (var i=0,child; child=children[i]; i++) {
    child.style.backgroundColor=child.dataset['BG'];
    child.style.color = child.dataset['FG'];
  }
}


function getPosition(element){
    var e = document.getElementById(element);
    var left = 0;
    var top = 0;

    do{
        left += e.offsetLeft;
        top += e.offsetTop;
    }
    while(e = e.offsetParent);
    return [left, top];
}


function checkfornews() {
  var url = window.location.href;
  if (url.indexOf('?news=') != -1) {
    news = url.split('?news=')[1];
    document.getElementById('tabreiter-0-1').checked=true;
    console.log(news);
    toggle(news);
    toggleNews('archive');
    window.scrollTo(getPosition(news));
  }
}

