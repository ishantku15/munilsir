// ── Munil Sir Clone — SPA Engine ──────────────────────────────
// No auth, no batch purchase. Just pure learning vibes.

const $app = document.getElementById('app');
const LOGO = 'https://nocache-appxdb.classx.co.in/subject/2024-08-09-0.845544467533613.png';

// ── API Layer ────────────────────────────────────────────────
const api = {
  cache: new Map(),

  async get(endpoint) {
    if (this.cache.has(endpoint)) return this.cache.get(endpoint);
    const res = await fetch(`/api/${endpoint}`);
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    this.cache.set(endpoint, data);
    return data;
  }
};

// ── SVG Icons ────────────────────────────────────────────────
const icons = {
  arrow_left: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
  arrow_right: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
  graduation: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5"/></svg>',
  book: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  quiz: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  test: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  folder: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
  video: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
  pdf: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
  link: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
  chevron: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>',
  home: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
};

// ── Router ───────────────────────────────────────────────────
function getRoute() {
  const hash = window.location.hash.slice(1) || '/';
  const parts = hash.split('/').filter(Boolean);
  
  if (parts.length === 0) return { page: 'home' };
  if (parts[0] === 'courses') return { page: 'courses' };
  if (parts[0] === 'free-courses') return { page: 'free-courses' };
  if (parts[0] === 'course' && parts[1]) return { page: 'course-detail', slug: parts[1] };
  return { page: 'home' };
}

function navigate(hash) {
  window.location.hash = hash;
}

// ── Active Nav Link ──────────────────────────────────────────
function updateNav(page) {
  document.querySelectorAll('.nav-link, .mobile-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === page);
  });
  // Close mobile menu
  document.getElementById('mobileMenu')?.classList.remove('open');
  document.getElementById('hamburger')?.classList.remove('open');
}

// ── Skeleton Generators ──────────────────────────────────────
function skeletonCards(n = 6) {
  return Array(n).fill(0).map(() => `
    <div class="skel-card">
      <div class="skel-img skeleton"></div>
      <div class="skel-body">
        <div class="skel-line skeleton w60"></div>
        <div class="skel-line skeleton w40"></div>
      </div>
    </div>
  `).join('');
}

// ── Course Card Renderer ─────────────────────────────────────
function renderCourseCard(c, delay = 0) {
  const hasDiscount = c.discount > 0 && c.originalPrice > c.price;
  const isFree = c.price === 0;

  return `
    <div class="course-card" style="animation-delay:${delay}ms" onclick="navigate('#/course/${c.slug}')">
      <div class="card-image">
        <img src="${c.image}" alt="${c.name}" loading="lazy" onerror="this.src='${LOGO}'">
        ${c.isNew ? '<div class="card-badge"><span class="badge-new">NEW</span></div>' : ''}
      </div>
      <div class="card-body">
        <h3 class="card-title">${esc(c.name)}</h3>
        <div class="card-pricing">
          ${isFree 
            ? '<span class="price-free">FREE</span>'
            : `<span class="price-current">₹${c.price.toLocaleString('en-IN')}</span>
               ${hasDiscount ? `<span class="price-original">₹${c.originalPrice.toLocaleString('en-IN')}</span>
               <span class="price-discount">${c.discount}% off</span>` : ''}`
          }
        </div>
        <button class="card-cta">View Details</button>
      </div>
    </div>
  `;
}

