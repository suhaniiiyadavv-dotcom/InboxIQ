import { auth, db } from "./firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { seedMails } from "./seedMails.js";

const mailList = document.getElementById("mailList");
const previewBox = document.getElementById("previewBox");
const deadlineBox = document.getElementById("autoDeadlines");

let allMails = [];

/* ========= DATE EXTRACT ========= */
function extractDate(text) {
  const match = text.match(/(\d{1,2})\s*(sep|sept|oct|nov|dec)/i);
  if (!match) return null;

  const monthMap = {
    sep: "09", sept: "09",
    oct: "10", nov: "11", dec: "12"
  };

  const day = match[1].padStart(2, "0");
  const month = monthMap[match[2].toLowerCase()];
  const year = new Date().getFullYear();

  return `${year}-${month}-${day}`;
}

/* ========= AUTH ========= */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const mailQuery = query(
    collection(db, "mails"),
    where("userId", "==", user.uid)
  );

  // 🔥 FIRST FETCH
  let snap = await getDocs(mailQuery);

  // 🔥 FIRST LOGIN → AUTO SEED
  if (snap.empty) {
    await seedMails(user.uid);
    snap = await getDocs(mailQuery); // re-fetch after seeding
  }

  allMails = [];
  snap.forEach(d => allMails.push(d.data()));
  renderMails(allMails);

  /* ========= AUTO DEADLINES ========= */
  for (const mail of allMails) {
    if (!mail.hasDeadline) continue;

    const date = extractDate(
      `${mail.subject} ${mail.body}`.toLowerCase()
    );
    if (!date) continue;

    const exists = await getDocs(
      query(
        collection(db, "users", user.uid, "deadlines"),
        where("title", "==", mail.subject),
        where("date", "==", date)
      )
    );

    if (exists.empty) {
      await addDoc(
        collection(db, "users", user.uid, "deadlines"),
        {
          title: mail.subject,
          date,
          category: mail.category,
          source: "auto"
        }
      );
    }
  }

  showDeadlines(user.uid);
});

/* ========= UI ========= */
function renderMails(list) {
  mailList.innerHTML = "";
  if (!list.length) {
    mailList.innerHTML = "<p>No mails</p>";
    return;
  }

  list.forEach(m => {
    const div = document.createElement("div");
    div.className = "card";
    if (m.hasDeadline) div.classList.add("deadline");

    div.innerHTML = `
      <h4>${m.subject}</h4>
      <small>${m.category}</small>
    `;
    div.onclick = () => showPreview(m);
    mailList.appendChild(div);
  });
}

function showPreview(mail) {
  previewBox.innerHTML = `
    <h3>${mail.subject}</h3>
    <p>${mail.body}</p>
  `;
}

/* ========= DEADLINES PANEL ========= */
async function showDeadlines(uid) {
  deadlineBox.innerHTML = "";
  const snap = await getDocs(
    collection(db, "users", uid, "deadlines")
  );

  snap.forEach(d => {
    const x = d.data();
    deadlineBox.innerHTML += `
      <div class="card deadline">
        <b>${x.title}</b><br>
        ${x.date}
      </div>
    `;
  });
}

/* ========= FILTER ========= */
window.filter = function (cat) {
  renderMails(
    cat === "All"
      ? allMails
      : allMails.filter(m => m.category === cat)
  );
};
