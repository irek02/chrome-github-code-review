function HotKeysService() {
  this.diffNext = 74; // j key
  this.diffPrev = 75; // k key

  this.commentNext = 78; // n key
  this.commentPrev = 80; // p key

  this.toggleSidebar = 90; // z key

  var that = this;

  if (typeof chrome != "undefined") {
    
    chrome.storage.local.get("hotkeys", function (items){
      if (items.hasOwnProperty('hotkeys')) {
        that.updateHotkeys(items.hotkeys);
      }
    });

    chrome.storage.onChanged.addListener(function (changes, namespace) {
      if (changes.hasOwnProperty('hotkeys')) {
        that.updateHotkeys(changes.hotkeys.newValue);
      }
    });
  }

};

HotKeysService.prototype.updateHotkeys = function (hotkeys) {
  this.diffNext = hotkeys.diffNext;
  this.diffPrev = hotkeys.diffPrev;
  this.commentNext = hotkeys.commentNext;
  this.commentPrev = hotkeys.commentPrev;
  this.toggleSidebar = hotkeys.toggleSidebar;
};

HotKeysService.prototype.getKeyCodeForNextDiff = function () {
  return this.diffNext;
}

HotKeysService.prototype.getKeyCodeForPrevDiff = function () {
  return this.diffPrev;
}

HotKeysService.prototype.getKeyCodeForNextComment = function () {
  return this.commentNext;
}

HotKeysService.prototype.getKeyCodeForPrevComment = function () {
  return this.commentPrev;
}

HotKeysService.prototype.getKeyCodeForToggleSidebar = function () {
  return this.toggleSidebar;
}

HotKeysService.prototype.isValidKeyCodeForDiff = function (keyCode) {
  return keyCode === this.getKeyCodeForNextDiff() || keyCode === this.getKeyCodeForPrevDiff();
}

HotKeysService.prototype.isValidKeyCodeForComment = function (keyCode) {
  return keyCode === this.getKeyCodeForNextComment() || keyCode === this.getKeyCodeForPrevComment();
}

HotKeysService.prototype.isValidKeyCodeForSideBarToggle = function (keyCode) {
  return keyCode === this.getKeyCodeForToggleSidebar();
}

HotKeysService.prototype.isValidKeyCode = function (keyCode) {
  return this.isValidKeyCodeForDiff(keyCode) ||
    this.isValidKeyCodeForComment(keyCode) ||
    this.getKeyCodeForToggleSidebar(keyCode);
}