// ── Escape HTML ──────────────────────────────────────────────
function esc(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

// ── PAGE: Home ───────────────────────────────────────────────
async function renderHome() {
  updateNav('home');
  $app.innerHTML = `
    <div class="hero-slider" id="heroSlider">
      <div class="hero-track" id="heroTrack"></div>
      <button class="hero-nav prev" onclick="sliderPrev()">${icons.arrow_left}</button>
      <button class="hero-nav next" onclick="sliderNext()">${icons.arrow_right}</button>
      <div class="hero-dots" id="heroDots"></div>
    </div>

    <section class="section-full section-bg">
      <div class="section-header">
        <h2 class="section-title">Browse</h2>
      </div>
      <div class="browse-scroll">
        <div class="browse-card" onclick="navigate('#/courses')">
          <div class="browse-icon">${icons.graduation}</div>
          <h3>Paid Courses</h3>
        </div>
        <div class="browse-card" onclick="navigate('#/free-courses')">
          <div class="browse-icon">${icons.graduation}</div>
          <h3>Free Courses</h3>
        </div>
        <div class="browse-card" onclick="window.open('https://study.munilsir.com/test-series','_blank')">
          <div class="browse-icon">${icons.test}</div>
          <h3>Test Series</h3>
        </div>
        <div class="browse-card" onclick="window.open('https://study.munilsir.com/quiz','_blank')">
          <div class="browse-icon">${icons.quiz}</div>
          <h3>Quiz</h3>
        </div>
        <div class="browse-card" onclick="window.open('https://study.munilsir.com/quick-links','_blank')">
          <div class="browse-icon">${icons.link}</div>
          <h3>Quick Links</h3>
        </div>
        <div class="browse-card" onclick="window.open('https://study.munilsir.com/new-courses?examId=8','_blank')">
          <div class="browse-icon">${icons.book}</div>
          <h3>Ebook</h3>
        </div>
        <div class="browse-card" onclick="window.open('https://study.munilsir.com/new-courses?examId=10','_blank')">
          <div class="browse-icon">${icons.book}</div>
          <h3>Webinar</h3>
        </div>
        <div class="browse-card" onclick="window.open('https://study.munilsir.com/new-courses?examId=9','_blank')">
          <div class="browse-icon">${icons.book}</div>
          <h3>Hand Written Content</h3>
        </div>
      </div>
    </section>

    <section class="section-full section-primary" id="featuredSection">
      <div class="section-header">
        <h2 class="section-title">Featured</h2>
      </div>
      <div class="featured-scroll" id="featuredGrid">
        ${skeletonCards(4)}
      </div>
    </section>
  `;

  // Fetch data
  try {
    const data = await api.get('home');
    
    // Render banners
    if (data.banners?.length) {
      initSlider(data.banners);
    } else {
      document.getElementById('heroSlider').style.display = 'none';
    }

    // Render featured courses
    if (data.featured?.length) {
      document.getElementById('featuredGrid').innerHTML = 
        data.featured.map((c, i) => renderCourseCard(c, i * 80)).join('');
    }
  } catch (err) {
    console.error('Home load error:', err);
    document.getElementById('featuredGrid').innerHTML = '<div class="empty-state"><p>Failed to load. Please refresh.</p></div>';
  }
}

// ── Banner Slider Logic ──────────────────────────────────────
let sliderIndex = 0;
let sliderInterval = null;

function initSlider(banners) {
  const track = document.getElementById('heroTrack');
  const dots = document.getElementById('heroDots');
  
  track.innerHTML = banners.map(b => `
    <a href="${b.link}" class="hero-slide">
      <img src="${b.image}" alt="Banner" loading="lazy">
    </a>
  `).join('');

  dots.innerHTML = banners.map((_, i) => `
    <button class="hero-dot ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})"></button>
  `).join('');

  sliderIndex = 0;
  clearInterval(sliderInterval);
  sliderInterval = setInterval(() => sliderNext(), 5000);
}

window.goToSlide = function(i) {
  const track = document.getElementById('heroTrack');
  const slides = track?.querySelectorAll('.hero-slide');
  if (!slides?.length) return;
  
  sliderIndex = ((i % slides.length) + slides.length) % slides.length;
  const slideW = slides[0].offsetWidth + 16;
  track.style.transform = `translateX(-${sliderIndex * slideW}px)`;
  
  document.querySelectorAll('.hero-dot').forEach((d, j) => {
    d.classList.toggle('active', j === sliderIndex);
  });
};

window.sliderPrev = function() { goToSlide(sliderIndex - 1); };
window.sliderNext = function() {
  const slides = document.getElementById('heroTrack')?.querySelectorAll('.hero-slide');
  goToSlide(slides ? (sliderIndex + 1) % slides.length : 0);
};

// ── PAGE: Courses (Paid) ─────────────────────────────────────
async function renderCourses() {
  updateNav('courses');
  $app.innerHTML = `
    <div class="page-header"><h1>Paid Courses</h1></div>
    <div class="section">
      <div class="course-grid" id="courseGrid">${skeletonCards(6)}</div>
    </div>
  `;

  try {
    const data = await api.get('courses');
    const grid = document.getElementById('courseGrid');
    if (data.courses?.length) {
      grid.innerHTML = data.courses.map((c, i) => renderCourseCard(c, i * 60)).join('');
    } else {
      grid.innerHTML = '<div class="empty-state"><div class="empty-icon">📚</div><p>No courses available</p></div>';
    }
  } catch (err) {
    document.getElementById('courseGrid').innerHTML = '<div class="empty-state"><p>Failed to load courses</p></div>';
  }
}

// ── PAGE: Free Courses ───────────────────────────────────────
async function renderFreeCourses() {
  updateNav('free-courses');
  $app.innerHTML = `
    <div class="page-header" style="background:linear-gradient(135deg,#059669,#10b981)"><h1>Free Courses</h1></div>
    <div class="section">
      <div class="course-grid" id="courseGrid">${skeletonCards(6)}</div>
    </div>
  `;

  try {
    const data = await api.get('free-courses');
    const grid = document.getElementById('courseGrid');
    if (data.courses?.length) {
      grid.innerHTML = data.courses.map((c, i) => renderCourseCard(c, i * 60)).join('');
    } else {
      grid.innerHTML = '<div class="empty-state"><div class="empty-icon">🎓</div><p>No free courses available right now</p></div>';
    }
  } catch (err) {
    document.getElementById('courseGrid').innerHTML = '<div class="empty-state"><p>Failed to load courses</p></div>';
  }
}

// ── PAGE: Course Detail ──────────────────────────────────────
async function renderCourseDetail(slug) {
  updateNav('');
  
  // Extract id and name from slug like "77-numerical-batch-2025-2026"
  const courseId = slug.split('-')[0];
  const courseName = slug.split('-').slice(1).join(' ').replace(/(^|\s)\w/g, l => l.toUpperCase());

  $app.innerHTML = `
    <div class="detail-hero">
      <div class="detail-inner">
        <div class="detail-image" id="detailImage">
          <div class="skeleton" style="aspect-ratio:16/9"></div>
        </div>
        <div class="detail-info">
          <a href="#/courses" class="back-btn" style="color:rgba(255,255,255,.7)">
            ${icons.arrow_left} Back to Courses
          </a>
          <h1 id="detailTitle">${esc(courseName) || 'Loading...'}</h1>
          <div class="detail-price" id="detailPrice"></div>
        </div>
      </div>
    </div>
    <div class="content-browser" id="contentArea">
      <div class="page-loader" style="min-height:200px">
        <div class="loader-spinner"></div>
        <p class="loader-text">Loading course content...</p>
      </div>
    </div>
  `;

  try {
    const data = await api.get(`course/${slug}`);
    
    // Update hero with real data
    if (data) {
      // Try to find course info from cached courses list
      const allCourses = api.cache.get('courses')?.courses || api.cache.get('home')?.featured || [];
      const courseInfo = allCourses.find(c => c.slug === slug || c.id == courseId);

      if (courseInfo) {
        document.getElementById('detailImage').innerHTML = `<img src="${courseInfo.image}" alt="${courseInfo.name}" onerror="this.src='${LOGO}'">`;
        document.getElementById('detailTitle').textContent = courseInfo.name;
        
        const hasDiscount = courseInfo.discount > 0 && courseInfo.originalPrice > courseInfo.price;
        document.getElementById('detailPrice').innerHTML = courseInfo.price === 0
          ? '<span style="color:#4ade80;font-size:28px;font-weight:800">FREE</span>'
          : `<span>₹${courseInfo.price.toLocaleString('en-IN')}</span>
             ${hasDiscount ? `<span class="detail-price-old">₹${courseInfo.originalPrice.toLocaleString('en-IN')}</span>` : ''}`;
      }

      // Fetch actual course folders from our new original backend proxy
      try {
        const foldersRes = await api.get(`folders?course_id=${courseId}&parent_id=-1`);
        if (foldersRes && foldersRes.data && foldersRes.data.length > 0) {
          renderFolders(courseId, foldersRes.data);
          return;
        }
      } catch (e) {
        console.warn('Could not fetch folders from proxy:', e);
      }

      if (data.description || data.course?.description) {
        contentArea.innerHTML = `
          <h2 style="font-size:22px;font-weight:700;margin-bottom:16px">About This Course</h2>
          <div class="desc-content">${data.description || data.course?.description || ''}</div>
        `;
      } else if (data.subjects?.length) {
        renderSubjects(data.subjects);
      } else {
        // Show whatever pageProps we got
        const pageData = data;
        let descHTML = '';
        
        // Try to extract description from various possible structures
        if (pageData.course) {
          const c = pageData.course;
          if (c.name) document.getElementById('detailTitle').textContent = c.name;
          if (c.externalImagUrl || c.image) {
            document.getElementById('detailImage').innerHTML = `<img src="${c.externalImagUrl || c.image}" alt="${c.name}" onerror="this.src='${LOGO}'">`;
          }
          if (c.description) descHTML = c.description;
          
          // Price
          if (c.discountedFee !== undefined) {
            const dp = document.getElementById('detailPrice');
            dp.innerHTML = c.discountedFee === 0
              ? '<span style="color:#4ade80;font-size:28px;font-weight:800">FREE</span>'
              : `<span>₹${Number(c.discountedFee).toLocaleString('en-IN')}</span>
                 ${c.fee > c.discountedFee ? `<span class="detail-price-old">₹${Number(c.fee).toLocaleString('en-IN')}</span>` : ''}`;
          }
        }

        // Try subjects from pageProps
        if (pageData.subjects?.length) {
          renderSubjects(pageData.subjects);
        } else if (pageData.course?.subjects?.length) {
          renderSubjects(pageData.course.subjects);
        } else {
          contentArea.innerHTML = descHTML 
            ? `<h2 style="font-size:22px;font-weight:700;margin-bottom:16px">About This Course</h2>
               <div class="desc-content">${descHTML}</div>`
            : `<div class="empty-state" style="min-height:200px">
                <div class="empty-icon">📖</div>
                <p>Course content will be available soon</p>
                <a href="https://study.munilsir.com/new-courses/${slug}" target="_blank" 
                   style="margin-top:16px;padding:10px 24px;background:var(--primary);color:#fff;border-radius:10px;font-weight:600;font-size:14px">
                  View on Original Site
                </a>
               </div>`;
        }
      }
    }
  } catch (err) {
    console.error('Course detail error:', err);
    document.getElementById('contentArea').innerHTML = `
      <div class="empty-state" style="min-height:200px">
        <div class="empty-icon">⚠️</div>
        <p>Could not load course details</p>
        <a href="https://study.munilsir.com/new-courses/${slug}" target="_blank"
           style="margin-top:16px;padding:10px 24px;background:var(--primary);color:#fff;border-radius:10px;font-weight:600;font-size:14px">
          View on Original Site
        </a>
      </div>`;
  }
}

// ── Render Dynamic Folders & Videos ──────────────────────────
function renderFolders(courseId, items, parentEl = null) {
  const container = parentEl || document.getElementById('contentArea');
  if (!parentEl) {
    container.innerHTML = `<h2 style="font-size:22px;font-weight:700;margin-bottom:16px">Course Content</h2><div class="content-list" id="rootFolders"></div>`;
  }
  
  const listEl = parentEl || document.getElementById('rootFolders');
  
  const html = items.map((item, i) => {
    const isFolder = item.material_type === 'FOLDER';
    const isVideo = item.material_type === 'VIDEO';
    const isPdf = item.material_type === 'DOCUMENT' || item.material_type === 'PDF';
    
    let icon = icons.link;
    if (isFolder) icon = icons.folder;
    if (isVideo) icon = icons.video;
    if (isPdf) icon = icons.pdf;

    // We store data-course and data-id to fetch sub-folders
    return `
      <div class="content-item" style="animation-delay:${i*20}ms" 
           onclick="handleContentClick(this, '${courseId}', '${item.id}', '${item.material_type}', '${item.video_player_url || item.url || item.file_link || item.pdf_link || ''}')">
        <div class="content-icon ${isFolder ? 'folder' : ''}">${icon}</div>
        <div class="content-details" style="flex:1">
          <span class="content-title" style="display:block">${esc(item.Title || item.name || item.title || 'Untitled')}</span>
          ${isVideo && item.duration ? `<span class="content-meta" style="font-size:12px;color:#888">${item.duration}</span>` : ''}
        </div>
        <span class="content-meta loader-icon" style="display:none">⌛</span>
        ${isFolder ? `<span class="content-meta chevron">${icons.chevron}</span>` : ''}
      </div>
      <div class="sub-folders" id="sub-${item.id}" style="display:none; padding-left: 20px; border-left: 1px solid #eee; margin-left: 10px;"></div>
    `;
  }).join('');

  if (parentEl) {
    listEl.innerHTML = html;
  } else {
    listEl.innerHTML += html;
  }
}

window.handleContentClick = async function(el, courseId, itemId, type, url) {
  if (type === 'VIDEO') {
    const loader = el.querySelector('.loader-icon');
    const title = el.querySelector('.content-title');
    
    // Show loading
    if (loader) loader.style.display = 'inline-block';
    if (title) title.style.opacity = '0.5';

    try {
      const response = await fetch(`/api/video?course_id=${courseId}&video_id=${itemId}`);
      const data = await response.json();

      let videoUrl = url;
      
      if (data && data.success && data.url) {
        videoUrl = data.url;
      }
      
      openMediaModal(videoUrl, type);
    } catch (err) {
      alert('Failed to load secure video link.');
      console.error(err);
    } finally {
      if (loader) loader.style.display = 'none';
      if (title) title.style.opacity = '1';
    }
    return;
  }
  
  if (type === 'DOCUMENT' || type === 'PDF') {
    if (url) {
      openMediaModal(url, type);
    } else {
      alert('Content URL not found. It might be encrypted or live class.');
    }
    return;
  }

  // It's a folder
  const subDiv = document.getElementById(`sub-${itemId}`);
  const loader = el.querySelector('.loader-icon');
  const chevron = el.querySelector('.chevron');
  
  if (subDiv.style.display === 'block') {
    subDiv.style.display = 'none'; // Collapse
    if(chevron) chevron.style.transform = 'rotate(0deg)';
    return;
  }

  // Expand
  if(chevron) chevron.style.transform = 'rotate(90deg)';
  
  if (subDiv.innerHTML.trim() === '') {
    // Fetch sub-contents
    if(loader) loader.style.display = 'inline-block';
    if(chevron) chevron.style.display = 'none';
    
    try {
      const res = await api.get(`folders?course_id=${courseId}&parent_id=${itemId}`);
      if(loader) loader.style.display = 'none';
      if(chevron) chevron.style.display = 'inline-block';
      
      if (res && res.data && res.data.length > 0) {
        subDiv.style.display = 'block';
        renderFolders(courseId, res.data, subDiv);
      } else {
        subDiv.innerHTML = '<div style="padding:10px;color:#888;font-size:13px">Empty folder</div>';
        subDiv.style.display = 'block';
      }
    } catch (e) {
      if(loader) loader.style.display = 'none';
      if(chevron) chevron.style.display = 'inline-block';
      subDiv.innerHTML = '<div style="padding:10px;color:red;font-size:13px">Failed to load contents</div>';
      subDiv.style.display = 'block';
    }
  } else {
    subDiv.style.display = 'block';
  }
};

// ── Router Handler ───────────────────────────────────────────
async function handleRoute() {
  const route = getRoute();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Show loader briefly
  $app.innerHTML = `
    <div class="page-loader">
      <div class="loader-spinner"></div>
      <p class="loader-text">Loading...</p>
    </div>
  `;

  switch (route.page) {
    case 'home':
      await renderHome();
      break;
    case 'courses':
      await renderCourses();
      break;
    case 'free-courses':
      await renderFreeCourses();
      break;
    case 'course-detail':
      await renderCourseDetail(route.slug);
      break;
    default:
      await renderHome();
  }
}

// ── Hamburger Toggle ─────────────────────────────────────────
document.getElementById('hamburger')?.addEventListener('click', () => {
  document.getElementById('hamburger').classList.toggle('open');
  document.getElementById('mobileMenu').classList.toggle('open');
});

// ── Media Modal Player ───────────────────────────────────────
function openMediaModal(url, type) {
  let modal = document.getElementById('mediaModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'mediaModal';
    modal.innerHTML = `
      <div class="modal-overlay" onclick="closeMediaModal()"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3 id="modalTitle">Media Player</h3>
          <button class="modal-close" onclick="closeMediaModal()">&times;</button>
        </div>
        <div class="modal-body" id="modalBody"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const modalBody = document.getElementById('modalBody');
  const modalTitle = document.getElementById('modalTitle');
  modalTitle.innerText = type === 'VIDEO' ? 'Video Player' : 'Document Viewer';

  if (type === 'VIDEO') {
    // Check if it's an m3u8
    if (url.includes('.m3u8')) {
      modalBody.innerHTML = `<video id="appxHlsVideo" controls autoplay style="width:100%; height:100%; border-radius: 8px;"></video>`;
      
      const setupHls = () => {
        const video = document.getElementById('appxHlsVideo');
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(url);
          hls.attachMedia(video);
          window.currentHls = hls; // Save reference to destroy later
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // For Safari
          video.src = url;
        }
      };

      if (!window.Hls) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1';
        script.onload = setupHls;
        document.head.appendChild(script);
      } else {
        setupHls();
      }
    } else if (url.includes('.mp4')) {
      modalBody.innerHTML = `
        <video controls autoplay style="width:100%; height:100%; border-radius: 8px;">
          <source src="${url}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      `;
    } else {
      // Fallback to iframe for AppX video player URLs or encrypted links
      modalBody.innerHTML = `<iframe src="${url}" style="width:100%; height:100%; border:none; border-radius: 8px;" allowfullscreen allow="autoplay; encrypted-media"></iframe>`;
    }
  } else {
    modalBody.innerHTML = `<iframe src="${url}" style="width:100%; height:100%; border:none; border-radius: 8px;"></iframe>`;
  }

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden'; // prevent background scrolling
}

window.closeMediaModal = function() {
  const modal = document.getElementById('mediaModal');
  if (modal) {
    modal.style.display = 'none';
    if (window.currentHls) {
      window.currentHls.destroy();
      window.currentHls = null;
    }
    document.getElementById('modalBody').innerHTML = ''; // clear iframe/video to stop playback
    document.body.style.overflow = 'auto';
  }
}

// ── App Initialization ─────────────────────────────────────────────────────
window.addEventListener('hashchange', handleRoute);
window.addEventListener('load', handleRoute);

// Make navigate available globally
window.navigate = navigate;
