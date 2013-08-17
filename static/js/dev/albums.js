function getQueryVariable(variable) {
  //var query = window.location.search.substring(1);
  var vars = window.location.search.substring(1).split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
  return(false);
}

function getCollections() {
  $.getJSON("/albums?request=collections", function(data){
    var items = [];
    //convert object to array so that browsers sort the same.
    //jQuery .each traverses differently in various browsers.
    var keys = Object.keys(data);
    for (var i = 0, ilen = keys.length; i < ilen; i++) {
      var item = [];
      for (var x = 0, xlen = data[keys[i]].albums.length; x < xlen; x++) {
        item.push('<li><a href="/gallery.html?album=' + data[keys[i]].albums[x].id + '&title=' + data[keys[i]].albums[x].title.replace(/_/gi, ' ') + '"><i class="icon-camera"></i>&nbsp;'  + data[keys[i]].albums[x].title.replace(/_/gi, ' ') + '</a></li>');
      }
      if (data[keys[i]].title !== "Root") {
        items.unshift('<li class="expanded"><a href=#><i class="icon-folder-close"></i>&nbsp;' + data[keys[i]].title + '</a><ul class="sublist">' + item.join('') + '</ul></li>');
      } else {
        items.push(item.join(''));
      }
    }
    slideOut(items);
  });
}

function getSets() {
  var items = [];
  $.getJSON("/albums?request=photosets", function(data){
    //convert object to array so that browsers sort the same.
    //jQuery .each traverses differently in various browsers.
    var keys = Object.keys(data);
    for (var i = 0, len = keys.length; i < len; i++) {
      items.push('<li><a href="/gallery.html?album=' + data[keys[i]].id + '&title=' + data[keys[i]].title.replace(/_/gi, ' ') + '"><i class="icon-camera"></i>&nbsp;'  + data[keys[i]].title.replace(/_/gi, ' ') + '</a></li>');
    }
    slideOut(items);
  });
}

function slideOut(items) {
  var $page = window.location.pathname;
  var $slideout = $("#slideclick").parent();
  $('#slidecontent ul').append(items.join(''));
  $("#slideclick").on("click", function () {
    if ($slideout.hasClass("popped")) {
      $slideout.animate({left: '-222px'}, {queue: false, duration: 500}).removeClass("popped");
      //$('.depth').css("opacity", "1");
      if ($page === "/") $('#slideclick').pointPoint();
    } else {
      $slideout.animate({left: "0px" }, {queue: false, duration: 500}).addClass("popped");
      //$('.depth').css("opacity", "0");
      if ($page === "/") $('#slideclick').pointPoint().destroyPointPoint();
    }
  });
  $('ul ul').hide();
  $('ul li.expanded > a').removeAttr("href");
  $('ul li.expanded > a').click(function (event) {
    $(this).parent().find('ul').toggle('slow');
    $('i.icon-folder-close').toggleClass('icon-folder-open');
  });
  if ($page === "/") $('#slideclick').pointPoint();
}
