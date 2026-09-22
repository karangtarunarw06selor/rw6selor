// Isi file online-tracker.js
(function() {
  const URL_API_MMS = "https://script.google.com/macros/s/AKfycbzbXLQ8kBNDh-xTaOpamrzdRuZTFbNGIZwToVh7TfmpOg4C0scshNs7tgDsjKfAAXzlvg/exec"; 
  
  // Buat element badge secara otomatis via JS agar tidak perlu copas HTML-nya
  let badge = document.createElement('div');
  badge.id = "umumActiveBadge";
  badge.style.cssText = "display: none; position: absolute; top: 75px; right: 20px; z-index: 999; cursor: pointer; background-color: rgba(255, 255, 255, 0.95); color: #2E7D32; padding: 6px 14px; border-radius: 30px; font-size: 0.72rem; font-weight: bold; border: 1px solid #C8E6C9; box-shadow: 0 3px 10px rgba(0,0,0,0.15); align-items: center; width: fit-content; transition: all 0.3s ease;";
  badge.innerHTML = `<span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #4CAF50; margin-right: 6px; box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); animation: dotPulseUmumMMS 1.5s infinite cubic-bezier(0.66, 0, 0, 1);"></span><span id="umumUserCount">0</span> Pengunjung Online`;
  
  // Tambahkan style animasi pulse
  let style = document.createElement('style');
  style.innerHTML = `@keyframes dotPulseUmumMMS { to { box-shadow: 0 0 0 8px rgba(76, 175, 80, 0); } }`;
  document.head.appendChild(style);

  let namaPengunjungUmum = localStorage.getItem('mms_umum_anonymous_name') || ("Pengunjung-" + Math.floor(100 + Math.random() * 900));
  localStorage.setItem('mms_umum_anonymous_name', namaPengunjungUmum);

  function kirimPingAktifUmum() {
    fetch(`${URL_API_MMS}?aksi=pingUmum&namaUser=${encodeURIComponent(namaPengunjungUmum)}`, { cache: "no-store" })
      .then(r => r.json())
      .then(res => {
        if(res.status === 'success' && res.onlineUsers) {
          document.getElementById('umumUserCount').innerText = res.onlineUsers.length;
          badge.style.display = 'inline-flex';
        }
      }).catch(() => {});
  }

  document.addEventListener("DOMContentLoaded", function() {
    document.body.appendChild(badge); // Tempel badge otomatis ke body
    kirimPingAktifUmum();
    setInterval(kirimPingAktifUmum, 15000);
  });
})();
