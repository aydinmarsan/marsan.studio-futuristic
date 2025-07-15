// === PIP-BOY 3000 UI ===
const sections = document.querySelectorAll('.section');
const menuBtns = document.querySelectorAll('.menu-btn');
menuBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    menuBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    sections.forEach(sec => sec.classList.remove('active'));
    document.getElementById(btn.dataset.section + '-section').classList.add('active');
  });
});

// --- Notes ---
const notesList = document.querySelector('.notes-list');
const addNoteBtn = document.querySelector('.add-note-btn');
const noteEditorModal = document.querySelector('.note-editor-modal');
const noteTextarea = document.querySelector('.note-textarea');
const saveNoteBtn = document.querySelector('.save-note-btn');
const cancelNoteBtn = document.querySelector('.cancel-note-btn');
let editingNoteId = null;

function getNotes() {
  return JSON.parse(localStorage.getItem('pipboy_notes') || '[]');
}
function saveNotes(notes) {
  localStorage.setItem('pipboy_notes', JSON.stringify(notes));
}
function renderNotes() {
  const notes = getNotes();
  notesList.innerHTML = '';
  notes.forEach((note, idx) => {
    const div = document.createElement('div');
    div.className = 'note-item';
    div.innerHTML = `<div class="note-content">${note.text.replace(/\n/g, '<br>')}</div>
      <div class="note-actions">
        <button data-edit="${idx}">Düzenle</button>
        <button data-delete="${idx}">Sil</button>
      </div>`;
    notesList.appendChild(div);
  });
}
addNoteBtn.onclick = () => {
  editingNoteId = null;
  noteTextarea.value = '';
  noteEditorModal.classList.remove('hidden');
  noteTextarea.focus();
};
notesList.onclick = e => {
  if (e.target.dataset.edit !== undefined) {
    const notes = getNotes();
    editingNoteId = +e.target.dataset.edit;
    noteTextarea.value = notes[editingNoteId].text;
    noteEditorModal.classList.remove('hidden');
    noteTextarea.focus();
  } else if (e.target.dataset.delete !== undefined) {
    const notes = getNotes();
    notes.splice(+e.target.dataset.delete, 1);
    saveNotes(notes);
    renderNotes();
  }
};
saveNoteBtn.onclick = () => {
  const notes = getNotes();
  if (editingNoteId !== null) {
    notes[editingNoteId].text = noteTextarea.value;
  } else {
    notes.push({ text: noteTextarea.value });
  }
  saveNotes(notes);
  renderNotes();
  noteEditorModal.classList.add('hidden');
};
cancelNoteBtn.onclick = () => {
  noteEditorModal.classList.add('hidden');
};
window.addEventListener('DOMContentLoaded', renderNotes);

// --- Links ---
const linksCategories = document.querySelector('.links-categories');
const addLinkBtn = document.querySelector('.add-link-btn');
const linkEditorModal = document.querySelector('.link-editor-modal');
const linkName = document.querySelector('.link-name');
const linkUrl = document.querySelector('.link-url');
const linkCategory = document.querySelector('.link-category');
const saveLinkBtn = document.querySelector('.save-link-btn');
const cancelLinkBtn = document.querySelector('.cancel-link-btn');
let editingLink = null;

