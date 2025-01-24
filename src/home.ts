const qtyEl = document.getElementById('qty') as HTMLSpanElement | null;
const btnDecEl = document.getElementById('amt--decrease') as HTMLButtonElement | null;
const btnIncEl = document.getElementById('amt--increase') as HTMLButtonElement | null;

const updateQuantity = (increment: number): void => {
  if (!qtyEl || qtyEl.textContent === null) return;
  let currentQty = parseInt(qtyEl.textContent, 10);
  currentQty = Math.max(0, currentQty + increment); 
  qtyEl.textContent = currentQty.toString();
};


if (btnDecEl && btnIncEl) {
  btnDecEl.addEventListener('click', () => updateQuantity(-1));
  btnIncEl.addEventListener('click', () => updateQuantity(1));  
}