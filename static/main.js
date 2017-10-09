var myToggles = [];

if(window.innerWidth && window.innerWidth <= 680)
{
  $( document ).ready( function() 
    {      
      $("#header ul").addClass('hide');
      $("#introduction").append('<div id="menubutton" class="unpressed" onclick="toggleMenu()">MENU</div>');
    makeMenu();
    }
      );
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
