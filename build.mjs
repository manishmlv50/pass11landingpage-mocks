/**
 * Generate static landing HTML from CMS page JSON (same slots/components as storefront).
 * Run: node landing-pages/build.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CMS = path.join(ROOT, 'apps', 'cms', 'content');
const SITE_URL = 'https://pass11plusgrammar.co.uk';
const GTM_CONTAINER_ID = 'GTM-T4CFPWNR';

const examBoardLogos = [
  { src: '/assets/exam-boards/gl-assessment.png', alt: 'GL Assessment' },
  { src: '/assets/exam-boards/cem-logo.avif', alt: 'CEM' },
  { src: '/assets/exam-boards/iseb-logo.avif', alt: 'ISEB' },
  { src: '/assets/exam-boards/aqa.avif', alt: 'AQA' },
  { src: '/assets/exam-boards/ocr.avif', alt: 'OCR' },
  { src: '/assets/exam-boards/eduqas.avif', alt: 'Eduqas' },
  { src: '/assets/exam-boards/cea.avif', alt: 'CEA' },
  { src: '/assets/exam-boards/pearson-edexcel.avif', alt: 'Pearson Edexcel' },
  { src: '/assets/exam-boards/wjec.avif', alt: 'WJEC CBAC' },
];

const grammarSchoolLogos = [
  { src: '/assets/schools/ke-grammar.avif', alt: 'King Edward VI Grammar School' },
  { src: '/assets/schools/sggs.avif', alt: "Stratford Girls' Grammar School" },
  { src: '/assets/schools/queen-marys-high.avif', alt: "Queen Mary's High School" },
  { src: '/assets/schools/kes.avif', alt: "King Edward's School" },
  { src: '/assets/schools/qmgs.avif', alt: "Queen Mary's Grammar School" },
  { src: '/assets/schools/bishop-vesey.avif', alt: "Bishop Vesey's Grammar School" },
  { src: '/assets/schools/sutton-coldfield-girls.avif', alt: 'Sutton Coldfield Grammar School for Girls' },
  { src: '/assets/schools/ke-five-ways.avif', alt: 'King Edward VI Five Ways School' },
];

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function asset(src) {
  if (!src) return '';
  if (src.startsWith('http')) return src;
  return `${SITE_URL}${src.startsWith('/') ? '' : '/'}${src}`;
}

function site(href) {
  if (!href || href.startsWith('http') || href.startsWith('#')) return href;
  if (href.endsWith('.html')) return href;
  return `${SITE_URL}${href.startsWith('/') ? '' : '/'}${href}`;
}

function renderGtmHead() {
  return `  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');</script>
  <!-- End Google Tag Manager -->`;
}

function renderGtmBody() {
  return `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}" height="0" width="0" style="display:none;visibility:hidden" title="Google Tag Manager"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;
}

function renderHead(page) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
${renderGtmHead()}
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="lp-form-api" content="${SITE_URL}/api/forms/submit">
  <title>${esc(page.metaTitle || page.title)}</title>
  <meta name="description" content="${esc(page.metaDescription || '')}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Nunito:wght@600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: '#0263e0',
            ink: '#00042f',
            muted: '#5a5a5a',
            accent: '#fdbb10',
            'nav-hover': '#e0edf7',
          },
          fontFamily: {
            heading: ['Nunito', 'sans-serif'],
            body: ['Inter', 'sans-serif'],
          },
        },
      },
    };
  </script>
  <link rel="stylesheet" href="css/components.css">
</head>`;
}

function renderNav() {
  return `<header class="lp-page-header">
  <nav class="max-w-6xl 2xl:max-w-7xl mx-auto bg-white rounded-[1.25rem] shadow-lg border border-[var(--color-stroke)]">
    <div class="p-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 lg:h-[4.5rem] gap-4">
        <a href="${SITE_URL}/" class="flex-shrink-0">
          <img src="assets/logos/pass11plus-logo.png" alt="Pass 11 Plus Grammar" width="341" height="56" class="h-12 lg:h-14 w-auto" onerror="this.src='${SITE_URL}/assets/logos/pass11plus-logo.png'">
        </a>
        <a href="https://wa.me/447871008108" class="btn-primary-site px-5 py-2.5 text-sm shrink-0">Book Free Consult</a>
      </div>
    </div>
  </nav>
</header>`;
}

const MAP_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2431.2!2d-1.935!3d52.468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4870bdf5a3ab9591%3A0x9b8c7e0e8b4c5f1a!2sEdgbaston%2C+Birmingham!5e0!3m2!1sen!2suk!4v1';

function renderFooter(pageSlug) {
  const tag =
    pageSlug === 'intensive-courses'
      ? 'Intensive Courses · Birmingham, UK'
      : 'Mock Exams · Birmingham, UK';
  return `<footer style="background-color:#024eb0">
  <div class="py-16 md:py-20 lg:py-24 bg-cover bg-top bg-no-repeat rounded-t-[4rem]" style="background-image:linear-gradient(315deg,#f6f5f81a,#fff),linear-gradient(#fcf3cf,#fff)">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 space-y-12">
      <div>
        <a href="${SITE_URL}/">
          <img src="${asset('/assets/logos/footer-logo.avif')}" alt="Pass 11 Plus Grammar Preparation Success" width="341" height="96" class="h-auto w-auto max-h-24" onerror="this.src='assets/logos/pass11plus-logo.png'">
        </a>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
        <div>
          <h4 class="text-h4-title text-base mb-5">Quick Menu</h4>
          <ul class="space-y-4">
            <li><a href="${SITE_URL}/about" class="text-paragraph-3 text-muted hover:text-ink transition-colors">About us</a></li>
            <li><a href="${asset('/assets/terms/Terms-Conditions.pdf')}" target="_blank" rel="noopener noreferrer" class="text-paragraph-3 text-muted hover:text-ink transition-colors">T&amp;C</a></li>
            <li><a href="${SITE_URL}/policies" class="text-paragraph-3 text-muted hover:text-ink transition-colors">Our Policies</a></li>
            <li><a href="${SITE_URL}/blog" class="text-paragraph-3 text-muted hover:text-ink transition-colors">Blog</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-h4-title text-base mb-5">Courses</h4>
          <ul class="space-y-4">
            <li><a href="${SITE_URL}/11-plus-tutor" class="text-paragraph-3 text-muted hover:text-ink transition-colors">Pass 11+</a></li>
            <li><a href="${SITE_URL}/gcse-tutor" class="text-paragraph-3 text-muted hover:text-ink transition-colors">GCSE</a></li>
            <li><a href="${SITE_URL}/a-level-tutor" class="text-paragraph-3 text-muted hover:text-ink transition-colors">A-Level</a></li>
            <li><a href="${SITE_URL}/11-plus-mocks" class="text-paragraph-3 text-muted hover:text-ink transition-colors">Mock Exams</a></li>
          </ul>
        </div>
      </div>
      <div class="mx-auto w-full max-w-[800px]">
        <div class="bg-white rounded-2xl shadow-lg p-8 md:p-10 lg:p-12">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            <div class="space-y-6">
              <h5 class="text-h4-title text-lg text-brand mb-2">Get in touch</h5>
              <ul class="space-y-5">
                <li>
                  <a href="https://www.google.com/maps/dir//710+Hagley+Rd+W,+Oldbury+B68+0PN" target="_blank" rel="noopener noreferrer" class="flex items-start gap-3 text-paragraph-3 text-muted hover:text-ink transition-colors">
                    <span class="text-red-500 mt-0.5" aria-hidden>📍</span>
                    <span>710 Hagley Rd W, Oldbury B68 0PN</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:info@pass11plusgrammar.com" class="flex items-start gap-3 text-paragraph-3 text-muted hover:text-ink transition-colors">
                    <span class="text-brand mt-0.5" aria-hidden>✉</span>
                    <span>info@pass11plusgrammar.com</span>
                  </a>
                </li>
                <li class="flex items-start gap-3 text-paragraph-3 text-muted">
                  <span class="text-green-600 mt-0.5" aria-hidden>📞</span>
                  <span>
                    <a href="tel:+447871008108" class="hover:text-ink">+44 787 100 8108</a><br>
                    <a href="tel:+441217401008" class="hover:text-ink">+44 121 740 1008</a>
                  </span>
                </li>
              </ul>
              <div class="flex items-center gap-4 pt-2">
                <a href="https://www.facebook.com/Pass11PlusGrammar.co.uk/" target="_blank" rel="noopener noreferrer" class="w-9 h-9 bg-brand rounded-full flex items-center justify-center text-white text-xs font-bold hover:opacity-90" aria-label="Facebook">f</a>
                <a href="https://www.instagram.com/pass11plusgrammar_" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold hover:opacity-90" style="background:linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)" aria-label="Instagram">ig</a>
              </div>
            </div>
            <div class="rounded-xl overflow-hidden shadow-md h-[240px] md:h-[260px]">
              <iframe title="Pass 11 Plus Location" src="${MAP_EMBED}" width="100%" height="100%" style="border:0" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>
        </div>
      </div>
      <p class="text-center text-xs text-muted pt-4 border-t border-[var(--color-stroke)]">© ${new Date().getFullYear()} Pass 11 Plus Grammar. All rights reserved. · ${esc(tag)}</p>
    </div>
  </div>
</footer>
<a href="https://wa.me/447871008108" class="fixed bottom-6 right-6 z-[90] w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform" aria-label="WhatsApp">
  <svg viewBox="0 0 24 24" class="w-7 h-7 text-white fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
</a>`;
}

const HERO_FORMS = {
  'intensive-courses': {
    heading: "Reserve Your Child's Place",
    lead: 'Limited spaces. Enrol now to secure your spot for the upcoming intensive course.',
    submitLabel: "🚀 Secure My Child's Place",
    subject: '11plus-intensive',
    yearOptions: ['Year 3', 'Year 4', 'Year 5', 'Year 6'],
    secondaryLabel: 'Course Interested In',
    secondaryOptions: [
      { value: 'Summer Intensive', label: 'Summer Intensive' },
    ],
    secondaryKey: 'course',
  },
  '11-plus-mocks': {
    heading: "Reserve Your Child's Mock Place",
    lead: 'Spaces are limited. Secure your spot for the next available mock date today.',
    submitLabel: "🚀 Secure My Child's Place",
    subject: '11plus-mocks',
    yearOptions: ['Year 4', 'Year 5', 'Year 6'],
    secondaryLabel: 'Mock Format',
    secondaryOptions: [
      { value: 'Online Mock', label: 'Online Mock' },
      { value: 'In-Person (Centre)', label: 'In-Person (Centre)' },
      { value: 'Independent Paper', label: 'Independent Paper' },
      { value: 'Not sure yet', label: 'Not sure yet' },
    ],
    secondaryKey: 'mockFormat',
  },
};

function renderHeroForm(pageSlug) {
  const cfg = HERO_FORMS[pageSlug] || HERO_FORMS['intensive-courses'];
  const yearOpts = cfg.yearOptions
    .map((y) => `<option value="${esc(y)}">${esc(y)}</option>`)
    .join('');
  const secondaryOpts = cfg.secondaryOptions
    .map((o) => `<option value="${esc(o.value)}">${esc(o.label)}</option>`)
    .join('');
  return `<form class="lp-hero-form-wrap" data-lp-hero-form data-form-id="contact-us" data-subject="${esc(cfg.subject)}" data-secondary-key="${esc(cfg.secondaryKey)}" novalidate>
    <div class="lp-hero-form-badge">Free Consultation — No Obligation</div>
    <h3 class="lp-hero-form-title">${esc(cfg.heading)}</h3>
    <p class="lp-hero-form-lead">${esc(cfg.lead)}</p>
    <div class="lp-form-status hidden" data-lp-form-status role="status"></div>
    <div class="lp-form-fields" data-lp-form-fields>
      <div class="lp-form-row">
        <div class="lp-form-group">
          <label for="lp-firstName">Parent's First Name</label>
          <input id="lp-firstName" name="firstName" type="text" placeholder="e.g. Sarah" required autocomplete="given-name">
        </div>
        <div class="lp-form-group">
          <label for="lp-lastName">Last Name</label>
          <input id="lp-lastName" name="lastName" type="text" placeholder="e.g. Khan" required autocomplete="family-name">
        </div>
      </div>
      <div class="lp-form-group">
        <label for="lp-email">Email Address</label>
        <input id="lp-email" name="email" type="email" placeholder="your@email.com" required autocomplete="email">
      </div>
      <div class="lp-form-group">
        <label for="lp-contact">Phone Number</label>
        <input id="lp-contact" name="contact" type="tel" placeholder="+44 7XXX XXXXXX" required autocomplete="tel">
      </div>
      <div class="lp-form-row">
        <div class="lp-form-group">
          <label for="lp-yearGroup">Child's Year Group</label>
          <select id="lp-yearGroup" name="yearGroup" required>
            <option value="">Select year</option>
            ${yearOpts}
          </select>
        </div>
        <div class="lp-form-group">
          <label for="lp-secondary">${esc(cfg.secondaryLabel)}</label>
          <select id="lp-secondary" name="secondary" required>
            <option value="">Select…</option>
            ${secondaryOpts}
          </select>
        </div>
      </div>
      <button type="submit" class="lp-form-submit" data-lp-submit>${esc(cfg.submitLabel)}</button>
      <p class="lp-form-privacy">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        We respect your privacy. No spam, ever. By submitting you agree to our <a href="${SITE_URL}/policies" target="_blank" rel="noopener noreferrer">policies</a>.
      </p>
    </div>
    <div class="lp-form-success hidden" data-lp-form-success>
      <p class="lp-form-success-title">Thank you!</p>
      <p class="lp-form-success-text">Your submission has been received. We will be in touch shortly.</p>
    </div>
  </form>`;
}

function renderPageHero(props, slotId, pageSlug) {
  const bc = (props.breadcrumb || [])
    .map((item) => {
      if (item.href) {
        return `<span class="flex items-center gap-2"><span class="text-muted">|</span><a href="${esc(site(item.href))}" class="text-brand hover:opacity-90 transition-colors">${esc(item.label)}</a></span>`;
      }
      return `<span class="flex items-center gap-2"><span class="text-muted">|</span><span class="text-ink font-medium">${esc(item.label)}</span></span>`;
    })
    .join('');
  const breadcrumbNav =
    props.breadcrumb && props.breadcrumb.length > 0
      ? `<nav class="flex items-center justify-center md:justify-start gap-2 text-sm text-muted mb-4 flex-wrap">
      <a href="${SITE_URL}/" class="text-brand hover:opacity-90 transition-colors">Home</a>${bc}
    </nav>`
      : '';
  const subtitle =
    props.subtitle != null && props.subtitle !== ''
      ? `<div class="text-paragraph-2 text-muted font-semibold mb-2">${esc(props.subtitle)}</div>`
      : '';
  const h2title =
    props.h2title != null && props.h2title !== ''
      ? `<h2 class="text-h2-title text-brand font-semibold mb-2">${esc(props.h2title)}</h2>`
      : '';
  const desc =
    props.description != null && props.description !== ''
      ? `<div class="text-paragraph-2 text-muted mb-8">${esc(props.description)}</div>`
      : '';
  const ctaHref = (href) => (href.startsWith('#') ? href : site(href));
  const ctas = [];
  if (props.cta?.label) {
    ctas.push(
      `<a href="${esc(ctaHref(props.cta.href))}" class="btn-primary-site inline-block px-8 py-4 text-base w-full sm:w-auto">${esc(props.cta.label)}</a>`
    );
  }
  if (props.cta2?.label) {
    ctas.push(
      `<a href="${esc(ctaHref(props.cta2.href))}" class="btn-accent-site inline-block px-8 py-4 text-base w-full sm:w-auto">${esc(props.cta2.label)}</a>`
    );
  }
  const ctaBlock = ctas.length
    ? `<div class="flex flex-row flex-wrap gap-4 justify-center md:justify-start">${ctas.join('')}</div>`
    : '';
  const rightCol = pageSlug ? renderHeroForm(pageSlug) : '';
  const minH =
    props.minHeight && props.minHeight !== 'auto' ? props.minHeight : '85vh';
  const minHStyle = `min-height:${esc(minH)};`;

  return `<section id="${slotId}" class="hero-section-bg relative overflow-hidden lp-hero-offset pb-16 md:pb-24 place-content-center" style="${minHStyle}">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid md:grid-cols-2 gap-10 items-center">
      <div class="text-center md:text-left">
        ${breadcrumbNav}
        ${subtitle}
        ${h2title}
        <h1 class="text-h1-title mb-4">${esc(props.title)}</h1>
        ${desc}
        ${ctaBlock}
      </div>
      <div class="flex justify-center md:justify-end items-stretch w-full">${rightCol}</div>
    </div>
  </div>
</section>`;
}

const PROMO_CTA = {
  'intensive-courses': {
    title: 'Ready to Give Your Child Every Advantage?',
    lead:
      "Places fill up fast. Secure your spot in our next 11 Plus intensive courses and let's get your child exam-ready together.",
    secondaryHref: 'https://pass11plusgrammar.co.uk/intensive-courses',
    secondaryLabel: 'Book on Main Site',
  },
  '11-plus-mocks': {
    title: 'Ready to Give Your Child Every Advantage?',
    lead:
      'Spaces fill quickly. Book your child\'s mock exam today and start building the confidence, timing, and technique that separates the children who pass from those who nearly did.',
    secondaryHref: 'https://pass11plusgrammar.co.uk/11-plus-mocks',
    secondaryLabel: 'Book on Main Site',
  },
};

function renderPromoCta(pageSlug) {
  const c = PROMO_CTA[pageSlug] || PROMO_CTA['intensive-courses'];
  return `<section id="promoCta" class="lp-promo-cta">
  <div class="lp-promo-cta-inner">
    <h2>${esc(c.title)}</h2>
    <p class="lp-promo-lead">${esc(c.lead)}</p>
    <div class="lp-promo-cta-actions">
      <a href="https://wa.me/447871008108" class="lp-btn-whatsapp" target="_blank" rel="noopener noreferrer">Book a Free WhatsApp Consultation</a>
      <a href="${esc(c.secondaryHref)}" class="lp-btn-outline">${esc(c.secondaryLabel)}</a>
    </div>
    <p class="lp-promo-note">Based in Birmingham · Serving families across the West Midlands · <a href="mailto:info@pass11plusgrammar.com" class="underline hover:text-white">info@pass11plusgrammar.com</a></p>
  </div>
</section>`;
}

function renderSchoolLogos(slotId) {
  const row = (logos, dir) => {
    const dup = [...logos, ...logos];
    const cls = dir === 'left' ? 'logo-carousel-content-3 logo-carousel-content-3--left' : 'logo-carousel-content-3 logo-carousel-content-3--right';
    return `<div class="logo-carousel mb-8" style="--logo-speed:${dir === 'left' ? '30s' : '37.5s'}"><div class="${cls}">${dup
      .map(
        (l) =>
          `<div class="logo-carousel-card"><img src="${asset(l.src)}" alt="${esc(l.alt)}" width="160" height="52" loading="lazy"></div>`
      )
      .join('')}</div></div>`;
  };
  return `<section id="${slotId}" class="py-16 bg-white">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    ${row(examBoardLogos, 'left')}
    ${row(grammarSchoolLogos, 'right')}
  </div>
</section>`;
}

function renderHeroBadge(props, slotId) {
  const paras = (props.paragraphs || [])
    .map((p) => `<p class="text-paragraph-3 text-muted leading-relaxed">${esc(p)}</p>`)
    .join('');
  const featCount = (props.features || []).length;
  const featGridCls =
    featCount >= 5
      ? 'sm:grid-cols-2 lg:grid-cols-3'
      : featCount === 4
        ? 'sm:grid-cols-2 lg:grid-cols-4'
        : featCount <= 2
          ? 'sm:grid-cols-2'
          : 'sm:grid-cols-3';
  const feats = (props.features || [])
    .map(
      (t) =>
        `<div class="flex items-start gap-2 py-3 px-4 rounded-xl bg-[var(--color-bg-gray)] border border-[var(--color-stroke)] text-left"><span class="flex-shrink-0 text-[var(--color-brand)] mt-0.5" aria-hidden>✓</span><span class="text-paragraph-4 text-ink">${esc(t)}</span></div>`
    )
    .join('');
  return `<section id="${slotId}" class="hero-badge-section py-16 bg-white">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto text-center">
      <div data-badge><div class="hex" aria-hidden></div><div class="coin"><span class="num">${esc(props.badgeLine1)}</span><span class="num">${esc(props.badgeLine2)}</span></div></div>
      ${props.subtitle ? `<p class="text-paragraph-4 font-bold text-brand mb-2">${esc(props.subtitle)}</p>` : ''}
      <h2 class="font-heading text-h3-title font-bold text-ink mb-6">${esc(props.title)}</h2>
      <div class="space-y-4 mb-6 max-w-3xl mx-auto">${paras}</div>
      <div class="grid ${featGridCls} gap-4 mb-6">${feats}</div>
      ${props.tagline ? `<p class="text-paragraph-3 text-muted max-w-3xl mx-auto">${esc(props.tagline)}</p>` : ''}
    </div>
  </div>
</section>`;
}

function renderSchedule(props, slotId) {
  const days = (props.days || [])
    .map(
      (item, i) => `<div class="bg-white rounded-xl shadow-md border border-[var(--color-stroke)] overflow-hidden">
      <div class="w-full py-4 px-4 bg-[#435EEB] text-white font-heading font-bold text-center">Day ${item.day}: ${esc(item.subject)}</div>
      <div class="p-4 text-left border-t border-[var(--color-stroke)]">
        <p class="text-paragraph-3 text-ink mb-3">${esc(item.intro)}</p>
        <ul class="space-y-2 mb-3">${(item.bullets || []).map((b) => `<li class="flex items-start gap-2 text-sm text-ink"><span class="text-[#fdbb10] font-bold">✓</span><span>${esc(b)}</span></li>`).join('')}</ul>
        <p class="text-sm text-ink"><strong>Drop-off from:</strong> ${esc(item.dropOff)}<br><strong>Pick-up until:</strong> ${esc(item.pickUp)}<br><strong>Lessons start:</strong> ${esc(item.lessonsStart)}<br><strong>Lessons finish:</strong> ${esc(item.lessonsFinish)}<br><strong>Breaks:</strong> ${esc(item.breaksNote)}</p>
      </div>
    </div>`
    )
    .join('');
  return `<section id="${slotId}" class="py-16 bg-white">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-h3-title text-center text-ink font-bold mb-2">${esc(props.title)}</h2>
    <p class="text-center text-muted text-paragraph-2 mb-10">${esc(props.subtitle)}</p>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">${days}</div>
  </div>
</section>`;
}

function renderProductListing(props, slotId, pageSlug) {
  const anchor = slotId === 'intensiveCourses' ? 'intensiveCourses' : slotId;
  const bookUrl = `${SITE_URL}/${pageSlug}#${anchor}`;
  return `<section id="${slotId}" class="py-16 bg-[var(--color-bg-gray)]">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="mb-10 text-center">
      <h2 class="text-h2-title text-ink font-bold">${esc(props.title)}</h2>
      ${props.subtitle ? `<p class="text-muted mt-2 text-paragraph-2">${esc(props.subtitle)}</p>` : ''}
    </div>
    <div class="bg-white rounded-2xl border border-[var(--color-stroke)] p-8 md:p-12 text-center shadow-sm max-w-2xl mx-auto">
      <p class="text-paragraph-2 text-muted mb-6">Live course dates, pricing and secure checkout are on our main site — same products and layout as this page on pass11plusgrammar.co.uk.</p>
      <a href="${bookUrl}" class="btn-primary-site px-8 py-4 text-base">Browse &amp; book on main site →</a>
    </div>
  </div>
</section>`;
}

function renderYearFocus(props, slotId) {
  const bg = props.background?.includes('gray') ? 'bg-[var(--color-bg-gray)]' : 'bg-white';
  const cards = (props.areas || [])
    .map(
      (a) => `<div class="bg-white rounded-2xl p-5 shadow-md border border-[var(--color-stroke)] flex items-center gap-4">
      <div class="flex-shrink-0 w-12 h-12 rounded-[14px] flex items-center justify-center" style="background-color:#425ce3">
        ${a.iconEmoji ? `<span class="text-2xl">${a.iconEmoji}</span>` : a.icon ? `<img src="${asset(a.icon)}" alt="" class="w-6 h-6 object-contain" style="filter:brightness(0) invert(1)">` : ''}
      </div>
      <span class="font-heading font-medium text-ink text-base">${esc(a.name)}</span>
    </div>`
    )
    .join('');
  return `<section id="${slotId}" class="py-16 ${bg}">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-h3-title text-center text-ink font-bold mb-10">${esc(props.sectionTitle)}</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">${cards}</div>
  </div>
</section>`;
}

function renderFeatureCards(props, slotId) {
  const bg = props.background || 'bg-white';
  const cards = (props.cards || [])
    .map((card) => {
      const inner = `<div class="group w-full bg-white rounded-2xl shadow-sm border border-[var(--color-stroke)] p-6 hover:shadow-xl hover:-translate-y-1 transition-all text-center block h-full ${card.background || ''}">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4">
          ${card.iconEmoji ? `<div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-[var(--color-brand-light)]"><span class="text-3xl">${card.iconEmoji}</span></div>` : card.icon ? `<img src="${asset(card.icon)}" alt="" class="w-14 h-14 object-contain">` : ''}
        </div>
        <p class="font-heading text-lg font-bold text-ink mb-2">${esc(card.primaryText)}</p>
        ${card.secondaryText ? `<p class="text-paragraph-3 text-muted">${esc(card.secondaryText)}</p>` : ''}
      </div>`;
      const href = card.href ? site(card.href) : null;
      return href
        ? `<a href="${esc(href)}" class="block w-full max-w-sm no-underline text-inherit mx-auto">${inner}</a>`
        : `<div class="block w-full max-w-sm mx-auto">${inner}</div>`;
    })
    .join('');
  const grid =
    (props.cards?.length || 0) <= 2
      ? 'mx-auto grid w-max max-w-full grid-cols-1 gap-6 sm:grid-cols-2'
      : 'grid grid-cols-1 gap-6 sm:grid-cols-3';
  return `<section id="${slotId}" class="py-16 ${bg}">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    ${props.title ? `<h2 class="text-h2-title font-bold text-center mb-8">${esc(props.title)}</h2>` : ''}
    ${props.subtitle ? `<p class="text-center text-paragraph-2 text-muted mb-10 max-w-3xl mx-auto">${esc(props.subtitle)}</p>` : ''}
    <div class="${grid}">${cards}</div>
  </div>
</section>`;
}

function renderMockExamsCard(slotId) {
  return `<section id="${slotId}" class="py-16 section-bg-gray">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
      <a href="https://wa.me/447871008108" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[var(--color-brand)] text-white font-semibold rounded-full shadow-md hover:opacity-95">Get Started Today</a>
      <a href="#faq" class="inline-flex items-center justify-center px-8 py-4 bg-white text-ink font-semibold rounded-full border-2 border-[var(--color-stroke)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]">Questions Parents Ask - FAQ</a>
    </div>
    <p class="text-paragraph-3 text-muted mt-6">Need more detailed information? Visit our comprehensive FAQ section.</p>
  </div>
</section>`;
}

function renderSuccessStories(testimonials, slotId) {
  const items = (testimonials || []).slice(0, 6);
  const cards = items
    .map((t, i) => {
      const hi = i === 1;
      const initials = t.name
        .split(/\s+/)
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
      return `<div class="rounded-2xl p-6 shadow-sm border min-h-[200px] flex flex-col ${hi ? 'bg-[var(--color-faq-blue)] border-[var(--color-faq-blue)] text-white' : 'bg-white border-[var(--color-stroke)]'}">
      <div class="flex gap-1 mb-4 text-accent" aria-hidden>${'★'.repeat(5)}</div>
      <p class="text-sm leading-relaxed mb-6 flex-1 ${hi ? 'text-white' : 'text-muted'}">&ldquo;${esc(t.quote)}&rdquo;</p>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-sm ${hi ? 'bg-white/20 text-white' : 'bg-[var(--color-faq-blue)] text-white'}">${initials}</div>
        <div><p class="font-semibold text-sm ${hi ? 'text-white' : 'text-ink'}">${esc(t.name)}</p>${t.role ? `<p class="text-xs ${hi ? 'text-white/90' : 'text-muted'}">${esc(t.role)}</p>` : ''}</div>
      </div>
    </div>`;
    })
    .join('');
  return `<section id="${slotId}" class="relative py-16 bg-cover bg-center" style="background-image:url(${asset('/assets/images/bg-testimonial.avif')});background-color:var(--color-bg-gray)">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-h2-title text-center text-ink mb-10">Success Stories</h2>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">${cards}</div>
  </div>
</section>`;
}

function renderFAQ(faqs, props, slotId) {
  // Landing pages always use white FAQ theme (main site CMS may use background: "blue")
  const isBlue = false;
  const sectionCls = isBlue ? 'bg-[var(--color-faq-blue)] text-white py-16' : 'bg-white py-16';
  const titleCls = isBlue ? 'text-h2-title text-white' : 'text-h2-title text-ink';
  const items = (faqs || [])
    .map(
      (faq, index) => `<div class="border rounded-xl overflow-hidden ${isBlue ? 'border-white/30' : 'bg-white border-[var(--color-stroke)]'}" ${isBlue ? 'style="background-color:color-mix(in srgb, var(--color-faq-blue) 90%, white)"' : ''}>
      <button type="button" class="lp-faq-btn w-full flex items-center justify-between gap-4 px-5 py-4 text-left ${isBlue ? 'hover:bg-white/5' : 'hover:bg-[var(--color-nav-hover)]'}" data-faq-index="${index}">
        <h3 class="text-paragraph-2 font-bold font-heading pr-2 ${isBlue ? 'text-white' : 'text-ink'}">${esc(faq.question)}</h3>
        <span class="lp-faq-chevron w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isBlue ? 'border-2 border-white' : 'bg-[var(--color-nav-hover)] text-brand'}">▼</span>
      </button>
      <div class="lp-faq-panel hidden px-5 pb-4"><p class="text-sm leading-relaxed ${isBlue ? 'text-white/90' : 'text-muted'}">${esc(faq.answer)}</p></div>
    </div>`
    )
    .join('');
  const title = (props.title || 'Frequently\nAsked\nQuestions').replace(/\\n/g, '\n');
  return `<section id="${slotId}" class="${sectionCls}">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid md:grid-cols-[1fr_1.8fr] gap-10 items-start">
      <div>
        <h2 class="${titleCls} mb-6 whitespace-pre-line">${esc(title)}</h2>
        <img src="${asset('/assets/icons/faq-person.svg')}" alt="" class="w-48 h-auto hidden md:block" loading="lazy">
      </div>
      <div class="space-y-3">${items}</div>
    </div>
  </div>
</section>`;
}

function renderWebContent(props, slotId) {
  const bg = props.background || 'bg-white';
  return `<section id="${slotId}" class="py-12 sm:py-16 ${bg}">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="rounded-2xl" style="background-color:#0263e036;padding:2rem 2.5rem">
      ${props.title ? `<h2 class="mb-5 text-center text-2xl font-bold text-gray-900 sm:text-3xl font-heading">${esc(props.title)}</h2>` : ''}
      <div class="relative">
        <div class="web-content-body web-content-collapsed" data-web-content>${props.html || ''}</div>
        <div class="web-content-fade" data-web-fade></div>
      </div>
      <button type="button" class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-900" data-web-toggle>Show more</button>
    </div>
  </div>
</section>`;
}

function renderReadyToGetStarted(slotId) {
  return `<section id="${slotId}" class="py-16 text-center" style="background-color:#024eb0">
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="font-heading text-3xl md:text-4xl font-bold text-white mb-6">Ready to get started?</h2>
    <a href="https://wa.me/447871008108?text=Hi%20there%2C%20I%20am%20on%20your%20website%20and%20would%20like%20to%20speak%20with%20one%20of%20your%2011%20Plus%20Experts." target="_blank" rel="noopener noreferrer" class="inline-block px-8 py-4 text-lg font-semibold text-white rounded-full bg-accent hover:opacity-95">Book Your Free Consultation</a>
    <p class="text-white/90 text-base mt-4">Start your child&apos;s 11 Plus success journey today.</p>
  </div>
</section>`;
}

function renderWhyChoose(props, slotId) {
  const cards = (props.cards || [])
    .map(
      (c) => `<div class="group bg-white rounded-2xl p-6 shadow-md border border-[var(--color-stroke)] hover:shadow-xl hover:-translate-y-1 transition-all">
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-xl ${c.iconGradient} transition-all">
        ${c.icon ? `<img src="${asset(c.icon)}" alt="" class="w-7 h-7 object-contain" style="filter:brightness(0) invert(1)">` : ''}
      </div>
      <h3 class="font-heading text-lg font-bold text-ink mt-4 mb-2">${esc(c.title)}</h3>
      <p class="text-paragraph-3 text-muted leading-relaxed">${esc(c.description)}</p>
    </div>`
    )
    .join('');
  return `<section id="${slotId}" class="py-16 ${props.background || 'bg-white'}">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-h2-title text-center text-ink mb-2">${esc(props.title)}</h2>
    ${props.subtitle ? `<p class="text-center text-paragraph-2 text-muted mb-10">${esc(props.subtitle)}</p>` : ''}
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">${cards}</div>
  </div>
</section>`;
}

function renderVideo(props, slotId) {
  const items = (props.items || []).map((item) => `<span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/25 text-sm font-medium text-white">${esc(item)}</span>`).join('');
  return `<section id="${slotId}" class="relative min-h-[80vh] flex flex-col justify-center py-16 sm:py-20 text-white overflow-hidden" style="background-image:linear-gradient(90deg,color-mix(in srgb,#00042f 92%,transparent),transparent 78%),url(${asset('/assets/images/about-global-perspective.avif')});background-size:cover;background-position:center">
  <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <p class="text-white/90 text-paragraph-2 font-medium tracking-wider uppercase mb-4">${esc(props.tagline)}</p>
    <h2 class="text-h2-title sm:text-h1-title font-bold text-white uppercase mb-1">${esc(props.title)}</h2>
    <h2 class="text-h2-title sm:text-h1-title font-bold text-white uppercase mb-6">${esc(props.title2)}</h2>
    <p class="text-white/90 text-paragraph-2 max-w-xl mx-auto mb-8">${esc(props.description)}</p>
    <div class="flex flex-wrap justify-center gap-3 mb-8">${items}</div>
    <a href="${esc(props.ctaHref || '#')}" class="btn-primary-site px-8 py-4 !bg-white !text-brand">${esc(props.ctaLabel)}</a>
    ${props.videoUrl ? `<p class="mt-4"><a href="${esc(props.videoUrl)}" target="_blank" rel="noopener" class="text-white underline text-sm">Watch video</a></p>` : ''}
  </div>
</section>`;
}

const COMPONENT_RENDERERS = {
  PageHero: (props, id, ctx) => renderPageHero(props, id, ctx.page?.slug),
  SchoolLogosGrid: (_, id) => renderSchoolLogos(id),
  HeroBadgeSection: (props, id) => renderHeroBadge(props, id),
  IntensiveCourseScheduleSection: (props, id) => renderSchedule(props, id),
  ProductListingSection: (props, id, ctx) => renderProductListing(props, id, ctx.page?.slug),
  YearFocusAreasSection: (props, id) => renderYearFocus(props, id),
  FeatureCardsSection: (props, id) => renderFeatureCards(props, id),
  MockExamsCard: (_, id) => renderMockExamsCard(id),
  SuccessStories: (props, id, ctx) => renderSuccessStories(ctx.testimonials[props.testimonialGroupId], id),
  FAQAccordion: (props, id, ctx) => renderFAQ(ctx.faqs[props.faqGroupId], props, id),
  WhyChooseCardsSection: (props, id) => renderWhyChoose(props, id),
  VideoSection: (props, id) => renderVideo(props, id),
};

const SKIP_COMPONENTS = new Set(['WebContentSection', 'ReadyToGetStarted', 'ProductListingSection']);

function buildPage(pagePath, outName) {
  const page = readJson(pagePath);
  const ctx = {
    faqs: {},
    testimonials: {},
  };

  for (const slot of page.slots || []) {
    if (slot.componentId === 'FAQAccordion' && slot.props?.faqGroupId) {
      const g = slot.props.faqGroupId;
      if (!ctx.faqs[g]) {
        const p = path.join(CMS, 'faq-groups', `${g}.json`);
        if (fs.existsSync(p)) ctx.faqs[g] = readJson(p).items || [];
      }
    }
    if (slot.componentId === 'SuccessStories' && slot.props?.testimonialGroupId) {
      const g = slot.props.testimonialGroupId;
      if (!ctx.testimonials[g]) {
        const p = path.join(CMS, 'testimonial-groups', `${g}.json`);
        if (fs.existsSync(p)) ctx.testimonials[g] = readJson(p).testimonials || [];
      }
    }
  }

  const sectionParts = [];
  for (const slot of page.slots || []) {
    if (!slot.enabled || SKIP_COMPONENTS.has(slot.componentId)) continue;
    const fn = COMPONENT_RENDERERS[slot.componentId];
    if (!fn) continue;
    sectionParts.push(fn(slot.props || {}, slot.id, { ...ctx, page }));
    if (slot.componentId === 'FAQAccordion') {
      sectionParts.push(renderPromoCta(page.slug));
    }
  }

  const html = `${renderHead(page)}
<body class="min-h-screen flex flex-col">
${renderGtmBody()}
${renderNav()}
<main class="flex-1">
${sectionParts.join('\n')}
</main>
${renderFooter(page.slug)}
<script src="js/landing.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(__dirname, outName), html, 'utf8');
  console.log(`Wrote ${outName}`);
}

buildPage(path.join(CMS, 'sites', 'pass11', 'pages', 'intensive-courses.json'), 'intensive-courses.html');
buildPage(path.join(CMS, 'sites', 'pass11', 'pages', '11-plus-mocks.json'), '11-plus-mocks.html');
