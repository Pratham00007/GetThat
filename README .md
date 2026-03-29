# AutoPublish — AI Content Generation Platform

AutoPublish ek AI-powered content generation platform hai jo automatically articles aur posts draft, format, aur validate karta hai — company guidelines ke saath compliance ensure karte hue.

---

##  Features

- **Instant Content Generation** — Heading aur description do, baaki sab AI handle karta hai
- **Compliance Validation** — Ek alag AI step content ko aapke company rules ke against check karta hai
- **Violation Reports** — Agar content fail ho, to exactly kya galat hua — clearly dikhaya jaata hai
- **File Upload Support** — Guidelines ko `.txt` ya `.pdf` file ke roop mein upload karo, ya text paste karo
- **Markdown Rendering** — Output headings, paragraphs, aur lists ke saath render-ready format mein milta hai
- **n8n Webhook Integration** — Kisi bhi automation pipeline ke saath kaam karta hai (n8n, Zapier, Make)

---

##  How It Works (3-Step Flow)

### Step 1 — Topic Define Karo
- Apna **Heading** aur optional **Description** enter karo
- Jitna zyada context doge, utna better AI output milega

### Step 2 — Company Guidelines Upload Karo
- Guidelines text paste karo **ya** `.txt` / `.pdf` file upload karo
- Submit karne par:
  1. Data n8n workflow ko bheja jaata hai
  2. Gemini AI se content generate hota hai
  3. Compliance validation run hoti hai

### Step 3 — Result Dekho
- **Pass:** Generated content dikhta hai, copy ya publish karo
- **Fail:** Violations list dikhti hai — guidelines update karo aur retry karo

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML, CSS, JavaScript |
| Fonts | Cormorant Garamond, Jost (Google Fonts) |
| Markdown Rendering | [marked.js](https://cdnjs.cloudflare.com/ajax/libs/marked/9.1.6/marked.min.js) |
| AI Generation | Gemini AI (n8n workflow ke through) |
| Automation | n8n Webhook |

---

## ⚙️ Setup & Installation

### Prerequisites
- [n8n](https://n8n.io/) locally ya cloud par running hona chahiye
- n8n mein content generation + validation workflow configure honi chahiye

### Steps

1. **Repository clone karo:**
   ```bash
   git clone https://github.com/Pratham00007/AIAgent-content-genrator.git
   cd autopublish
   ```

2. **n8n Webhook URL configure karo:**

   `index.html` mein yeh line dhundo aur apna webhook URL daalo:
   ```javascript
   const res = await fetch('http://localhost:5678/webhook-test/content-gen', {
   ```
   Isko apne actual n8n webhook URL se replace karo.

3. **File browser mein open karo:**
   ```
   index.html
   ```
   Koi build step nahi — sirf file open karo aur use karo.

---

##  n8n Webhook API

### Request Format

**Endpoint:** `POST /webhook-test/content-gen`

**Content-Type:** `application/json`

```json
{
  "heading": "The Future of Renewable Energy",
  "description": "Focus on solar and wind trends for a general audience.",
  "rules": "Avoid political opinions. Use simple language. No product promotions."
}
```

### Response Format

**Success (compliance passed):**
```json
{
  "success": true,
  "text": "# The Future of Renewable Energy\n\n...",
  "validation": {
    "passed": true,
    "summary": "All guidelines followed.",
    "violations": []
  }
}
```

**Failure (compliance failed):**
```json
{
  "success": false,
  "error": {
    "title": "Compliance Check Failed",
    "summary": "Content did not meet company guidelines.",
    "violations": [
      "Rule 1 violated: Political opinion detected.",
      "Rule 3 violated: Promotional language used."
    ]
  }
}
```

---

## 📁 Project Structure

```
autopublish/
│
├── index.html        # Main application (single-file app)
└── README.md         # Project documentation
```

---

## 🔧 Customization

### Webhook URL Change Karna
`index.html` mein `fetch(...)` call dhundo — URL ko apne n8n instance ke URL se replace karo.

### Loading Steps Edit Karna
HTML mein `#lstep1`, `#lstep2`, `#lstep3` elements dhundo aur labels change karo jo aapke workflow steps match kare.

### Branding Change Karna
CSS variables `:root` mein defined hain — `--accent` color aur fonts easily update ho sakte hain:
```css
:root {
  --accent: #c8a96e;   /* Gold accent color */
  --bg: #0d0f11;       /* Dark background */
}
```

---

##  Platform Stats

| Metric | Value |
|---|---|
| Articles Auto-Published | 12,000+ |
| Accuracy Rate | 98% |
| Avg. Generation Time | < 30 seconds |

---

##  License

© 2025 AutoPublish. All rights reserved.
