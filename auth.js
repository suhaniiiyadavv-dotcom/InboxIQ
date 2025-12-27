import { auth, db } from "/js/firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { seedMails } from "./seedMails.js";

/* ===== LOGIN ===== */
const loginBtn = document.getElementById("loginBtn");
const msg = document.getElementById("authMsg");

if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "index.html";
    } catch (err) {
      msg.innerText = err.message;
    }
  });
}

/* ===== SIGNUP (FIXED) ===== */
window.signup = async function () {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!name || !email || !password) {
    alert("All fields required");
    return;
  }

  try {
    // 1️⃣ Create auth user
    const res = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = res.user;

    // 2️⃣ Create Firestore user doc
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      createdAt: new Date().toISOString()
    });

    // 3️⃣ Seed mails ONLY HERE
    await seedMails(user.uid);

    // 4️⃣ Redirect
    window.location.href = "index.html";

  } catch (err) {
    alert(err.message);
  }
};
