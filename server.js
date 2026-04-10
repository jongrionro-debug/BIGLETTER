const express = require('express');
const https = require('https');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

const OPENAI_KEY    = process.env.OPENAI_API_KEY    || '';
const GEMINI_KEY    = process.env.GEMINI_API_KEY    || '';
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || '';

let AI_ENGINE = 'demo';
if (OPENAI_KEY)         AI_ENGINE = 'openai';
else if (GEMINI_KEY)    AI_ENGINE = 'gemini';
else if (ANTHROPIC_KEY) AI_ENGINE = 'anthropic';

async function callAI(system, messages, max) {
  if (AI_ENGINE === 'openai')    return callOpenAI(system, messages, max);
  if (AI_ENGINE === 'gemini')    return callGemini(system, messages, max);
  if (AI_ENGINE === 'anthropic') return callAnthropic(system, messages, max);
  return null;
}

function httpPost(hostname, urlPath, headers, body) {
  return new Promise((resolve, reject) => {
    const buf = Buffer.from(body);
    const req = https.request({ hostname, path: urlPath, method: 'POST', headers: { ...headers, 'Content-Length': buf.length } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { reject(e); } });
    });
    req.on('error', reject);
    req.write(buf); req.end();
  });
}

async function callOpenAI(system, messages, max) {
  const r = await httpPost('api.openai.com', '/v1/chat/completions',
    { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
    JSON.stringify({ model: 'gpt-4o-mini', max_tokens: max, messages: [{ role: 'system', content: system }, ...messages] }));
  if (r.error) throw new Error(r.error.message);
  return r.choices[0].message.content;
}

async function callGemini(system, messages, max) {
  const contents = messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));
  const r = await httpPost('generativelanguage.googleapis.com',
    `/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
    { 'Content-Type': 'application/json' },
    JSON.stringify({ system_instruction: { parts: [{ text: system }] }, contents, generationConfig: { maxOutputTokens: max } }));
  if (r.error) throw new Error(r.error.message);
  return r.candidates[0].content.parts[0].text;
}

async function callAnthropic(system, messages, max) {
  const r = await httpPost('api.anthropic.com', '/v1/messages',
    { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01' },
    JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: max, system, messages }));
  if (r.error) throw new Error(r.error.message);
  return r.content[0].text;
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const COIN_REWARDS = { card_complete: 10, mission_complete: 20, qr_scan: 15 };

const db = {
  children: [
    { id: 1, name: '김준서', grade: '2학년', village: '다로리마을', parentName: '김민수', emoji: '🦁', equipped: [], coins: 45, completedMissions: 3 },
    { id: 2, name: '이나은', grade: '3학년', village: '다로리마을', parentName: '이정은', emoji: '🐿️', equipped: [], coins: 70, completedMissions: 5 },
    { id: 3, name: '박민준', grade: '4학년', village: '화양읍',    parentName: '박성호', emoji: '🦊', equipped: [], coins: 25, completedMissions: 2 },
    { id: 4, name: '최서윤', grade: '2학년', village: '청도읍',    parentName: '최영희', emoji: '🐰', equipped: [], coins: 10, completedMissions: 1 },
    { id: 5, name: '정하늘', grade: '5학년', village: '각남면',    parentName: '정재원', emoji: '🦋', equipped: [], coins: 110, completedMissions: 7 },
  ],

  villages: ['다로리마을', '화양읍', '청도읍', '각남면', '풍각면', '매전면', '운문면'],

  activityTagMap: {
    '목공수업':    { emoji: '🪵', tags: ['창의', '문제해결'], items: ['🪵 장인의 망치', '🪚 나무 모자'] },
    '생태교실':    { emoji: '🌿', tags: ['자연탐구', '표현'],  items: ['🌿 풀잎 머리띠', '🔍 탐험가 돋보기'] },
    '마을탐험':    { emoji: '🗺️', tags: ['협력', '창의'],     items: ['🗺️ 탐험가 배낭', '🧭 나침반'] },
    '음반제작':    { emoji: '🎵', tags: ['창의', '표현'],      items: ['🎵 음표 귀걸이', '🎤 마이크'] },
    '두부만들기':  { emoji: '🫘', tags: ['협력', '자연탐구'], items: ['🫘 콩 요리사 앞치마', '🥄 나무 숟가락'] },
    '달리기훈련':  { emoji: '🏃', tags: ['신체활동', '협력'], items: ['👟 달리기 운동화', '🏅 체력 배지'] },
    '엄빠학교':    { emoji: '📚', tags: ['협력', '표현'],      items: ['📚 지식의 책', '✏️ 금빛 연필'] },
    '플로깅':      { emoji: '🌍', tags: ['협력', '자연탐구'], items: ['🌍 지구 배지', '♻️ 재활용 가방'] },
    '어르신 말벗': { emoji: '👴', tags: ['협력', '표현'],      items: ['💬 이야기 말풍선', '🍵 전통 찻잔'] },
  },

  qrLocations: [
    { id: 'qr01', village: '다로리마을', spot: '마을 느티나무',     emoji: '🌳', cardName: '마을의 수호나무',    cardDesc: '수백 년 동안 마을을 지켜온 느티나무. 어르신들의 어린 시절 추억이 가득 담겨있어요.', rarity: 'common' },
    { id: 'qr02', village: '다로리마을', spot: '청도천 징검다리',   emoji: '🪨', cardName: '청도천 길목',        cardDesc: '아이들이 첨벙첨벙 건너던 돌다리. 물속에서 가재를 잡을 수 있는 특별한 장소예요.', rarity: 'common' },
    { id: 'qr03', village: '다로리마을', spot: '마을 공동 텃밭',    emoji: '🥬', cardName: '공동 텃밭 탐험가',   cardDesc: '마을 어르신들과 함께 채소를 키우는 텃밭. 씨앗에서 밥상까지의 여정을 배웠어요.', rarity: 'common' },
    { id: 'qr04', village: '다로리마을', spot: '살롱 드 다로리',    emoji: '☕', cardName: '마을 사랑방',        cardDesc: '다로리 사람들이 모여 이야기를 나누는 특별한 공간. 마을의 심장이에요.', rarity: 'rare' },
    { id: 'qr05', village: '화양읍',    spot: '화양읍 오일장',     emoji: '🏪', cardName: '오일장 탐험가',       cardDesc: '5일마다 열리는 전통 시장. 다양한 농산물과 사람들의 이야기가 넘치는 곳이에요.', rarity: 'common' },
    { id: 'qr06', village: '화양읍',    spot: '이서면 벽화 마을',  emoji: '🎨', cardName: '벽화 마을 예술가',   cardDesc: '마을 담벼락을 가득 채운 벽화들. 주민들의 꿈과 이야기가 그림으로 남아있어요.', rarity: 'rare' },
    { id: 'qr07', village: '각남면',    spot: '남성현역',           emoji: '🚂', cardName: '100년 기차역',       cardDesc: '100년 전부터 기차가 다녔던 작은 역. 마을과 도시를 연결해온 역사의 흔적이에요.', rarity: 'rare' },
    { id: 'qr08', village: '각남면',    spot: '운문댐 전망대',      emoji: '💧', cardName: '맑은 물의 근원',     cardDesc: '청도군 식수를 책임지는 운문댐. 맑은 물이 마을로 흘러오는 시작점이에요.', rarity: 'legendary' },
    { id: 'qr09', village: '청도읍',    spot: '청도 소싸움 경기장', emoji: '🐂', cardName: '소싸움 전통',        cardDesc: '청도의 유명한 소싸움 문화. 수백 년을 이어온 마을의 자랑스러운 전통이에요.', rarity: 'rare' },
    { id: 'qr10', village: '풍각면',    spot: '와인 터널',          emoji: '🍷', cardName: '달콤한 터널',        cardDesc: '청도 감으로 만든 감와인을 숙성시키는 신비로운 터널. 달콤한 향기가 가득해요.', rarity: 'legendary' },
  ],

  shopItems: [
    { id: 's01', name: '탐험가 모자',    emoji: '🪖', category: '모자',    price: 20,  desc: '마을 탐험가의 필수품!',      rarity: 'common' },
    { id: 's02', name: '마법사 고깔',    emoji: '🎩', category: '모자',    price: 30,  desc: '신비로운 마법사의 모자',      rarity: 'rare' },
    { id: 's03', name: '황금 왕관',      emoji: '👑', category: '모자',    price: 80,  desc: '마을 도감의 왕!',             rarity: 'legendary' },
    { id: 's04', name: '꽃 화관',        emoji: '💐', category: '모자',    price: 25,  desc: '마을 꽃밭에서 만든 화관',     rarity: 'common' },
    { id: 's05', name: '돋보기',         emoji: '🔍', category: '악세서리', price: 15, desc: '관찰력 200% 업그레이드!',    rarity: 'common' },
    { id: 's06', name: '나침반',         emoji: '🧭', category: '악세서리', price: 20, desc: '어디든 길을 찾을 수 있어',   rarity: 'common' },
    { id: 's07', name: '별 목걸이',      emoji: '⭐', category: '악세서리', price: 35, desc: '도감 완성의 증표',            rarity: 'rare' },
    { id: 's08', name: '무지개 배낭',    emoji: '🌈', category: '악세서리', price: 50, desc: '7개 마을의 색을 담은 배낭',   rarity: 'rare' },
    { id: 's09', name: '봄꽃 배경',      emoji: '🌸', category: '배경',    price: 30,  desc: '봄날 다로리 마을 풍경',       rarity: 'common' },
    { id: 's10', name: '별빛 밤하늘',    emoji: '🌌', category: '배경',    price: 60,  desc: '농촌의 맑은 밤하늘',          rarity: 'rare' },
    { id: 's11', name: '마을 지도',      emoji: '🗺️', category: '배경',   price: 45,  desc: '7개 마을이 담긴 지도 배경',  rarity: 'rare' },
    { id: 's12', name: '새싹 탐험가',    emoji: '🌱', category: '칭호',    price: 10,  desc: '도감 여정을 시작한 탐험가',   rarity: 'common' },
    { id: 's13', name: '마을 지킴이',    emoji: '🌿', category: '칭호',    price: 40,  desc: '마을을 사랑하는 아이',        rarity: 'rare' },
    { id: 's14', name: '마을의 전설',    emoji: '🌳', category: '칭호',    price: 100, desc: '청도 7개 마을을 정복한 전설', rarity: 'legendary' },
  ],

  purchases: [
    { childId: 1, itemId: 's01', date: '2026-03-10' },
    { childId: 2, itemId: 's01', date: '2026-03-10' },
    { childId: 2, itemId: 's05', date: '2026-03-15' },
    { childId: 5, itemId: 's01', date: '2026-02-20' },
    { childId: 5, itemId: 's07', date: '2026-03-01' },
    { childId: 5, itemId: 's10', date: '2026-03-10' },
  ],

  qrClaims: [
    { childId: 1, qrId: 'qr01', date: '2026-03-15' },
    { childId: 1, qrId: 'qr02', date: '2026-03-17' },
    { childId: 2, qrId: 'qr01', date: '2026-03-14' },
    { childId: 5, qrId: 'qr07', date: '2026-02-25' },
    { childId: 5, qrId: 'qr08', date: '2026-03-05' },
  ],

  cards: [
    { id: 'c1',  childId: 1, activity: '목공수업',   type: 'activity', cardName: '새집 장인',      cardDesc: '나무로 새집을 직접 만드는 기술. 못 박는 위치에 따라 나무의 튼튼함이 달라져요.', childQuote: '못이 가장자리에 있으면 나무가 쪼개져요. 가운데에 박으면 될 것 같아요!', tags: ['창의', '문제해결'], date: '2026-03-17', village: '다로리마을', emoji: '🪵' },
    { id: 'c2',  childId: 1, activity: '생태교실',   type: 'activity', cardName: '봄꽃 탐험가',    cardDesc: '봄에 피어나는 들꽃의 비밀을 발견한 탐험가. 씨앗이 바람을 타고 날아가요.', childQuote: '씨앗이 솜털처럼 생긴 건 바람 타고 멀리 날려고 그런 거예요!', tags: ['자연탐구', '표현'], date: '2026-03-10', village: '다로리마을', emoji: '🌿' },
    { id: 'c3',  childId: 1, activity: '마을탐험',   type: 'activity', cardName: '길잡이',          cardDesc: '복잡한 골목도 기준점 하나면 길을 찾을 수 있어요.', childQuote: '이장님 댁 나무를 기준점으로 정하면 헷갈리지 않아요!', tags: ['협력', '창의'], date: '2026-03-03', village: '다로리마을', emoji: '🗺️' },
    { id: 'cq1', childId: 1, activity: 'QR탐험',     type: 'qr',      cardName: '마을의 수호나무', cardDesc: '수백 년 동안 마을을 지켜온 느티나무. 어르신들의 추억이 담겨있어요.', childQuote: '', tags: ['자연탐구'], date: '2026-03-15', village: '다로리마을', emoji: '🌳', rarity: 'common' },
    { id: 'cq2', childId: 1, activity: 'QR탐험',     type: 'qr',      cardName: '청도천 길목',     cardDesc: '아이들이 첨벙첨벙 건너던 돌다리. 물속에서 가재를 잡을 수 있어요.', childQuote: '', tags: ['자연탐구'], date: '2026-03-17', village: '다로리마을', emoji: '🪨', rarity: 'common' },
    { id: 'c4',  childId: 2, activity: '생태교실',   type: 'activity', cardName: '자연 관찰자',    cardDesc: '작은 풀 한 포기에서도 자연의 신비를 발견하는 눈을 가졌어요.', childQuote: '벌레가 흙을 뒤집으면 땅이 건강해진다고 어르신이 알려주셨어요!', tags: ['자연탐구'], date: '2026-03-15', village: '다로리마을', emoji: '🌿' },
    { id: 'c5',  childId: 2, activity: '마을탐험',   type: 'activity', cardName: '지도 제작자',    cardDesc: '마을 구석구석을 지도로 만드는 기술. 나만의 마을 지도를 완성했어요.', childQuote: '우리 마을에 이렇게 많은 골목이 있는 줄 몰랐어요!', tags: ['창의', '협력'], date: '2026-03-08', village: '다로리마을', emoji: '🗺️' },
    { id: 'c6',  childId: 3, activity: '목공수업',   type: 'activity', cardName: '나무 조각가',    cardDesc: '나무의 결을 따라 조각하면 훨씬 쉽게 깎을 수 있어요.', childQuote: '나무에도 방향이 있어요. 결 방향으로 깎으면 안 부러져요!', tags: ['창의', '문제해결'], date: '2026-03-12', village: '화양읍', emoji: '🪵' },
    { id: 'c7',  childId: 5, activity: '음반제작',   type: 'activity', cardName: '마을 음악가',    cardDesc: '마을의 이야기를 노래로 만들어요. 우리 마을만의 특별한 노래가 탄생했어요.', childQuote: '각남면의 들판 이야기를 노래로 만들었어요. 할머니가 좋아하셨어요!', tags: ['창의', '표현'], date: '2026-03-05', village: '각남면', emoji: '🎵' },
    { id: 'c8',  childId: 5, activity: '마을탐험',   type: 'activity', cardName: '역사 탐정',      cardDesc: '마을의 오래된 이야기를 찾아내는 탐정. 100년 전 기차 이야기를 발견했어요.', childQuote: '남성현역 옆에 100년 전부터 기차가 다녔대요!', tags: ['협력', '자연탐구'], date: '2026-02-26', village: '각남면', emoji: '🔍' },
    { id: 'c9',  childId: 5, activity: '어르신 말벗', type: 'activity', cardName: '이야기 수집가', cardDesc: '어르신의 옛날 이야기를 귀 기울여 듣고 기록하는 이야기꾼이에요.', childQuote: '어르신이 어렸을 때 이 마을에는 사과나무가 엄청 많았대요!', tags: ['협력', '표현'], date: '2026-02-19', village: '각남면', emoji: '💬' },
    { id: 'cq5', childId: 5, activity: 'QR탐험',     type: 'qr',      cardName: '100년 기차역',   cardDesc: '100년 전부터 기차가 다녔던 작은 역. 역사의 흔적이에요.', childQuote: '', tags: ['협력'], date: '2026-02-25', village: '각남면', emoji: '🚂', rarity: 'rare' },
    { id: 'cq6', childId: 5, activity: 'QR탐험',     type: 'qr',      cardName: '맑은 물의 근원', cardDesc: '청도군 식수를 책임지는 운문댐. 맑은 물이 마을로 흘러오는 시작점이에요.', childQuote: '', tags: ['자연탐구'], date: '2026-03-05', village: '각남면', emoji: '💧', rarity: 'legendary' },
  ],

  missions: [
    { id: 'm1', childId: 1, activity: '목공수업', mission: '오늘 만든 것 중 가장 어려웠던 부분을 마루에게 설명해줘', reward: '🪵 장인의 망치', completed: true,  date: '2026-03-17' },
    { id: 'm2', childId: 1, activity: '생태교실', mission: '오늘 발견한 식물 중 가장 신기했던 것과 그 이유를 말해줘', reward: '🌿 풀잎 머리띠', completed: true,  date: '2026-03-10' },
    { id: 'm3', childId: 2, activity: '마을탐험', mission: '마을에서 가장 기억에 남는 장소와 그 이유를 마루에게 알려줘', reward: '🗺️ 탐험가 배낭', completed: true, date: '2026-03-08' },
  ],

  conversations: [],
  reports: []
};

// ── ROUTES ──────────────────────────────────────────
app.get('/api/children',          (req, res) => res.json(db.children));
app.get('/api/children/:id',      (req, res) => res.json(db.children.find(c => c.id === parseInt(req.params.id)) || {}));
app.get('/api/villages',          (req, res) => res.json(db.villages));
app.get('/api/activities',        (req, res) => res.json(Object.keys(db.activityTagMap)));
app.get('/api/activity-tags',     (req, res) => res.json(db.activityTagMap));

app.get('/api/cards', (req, res) => {
  const { village, childId } = req.query;
  let cards = [...db.cards].filter(c => !c.pending).sort((a, b) => new Date(b.date) - new Date(a.date));
  if (village) cards = cards.filter(c => c.village === village);
  if (childId) cards = cards.filter(c => c.childId === parseInt(childId));
  res.json(cards.map(c => ({ ...c, child: db.children.find(ch => ch.id === c.childId) })));
});

app.get('/api/missions/:childId', (req, res) => res.json(db.missions.filter(m => m.childId === parseInt(req.params.childId))));
app.get('/api/conversations/:childId', (req, res) => res.json(db.conversations.filter(c => c.childId === parseInt(req.params.childId))));

// QR
app.get('/api/qr/locations', (req, res) => {
  const { village } = req.query;
  let locs = db.qrLocations;
  if (village) locs = locs.filter(l => l.village === village);
  res.json(locs);
});

app.get('/api/qr/claims/:childId', (req, res) => {
  const claims = db.qrClaims.filter(q => q.childId === parseInt(req.params.childId));
  const claimedIds = claims.map(q => q.qrId);
  res.json(db.qrLocations.map(loc => ({
    ...loc,
    claimed: claimedIds.includes(loc.id),
    claimedDate: claims.find(q => q.qrId === loc.id)?.date || null,
  })));
});

app.post('/api/qr/claim', (req, res) => {
  const { childId, qrId } = req.body;
  const child = db.children.find(c => c.id === parseInt(childId));
  const loc = db.qrLocations.find(l => l.id === qrId);
  if (!child || !loc) return res.status(404).json({ error: '잘못된 요청' });

  if (db.qrClaims.find(q => q.childId === parseInt(childId) && q.qrId === qrId)) {
    return res.json({ success: false, alreadyClaimed: true, message: '이미 수집한 장소예요! 다른 장소를 찾아봐요 🗺️' });
  }

  const card = { id: 'cq' + Date.now(), childId: parseInt(childId), activity: 'QR탐험', type: 'qr', cardName: loc.cardName, cardDesc: loc.cardDesc, childQuote: '', tags: ['자연탐구'], date: new Date().toISOString().split('T')[0], village: loc.village, emoji: loc.emoji, rarity: loc.rarity, spot: loc.spot };
  db.cards.push(card);
  db.qrClaims.push({ childId: parseInt(childId), qrId, date: new Date().toISOString().split('T')[0] });
  child.coins = (child.coins || 0) + COIN_REWARDS.qr_scan;

  res.json({ success: true, card, coinsEarned: COIN_REWARDS.qr_scan, totalCoins: child.coins, message: `📍 "${loc.spot}" 카드 획득! +${COIN_REWARDS.qr_scan}코인!` });
});

// Shop
app.get('/api/shop',                    (req, res) => res.json(db.shopItems));
app.get('/api/shop/purchases/:childId', (req, res) => res.json(db.purchases.filter(p => p.childId === parseInt(req.params.childId)).map(p => p.itemId)));

app.post('/api/shop/buy', (req, res) => {
  const { childId, itemId } = req.body;
  const child = db.children.find(c => c.id === parseInt(childId));
  const item = db.shopItems.find(i => i.id === itemId);
  if (!child || !item) return res.status(404).json({ error: '없음' });
  if (db.purchases.find(p => p.childId === parseInt(childId) && p.itemId === itemId))
    return res.json({ success: false, message: '이미 구매한 아이템이에요!' });
  if ((child.coins || 0) < item.price)
    return res.json({ success: false, message: `코인이 부족해요! ${item.price - child.coins}코인 더 필요해요 🪙` });

  child.coins -= item.price;
  db.purchases.push({ childId: parseInt(childId), itemId, date: new Date().toISOString().split('T')[0] });
  res.json({ success: true, item, remainCoins: child.coins, message: `🎉 "${item.name}" 구매 완료!` });
});

app.post('/api/shop/equip', (req, res) => {
  const { childId, itemId, equip } = req.body;
  const child = db.children.find(c => c.id === parseInt(childId));
  const item = db.shopItems.find(i => i.id === itemId);
  if (!child || !item) return res.status(404).json({ error: '없음' });
  if (!db.purchases.find(p => p.childId === parseInt(childId) && p.itemId === itemId))
    return res.json({ success: false, message: '구매하지 않은 아이템' });

  child.equipped = child.equipped || [];
  if (equip) {
    const samecat = db.shopItems.filter(i => i.category === item.category).map(i => i.id);
    child.equipped = child.equipped.filter(id => !samecat.includes(id));
    child.equipped.push(itemId);
  } else {
    child.equipped = child.equipped.filter(id => id !== itemId);
  }
  res.json({ success: true, equipped: child.equipped });
});

// AI Chat
app.post('/api/chat/start', async (req, res) => {
  const { childName, activity } = req.body;
  const fb = { '목공수업':`안녕 ${childName}야! 오늘 목공에서 뭘 만들었어? 🪵`, '생태교실':`안녕 ${childName}야! 오늘 생태 교실에서 뭘 발견했어? 🌿`, '마을탐험':`안녕 ${childName}야! 오늘 마을 탐험 어디까지 가봤어? 🗺️`, '음반제작':`안녕 ${childName}야! 오늘 어떤 노래 만들었어? 🎵`, '두부만들기':`안녕 ${childName}야! 오늘 두부 어땠어? 🫘`, '달리기훈련':`안녕 ${childName}야! 오늘 얼마나 뛰었어? 🏃`, '엄빠학교':`안녕 ${childName}야! 오늘 뭘 배웠어? 📚`, '플로깅':`안녕 ${childName}야! 오늘 뭘 많이 주웠어? 🌍`, '어르신 말벗':`안녕 ${childName}야! 어르신이 어떤 이야기를 해주셨어? 👴` };
  const fallback = fb[activity] || `안녕 ${childName}야! 오늘 ${activity} 어땠어? 😊`;
  if (AI_ENGINE === 'demo') return res.json({ content: fallback });
  try {
    const text = await callAI(`너는 '마루'야. 경북 청도 온마을 배움터의 AI 친구야. 초등학생과 대화해줘. 규칙: 질문 1개만, 짧게, 반말로, 따뜻하게, 이모지 가끔.`,
      [{ role: 'user', content: `나는 ${childName}이고 오늘 ${activity} 했어. 첫 인사와 질문 1개 해줘.` }], 150);
    res.json({ content: text });
  } catch { res.json({ content: fallback }); }
});

app.post('/api/chat', async (req, res) => {
  const { messages, activity, childName } = req.body;
  const demos = ['오, 그랬구나! 그때 기분이 어땠어?', '와 진짜? 왜 그렇게 생각했어?', '대박! 다음엔 어떻게 해보고 싶어?', '혼자 알아낸 거야? 대단한데 👍', '오늘 가장 기억에 남는 순간이 뭐야?'];
  if (AI_ENGINE === 'demo') return res.json({ content: demos[Math.floor(Math.random() * demos.length)] });
  try {
    const text = await callAI(`너는 '마루'야. 경북 청도 온마을 배움터 AI 친구야. ${childName}이가 오늘 ${activity} 했어. 규칙: 질문 1개만, 짧게 반말, 아이 말 먼저 반영, 반추 질문 자주, 칭찬 많이, 이모지 가끔. 5턴 이상이면 "오늘 가장 기억에 남는 순간이 뭐야?" 물어봐.`, messages, 250);
    res.json({ content: text });
  } catch { res.json({ content: '잠깐, 생각 중이야... 😊' }); }
});

// Cards generate
app.post('/api/cards/generate', async (req, res) => {
  const { activity, childIds, village, note } = req.body;
  const actInfo = db.activityTagMap[activity] || { emoji: '⭐', tags: [], items: [] };
  const demoMap = {
    '목공수업':   { cardName: '나무 장인',    cardDesc: '나무를 다루는 손재주를 키웠어요. 직접 만든 것의 소중함을 알게 됐죠.', mission: '오늘 만든 것 중 가장 어려웠던 부분을 마루에게 설명해줘', reward: actInfo.items[0] || '🎁 배지' },
    '생태교실':   { cardName: '자연 탐험가',  cardDesc: '마을 자연 속에서 살아있는 생명들을 발견했어요.', mission: '오늘 발견한 것 중 가장 신기했던 것과 이유를 말해줘', reward: actInfo.items[0] || '🎁 배지' },
    '마을탐험':   { cardName: '마을 길잡이',  cardDesc: '마을 구석구석을 탐험하며 숨겨진 이야기를 찾았어요.', mission: '마을에서 가장 기억에 남는 장소와 이유를 마루에게 알려줘', reward: actInfo.items[0] || '🎁 배지' },
    '두부만들기': { cardName: '전통 요리사',  cardDesc: '콩으로 두부를 만드는 전통 기술을 배웠어요.', mission: '두부 만들 때 가장 신기했던 순간을 마루에게 말해줘', reward: actInfo.items[0] || '🎁 배지' },
    '음반제작':   { cardName: '마을 음악가',  cardDesc: '마을의 이야기를 노래로 담아냈어요.', mission: '오늘 만든 노래에서 가장 마음에 드는 부분을 마루에게 설명해줘', reward: actInfo.items[0] || '🎁 배지' },
  };
  let generated = demoMap[activity] || { cardName: `${activity} 탐험가`, cardDesc: `${activity}를 통해 새로운 것을 배웠어요.`, mission: `오늘 ${activity}에서 배운 것 중 가장 기억에 남는 걸 마루에게 말해줘`, reward: actInfo.items[0] || '🎁 배지' };

  if (AI_ENGINE !== 'demo') {
    try {
      const raw = await callAI('너는 초등학생 마을 활동 기록 카드를 만드는 도우미야. JSON만 출력해.',
        [{ role: 'user', content: `활동: ${activity}\n마을: ${village}\n${note?`메모: ${note}`:''}\n아래 JSON만 출력해줘:\n{"cardName":"카드이름(5자이내)","cardDesc":"카드설명(2문장)","mission":"마루에게할질문(1문장)","reward":"아이템이름(이모지포함,10자이내)"}` }], 300);
      generated = JSON.parse(raw.replace(/```json|```/g, '').trim());
    } catch {}
  }

  const newCards = childIds.map(childId => {
    const child = db.children.find(c => c.id === parseInt(childId));
    const card = { id: 'c' + Date.now() + childId, childId: parseInt(childId), activity, type: 'activity', cardName: generated.cardName, cardDesc: generated.cardDesc, childQuote: '', tags: actInfo.tags, date: new Date().toISOString().split('T')[0], village, emoji: actInfo.emoji, pending: true };
    db.cards.push(card);
    const mission = { id: 'm' + Date.now() + childId, childId: parseInt(childId), activity, mission: generated.mission, reward: generated.reward, completed: false, date: new Date().toISOString().split('T')[0] };
    db.missions.push(mission);
    return { card, mission, childName: child?.name };
  });
  res.json({ success: true, generated, cards: newCards });
});

// Conversation save + coins
app.post('/api/conversations/save', async (req, res) => {
  const { childId, activity, messages } = req.body;
  const child = db.children.find(c => c.id === parseInt(childId));
  const bestQuote = messages.filter(m => m.role === 'user').pop()?.content || '';

  db.conversations.push({ id: 'cv' + Date.now(), childId: parseInt(childId), activity, date: new Date().toISOString().split('T')[0], messages });

  const card = db.cards.find(c => c.childId === parseInt(childId) && c.activity === activity && c.pending);
  if (card) { card.childQuote = bestQuote; card.pending = false; }

  let totalCoins = 0;
  child.coins = (child.coins || 0) + COIN_REWARDS.card_complete;
  totalCoins += COIN_REWARDS.card_complete;

  let reward = null;
  const mission = db.missions.find(m => m.childId === parseInt(childId) && m.activity === activity && !m.completed);
  if (mission) {
    mission.completed = true;
    reward = mission.reward;
    child.completedMissions = (child.completedMissions || 0) + 1;
    child.coins += COIN_REWARDS.mission_complete;
    totalCoins += COIN_REWARDS.mission_complete;
  }
  res.json({ success: true, reward, card, coinsEarned: totalCoins, totalCoins: child.coins });
});

// Report
app.post('/api/report/generate', async (req, res) => {
  const { childId } = req.body;
  const child = db.children.find(c => c.id === parseInt(childId));
  if (!child) return res.status(404).json({ error: '없음' });
  const existing = db.reports.find(r => r.childId === parseInt(childId));
  if (existing) return res.json({ report: existing });

  const cards = db.cards.filter(c => c.childId === parseInt(childId) && !c.pending);
  const missions = db.missions.filter(m => m.childId === parseInt(childId) && m.completed);
  const quotes = cards.map(c => c.childQuote).filter(Boolean);
  const activities = [...new Set(cards.filter(c=>c.type==='activity').map(c=>c.activity))].join(', ');
  const allTags = cards.flatMap(c => c.tags);
  const tagStats = {}; allTags.forEach(t => { tagStats[t] = (tagStats[t]||0)+1; });
  const topTags = Object.entries(tagStats).sort((a,b)=>b[1]-a[1]).slice(0,3).map(e=>e[0]).join(', ');
  const qrCount = cards.filter(c=>c.type==='qr').length;

  let content = `**${child.name} (${child.grade}, ${child.village}) — 이달의 성장 리포트**\n\n${child.name}는 이번 달 ${activities||'다양한 활동'}에 참여하며 ${cards.length}장의 도감 카드를 채우고(마을 탐험 ${qrCount}장 포함) ${missions.length}개의 미션을 완료했습니다.\n\n**주요 역량:** ${topTags||'협력, 창의'}\n\n**${child.name}의 목소리**\n> "${quotes[0]||'오늘도 재밌었어요!'}"\n\n다음 달도 응원합니다! 🌱`;

  if (AI_ENGINE !== 'demo' && cards.length > 0) {
    try {
      const text = await callAI('너는 아이의 성장 리포트를 쓰는 전문가야.',
        [{ role: 'user', content: `아이: ${child.name} (${child.grade}, ${child.village})\n활동: ${activities}\n카드: ${cards.length}장 (QR ${qrCount}장)\n미션: ${missions.length}개\n역량: ${topTags}\n발언: ${quotes.map(q=>`"${q}"`).join(' / ')}\n\n부모님께 드리는 이달 성장 리포트를 마크다운 300자 내외로 작성해줘. 제목, 역량 분석(이모지), 아이 발언 인용(>), 따뜻한 마무리 포함. 🌱로 끝내줘.` }], 500);
      content = text;
    } catch {}
  }

  const report = { id: 'r' + Date.now(), childId: parseInt(childId), childName: child.name, month: new Date().toISOString().slice(0,7), content, generatedAt: new Date().toISOString() };
  db.reports.push(report);
  res.json({ report });
});

app.get('/api/report/:childId', (req, res) => res.json(db.reports.find(r => r.childId === parseInt(req.params.childId)) || null));

app.get('/api/dashboard', (req, res) => {
  const allCards = db.cards.filter(c => !c.pending);
  const villageStats = db.villages.map(v => {
    const vc = db.children.filter(c => c.village === v);
    const vk = allCards.filter(c => c.village === v);
    return { name: v, childCount: vc.length, cardCount: vk.length, lastActivity: vk.sort((a,b)=>new Date(b.date)-new Date(a.date))[0]?.activity || '-' };
  });
  const allTags = allCards.flatMap(c => c.tags);
  const tagStats = {}; allTags.forEach(t => { tagStats[t] = (tagStats[t]||0)+1; });

  res.json({
    totalChildren: db.children.length,
    totalCards: allCards.length,
    totalMissions: db.missions.filter(m => m.completed).length,
    totalQrClaims: db.qrClaims.length,
    activeVillages: [...new Set(allCards.map(c => c.village))].length,
    villageStats, tagStats,
    recentCards: allCards.sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,6).map(c => ({ ...c, child: db.children.find(ch => ch.id === c.childId) }))
  });
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => {
  const eng = { openai:'GPT-4o-mini', gemini:'Gemini 2.0 Flash', anthropic:'Claude Sonnet', demo:'데모 모드' };
  console.log(`\n🌱 두레 — 마을 도감 AI 성장기록 시스템`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ http://localhost:${PORT}`);
  console.log(`🤖 AI: ${eng[AI_ENGINE]}`);
  console.log(`🪙 코인: 카드+${COIN_REWARDS.card_complete} / 미션+${COIN_REWARDS.mission_complete} / QR+${COIN_REWARDS.qr_scan}`);
  if (AI_ENGINE === 'demo') {
    console.log(`   GPT:    OPENAI_API_KEY=sk-...     node server.js`);
    console.log(`   Gemini: GEMINI_API_KEY=AIza...    node server.js`);
    console.log(`   Claude: ANTHROPIC_API_KEY=sk-ant- node server.js`);
  }
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
});
