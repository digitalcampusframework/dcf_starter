// Test for Object and apply if not supported
if(!('objectFit' in document.body.style)) {
  objectFitImages();
}

require(['js/dcf-utility'], function(DCFUtilityModule) {
  // WebP Support Example
  DCFUtilityModule.DCFUtility.flagSupportsWebP();

  // JavaScript Support Example
  DCFUtilityModule.DCFUtility.flagSupportsJavaScript();
});

// Modals Example
require(['js/dcf-modal'], function(DCFModalModule) {
  let modals = document.querySelectorAll('.dcf-modal');
  let modal = new DCFModalModule.DCFModal(modals, bodyScrollLock);
  modal.initialize();
});

// Tabs Example
require(['js/dcf-tabs'], function(DCFTabsModule) {
  const tabGroups = document.querySelectorAll('.dcf-tabs');
  const tabGroup = new DCFTabsModule.DCFTabs(tabGroups, {useHashChange: true});
  tabGroup.initialize();
});

// Table Example
require(['js/dcf-table'], function(DCFTableModule) {
  const tables = document.querySelectorAll('.dcf-table');
  const table = new DCFTableModule.DCFTable(tables);
  table.initialize();
});

// Lazy Load Example
require(['js/dcf-lazyLoad'], function(DCFLazyLoadModule) {
  const images = document.querySelectorAll('[loading=lazy], .dcf-lazy-load');
  const observerConfig = {
    // extend intersection root margin by 50px to start intersection earlier by 50px
    rootMargin: '0px 0px 50px 0px',
    threshold: [0, 0.5]
  };
  const enterClassNames = [];
  const unlLazyLoad = new DCFLazyLoadModule.DCFLazyLoad(images, observerConfig, enterClassNames);
  unlLazyLoad.initialize();
});

//Date Picker
require(['js/dcf-datePicker'], function(DCFDatePickerModule) {
  let datePickers = document.querySelectorAll('.dcf-datepicker');
  datePickers.forEach(function (dp) {
    new DCFDatePickerModule.DCFDatepicker(dp);
  });
});

// Card as Links
require(['js/dcf-cardAsLink'], function(DCFCardAsLinkModule) {
  const cards = document.querySelectorAll('.dcf-card-as-link');
  let cardAsLink = new DCFCardAsLinkModule.DCFCardAsLink(cards);
  cardAsLink.initialize();
});

