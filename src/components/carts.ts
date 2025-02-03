import generateToast from './toast.ts';

const amtBtns = document.querySelectorAll<HTMLButtonElement>('.amt');
const qtyEl = document.getElementById('qty') as HTMLSpanElement | null;
const cartPanelEl = document.querySelector('#cartPanel') as HTMLDivElement | null;
const cartBtnEl = document.getElementById('cartBtn') as HTMLButtonElement | null;
const cartBody = document.querySelector('#cart__body') as HTMLDivElement | null;
const checkoutBtnEl = document.getElementById('checkout') as HTMLButtonElement | null;
const cartIndicator = document.querySelector('#cartIndicator') as HTMLSpanElement | null;
let amt = 0;
let total = 0;

const checkoutState = {
  'default': `<div></div>
        <p class="alt-bkg1 font-bold">Your cart is empty</p>
        <div></div>`,
  'items' : 
    `<div class="cart__body--content flex gap-1">
      <div class="cart__body--content-description flex gap-1">
        <img class="cart__img" src="/images/image-product-1-thumbnail.jpg" alt="Shoes">
            <div class=" cart__description grid alt-bkg1">
              <p class="product--name">Fall Limited Edition Sneakers</p>
              <p class="product--amt flex">
                <span>$125.00</span>
                <span>&times;</span>
                <span id="amt">3</span>
                <span id="total" class="text font-bold">$375</span>
              </p>
            </div>
          </div>
          <button id="trash" aria-label="Remove product from cart">
            <svg width="14" height="16" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <defs>
                <path
                  d="M0 2.625V1.75C0 1.334.334 1 .75 1h3.5l.294-.584A.741.741 0 0 1 5.213 0h3.571a.75.75 0 0 1 .672.416L9.75 1h3.5c.416 0 .75.334.75.75v.875a.376.376 0 0 1-.375.375H.375A.376.376 0 0 1 0 2.625Zm13 1.75V14.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 1 14.5V4.375C1 4.169 1.169 4 1.375 4h11.25c.206 0 .375.169.375.375ZM4.5 6.5c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Z"
                  id="a" />
              </defs>
              <use fill="#C3CAD9" fill-rule="nonzero" xlink:href="#a" />
            </svg>
          </button>
        </div>
        <button class="cart__body--btn rounded accent-pale bg-accent fs-2 font-bold">Checkout
        </button>
      </div>`
}

function initializeCart() {
  if (cartIndicator) {
    cartIndicator.textContent = null;
    cartIndicator.classList.remove('active');
  }
  if (cartBody) {
    cartBody.innerHTML = checkoutState.default;
  }
}

const toggleCart = () => {
  if (!cartBtnEl || !cartPanelEl) return;

  const isCurrentlyHidden = cartPanelEl.classList.contains('hidden');

  if (isCurrentlyHidden) {
    cartPanelEl.classList.remove('hidden');
    cartBtnEl.setAttribute('aria-expanded', 'true');
    cartPanelEl.setAttribute('aria-hidden', 'false');
  } else {
    cartPanelEl.classList.add('hidden');
    cartBtnEl.setAttribute('aria-expanded', 'false');
    cartPanelEl.setAttribute('aria-hidden', 'true');
  }
};

function updateCartState(){
  if(cartBody && cartIndicator) {  
    if(amt === 0){
      cartBody.innerHTML = checkoutState.default;
      cartIndicator.textContent = null;
      cartIndicator.classList.remove('active');
    } else {
      total += amt;
    cartBody.innerHTML = checkoutState.items;
    const PRICE = 125;
    const productAmt = document.querySelector('#amt');
    const productTotal = document.querySelector('#total');
    if (productAmt && cartIndicator && productTotal) {
      productAmt.textContent = total.toString();
      cartIndicator.textContent = total.toString();
      cartIndicator.classList.add('active');
      productTotal.textContent = `$${total * PRICE}.00`;

      const cartButton = document.querySelector('.cart__body--btn') as HTMLElement | null;

      if (cartButton) {       
        cartButton.textContent = `Checkout (${`$${total * PRICE}.00`})`;
      } else {
        console.error('Cart button element not found!');
      }

      generateToast(`${amt} added to cart`)
    }
    }
  }
}

function handleAmtBtnClick(e: Event){

  const target = e.currentTarget as HTMLButtonElement | null;
  if (!target) return;

  if(target.id === 'amt--decrease'){
    amt === 0 ? target : amt--;
  } else {
    amt++;
  }
  if (qtyEl) {

    qtyEl.textContent = amt.toString();
  }
  const amtDecreaseBtn = document.querySelector('#amt--decrease') as HTMLButtonElement | null;
   if(amtDecreaseBtn) {
   
    if(amt === 0){
      amtDecreaseBtn.setAttribute('disabled', 'true');
      amtDecreaseBtn.classList.remove('accent');
      amtDecreaseBtn.classList.add('alt-bkg2');
    } else {
      amtDecreaseBtn.removeAttribute('disabled');
      amtDecreaseBtn.classList.remove('alt-bkg2');
      amtDecreaseBtn.classList.add('accent');
    }
  }
}



amtBtns.forEach(b => b.addEventListener('click', handleAmtBtnClick));

if (cartBtnEl) {
  cartBtnEl.addEventListener('click', toggleCart);
}

if(checkoutBtnEl ) {
  checkoutBtnEl.addEventListener('click',()=> {
    if(qtyEl) {
    amt = Number(qtyEl.textContent);
    updateCartState();
    }
  })
}

if(cartPanelEl) {
  cartPanelEl.addEventListener('click', (e) => {
    e.currentTarget === e.target && toggleCart();
    if(e.target === document.querySelector('#trash')){
      amt = 0;
      total = 0;
      updateCartState();
      generateToast('Items removed from cart.')
    }
  });
}


document.addEventListener('DOMContentLoaded', initializeCart);



