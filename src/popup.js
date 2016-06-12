var hotkeyToUpdate = null;

var defaultHotkeys = {
  commentNext: 78,
  commentPrev: 80,
  diffNext: 74,
  diffPrev: 75,
  toggleSidebar: 90
};

var settings = {
  hotkeys: $.extend({}, defaultHotkeys)
};

$(document).ready(function() {

  $('#restore').click(function () {
    settings.hotkeys = $.extend({}, defaultHotkeys);
    chrome.storage.local.set({hotkeys: settings.hotkeys}, function(){});
    updateView();
  });

  $('.hotkeys li span').click(function () {
    hotkeyToUpdate = $(this).data('hotkey');
    $(this).text('set new key');
  });

  chrome.storage.local.get("hotkeys", function(items){
    if (Object.keys(items.hotkeys).length > 0) {
      settings.hotkeys = items.hotkeys;
    }
    
    chrome.storage.local.set({hotkeys: settings.hotkeys}, function(){});
    updateView();
  });

  updateView();  
});


function updateView() {
  for (key in settings.hotkeys) {
    var selector = '.hotkeys span[data-hotkey="' + key + '"]';
    var hotkeyChar = String.fromCharCode(settings.hotkeys[key]);
    $(selector).text(hotkeyChar.toLowerCase());
  }
}

function updateHotkey(e) {
  if (!hotkeyToUpdate) {
    return;
  }
  
  settings.hotkeys[hotkeyToUpdate] = e.keyCode;
  chrome.storage.local.set({hotkeys: settings.hotkeys}, function(){});
  updateView();
  hotkeyToUpdate = null; 
}

if (window == top) {
  window.addEventListener('keyup', updateHotkey, false);
}
