(function ($, Drupal) {

  "use strict";

  Drupal.behaviors.initFlexsliderViews = {
    attach:function (context) {
      $("div.flex-slider:not(.slider-attached)", context)
        .addClass('slider-attached')
        .sort(function (a, b) {
          var a_sort = $(a).data('flexslidersort') || 0,
            b_sort = $(b).data('flexslidersort') || 0;
          return a_sort > b_sort ? 1 : -1;
        })
        .each(function () {
          var $this = $(this),
            options = $this.data('flexsliderconfig');

          // Register own before handler which invokes a custom event
          options.before = function (flexslider) {
            $this.trigger('flexslider-before', flexslider.animatingTo);
          };

          // Register own after handler which invokes a custom event
          options.after = function (flexslider) {
            $this.trigger('flexslider-after', flexslider.animatingTo);
          };

          // The lazy loaded images start with a 1px placeholder gif
          // which has to be set to the correct size until it is load
          var $lazyImages = $("img[data-lazy-src]", this).each(function(){
            $(this).css({
              width : 1,
              height: 1
            });
            // After the site was load we start the lazy loading
            windowLoad($.proxy(function () {
              $(this)
                .attr('src', $(this).data('lazy-src'))
                .css({height: '', width: ''});
            }, this));
          });

          // Apply the slider
          var $slider = $(this).flexslider(options);

          // Pause the slider until the images are load
          if($lazyImages.length) {
            $slider.flexslider("pause");
            windowLoad(function(){
              $lazyImages.imagesLoaded(function(){
                $slider.flexslider("play");
              });
            });
          }
        });
    }
  };

})(jQuery, Drupal);
