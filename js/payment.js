/**
 * NoctavHosting — Payment System
 * Paiement via PayPal.me (lien direct, sans API)
 */

const PAYPAL_ME   = 'https://paypal.me/NoctaviaUHQ';
const PANEL_URL   = 'https://adenological-sana-unexhaustedly.ngrok-free.dev';

// Table des packs de crédits
const CREDIT_PACKS = [
  { id: 'pack_150',  credits: 150, price: '2.99',  label: 'Starter',  color: '#6c5ce7', popular: false },
  { id: 'pack_200',  credits: 200, price: '3.99',  label: 'Pro',      color: '#00cec9', popular: true  },
  { id: 'pack_400',  credits: 400, price: '6.99',  label: 'Advanced', color: '#a29bfe', popular: false },
  { id: 'pack_600',  credits: 600, price: '9.99',  label: 'Expert',   color: '#fd79a8', popular: false },
];

function getPayPalLink(price) {
  return `${PAYPAL_ME}/${price}EUR`;
}

function renderPayPalButton(containerId, credits, price, label) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <a 
      href="${getPayPalLink(price)}" 
      target="_blank" 
      rel="noopener noreferrer"
      onclick="handlePayPalClick(event, ${credits}, '${price}', '${label}')"
      style="
        display:flex;align-items:center;justify-content:center;gap:0.5rem;
        background:#FFC439;color:#111;font-weight:700;font-size:0.95rem;
        padding:0.75rem 1.5rem;border-radius:8px;text-decoration:none;
        transition:transform 0.15s,box-shadow 0.15s;
        box-shadow:0 2px 12px rgba(255,196,57,0.3);width:100%;box-sizing:border-box;
      "
      onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 20px rgba(255,196,57,0.5)'"
      onmouseout="this.style.transform='';this.style.boxShadow='0 2px 12px rgba(255,196,57,0.3)'"
    >
      <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" alt="PayPal" style="height:22px;border-radius:3px;" />
      Payer ${price}€ avec PayPal
    </a>
    <p style="text-align:center;color:var(--muted);font-size:0.75rem;margin-top:0.5rem;">
      Tu seras redirigé vers PayPal.me · Paiement sécurisé
    </p>
  `;
}

function handlePayPalClick(event, credits, price, label) {
  setTimeout(() => {
    showToast('💳 Après ton paiement de ' + price + '€, contacte-nous sur Discord avec ta transaction pour recevoir tes ' + credits + ' crédits !', 'info', 8000);
  }, 300);
}

function showToast(message, type, duration) {
  duration = duration || 4000;
  const colors = { success: '#00b894', error: '#d63031', info: '#6c5ce7' };
  const toast = document.createElement('div');
  toast.style.cssText = 'position:fixed;bottom:2rem;right:2rem;z-index:9999;background:' + (colors[type] || colors.info) + ';color:#fff;padding:1rem 1.5rem;border-radius:12px;font-size:0.9rem;max-width:360px;line-height:1.5;box-shadow:0 4px 24px rgba(0,0,0,0.3);';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

function initPricingButtons() {
  CREDIT_PACKS.forEach(pack => {
    const containerId = 'paypal-btn-' + pack.id;
    if (document.getElementById(containerId)) {
      renderPayPalButton(containerId, pack.credits, pack.price, pack.label);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.pricing-page')) {
    initPricingButtons();
  }
});

window.NoctavPayment = { renderPayPalButton, initPricingButtons, CREDIT_PACKS, getPayPalLink };