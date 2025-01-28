interface SliderElements {
  mainSlider: HTMLElement;
  lightbox: HTMLElement;
  lightboxSlide: HTMLImageElement;
  lightboxThumbnails: NodeListOf<HTMLImageElement>;
  closeLightbox: HTMLButtonElement;
  lightboxPrev: HTMLButtonElement;
  lightboxNext: HTMLButtonElement;
  lightboxDialog: HTMLElement;
  lightboxStatus: HTMLElement;
}

class AccessibleLightboxSlider {
  private elements: SliderElements;
  private currentIndex: number;
  private readonly images: string[];
  private previousFocus: HTMLElement | null;

  constructor() {
    this.currentIndex = 0;
    this.previousFocus = null;
    this.images = [
      './images/image-product-1.jpg',
      './images/image-product-2.jpg',
      './images/image-product-3.jpg',
      './images/image-product-4.jpg'
    ];

    this.elements = this.initializeElements();
    this.initializeEventListeners();
  }

  private initializeElements(): SliderElements {
    // Initialisation des éléments avec vérification d'existence
    const mainSlider = document.querySelector('.slider') as HTMLElement;
    if (!mainSlider) throw new Error('Main slider element not found');

    const lightbox = document.querySelector('.lightbox') as HTMLElement;
    if (!lightbox) throw new Error('Lightbox element not found');

    // Ajout d'attributs ARIA pour le dialogue
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Image lightbox');

    // Création d'un élément pour les annonces live
    const statusElement = document.createElement('div');
    statusElement.className = 'sr-only';
    statusElement.setAttribute('role', 'status');
    statusElement.setAttribute('aria-live', 'polite');
    lightbox.appendChild(statusElement);

    return {
      mainSlider,
      lightbox,
      lightboxSlide: document.querySelector('.lightbox__slide') as HTMLImageElement,
      lightboxThumbnails: document.querySelectorAll('.lightbox__thumbnail'),
      closeLightbox: document.querySelector('.lightbox__close') as HTMLButtonElement,
      lightboxPrev: document.querySelector('.lightbox__btn--left') as HTMLButtonElement,
      lightboxNext: document.querySelector('.lightbox__btn--right') as HTMLButtonElement,
      lightboxDialog: document.querySelector('.lightbox__slider') as HTMLElement,
      lightboxStatus: statusElement
    };
  }

  private initializeEventListeners(): void {
    // Ajouter des gestionnaires d'événements accessibles pour le slider principal
    this.elements.mainSlider.querySelectorAll('.slide').forEach((slide: Element, index: number) => {
      if (slide instanceof HTMLElement) {
        slide.setAttribute('role', 'button');
        slide.setAttribute('aria-label', `View image ${index + 1} of ${this.images.length}`);
        slide.setAttribute('tabindex', '0');
        
        slide.addEventListener('click', () => this.openLightbox(index));
        slide.addEventListener('keydown', (e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.openLightbox(index);
          }
        });
      }
    });

    // Navigation au clavier dans la lightbox
    this.elements.lightbox.addEventListener('keydown', (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          this.closeLightbox();
          break;
        case 'ArrowLeft':
          this.navigateImages('prev');
          break;
        case 'ArrowRight':
          this.navigateImages('next');
          break;
        case 'Tab':
          this.manageFocusTrap(e);
          break;
      }
    });

    // Boutons de navigation
    this.elements.lightboxPrev.addEventListener('click', () => this.navigateImages('prev'));
    this.elements.lightboxNext.addEventListener('click', () => this.navigateImages('next'));
    this.elements.closeLightbox.addEventListener('click', () => this.closeLightbox());

    // Gestion des thumbnails
    this.elements.lightboxThumbnails.forEach((thumbnail: HTMLImageElement, index: number) => {
      thumbnail.setAttribute('role', 'button');
      thumbnail.setAttribute('aria-label', `Select image ${index + 1}`);
      thumbnail.setAttribute('tabindex', '0');
      
      thumbnail.addEventListener('click', () => this.selectImage(index));
      thumbnail.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectImage(index);
        }
      });
    });
  }

  private openLightbox(index: number): void {
    this.previousFocus = document.activeElement as HTMLElement;
    this.currentIndex = index;
    this.elements.lightbox.classList.remove('hidden');
    this.updateLightboxImage();
    
    // Focus sur le premier élément focusable
    setTimeout(() => {
      this.elements.closeLightbox.focus();
    }, 100);

    // Annoncer l'ouverture aux lecteurs d'écran
    this.updateAriaStatus(`Lightbox opened, displaying image ${index + 1} of ${this.images.length}`);
  }

  private closeLightbox(): void {
    this.elements.lightbox.classList.add('hidden');
    
    // Restaurer le focus
    if (this.previousFocus) {
      this.previousFocus.focus();
    }

    this.updateAriaStatus('Lightbox closed');
  }

  private navigateImages(direction: 'prev' | 'next'): void {
    if (direction === 'prev' && this.currentIndex > 0) {
      this.currentIndex--;
    } else if (direction === 'next' && this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
    }
    this.updateLightboxImage();
  }

  private selectImage(index: number): void {
    this.currentIndex = index;
    this.updateLightboxImage();
  }

  private updateLightboxImage(): void {
    // Mettre à jour l'image
    this.elements.lightboxSlide.src = this.images[this.currentIndex];
    this.elements.lightboxSlide.alt = `Image ${this.currentIndex + 1} of ${this.images.length}`;
    
    // Mettre à jour les thumbnails
    this.elements.lightboxThumbnails.forEach((thumb: HTMLImageElement, index: number) => {
      const isActive = index === this.currentIndex;
      thumb.classList.toggle('active', isActive);
      thumb.setAttribute('aria-pressed', isActive.toString());
    });

    // Mise à jour des états des boutons
    this.updateNavigationButtons();

    // Annoncer le changement d'image aux lecteurs d'écran
    this.updateAriaStatus(`Image ${this.currentIndex + 1} of ${this.images.length}`);
  }

  private updateNavigationButtons(): void {
    // Mise à jour du bouton précédent
    this.elements.lightboxPrev.classList.toggle('hidden', this.currentIndex === 0);
    this.elements.lightboxPrev.setAttribute('aria-hidden', (this.currentIndex === 0).toString());
    this.elements.lightboxPrev.disabled = this.currentIndex === 0;

    // Mise à jour du bouton suivant
    this.elements.lightboxNext.classList.toggle('hidden', this.currentIndex === this.images.length - 1);
    this.elements.lightboxNext.setAttribute('aria-hidden', (this.currentIndex === this.images.length - 1).toString());
    this.elements.lightboxNext.disabled = this.currentIndex === this.images.length - 1;
  }

  private manageFocusTrap(e: KeyboardEvent): void {
    const focusableElements = this.elements.lightboxDialog.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  private updateAriaStatus(message: string): void {
    this.elements.lightboxStatus.textContent = message;
  }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  new AccessibleLightboxSlider();
});