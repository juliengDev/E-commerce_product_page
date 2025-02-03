const btns: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.slider__container__btn');
const sliderContainer: HTMLElement | null = document.querySelector('.slider__container');
const slider: HTMLElement | null = document.querySelector('.sliderEl');
const slide: HTMLElement[] = Array.from(document.querySelectorAll('.slide'));
const thumbnails: HTMLElement[] = Array.from(document.querySelectorAll('.thumbnail'));
let currentIndex: number = 0; 


function updateThumbnailsState(activeIndex: number): void {
  thumbnails.forEach((thumb, index) => {
    if (index === activeIndex) {
      thumb.classList.add('active');
      thumb.style.opacity = '0.5';
      thumb.style.border = "2px solid #ff7d1a";
    } else {
      thumb.classList.remove('active');
      thumb.style.opacity = '1';
      thumb.style.border = "none"
    }
  });
}

function goToSlide(index: number): void {
  if (!slider || index < 0 || index >= slide.length) return;
  
  currentIndex = index;
  slider.style.transform = `translateX(-${100 * currentIndex}%)`;
  
  const prevBtn = document.querySelector('#prev') as HTMLButtonElement;
  const nextBtn = document.querySelector('#next') as HTMLButtonElement;
  
  prevBtn.classList.toggle('hidden', currentIndex === 0);
  nextBtn.classList.toggle('hidden', currentIndex === slide.length - 1);
  
  updateThumbnailsState(currentIndex);
}

function handleThumbnailClick(e: Event): void {
  const target = e.currentTarget as HTMLElement;
  const index = thumbnails.indexOf(target);
  if (index !== -1) {
    goToSlide(index);
  }
}

thumbnails.forEach((thumbnail) => {
  thumbnail.addEventListener('click', handleThumbnailClick);
});

function moveSlider(dir: 'next' | 'prev'): void {
  if (!slider || !sliderContainer) return;

  dir === 'next' ? currentIndex++ : currentIndex--;
  slider.style.transform = `translateX(-${100 * currentIndex}%)`;

  
  switch (currentIndex) {
    case 0:
      (document.querySelector('#prev') as HTMLButtonElement)?.classList.add('hidden');
      break;
    case slide.length - 1:
      (document.querySelector('#next') as HTMLButtonElement)?.classList.add('hidden');
      break;
    default:
      btns.forEach((b) => b.classList.remove('hidden'));
      break;
  }

  
  updateThumbnailsState(currentIndex);
}


function handleBtnClick(e: Event): void {
  const target = e.currentTarget as HTMLButtonElement;
  if (target.id === "next") {
    moveSlider('next');
  } else if (target.id === "prev") {
    moveSlider('prev');
  }
}

btns.forEach((b) => {
  b.addEventListener('click', handleBtnClick);
});


