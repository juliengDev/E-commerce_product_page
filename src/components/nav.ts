const menuToggle = document.getElementById('menu') as HTMLInputElement | null;
const mobileNav = document.getElementById('mobile-nav') as HTMLElement | null;

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('change', (e: Event) => {
    const target = e.target as HTMLInputElement;
    const isExpanded: boolean = target.checked;
    
    target.setAttribute('aria-expanded', String(isExpanded));
    target.setAttribute('aria-pressed', String(isExpanded));
    mobileNav.setAttribute('aria-hidden', String(!isExpanded));
  });
}

