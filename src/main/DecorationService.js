function DecorationService(element) {
  this.element = element;
};

DecorationService.prototype.applyInitStyle = function () {
  $(this.element).css('width', $(this.element).width() * 1.2);
  $(this.element).css("background-color", $('body').css('background-color'));
  // Hide the sidebar by default.
  $(this.element).hide();
};

DecorationService.prototype.appendCommentCounts = function () {
  var files = $('#jk-hierarchy').find('.jk-file');
  $.each(files, function (key, item) {

    var fileId = $(item).data('file-id');

    var comments = $('#' + fileId).find('.js-comment.unminimized-comment');
    if (comments.length) {
      var count = $('<span class="comment-count"> (' + comments.length + ')</span>');
      $(item).append(count);
    }

  });
};

DecorationService.prototype.appendNoDiffMessage = function () {

  if ($('#jk-notice').length) return;

  $("body").prepend('<div id="jk-notice">No diffs found</div>');
  $('#jk-notice').css("background-color", $('body').css('background-color'));
};
