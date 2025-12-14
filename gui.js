
(function () {
  const PANEL_WIDTH = 380;

  if (typeof dat === 'undefined' || typeof dat.GUI === 'undefined') {
    console.warn('dat.GUI not found — gui.js did nothing.');
    return;
  }

  // ---------- THEMED CSS ----------
  const css = `
/* ===== Clean Retro-Modern dat.GUI — final, no duplicate overrides ===== */

/* Panel host */
#gui-container {
  width: 380px;
  position: fixed;
  top: 12px;
  right: 18px;
  z-index: 99999;
  isolation: isolate;
  box-sizing: border-box;
  pointer-events: auto;
  -webkit-font-smoothing: antialiased;
}

/* Core panel */
#gui-container > .dg {
  width: 380px;
  padding: 10px;
  border-radius: 0;
  background:  #12172a !important;
  border: 1px solid rgba(148,163,255,0.12);
  box-shadow: none;
  backdrop-filter: blur(10px);
  box-sizing: border-box;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  overflow: hidden;            /* clip children to keep corners clean */
  color: #f1f5ff;
  font-family: 'Poppins', 'Segoe UI', system-ui, -apple-system, sans-serif;
}

/* Folder title / header */
#gui-container .dg .title,
#gui-container .dg .folder > .title {
  height: 28px;
  line-height: 28px;
  padding: 0 14px;
  margin: 6px 0 10px;
  display:flex;
  align-items:center;
  filter: none !important;
  outline: 1px solid rgba(0,0,0,0.35);
  outline-offset: -1px;
  justify-content:center;
  background: #2a3550;
  background-size: 600% 600%;
  animation: gradientShift 10s ease infinite;
  color: #ffffff; /* bright text */
  font-family: 'Press Start 2P', 'Orbitron', cursive; /* retro fonts */
  font-weight: 800;
  letter-spacing: 0.1rem;
  animation: none !important;
  text-transform: uppercase;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.2);
  box-shadow: none !important;
  text-shadow: none !important;
  background-image: linear-gradient(
    135deg,
    #e9c6d4 0%,
    #eadff0 35%,
    #cfe4f0 75%,
    #2a3550 100%
  ) !important;
  font-size: 12px;
  transition: transform .12s ease, opacity .12s ease;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
/* Folder title styling */
#gui-container .dg .folder > .title {
  background: linear-gradient(135deg, #ff00cc, #ffcc00, #00ffff, #ff00cc);
  color: #fff;
  font-family: 'Press Start 2P', 'Orbitron', cursive;
  font-weight: 800;
  letter-spacing: 0.1rem;
  border: 1px solid rgba(255,255,255,0.2);
  box-shadow: none;
  text-shadow: none;
}

/* Buttons with neon glow */
#gui-container .dg ul li button,
#gui-container .dg li button,
#gui-container .dg .gui-clock-btn {
  background: linear-gradient(135deg, #ff00cc, #00ffff, #ffcc00);
  color: #fff;
  font-family: 'Press Start 2P', 'Orbitron', cursive;
  font-weight: 700;
  border-radius: 10px;
  box-shadow: none !important;
  text-shadow: none !important;
  border: none;
  transition: all 0.2s ease;
}
#gui-container .dg ul li button:hover,
#gui-container .dg li button:hover,
#gui-container .dg .gui-clock-btn:hover {
  box-shadow: none;
  cursor: pointer;
}
/* Slight header hover */
#gui-container .dg .title:hover,
#gui-container .dg .folder .title:hover {
  transform: translateY(-2px);
  opacity: 0.98;
}

/* Rows & folders */
#gui-container .dg .cr,
#gui-container .dg .folder,
#gui-container .dg .folder ul {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background: transparent;
}

/* Numeric slider row */
#gui-container .dg .cr.number {
  display:flex;
  align-items:center;
  gap:10px;
  padding: 4px 12px;
}
#gui-container .dg .cr.number .slider {
  position: relative !important;
  flex: 1 1 auto !important;
  min-width: 0 !important;
  height: 28px !important;
  padding: 0 !important;
  margin: 0 !important;
  background: linear-gradient(90deg, #1a2138, #121826);
  border: 1px solid rgba(244,181,198,0.10);
  border-radius: 14px;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: none !important;
}
#gui-container .dg .cr.number .slider-fg {
  position: absolute;
  left: 3px;
  top: 3px;
  bottom: 3px;
  width: 0%;                  /* dynamic */
  border-radius: 12px;
  background: linear-gradient(90deg,#f4b5c6,#aee2ff);
  pointer-events: none;
  transition: width 0.12s ease-out;
  box-shadow: none !important;
}

#gui-container .dg .cr.number .slider input[type="range"] {
  -webkit-appearance:none; appearance:none; width:100%; height:100%; background:transparent; cursor:pointer; margin:0;
}
#gui-container .dg .cr.number .slider input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance:none; width:16px; height:16px; border-radius:50%; background:#f4b5c6; margin-top:-4px; border:none;
}
#gui-container .dg .cr.number .slider input[type="range"]::-webkit-slider-runnable-track {
  height:7px; border-radius:7px; background: linear-gradient(90deg,#f4b5c6,#aee2ff);
}
/* ================================
   REAL FIX — dat.GUI VALUE INPUT
   ================================ */

#gui-container .dg .cr.number .property input {
  background: linear-gradient(
    135deg,
    #f4b5c6 0%,
    #f7d8ff 35%,
    #aee2ff 75%,
    #27355c 100%
  ) !important;

  color: #0f1113 !important;
  font-weight: 800 !important;
  font-size: 13px !important;
  text-align: center !important;

  border-radius: 8px !important;
  border: 1px solid rgba(255,255,255,0.25) !important;

  box-shadow: none !important;

  height: 24px !important;
  padding: 0 6px !important;

  background-clip: padding-box !important;
  -webkit-background-clip: padding-box !important;
}

/* remove native input fill */
#gui-container .dg .cr.number .property {
  background: transparent !important;
}

/* Button hover */
#gui-container .dg ul li button:hover,
#gui-container .dg li button:hover,
#gui-container .dg .gui-clock-btn:hover {
  transform: translateY(-2px);
  opacity: 0.96;
}

/* Ensure list items and rows are transparent and have no box-shadow */
#gui-container .dg ul,

#gui-container .dg .folder ul,
#gui-container .dg .cr {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
  margin: 0 !important;
  list-style: none !important;
}
  
/* === Retro Gradient COLOR ONLY (keeps your current shape & spacing) === */
#gui-container .dg ul li button,
#gui-container .dg li button,
#gui-container .dg .gui-clock-btn,
#gui-container .dg .cr button,
#gui-container .dg .close {
  background: linear-gradient(
    135deg,
    #f4b5c6 0%,   /* soft retro pink */
    #f7d8ff 35%,  /* lavender highlight */
    #aee2ff 75%,  /* sky blue */
    #27355c 100%  /* deep retro navy */
  ) !important;

  color: #111 !important;          /* clean dark text */
  border: 1px solid rgba(255,255,255,0.15) !important;
  background-clip: padding-box !important;
  -webkit-background-clip: padding-box !important;
}
/* === FIX: Force retro gradient on dat.GUI folder headings === */
/* Restore heading background */
#gui-container .dg .folder > .title {
  background: linear-gradient(135deg,#f4b5c6 0%,#f7d8ff 35%,#aee2ff 75%,#27355c 100%) !important;
  color: #0f1113 !important;
  font-weight: 800 !important;
  letter-spacing: .22rem !important;
  border-radius: 10px !important;
  border: 1px solid rgba(255,255,255,0.15) !important;
  padding: 0 14px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-height: 28px !important;
}

/* Iframe / Clock container */
#gui-container .dg iframe {
  width: calc(100% - 24px);
  height: 140px;
  margin: 6px 12px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.24);
  box-sizing: border-box;
  background: linear-gradient(180deg, #bfbfbf, #999999);
  background-clip: padding-box;
}

/* Mobile fallback */
@media (max-width:520px){
  #gui-container{ right:12px; top:8px; width: calc(100% - 28px); }
  #gui-container > .dg { 
  width: calc(100% - 28px);
  outline: 1px solid rgba(0,0,0,0.6);
  outline-offset: -1px;
   padding: 8px; }
  #gui-container .dg iframe { height: 110px; margin: 6px 8px; }
  #gui-container .dg ul li button,
  #gui-container .dg button,
  #gui-container .dg .gui-clock-btn,
  #gui-container .dg .cr button { width:100%; height:30px; margin:6px 0; }
}

/* Rendering helpers */
#gui-container, #gui-container > .dg, #gui-container .dg .main {
  -webkit-backface-visibility: hidden;
  transform: translateZ(0);
}
/* === Button radius / corner cleanup === */
/* Ensure li containers are transparent so button corners are visible cleanly */
#gui-container .dg ul li,
#gui-container .dg ul,
#gui-container .dg .cr {
  background: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
  box-shadow: none !important;
}

/* Single authoritative button shape and shadow */
#gui-container .dg ul li button,
#gui-container .dg li button,
#gui-container .dg .gui-clock-btn,
#gui-container .dg .cr button {
  border-radius: 10px !important;          /* uniform pill radius */
  overflow: hidden !important;             /* clip any inner bg/shadows */
  box-shadow: none;/* soft shadow */
  border: 1px solid rgba(255,255,255,0.06) !important;
  background-clip: padding-box !important;
}

/* If you want slightly taller top/bottom rounding for the top and bottom buttons
   when they sit stacked, use first/last child rules (keeps middle buttons flatter) */
#gui-container .dg ul li:first-child button {
  border-top-left-radius: 12px !important;
  border-top-right-radius: 12px !important;
}
#gui-container .dg ul li:last-child button {
  border-bottom-left-radius: 12px !important;
  border-bottom-right-radius: 12px !important;
}

/* Prevent adjacent shadows from creating a visible stripe:
   add a tiny separation by giving each button a small vertical margin */
#gui-container .dg ul li button {
  margin-top: 6px !important;
  margin-bottom: 0 !important;
}

/* Keep buttons visually centered and same width */
#gui-container .dg ul li button,
#gui-container .dg .gui-clock-btn {
  width: calc(100% - 24px) !important;
  display: block !important;
  text-align: center !important;
}
/* make dat.GUI folder titles visible and retro-styled (safe — only color/box) */
#gui-container .dg .folder > .title {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-height: 28px !important;
  padding: 0 14px !important;
  margin: 6px 0 10px !important;
  background: linear-gradient(135deg,#f4b5c6 0%, #f7d8ff 35%, #aee2ff 75%, #27355c 100%) !important;
  color: #0f1113 !important;
  border: 1px solid rgba(255,255,255,0.12) !important;
  border-radius: 10px !important;
  box-shadow: none;
  background-clip: padding-box !important;
  -webkit-background-clip: padding-box !important;
  z-index: 2 !important;
}
#gui-container .dg .folder > .title span {
  color: inherit !important;
  font-weight: 800 !important;
  letter-spacing: 0.22rem;
}
/* ======================================
   SAME RETRO COLORS — ALL TITLES
   ====================================== */

#gui-container .dg .folder > .title,
#gui-container .dg .title {
  background: linear-gradient(
    135deg,
    #f4b5c6 0%,   /* retro pink */
    #f7d8ff 35%,  /* soft lavender */
    #aee2ff 75%,  /* sky blue */
    #27355c 100%  /* deep retro navy */
  ) !important;

  color: #0f1113 !important;
  font-weight: 800 !important;
  letter-spacing: 0.22rem !important;
  text-transform: uppercase !important;

  border-radius: 12px !important;
  border: 1px solid rgba(255,255,255,0.15) !important;

  box-shadow: none;
}

/* Text inside title */
#gui-container .dg .folder > .title span {
  color: inherit !important;
  text-shadow: none !important;
}
/* ======================================
   FORCE STYLE — dat.GUI NUMBER VALUE (0.3)
   ====================================== */

/* Cover ALL possible value elements */
#gui-container .dg .cr.number .property,
#gui-container .dg .cr.number .property input,
#gui-container .dg .cr.number input[type="text"] {
  background: linear-gradient(
    135deg,
    #f4b5c6 0%,
    #f7d8ff 35%,
    #aee2ff 75%,
    #27355c 100%
  ) !important;

  color: #0f1113 !important;
  font-weight: 800 !important;
  font-size: 13px !important;
  text-align: center !important;

  border-radius: 8px !important;
  border: 1px solid rgba(255,255,255,0.2) !important;

  box-shadow: none !important;

  min-width: 46px !important;
  height: 24px !important;
  text-shadow: none !important;
  line-height: 24px !important;
  padding: 0 6px !important;

  appearance: none !important;
  -webkit-appearance: none !important;
}

/* Remove native input chrome */
#gui-container .dg .cr.number input {
  background: transparent !important;
  outline: none !important;
}
#gui-container .dg * {
  box-shadow: none !important;
  text-shadow: none !important;
}
`;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ---------- HOST ELEMENT ----------
  let host = document.getElementById('gui-container');
  if (!host) {
    host = document.createElement('div');
    host.id = 'gui-container';
    document.body.appendChild(host);
  }

  // ---------- CREATE GUI ----------
  const gui = new dat.GUI({ autoPlace: false, width: PANEL_WIDTH });
  host.appendChild(gui.domElement);

    // Remove default dat.GUI bottom "Close Controls" bar
  const defaultCloseBar = gui.domElement.querySelector('.close-button');
  if (defaultCloseBar && defaultCloseBar.parentNode) {
    defaultCloseBar.parentNode.removeChild(defaultCloseBar);
  }

  // ---------- Mini Reopen Button ----------
const miniButton = document.createElement('button');
miniButton.id = 'gui-mini-btn';
miniButton.textContent = 'GUI';
miniButton.style.position = 'fixed';
miniButton.style.bottom = '16px';
miniButton.style.right = '16px';
miniButton.style.zIndex = '999999';
miniButton.style.padding = '6px 10px';
miniButton.style.borderRadius = '8px';
miniButton.style.border = 'none';
miniButton.style.fontSize = '12px';
miniButton.style.fontWeight = '700';
miniButton.style.cursor = 'pointer';
miniButton.style.background = '#f4b5c6';
miniButton.style.color = '#111';
miniButton.style.display = 'none'; // hidden until GUI is closed
document.body.appendChild(miniButton);


// Show GUI (ensure GUI really reopens)
function showGUI() {
  host.style.display = 'block';

  if (gui && gui.domElement) {
    gui.domElement.style.display = 'block';
  }
  if (gui && typeof gui.open === 'function') {
    gui.open(); // reopen folders if needed
  }

  miniButton.style.display = 'none';
}
function updateSliderFill(controller, value) {
  const li = controller.domElement.closest('.cr.number');
  if (!li) return;

  const slider = li.querySelector('.slider');
  let fg = slider.querySelector('.slider-fg');

  if (!fg) {
    fg = document.createElement('div');
    fg.className = 'slider-fg';
    slider.appendChild(fg);
  }

  const min = controller.__min;
  const max = controller.__max;
  const pct = ((value - min) / (max - min)) * 100;

  fg.style.width = pct + '%';
}

// Hide GUI (only hide container)
function hideGUI() {
  host.style.display = 'none';
  miniButton.style.display = 'block';
}

// Reopen GUI when clicking mini btn
miniButton.addEventListener('click', showGUI);

// ---------- WAVE CONTROL ----------
const waveObj = { amplitude: 0.3 };

if (window.material &&
    window.material.uniforms &&
    window.material.uniforms.amplitude) {
  try {
    waveObj.amplitude = window.material.uniforms.amplitude.value;
  } catch (e) { /* ignore */ }
}

const waveFolder = gui.addFolder('Wave Settings');
const waveController = waveFolder
  .add(waveObj, 'amplitude', 0.0, 1.0, 0.01)
  .name('Wave Intensity');

waveController.onChange((v) => {
  if (window.material &&
      window.material.uniforms &&
      window.material.uniforms.amplitude) {
    window.material.uniforms.amplitude.value = v;
  }

  updateSliderFill(waveController, v);
});

  waveFolder.open();

window._waveGUI = {
  GUI: gui,
  host: host,
  setAmplitude: (v) => {
    waveObj.amplitude = v;
    waveController.setValue(v);
    updateSliderFill(waveController, v);

    if (
      window.material &&
      window.material.uniforms &&
      window.material.uniforms.amplitude
    ) {
      window.material.uniforms.amplitude.value = v;
    }
  }
};

  // ---------- CLOCK FOLDER ----------
  const clockFolder = gui.addFolder('Clock');
  clockFolder.open();

  const clockWrapper = document.createElement('div');
  clockWrapper.style.width = '100%';
  clockWrapper.style.display = 'flex';
  clockWrapper.style.flexDirection = 'column';
  clockWrapper.style.padding = '6px 0 0 0';

  const clockIframe = document.createElement('iframe');
  clockIframe.src = 'https://amaro0o0o.github.io/THREE.JS_clock/';
  clockIframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms');
  clockIframe.setAttribute('referrerpolicy', 'no-referrer');
  clockIframe.style.height = '140px';
  clockIframe.style.border = 'none';
  clockWrapper.appendChild(clockIframe);

  const openBtnLi = document.createElement('li');
  openBtnLi.className = 'cr';
  openBtnLi.style.listStyle = 'none';
  openBtnLi.style.padding = '2px 0';
  openBtnLi.style.margin = '0';
  openBtnLi.style.width = '100%';

  const openBtn = document.createElement('button');
  openBtn.className = 'gui-clock-btn';
  openBtn.textContent = 'Open Full Clock';
  openBtn.style.width = '100%';
  openBtn.style.margin = '0';
  openBtn.addEventListener('click', () => {
    window.open('https://amaro0o0o.github.io/THREE.JS_clock/', '_blank', 'noopener,noreferrer');
  });
  openBtnLi.appendChild(openBtn);

  const clockList = clockFolder.domElement.querySelector('ul');
  if (clockList) {
    clockList.appendChild(clockWrapper);
    clockList.appendChild(openBtnLi);
    // Custom Close GUI button
// Custom Close GUI button
const closeBtnLi = document.createElement('li');
closeBtnLi.className = 'cr';
closeBtnLi.style.listStyle = 'none';
closeBtnLi.style.margin = '6px 0 4px 0';

const closeBtn = document.createElement('button');
closeBtn.textContent = 'Close Controls';
closeBtn.style.width = '100%';

// 👉 Hide full GUI when clicking this
closeBtn.addEventListener('click', hideGUI);

closeBtnLi.appendChild(closeBtn);
clockList.appendChild(closeBtnLi);


  } else {
    gui.domElement.appendChild(clockWrapper);
    gui.domElement.appendChild(openBtnLi);
  }

  // Start with GUI visible
  showGUI();
})();
