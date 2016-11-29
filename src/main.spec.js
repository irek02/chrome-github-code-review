describe("The main script", function () {

  files = $('<div id="files"></div>');

  file0 = $('<div id="diff-0" class="file"><div class="file-header" data-path="Gemfile">Gemfile</div></div>');
  file1 = $('<div id="diff-1" class="file"><div class="file-header" data-path="Gemfile.lock">Gemfile.lock</div></div>');
  file2 = $('<div id="diff-2" class="file"><div class="file-header" data-path="lib/Helper/Doc/Link.php">lib/Helper/Doc/Link.php</div></div>');
  file3 = $('<div id="diff-3" class="file"><div class="file-header" data-path="src/Application/Access/UserAccess.php">../Application/Access/UserAccess.php</div></div>');
  file4 = $('<div id="diff-4" class="file"><div class="file-header" data-path="src/Application/Access/TokenAccess.php">../Application/Access/TokenAccess.php</div></div>');
  file5 = $('<div id="diff-5" class="file"><div class="file-header" data-path="src/Application/Finder/OrganizationFinderInterface.php">.../Finder/OrganizationFinderInterface.php</div></div>');
  file6 = $('<div id="diff-6" class="file"><div class="file-header" data-path="src/Infrastructure/Finder/DrupalApplicationFinder.php">src/Infrastructure/Finder/DrupalApplicationFinder.php</div></div>');
  file7 = $('<div id="diff-7" class="file"><div class="file-header" data-path="src/Infrastructure/Finder/DrupalOrganizationFinder.php">src/Infrastructure/Finder/DrupalOrganizationFinder.php</div></div>');
  file8 = $('<div id="diff-8" class="file"><div class="file-header" data-path="tests/Application/Access/AccountAccessTest.php">tests/Application/Access/AccountAccessTest.php</div></div>');
  file9 = $('<div id="diff-9" class="file"><div class="file-header" data-path="tests/Application/Access/Permissions/PermissionsAccessTest.php">tests/Application/Access/Permissions/PermissionsAccessTest.php</div></div>');
  file10 = $('<div id="diff-10" class="file"><div class="file-header" data-path="tests/Application/Access/Permissions/RobotAccessTest.php">tests/Application/Access/Permissions/RobotAccessTest.php</div></div>');
  file11 = $('<div id="diff-11" class="file"><div class="file-header" data-path="tests/Application/Access/UserAccessTest.php">tests/Application/Access/UserAccessTest.php</div></div>');
  
  comment1 = $('<div class="js-comment">Comment!</div>');
  file0.append(comment1);
  
  
  files.append(file0);
  files.append(file1);
  files.append(file2);
  files.append(file3);
  files.append(file4);
  files.append(file5);
  files.append(file6);
  files.append(file7);
  files.append(file8);
  files.append(file9);
  files.append(file10);
  files.append(file11);

  beforeEach(function() {
    jasmine.clock().install();
    
    $(document.body).append(files);
    main = new Main();
    main.init();
  });

  afterEach(function() {
    jasmine.clock().uninstall();
    $(document.body).html("");
  });


  it('should jump to the next file when pressing "j" and to the previous file when pressing "k"', function () {

    // Pop open the sidebar.
    pressZ(main);

    var currentFileId;

    var file1Pos = {left: 8, right: 430, top: 1000, height: 32, bottom: 384, width: 422};
    var file3Pos = {left: 8, right: 430, top: 2000, height: 32, bottom: 384, width: 422};

    spyOn($('.file')[1], 'getBoundingClientRect').and.returnValue(file1Pos);
    spyOn($('.file')[3], 'getBoundingClientRect').and.returnValue(file3Pos);

    // Simulate that the scroll position of file3 is on top of the viewport.
    file3Pos.top = 100;

    pressJ(main);
    pressJ(main);
    pressJ(main);
    pressJ(main);

    currentFileId = $('#jk-hierarchy .current').data('file-id');
    expect(currentFileId).toBe($(file3).attr('id'));

    // Simulate that the scroll position of file1 is on top of the viewport.
    file1Pos.top = 100;
    file3Pos.top = 1000;

    pressK(main);
    pressK(main);

    currentFileId = $('#jk-hierarchy .current').data('file-id');
    expect(currentFileId).toBe($(file1).attr('id'));

  });

  it('should toggle the sidebar when pressing z key', function () {
    expect($('#jk-hierarchy').is(":visible")).toBe(false);
    
    pressZ(main);
    expect($('#jk-hierarchy').is(":visible")).toBe(true);
    
    pressZ(main);
    expect($('#jk-hierarchy').is(":visible")).toBe(false);
  });

  it('should generate a file hirarchy with an expected number of folders and files', function () {

    var folders = $('#jk-hierarchy').find('.folder');
    expect(folders.length).toBe(8);
    
    var filesInHierarchy = $('#jk-hierarchy').find('.jk-file');
    var originalFiles = $('body .file');
    expect(filesInHierarchy.length).toBe(originalFiles.length);

  });
  
  
  it('should generate a file hirarchy with files in proper order', function () {
    
    var generatedFiles = $('#jk-hierarchy').find('.jk-file');
    var existingFiles = $('.file');

    $.each(generatedFiles, function (key, generatedFile) {
      var existingFile = $(existingFiles[key]).text();
      expect(existingFile).toContain($(generatedFile).find('.file-name').text());
    });

  });
  
  
  it('should count number of comments per file', function () {
    
    var commentCountStr = $('#jk-hierarchy')
      .find('.jk-file[data-file-id="diff-0"]')
      .find('.comment-count')
      .text();
    
    expect(commentCountStr).toContain("(1)");

  });

  it('should properly regenerate the heirarchy', function () {

    $('#jk-hierarchy').remove();
    
  });

  it('should correctly identify a total number of comments', function () {

    var appInteractionService = new AppInteractionService(null);

    expect(appInteractionService.getComments().length).toBe(1);
    
  });

  it('should update the hierarchy when new diffs are lazy-loaded', function () {

    spyOn(main, 'generateApp').and.callThrough();
  
    // The following simulates the lazy loaded additional files.
    var new_file = $('<div id="diff-99" class="file"><div class="file-header" data-path="tests/Application/Access/UserAccessTest2.php">tests/Application/Access/UserAccessTest2.php</div></div>');
  
    $('#files').append(new_file);

    // After couple of seconds the sidebar gets regenerated (only 1 time!).
    jasmine.clock().tick(2000);    
    
    expect(main.generateApp.calls.count()).toBe(1);

    var filesInHierarchy = $('#jk-hierarchy').find('.jk-file');
    var originalFiles = $('body .file');

    // And the regenerated hierarchy contains the lazy loaded file.
    expect(filesInHierarchy.length).toBe(originalFiles.length);
 
  });

});

describe('The main script when no diffs found on page', function () {
  
  it('should not throw errors', function () {

    main = new Main();
    main.init();

  });

  it('should not display the sidebar', function () {
    main = new Main();
    main.init();

    expect($('#jk-hierarchy').is(":visible")).toBe(false);

  });

  it('does not trigger error when toggling the sidebar', function () {
    
    pressZ(main);

  });

});

function pressJ (main) {
  main.doKeyPress({ keyCode: 74 });
}

function pressK (main) {
  main.doKeyPress({ keyCode: 75 });
}

function pressZ (main) {
  main.doKeyPress({ keyCode: 90 });
}
