# Demo enquiry email (bina password)

Local testing ke liye **Gmail App Password ki zaroorat nahi**. Backend automatically **Ethereal** test mail use karta hai.

## Apne phone aur email se test (2 tareeke)

### Tareeka A — Demo (abhi, password nahi) — email **preview link** par

1. Backend + frontend chalao (`npm run dev` dono folders mein).
2. Browser: http://localhost:3000/contact
3. Form mein **apna asli data** bharo, jaise:
   - Name: apna naam  
   - Email: `mol400177@gmail.com` (ya koi bhi test email)  
   - WhatsApp: apna 10-digit number, jaise `9876543210`  
   - Subject: `Goa trip test`  
   - Message: kam se kam 10 characters  
4. **Send Message** dabao.
5. **Backend terminal** mein ye line dhundo:

   `[mail] Enquiry email preview (dev): https://ethereal.email/message/...`

6. Woh **link browser mein kholo** — email mein aapka **phone + email + message** dikhega.  
   (Ye link Gmail inbox mein nahi jati; sirf preview hai.)

**Admin panel check:** http://localhost:3000/admin/enquiries — wahan bhi enquiry save dikhegi.

---

### Tareeka B — Asli Gmail inbox (apne phone par notification + email)

`.env` mein ye set karo (apna Gmail + **App Password**, normal password nahi):

```env
ENQUIRY_NOTIFY_EMAIL="mol400177@gmail.com"
MAIL_FROM="Happy Feet Travellers <mol400177@gmail.com>"

SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="mol400177@gmail.com"
SMTP_PASS="xxxx xxxx xxxx xxxx"

SMTP_DEV_ETHEREAL=false
SMTP_VERIFY_ON_START=true
```

1. Google → Security → 2-Step ON → **App passwords** → 16-char password copy → `SMTP_PASS` mein paste.  
2. Backend **restart** (`Ctrl+C`, phir `npm run dev`).  
3. Log: `[mail] SMTP connection verified`  
4. Contact form dubara apne phone/email se submit karo.  
5. **mol400177@gmail.com** inbox (aur Spam) check karo — subject: **New Travel Enquiry Received**.

Phone par SMS nahi jata — sirf email + admin panel; WhatsApp ke liye alag integration chahiye hoti hai.

## Quick test

```bash
cd backend
npm run demo:email
```

Terminal mein **preview link** aayegi — browser mein kholo, poori enquiry email dikhegi.

## Contact form test

1. `npm run dev` (backend)
2. Site: http://localhost:3000/contact
3. Form submit karo
4. Backend terminal mein line dekho:

   `[mail] Enquiry email preview (dev): https://ethereal.email/message/...`

5. Link copy karke browser mein open karo

## `.env` demo settings

| Variable | Demo value |
|----------|------------|
| `ENQUIRY_NOTIFY_EMAIL` | Jahan lead dikhni chahiye (label only in dev preview) |
| `SMTP_HOST` | **Khali** rakho |
| `SMTP_PASS` | **Khali** rakho |
| `SMTP_DEV_ETHEREAL` | `true` |

## Real Gmail inbox (baad mein)

Jab production/demo se real email chahiye:

```env
ENQUIRY_NOTIFY_EMAIL="aapka@gmail.com"
SMTP_HOST="smtp.gmail.com"
SMTP_USER="aapka@gmail.com"
SMTP_PASS="google-app-password-16-chars"
SMTP_DEV_ETHEREAL=false
```
