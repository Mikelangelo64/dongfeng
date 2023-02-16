document.addEventListener('DOMContentLoaded', function () {
  const isSafari = () => {
    return (
      ~navigator.userAgent.indexOf('Safari') &&
      navigator.userAgent.indexOf('Chrome') < 0
    );
  };

  const isMobile = {
    Android: function () {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
      return navigator.userAgent.match(/Opera mini/i);
    },
    Windows: function () {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
      return (
        isMobile.Android() ||
        isMobile.BlackBerry() ||
        isMobile.iOS() ||
        isMobile.Opera() ||
        isMobile.Windows()
      );
    },
  };

  if (isMobile.any()) {
    document.querySelector('body').classList.add('v-mobile');
    document.querySelector('html').classList.add('v-mobile');
  } else {
    document.querySelector('body').classList.add('v-desk');
    document.querySelector('html').classList.add('v-desk');
  }

  //wow
  const wowAnimation = new WOW({
    // boxClass: 'animate-up',
    // animateClass: 'show',
    //offset: 100,
  });

  wowAnimation.init();

  //normal vh
  const vh = window.innerHeight * 0.01;
  document.body.style.setProperty('--vh', `${vh}px`);

  //change header when scroll
  const header = document.querySelector('.header');
  let isScrollHeader = true;

  header &&
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50 && isScrollHeader) {
        //console.log(1);
        header.classList.add('_scrolled');
        isScrollHeader = false;
        return;
      }

      if (window.scrollY <= 50 && !isScrollHeader) {
        header.classList.remove('_scrolled');
        isScrollHeader = true;
        return;
      }
    });

  //popup
  const makeTimelinePopup = (item) => {
    const popupInner = item.querySelector('.popup__scroll');
    if (!popupInner) {
      return;
    }

    const timelinePopup = gsap.timeline({
      defaults: { duration: 0.6, ease: 'power4.inOut' },
    });
    timelinePopup
      .set(popupInner, { x: '-150%' })
      .set(item, { display: 'none' })
      .to(item, { display: 'flex', duration: 0.01 })
      // .from(popupInner, { x: -100 })
      // .from(item, { opacity: 0 })
      .to(item, { opacity: 1 })
      .to(popupInner, { x: 0 });

    return timelinePopup;
  };

  const popupAnimations = {};
  const popups = document.querySelectorAll('.popup');

  if (Array.from(popups).length !== 0) {
    Array.from(popups).forEach((popup) => {
      const timeline = makeTimelinePopup(popup);
      timeline.pause();
      popupAnimations[popup.dataset.popupname] = timeline;
    });
  }

  //open popup
  const popupOpenBtns = document.querySelectorAll('.popup-open');

  const openPopup = (evt) => {
    const popupClass = evt.target.dataset.popup;
    const popup = document.querySelector(`[data-popupname=${popupClass}]`);

    popupAnimations[popupClass].play();

    popup.classList.add('_opened');
    document.querySelector('html').classList.add('_lock');
    document.querySelector('body').classList.add('_lock');
  };

  if (popupOpenBtns) {
    Array.from(popupOpenBtns).forEach((item) => {
      item.addEventListener('click', (evt) => {
        evt.preventDefault();
        // console.log(popupAnimations);
        openPopup(evt);
      });
    });
  }

  //close popup
  const popupCloseBtns = document.querySelectorAll('.popup__close');
  const popupArr = document.querySelectorAll('.popup');

  const closePopup = (popup) => {
    popup.classList.remove('_opened');
    const popupClass = popup.dataset.popupname;
    //console.dir(popup);
    popupAnimations[popupClass].reverse();

    document.querySelector('html').classList.remove('_lock');
    document.querySelector('body').classList.remove('_lock');
  };

  if (popupCloseBtns) {
    Array.from(popupCloseBtns).forEach((item) => {
      item.addEventListener('click', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        const popup = this.parentElement;
        closePopup(popup);
      });
    });
  }

  if (popupArr) {
    Array.from(popupArr).forEach((item) => {
      item.addEventListener('click', function (evt) {
        //if (evt.target === this) {
        closePopup(this);
        //}
      });
    });

    window.addEventListener('keydown', function (evt) {
      if (evt.keyCode === 27) {
        const popup = document.querySelector('.popup._opened');
        if (popup) {
          closePopup(popup);
        }
      }
    });
  }

  //mouse label on scroll event

  const mouseLabel = document.querySelector('.banner-more');
  let progress = {
    current: 0,
    target: 0,
  };

  function lerp(current, target, ease, approximationLeft = 0.001) {
    const val = current * (1 - ease) + target * ease;
    const diff = Math.abs(target - val);
    if (diff <= approximationLeft) {
      return target;
    }
    return val;
  }

  let idAnimation = null;

  function stopAnimation(idAnimation) {
    cancelAnimationFrame(idAnimation);
  }

  const mouseScroll = (y, mouse) => {
    if (!mouse || y <= 0.2) {
      return;
    }
    if (isMobile.any()) {
      mouse.style.transform = '';
      return;
    }
    progress.target = y - 0.2;
    progress.current = lerp(progress.current, progress.target, 0.15, 0.001);
    mouse.style.transform = `translateY(${progress.current * 100}%)`;

    if (progress.current === progress.target) {
      stopAnimation(idAnimation);
      //}
    } else {
      mouseScroll(progress.target, mouse);
    }
  };

  addEventListener('scroll', (evt) => {
    if (isMobile.any() || !mouseLabel) {
      return;
    }

    const section = mouseLabel.parentElement.parentElement.parentElement;

    const sectionRect = section.getBoundingClientRect();
    const sectionHeight = sectionRect.height;

    const y = Math.min(Math.max(-sectionRect.top / sectionHeight, 0), 1);
    //console.log(y);

    idAnimation = window.requestAnimationFrame(() => {
      mouseScroll(y, mouseLabel);
    });
  });

  //additional image parallax
  // const additionals = document.querySelectorAll('.img-additional__wrapper');
  // const additionalProgressArr = [];
  // additionals.length !== 0 &&
  //   additionals.forEach((additional) => {
  //     const progress = {
  //       current: 0,
  //       target: 0,
  //     };
  //     additionalProgressArr.push(progress);
  //   });

  // const additionalListenerHandler = (additional) => {
  //   if (isMobile.any() || !additional) {
  //     return;
  //   }

  //   //const parent = additional.parentElement.parentElement.parentElement;

  //   const additionalRect = parent.getBoundingClientRect();
  //   const additionalHeight = sectionRect.height;

  //   const y = Math.min(
  //     Math.max(-additionalRect.top / window.innerHeight, 0),
  //     1
  //   );
  //   //console.log(y);

  //   idAnimation = window.requestAnimationFrame(() => {
  //     mouseScroll(y, mouseLabel);
  //   });
  // };

  // const additionalParalaxHandler = (y, additional) => {};

  //swipers
  const swiperGallery = new Swiper('.gallery-slider.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    pagination: {
      el: '.gallery-slider .gallery-slider-pagination',
      clickable: true,
    },
  });
});
