$(function() {
  'use strict';

  let _displayImages = () => {

    /**
     * Picture is a constructor that takes in
     */
    function Picture (pic) {
      this.imageurl = pic.image_url;
      this.title = pic.title;
      this.description = pic.description;
      this.keyword = pic.keyword;
      this.horns = pic.horns;
    }

    Picture.allPictures = [];
    Picture.allKeywords = new Set();

    Picture.prototype.render = function() {
      $('#animal-wrap').append('<div class="clone"></div>');

      let $picClone = $('div[class="clone"]');
      let $picHTML = $('#photo-template').html();

      $picClone.html($picHTML);
      $picClone.find('h2').text(this.title);
      $picClone.find('img').attr({ 'src':this.imageurl, 'alt':this.keyword });
      $picClone.find('p').text(this.description);
      $picClone.removeClass('clone');
      $picClone.attr('class', this.title + ' animal ' + this.keyword);
    };

    Picture.readJSON = () => {
      $.get('data/page-1.json', 'json')
        .then(data => {
          data.forEach(item => {
            Picture.allPictures.push(new Picture(item));
            Picture.allKeywords.add(item.keyword);
          });
          Picture.populateFilter();
        })
        .then(Picture.loadPictures);
    };

    Picture.populateFilter = () => {
      $('option').not(':first').remove();

      Picture.allKeywords.forEach((keyword) => {
        $('select').append(`<option value="${keyword}">${keyword.charAt(0).toUpperCase() + keyword.slice(1)}</option>`);
      });
    };

    Picture.loadPictures = () => {
      Picture.allPictures.forEach(pic => pic.render());
      $('#photo-template').remove();
    };

    $(() => Picture.readJSON());

  };

  // filters animals by keyword
  let _filterImages = () => {
    // on any change of the select dropdown list
    $('select').on('change', () => {
      let selectedKeyword = $('select option:selected').val();

      // if elements are hidden and user selects default option in dropdown list,
      // shows those elements
      if (selectedKeyword === 'default') {
        $('.animal:hidden').show();
      } else {
        // takes jQuery matched set and converts to an array and iterates over each HTML element
        // and after converting each element back to a jQuery object (in order to use jQuery methods)
        // filters objects for only those with the class of the selected keyword
        $('.animal').toArray().forEach((val) => {
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

  _displayImages();
  _filterImages();

});
