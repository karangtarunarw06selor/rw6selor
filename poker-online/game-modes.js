"use strict";

const { createDeck, shuffle } = require("./poker-engine");

class BaseCardTable {
  constructor({ code, siteId, mode }) {
    this.code = code;
    this.siteId = siteId;
    this.mode = mode;
    this.players = [];
    this.phase = "waiting";
    this.turnIndex = -1;
    this.roundNumber = 0;
    this.lastResult = null;
    this.processedActions = new Map();
  }

  addPlayer({ id, name }) {
    if (this.players.length >= 6) throw new Error("Meja sudah penuh.");
    const player = { id, name, connected: true, playingRound: ["waiting", "finished"].includes(this.phase), hand: [] };
    this.players.push(player);
    return player;
  }

  currentPlayer() { return this.players[this.turnIndex] || null; }
  requirePlayers() {
    const eligible = this.players.filter((player) => player.connected !== false && player.playingRound !== false);
    if (eligible.length < 2) throw new Error("Minimal dua pemain untuk mulai.");
    this.roundNumber += 1;
    this.lastResult = null;
    this.processedActions.clear();
    return eligible;
  }

  roundPlayers() { return this.players.filter((player) => player.playingRound !== false); }

  nextRoundIndex(fromIndex) {
    for (let step = 1; step <= this.players.length; step += 1) {
      const index = (fromIndex + step) % this.players.length;
      if (this.players[index].playingRound !== false) return index;
    }
    return -1;
  }

  privatePlayers(viewerId, reveal = false) {
    return this.players.map((player) => ({
      id: player.id,
      name: player.name,
      connected: player.connected,
      playingRound: player.playingRound !== false,
      cardCount: player.hand.length,
      hand: player.id === viewerId || reveal ? player.hand : player.hand.map(() => null),
      rank: this.rankings?.find((entry) => entry.id === player.id)?.rank || null,
    }));
  }
}

const BIG_TWO_RANKS = "3456789TJQKA2";
const BIG_TWO_SUITS = "dchs";
const bigRank = (card) => BIG_TWO_RANKS.indexOf(card.rank);
const bigSuit = (card) => BIG_TWO_SUITS.indexOf(card.suit);
const cardPower = (card) => bigRank(card) * 4 + bigSuit(card);
const compareVectors = (a, b) => {
  for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
    if ((a[index] ?? -1) !== (b[index] ?? -1)) return (a[index] ?? -1) - (b[index] ?? -1);
  }
  return 0;
};

function straightPower(cards, rule) {
  const ranks = [...new Set(cards.map((card) => card.rank))];
  if (ranks.length !== 5) return null;
  const normal = "3456789TJQKA";
  const ordered = ranks.map((rank) => normal.indexOf(rank)).sort((a, b) => a - b);
  if (ordered[0] >= 0 && ordered.every((value, index) => index === 0 || value === ordered[index - 1] + 1)) return ordered[4];
  const signature = ranks.slice().sort().join("");
  const wheel = [..."A2345"].sort().join("");
  const twoHigh = [..."23456"].sort().join("");
  if ((rule === "wheel" || rule === "free") && signature === wheel) return 12;
  if (rule === "free" && signature === twoHigh) return 13;
  return null;
}

function evaluateBigTwoPlay(cards, straightRule = "classic") {
  if (![1, 2, 3, 5].includes(cards.length)) throw new Error("Mainkan 1, 2, 3, atau 5 kartu.");
  const groups = new Map();
  cards.forEach((card) => groups.set(card.rank, [...(groups.get(card.rank) || []), card]));
  const sizes = [...groups.values()].map((group) => group.length).sort((a, b) => b - a);
  const sortedPowers = cards.map(cardPower).sort((a, b) => b - a);
  if (cards.length === 1) return { type: "single", count: 1, category: 0, power: sortedPowers };
  if (cards.length === 2 && sizes[0] === 2) return { type: "pair", count: 2, category: 0, power: [bigRank(cards[0]), Math.max(...cards.map(bigSuit))] };
  if (cards.length === 3 && sizes[0] === 3) return { type: "triple", count: 3, category: 0, power: [bigRank(cards[0]), Math.max(...cards.map(bigSuit))] };
  if (cards.length !== 5) throw new Error("Kombinasi kartu tidak valid.");
  const flush = cards.every((card) => card.suit === cards[0].suit);
  const straight = straightPower(cards, straightRule);
  if (flush && straight !== null) return { type: "five", count: 5, category: 4, power: [straight, Math.max(...cards.map(bigSuit))] };
  if (sizes[0] === 4) {
    const rank = [...groups].find(([, group]) => group.length === 4)[0];
    return { type: "five", count: 5, category: 3, power: [BIG_TWO_RANKS.indexOf(rank)] };
  }
  if (sizes[0] === 3 && sizes[1] === 2) {
    const rank = [...groups].find(([, group]) => group.length === 3)[0];
    return { type: "five", count: 5, category: 2, power: [BIG_TWO_RANKS.indexOf(rank)] };
  }
  if (flush) return { type: "five", count: 5, category: 1, power: [...sortedPowers, bigSuit(cards[0])] };
  if (straight !== null) return { type: "five", count: 5, category: 0, power: [straight, Math.max(...cards.map(bigSuit))] };
  throw new Error("Kombinasi lima kartu bukan straight, flush, full house, four of a kind, atau straight flush.");
}

