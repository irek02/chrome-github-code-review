function Main() {
}
Main.prototype.init = function() {

  this.j_key = 74; // j key
  this.k_key = 75; // k key

  this.files = this.getFiles();
  this.currentFileId = null;
  this.toolBarHeight = $('.pr-toolbar').height();

  this.generateFileHierarchy();

  $('#jk-hierarchy').css('margin-top', this.toolBarHeight);

  if (window == top) {
    window.addEventListener('keyup', this.doKeyPress.bind(this), false);
  }
};

Main.prototype.generateFileHierarchy = function() {

  var hierarchy = $('<p id="jk-hierarchy"></p>');
  var structure = this.getHierarchyStructure();
  var compressedStructure = main.compressHierarchy(structure);

  this.generateFileHierarchyHtml(hierarchy, compressedStructure);

  $("body").prepend(hierarchy);

  hierarchy.css('margin-top', this.toolBarHeight);

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

    list.append(item);
    hierarchy.append(list);
    
    if (typeof structure[index] === 'object') {
      that.generateFileHierarchyHtml(list, structure[index]);
    }

  });  
}

Main.prototype.reGenerateFileHierarchy = function(currentEl) {

  var hierarchy = this.getHierarchyEl();

  hierarchy.remove();

  this.generateFileHierarchy();

};


Main.prototype.getHierarchyEl = function() {
  return $('#jk-hierarchy');
};


Main.prototype.doKeyPress = function(e) {

  if (e.keyCode != this.j_key && e.keyCode != this.k_key) {
    return;
  }

  this.updateCurrentPos(e.keyCode);

  var el = this.getCurrentEl();

  this.scrollTo(el);

  this.reGenerateFileHierarchy();
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

      path = path + String(key) + '/';
      
      if (Array.isArray(obj[key])) {
        newObj[path] = obj[key];
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
    res[prop] = [fname[0]];  
  }
  else {
    res[prop].push(fname[0]);    
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
  $('html, body').animate({
    scrollTop: $(el).offset().top - this.toolBarHeight - 10
  }, 10);
};


Main.prototype.getFiles = function() {
  return $('.file');
};
