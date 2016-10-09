function DecorationService(element) {
  this.element = element;
};

DecorationService.prototype.applyInitStyle = function () {
  $(this.element).css('width', $(this.element).width() * 1.2);
  $(this.element).css("background-color", $('body').css('background-color'));
  // Hide the sidebar by default.
  $(this.element).hide();
};

DecorationService.prototype.adjustBottomFileHeight = function (toolBarHeight) {
  // Add some bottom margin for the last diff so scrollTo can reach it in 
  // case the diff is very small.
  var lastDiff = $('.file')[$('.file').length - 1];
  if (lastDiff && $(lastDiff).height() < $(window).height()) {
    var newMargin = $(window).height() - $(lastDiff).height() - toolBarHeight - 100;
    if (newMargin > 0) {
      $(lastDiff).css('margin-bottom', newMargin);  
    }
  }
};

DecorationService.prototype.appendCommentCounts = function() {
  var files = $('#jk-hierarchy').find('.jk-file');
  $.each(files, function(key, item) {

    var fileId = $(item).data('file-id');

    var comments = $('#' + fileId).find('.js-comment');
    if (comments.length) {
      var count = $('<span class="comment-count"> (' + comments.length + ')</span>');
      $(item).append(count);
    }

  });
};

DecorationService.prototype.appendNoDiffMessage = function() {

  if ($('#jk-notice').length) return; 

  $("body").prepend('<div id="jk-notice">No diffs found</div>');
  $('#jk-notice').css("background-color", $('body').css('background-color'));
};