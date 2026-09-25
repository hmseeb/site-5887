# Burks Roofing — Website

Production-ready single-page website for **Burks Roofing**, a professional residential and
commercial roofing contractor serving **Orlando, Florida**.

Rebuilt from the business's existing site (https://burksroofing.com/) using real business
details: name, services, phone, email, address and business hours. Imagery is the business's
own project photography, hosted locally in `assets/`.

## Stack
Vanilla HTML, CSS and JavaScript — no build step, no dependencies.

## Files
- `index.html` — single-page site (hero, services, about, projects, testimonials, contact)
- `css/styles.css` — design system, layout, responsive rules
- `js/main.js` — navigation, scroll reveal, form handling (`_page` field, fetch submit, `?submitted=1` notice)
- `assets/` — original Burks Roofing imagery + logo
- `favicon.svg` — favicon placeholder

## Sections
1. Hero with call to action
2. Trust bar
3. Services (New Roof, Repairs & Replacements, Residential & Commercial Roofing, Roof Replacements,
   Roofing Projects, Roof Inspection, Roof Installation, Roof Repair, Roof Damage Repair,
   Tower Roof Service, Re-Roofing Service, Roof Shingles)
4. About
5. Projects gallery
6. Testimonials
7. Call-to-action band
8. Contact (phone, email, address, hours) with a quote request form
9. Footer

## Forms
The contact form posts to LeadrVision:
`POST https://vision.leadrai.com/api/forms/e5b75e314bdad658de4c453efc765a73`

It includes hidden `_form`, `_page` and `_gotcha` (honeypot) fields, works without JavaScript
(plain POST returns to the page with `?submitted=1`), and also submits via `fetch()` with an
inline "Thanks, your message was sent" confirmation.

## Local preview
```bash
python3 -m http.server 8000
# then open http://localhost:8000
```