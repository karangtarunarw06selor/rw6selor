"use strict";

const { createDeck, shuffle, evaluateSeven, compareHands } = require("./poker-engine");

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
    if (this.phase !== "waiting" && this.phase !== "finished") throw new Error("Tunggu ronde selesai.");
    const player = { id, name, connected: true, hand: [] };
    this.players.push(player);
    return player;
  }

  currentPlayer() { return this.players[this.turnIndex] || null; }
  requirePlayers() {
    const eligible = this.players.filter((player) => player.connected !== false);
    if (eligible.length < 2) throw new Error("Minimal dua pemain untuk mulai.");
    this.players = eligible;
    this.roundNumber += 1;
    this.lastResult = null;
    this.processedActions.clear();
  }

  privatePlayers(viewerId, reveal = false) {
    return this.players.map((player) => ({
      id: player.id,
      name: player.name,
      connected: player.connected,
      cardCount: player.hand.length,
      hand: player.id === viewerId || reveal ? player.hand : player.hand.map(() => null),
    }));
  }
}

class CapsaFiveTable extends BaseCardTable {
  constructor(options) { super({ ...options, mode: "capsa-five" }); }

  startRound({ hands, random } = {}) {
    if (!["waiting", "finished"].includes(this.phase)) throw new Error("Ronde sedang berjalan.");
    this.requirePlayers();
    const deck = shuffle(createDeck(), random);
    this.players.forEach((player) => { player.hand = hands?.[player.id] ? [...hands[player.id]] : []; });
    for (let round = 0; round < 5; round += 1) {
      for (const player of this.players) if (player.hand.length < 5) player.hand.push(deck.pop());
    }
    if (this.players.some((player) => player.hand.length !== 5)) throw new Error("Setiap pemain harus memiliki lima kartu.");
    const ranked = this.players.map((player) => ({ player, hand: evaluateSeven(player.hand) }));
    ranked.sort((a, b) => compareHands(b.hand, a.hand));
    const winners = ranked.filter((entry) => compareHands(entry.hand, ranked[0].hand) === 0);
    this.phase = "finished";
    this.lastResult = {
      reason: "showdown",
      winners: winners.map(({ player, hand }) => ({ id: player.id, name: player.name, hand: hand.name })),
    };
    return this.viewFor(null);
  }

  viewFor(viewerId) {
    return {
      code: this.code,
      siteId: this.siteId,
      mode: this.mode,
      phase: this.phase,
      roundNumber: this.roundNumber,
      turnId: null,
      lastResult: this.lastResult,
      players: this.privatePlayers(viewerId, this.phase === "finished"),
    };
  }
}

class CangkulanTable extends BaseCardTable {
  constructor(options) {
    super({ ...options, mode: "cangkulan" });
    this.stock = [];
    this.discard = [];
  }

  startRound({ hands, stock, discard, random } = {}) {
    if (!["waiting", "finished"].includes(this.phase)) throw new Error("Ronde sedang berjalan.");
    this.requirePlayers();
    const deck = shuffle(createDeck(), random);
    this.players.forEach((player) => { player.hand = hands?.[player.id] ? [...hands[player.id]] : []; });
    if (!hands) {
      for (let round = 0; round < 7; round += 1) for (const player of this.players) player.hand.push(deck.pop());
    }
    this.stock = stock ? [...stock] : deck;
    this.discard = discard ? [...discard] : [this.stock.pop()];
    if (!this.discard.length) throw new Error("Kartu pembuka tidak tersedia.");
    this.phase = "playing";
    this.turnIndex = 0;
    return this.viewFor(null);
  }

  topDiscard() { return this.discard[this.discard.length - 1]; }
  isPlayable(card) {
    const top = this.topDiscard();
    return Boolean(card && top && (card.rank === top.rank || card.suit === top.suit));
  }

  refillStock() {
    if (this.stock.length || this.discard.length <= 1) return;
    const top = this.discard.pop();
    this.stock = shuffle(this.discard.splice(0));
    this.discard = [top];
  }

  finish(player) {
    this.phase = "finished";
    this.turnIndex = -1;
    this.lastResult = { reason: "empty-hand", winners: [{ id: player.id, name: player.name }] };
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
      if (!Number.isInteger(index) || !this.isPlayable(card)) throw new Error("Kartu tidak cocok dengan angka atau jenis.");
      player.hand.splice(index, 1);
      this.discard.push(card);
    } else if (action.type === "draw") {
      if (player.hand.some((card) => this.isPlayable(card))) throw new Error("Masih ada kartu yang bisa dibuang.");
      let played = false;
      while (!played) {
        this.refillStock();
        if (!this.stock.length) break;
        const card = this.stock.pop();
        if (this.isPlayable(card)) {
          this.discard.push(card);
          played = true;
        } else player.hand.push(card);
      }
    } else throw new Error("Aksi tidak valid.");
    if (action.actionId) this.processedActions.set(action.actionId, playerId);
    if (!player.hand.length) this.finish(player);
    else this.turnIndex = (this.turnIndex + 1) % this.players.length;
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
      topDiscard: this.topDiscard() || null,
      stockCount: this.stock.length,
      lastResult: this.lastResult,
      players: this.privatePlayers(viewerId, false),
    };
  }
}

module.exports = { CapsaFiveTable, CangkulanTable };
