function Main() {
}
Main.prototype.init = function() {

  this.cnt = 0;

  this.j_key = 74; // j key
  this.k_key = 75; // k key

  this.n_key = 78; // n key
  this.p_key = 80; // p key

  this.z_key = 90; // z key

  this.generateFileHierarchy();

  if (window == top) {
    window.addEventListener('keyup', this.doKeyPress.bind(this), false);
  }
};

Main.prototype.generateFileHierarchy = function() {

  this.currentPageUrl = window.location.href;
  this.currentFileId = null;
  this.currentCommentId = null;

  this.files = this.getFiles();
  this.toolBarHeight = $('.pr-toolbar').height();

  var hierarchy = $('<p id="jk-hierarchy"></p>');
  var structure = this.getHierarchyStructure();
  var compressedStructure = main.compressHierarchy(structure);

  this.generateFileHierarchyHtml(hierarchy, compressedStructure);
  this.cnt = 0;

  $("body").prepend(hierarchy);

  this.updateCurentDiffPos();

  $('#jk-hierarchy').css('width', $('#jk-hierarchy').width()*1.2);

  $('#jk-hierarchy').find('.folder').click(function () {
    $header = $(this);
    $content = $header.next();
    $content.slideToggle(10, function () {
      $header.toggleClass('collapsed');
    });
  });

  var that = this;

  $('#jk-hierarchy').find('.jk-file').click(function () {
    that.scrollTo($('#' + $(this).data('file-id')));
    that.currentFileId = $(this).data('file-id').split('-')[1];
  });
  

};

Main.prototype.generateFileHierarchyHtml = function(hierarchy, structure) {

  var list = $(document.createElement('ul'));

  var that = this;
  
  $.each(structure, function(index, file) {

    var label = (typeof file == 'string') ? file : index;
    
    var item = $('<li>' + label + '</li>');
      
    if (typeof structure[index] === 'object') {
      item.addClass('folder');
    }
    else if (typeof structure[index] === 'string') {
      item.addClass('jk-file');
      item.attr("data-file-id", "diff-" + that.cnt);
      that.cnt = that.cnt + 1;
    }

    
    list.append(item);
    hierarchy.append(list);
    
    if (typeof structure[index] === 'object') {
      that.generateFileHierarchyHtml(list, structure[index]);
    }

  });  
}

Main.prototype.doKeyPress = function(e) {

  if ($(e.target).prop("tagName") != 'BODY') {
    return;
  }

  if (e.keyCode == this.j_key || e.keyCode == this.k_key) {
    this.updateCurrentPos(e.keyCode);
    var el = this.getCurrentEl();
    this.scrollTo(el);
  }

  if (e.keyCode == this.n_key || e.keyCode == this.p_key) {
    this.updateCurrentCommentPos(e.keyCode);
    var el = this.getCurrentCommentEl();
    this.scrollTo(el);
  }

  if (e.keyCode == this.z_key) {
    if (this.currentPageUrl != window.location.href || !($('#jk-hierarchy') && $('#jk-hierarchy')[0].innerHTML)) {
      $('#jk-hierarchy').remove();
      this.generateFileHierarchy();
      $('#jk-hierarchy').slideToggle(10);
    }
    $('#jk-hierarchy').slideToggle(10);
  }
  
};

Main.prototype.getHierarchyStructure = function() {
  var result = {};
  var files = this.files.find('.user-select-contain');
  var addProp = this.addProp.bind(this);
  $.each(files, function(index, file) {
    var parts = $(file).attr('title').split('/');

    addProp(result, parts);
  });

  return result;
};

Main.prototype.addProp = function(res, arr) {

  if (arr.length == 1) {
    var fname = arr.splice(0,1);
    res[fname[0]] = fname[0];
    return;
  }

  if (arr.length > 1) {
    var prop = arr.splice(0,1);
    
    if (!res.hasOwnProperty(prop)) {
      res[prop] = {};  
    }

    this.addProp(res[prop], arr);
  }

};

Main.prototype.compressHierarchy = function(hierarchy) {
  var newObj = {};
  var path = "";

  traverse(hierarchy, newObj, path);

  return newObj;

  function traverse(obj, newObj, path) {
    for(var key in obj) {

      if (!path || typeof obj[key] != 'string') {
        path = path + String(key) + '/';
      }

      if (typeof obj[key] == 'string') {
        
        if (Object.keys(obj).length == 1) {
          newObj[path] = {};
          newObj[path][String(key) + '/'] = obj[key];
        }
        else {
          newObj[path] = obj[key];
        }
        
        path = "";
        continue;
      }

      if (typeof obj[key] == 'object' && Object.keys(obj[key]).length > 1) {
        newObj[path] = {};
        traverse(obj[key], newObj[path], "");
        path = "";
        continue;
      }
      
      traverse(obj[key], newObj, path);
      
      path = "";
      
    }
  }
};

Main.prototype.getCurrentEl = function() {
  return this.files[this.currentFileId];
};


Main.prototype.updateCurrentPos = function(keyCode) {
  if (this.currentFileId == null) {
    this.currentFileId = 0;
  }
  else if (this.currentFileId < this.files.length - 1 && keyCode == this.j_key) {
   this.currentFileId++; 
  }
  else if (this.currentFileId > 0 && keyCode == this.k_key) {
   this.currentFileId--; 
  }
};


Main.prototype.updateCurrentCommentPos = function(keyCode) {
  if (this.currentCommentId == null) {
    this.currentCommentId = 0;
  }
  else if (this.currentCommentId < this.getComments().length - 1 && keyCode == this.n_key) {
   this.currentCommentId++; 
  }
  else if (this.currentCommentId > 0 && keyCode == this.p_key) {
   this.currentCommentId--; 
  }
};


Main.prototype.getCurrentCommentEl = function() {
  return this.getComments()[this.currentCommentId];
};


Main.prototype.scrollTo = function(el) {

  var that = this;
  var offTop = $(el).offset().top - this.toolBarHeight - 10;
  
  $('body').scrollTop(offTop);
  that.updateCurentDiffPos();

};

Main.prototype.updateCurentDiffPos = function() {
  var id = null;
  
  if (!this.getFiles) return;

  $.each(this.getFiles(), function(key, value) {    
    var rect = value.getBoundingClientRect();
    if (rect.top < 139) {
      id = $(value).attr("id");
    }
  });

  $('#jk-hierarchy').find('.jk-file.current').removeClass('current');
  $('#jk-hierarchy').find('.jk-file*[data-file-id="' + id + '"]').addClass('current');


  if ($('#jk-hierarchy').is(":visible") && $('#jk-hierarchy').find('.jk-file.current').is(":visible")) {
    while (isAbove()) {
      $('#jk-hierarchy').scrollTop($('#jk-hierarchy').scrollTop() - 10);  
    }

    while (isBelow()) {
      $('#jk-hierarchy').scrollTop($('#jk-hierarchy').scrollTop() + 10);  
    }  
  }
    

  function isAbove() {
    var pos = $('#jk-hierarchy').find('.jk-file.current').position();
    return pos && pos.top < 0;
  }

  function isBelow() {
    var pos = $('#jk-hierarchy').find('.jk-file.current').position();
    return pos && pos.top > $('#jk-hierarchy').height();
  }
  
};

Main.prototype.getFiles = function() {
  return $('.file');
};


Main.prototype.getComments = function() {
  return $('.main-content .timeline-comment');
};
