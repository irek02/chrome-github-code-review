describe("JK chrome extension for Github", function () {

  files = $('<div id="files"></div>');

  file1 = $('<div class="file"><span class="user-select-contain" title="lib/Helper/Doc/Link.php">.ib/Helper/Doc/Link.php</span></div>');
  file2 = $('<div class="file"><span class="user-select-contain" title="src/Application/Access/UserAccess.php">../Application/Access/UserAccess.php</span></div>');
  file3 = $('<div class="file"><span class="user-select-contain" title="src/Application/Access/TokenAccess.php">../Application/Access/TokenAccess.php</span></div>');
  file4 = $('<div class="file"><span class="user-select-contain" title="src/Application/Finder/OrganizationFinderInterface.php">.../Finder/OrganizationFinderInterface.php</span></div>');
  file5 = $('<div class="file"><span class="user-select-contain" title="src/Infrastructure/Finder/DrupalApplicationFinder.php">src/Infrastructure/Finder/DrupalApplicationFinder.php</span></div>');
  file6 = $('<div class="file"><span class="user-select-contain" title="src/Infrastructure/Finder/DrupalOrganizationFinder.php">src/Infrastructure/Finder/DrupalOrganizationFinder.php</span></div>');
  file7 = $('<div class="file"><span class="user-select-contain" title="tests/Application/Access/UserAccessTest.php">tests/Application/Access/UserAccessTest.php</span></div>');
  
  

  files.append(file1);
  files.append(file2);
  files.append(file3);
  files.append(file4);
  files.append(file5);
  files.append(file6);
  files.append(file7);


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

  })

  // it('should display file hierarchy', function () {

  //   expect($('#jk-hierarchy').text()).toContain(file1.text());
  //   expect($('#jk-hierarchy').text()).toContain(file2.text());
  //   expect($('#jk-hierarchy').text()).toContain(file3.text());
  //   expect($('#jk-hierarchy').text()).toContain(file4.text());
  //   expect($('#jk-hierarchy').text()).toContain(file5.text());
  //   expect($('#jk-hierarchy').text()).toContain(file6.text());
  //   expect($('#jk-hierarchy').text()).toContain(file7.text());

  // });

  // it('should hightlight current file', function () {

  //   pressJ(main);
  //   pressJ(main);

  //   expect($('#jk-hierarchy').find('.current').text()).toBe(file2.text());

  // });


  it('should generate the structure of the file hierarchy', function () {

    expect(main.getHierarchyStructure()).toEqual({
      lib: {
        Helper: {
          Doc: ['Link.php']
        }
      },
      src: {
        Application: {
          Access: ['UserAccess.php', 'TokenAccess.php'],
          Finder: ['OrganizationFinderInterface.php']
        },
        Infrastructure: {
          Finder: ['DrupalApplicationFinder.php', 'DrupalOrganizationFinder.php']
        }
      },
      tests: {
        Application: {
          Access: ['UserAccessTest.php']
        }
      }
    });

  });


});

function pressJ (main) {
  main.doKeyPress({ keyCode: 74 });
}

function pressK (main) {
  main.doKeyPress({ keyCode: 75 });
}