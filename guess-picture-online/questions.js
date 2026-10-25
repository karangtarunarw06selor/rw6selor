"use strict";

module.exports = [
  { id: "everest", answer: "Gunung Everest", aliases: ["Everest", "Mount Everest", "Mt Everest"], category: "Tempat", image: "everest.jpg", forbidden: ["gunung", "mountain", "everest"], examples: ["Bendera Nepal", "Tertinggi", "Salju", "8.849 meter"] },
  { id: "eiffel", answer: "Menara Eiffel", aliases: ["Eiffel Tower", "Eiffel"], category: "Tempat", image: "eiffel.png", forbidden: ["menara", "tower", "eiffel"], examples: ["Bendera Prancis", "Paris", "Besi", "1889"] },
  { id: "ronaldo", answer: "Cristiano Ronaldo", aliases: ["Ronaldo", "CR7"], category: "Tokoh", image: "ronaldo.jpg", forbidden: ["ronaldo", "cr7", "cristiano", "wajah pemain"], examples: ["Portugal", "Nomor 7", "SIUU", "Manchester"] },
  { id: "spongebob", answer: "SpongeBob SquarePants", aliases: ["Spongebob"], category: "Tokoh", image: "spongebob.png", forbidden: ["spons", "sponge", "spongebob"], examples: ["Laut", "Nanas", "Bikini Bottom", "Patrick"] },
  { id: "borobudur", answer: "Candi Borobudur", aliases: ["Borobudur"], category: "Tempat", image: "borobudur.jpg", forbidden: ["candi", "borobudur", "stupa utama"], examples: ["Magelang", "Buddha", "Batu", "Jawa Tengah"] },
  { id: "monas", answer: "Monumen Nasional", aliases: ["Monas"], category: "Tempat", image: "monas.jpg", forbidden: ["monas", "monumen", "tugu"], examples: ["Jakarta", "Emas", "Kemerdekaan", "Lapangan Merdeka"] },
  { id: "harimau", answer: "Harimau Sumatra", aliases: ["Harimau Sumatera", "Sumatran Tiger"], category: "Hewan", image: "harimau.jpg", forbidden: ["harimau", "tiger", "kucing belang"], examples: ["Pulau Sumatra", "Belang", "Karnivora", "Hutan"] },
  { id: "aadc", answer: "Ada Apa Dengan Cinta", aliases: ["AADC"], category: "Film", image: "aadc.jpg", forbidden: ["judul", "aadc", "cinta dan rangga"], examples: ["Rangga", "Puisi", "SMA", "Cinta"] }
].concat(require("./assets/questions/generated.json"));
