"use strict";
const crypto = require("crypto");
const COLORS = ["red", "yellow", "green", "blue"];
const ACTIONS = ["skip", "reverse", "draw2"];
const shuffle = (cards, random = Math.random) => { for (let i=cards.length-1;i;i--){ const j=Math.floor(random()*(i+1)); [cards[i],cards[j]]=[cards[j],cards[i]]; } return cards; };
function createDeck(){
  const cards=[]; let n=0; const add=(color,value)=>cards.push({id:`c${n++}`,color,value});
  for(const color of COLORS){ add(color,"0"); for(let copy=0;copy<2;copy++){ for(let v=1;v<=9;v++) add(color,String(v)); for(const a of ACTIONS)add(color,a); } }
  for(let i=0;i<4;i++){add(null,"wild");add(null,"wild4");} return cards;
}
class UnoGame {
  constructor({random=Math.random}={}){this.random=random;this.phase="waiting";this.players=[];this.standings=[];this.actions=new Map();}
  addPlayer({id=crypto.randomUUID(),name}){if(this.players.length>=8)throw Error("Ruang penuh.");if(this.phase!=="waiting")throw Error("Permainan sudah dimulai.");const p={id,name,hand:[],playing:true};this.players.push(p);return p;}
  start(){if(this.players.length<2)throw Error("Minimal 2 pemain.");this.phase="playing";this.actions.clear();this.standings=[];this.direction=1;this.turnIndex=0;this.drawnCardId=null;this.drawnBy=null;this.activeColor=null;this.deck=shuffle(createDeck(),this.random);this.discard=[];for(const p of this.players){p.hand=[];p.playing=true;}for(let i=0;i<7;i++)for(const p of this.players)p.hand.push(this.deck.pop());let top;do{top=this.deck.pop();if(!/^\d$/.test(top.value)){this.deck.unshift(top);shuffle(this.deck,this.random);top=null;}}while(!top);this.discard.push(top);this.activeColor=top.color;return this;}
  applyOpening(card){if(card.value==="skip")this.turnIndex=this.nextIndex(this.turnIndex);else if(card.value==="reverse"){this.direction=-1;if(this.players.length===2)this.turnIndex=this.nextIndex(this.turnIndex);}else if(card.value==="draw2"){this.drawCards(this.players[this.turnIndex],2);this.turnIndex=this.nextIndex(this.turnIndex);}else if(card.value==="wild")this.activeColor=COLORS[Math.floor(this.random()*4)];}
  current(){return this.players[this.turnIndex];}
  nextIndex(from=this.turnIndex,steps=1){let i=from;do{i=(i+this.direction+this.players.length)%this.players.length;if(this.players[i].playing)steps--;}while(steps>0);return i;}
  ensure(playerId){if(this.phase!=="playing")throw Error("Permainan tidak aktif.");if(this.current().id!==playerId)throw Error("Bukan giliran Anda.");return this.current();}
  legal(card){const top=this.discard.at(-1);return !card.color||card.color===this.activeColor||card.value===top.value;}
  refill(){if(this.deck.length)return;if(this.discard.length<2)throw Error("Kartu habis.");const top=this.discard.pop();this.deck=shuffle(this.discard.splice(0),this.random);this.discard=[top];}
  drawCards(player,count){const out=[];for(let i=0;i<count;i++){this.refill();const c=this.deck.pop();player.hand.push(c);out.push(c);}return out;}
  draw(playerId){const p=this.ensure(playerId);if(this.drawnBy)throw Error("Sudah mengambil kartu.");const [card]=this.drawCards(p,1);this.drawnBy=playerId;this.drawnCardId=card.id;return card;}
  pass(playerId){this.ensure(playerId);if(this.drawnBy!==playerId)throw Error("Ambil satu kartu dahulu.");this.drawnBy=null;this.drawnCardId=null;this.turnIndex=this.nextIndex();}
  play(playerId,cardId,{color,uno=false}={}){const p=this.ensure(playerId);const idx=p.hand.findIndex(c=>c.id===cardId);if(idx<0)throw Error("Kartu tidak dimiliki.");const card=p.hand[idx];if(this.drawnBy===playerId&&this.drawnCardId!==cardId)throw Error("Hanya kartu yang baru diambil boleh dimainkan.");if(!this.legal(card))throw Error("Kartu tidak cocok.");if(card.value==="wild4"&&p.hand.some((held,index)=>index!==idx&&held.color===this.activeColor))throw Error("Wild +4 hanya boleh dimainkan jika tidak punya warna aktif.");if(!card.color&&!COLORS.includes(color))throw Error("Pilih warna.");p.hand.splice(idx,1);this.discard.push(card);this.activeColor=card.color||color;this.drawnBy=null;this.drawnCardId=null;if(p.hand.length===1&&!uno)this.drawCards(p,2);if(p.hand.length===0){this.finishPlayer(p);return card;}if(card.value==="reverse"){this.direction*=-1;this.turnIndex=this.players.length===2?this.nextIndex(this.turnIndex,2):this.nextIndex();}else if(card.value==="skip")this.turnIndex=this.nextIndex(this.turnIndex,2);else if(card.value==="draw2"||card.value==="wild4"){const amount=card.value==="draw2"?2:4;const target=this.players[this.nextIndex()];this.drawCards(target,amount);this.turnIndex=this.nextIndex(this.turnIndex,2);}else this.turnIndex=this.nextIndex();return card;}
  finishPlayer(p){p.playing=false;this.winnerId=p.id;this.standings=[p.id,...this.players.filter(x=>x.id!==p.id).sort((a,b)=>a.hand.length-b.hand.length).map(x=>x.id)];this.phase="finished";this.turnIndex=-1;}
  act(playerId,actionId,fn){if(!actionId||String(actionId).length>80)throw Error("actionId wajib.");if(this.actions.has(actionId)){if(this.actions.get(actionId)!==playerId)throw Error("actionId milik pemain lain.");return {duplicate:true};}this.actions.set(actionId,playerId);try{const value=fn();return{duplicate:false,value};}catch(e){this.actions.delete(actionId);throw e;}}
  viewFor(id){const me=this.players.find(p=>p.id===id);return{phase:this.phase,players:this.players.map(p=>({id:p.id,name:p.name,cardCount:p.hand.length,playing:p.playing})),myHand:me?.hand||[],turnPlayerId:this.phase==="playing"?this.current().id:null,topCard:this.discard?.at(-1)||null,activeColor:this.activeColor||null,stockCount:this.deck?.length||0,canPass:this.drawnBy===id,drawnCardId:this.drawnBy===id?this.drawnCardId:null,winnerId:this.winnerId||null,standings:[...this.standings]};}
}
module.exports={UnoGame,createDeck,COLORS,shuffle};