function compareBigTwoPlays(a, b) {
  if (a.count !== b.count) throw new Error("Jumlah kartu harus sama.");
  if (a.count === 5 && a.category !== b.category) return a.category - b.category;
  return compareVectors(a.power, b.power);
}

class BigTwoTable extends BaseCardTable {
  constructor({ straightRule = "classic", ...options }) {
    super({ ...options, mode: "capsa-banting" });
    this.straightRule = straightRule;
    this.currentPlay = null;
    this.lastPlayIndex = -1;
    this.passCount = 0;
    this.firstPlay = true;
  }

  addPlayer(player) {
    if (this.players.length >= 4) throw new Error("Capsa Banting maksimal empat pemain.");
    return super.addPlayer(player);
  }

  startRound({ hands, random } = {}) {
    if (!["waiting", "finished"].includes(this.phase)) throw new Error("Ronde sedang berjalan.");
    const active = this.requirePlayers();
    if (active.length > 4) throw new Error("Capsa Banting maksimal empat pemain.");
    const deck = shuffle(createDeck(), random);
    this.players.forEach((player) => { player.hand = hands?.[player.id] ? [...hands[player.id]] : []; });
    if (!hands) {
      const threeDiamond = deck.findIndex((card) => card.rank === "3" && card.suit === "d");
      const dealtPosition = deck.length - 1 - (threeDiamond % (13 * active.length));
      [deck[threeDiamond], deck[dealtPosition]] = [deck[dealtPosition], deck[threeDiamond]];
      for (let round = 0; round < 13; round += 1) for (const player of active) player.hand.push(deck.pop());
    }
    const opener = this.players.findIndex((player) => player.hand.some((card) => card.rank === "3" && card.suit === "d"));
    if (opener < 0) throw new Error("Kartu pembuka 3♦ tidak ditemukan.");
    this.phase = "playing";
    this.turnIndex = opener;
    this.currentPlay = null;
    this.lastPlayIndex = -1;
    this.passCount = 0;
    this.firstPlay = true;
    return this.viewFor(null);
  }

  act(playerId, action = {}) {
    if (action.actionId && this.processedActions.has(action.actionId)) {
      if (this.processedActions.get(action.actionId) !== playerId) throw new Error("ID aksi sudah dipakai pemain lain.");
      return { duplicate: true, view: this.viewFor(playerId) };
    }
    if (this.phase !== "playing") throw new Error("Ronde belum aktif.");
    const player = this.players.find((item) => item.id === playerId);
    if (!player || this.currentPlayer()?.id !== playerId) throw new Error("Belum giliranmu.");
    if (action.type === "pass") {
      if (!this.currentPlay) throw new Error("Tidak bisa pass saat membuka putaran.");
      this.passCount += 1;
      if (this.passCount >= this.roundPlayers().length - 1) {
        this.currentPlay = null;
        this.passCount = 0;
        this.turnIndex = this.lastPlayIndex;
      } else this.turnIndex = this.nextRoundIndex(this.turnIndex);
    } else if (action.type === "play") {
      const indexes = [...new Set((action.cardIndexes || []).map(Number))].sort((a, b) => a - b);
      if (!indexes.length || indexes.some((index) => !Number.isInteger(index) || !player.hand[index])) throw new Error("Pilihan kartu tidak valid.");
      const cards = indexes.map((index) => player.hand[index]);
      if (this.firstPlay && !cards.some((card) => card.rank === "3" && card.suit === "d")) throw new Error("Permainan pertama wajib menyertakan 3♦.");
      const evaluated = evaluateBigTwoPlay(cards, this.straightRule);
      if (this.currentPlay && compareBigTwoPlays(evaluated, this.currentPlay.evaluated) <= 0) throw new Error("Kombinasi harus lebih tinggi.");
      indexes.slice().sort((a, b) => b - a).forEach((index) => player.hand.splice(index, 1));
      this.currentPlay = { playerId, cards, evaluated };
      this.lastPlayIndex = this.turnIndex;
      this.passCount = 0;
      this.firstPlay = false;
      if (!player.hand.length) {
        this.phase = "finished";
        this.turnIndex = -1;
        this.lastResult = { reason: "empty-hand", winners: [{ id: player.id, name: player.name }] };
      } else this.turnIndex = this.nextRoundIndex(this.turnIndex);
    } else throw new Error("Aksi tidak valid.");
    if (action.actionId) this.processedActions.set(action.actionId, playerId);
    return { duplicate: false, view: this.viewFor(playerId) };
  }