function getLinks() {
  return JSON.parse(localStorage.getItem('pipboy_links') || '[]');
}
function saveLinks(links) {
  localStorage.setItem('pipboy_links', JSON.stringify(links));
}
function renderLinks() {
  const links = getLinks();
  const categories = {};
  links.forEach((link, idx) => {
    if (!categories[link.category]) categories[link.category] = [];
    categories[link.category].push({ ...link, idx });
  });
  linksCategories.innerHTML = '';
  Object.keys(categories).forEach(cat => {
    const group = document.createElement('div');
    group.className = 'link-category-group';
    group.innerHTML = `<div class="link-category-header" tabindex="0">${cat || 'Uncategorized'} <span>[${categories[cat].length}]</span></div>
      <div class="link-list"></div>`;
    const list = group.querySelector('.link-list');
    categories[cat].forEach(link => {
      const item = document.createElement('div');
      item.className = 'link-item';
      item.innerHTML = `<a href="${link.url}" target="_blank" rel="noopener">${link.name}</a>
        <div class="link-actions">
          <button data-edit="${link.idx}">Edit</button>
          <button data-delete="${link.idx}">Delete</button>
        </div>`;
      list.appendChild(item);
    });
    group.querySelector('.link-category-header').onclick = () => {
      list.classList.toggle('hidden');
    };
    group.querySelector('.link-category-header').onkeydown = e => {
      if (e.key === 'Enter' || e.key === ' ') list.classList.toggle('hidden');
    };
    linksCategories.appendChild(group);
  });
}
addLinkBtn.onclick = () => {
  editingLink = null;
  linkName.value = '';
  linkUrl.value = '';
  linkCategory.value = '';
  linkEditorModal.classList.remove('hidden');
  linkName.focus();
};
linksCategories.onclick = e => {
  if (e.target.dataset.edit !== undefined) {
    const links = getLinks();
    editingLink = +e.target.dataset.edit;
    const link = links[editingLink];
    linkName.value = link.name;
    linkUrl.value = link.url;
    linkCategory.value = link.category;
    linkEditorModal.classList.remove('hidden');
    linkName.focus();
  } else if (e.target.dataset.delete !== undefined) {
    const links = getLinks();
    links.splice(+e.target.dataset.delete, 1);
    saveLinks(links);
    renderLinks();
  }
};
saveLinkBtn.onclick = () => {
  const links = getLinks();
  if (editingLink !== null) {
    links[editingLink] = {
      name: linkName.value,
      url: linkUrl.value,
      category: linkCategory.value
    };
  } else {
    links.push({
      name: linkName.value,
      url: linkUrl.value,
      category: linkCategory.value
    });
  }
  saveLinks(links);
  renderLinks();
  linkEditorModal.classList.add('hidden');
};
cancelLinkBtn.onclick = () => {
  linkEditorModal.classList.add('hidden');
};
window.addEventListener('DOMContentLoaded', renderLinks);

// --- Settings ---
const toggleFlicker = document.querySelector('.toggle-flicker');
const toggleScanlines = document.querySelector('.toggle-scanlines');
const fontSizeSelect = document.querySelector('.font-size-select');
const contrastSelect = document.querySelector('.contrast-select');
const crtOverlay = document.querySelector('.crt-overlay');

function applySettings() {
  document.body.classList.toggle('no-flicker', !toggleFlicker.checked);
  crtOverlay.style.display = toggleScanlines.checked ? '' : 'none';
  document.body.style.fontSize = fontSizeSelect.value === 'small' ? '14px' : fontSizeSelect.value === 'large' ? '20px' : '16px';
  document.body.style.filter = contrastSelect.value === 'high' ? 'contrast(1.5)' : 'contrast(1)';
}
toggleFlicker.onchange = applySettings;
toggleScanlines.onchange = applySettings;
fontSizeSelect.onchange = applySettings;
contrastSelect.onchange = applySettings;
window.addEventListener('DOMContentLoaded', applySettings);

// --- Retro Animations ---
// Button click/section change flicker
menuBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    document.body.classList.add('flicker');
    setTimeout(() => document.body.classList.remove('flicker'), 120);
  });
});
// Modal open/close flicker
[noteEditorModal, linkEditorModal].forEach(modal => {
  if (!modal) return;
  modal.addEventListener('transitionend', () => {
    if (!modal.classList.contains('hidden')) {
      document.body.classList.add('flicker');
      setTimeout(() => document.body.classList.remove('flicker'), 120);
    }
  });
});
// Blinking CRT cursor
const crtCursor = document.querySelector('.crt-cursor');
let cursorBlink = true;
setInterval(() => {
  if (cursorBlink) crtCursor.style.visibility = crtCursor.style.visibility === 'hidden' ? 'visible' : 'hidden';
}, 500);
// Keyboard navigation (optional, basic)
document.addEventListener('keydown', e => {
  if (e.altKey && e.key === '1') menuBtns[0].click();
  if (e.altKey && e.key === '2') menuBtns[1].click();
  if (e.altKey && e.key === '3') menuBtns[2].click();
}); 