
// Sélection des éléments avec des types
const btns: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.slider__container__btn');
const sliderContainer: HTMLElement | null = document.querySelector('.slider__container');
const slider: HTMLElement | null = document.querySelector('.sliderEl');
const slide: HTMLElement[] = Array.from(document.querySelectorAll('.slide'));
let currentIndex: number = 0; 

// Fonction pour déplacer le slider
function moveSlider(dir: 'next' | 'prev'): void {
  if (!slider || !sliderContainer) return;

  // Calcul de l'index et translation du slider
  dir === 'next' ? currentIndex++ : currentIndex--;
  slider.style.transform = `translateX(-${100 * currentIndex}%)`;

  // Gestion des boutons
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
}

// Gestionnaire d'événement pour les boutons
function handleBtnClick(e: Event): void {
  const target = e.currentTarget as HTMLButtonElement;
  if (target.id === "next") {
    moveSlider('next');
  } else if (target.id === "prev") {
    moveSlider('prev');
  }
}

// Ajout des écouteurs d'événements sur les boutons
btns.forEach((b) => {
  b.addEventListener('click', handleBtnClick);
});