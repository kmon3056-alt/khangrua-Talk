import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAYnOsZdL9-Zih0T-0p3ymZlJKmw2EMXvU",
    authDomain: "khangrua-talk.firebaseapp.com",
    projectId: "khangrua-talk",
    storageBucket: "khangrua-talk.firebasestorage.app",
    messagingSenderId: "469334186402",
    appId: "1:469334186402:web:d9d6ea0e0ed2e892c27afb",
    measurementId: "G-TNFZBG4J1T"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const postsCol = collection(db, "posts");

// ฟังก์ชันสลับหน้า
window.showPage = (pageId) => {
    document.getElementById('feed-page').classList.toggle('hidden', pageId !== 'feed-page');
    document.getElementById('create-page').classList.toggle('hidden', pageId !== 'create-page');
};

// 1. ดึงโพสต์มาแสดงผล (Real-time)
const q = query(postsCol, orderBy("createdAt", "desc"));
onSnapshot(q, (snapshot) => {
    const postsList = document.getElementById('posts-list');
    postsList.innerHTML = "";
    snapshot.forEach((doc) => {
        const post = doc.data();
        const html = `
            <div class="post-card">
                <div class="post-user"><i class="fas fa-user-circle"></i> <span>นิรนาม</span></div>
                <div class="post-title">${post.title}</div>
                <div class="post-stats">
                    <i class="far fa-comment"></i> 0 comments &nbsp;
                    <i class="far fa-heart"></i> 0 likes &nbsp;
                    <i class="far fa-clock"></i> เมื่อสักครู่
                </div>
            </div>
        `;
        postsList.insertAdjacentHTML('beforeend', html);
    });
});

// 2. บันทึกโพสต์ใหม่
document.getElementById('btn-post').addEventListener('click', async () => {
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    const allowComments = document.getElementById('allow-comments').checked;

    if (title && content) {
        try {
            await addDoc(postsCol, {
                title: title,
                content: content,
                allowComments: allowComments,
                createdAt: serverTimestamp()
            });
            // ล้างข้อมูลและกลับหน้าหลัก
            document.getElementById('post-title').value = "";
            document.getElementById('post-content').value = "";
            showPage('feed-page');
        } catch (e) {
            alert("เกิดข้อผิดพลาดในการโพสต์");
        }
    } else {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    }
});
