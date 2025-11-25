// src/idb.js
let db;
export function initDB(onReady){
  const request = indexedDB.open("BibliotecaDB", 1);
  request.onupgradeneeded = function(e){
    db = e.target.result;
    const store = db.createObjectStore("livros", { keyPath: "id", autoIncrement: true });
    store.createIndex("titulo", "titulo", { unique: false });
  };
  request.onsuccess = function(e){
    db = e.target.result;
    if (onReady) onReady();
  };
  request.onerror = function(e){
    console.error("IndexedDB error", e);
    alert("Erro no IndexedDB: " + e.target.error);
  };
}

export function addBook(book){
  return new Promise((res, rej) => {
    const tx = db.transaction("livros", "readwrite");
    const store = tx.objectStore("livros");
    const req = store.add(book);
    req.onsuccess = () => res(req.result);
    req.onerror = (e) => rej(e);
  });
}

export function getAllBooks(){
  return new Promise((res, rej) => {
    const tx = db.transaction("livros", "readonly");
    const store = tx.objectStore("livros");
    const items = [];
    store.openCursor().onsuccess = function(e){
      const cursor = e.target.result;
      if (cursor){
        items.push(cursor.value);
        cursor.continue();
      } else {
        res(items);
      }
    };
  });
}

export function deleteBook(id){
  return new Promise((res, rej) => {
    const tx = db.transaction("livros", "readwrite");
    const store = tx.objectStore("livros");
    const req = store.delete(id);
    req.onsuccess = () => res();
    req.onerror = (e) => rej(e);
  });
}
