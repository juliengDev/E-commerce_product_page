const toastContainer = document.querySelector('.toast-container') as HTMLDivElement | null;

export default function generateToast(message : string){
  if(toastContainer) {

    toastContainer.insertAdjacentHTML('beforeend', `<p class="toast font-bold rounded bg-accent bkg">${message}</p>`);
    const toast = toastContainer.lastElementChild;
    if(toast) {
      toast.addEventListener('animationend', () => toast.remove(), {once: true});
    }
  }
}