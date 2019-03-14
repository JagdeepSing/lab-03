$(function() {
  'use strict';

  /**
   * Picture is a constructor that takes in
   */
  function Picture(pic) {
    this.imageurl = pic.image_url;
    this.title = pic.title;
    this.description = pic.description;
    this.keyword = pic.keyword;
    this.horns = pic.horns;
  }

  Picture.all = {};
  // TODO: add unique keywords per page
  Picture.allKeywords = new Set();

  /**
   *
   */
  Picture.prototype.toHtml = function() {
    let $template = $('#photo-template').html();
    let compiledTemplate = Handlebars.compile($template);
    console.log($template);
    return compiledTemplate(this);
  };

  // TODO:
  Picture.readJSON = (filePath) => {
    $.get(filePath, 'json')
      .then((data) => {
        let allAnimals = [];
        data.forEach((item) => {
          allAnimals.push(new Picture(item));
          Picture.allKeywords.add(item.keyword);
        });
        Picture.all[filePath] = allAnimals;
        Picture.populateFilter();
      })
      .then(() => {
        Picture.loadPictures(filePath);
      });
  };

  Picture.populateFilter = () => {
    $('option')
      .not(':first')
      .remove();

    Picture.allKeywords.forEach((keyword) => {
      $('#filterList').append(
        `<option value="${keyword}">${keyword.charAt(0).toUpperCase() +
          keyword.slice(1)}</option>`
      );
    });
  };

  Picture.loadPictures = (filePath) => {
    // console.log(Picture.all[filePath]);
    Picture.all[filePath].forEach((pic) => {
      console.log('loadPictures in');
      console.log(pic.toHtml());
      $('#animal-wrap').append(pic.toHtml());
    });
  };

  // filters animals by keyword
  let _filterImages = () => {
    // on any change of the select dropdown list
    $('filterList').on('change', () => {
      let selectedKeyword = $('select option:selected').val();

      // if elements are hidden and user selects default option in dropdown list,
      // shows those elements
      if (selectedKeyword === 'default') {
        $('.animal:hidden').show();
      } else {
        // takes jQuery matched set and converts to an array and iterates over each HTML element
        // and after converting each element back to a jQuery object (in order to use jQuery methods)
        // filters objects for only those with the class of the selected keyword
        $('.animal')
          .toArray()
          .forEach((val) => {
            val = $(val);
            if (!val.hasClass(selectedKeyword)) {
              val.fadeOut(200);
            } else {
              val.fadeIn(200);
            }
          });
      }
    });
  };

  let navBtns = () => {
    // create HTML buttons
    $('main').before(
      '<button class="navButtons" id="0" type="button">Page 1</button>' +
        '<button class="navButtons" id="1" type="button">Page 2</button>'
    );

    // add event listeners to buttons

    $('navButtons').on('click', () => {
      // TODO:
    });
    // hide current page and display clicked page
  };

  //_displayImages();
  //_filterImages();
  $(() => {
    Picture.readJSON('data/page-1.json');
    Picture.readJSON('data/page-2.json');
    navBtns();
  });
});
