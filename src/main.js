function Main() {
}
Main.prototype.init = function() {

  this.cnt = 0;

  this.j_key = 74; // j key
  this.k_key = 75; // k key
  this.z_key = 90; // z key

  this.files = this.getFiles();
  this.currentFileId = null;
  this.toolBarHeight = $('.pr-toolbar').height();

  this.generateFileHierarchy();

  $('#jk-hierarchy').css('margin-top', this.toolBarHeight);
  $('#jk-hierarchy').css('width', $('#jk-hierarchy').width() + 10);

  if (window == top) {
    window.addEventListener('keyup', this.doKeyPress.bind(this), false);
  }
};

Main.prototype.generateFileHierarchy = function() {

  var hierarchy = $('<p id="jk-hierarchy"></p>');
  var structure = this.getHierarchyStructure();
  var compressedStructure = main.compressHierarchy(structure);

  this.generateFileHierarchyHtml(hierarchy, compressedStructure);
  this.cnt = 0;

  $("body").prepend(hierarchy);

  this.updateCurentDiffPos();

  hierarchy.css('margin-top', this.toolBarHeight);

  $('#jk-hierarchy').find('.folder').click(function () {
    $header = $(this);
    $content = $header.next();
    $content.slideToggle(10, function () {
      $header.toggleClass('collapsed');
    });
  });

  var that = this;

  $('#jk-hierarchy').find('.jk-file').click(function (f) {
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

    if (index !== '_files_') {
      list.append(item);
    }
    
    hierarchy.append(list);
    
    if (typeof structure[index] === 'object') {
      that.generateFileHierarchyHtml(list, structure[index]);
    }

  });  
}

Main.prototype.doKeyPress = function(e) {

  if (e.keyCode == this.j_key || e.keyCode == this.k_key) {
    this.updateCurrentPos(e.keyCode);
    var el = this.getCurrentEl();
    this.scrollTo(el);
  }

  if (e.keyCode == this.z_key) {
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

Main.prototype.compressHierarchy = function(hierarchy) {
  var newObj = {};
  var path = "";

  traverse(hierarchy, newObj, path);

  return newObj;

  function traverse(obj, newObj, path) {
    for(var key in obj) {

      if (key == "_files_" && Object.keys(obj).length > 1) {
        newObj['_files_'] = obj[key];
        continue;
      }

      if (key !== "_files_") {
        path = path + String(key) + '/';
      }

      if (Array.isArray(obj[key])) {
        newObj[path] = {};
        newObj[path]['_files_'] = obj[key];
        path = "";
        continue;
      }
      
      if (!Array.isArray(obj[key]) && Object.keys(obj[key]).length > 1) {
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

Main.prototype.addProp = function(res, arr) {
  var prop = arr.splice(0,1);
  var hasProp = res.hasOwnProperty(prop);

  if (arr.length > 1) {
    if (!hasProp) {
      res[prop] = {};  
    }
    this.addProp(res[prop], arr);
    return;
  }
  
  var fname = arr.splice(0,1);
  if (!hasProp) {
    res[prop] = {_files_: [fname[0]]};  
  }
  else {
    res[prop]._files_.push(fname[0]);
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
  
};

Main.prototype.getFiles = function() {
  return $('.file');
};