  timeoutCurrentPlayer() {
    const player = this.currentPlayer();
    if (!player || this.phase !== "playing") return;
    if (this.currentPlay) return this.act(player.id, { type: "pass", actionId: `timeout-${this.roundNumber}-${player.id}-${player.hand.length}` });
    const required = this.firstPlay ? player.hand.findIndex((card) => card.rank === "3" && card.suit === "d") : 0;
    return this.act(player.id, { type: "play", cardIndexes: [required], actionId: `timeout-${this.roundNumber}-${player.id}-${player.hand.length}` });
  }

  viewFor(viewerId) {
    return {
      code: this.code,
      siteId: this.siteId,
      mode: this.mode,
      phase: this.phase,
      roundNumber: this.roundNumber,
      turnId: this.currentPlayer()?.id || null,
      straightRule: this.straightRule,
      currentPlay: this.currentPlay ? { playerId: this.currentPlay.playerId, cards: this.currentPlay.cards } : null,
      lastResult: this.lastResult,
      players: this.privatePlayers(viewerId, false),
    };
  }
}

const SAMGONG_RANKS = "A23456789TJQK";
const SAMGONG_SUITS = "dchs";
const samgongCardPower = (card) => SAMGONG_RANKS.indexOf(card.rank) * 4 + SAMGONG_SUITS.indexOf(card.suit);

function evaluateSamgong(cards) {
  if (!Array.isArray(cards) || cards.length !== 3) throw new Error("Samgong memakai tepat tiga kartu.");
  const samgong = cards.every((card) => "JQK".includes(card.rank));
  const value = cards.reduce((total, card) => total + (card.rank === "A" ? 1 : Number(card.rank) || 0), 0) % 10;
  return { samgong, value, power: cards.map(samgongCardPower).sort((a, b) => b - a) };
}

function compareSamgong(a, b) {
  if (a.samgong !== b.samgong) return a.samgong ? 1 : -1;
  if (!a.samgong && a.value !== b.value) return a.value - b.value;
  return compareVectors(a.power, b.power);
}

class SamgongTable extends BaseCardTable {
  constructor(options) {
    super({ ...options, mode: "samgong" });
    this.bandarId = null;
  }

  addPlayer(player) {
    const added = super.addPlayer(player);
    added.score = 0;
    added.revealed = false;
    return added;
  }

  startRound({ hands, random } = {}) {
    if (!["waiting", "finished"].includes(this.phase)) throw new Error("Ronde sedang berjalan.");
    const active = this.requirePlayers();
    const deck = shuffle(createDeck(), random);
    this.players.forEach((player) => {
      player.hand = player.playingRound === false ? [] : hands?.[player.id] ? [...hands[player.id]] : [deck.pop(), deck.pop(), deck.pop()];
      player.revealed = false;
    });
    if (active.some((player) => player.hand.length !== 3)) throw new Error("Setiap pemain wajib mendapat tiga kartu.");
    this.turnIndex = this.players.indexOf(active[(this.roundNumber - 1) % active.length]);
    this.bandarId = this.currentPlayer().id;
    this.phase = "playing";
    return this.viewFor(null);
  }

  settle() {
    const bandar = this.players.find((player) => player.id === this.bandarId);
    const bandarHand = evaluateSamgong(bandar.hand);
    const outcomes = [];
    let bandarDelta = 0;
    for (const player of this.roundPlayers()) {
      if (player.id === bandar.id) continue;
      const result = compareSamgong(evaluateSamgong(player.hand), bandarHand) > 0 ? "win" : "lose";
      const delta = result === "win" ? 1 : -1;
      player.score += delta;
      bandarDelta -= delta;
      outcomes.push({ id: player.id, name: player.name, result, delta });
    }
    bandar.score += bandarDelta;
    outcomes.unshift({ id: bandar.id, name: bandar.name, result: bandarDelta >= 0 ? "win" : "lose", delta: bandarDelta, bandar: true });
    this.phase = "finished";
    this.turnIndex = -1;
    this.lastResult = { reason: "showdown", winners: outcomes.filter((entry) => entry.result === "win"), outcomes };
  }

