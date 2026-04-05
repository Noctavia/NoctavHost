# 🌙 NoctavHosting — Site Web

Site vitrine complet pour votre hébergeur, avec système de crédits PayPal.

## 📁 Structure

```
noctavhosting/
├── index.html          ← Page d'accueil
├── pricing.html        ← Tarifs + boutons PayPal
├── panel.html          ← Lien vers le panel Pterodactyl
├── contact.html        ← Formulaire de contact
├── css/
│   ├── style.css       ← Styles principaux
│   └── animations.css  ← Animations et keyframes
├── js/
│   ├── main.js         ← Cursor, scroll reveal, nav
│   ├── particles.js    ← Réseau de particules animé
│   └── payment.js      ← Intégration PayPal
└── README.md
```

---

## ⚙️ Configuration requise

### 1. PayPal (obligatoire pour les paiements)

1. Va sur https://developer.paypal.com
2. Crée une application **Live**
3. Copie ton **Client ID**
4. Ouvre `js/payment.js` et remplace :
   ```js
   const PAYPAL_CLIENT_ID = 'TON_PAYPAL_CLIENT_ID_ICI';
   const PAYPAL_EMAIL     = 'ton-email@paypal.com';
   ```

### 2. URL du panel

Une fois que tu as un domaine public, ouvre `js/payment.js` et `panel.html` et remplace :
```js
const PANEL_URL = 'http://monserveur.ddns.net'; // ou ton vrai domaine
```

### 3. Lien Discord

Dans `contact.html`, remplace :
```html
<a href="https://discord.gg/VotreServeur" ...>
```

### 4. Email de contact

Dans `contact.html`, remplace :
```html
<a href="mailto:contact@noctavhosting.fr" ...>
```

### 5. Formulaire de contact (optionnel)

Pour recevoir les messages du formulaire par email, inscris-toi sur https://formspree.io (gratuit) et suis les instructions dans `contact.html`.

---

## 🚀 Mise en ligne sur ta VM

```bash
# Copie le dossier sur la VM
scp -r noctavhosting/ vboxuser@192.168.1.161:/var/www/

# Configure Nginx
sudo nano /etc/nginx/sites-available/noctavhosting.conf
```

Config Nginx :
```nginx
server {
    listen 80;
    server_name _;
    root /var/www/noctavhosting;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/noctavhosting.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

## 💳 Système de crédits

| Plan     | Crédits | Prix   | Renouvellement  |
|----------|---------|--------|-----------------|
| Gratuit  | 0       | 0€     | Tous les 4 jours|
| Starter  | 150     | 2.99€  | Mensuel         |
| Pro      | 200     | 3.99€  | Mensuel         |
| Advanced | 400     | 6.99€  | Mensuel         |
| Expert   | 600     | 9.99€  | Mensuel         |

---

Made with ❤️ by Kylia — NoctavHosting 2026
