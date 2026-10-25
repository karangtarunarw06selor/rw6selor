
"use strict";

const socket = io(window.location.origin, {

    path: "/chess/socket.io",

    transports: ["polling"]

});

socket.on("connect", () => {

    setConnection("Connected", "connected");

});

socket.on("connect_error", (err) => {

    setConnection("Connection Error", "error");

    showToast(err.message, "error", "Socket Error");

});

socket.on("publicWaiting", () => {

    const publicStatus = document.getElementById("publicStatus");

    const btn = document.getElementById("findPublicBtn");

    if (publicStatus) publicStatus.innerText = "Menunggu lawan...";

    if (btn) btn.innerText = "Searching...";

    showToast("Menunggu player lain masuk.", "info", "Public Match");

});

socket.on("publicMatched", (data) => {

    const roomCode = data?.roomCode;

    if (!roomCode) {

        showToast("Room public tidak valid.", "error", "Match Error");

        return;

    }

    showToast("Lawan ditemukan. Masuk game...", "success", "Match Found");

    setTimeout(() => {

        window.location.href = "/chess/game.html?room=" + encodeURIComponent(roomCode) + "&type=public";

    }, 650);

});

function findPublicMatch() {

    const btn = document.getElementById("findPublicBtn");

    const publicStatus = document.getElementById("publicStatus");

    if (btn) btn.innerText = "Searching...";

    if (publicStatus) publicStatus.innerText = "Mencari lawan...";

    socket.emit("findPublicMatch");

}

function createPrivateRoom() {

    const roomCode = generateRoomCode();

    window.location.href = "/chess/game.html?room=" + encodeURIComponent(roomCode) + "&type=private";

}

function joinPrivateRoom() {

    const input = document.getElementById("privateRoomInput");

    const value = input.value.trim().toUpperCase();

    if (!value) {

        showToast("Masukkan kode room private.", "warning", "Kode kosong");

        return;

    }

    window.location.href = "/chess/game.html?room=" + encodeURIComponent(value) + "&type=private";

}

function generateRoomCode() {

    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "";

    for (let i = 0; i < 6; i++) {

        code += chars[Math.floor(Math.random() * chars.length)];

    }

    return code;

}

function setConnection(text, state) {

    const el = document.getElementById("connectionStatus");

    if (!el) return;

    el.innerText = text;

    el.classList.remove("connected", "error");

    if (state) {

        el.classList.add(state);

    }

}

function showToast(message, type = "info", title = "Info") {

    const container = document.getElementById("toastContainer");

    if (!container) {

        console.log(title + ": " + message);

        return;

    }

    const toast = document.createElement("div");

    toast.className = "toast " + type;

    const iconMap = {

        success: "✓",

        error: "!",

        warning: "!",

        info: "i"

    };

    toast.innerHTML = `

        <div class="toast-icon">${iconMap[type] || "i"}</div>

        <div class="toast-content">

            <p class="toast-title">${title}</p>

            <p class="toast-message">${message}</p>

        </div>

        <button class="toast-close" type="button" aria-label="Close">×</button>

    `;

    toast.querySelector(".toast-close").addEventListener("click", () => {

        toast.remove();

    });

    container.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 2800);

}