  act(playerId, action = {}) {
    if (action.actionId && this.processedActions.has(action.actionId)) {
      if (this.processedActions.get(action.actionId) !== playerId) throw new Error("ID aksi sudah dipakai pemain lain.");
      return { duplicate: true, view: this.viewFor(playerId) };
    }
    if (this.phase !== "playing" || action.type !== "reveal") throw new Error("Aksi Samgong tidak valid.");
    const player = this.players.find((item) => item.id === playerId);
    if (!player || this.currentPlayer()?.id !== playerId) throw new Error("Belum giliranmu.");
    player.revealed = true;
    if (this.roundPlayers().every((item) => item.revealed)) this.settle();
    else {
      do { this.turnIndex = this.nextRoundIndex(this.turnIndex); } while (this.currentPlayer().revealed);
    }
    if (action.actionId) this.processedActions.set(action.actionId, playerId);
    return { duplicate: false, view: this.viewFor(playerId) };
  }

  timeoutCurrentPlayer() {
    const player = this.currentPlayer();
    if (player && this.phase === "playing") return this.act(player.id, { type: "reveal", actionId: `timeout-${this.roundNumber}-${player.id}` });
  }

  viewFor(viewerId) {
    const revealAll = this.phase === "finished";
    return {
      code: this.code,
      siteId: this.siteId,
      mode: this.mode,
      phase: this.phase,
      roundNumber: this.roundNumber,
      turnId: this.currentPlayer()?.id || null,
      bandarId: this.bandarId,
      lastResult: this.lastResult,
      players: this.players.map((player) => ({
        id: player.id,
        name: player.name,
        connected: player.connected,
        playingRound: player.playingRound !== false,
        cardCount: player.hand.length,
        hand: player.id === viewerId || revealAll ? player.hand : player.hand.map(() => null),
        score: player.score,
        revealed: player.revealed,
        evaluation: revealAll && player.playingRound !== false ? evaluateSamgong(player.hand) : null,
      })),
    };
  }
}

class CangkulanTable extends BaseCardTable {
  constructor(options) {
    super({ ...options, mode: "cangkulan" });
    this.stock = [];
    this.spent = [];
    this.openingCard = null;
    this.houseSuit = null;
    this.currentTrick = [];
    this.completedTrick = [];
    this.completedTrickWinnerId = null;
    this.bandarId = null;
    this.rankings = [];
    this.trickPlayerIds = [];
  }

  startRound({ hands, stock, openingCard, random } = {}) {
    if (!["waiting", "finished"].includes(this.phase)) throw new Error("Ronde sedang berjalan.");
    const active = this.requirePlayers();
    const deck = shuffle(createDeck(), random);
    this.players.forEach((player) => { player.hand = hands?.[player.id] ? [...hands[player.id]] : []; });
    if (!hands) for (let round = 0; round < 7; round += 1) for (const player of active) player.hand.push(deck.pop());
    this.stock = stock ? [...stock] : deck;
    this.openingCard = openingCard || this.stock.pop();
    if (!this.openingCard) throw new Error("Kartu pembuka tidak tersedia.");
    this.spent = [this.openingCard];
    this.houseSuit = this.openingCard.suit;
    this.currentTrick = [];
    this.completedTrick = [];
    this.completedTrickWinnerId = null;
    this.bandarId = null;
    this.rankings = [];
    this.trickPlayerIds = active.map((player) => player.id);
    this.phase = "playing";
    this.turnIndex = this.players.indexOf(active[0]);
    return this.viewFor(null);
  }

  isPlayable(card) {
    return Boolean(card && (!this.houseSuit || card.suit === this.houseSuit));
  }

  takeTablePile(player) {
    const cards = [...this.spent, ...this.currentTrick.map((play) => play.card)];
    if (!cards.length) throw new Error("Deck dan kartu meja sudah habis.");
    player.hand.push(...cards);
    this.spent = [];
    this.currentTrick = [];
    this.completedTrick = [];
    this.completedTrickWinnerId = null;
    this.openingCard = null;
  }

