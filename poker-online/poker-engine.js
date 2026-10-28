"use strict";

const crypto = require("crypto");

const RANKS = "23456789TJQKA";
const SUITS = "cdhs";
const rankValue = (rank) => RANKS.indexOf(rank) + 2;

function createDeck() {
  return [...SUITS].flatMap((suit) => [...RANKS].map((rank) => ({ rank, suit })));
}

function shuffle(deck, random = () => crypto.randomInt(0x100000000) / 0x100000000) {
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function evaluateFive(cards) {
  const values = cards.map((card) => rankValue(card.rank)).sort((a, b) => b - a);
  const counts = new Map();
  values.forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
  const groups = [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0]);
  const flush = cards.every((card) => card.suit === cards[0].suit);
  const unique = [...new Set(values)];
  if (unique[0] === 14) unique.push(1);
  let straightHigh = 0;
  for (let i = 0; i <= unique.length - 5; i += 1) {
    if (unique[i] - unique[i + 4] === 4) { straightHigh = unique[i]; break; }
  }
  if (flush && straightHigh) return { category: 8, name: "Straight Flush", tiebreak: [straightHigh] };
  if (groups[0][1] === 4) return { category: 7, name: "Four of a Kind", tiebreak: [groups[0][0], groups[1][0]] };
  if (groups[0][1] === 3 && groups[1][1] === 2) return { category: 6, name: "Full House", tiebreak: [groups[0][0], groups[1][0]] };
  if (flush) return { category: 5, name: "Flush", tiebreak: values };
  if (straightHigh) return { category: 4, name: "Straight", tiebreak: [straightHigh] };
  if (groups[0][1] === 3) return { category: 3, name: "Three of a Kind", tiebreak: [groups[0][0], ...groups.slice(1).map(([v]) => v).sort((a, b) => b - a)] };
  if (groups[0][1] === 2 && groups[1][1] === 2) {
    const pairs = [groups[0][0], groups[1][0]].sort((a, b) => b - a);
    return { category: 2, name: "Two Pair", tiebreak: [...pairs, groups[2][0]] };
  }
  if (groups[0][1] === 2) return { category: 1, name: "One Pair", tiebreak: [groups[0][0], ...groups.slice(1).map(([v]) => v).sort((a, b) => b - a)] };
  return { category: 0, name: "High Card", tiebreak: values };
}

function compareHands(a, b) {
  if (a.category !== b.category) return a.category - b.category;
  const length = Math.max(a.tiebreak.length, b.tiebreak.length);
  for (let i = 0; i < length; i += 1) {
    if ((a.tiebreak[i] || 0) !== (b.tiebreak[i] || 0)) return (a.tiebreak[i] || 0) - (b.tiebreak[i] || 0);
  }
  return 0;
}

function evaluateSeven(cards) {
  if (!Array.isArray(cards) || cards.length < 5 || cards.length > 7) throw new Error("Evaluator membutuhkan 5–7 kartu.");
  let best = null;
  for (let a = 0; a < cards.length - 4; a += 1) {
    for (let b = a + 1; b < cards.length - 3; b += 1) {
      for (let c = b + 1; c < cards.length - 2; c += 1) {
        for (let d = c + 1; d < cards.length - 1; d += 1) {
          for (let e = d + 1; e < cards.length; e += 1) {
            const result = evaluateFive([cards[a], cards[b], cards[c], cards[d], cards[e]]);
            if (!best || compareHands(result, best) > 0) best = result;
          }
        }
      }
    }
  }
  return best;
}

class PokerTable {
  constructor({ code, siteId, smallBlind = 10, bigBlind = 20 }) {
    this.code = code;
    this.siteId = siteId;
    this.smallBlind = smallBlind;
    this.bigBlind = bigBlind;
    this.players = [];
    this.phase = "waiting";
    this.board = [];
    this.pot = 0;
    this.currentBet = 0;
    this.lastFullRaise = bigBlind;
    this.dealerIndex = -1;
    this.turnIndex = -1;
    this.pending = new Set();
    this.processedActions = new Map();
    this.handNumber = 0;
    this.lastResult = null;
    this.deck = [];
  }

  addPlayer({ id, name, stack = 1000 }) {
    if (this.players.length >= 6) throw new Error("Meja sudah penuh.");
    const player = { id, name, stack, connected: true, playingRound: ["waiting", "finished"].includes(this.phase), folded: false, allIn: false, hole: [], streetBet: 0, committed: 0 };
    this.players.push(player);
    return player;
  }

  activePlayers() { return this.players.filter((player) => !player.folded && player.hole.length === 2); }
  canActPlayers() { return this.activePlayers().filter((player) => !player.allIn && player.stack > 0); }
  currentPlayer() { return this.players[this.turnIndex] || null; }