// Slideshow Example
require(['js/dcf-slideshow'], function(DCFSlideshowModule) {
  const openCaptionEvent = new Event('openCaption');
  const closeCaptionEvent = new Event('closeCaption');
  const slideshows = document.querySelectorAll('.dcf-slideshow');
  const uls = document.querySelectorAll('.dcf-slideshow ul');
  const slideshow = new DCFSlideshowModule.DCFSlideshow(slideshows, uls, openCaptionEvent, closeCaptionEvent);
  // const slideshowTheme = new DCFSlideshowTheme(slideshows, openCaptionEvent, closeCaptionEvent);

  slideshow.initialize();
  // slideshowTheme.initialize();

  const keyframesClose1 = [
    {
      transform: 'rotate(45deg)',
      transformOrigin: '50% 50%'
    },
    {
      transform: 'rotate(0deg)',
      transformOrigin: '50% 50%'
    }
  ];
  const keyframesClose2 = [
    {
      transform: 'rotate(-45deg)',
      transformOrigin: '50% 50%'
    },
    {
      transform: 'rotate(0deg)',
      transformOrigin: '50% 50%'
    }
  ];
  const keyframesOpen1 = [
    {
      transform: 'rotate(0deg)',
      transformOrigin: '50% 50%'
    },
    {
      transform: 'rotate(45deg)',
      transformOrigin: '50% 50%'
    }
  ];
  const keyframesOpen2 = [
    {
      transform: 'rotate(0deg)',
      transformOrigin: '50% 50%'
    },
    {
      transform: 'rotate(-45deg)',
      transformOrigin: '50% 50%'
    }
  ];
  const options = {
    duration: 250,
    fill: 'forwards'
  };

  Array.prototype.forEach.call(slideshows, (slideshow) => {
    // Slideshow Controls
    let ctrlGroup = slideshow.querySelector('[aria-label = "slideshow controls"]'); // DCF
    let ctrls = ctrlGroup.querySelectorAll('li');

    Array.prototype.forEach.call(ctrls, (ctrl) => {
      if (ctrl.getAttribute('id') === 'previous') {
        let ctrlButton = ctrl.querySelector('button');
        ctrlButton.classList.add('dcf-d-flex', 'dcf-ai-center', 'dcf-pt-4', 'dcf-pb-4', 'dcf-inverse');
        ctrlButton.innerHTML =
          '<svg class="dcf-h-4 dcf-w-4 dcf-fill-current" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">' +
          '<path d="M21.746.064a.504.504 0 0 0-.504.008l-19 11.5a.499.499 0 0 0-.001.856l19' +
          ' 11.5A.501.501 0 0 0 22 23.5V.5a.5.5 0 0 0-.254-.436z"></path>' +
          '</svg>';
      } else if (ctrl.getAttribute('id') === 'next') {
        let ctrlButton = ctrl.querySelector('button');
        ctrlButton.classList.add('dcf-d-flex', 'dcf-ai-center', 'dcf-pt-4', 'dcf-pb-4', 'dcf-inverse');
        ctrlButton.innerHTML =
          '<svg class="dcf-h-4 dcf-w-4 dcf-fill-current" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">' +
          '<path d="M21.759 11.577L2.786.077a.499.499 0 0 0-.759.428v23a.498.498 ' +
          '0 0 0 .5.5c.09 0 .18-.024.259-.072l18.973-11.5a.5.5 0 0 0 0-.856z"></path>' +
          '</svg>';
      }
    });
    // Caption Button
    let figures = slideshow.querySelectorAll('.dcf-slideshow figure');
    Array.prototype.forEach.call(figures, (figure) => {
      let captionBtn = figure.querySelector('button');
      if (!(typeof captionBtn === 'undefined')) {
        captionBtn.innerHTML = '<svg class="dcf-h-4 dcf-w-4 dcf-fill-current" ' +
          'width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">' +
          '<path class="theme-icon-slide-caption-open" ' +
          'd="M1,3h19c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1C0.4,1,0,1.4,0,2C0,2.6,0.4,3,1,3z"/>' +
          '<path class="theme-icon-slide-caption-open" ' +
          'd="M1,8h15c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1C0.4,6,0,6.4,0,7C0,7.6,0.4,8,1,8z"/>' +
          '<path class="theme-icon-slide-caption-close-1" ' +
          'd="M1,13h22c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1c-0.6,0-1,0.4-1,1C0,12.6,0.4,13,1,13z"/>' +
          '<path class="theme-icon-slide-caption-close-2" ' +
          'd="M1,13h22c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1c-0.6,0-1,0.4-1,1C0,12.6,0.4,13,1,13z"/>' +
          '<path class="theme-icon-slide-caption-open" ' +
          'd="M1,18h18c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1c-0.6,0-1,0.4-1,1C0,17.6,0.4,18,1,18z"/>' +
          '<path class="theme-icon-slide-caption-open" ' +
          'd="M1,23h15c0.6,0,1-0.4,1-1c0-0.6-0.4-1-1-1H1c-0.6,0-1,0.4-1,1C0,22.6,0.4,23,1,23z"/>' +
          '</svg>';
      }
    });
  });
  let slideBtns = document.querySelectorAll('.dcf-btn-slide');
  Array.prototype.forEach.call(slideBtns, (slideBtn) => {
    slideBtn.classList.add('dcf-d-flex', 'dcf-ai-center', 'dcf-pt-4', 'dcf-pb-4', 'dcf-white');
  });
  let buttons = document.querySelectorAll('.dcf-btn-slide-caption');
  Array.prototype.forEach.call(buttons, (button) => {
    let caption = button.previousElementSibling;
    let close1 = button.querySelector('.theme-icon-slide-caption-close-1');
    let close2 = button.querySelector('.theme-icon-slide-caption-close-2');

    caption.addEventListener('openCaption', () => {
      close1.animate(keyframesClose1, options);
      close2.animate(keyframesClose2, options);
    }, false);

    caption.addEventListener('closeCaption', () => {
      close1.animate(keyframesOpen1, options);
      close2.animate(keyframesOpen2, options);
    }, false);
  });
});
