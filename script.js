import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase Configuration จากที่คุณให้มา
const firebaseConfig = {
    apiKey: "AIzaSyAYnOsZdL9-Zih0T-0p3ymZlJKmw2EMXvU",
    authDomain: "khangrua-talk.firebaseapp.com",
    projectId: "khangrua-talk",
    storageBucket: "khangrua-talk.firebasestorage.app",
    messagingSenderId: "469334186402",
    appId: "1:469334186402:web:d9d6ea0e0ed2e892c27afb",
    measurementId: "G-TNFZBG4J1T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messagesCol = collection(db, "chats");

const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const chatBox = document.getElementById('chat-box');

// 1. ส่งข้อความไปยัง Firestore
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = messageInput.value.trim();

    if (text !== "") {
        try {
            await addDoc(messagesCol, {
                text: text,
                createdAt: serverTimestamp(),
                sender: "user1" // ในอนาคตสามารถเปลี่ยนเป็นระบบ Login ได้
            });
            messageInput.value = "";
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }
});

// 2. ดึงข้อมูลแบบ Real-time
const q = query(messagesCol, orderBy("createdAt", "asc"));
onSnapshot(q, (snapshot) => {
    chatBox.innerHTML = "";
    snapshot.forEach((doc) => {
        const data = doc.data();
        const messageDiv = document.createElement('div');
        
        // กำหนด class ตามผู้ส่ง (ตัวอย่างนี้จำลองว่าเป็น sent ทั้งหมดก่อน)
        messageDiv.classList.add('message', 'sent');
        messageDiv.textContent = data.text;
        
        chatBox.appendChild(messageDiv);
    });
    // เลื่อนลงไปล่างสุดเมื่อมีข้อความใหม่
    chatBox.scrollTop = chatBox.scrollHeight;
});
