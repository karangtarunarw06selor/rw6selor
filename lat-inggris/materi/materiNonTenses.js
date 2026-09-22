// =========================================================================
// 4. SUB-ROUTER A: JALUR KHUSUS BAB 1 & BAB 4 (NON-TENSES) - CODESYNC FIX
// =========================================================================
import { state } from '../state.js';

export function prosesMateriNonTenses(namaMateriKolomC, subMateriKolomD, idLower, dataCocok) {
    let boxVisualMateri = document.getElementById("box-media-materi");
    let boxPembahasan = document.getElementById("box-txt-pembahasan");
    let boxSilabus = document.getElementById("box-txt-silabus");
    let judulTense = document.getElementById("lbl-judul-tense-aktif");

    let isiContoh = (dataCocok.contohKalimat || "").replace(/\\n/g, "\n");
    let isiArti = (dataCocok.arti || "").replace(/\\n/g, "\n");

    let labelTipeTeks = subMateriKolomD.replace(/-/g, " ").toUpperCase();
    if (judulTense) judulTense.innerHTML = `Modul: <b>${dataCocok.materi || namaMateriKolomC} (${labelTipeTeks})</b>`;
    if(boxSilabus) boxSilabus.innerText = dataCocok.judulBab || "MMS Ruang Literasi";

    let isiKontenLaci = "";

    if (idLower === "bab1-pronowns" || idLower === "bab1-pronouns") {
        isiKontenLaci = `
            <div style="color: #b45309; font-weight: bold; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-table"></i> Complete Pronouns Reference Matrix Table
            </div>
            <div style="overflow-x:auto;">
                <table style="width:100%; border-collapse:collapse; background:#fff; font-size:12px; border-radius:6px; overflow:hidden; border: 1px solid #cbd5e1; text-align:center;">
                    <thead>
                        <tr style="background:#fef08a; color:#0f172a; border-bottom:2px solid #fde047; font-weight:700;">
                            <th style="padding:10px 6px; border-right:1px solid #cbd5e1; text-align:left;">Person / Number</th>
                            <th style="padding:10px 6px; border-right:1px solid #cbd5e1;">Subject Pronouns</th>
                            <th style="padding:10px 6px; border-right:1px solid #cbd5e1;">Object Pronouns</th>
                            <th style="padding:10px 6px; border-right:1px solid #cbd5e1;">Possessive Adjectives</th>
                            <th style="padding:10px 6px; border-right:1px solid #cbd5e1;">Possessive Pronouns</th>
                            <th style="padding:10px 6px;">Reflexive Pronouns</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 6px; text-align:left; font-weight:600; background:#fffdf5; border-right:1px solid #cbd5e1;"> Orang Pertama</td>
                            <td style="padding:9px 6px; font-weight:700; color:#0f172a; border-right:1px solid #cbd5e1;">I</td>
                            <td style="padding:9px 6px; color:#475569; border-right:1px solid #cbd5e1;">Me</td>
                            <td style="padding:9px 6px; color:#475569; border-right:1px solid #cbd5e1;">My</td>
                            <td style="padding:9px 6px; color:#475569; border-right:1px solid #cbd5e1;">Mine</td>
                            <td style="padding:9px 6px; color:#475569;">Myself</td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 6px; text-align:left; font-weight:600; background:#fffdf5; border-right:1px solid #cbd5e1;"> Orang Kedua</td>
                            <td style="padding:9px 6px; font-weight:700; color:#0f172a; border-right:1px solid #cbd5e1;">You</td>
                            <td style="padding:9px 6px; color:#475569; border-right:1px solid #cbd5e1;">You</td>
                            <td style="padding:9px 6px; color:#475569; border-right:1px solid #cbd5e1;">Your</td>
                            <td style="padding:9px 6px; color:#475569; border-right:1px solid #cbd5e1;">Yours</td>
                            <td style="padding:9px 6px; color:#475569;">Yourself</td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 6px; text-align:left; font-weight:600; background:#fffdf5; border-right:1px solid #cbd5e1;">Orang Ketiga (male)</td>
                            <td style="padding:9px 6px; font-weight:700; color:#0f172a; border-right:1px solid #cbd5e1;">He</td>
                            <td style="padding:9px 6px; color:#475569; border-right:1px solid #cbd5e1;">Him</td>
                            <td style="padding:9px 6px; color:#475569; border-right:1px solid #cbd5e1;">His</td>
                            <td style="padding:9px 6px; color:#475569; border-right:1px solid #cbd5e1;">His</td>
                            <td style="padding:9px 6px; color:#475569;">Himself</td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 6px; text-align:left; font-weight:600; background:#fffdf5; border-right:1px solid #cbd5e1;">Orang Ketiga (female)</td>
                            <td style="padding:9px 6px; font-weight:700; color:#0f172a; border-right:1px solid #cbd5e1;">She</td>
                            <td style="padding:9px 6px; color:#475569; border-right:1px solid #cbd5e1;">Her</td>
                            <td style="padding:9px 6px; color:#475569; border-right:1px solid #cbd5e1;">Her</td>
                            <td style="padding:9px 6px; color:#475569; border-right:1px solid #cbd5e1;">Hers</td>
                            <td style="padding:9px 6px; color:#475569;">Herself</td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 6px; text-align:left; font-weight:600; background:#fffdf5; border-right:1px solid #cbd5e1;">Orang Ketiga (non-living)</td>
                            <td style="padding:9px 6px; font-weight:700; color:#0f172a; border-right:1px solid #cbd5e1;">It</td>
                            <td style="padding:9px 6px; color:#475569; border-right:1px solid #cbd5e1;">It</td>
                            <td style="padding:9px 6px; color:#475569; border-right:1px solid #cbd5e1;">Its</td>
                            <td style="padding:9px 6px; color:#475569; border-right:1px solid #cbd5e1;">Its</td>
                            <td style="padding:9px 6px; color:#475569;">Itself</td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 6px; text-align:left; font-weight:600; background:#fffdf5; border-right:1px solid #cbd5e1;">Orang Pertama (Jamak)</td>
                            <td style="padding:9px 6px; font-weight:700; color:#0f172a; border-right:1px solid #cbd5e1;">We</td>
                            <td style="padding:9px 6px; color:#475569; border-right:1px solid #cbd5e1;">Us</td>
                            <td style="padding:9px 6px; color:#475569; border-right:1px solid #cbd5e1;">Our</td>
                            <td style="padding:9px 6px; color:#475569; border-right:1px solid #cbd5e1;">Ours</td>
                            <td style="padding:9px 6px; color:#475569;">Ourselves</td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 6px; text-align:left; font-weight:600; background:#fffdf5; border-right:1px solid #cbd5e1;">Orang Kedua (Jamak)</td>
                            <td style="padding:9px 10px; font-weight:700; color:#0f172a; border-right:1px solid #cbd5e1;">You</td>
                            <td style="padding:9px 10px; color:#475569; border-right:1px solid #cbd5e1;">You</td>
                            <td style="padding:9px 10px; color:#475569; border-right:1px solid #cbd5e1;">Your</td>
                            <td style="padding:9px 10px; color:#475569; border-right:1px solid #cbd5e1;">Yours</td>
                            <td style="padding:9px 10px; color:#475569;">Yourselves</td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 6px; text-align:left; font-weight:600; background:#fffdf5; border-right:1px solid #cbd5e1;">Orang Ketiga (Jamak)</td>
                            <td style="padding:9px 6px; font-weight:700; color:#0f172a; border-right:1px solid #cbd5e1;">They</td>
                            <td style="padding:9px 6px; color:#475569; border-right:1px solid #cbd5e1;">Them</td>
                            <td style="padding:9px 6px; color:#475569; border-right:1px solid #cbd5e1;">Their</td>
                            <td style="padding:9px 6px; color:#475569; border-right:1px solid #cbd5e1;">Theirs</td>
                            <td style="padding:9px 6px; color:#475569;">Themselves</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    } else if (idLower === "subject-verb-agreement" || idLower === "subject-verb-aggreement") {
        // 🎯 LOGIKA ADD-ON: BLOK KHUSUS UNTUK MATERI SUBJECT-VERB AGREEMENT
        isiKontenLaci = `
            <div style="color: #b45309; font-weight: bold; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-table-list"></i> Complete 11 Subject - Verb Agreement Rules Matrix Table
            </div>
            <div style="overflow-x:auto;">
                <table style="width:100%; border-collapse:collapse; background:#fff; font-size:12px; border-radius:6px; overflow:hidden; border: 1px solid #cbd5e1;">
                    <thead>
                        <tr style="background:#fef08a; color:#0f172a; border-bottom:2px solid #fde047; font-weight:700;">
                            <th style="padding:10px 8px; border-right:1px solid #cbd5e1; text-align:left; width:15%;">Aturan Pembuat</th>
                            <th style="padding:10px 8px; border-right:1px solid #cbd5e1; text-align:left; width:45%;">Pedoman Keterangan Rules</th>
                            <th style="padding:10px 8px; text-align:left; width:40%;">Contoh Konteks Penggunaan</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 8px; font-weight:700; background:#fffdf5; border-right:1px solid #cbd5e1; color:#0f172a;">RULES 1</td>
                            <td style="padding:9px 8px; border-right:1px solid #cbd5e1; color:#475569;">Singular subject diiringi singular verb (+s/-es). Plural subject diiringi plural verb (tanpa -s/-es).</td>
                            <td style="padding:9px 8px; font-style:italic; color:#0f172a;">Dara <b>runs</b> to the train station.</td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 8px; font-weight:700; background:#fffdf5; border-right:1px solid #cbd5e1; color:#0f172a;">RULES 2</td>
                            <td style="padding:9px 8px; border-right:1px solid #cbd5e1; color:#475569;">Jika noun phrase mengandung "of", kata kerja patuh pada noun <b>sebelum</b> kata "of".</td>
                            <td style="padding:9px 8px; font-style:italic; color:#0f172a;">The secrets of Nina <b>need</b> to be revealed immediately.</td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 8px; font-weight:700; background:#fffdf5; border-right:1px solid #cbd5e1; color:#0f172a;">RULES 3</td>
                            <td style="padding:9px 8px; border-right:1px solid #cbd5e1; color:#475569;">Singular subject yang dihubungkan dengan <i>or, either/or, neither/nor</i> wajib menggunakan singular verb.</td>
                            <td style="padding:9px 8px; font-style:italic; color:#0f172a;">Maybe Nanda or Ali <b>is</b> the one who did this.</td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 8px; font-weight:700; background:#fffdf5; border-right:1px solid #cbd5e1; color:#0f172a;">RULES 4</td>
                            <td style="padding:9px 8px; border-right:1px solid #cbd5e1; color:#475569;">Jika subjek berbeda (singular/plural) berpenghubung <i>or/nor</i>, verb mengikuti subjek terdekat.</td>
                            <td style="padding:9px 8px; font-style:italic; color:#0f172a;">Neither the children nor the keeper <b>enters</b> the zoo.</td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 8px; font-weight:700; background:#fffdf5; border-right:1px solid #cbd5e1; color:#0f172a;">RULES 5</td>
                            <td style="padding:9px 8px; border-right:1px solid #cbd5e1; color:#475569;">Dua subject tunggal yang dihubungkan oleh kata <i>and</i> wajib menggunakan plural verb.</td>
                            <td style="padding:9px 8px; font-style:italic; color:#0f172a;">My girlfriend and I <b>are going</b> to marry.</td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 8px; font-weight:700; background:#fffdf5; border-right:1px solid #cbd5e1; color:#0f172a;">RULES 6</td>
                            <td style="padding:9px 8px; border-right:1px solid #cbd5e1; color:#475569;">Phrase tambahan (<i>along with, as well as, besides</i>) pemisah subjek tidak dihitung dalam agreement.</td>
                            <td style="padding:9px 8px; font-style:italic; color:#0f172a;">Mr. Mark, along with his children, <b>goes</b> to the beach.</td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 8px; font-weight:700; background:#fffdf5; border-right:1px solid #cbd5e1; color:#0f172a;">RULES 7</td>
                            <td style="padding:9px 8px; border-right:1px solid #cbd5e1; color:#475569;">Dalam konstruksi kalimat awalan <i>there</i> atau <i>here</i>, verb mengikuti subjek asli di belakangnya.</td>
                            <td style="padding:9px 8px; font-style:italic; color:#0f172a;">Here <b>is</b> a candy for you. / There <b>are</b> seven kids.</td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 8px; font-weight:700; background:#fffdf5; border-right:1px solid #cbd5e1; color:#0f172a;">RULES 8</td>
                            <td style="padding:9px 8px; border-right:1px solid #cbd5e1; color:#475569;">Plural subject (seperti nominal uang/jarak/waktu) dianggap singular jika konteksnya adalah satu kesatuan.</td>
                            <td style="padding:9px 8px; font-style:italic; color:#0f172a;">Five thousand dollars per month <b>is</b> considered high.</td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 8px; font-weight:700; background:#fffdf5; border-right:1px solid #cbd5e1; color:#0f172a;">RULES 9</td>
                            <td style="padding:9px 8px; border-right:1px solid #cbd5e1; color:#475569;">Jika menggunakan determiner (<i>a lot of, all, some</i>), bentuk verb patuh pada kata benda sesudahnya.</td>
                            <td style="padding:9px 8px; font-style:italic; color:#0f172a;">A lot of students <b>are coming</b>.</td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 8px; font-weight:700; background:#fffdf5; border-right:1px solid #cbd5e1; color:#0f172a;">RULES 10</td>
                            <td style="padding:9px 8px; border-right:1px solid #cbd5e1; color:#475569;">Kata benda kelompok / collective noun (<i>team, family, population</i>) boleh menggunakan plural atau singular verb.</td>
                            <td style="padding:9px 8px; font-style:italic; color:#0f172a;">A third of population in the world <b>is</b> (atau <b>are</b>) male.</td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 8px; font-weight:700; background:#fffdf5; border-right:1px solid #cbd5e1; color:#0f172a;">RULES 11</td>
                            <td style="padding:9px 8px; border-right:1px solid #cbd5e1; color:#475569;">To be "were" mutlak digunakan dalam kalimat pengandaian/kontras imajinatif untuk semua bentuk subjek.</td>
                            <td style="padding:9px 8px; font-style:italic; color:#0f172a;">I wish you <b>were</b> here with me, Dad.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    } else if (idLower === "pos-pronoun") {
        isiKontenLaci = `
            <div style="color: #b45309; font-weight: bold; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-table"></i> Klasifikasi Jenis Pronoun
            </div>
            <div style="overflow-x:auto;">
                <table style="width:100%; border-collapse:collapse; background:#fff; font-size:13px; border-radius:6px; overflow:hidden; border: 1px solid #cbd5e1;">
                    <thead>
                        <tr style="background:#fef08a; color:#0f172a; border-bottom:2px solid #fde047;">
                            <th style="padding:10px; text-align:left; font-weight:700; border-right:1px solid #cbd5e1; width:35%;">Jenis Pronoun</th>
                            <th style="padding:10px; text-align:left; font-weight:700;">Pengertian &amp; Contoh</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Personal Pronouns</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Kata ganti yang menggantikan orang, hewan, atau benda tertentu. Dibedakan menjadi subjek dan objek.<br>
                                <span style="color:#2563eb; font-weight:600; font-style:italic;">Contoh Subjek:</span> I, you, he, she, they, we, it.<br>
                                <span style="color:#16a34a; font-weight:600; font-style:italic;">Contoh Objek:</span> me, you, him, her, them, us, it.
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Possessive Pronouns</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Kata ganti untuk menunjukkan kepemilikan.<br>
                                    <span style="color:#b45309; font-weight:600; font-style:italic;">Contoh:</span> mine, yours, his, her, theirs, ours, its.
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Kata ganti untuk menunjukkan lokasi, jarak, atau jumlah suatu benda.<br>
                                    <span style="color:#b45309; font-weight:600; font-style:italic;">Contoh:</span> this, that, these, those.
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Reflexive Pronouns</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Kata ganti yang digunakan ketika subjek dan objek dalam kalimat adalah orang yang sama.<br>
                                    <span style="color:#b45309; font-weight:600; font-style:italic;">Contoh:</span> myself, yourself, himself, themselves.
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Indefinite Pronouns</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Kata ganti untuk orang atau benda yang jumlah atau identitasnya tidak spesifik.<br>
                                    <span style="color:#b45309; font-weight:600; font-style:italic;">Contoh:</span> someone, anyone, everyone, everything.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    } else if (idLower === "pos-noun" || idLower === "bab1-noun") {
        isiKontenLaci = `
            <div style="color: #b45309; font-weight: bold; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-bookmark"></i> 1. Jenis-Jenis Noun (Kata Benda)
            </div>
            <div style="overflow-x:auto; margin-bottom: 18px;">
                <table style="width:100%; border-collapse:collapse; background:#fff; font-size:13px; border-radius:6px; overflow:hidden; border: 1px solid #cbd5e1;">
                    <thead>
                        <tr style="background:#fef08a; color:#0f172a; border-bottom:2px solid #fde047;">
                            <th style="padding:10px; text-align:left; font-weight:700; border-right:1px solid #cbd5e1; width:35%;">Kelompok Noun</th>
                            <th style="padding:10px; text-align:left; font-weight:700;">Perbandingan &amp; Contoh Kata</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Proper vs Common Noun</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                <span style="font-weight:600; color:#0f172a;">Proper (Spesifik &amp; Huruf Kapital):</span> London, Budi.<br>
                                <span style="font-weight:600; color:#0f172a;">Common (Umum):</span> city, book.
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Countable vs Uncountable</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                <span style="font-weight:600; color:#0f172a;">Countable (Bisa Dihitung Pasti):</span> an apple, three chairs.<br>
                                <span style="font-weight:600; color:#0f172a;">Uncountable (Tidak Bisa Dihitung Satuan):</span> water, money.
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Concrete vs Abstract Noun</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                <span style="font-weight:600; color:#0f172a;">Concrete (Berwujud &amp; Bisa Disentuh):</span> laptop, table.<br>
                                <span style="font-weight:600; color:#0f172a;">Abstract (Konsep, Ide, Perasaan):</span> happiness, courage.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style="color: #b45309; font-weight: bold; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-star"></i> 2. Fungsi Utama dalam Kalimat
            </div>
            <div style="overflow-x:auto;">
                <table style="width:100%; border-collapse:collapse; background:#fff; font-size:13px; border-radius:6px; overflow:hidden; border: 1px solid #cbd5e1;">
                    <thead>
                        <tr style="background:#fef08a; color:#0f172a; border-bottom:2px solid #fde047;">
                            <th style="padding:10px; text-align:left; font-weight:700; border-right:1px solid #cbd5e1; width:35%;">Peran Noun</th>
                            <th style="padding:10px; text-align:left; font-weight:700;">Pengertian &amp; Contoh</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Subjek</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Pelaku dari sebuah tindakan atau aktivitas.<br>
                                <span style="color:#2563eb; font-weight:600; font-style:italic;">Contoh:</span> "<span style="color:#0f172a; font-weight:700;">The cat</span> sleeps."
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Objek Langsung</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Pihak atau benda yang dikenai tindakan langsung oleh kata kerja.<br>
                                <span style="color:#2563eb; font-weight:600; font-style:italic;">Contoh:</span> "I ate <span style="color:#0f172a; font-weight:700;">an apple</span>."
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Objek Preposisi</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Kata benda yang mengikuti kata depan atau preposisi.<br>
                                <span style="color:#2563eb; font-weight:600; font-style:italic;">Contoh:</span> "She is studying in <span style="color:#0f172a; font-weight:700;">the library</span>."
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    } else if (idLower === "pos-verb") {
        isiKontenLaci = `
            <div style="color: #b45309; font-weight: bold; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-bookmark"></i> 1. Kategori Utama Verb (Berdasarkan Makna)
            </div>
            <div style="overflow-x:auto; margin-bottom: 18px;">
                <table style="width:100%; border-collapse:collapse; background:#fff; font-size:13px; border-radius:6px; overflow:hidden; border: 1px solid #cbd5e1;">
                    <thead>
                        <tr style="background:#fef08a; color:#0f172a; border-bottom:2px solid #fde047;">
                            <th style="padding:10px; text-align:left; font-weight:700; border-right:1px solid #cbd5e1; width:35%;">Bentuk Dasar</th>
                            <th style="padding:10px; text-align:left; font-weight:700;">Pengertian &amp; Contoh Kata</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Tindakan (Action)</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Kata kerja yang menunjukkan aktivitas fisik atau mental.<br>
                                <span style="color:#2563eb; font-weight:600; font-style:italic;">Contoh:</span> Run (lari), read (membaca), think (berpikir), write (menulis).
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Keadaan (State)</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Kata kerja yang tidak menggambarkan suatu aktivitas, melainkan kondisi atau keberadaan.<br>
                                <span style="color:#2563eb; font-weight:600; font-style:italic;">Contoh:</span> Seem (tampak), exist (ada), be (adalah).
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Kejadian (Occurrence)</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Kata kerja yang menunjukkan suatu proses atau peristiwa yang terjadi.<br>
                                <span style="color:#2563eb; font-weight:600; font-style:italic;">Contoh:</span> Die (meninggal), grow (tumbuh), happen (terjadi).
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style="color: #b45309; font-weight: bold; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-star"></i> 2. Jenis-Jenis Umum Verb (Dalam Penggunaan)
            </div>
            <div style="overflow-x:auto;">
                <table style="width:100%; border-collapse:collapse; background:#fff; font-size:13px; border-radius:6px; overflow:hidden; border: 1px solid #cbd5e1;">
                    <thead>
                        <tr style="background:#fef08a; color:#0f172a; border-bottom:2px solid #fde047;">
                            <th style="padding:10px; text-align:left; font-weight:700; border-right:1px solid #cbd5e1; width:35%;">Jenis Verb</th>
                            <th style="padding:10px; text-align:left; font-weight:700;">Pengertian &amp; Contoh Kata</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Action Verbs</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Kata kerja yang secara langsung menyatakan tindakan aksi.
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Auxiliary Verbs (Helping Verbs)</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Kata kerja bantu yang mendampingi kata kerja utama.<br>
                                <span style="color:#2563eb; font-weight:600; font-style:italic;">Contoh:</span> is, am, are, do, have, will, can.
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Transitive &amp; Intransitive Verbs</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Transitive membutuhkan objek langsung untuk melengkapi makna, sedangkan Intransitive tidak memerlukan objek langsung.
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Regular &amp; Irregular Verbs</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                 Regular berubah bentuk dengan menambah -d/-ed di akhir kata, sedangkan Irregular berubah bentuk secara tidak beraturan.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    } else if (idLower === "pos-adjective") {
        isiKontenLaci = `
            <div style="color: #b45309; font-weight: bold; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-bookmark"></i> 1. Fungsi Utama dalam Kalimat
            </div>
            <div style="overflow-x:auto; margin-bottom: 18px;">
                <table style="width:100%; border-collapse:collapse; background:#fff; font-size:13px; border-radius:6px; overflow:hidden; border: 1px solid #cbd5e1;">
                    <thead>
                        <tr style="background:#fef08a; color:#0f172a; border-bottom:2px solid #fde047;">
                            <th style="padding:10px; text-align:left; font-weight:700; border-right:1px solid #cbd5e1; width:35%;">Posisi Adjective</th>
                            <th style="padding:10px; text-align:left; font-weight:700;">Pengertian &amp; Contoh</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Attributive Adjective</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Diletakkan tepat <span style="font-weight:700;">sebelum</span> kata benda (noun).<br>
                                <span style="color:#2563eb; font-weight:600; font-style:italic;">Contoh:</span> "She wore a <span style="color:#cc0202; font-weight:700;">red</span> dress." (Dia memakai gaun merah).
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Predicative Adjective</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Diletakkan <span style="font-weight:700;">setelah</span> linking verb (seperti is, am, are, was, were, become, feel, look).<br>
                                <span style="color:#2563eb; font-weight:600; font-style:italic;">Contoh:</span> "The sky is <span style="color:#3b82f6; font-weight:700;">blue</span>." (Langit itu biru).
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style="color: #b45309; font-weight: bold; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-star"></i> 2. Jenis-Jenis Adjective (Kategori Umum)
            </div>
            <div style="overflow-x:auto; margin-bottom: 18px;">
                <table style="width:100%; border-collapse:collapse; background:#fff; font-size:13px; border-radius:6px; overflow:hidden; border: 1px solid #cbd5e1;">
                    <thead>
                        <tr style="background:#fef08a; color:#0f172a; border-bottom:2px solid #fde047;">
                            <th style="padding:10px; text-align:left; font-weight:700; border-right:1px solid #cbd5e1; width:35%;">Kategori</th>
                            <th style="padding:10px; text-align:left; font-weight:700;">Penjelasan &amp; Contoh Kata</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Descriptive Adjective</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Menjelaskan sifat atau keadaan fisik/karakter.<br>
                                <span style="color:#2563eb; font-weight:600; font-style:italic;">Contoh:</span> beautiful, tall, lazy, smart.
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Quantitative Adjective</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Menjelaskan jumlah benda.<br>
                                <span style="color:#2563eb; font-weight:600; font-style:italic;">Contoh:</span> many, some, little, enough.
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Demonstrative Adjective</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Menunjuk benda secara spesifik.<br>
                                <span style="color:#2563eb; font-weight:600; font-style:italic;">Contoh:</span> this, that, these, those.
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Possessive Adjective</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Menunjukkan kepemilikan.<br>
                                <span style="color:#2563eb; font-weight:600; font-style:italic;">Contoh:</span> my, your, his, her, their.
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; font-weight:700; color:#0f172a; border-right:1px solid #cbd5e1;">
                                Menunjukkan angka atau urutan/tingkat.<br>
                                <span style="color:#2563eb; font-weight:600; font-style:italic;">Contoh:</span> two, first, double.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style="color: #b45309; font-weight: bold; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-arrow-down-short-wide"></i> 3. Posisi Berurutan (Adjective Order)
            </div>
            <div style="background:#fff; border: 1px solid #cbd5e1; padding: 12px; border-radius: 6px; box-sizing: border-box; line-height: 1.6;">
                <div style="font-size: 12.5px; color:#475569; margin-bottom: 8px;">Jika ada lebih dari satu kata sifat untuk menjelaskan satu kata benda, gunakan urutan penempatan standar internasional berikut:</div>
                <div style="overflow-x:auto; background: var(--mms-blue-light, #eef2ff); padding: 10px; border-radius: 6px; font-weight: bold; color: var(--mms-navy); font-size: 12px; text-align: center; white-space: nowrap; border: 1px solid #bfdbfe;">
                    Quantity ➔ Quality ➔ Size ➔ Age ➔ Shape ➔ Color ➔ Origin ➔ Material ➔ Purpose
                </div>
                <div style="margin-top: 10px; font-size: 13px; color: #0f172a; line-height: 1.5;">
                    <span style="color:#cc0202; font-weight:700; font-style:italic;">🔹 Contoh Gabungan Kalimat:</span><br>
                    "A <span style="font-weight:600; color:#2563eb;">beautiful</span>, <span style="font-weight:600; color:#2563eb;">small</span>, <span style="font-weight:600; color:#2563eb;">old</span>, <span style="font-weight:600; color:#2563eb;">round</span>, <span style="font-weight:600; color:#2563eb;">red</span>, <span style="font-weight:600; color:#2563eb;">Italian</span>, <span style="font-weight:600; color:#2563eb;">wooden</span> table."
                </div>
            </div>
        `;
    } else if (idLower === "pos-adverb") {
        isiKontenLaci = `
            <div style="color: #b45309; font-weight: bold; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-bookmark"></i> Jenis-Jenis Adverb yang Paling Umum
            </div>
            <div style="overflow-x:auto;">
                <table style="width:100%; border-collapse:collapse; background:#fff; font-size:13px; border-radius:6px; overflow:hidden; border: 1px solid #cbd5e1;">
                    <thead>
                        <tr style="background:#fef08a; color:#0f172a; border-bottom:2px solid #fde047;">
                            <th style="padding:10px; text-align:left; font-weight:700; border-right:1px solid #cbd5e1; width:35%;">Jenis Adverb</th>
                            <th style="padding:10px; text-align:left; font-weight:700;">Pengertian &amp; Contoh Kata</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Adverb of Manner</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Menjelaskan bagaimana suatu tindakan atau peristiwa dilakukan.<br>
                                <span style="color:#2563eb; font-weight:600; font-style:italic;">Contoh:</span> quickly, slowly, happily, beautifully, well, hard.
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Adverb of Place</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Menunjukkan lokasi atau tempat terjadinya suatu tindakan.<br>
                                <span style="color:#2563eb; font-weight:600; font-style:italic;">Contoh:</span> here, there, everywhere, nearby, inside, outside.
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Adverb of Time</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Menunjukkan kapan suatu tindakan atau peristiwa terjadi.<br>
                                <span style="color:#2563eb; font-weight:600; font-style:italic;">Contoh:</span> now, yesterday, tomorrow, soon, late, already.
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Adverb of Frequency</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Menunjukkan seberapa sering suatu tindakan dilakukan.<br>
                                <span style="color:#2563eb; font-weight:600; font-style:italic;">Contoh:</span> always, usually, often, sometimes, rarely, never.
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Adverb of Degree</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Menjelaskan tingkat, intensitas, atau sejauh mana suatu sifat atau tindakan berlaku.<br>
                                <span style="color:#2563eb; font-weight:600; font-style:italic;">Contoh:</span> very, extremely, quite, too, enough, almost.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    } else if (idLower === "pos-preposition" || idLower === "bab1-preposition") {
        isiKontenLaci = `
            <div style="color: #b45309; font-weight: bold; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-bookmark"></i> 1. Jenis-Jenis Preposition Utama
            </div>
            <div style="overflow-x:auto; margin-bottom: 18px;">
                <table style="width:100%; border-collapse:collapse; background:#fff; font-size:13px; border-radius:6px; overflow:hidden; border: 1px solid #cbd5e1;">
                    <thead>
                        <tr style="background:#fef08a; color:#0f172a; border-bottom:2px solid #fde047;">
                            <th style="padding:10px; text-align:left; font-weight:700; border-right:1px solid #cbd5e1; width:35%;">Kategori Preposition</th>
                            <th style="padding:10px; text-align:left; font-weight:700;">Penggunaan &amp; Contoh Kata</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Preposition of Time (Waktu)</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Digunakan untuk menunjukkan kapan suatu kejadian berlangsung.<br>
                                🔹 <span style="font-weight:600; color:#0f172a;">In</span> (bulan/tahun): <i>in May, in 2026</i><br>
                                🔹 <span style="font-weight:600; color:#0f172a;">On</span> (hari/tanggal): <i>on Monday, on October 1st</i><br>
                                🔹 <span style="font-weight:600; color:#0f172a;">At</span> (jam/waktu spesifik): <i>at 09:00 AM, at night</i>
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Preposition of Place (Tempat/Posisi)</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Digunakan untuk menunjukkan letak atau lokasi suatu objek.<br>
                                🔹 <span style="font-weight:600; color:#0f172a;">In</span> (di dalam ruang tertutup): <i>in the box</i><br>
                                🔹 <span style="font-weight:600; color:#0f172a;">On</span> (di atas permukaan): <i>on the table</i><br>
                                🔹 <span style="font-weight:600; color:#0f172a;">At</span> (di titik tertentu): <i>at the bus stop</i>
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Preposition of Direction (Arah)</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Digunakan untuk menunjukkan pergerakan atau ke mana suatu objek mengarah.<br>
                                🔹 <span style="font-weight:600; color:#0f172a;">To</span> (menuju): <i>I go to school</i><br>
                                🔹 <span style="font-weight:600; color:#0f172a;">Into</span> (ke dalam): <i>He jumps into the pool</i><br>
                                🔹 <span style="font-weight:600; color:#0f172a;">From</span> (dari): <i>He came from London</i>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style="color: #b45309; font-weight: bold; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-star"></i> 2. Contoh Penggunaan dalam Kalimat
            </div>
            <div style="overflow-x:auto;">
                <table style="width:100%; border-collapse:collapse; background:#fff; font-size:13px; border-radius:6px; overflow:hidden; border: 1px solid #cbd5e1;">
                    <thead>
                        <tr style="background:#fef08a; color:#0f172a; border-bottom:2px solid #fde047;">
                            <th style="padding:10px; text-align:left; font-weight:700; border-right:1px solid #cbd5e1; width:35%;">Kalimat Contoh</th>
                            <th style="padding:10px; text-align:left; font-weight:700;">Arti &amp; Hubungan Kata</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:600; font-style:italic; border-right:1px solid #cbd5e1;">The book is <span style="color:#2563eb; font-weight:700; font-style:normal;">on</span> the table.</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Buku itu ada <span style="font-weight:700; color:#0f172a;">di atas</span> meja.<br>
                                <span style="font-size:12px; color:#71717a;">*Kata <b>on</b> menghubungkan posisi buku (book) dengan meja (table).</span>
                            </td>
                        </tr>
                         <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:600; font-style:italic; border-right:1px solid #cbd5e1;">She was born <span style="color:#2563eb; font-weight:700; font-style:normal;">in</span> London <span style="color:#2563eb; font-weight:700; font-style:normal;">in</span> 1997.</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Dia lahir <span style="font-weight:700; color:#0f172a;">di</span> London <span style="font-weight:700; color:#0f172a;">pada</span> tahun 1997.<br> 
                                <span style="font-size:12px; color:#71717a;">*Dua kata <b>in</b> memiliki fungsi berbeda: satu untuk lokasi (London), satu untuk waktu (1997).</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    } else if (idLower === "pos-conjunction" || idLower === "bab1-conjunction") {
        isiKontenLaci = `
            <div style="color: #b45309; font-weight: bold; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-bookmark"></i> 1. Jenis-Jenis Conjunction Utama
            </div>
            <div style="overflow-x:auto; margin-bottom: 18px;">
                <table style="width:100%; border-collapse:collapse; background:#fff; font-size:13px; border-radius:6px; overflow:hidden; border: 1px solid #cbd5e1;">
                    <thead>
                        <tr style="background:#fef08a; color:#0f172a; border-bottom:2px solid #fde047;">
                            <th style="padding:10px; text-align:left; font-weight:700; border-right:1px solid #cbd5e1; width:35%;">Tipe Conjunction</th>
                            <th style="padding:10px; text-align:left; font-weight:700;">Pengertian &amp; Contoh Kata</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Coordinating Conjunction</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Menghubungkan kata, frasa, atau klausa yang setara secara tata bahasa.<br>
                                💡 <span style="font-weight:600; color:#b45309;">Metode Jembatan Keledai:</span> <b>FANBOYS</b><br>
                                🔹 <span style="font-weight:600; color:#0f172a;">For, And, Nor, But, Or, Yet, So</span>
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Subordinating Conjunction</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Menghubungkan anak kalimat (dependent clause) ke induk kalimatnya (independent clause).<br>
                                🔹 <span style="font-weight:600; color:#0f172a;">Contoh Kata:</span> Because, although, since, until, if, while, after.
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Correlative Conjunction</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Kata hubung yang selalu digunakan berpasangan untuk menghubungkan elemen kalimat yang setara.<br>
                                🔹 <span style="font-weight:600; color:#0f172a;">Contoh Pasangan:</span> Either...or, Neither...nor, Both...and, Not only...but also.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style="color: #b45309; font-weight: bold; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-star"></i> 2. Contoh Penggunaan dalam Kalimat
            </div>
            <div style="overflow-x:auto;">
                <table style="width:100%; border-collapse:collapse; background:#fff; font-size:13px; border-radius:6px; overflow:hidden; border: 1px solid #cbd5e1;">
                    <thead>
                        <tr style="background:#fef08a; color:#0f172a; border-bottom:2px solid #fde047;">
                            <th style="padding:10px; text-align:left; font-weight:700; border-right:1px solid #cbd5e1; width:35%;">Jenis Hubungan</th>
                            <th style="padding:10px; text-align:left; font-weight:700;">Contoh Kalimat &amp; Arti</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Setara (Coordinating)</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                "I wanted to go, <span style="color:#2563eb; font-weight:700;">but</span> it started to rain."<br>
                                <span style="font-size:12.5px; color:#71717a;"><i>Artinya: Saya ingin pergi, <b>tetapi</b> hujan mulai turun.</i></span>
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Sebab-Akibat (Subordinating)</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                "He stayed home <span style="color:#2563eb; font-weight:700;">because</span> he was sick."<br>
                                <span style="font-size:12.5px; color:#71717a;"><i>Artinya: Dia tinggal di rumah <b>karena</b> dia sakit.</i></span>
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Berpasangan (Correlative)</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                "She is <span style="color:#2563eb; font-weight:700;">not only</span> smart, <span style="color:#2563eb; font-weight:700;">but also</span> kind."<br>
                                <span style="font-size:12.5px; color:#71717a;"><i>Artinya: Dia <b>tidak hanya</b> pintar, <b>tetapi juga</b> baik hati.</i></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    } else if (idLower === "pos-interjection" || idLower === "bab1-interjection") {
        isiKontenLaci = `
            <div style="color: #b45309; font-weight: bold; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-bookmark"></i> 1. Karakteristik Utama Interjection
            </div>
            <div style="overflow-x:auto; margin-bottom: 18px;">
                <table style="width:100%; border-collapse:collapse; background:#fff; font-size:13px; border-radius:6px; overflow:hidden; border: 1px solid #cbd5e1;">
                    <thead>
                        <tr style="background:#fef08a; color:#0f172a; border-bottom:2px solid #fde047;">
                            <th style="padding:10px; text-align:left; font-weight:700; border-right:1px solid #cbd5e1; width:35%;">Karakteristik</th>
                            <th style="padding:10px; text-align:left; font-weight:700;">Penjelasan Sifat Penggunaan</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Spontan</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Diucapkan secara tiba-tiba untuk merespons sesuatu kejadian atau perasaan.
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Ekspresif</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Mewakili berbagai macam emosi manusia seperti senang, marah, terkejut, sedih, atau rasa sakit.
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Mandiri</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                Meskipun berdiri sendiri tanpa kalimat panjang, pendengar bisa langsung memahami emosi yang disampaikan.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style="color: #b45309; font-weight: bold; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-star"></i> 2. Jenis &amp; Contoh Kata (Dalam Bahasa Inggris)
            </div>
            <div style="overflow-x:auto;">
                <table style="width:100%; border-collapse:collapse; background:#fff; font-size:13px; border-radius:6px; overflow:hidden; border: 1px solid #cbd5e1;">
                    <thead>
                        <tr style="background:#fef08a; color:#0f172a; border-bottom:2px solid #fde047;">
                            <th style="padding:10px; text-align:left; font-weight:700; border-right:1px solid #cbd5e1; width:35%;">Ekspresi Emosi</th>
                            <th style="padding:10px; text-align:left; font-weight:700;">Contoh Kata Seru &amp; Arti Konteks</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Keterkejutan (Surprise)</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                <span style="color:#2563eb; font-weight:600;">Wow!</span> (Wah!), <span style="color:#2563eb; font-weight:600;">Oh!</span> (Oh!), <span style="color:#2563eb; font-weight:600;">Really?</span> (Benarkah?)
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Kegembiraan (Joy)</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                <span style="color:#2563eb; font-weight:600;">Hurrah!</span> (Hore!), <span style="color:#2563eb; font-weight:600;">Yay!</span> (Yey!)
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Kekecewaan / Rasa Sakit</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                <span style="color:#2563eb; font-weight:600;">Ouch!</span> (Aduh!), <span style="color:#2563eb; font-weight:600;">Oops!</span> (Aduh/Ups!), <span style="color:#2563eb; font-weight:600;">Oh no!</span> (Gawat!)
                            </td>
                        </tr>
                        <tr style="border-bottom:1px solid #cbd5e1;">
                            <td style="padding:9px 10px; color:#0f172a; font-weight:700; border-right:1px solid #cbd5e1; background:#f8fafc;">Keraguan / Penundaan</td>
                            <td style="padding:9px 10px; color:#475569; line-height:1.5;">
                                <span style="color:#2563eb; font-weight:600;">Erm...</span>, <span style="color:#2563eb; font-weight:600;">Well...</span>, <span style="color:#2563eb; font-weight:600;">Hmm...</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    } else {
        let arrayContoh = isiContoh.split(",");
        let arrayArti = isiArti.split(",");

        isiKontenLaci = `
            <div style="color: #b45309; font-weight: bold; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-list"></i> Contoh ${idLower.startsWith('pos-') ? 'Kata' : 'Kalimat'}
            </div>
            <div style="overflow-x:auto;">
                <table style="width:100%; border-collapse:collapse; background:#fff; font-size:13px; border-radius:6px; overflow:hidden; border: 1px solid #cbd5e1;">
                    <thead>
                        <tr style="background:#fef08a; color:#0f172a; border-bottom:2px solid #fde047;">
                            <th style="padding:10px; text-align:left; font-weight:700; border-right:1px solid #cbd5e1;">Contoh Kalimat</th>
                            <th style="padding:10px; text-align:left; font-weight:700;">Arti / Terjemahan</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        let batasBaris = Math.min(Math.max(arrayContoh.length, 3), 5);
        for (let j = 0; j < batasBaris; j++) {
            let itemC = arrayContoh[j] ? arrayContoh[j].trim() : "";
            let itemA = arrayArti[j] ? arrayArti[j].trim() : "";
            if (itemC !== "" || itemA !== "") {
                isiKontenLaci += `
                            <tr style="border-bottom:1px solid #cbd5e1;">
                                <td style="padding:9px 10px; color:#0f172a; font-weight:600; font-style:italic; border-right:1px solid #cbd5e1;">${itemC}</td>
                                <td style="padding:9px 10px; color:#475569;">${itemA}</td>
                            </tr>
                `;
            }
        }

        isiKontenLaci += `
                            <tr style="background:#fefce8;">
                                <td style="padding:10px; color:#a1a1aa; font-style:italic; font-weight:600; border-right:1px solid #cbd5e1;">etc.</td>
                                <td style="padding:10px; color:#a1a1aa; font-size:12px; font-style:italic;">Dan lain-lain</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // PENYELARASAN PROSES INJEKSI DOM MODAL AGAR TIDAK FREEZE DI VS CODE & GITHUB
    setTimeout(() => {
        // --- PROSES MODIFIKASI TARGET INTERCEPT PROUDLY BUILT ---
        let statusLaciAwal = "none";
        let teksTombolKustom = `<i class="fa-solid fa-folder-open"></i> Ketuk untuk Buka / Sembunyikan Tabel`;
        let headerLabelLaci = `Referensi Data &amp; Contoh:`;
        
        if (idLower === "bab1-pronowns" || idLower === "bab1-pronouns") {
            statusLaciAwal = "block"; // Maksa laci langsung mekar dari lahir
            headerLabelLaci = `Tabel Pronouns &amp; Contoh :`;
            teksTombolKustom = `<i class="fa-solid fa-eye-slash"></i> Sembunyikan Tabel Referensi Pronouns`;
            
            // 1. Sembunyikan Kotak Hijau (Penjelasan Fungsi Materi)
            let infoBoxItemHijau = boxPembahasan ? boxPembahasan.closest('.info-box-item') : null;
            if (infoBoxItemHijau) {
                infoBoxItemHijau.style.display = "none";
            }

            // 2. Sembunyikan Kotak Biru (Nama Materi Utama)
            let infoBoxItemBiru = boxSilabus ? boxSilabus.closest('.info-box-item') : null;
            if (infoBoxItemBiru) {
                infoBoxItemBiru.style.display = "none";
            }
        } else if (idLower === "subject-verb-agreement" || idLower === "subject-verb-aggreement") {
            // 🎯 BARU: PROSES AUTOMATION INTERCEPT KHUSUS SUBJECT-VERB AGREEMENT
            statusLaciAwal = "block"; // Langsung mekar saat di-load
            teksTombolKustom = `<i class="fa-solid fa-eye-slash"></i> Sembunyikan Tabel 11 Rules SVA`;
            headerLabelLaci = `Tabel Kesesuaian Matriks SVA:`;

            // Sembunyikan Kotak Hijau & Biru demi visual bersih menyisakan tabel murni
            let infoBoxItemHijau = boxPembahasan ? boxPembahasan.closest('.info-box-item') : null;
            if (infoBoxItemHijau) {
                infoBoxItemHijau.style.display = "none";
            }

            let infoBoxItemBiru = boxSilabus ? boxSilabus.closest('.info-box-item') : null;
            if (infoBoxItemBiru) {
                infoBoxItemBiru.style.display = "none";
            }
        } else {
            // Kembalikan ke keadaan block (muncul) untuk modul bab selain pronouns dan agreement table
            let infoBoxItemHijau = boxPembahasan ? boxPembahasan.closest('.info-box-item') : null;
            if (infoBoxItemHijau) {
                infoBoxItemHijau.style.display = "block";
            }

            let infoBoxItemBiru = boxSilabus ? boxSilabus.closest('.info-box-item') : null;
            if (infoBoxItemBiru) {
                infoBoxItemBiru.style.display = "block";
            }
        }
        // --- END OF INTERCEPT MODIFICATION ---

        let htmlLaciSembunyi = `
            <div id="mms-laci-tutup-sembunyi-bab14" class="info-box-item" style="border-left: 4px solid #eab308; background: #fffdf5; padding: 14px; border-radius: 10px; width: 100%; box-sizing: border-box; margin-top: 14px;">
                <div class="info-box-header" style="color: #b45309; font-weight: bold; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                    <i class="fa-solid fa-lightbulb"></i> ${headerLabelLaci}
                </div>
                <button class="mms-toggle-trigger-btn" style="border-color: #eab308; color: #b45309; background: #fff; margin-top: 4px; width: 100%; padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.15s ease;" 
                    onclick="let laci = document.getElementById('mms-panel-laci-bab14'); laci.style.display = (laci.style.display === 'none' || laci.style.display === '') ? 'block' : 'none';">
                    ${teksTombolKustom}
                </button>
                <div id="mms-panel-laci-bab14" style="display: ${statusLaciAwal}; margin-top: 10px; background: #fffdf5; padding: 4px; border-radius: 6px;">
                    ${isiKontenLaci}
                </div>
            </div>
        `;

        let pembungkusUtama = document.querySelector(".mms-vertical-layout-stack");
        if (pembungkusUtama) {
            pembungkusUtama.insertAdjacentHTML('beforeend', htmlLaciSembunyi);
        }

        if(boxPembahasan) {
            boxPembahasan.innerText = dataCocok.fungsi ? dataCocok.fungsi.replace(/\\n/g, "\n") : `Menampilkan spesifikasi gramatikal rumpun ${dataCocok.judulBab}.`;
        }

        if(boxVisualMateri) {
            let visual = dataCocok.visual || "";
            if (visual.startsWith("fa-")) {
                boxVisualMateri.innerHTML = `<i class="fa-solid ${visual}" style="color:var(--mms-accent); font-size: 3em;"></i>`;
            } else if (visual && (visual.endsWith(".mp4") || visual.endsWith(".webm") || visual.includes("video/") || visual.startsWith("http"))) {
                boxVisualMateri.innerHTML = `<video id="mms-media-video-lokal" style="width:100%; height:100%; object-fit:cover; border-radius:8px;" controls>` +
                                                `<source src="${visual}" type="video/mp4">` +
                                             `</video>`;
            } else if (visual && visual.startsWith("images/")) {
                boxVisualMateri.innerHTML = `<img src="images/verb-categories-classification.png" alt="visual-materi" style="max-height:100%; width:100%; object-fit:cover; border-radius:6px;">`;
            } else {
                boxVisualMateri.innerHTML = `<i class="fa-solid fa-photo-film fa-2xl" style="color:#94a3b8"></i>`;
            }
        }
    }, 0);
}
