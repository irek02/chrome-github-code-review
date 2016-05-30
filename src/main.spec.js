describe("JK chrome extension for Github", function () {

  files = $('<div id="files"></div>');

  file1 = $('<div id="diff-0" class="file"><span class="user-select-contain" title="lib/Helper/Doc/Link.php">.ib/Helper/Doc/Link.php</span></div>');
  file2 = $('<div id="diff-1" class="file"><span class="user-select-contain" title="src/Application/Access/UserAccess.php">../Application/Access/UserAccess.php</span></div>');
  file3 = $('<div id="diff-2" class="file"><span class="user-select-contain" title="src/Application/Access/TokenAccess.php">../Application/Access/TokenAccess.php</span></div>');
  file4 = $('<div id="diff-3" class="file"><span class="user-select-contain" title="src/Application/Finder/OrganizationFinderInterface.php">.../Finder/OrganizationFinderInterface.php</span></div>');
  file5 = $('<div id="diff-4" class="file"><span class="user-select-contain" title="src/Infrastructure/Finder/DrupalApplicationFinder.php">src/Infrastructure/Finder/DrupalApplicationFinder.php</span></div>');
  file6 = $('<div id="diff-5" class="file"><span class="user-select-contain" title="src/Infrastructure/Finder/DrupalOrganizationFinder.php">src/Infrastructure/Finder/DrupalOrganizationFinder.php</span></div>');
  file7 = $('<div id="diff-6" class="file"><span class="user-select-contain" title="tests/Application/Access/AccountAccessTest.php">tests/Application/Access/AccountAccessTest.php</span></div>');
  file8 = $('<div id="diff-7" class="file"><span class="user-select-contain" title="tests/Application/Access/Permissions/PermissionsAccessTest.php">tests/Application/Access/Permissions/PermissionsAccessTest.php</span></div>');
  file9 = $('<div id="diff-8" class="file"><span class="user-select-contain" title="tests/Application/Access/Permissions/RobotAccessTest.php">tests/Application/Access/Permissions/RobotAccessTest.php</span></div>');
  file10 = $('<div id="diff-9" class="file"><span class="user-select-contain" title="tests/Application/Access/UserAccessTest.php">tests/Application/Access/UserAccessTest.php</span></div>');
  file11 = $('<div id="diff-10" class="file"><span class="user-select-contain" title="Gemfile">Gemfile</span></div>');
  file12 = $('<div id="diff-11" class="file"><span class="user-select-contain" title="Gemfile.lock">Gemfile.lock</span></div>');
  
  
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
  files.append(file12);


  $(document.body).append(files);

  beforeEach(function() {
    main = new Main();
    main.init();
  });


  it('should jump to the next file when pressing "j" and to the previous file when pressing "k"', function () {

    pressJ(main);
    pressJ(main);
    pressJ(main);
    pressJ(main);

    expect(main.getCurrentEl()).toEqual(file4[0]);

    pressK(main);
    pressK(main);

    expect(main.getCurrentEl()).toEqual(file2[0]);

  });


  it('should generate a file hirarchy with an expected number of folders and files', function () {

    main.generateFileHierarchy();

    var folders = $('#jk-hierarchy').find('.folder');
    expect(folders.length).toBe(8);
    
    var files = $('#jk-hierarchy').find('.jk-file');
    expect(files.length).toBe(12);

  });

  
  it('should generate a file hirarchy with files in proper order', function () {

    main.generateFileHierarchy();
    
    var generatedFiles = $('#jk-hierarchy').find('.jk-file');
    var existingFiles = $('.file');

    $.each(generatedFiles, function (key, generatedFile) {
      var existingFile = $(existingFiles[key]).text();
      expect(existingFile).toContain($(generatedFile).text());
    });

  });


});

function pressJ (main) {
  main.doKeyPress({ keyCode: 74 });
}

function pressK (main) {
  main.doKeyPress({ keyCode: 75 });
}