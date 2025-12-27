import { auth, db } from "/js/firebase.js";

import {
  collection, addDoc, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const list = document.getElementById("deadlineList");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  loadDeadlines(user.uid);
});

window.addDeadline = async function () {
  const title = document.getElementById("title").value;
  const date = document.getElementById("date").value;
  const category = document.getElementById("category").value;

  const user = auth.currentUser;
  if (!title || !date) return alert("fill all");

  await addDoc(
    collection(db, "users", user.uid, "deadlines"),
    { title, date, category }
  );

  loadDeadlines(user.uid);
};

async function loadDeadlines(uid) {
  list.innerHTML = "";
  const snap = await getDocs(
    collection(db, "users", uid, "deadlines")
  );

  snap.forEach(d => {
    const x = d.data();
    list.innerHTML += `
      <div class="card">
        <b>${x.title}</b><br>
        ${x.date} • ${x.category}
      </div>
    `;
  });
}
