// src/main.js
import { initDB, addBook, getAllBooks, deleteBook } from './idb.js';

const preview = document.getElementById('preview');
const btnFoto = document.getElementById('btnFoto');
const canvas = document.getElementById('canvas');
const btnSalvar = document.getElementById('btnSalvar');
const lista = document.getElementById('lista');
const switchCam = document.getElementById('switchCam');

let currentStream = null;
let currentFacing = 'environment'; // or 'user'
let lastPhoto = null;

async function startCamera(){
  try {
    if (currentStream){
      currentStream.getTracks().forEach(t=>t.stop());
    }
    const constraints = { video: { facingMode: currentFacing, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false };
    currentStream = await navigator.mediaDevices.getUserMedia(constraints);
    preview.srcObject = currentStream;
    await preview.play();
  } catch (err){
    console.error('Erro ao iniciar camera', err);
    alert('Não foi possível acessar a câmera. Verifique permissões.');
  }
}

btnFoto && btnFoto.addEventListener('click', ()=>{
  if (!currentStream){
    alert('Câmera não iniciada');
    return;
  }
  const w = preview.videoWidth || 640;
  const h = preview.videoHeight || 480;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(preview, 0, 0, w, h);
  const data = canvas.toDataURL('image/png');
  lastPhoto = data;
  document.getElementById('fotoPreview').src = data;
});

switchCam && switchCam.addEventListener('click', ()=>{
  currentFacing = currentFacing === 'environment' ? 'user' : 'environment';
  startCamera();
});

btnSalvar && btnSalvar.addEventListener('click', async ()=>{
  const titulo = document.getElementById('titulo').value.trim();
  const autor = document.getElementById('autor').value.trim();
  const status = document.getElementById('status').value;
  if (!titulo){
    alert('Preencha o título');
    return;
  }
  const foto = lastPhoto || document.getElementById('fotoPreview').src || '';
  await addBook({ titulo, autor, status, foto });
  document.getElementById('formLivro').reset();
  lastPhoto = null;
  document.getElementById('fotoPreview').src = '';
  renderList();
});

async function renderList(){
  const items = await getAllBooks();
  lista.innerHTML = '';
  if (!items.length) {
    lista.innerHTML = '<p class="vazio">Nenhum livro cadastrado</p>';
    return;
  }
  items.reverse().forEach(item=>{
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <div class="capa"><img src="${item.foto || 'public/assets/covers/cover1.png'}" alt="capa"/></div>
      <div class="conteudo">
        <h3>${item.titulo}</h3>
        <p class="autor">${item.autor || '—'}</p>
        <p class="status">Status: ${item.status || '—'}</p>
        <div class="acoes">
          <button class="remover" data-id="${item.id}">Remover</button>
        </div>
      </div>
    `;
    lista.appendChild(div);
  });
  // attach remove listeners
  lista.querySelectorAll('.remover').forEach(btn=>{
    btn.addEventListener('click', async (e)=>{
      const id = Number(e.currentTarget.getAttribute('data-id'));
      if (confirm('Remover este livro?')) {
        await deleteBook(id);
        renderList();
      }
    });
  });
}

// init
initDB(()=>{ startCamera(); renderList(); });

// register service worker if available
if ('serviceWorker' in navigator){
  navigator.serviceWorker.register('/sw.js').catch(e=>console.warn('SW register failed', e));
}