  nextEligibleIndex(from, predicate) {
    for (let step = 1; step <= this.players.length; step += 1) {
      const index = (from + step) % this.players.length;
      if (predicate(this.players[index])) return index;
    }
    return -1;
  }

  commit(player, amount) {
    const paid = Math.min(player.stack, Math.max(0, amount));
    player.stack -= paid;
    player.streetBet += paid;
    player.committed += paid;
    this.pot += paid;
    if (player.stack === 0) player.allIn = true;
    return paid;
  }

  startHand(random) {
    if (!["waiting", "finished"].includes(this.phase)) throw new Error("Hand sedang berjalan.");
    const eligible = this.players.filter((player) => player.stack > 0 && player.connected !== false && player.playingRound !== false);
    if (eligible.length < 2) throw new Error("Minimal dua pemain untuk mulai.");
    this.handNumber += 1;
    this.phase = "preflop";
    this.board = [];
    this.pot = 0;
    this.currentBet = 0;
    this.lastFullRaise = this.bigBlind;
    this.lastResult = null;
    this.processedActions.clear();
    this.players.forEach((player) => Object.assign(player, { folded: false, allIn: false, hole: [], streetBet: 0, committed: 0 }));
    this.dealerIndex = this.nextEligibleIndex(this.dealerIndex, (player) => eligible.includes(player));
    this.deck = shuffle(createDeck(), random);
    for (let round = 0; round < 2; round += 1) {
      let index = this.dealerIndex;
      for (let step = 0; step < eligible.length; step += 1) {
        index = this.nextEligibleIndex(index, (player) => eligible.includes(player));
        this.players[index].hole.push(this.deck.pop());
      }
    }
    const headsUp = eligible.length === 2;
    const sbIndex = headsUp ? this.dealerIndex : this.nextEligibleIndex(this.dealerIndex, (player) => eligible.includes(player));
    const bbIndex = this.nextEligibleIndex(sbIndex, (player) => eligible.includes(player));
    this.commit(this.players[sbIndex], this.smallBlind);
    this.commit(this.players[bbIndex], this.bigBlind);
    this.currentBet = Math.max(this.players[sbIndex].streetBet, this.players[bbIndex].streetBet);
    this.pending = new Set(this.canActPlayers().map((player) => player.id));
    this.turnIndex = headsUp ? sbIndex : this.nextEligibleIndex(bbIndex, (player) => this.pending.has(player.id));
    return this.viewFor(null);
  }

  act(playerId, action = {}) {
    if (action.actionId && this.processedActions.has(action.actionId)) {
      if (this.processedActions.get(action.actionId) !== playerId) throw new Error("ID aksi sudah dipakai pemain lain.");
      return { duplicate: true, view: this.viewFor(playerId) };
    }
    if (!["preflop", "flop", "turn", "river"].includes(this.phase)) throw new Error("Hand belum aktif.");
    const player = this.players.find((item) => item.id === playerId);
    if (!player || this.currentPlayer()?.id !== playerId) throw new Error("Belum giliranmu.");
    const owed = Math.max(0, this.currentBet - player.streetBet);
    const type = String(action.type || "");
    let raised = false;
    if (type === "fold") player.folded = true;
    else if (type === "check") {
      if (owed) throw new Error("Tidak bisa check; harus call atau fold.");
    } else if (type === "call") this.commit(player, owed);
    else if (type === "all-in") {
      const previousBet = this.currentBet;
      this.commit(player, player.stack);
      if (player.streetBet > this.currentBet) {
        this.currentBet = player.streetBet;
        const raiseSize = player.streetBet - previousBet;
        raised = raiseSize >= this.lastFullRaise;
        if (raised) this.lastFullRaise = raiseSize;
      }
    } else if (type === "raise") {
      const target = Number(action.amount);
      const previousBet = this.currentBet;
      const minimum = this.currentBet + this.lastFullRaise;
      if (!Number.isFinite(target) || target < minimum || target <= player.streetBet) throw new Error(`Raise minimal ${minimum}.`);
      this.commit(player, target - player.streetBet);
      if (player.streetBet <= this.currentBet && !player.allIn) throw new Error("Chip tidak cukup untuk raise.");
      if (player.streetBet > this.currentBet) {
        this.currentBet = player.streetBet;
        this.lastFullRaise = player.streetBet - previousBet;
        raised = true;
      }
    } else throw new Error("Aksi tidak valid.");
    if (action.actionId) this.processedActions.set(action.actionId, playerId);
    this.pending.delete(player.id);
    if (this.activePlayers().length === 1) return this.finishByFold();
    if (raised) this.pending = new Set(this.canActPlayers().filter((item) => item.id !== player.id).map((item) => item.id));
    for (const item of this.players) {
      if (!item.folded && !item.allIn && item.streetBet < this.currentBet) this.pending.add(item.id);
    }
    if (!this.pending.size) this.advanceStreet();
    else this.turnIndex = this.nextEligibleIndex(this.turnIndex, (item) => this.pending.has(item.id));
    return { duplicate: false, view: this.viewFor(playerId) };
  }