  activePlayers() {
    return this.players.filter((player) => player.playingRound !== false && !this.rankings.some((entry) => entry.id === player.id));
  }

  rankPlayer(player) {
    if (!this.rankings.some((entry) => entry.id === player.id)) this.rankings.push({ id: player.id, name: player.name, rank: this.rankings.length + 1 });
    const active = this.activePlayers();
    if (active.length === 1) {
      this.rankings.push({ id: active[0].id, name: active[0].name, rank: this.rankings.length + 1 });
      this.phase = "finished";
      this.turnIndex = -1;
      this.lastResult = { reason: "ranking-complete", winners: [this.rankings[0]], rankings: [...this.rankings] };
    }
  }

  nextActiveIndex(fromIndex) {
    for (let step = 1; step <= this.players.length; step += 1) {
      const index = (fromIndex + step) % this.players.length;
      if (this.players[index].playingRound !== false && !this.rankings.some((entry) => entry.id === this.players[index].id)) return index;
    }
    return -1;
  }

  completeTrick() {
    const rankOrder = "23456789TJQKA";
    const eligible = this.currentTrick.filter((play) => !this.rankings.some((entry) => entry.id === play.playerId));
    const winner = eligible.reduce((best, play) => rankOrder.indexOf(play.card.rank) > rankOrder.indexOf(best.card.rank) ? play : best);
    this.completedTrick = [...this.currentTrick];
    this.completedTrickWinnerId = winner.playerId;
    this.spent.push(...this.currentTrick.map((play) => play.card));
    this.currentTrick = [];
    this.houseSuit = null;
    this.bandarId = winner.playerId;
    this.turnIndex = this.players.findIndex((player) => player.id === winner.playerId);
    this.trickPlayerIds = this.activePlayers().map((player) => player.id);
  }

  recordPlay(player, card) {
    if (!this.houseSuit) {
      this.completedTrick = [];
      this.completedTrickWinnerId = null;
      this.houseSuit = card.suit;
    }
    this.currentTrick.push({ playerId: player.id, card });
    if (!player.hand.length) this.rankPlayer(player);
    if (this.phase === "finished") return;
    if (this.currentTrick.length === this.trickPlayerIds.length) this.completeTrick();
    else this.turnIndex = this.nextActiveIndex(this.turnIndex);
  }

  act(playerId, action = {}) {
    if (action.actionId && this.processedActions.has(action.actionId)) {
      if (this.processedActions.get(action.actionId) !== playerId) throw new Error("ID aksi sudah dipakai pemain lain.");
      return { duplicate: true, view: this.viewFor(playerId) };
    }
    if (this.phase !== "playing") throw new Error("Ronde belum aktif.");
    const player = this.players.find((item) => item.id === playerId);
    if (!player || this.currentPlayer()?.id !== playerId) throw new Error("Belum giliranmu.");
    if (action.type === "play") {
      const index = Number(action.cardIndex);
      const card = player.hand[index];
      if (!Number.isInteger(index) || !this.isPlayable(card)) throw new Error("Kartu harus mengikuti house.");
      player.hand.splice(index, 1);
      this.recordPlay(player, card);
    } else if (action.type === "draw") {
      if (!this.houseSuit) throw new Error("Bandar harus membuka house dengan kartu sendiri.");
      if (player.hand.some((card) => this.isPlayable(card))) throw new Error("Masih ada kartu house yang bisa dibuang.");
      if (this.stock.length) player.hand.push(this.stock.pop());
      else this.takeTablePile(player);
    } else throw new Error("Aksi tidak valid.");
    if (action.actionId) this.processedActions.set(action.actionId, playerId);
    return { duplicate: false, view: this.viewFor(playerId) };
  }

  viewFor(viewerId) {
    return {
      code: this.code,
      siteId: this.siteId,
      mode: this.mode,
      phase: this.phase,
      roundNumber: this.roundNumber,
      turnId: this.currentPlayer()?.id || null,
      openingCard: this.openingCard,
      houseSuit: this.houseSuit,
      currentTrick: this.currentTrick,
      completedTrick: this.completedTrick,
      completedTrickWinnerId: this.completedTrickWinnerId,
      bandarId: this.bandarId,
      rankings: this.rankings,
      stockCount: this.stock.length,
      lastResult: this.lastResult,
      players: this.privatePlayers(viewerId, false),
    };
  }
}

module.exports = { BigTwoTable, evaluateBigTwoPlay, compareBigTwoPlays, CangkulanTable, SamgongTable, evaluateSamgong, compareSamgong };
