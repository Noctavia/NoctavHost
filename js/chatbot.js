/**
 * NoctavHosting — Chatbot Support Widget
 * Injecte un chatbot flottant sur toutes les pages
 */

(function() {
  // ── STYLES ──────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #noctav-chat-btn {
      position: fixed; bottom: 2rem; right: 2rem;
      width: 54px; height: 54px;
      background: linear-gradient(135deg, #6c5ce7, #00cec9);
      border-radius: 50%; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 8px 32px rgba(108,92,231,0.45);
      z-index: 9000;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #noctav-chat-btn:hover { transform: scale(1.08); box-shadow: 0 12px 40px rgba(108,92,231,0.6); }
    #noctav-chat-btn svg { width: 22px; height: 22px; color: #fff; }
    #noctav-chat-btn .chat-notif {
      position: absolute; top: -2px; right: -2px;
      width: 14px; height: 14px; background: #fd79a8;
      border-radius: 50%; border: 2px solid #03030a;
      animation: pulse-anim 2s infinite;
    }

    #noctav-chat-box {
      position: fixed; bottom: 6.5rem; right: 2rem;
      width: 360px; max-height: 540px;
      background: #0a0a14;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
      box-shadow: 0 24px 80px rgba(0,0,0,0.7);
      z-index: 9001;
      display: none; flex-direction: column;
      overflow: hidden;
      font-family: 'DM Sans', sans-serif;
      animation: slideUp 0.25s ease;
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(16px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    #noctav-chat-box.open { display: flex; }

    .chat-header {
      padding: 1.1rem 1.25rem;
      background: linear-gradient(135deg, rgba(108,92,231,0.12), rgba(0,206,201,0.06));
      border-bottom: 1px solid rgba(255,255,255,0.06);
      display: flex; align-items: center; gap: 0.75rem;
    }
    .chat-header-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: linear-gradient(135deg, #6c5ce7, #00cec9);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .chat-header-avatar svg { width: 17px; height: 17px; color: #fff; }
    .chat-header-info { flex: 1; }
    .chat-header-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.92rem; color: #dcd8ff; }
    .chat-header-status { font-size: 0.72rem; color: #6e6a9a; display: flex; align-items: center; gap: 0.35rem; margin-top: 1px; }
    .chat-header-status::before { content:''; width:6px;height:6px;background:#00b894;border-radius:50%;display:inline-block; }
    .chat-close { background: none; border: none; color: #6e6a9a; cursor: pointer; padding: 0.25rem; border-radius: 6px; transition: color 0.2s; display: flex; }
    .chat-close:hover { color: #dcd8ff; }
    .chat-close svg { width: 16px; height: 16px; }

    .chat-messages {
      flex: 1; overflow-y: auto; padding: 1.1rem;
      display: flex; flex-direction: column; gap: 0.75rem;
      max-height: 360px;
    }
    .chat-messages::-webkit-scrollbar { width: 4px; }
    .chat-messages::-webkit-scrollbar-track { background: transparent; }
    .chat-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }

    .msg { display: flex; flex-direction: column; max-width: 80%; }
    .msg.bot { align-self: flex-start; }
    .msg.user { align-self: flex-end; align-items: flex-end; }

    .msg-bubble {
      padding: 0.65rem 0.9rem;
      border-radius: 12px;
      font-size: 0.85rem;
      line-height: 1.55;
    }
    .msg.bot  .msg-bubble { background: #0f0f1c; border: 1px solid rgba(255,255,255,0.06); color: #dcd8ff; border-bottom-left-radius: 4px; }
    .msg.user .msg-bubble { background: #6c5ce7; color: #fff; border-bottom-right-radius: 4px; }

    .msg-time { font-size: 0.68rem; color: #6e6a9a; margin-top: 0.25rem; padding: 0 0.2rem; }

    .chat-suggestions {
      padding: 0 1.1rem 0.75rem;
      display: flex; flex-wrap: wrap; gap: 0.4rem;
    }
    .chat-suggestion {
      background: rgba(108,92,231,0.1); border: 1px solid rgba(108,92,231,0.2);
      color: #6c5ce7; padding: 0.3rem 0.75rem;
      border-radius: 99px; font-size: 0.75rem; cursor: pointer;
      transition: all 0.15s; white-space: nowrap;
    }
    .chat-suggestion:hover { background: rgba(108,92,231,0.2); color: #dcd8ff; }

    .chat-input-row {
      padding: 0.85rem 1rem;
      border-top: 1px solid rgba(255,255,255,0.06);
      display: flex; gap: 0.5rem;
    }
    .chat-input {
      flex: 1; background: #0f0f1c; border: 1px solid rgba(255,255,255,0.08);
      color: #dcd8ff; padding: 0.6rem 0.9rem;
      border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 0.87rem;
      outline: none; transition: border-color 0.2s;
    }
    .chat-input:focus { border-color: #6c5ce7; }
    .chat-input::placeholder { color: #6e6a9a; }
    .chat-send {
      width: 36px; height: 36px; border-radius: 8px;
      background: #6c5ce7; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s; flex-shrink: 0;
    }
    .chat-send:hover { background: #5a4bd1; }
    .chat-send svg { width: 15px; height: 15px; color: #fff; }

    .typing-indicator { display: flex; gap: 4px; align-items: center; padding: 0.5rem 0; }
    .typing-dot { width: 6px; height: 6px; border-radius: 50%; background: #6e6a9a; animation: typing-bounce 1.2s infinite; }
    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typing-bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }

    @media (max-width: 420px) {
      #noctav-chat-box { width: calc(100vw - 2rem); right: 1rem; bottom: 5.5rem; }
      #noctav-chat-btn { bottom: 1.25rem; right: 1.25rem; }
    }
  `;
  document.head.appendChild(style);

  // ── HTML ──────────────────────────────────────────────────
  const btn = document.createElement('button');
  btn.id = 'noctav-chat-btn';
  btn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    <div class="chat-notif"></div>
  `;

  const box = document.createElement('div');
  box.id = 'noctav-chat-box';
  box.innerHTML = `
    <div class="chat-header">
      <div class="chat-header-avatar">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
      </div>
      <div class="chat-header-info">
        <div class="chat-header-name">Nocty — Support</div>
        <div class="chat-header-status">En ligne · Répond instantanément</div>
      </div>
      <button class="chat-close" id="chat-close-btn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    </div>
    <div class="chat-messages" id="chat-messages"></div>
    <div class="chat-suggestions" id="chat-suggestions"></div>
    <div class="chat-input-row">
      <input class="chat-input" id="chat-input" placeholder="Pose ta question..." autocomplete="off"/>
      <button class="chat-send" id="chat-send-btn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
      </button>
    </div>
  `;

  document.body.appendChild(btn);
  document.body.appendChild(box);

  // ── DATA ──────────────────────────────────────────────────
  const SUGGESTIONS = ['Voir les tarifs', 'Activer mon serveur', 'Problème de connexion', 'Contacter l\'équipe'];

  const KB = [
    { keys: ['tarif','prix','plan','offre','coût','combien'],
      answer: 'Nos plans vont de **0€** (Gratuit) à **9,99€/mois** (Expert). Découvre tous les détails sur notre <a href="pricing.html" style="color:#6c5ce7;text-decoration:none;">page Tarifs</a> ! Les paiements se font via PayPal, de façon sécurisée.' },
    { keys: ['activer','activation','délai','24h','paiement'],
      answer: 'Après ton paiement PayPal, **contacte-nous sur Discord** avec ta preuve de paiement. Ton serveur est activé manuellement en moins de 24h, souvent bien plus vite !' },
    { keys: ['panel','pyrodactyl','pterodactyl','accès','connecter'],
      answer: 'Le panel est accessible sur notre <a href="panel.html" style="color:#6c5ce7;text-decoration:none;">page Panel</a>. Connecte-toi avec les identifiants reçus par email après l\'activation de ton compte.' },
    { keys: ['discord','serveur','communauté','rejoindre'],
      answer: 'Notre Discord est le canal principal de support ! Tu peux le rejoindre via la <a href="contact.html" style="color:#6c5ce7;text-decoration:none;">page Contact</a>. On répond généralement en moins d\'une heure.' },
    { keys: ['remboursement','rembourser','retour'],
      answer: 'Les remboursements sont possibles dans les **7 jours** suivant l\'achat. Contacte-nous sur Discord ou par email et on s\'en occupe rapidement.' },
    { keys: ['minecraft','mc','java','bedrock','serveur'],
      answer: 'Minecraft Java et Bedrock sont tous les deux supportés dès le plan **Starter** ! Déployable en quelques clics depuis le panel Pyrodactyl.' },
    { keys: ['bot','discord','python','node','java'],
      answer: 'On supporte les bots en **Node.js, Python et Java** ! Tous les plans payants incluent l\'hébergement de bots. Le plan Pro permet jusqu\'à 3 serveurs simultanés.' },
    { keys: ['fivem','gta','roleplay','rp'],
      answer: 'FiveM est disponible à partir du plan **Starter**. Le plan Advanced (6,99€/mois) offre suffisamment de ressources pour une communauté RP confortable.' },
    { keys: ['statut','status','panne','down','problème','bug'],
      answer: 'Vérifie l\'état de nos services en temps réel sur notre <a href="status.html" style="color:#6c5ce7;text-decoration:none;">page Statut</a>. Si tu constates un problème non répertorié, contacte-nous sur Discord !' },
    { keys: ['ddos','protection','attaque','sécurité'],
      answer: 'Tous nos serveurs bénéficient d\'une **protection DDoS incluse**. Chaque serveur tourne dans un container Docker isolé pour garantir sécurité et stabilité.' },
    { keys: ['gratuit','free','essai','tester'],
      answer: 'Oui, on a un **plan gratuit** avec 308 Mo de RAM et 716 Mo NVMe — sans carte bancaire ! Parfait pour tester. Crée ton compte directement depuis la page d\'accueil.' },
    { keys: ['contact','email','aide','support','question'],
      answer: 'Tu peux nous joindre via notre <a href="contact.html" style="color:#6c5ce7;text-decoration:none;">page Contact</a>, par email ou sur Discord. On répond en général sous 24h par email, et bien plus vite sur Discord !' },
  ];

  // ── LOGIC ──────────────────────────────────────────────────
  const msgContainer = document.getElementById('chat-messages');
  const sugContainer = document.getElementById('chat-suggestions');
  const input = document.getElementById('chat-input');
  let opened = false;

  function getTime() {
    return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  function addMsg(text, role = 'bot') {
    const msg = document.createElement('div');
    msg.className = 'msg ' + role;
    msg.innerHTML = `
      <div class="msg-bubble">${text}</div>
      <div class="msg-time">${getTime()}</div>
    `;
    msgContainer.appendChild(msg);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'msg bot';
    el.id = 'typing-msg';
    el.innerHTML = `<div class="msg-bubble"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;
    msgContainer.appendChild(el);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  function hideTyping() {
    const el = document.getElementById('typing-msg');
    if (el) el.remove();
  }

  function findAnswer(query) {
    const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    for (const entry of KB) {
      if (entry.keys.some(k => q.includes(k))) return entry.answer;
    }
    return null;
  }

  function respond(query) {
    showTyping();
    setTimeout(() => {
      hideTyping();
      const ans = findAnswer(query);
      if (ans) {
        addMsg(ans);
      } else {
        addMsg('Je ne suis pas sûr de pouvoir répondre à ça précisément. Tu peux <a href="contact.html" style="color:#6c5ce7;text-decoration:none;">nous contacter</a> ou rejoindre notre Discord pour une aide humaine !');
      }
      showSuggestions();
    }, 800 + Math.random() * 400);
  }

  function showSuggestions() {
    sugContainer.innerHTML = '';
    SUGGESTIONS.forEach(s => {
      const btn = document.createElement('button');
      btn.className = 'chat-suggestion';
      btn.textContent = s;
      btn.onclick = () => {
        sugContainer.innerHTML = '';
        addMsg(s, 'user');
        respond(s);
      };
      sugContainer.appendChild(btn);
    });
  }

  function sendMsg() {
    const val = input.value.trim();
    if (!val) return;
    sugContainer.innerHTML = '';
    addMsg(val, 'user');
    input.value = '';
    respond(val);
  }

  // ── EVENTS ──────────────────────────────────────────────────
  btn.addEventListener('click', () => {
    box.classList.toggle('open');
    // Remove notif dot
    const notif = btn.querySelector('.chat-notif');
    if (notif) notif.remove();

    if (!opened) {
      opened = true;
      setTimeout(() => {
        addMsg('Salut ! Je suis **Nocty**, l\'assistant NoctavHosting. Comment puis-je t\'aider ?');
        showSuggestions();
      }, 300);
    }
  });

  document.getElementById('chat-close-btn').addEventListener('click', () => {
    box.classList.remove('open');
  });

  document.getElementById('chat-send-btn').addEventListener('click', sendMsg);

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') sendMsg();
  });

})();