  timeoutCurrentPlayer() {
    const player = this.currentPlayer();
    if (!player || !["preflop", "flop", "turn", "river"].includes(this.phase)) return null;
    return this.act(player.id, { type: "fold", actionId: `timeout-${this.handNumber}-${player.id}-${this.phase}` });
  }

  dealBoard(count) { for (let i = 0; i < count; i += 1) this.board.push(this.deck.pop()); }

  advanceStreet() {
    const next = { preflop: "flop", flop: "turn", turn: "river", river: "showdown" }[this.phase];
    if (next === "showdown") return this.showdown();
    this.phase = next;
    this.dealBoard(next === "flop" ? 3 : 1);
    this.currentBet = 0;
    this.lastFullRaise = this.bigBlind;
    this.players.forEach((player) => { player.streetBet = 0; });
    this.pending = new Set(this.canActPlayers().map((player) => player.id));
    if (this.pending.size <= 1 && this.activePlayers().length > 1 && this.canActPlayers().length <= 1) {
      while (this.board.length < 5) this.dealBoard(this.board.length === 0 ? 3 : 1);
      return this.showdown();
    }
    this.turnIndex = this.nextEligibleIndex(this.dealerIndex, (item) => this.pending.has(item.id));
  }

  finishByFold() {
    const winner = this.activePlayers()[0];
    const amount = this.pot;
    winner.stack += amount;
    this.pot = 0;
    this.phase = "finished";
    this.turnIndex = -1;
    this.lastResult = { reason: "fold", winners: [{ id: winner.id, name: winner.name, amount }] };
    return this.lastResult;
  }

  showdown() {
    while (this.board.length < 5) this.dealBoard(this.board.length === 0 ? 3 : 1);
    const contenders = this.activePlayers();
    const levels = [...new Set(this.players.map((player) => player.committed).filter(Boolean))].sort((a, b) => a - b);
    let previous = 0;
    const payouts = new Map();
    for (const level of levels) {
      const contributors = this.players.filter((player) => player.committed >= level);
      const amount = (level - previous) * contributors.length;
      const eligible = contenders.filter((player) => player.committed >= level);
      if (!eligible.length && amount) {
        const refund = Math.floor(amount / contributors.length);
        let remainder = amount - refund * contributors.length;
        contributors.forEach((player) => { player.stack += refund + (remainder-- > 0 ? 1 : 0); });
      } else if (amount) {
        const ranked = eligible.map((player) => ({ player, hand: evaluateSeven([...player.hole, ...this.board]) }));
        ranked.sort((a, b) => compareHands(b.hand, a.hand));
        const winners = ranked.filter((entry) => compareHands(entry.hand, ranked[0].hand) === 0);
        const share = Math.floor(amount / winners.length);
        let remainder = amount - share * winners.length;
        winners.forEach(({ player }) => {
          const gain = share + (remainder-- > 0 ? 1 : 0);
          player.stack += gain;
          payouts.set(player.id, (payouts.get(player.id) || 0) + gain);
        });
      }
      previous = level;
    }
    this.pot = 0;
    this.phase = "finished";
    this.turnIndex = -1;
    this.lastResult = {
      reason: "showdown",
      winners: [...payouts].map(([id, amount]) => {
        const player = this.players.find((item) => item.id === id);
        return { id, name: player.name, amount, hand: evaluateSeven([...player.hole, ...this.board]).name };
      }),
    };
    return this.lastResult;
  }

  viewFor(viewerId) {
    const reveal = this.phase === "finished" && this.lastResult?.reason === "showdown";
    return {
      code: this.code,
      siteId: this.siteId,
      phase: this.phase,
      handNumber: this.handNumber,
      dealerType: "system",
      dealerId: this.players[this.dealerIndex]?.id || null,
      turnId: this.currentPlayer()?.id || null,
      board: this.board,
      pot: this.pot,
      currentBet: this.currentBet,
      minimumRaise: this.currentBet + this.lastFullRaise,
      smallBlind: this.smallBlind,
      bigBlind: this.bigBlind,
      lastResult: this.lastResult,
      players: this.players.map((player) => ({
        id: player.id,
        name: player.name,
        stack: player.stack,
        connected: player.connected,
        playingRound: player.playingRound !== false,
        folded: player.folded,
        allIn: player.allIn,
        bet: player.streetBet,
        committed: player.committed,
        hole: player.id === viewerId || (reveal && !player.folded) ? player.hole : player.hole.length ? [null, null] : [],
      })),
    };
  }
}

module.exports = { createDeck, shuffle, evaluateSeven, compareHands, PokerTable };
