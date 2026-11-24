const KEY = "IH_QUANTUM_ING_V4";
const GLOBAL_RATES = { EUR: 1, GBP: 0.85, USD: 1.09 };
const GLOBAL_SYM = { EUR: "€", GBP: "£", USD: "$" };
const WORLD_FX = {
  ES:{c:"EUR",s:"€",r:1,fmt:"IBAN-ES",tax:"AEAT España (25% IRPF)"}, GB:{c:"GBP",s:"£",r:0.85,fmt:"IBAN-UK",tax:"HMRC UK (20% Income Tax)"},
  US:{c:"USD",s:"$",r:1.09,fmt:"ABA-ROUTING",tax:"IRS USA (24% Federal)"}, CH:{c:"CHF",s:"CHF",r:0.94,fmt:"IBAN-CH",tax:"ESTV Suiza (35% VST)"},
  IN:{c:"INR",s:"₹",r:90.5,fmt:"IFSC-IN",tax:"Income Tax India (20% TDS)"}, CA:{c:"CAD",s:"C$",r:1.48,fmt:"EFT-CA",tax:"CRA Canadá (25%)"},
  DE:{c:"EUR",s:"€",r:1,fmt:"IBAN-DE",tax:"BZSt Alemania (26.3%)"}, FR:{c:"EUR",s:"€",r:1,fmt:"IBAN-FR",tax:"DGFiP Francia (30%)"},
  IT:{c:"EUR",s:"€",r:1,fmt:"IBAN-IT",tax:"Agenzia Entrate Italia (26%)"}, PT:{c:"EUR",s:"€",r:1,fmt:"IBAN-PT",tax:"AT Portugal (28%)"},
  JP:{c:"JPY",s:"¥",r:164,fmt:"ZENGIN-JP",tax:"NTA Japón (20.3%)"}, CN:{c:"CNY",s:"¥",r:7.85,fmt:"CNAPS-CN",tax:"STA China (20%)"},
  AE:{c:"AED",s:"AED",r:4.00,fmt:"IBAN-AE",tax:"FTA Emiratos Árabes (0%)"}, SA:{c:"SAR",s:"SAR",r:4.08,fmt:"IBAN-SA",tax:"ZATCA Arabia Saudí (5%)"},
  AU:{c:"AUD",s:"A$",r:1.65,fmt:"BSB-AU",tax:"ATO Australia (30%)"}, MX:{c:"MXN",s:"MX$",r:21.5,fmt:"CLABE-MX",tax:"SAT México (10%)"},
  BR:{c:"BRL",s:"R$",r:6.15,fmt:"PIX-ISPB",tax:"Receita Federal Brasil (15%)"}, AR:{c:"ARS",s:"ARS$",r:1080,fmt:"CBU-AR",tax:"ARCA Argentina (7%)"},
  CO:{c:"COP",s:"COL$",r:4650,fmt:"ACH-CO",tax:"DIAN Colombia (20%)"}, CL:{c:"CLP",s:"CLP$",r:1040,fmt:"TEF-CL",tax:"SII Chile (35%)"},
  SG:{c:"SGD",s:"S$",r:1.45,fmt:"FAST-SG",tax:"IRAS Singapur (0%)"}, NL:{c:"EUR",s:"€",r:1,fmt:"IBAN-NL",tax:"Belastingdienst NL (32%)"}
};
const ALL_COUNTRIES_ISO = ["AF","AL","DZ","AD","AO","AG","AR","AM","AU","AT","AZ","BS","BH","BD","BB","BY","BE","BZ","BJ","BT","BO","BA","BW","BR","BN","BG","BF","BI","CV","KH","CM","CA","CF","TD","CL","CN","CO","KM","CG","CD","CR","CI","HR","CU","CY","CZ","DK","DJ","DM","DO","EC","EG","SV","GQ","ER","EE","SZ","ET","FJ","FI","FR","GA","GM","GE","DE","GH","GR","GD","GT","GN","GW","GY","HT","HN","HK","HU","IS","IN","ID","IR","IQ","IE","IL","IT","JM","JP","JO","KZ","KE","KI","KP","KR","KW","KG","LA","LV","LB","LS","LR","LY","LI","LT","LU","MG","MW","MY","MV","ML","MT","MH","MR","MU","MX","FM","MD","MC","MN","ME","MA","MZ","MM","NA","NR","NP","NL","NZ","NI","NE","NG","MK","NO","OM","PK","PW","PA","PG","PY","PE","PH","PL","PT","QA","RO","RU","RW","KN","LC","VC","WS","SM","ST","SA","SN","RS","SC","SL","SG","SK","SI","SB","SO","ZA","SS","ES","LK","SD","SR","SE","CH","SY","TW","TJ","TZ","TH","TL","TG","TO","TT","TN","TR","TM","TV","UG","UA","AE","GB","US","UY","UZ","VU","VA","VE","VN","YE","ZM","ZW"];
const REGION_NAMES = new Intl.DisplayNames(["es"], { type: "region" });


function getWorldRule(code) {
  const iso = (code || "ES").toUpperCase();
  let label = iso; try { label = REGION_NAMES.of(iso) || iso; } catch {}
  const fx = WORLD_FX[iso] || { c: "USD", s: "$", r: 1.09, fmt: `ACCT-${iso}`, tax: `Autoridad Fiscal ${label} (20%)` };
  return { iso, label, cur: fx.c, sym: fx.s, rate: fx.r, fmt: fx.fmt || `IBAN-${iso}`, taxName: fx.tax, prefix: iso };
}
function buildNationalAccount(iso) {
  const rule = getWorldRule(iso), r = String(Math.floor(1000000000 + Math.random() * 9000000000));
  if (iso === "US") return `US-ABA 021000021 · ACCT ${r}`;
  if (iso === "MX") return `CLABE 01218000${r}`;
  if (iso === "IN") return `IFSC INDB0000108 · ${r}`;
  if (iso === "JP") return `ZENGIN 0005-102-${r.slice(0, 7)}`;
  if (iso === "GB") return `GB${Math.floor(11 + Math.random() * 88)} IHUK 2000 00 ${r.slice(0, 8)}`;
  return `${rule.prefix}${Math.floor(11 + Math.random() * 88)} 2100 0418 45 ${r.slice(0, 4)} ${r.slice(4)}`;
}
let DB = (() => { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; } })() || {
  activeId: "u1", lang: "ES", audio: true, displayCur: "EUR", blackBox: [],
  users: {
    u1: { id: "u1", name: "José Montes", dni: "70891234X", country: "ES", addr: "28001 · Salamanca, Madrid", iban: "ES23 2100 0418 45 4409 007020", op: 2450, sav: 12000, aeat: 816.67, frozen: false, movements: [{ date: "2026-11-23", concept: "Abono inicial cuenta operativa", amt: 2450, bal: 2450 }], semantics: [], vaults: [], pgc: [] },
    u2: { id: "u2", name: "Pedro Soros", dni: "51234890Z", country: "ES", addr: "28046 · Castellana, Madrid", iban: "ES81 2100 0418 45 2227 492534", op: 18500, sav: 50000, aeat: 6166.67, frozen: false, movements: [{ date: "2026-11-23", concept: "Abono dividendos cartera", amt: 18500, bal: 18500 }], semantics: [], vaults: [], pgc: [] }
  }
};
function getCountry(u) { if (u?.country && u.country.length === 2) return u.country.toUpperCase(); const p = (u?.iban || "").slice(0, 2).toUpperCase(); return /^[A-Z]{2}$/.test(p) ? p : "ES"; }
function fmt(eur, cCode = null) { const dc = DB.displayCur || "EUR"; if (GLOBAL_RATES[dc]) return `${(Number(eur || 0) * GLOBAL_RATES[dc]).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${GLOBAL_SYM[dc]}`; const r = getWorldRule(cCode || "ES"); return `${(Number(eur || 0) * r.rate).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${r.sym}`; }
function fmtLocalNative(eur, cCode) { const r = getWorldRule(cCode); return `${(Number(eur || 0) * r.rate).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${r.sym} (${r.cur})`; }


function parseSmart(raw) { let s = String(raw || "").trim().toUpperCase().replace(/[€£$₹]/g, "").replace(/\s+/g, ""); if (!s) return 0; let m = 1; if (s.endsWith("M")) { m = 1000000; s = s.slice(0, -1); } s = s.replace(/\./g, "").replace(/,/g, "."); return +(Math.abs(Number(s) || 0) * m).toFixed(2); }
function cur() { return DB.users[DB.activeId] || Object.values(DB.users).at(0); }
function save() { try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch {} render(); }
function today() { return document.getElementById("mov-date")?.value || new Date().toISOString().slice(0, 10); }
function playBankTone(f = 840, d = 0.12) { if (DB.audio === false) return; try { const C = window.AudioContext || window.webkitAudioContext, c = new C(), o = c.createOscillator(), g = c.createGain(); o.frequency.value = f; g.gain.setValueAtTime(0.06, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + d); o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + d); } catch {} }
function logBB(name, dni, desc, amt = null) { DB.blackBox = DB.blackBox || []; const ts = new Date().toLocaleString("es-ES"), hash = "BB-" + Math.abs([...(ts + name + desc)].reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0)).toString(16).toUpperCase().padStart(8, "0"); DB.blackBox.unshift({ ts, hash, holderName: name, dni, eventDesc: desc, amount: amt }); }
function recordOp(u, concept, signedAmt, ctaPgc) { if (u.frozen) { alert("Cuenta bloqueada."); return false; } if (signedAmt < 0 && Math.abs(signedAmt) > u.op) { alert("Saldo insuficiente."); return false; } u.op = +(u.op + signedAmt).toFixed(2); u.movements.unshift({ date: today(), concept, amt: signedAmt, bal: u.op }); u.pgc.unshift({ date: today(), cta: ctaPgc, concept, debe: signedAmt >= 0 ? signedAmt : 0, haber: signedAmt < 0 ? Math.abs(signedAmt) : 0 }); logBB(u.name, u.dni, `${concept} [${ctaPgc}]`, signedAmt); playBankTone(signedAmt >= 0 ? 880 : 620, 0.11); return true; }
const BANK_DICT = {
  ES: { openTitle: "🌍 Abrir Nueva Cuenta Independiente para Titular (Alta Mundial Universal)", openBtn: "➕ Abrir Cuenta Independiente", refreshBtn: "🔄 Actualidad", audioOn: "🔊 Sonido ON", audioOff: "🔇 Sonido OFF", t1: "💳 1. Operativa & Movimientos", t2: "⚛️ 2. Historial Semántico T+0", t3: "🪪 3. Tarjeta Quantum, Huchas & Remesas", t4: "🏛️ 4. Fiscalidad Mundial & Certificados", t5: "📒 5. Libro Mayor PGC & Caja Negra", t6: "📈 6. Inversiones & Ficha Titular", opLbl: "CUENTA OPERATIVA DISPONIBLE", savLbl: "CUENTA AHORRO INFINITYHUNT (4,5% TAE)", taxLbl: "RESERVA FISCAL RETENIDA (IMPUESTOS LOCALES)" },
  EN: { openTitle: "🌍 Open New Independent Account for Account Holder (Global Onboarding)", openBtn: "➕ Open Independent Account", refreshBtn: "🔄 Live Update", audioOn: "🔊 Sound ON", audioOff: "🔇 Sound OFF", t1: "💳 1. Operations & Transactions", t2: "⚛️ 2. Semantic T+0 History", t3: "🪪 3. Quantum Card, Vaults & Standing Orders", t4: "🏛️ 4. Global Taxation & Certificates", t5: "📒 5. General Ledger PGC & Black Box", t6: "📈 6. Investments & Holder Profile", opLbl: "AVAILABLE OPERATING ACCOUNT", savLbl: "INFINITYHUNT SAVINGS ACCOUNT (4.5% APY)", taxLbl: "WITHHELD TAX RESERVE (NATIONAL TAX AUTHORITY)" }
};
window.setBankLang = function (lang) { DB.lang = lang === "EN" ? "EN" : "ES"; playBankTone(780, 0.1); save(); };
window.setBankCurrency = function (curCode) { DB.displayCur = GLOBAL_RATES[curCode] ? curCode : "EUR"; playBankTone(920, 0.12); save(); };
window.toggleBankAudio = function () { DB.audio = DB.audio === false ? true : false; if (DB.audio) playBankTone(880, 0.12); save(); };
window.syncBankLiveNow = async function () {
  try { const p = JSON.parse(localStorage.getItem("CPUUI_TO_INFINITYHUNT_TX") || "null"); if (p) processCpuuiTransfer(p); } catch {}
  try { const r = await fetch("https://frankfurter.app"); if (r.ok) { const d = await r.json(); if (d.rates?.GBP) GLOBAL_RATES.GBP = d.rates.GBP; if (d.rates?.USD) GLOBAL_RATES.USD = d.rates.USD; } } catch {}
  playBankTone(960, 0.14); save();
};


window.showTab = function (id, btn) { document.querySelectorAll(".bank-tab").forEach(el => el.style.display = el.id === id ? "block" : "none"); document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active")); if (btn) btn.classList.add("active"); playBankTone(740, 0.08); };
window.switchUser = function (id) { if (DB.users[id]) { DB.activeId = id; save(); } };
window.addMovement = function (isExp) { const aEl = document.getElementById("mov-amount"), cEl = document.getElementById("mov-concept"), a = parseSmart(aEl?.value); if (!a) return; if (recordOp(cur(), (cEl?.value || "").trim() || (isExp ? "Gasto diario" : "Ingreso diario"), isExp ? -a : a, isExp ? "629 Gastos" : "572.1 Operativa")) { aEl.value = ""; cEl.value = ""; save(); } };
window.transferToSavings = function (pct) { const u = cur(), a = +(u.op * pct).toFixed(2); if (a > 0 && recordOp(u, "Traspaso a Ahorro InfinityHunt (4,5% TAE)", -a, "572.2 Ahorro")) { u.sav = +(u.sav + a).toFixed(2); save(); } };
window.transferToClient = function () { const s = cur(), r = DB.users[document.getElementById("tr-target")?.value], a = parseSmart(document.getElementById("tr-amt")?.value); if (r && a && recordOp(s, `Transferencia a ${r.name}`, -a, "400 Transferencias")) { recordOp(r, `Transferencia de ${s.name}`, a, "572.1 Operativa"); document.getElementById("tr-amt").value = ""; save(); } };
window.createVault = function () { const u = cur(), n = (document.getElementById("vault-name")?.value || "Hucha").trim(), a = parseSmart(document.getElementById("vault-amt")?.value); if (a && recordOp(u, `🐷 Hucha InfinityHunt: ${n}`, -a, "572.3 Huchas")) { u.vaults.push({ name: n, bal: a }); save(); } };
window.createNewClient = function () {
  const c = document.getElementById("new-country")?.value || "ES", n = (document.getElementById("new-name")?.value || "").trim(), d = (document.getElementById("new-dni")?.value || "").trim().toUpperCase();
  const rule = getWorldRule(c), ad = (document.getElementById("new-addr")?.value || "").trim() || rule.label, curPref = document.getElementById("new-cur-pref")?.value || "EUR";
  if (!n || !d) { alert("Introduce el nombre del titular y su DNI/Pasaporte/ID fiscal."); return; }
  const id = "u_" + Date.now(), localAcct = buildNationalAccount(c);
  DB.users[id] = { id, name: n, dni: d, country: c, addr: ad, iban: localAcct, op: 0, sav: 0, aeat: 0, frozen: false, movements: [], semantics: [], vaults: [], pgc: [] };
  DB.activeId = id; DB.displayCur = GLOBAL_RATES[curPref] ? curPref : "EUR";
  document.getElementById("new-name").value = ""; document.getElementById("new-dni").value = ""; document.getElementById("new-addr").value = "";
  logBB(n, d, `Alta Mundial (${rule.label} · ${rule.cur}) · Cuenta Local: ${localAcct} · Impuestos: ${rule.taxName}`, null); playBankTone(960, 0.15); save();
};
window.saveEditedClient = function () { const u = cur(), c = document.getElementById("edit-country")?.value || getCountry(u), n = (document.getElementById("edit-name")?.value || "").trim(), d = (document.getElementById("edit-dni")?.value || "").trim().toUpperCase(), ib = (document.getElementById("edit-iban")?.value || "").trim().toUpperCase(), ad = (document.getElementById("edit-addr")?.value || "").trim(); if (n && d && ib) { const rule = getWorldRule(c); u.country = c; u.name = n; u.dni = d; u.iban = ib; u.addr = ad || u.addr; logBB(u.name, u.dni, `Edición Ficha (${rule.label}): ${u.iban}`, null); save(); } };
function ensureCard(u) { if (!u.card) { const r = () => String(Math.floor(1000 + Math.random() * 9000)); u.card = { pan: `4532 ${r()} ${r()} ${r()}`, exp: "11/31", cvv: String(Math.floor(100 + Math.random() * 899)), limit: 5000 }; } return u.card; }
window.regenerateVirtualCard = function () { const u = cur(), r = () => String(Math.floor(1000 + Math.random() * 9000)); u.card = { pan: `4532 ${r()} ${r()} ${r()}`, exp: "11/31", cvv: String(Math.floor(100 + Math.random() * 899)), limit: ensureCard(u).limit }; logBB(u.name, u.dni, `Renovación Tarjeta Virtual PAN ${u.card.pan.slice(-4)}`, null); save(); };
window.updateCardLimit = function () { const u = cur(), lim = parseSmart(document.getElementById("card-limit-inp")?.value); if (lim > 0) { ensureCard(u).limit = lim; logBB(u.name, u.dni, `Nuevo límite diario tarjeta: ${fmt(lim, getCountry(u))}`, null); save(); } };
window.payWithCard = function () { const u = cur(), c = ensureCard(u), shop = (document.getElementById("card-shop")?.value || "Comercio").trim(), a = parseSmart(document.getElementById("card-amt")?.value); if (!a) return; if (a > c.limit) { alert(`⚠️ Supera el límite diario (${fmt(c.limit, getCountry(u))}).`); return; } if (recordOp(u, `💳 Tarjeta *${c.pan.slice(-4)}: ${shop}`, -a, "629 Compras")) save(); };


window.addScheduledOrder = function () { const u = cur(); u.scheduled = u.scheduled || []; const concept = (document.getElementById("rem-concept")?.value || "").trim() || "Pago periódico", amt = parseSmart(document.getElementById("rem-amt")?.value), freq = document.getElementById("rem-freq")?.value || "Mensual"; if (!amt) return; u.scheduled.push({ id: "REM-" + Date.now(), concept, amt, freq }); document.getElementById("rem-concept").value = ""; document.getElementById("rem-amt").value = ""; logBB(u.name, u.dni, `Orden periódica (${freq}): ${concept}`, amt); save(); };
window.runAllScheduledOrders = function () { const u = cur(), list = u.scheduled || []; if (!list.length) { alert("No hay órdenes periódicas."); return; } list.forEach(item => recordOp(u, `🔄 Remesa ${item.freq}: ${item.concept}`, -item.amt, "400 Órdenes Periódicas")); save(); };
window.settleAeat = function () { const u = cur(); if (u.aeat && !u.frozen) { u.pgc.unshift({ date: today(), cta: "4751 Hacienda", concept: `Liquidación Fiscal · ${u.dni}`, debe: u.aeat, haber: 0 }); logBB(u.name, u.dni, "Liquidación Reserva Fiscal", u.aeat); u.aeat = 0; save(); } };
window.downloadTaxReport = function () { const u = cur(), r = getWorldRule(getCountry(u)), txt = `INFORME FISCAL CONSOLIDADO · INFINITYHUNT_CUANTUM_BANK\nFecha: ${today()}\nTitular: ${u.name} (${u.dni})\nJurisdicción: ${r.label} (${r.cur})\nCuenta Nacional: ${u.iban}\nRégimen Fiscal: ${r.taxName}\nSaldo Operativo: ${fmt(u.op, u.country)} · Nativo: ${fmtLocalNative(u.op, u.country)}\nAhorro 4,5% TAE: ${fmt(u.sav, u.country)}\nReserva Fiscal Retenida: ${fmt(u.aeat, u.country)}\n`; const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([txt], { type: "text/plain;charset=utf-8" })); a.download = `Informe_Fiscal_${u.name.replace(/\s+/g, "_")}.txt`; a.click(); };
window.downloadOfficialCertificate = function () { const u = cur(), cCode = getCountry(u), rule = getWorldRule(cCode), ts = new Date().toLocaleString("es-ES"), certHash = "CERT-IH-" + Math.abs([...(ts + u.name + u.iban + u.op)].reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0)).toString(16).toUpperCase().padStart(8, "0"), totalPos = (Number(u.op) || 0) + (Number(u.sav) || 0); const doc = `INFINITYHUNT_CUANTUM_BANK · CERTIFICADO OFICIAL\nFecha: ${ts} · Código: ${certHash}\nTitular: ${u.name} (${u.dni}) · País: ${rule.label} (${rule.cur})\nCuenta Nacional: ${u.iban}\nPosición Total: ${fmt(totalPos, cCode)} (${fmtLocalNative(totalPos, cCode)})\nAutoridad Fiscal: ${rule.taxName}\n`; logBB(u.name, u.dni, `Certificado Oficial (${certHash})`, totalPos); save(); const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([doc], { type: "text/plain;charset=utf-8" })); a.download = `Certificado_${u.name.replace(/\s+/g, "_")}.txt`; a.click(); };
window.simulatePortfolio = function () { const [asset, rateStr] = (document.getElementById("sim-asset")?.value || "NVDA|0.18").split("|"), cap = parseSmart(document.getElementById("sim-capital")?.value), yrs = Number(document.getElementById("sim-years")?.value || 5), r = Number(rateStr), finalVal = cap * Math.pow(1 + r, yrs), cCode = getCountry(cur()); if (document.getElementById("sim-result")) document.getElementById("sim-result").innerText = `📊 Proyección ${asset} a ${yrs} años (${(r * 100).toFixed(0)}%): ${fmt(cap, cCode)} → ${fmt(finalVal, cCode)}.`; };
const REVERSE_CHANNEL = new BroadcastChannel("INFINITYHUNT_TO_CPUUI_PORTFOLIO");
window.executePortfolioOrder = function () { const [asset] = (document.getElementById("sim-asset")?.value || "NVIDIA (NVDA)|0.18").split("|"), cap = parseSmart(document.getElementById("sim-capital")?.value), u = cur(); if (!cap) return; if (recordOp(u, `📈 Orden Mercado → Capital: ${asset}`, -cap, "250 Inversiones Financieras")) { const ord = { orderId: "ORD-" + Date.now(), date: today(), holderName: u.name, dni: u.dni, iban: u.iban, asset, amountEur: cap }; REVERSE_CHANNEL.postMessage(ord); localStorage.setItem("INFINITYHUNT_TO_CPUUI_ORDER", JSON.stringify(ord)); save(); if (document.getElementById("sim-result")) document.getElementById("sim-result").innerText = `🚀 Orden enviada a Capital: ${asset} por ${fmt(cap, getCountry(u))}.`; } };
window.toggleFreeze = function () { const u = cur(); u.frozen = !u.frozen; save(); };
window.exportUserCsv = function () { const u = cur(), csv = "\uFEFFFecha;Concepto;Importe;Saldo\n" + u.movements.map(m => `${m.date};"${m.concept}";${m.amt};${m.bal}`).join("\n"); const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = `Extracto_${u.name.replace(/\s+/g, "_")}.csv`; a.click(); };
window.exportBlackBox = function () { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(DB.blackBox, null, 2)], { type: "application/json" })); a.download = `Caja_Negra_${Date.now()}.json`; a.click(); };
window.exportFullBackup = function () { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(DB, null, 2)], { type: "application/json" })); a.download = `InfinityHunt_Backup_${today()}.json`; a.click(); };
window.importFullBackup = function (input) {
  const f = input.files ? input.files.at(0) : null;
  if (!f) return;
  const r = new FileReader();
  r.onload = e => { try { const p = JSON.parse(e.target.result); if (p?.users) { DB = p; logBB("SISTEMA", "ADMIN", `Restauración backup: ${f.name}`, null); save(); alert("✅ Copia restaurada."); } } catch { alert("⚠️ Archivo no válido."); } };
  r.readAsText(f);
};

window.runSemanticQuantum = function () {
  const raw = (document.getElementById("sem-input")?.value || "").trim(), out = document.getElementById("sem-result");
  if (!raw) return;
  const q = raw.toLowerCase(), qid = "QID-" + String(Date.now()).slice(-6), dq = (0.996 + (raw.length % 39) / 10000).toFixed(4);
  const sigmaVal = +(1.5 * 1.115 - 0.02 * 0.5 + (raw.length % 17) * 0.0001).toFixed(4);
  cur().semantics.unshift({ date: today(), qid, txt: raw, dq: `${dq} (σ_ij=${sigmaVal})` });
  if (q.includes("crea") && (q.includes("agencia tributaria") || q.includes("aeat"))) {
    if (!DB.users.aeat) DB.users.aeat = { id: "aeat", name: "Agencia Tributaria (AEAT)", dni: "Q2826000H", country: "ES", addr: "Alcalá 9 · 28014 Madrid", iban: "ES00 9000 0001 20 0282 600000", op: 0, sav: 0, aeat: 0, frozen: false, movements: [], semantics: [], vaults: [], pgc: [] };
    DB.activeId = "aeat"; logBB("AEAT", "Q2826000H", `[${qid}] Alta Agencia Tributaria en Malla Viva`, null); save(); if (out) out.innerText = `⚛️ [${qid}] Cuenta Agencia Tributaria creada (0,004 ms · σ_ij=${sigmaVal}).`; return;
  }
  if (q.includes("baja") || q.includes("elimina")) {
    const bye = Object.values(DB.users).find(u => q.includes(u.name.toLowerCase()) || q.includes(u.dni.toLowerCase()));
    if (bye && Object.keys(DB.users).length > 1) { delete DB.users[bye.id]; DB.activeId = Object.keys(DB.users).at(0); logBB(bye.name, bye.dni, `[${qid}] Baja titular ejecutada en Malla Viva`, null); save(); if (out) out.innerText = `⚛️ [${qid}] Baja ejecutada para ${bye.name} (${bye.dni}) · 0,004 ms.`; return; }
  }
  if (q.includes("crea") || q.includes("alta")) {
    const nm = raw.replace(/.*?(?:crea\s+cuenta\s+(?:de|a)?|alta\s+(?:de|a)?)\s*/i, "").split(/,|\bde\b|\bdni\b/i).at(0).trim() || "Titular Cuántico";
    const id = "u_" + Date.now(), acct = buildNationalAccount("ES");
    DB.users[id] = { id, name: nm, dni: "ID-" + String(Date.now()).slice(-6), country: "ES", addr: "Madrid · España", iban: acct, op: 0, sav: 0, aeat: 0, frozen: false, movements: [], semantics: [], vaults: [], pgc: [] };
    DB.activeId = id; logBB(nm, DB.users[id].dni, `[${qid}] Alta semántica PEUO · ${acct}`, null); save(); if (out) out.innerText = `⚛️ [${qid}] Cuenta creada para ${nm} · ${acct} (0,004 ms).`; return;
  }
  const target = Object.values(DB.users).find(u => q.includes(u.name.toLowerCase())) || cur(), gross = parseSmart(document.getElementById("sem-amt")?.value) || parseSmart((raw.match(/(\d+(?:[.,]\d+)?\s*m?)/i) || []).at(1));
  if ((q.includes("cpuui") || q.includes("traspas") || q.includes("dividendo") || q.includes("ingres")) && gross) {
    const net = +(gross * 0.75).toFixed(2), tax = +(gross * 0.25).toFixed(2); DB.activeId = target.id; recordOp(target, `⚛️ [${qid}] Malla Viva PEUO (75% Neto)`, net, "572.1 Operativa"); target.aeat = +(target.aeat + tax).toFixed(2); save(); if (out) out.innerText = `⚛️ [${qid}] Liquidado: +${fmt(net, getCountry(target))} a ${target.name} (0,004 ms).`; return;
  }
  logBB(target.name, target.dni, `[${qid}] Nodo Semántico HGCN: "${raw}" · σ_ij=${sigmaVal}`, null); save();
  
  
  
  if (out) out.innerText = `⚛️ [${qid}] Validado en Malla Viva HGCN (0,004 ms · σ_ij=${sigmaVal} · ΔQ=${dq}): "${raw}" sincronizado en el campo continuo de datos.`;
};


function processCpuuiTransfer(tx) {
  if (!tx || !tx.txId || localStorage.getItem("LAST_PROCESSED_CPUUI_TX") === tx.txId) return;
  localStorage.setItem("LAST_PROCESSED_CPUUI_TX", tx.txId);
  const gross = parseSmart(tx.gross); if (!gross) return;
  let client = Object.values(DB.users).find(u => u.name.toLowerCase() === (tx.holderName || "").toLowerCase() || u.dni === tx.dni);
  if (!client) {
    const id = "u_" + Date.now();
    client = DB.users[id] = { id, name: tx.holderName || "Titular Cuántico", dni: tx.dni || "ID-QUANTUM", country: "ES", addr: "Madrid · España", iban: tx.iban || buildNationalAccount("ES"), op: 0, sav: 0, aeat: 0, frozen: false, movements: [], semantics: [], vaults: [], pgc: [] };
  }
  if (!DB.users.aeat) DB.users.aeat = { id: "aeat", name: "Agencia Tributaria (AEAT)", dni: "Q2826000H", country: "ES", addr: "Alcalá 9, Madrid", iban: "ES00 9000 0001 20 0282 600000", op: 0, sav: 0, aeat: 0, frozen: false, movements: [], semantics: [], vaults: [], pgc: [] };
  const net = +(gross * 0.75).toFixed(2), tax = +(gross * 0.25).toFixed(2);
  recordOp(client, `⚡ [${tx.txId}] ${tx.concept} (75% Neto)`, net, "572.1 Operativa");
  client.aeat = +(client.aeat + tax).toFixed(2);
  recordOp(DB.users.aeat, `🏛️ [${tx.txId}] Retención 25% · ${client.name}`, tax, "4751 AEAT");
  DB.activeId = client.id; playBankTone(960, 0.16); save();
}
window.addEventListener("storage", e => { if (e.key === "CPUUI_TO_INFINITYHUNT_TX" && e.newValue) try { processCpuuiTransfer(JSON.parse(e.newValue)); } catch {} });
window.addEventListener("message", e => { if (e.data?.txId) processCpuuiTransfer(e.data); });
new BroadcastChannel("INFINITYHUNT_CUANTUM_BANK_HOST").onmessage = e => { if (e.data?.txId) processCpuuiTransfer(e.data); };


window.render = function () {
  const dict = BANK_DICT[DB.lang || "ES"] || BANK_DICT.ES;
  if (document.getElementById("title-open-indep")) document.getElementById("title-open-indep").innerText = dict.openTitle;
  if (document.getElementById("btn-create-indep")) document.getElementById("btn-create-indep").innerText = dict.openBtn;
  if (document.getElementById("btn-bank-refresh")) document.getElementById("btn-bank-refresh").innerText = dict.refreshBtn;
  if (document.getElementById("btn-bank-audio")) document.getElementById("btn-bank-audio").innerText = DB.audio === false ? dict.audioOff : dict.audioOn;
  ["t1","t2","t3","t4","t5","t6"].forEach((k, i) => { const el = document.getElementById("tab-lbl-" + (i + 1)); if (el) el.innerText = dict[k]; });
  if (document.getElementById("kpi-op-lbl")) document.getElementById("kpi-op-lbl").innerText = dict.opLbl;
  if (document.getElementById("kpi-sav-lbl")) document.getElementById("kpi-sav-lbl").innerText = dict.savLbl;
  if (document.getElementById("kpi-tax-lbl")) document.getElementById("kpi-tax-lbl").innerText = dict.taxLbl;
  if (document.getElementById("bank-currency-select")) document.getElementById("bank-currency-select").value = DB.displayCur || "EUR";
  const worldOpts = ALL_COUNTRIES_ISO.map(iso => ({ iso, name: getWorldRule(iso).label })).sort((a, b) => a.name.localeCompare(b.name, "es")).map(x => `<option value="${x.iso}">🌍 ${x.name} (${getWorldRule(x.iso).cur} · ${getWorldRule(x.iso).fmt})</option>`).join("");
  ["new-country", "edit-country"].forEach(id => { const s = document.getElementById(id); if (s && !s.options.length) s.innerHTML = worldOpts; });
  if (document.getElementById("mov-date") && !document.getElementById("mov-date").value) document.getElementById("mov-date").value = today();
  const list = Object.values(DB.users), u = cur(), cCode = getCountry(u), rule = getWorldRule(cCode), c = ensureCard(u);
  document.getElementById("user-select").innerHTML = list.map(x => `<option value="${x.id}"${x.id === u.id ? " selected" : ""}>${x.name} (${x.dni}) · ${getWorldRule(getCountry(x)).label}</option>`).join("");
  document.getElementById("tr-target").innerHTML = list.filter(x => x.id !== u.id).map(x => `<option value="${x.id}">${x.name} · ${x.iban}</option>`).join("");
  document.getElementById("user-banner").innerHTML = `<div><strong>👤 ${u.name}</strong> · ${rule.label} (${rule.cur}) · ID: ${u.dni} · 📍 ${u.addr}</div><div>Cuenta Nacional: <span style="background:#002d72;color:#fcd34d;padding:2px 8px;border-radius:6px;font-weight:800;">${u.iban}</span> ${u.frozen ? "<strong style='color:#dc2626;'>🔒 BLOQUEADA</strong>" : "<strong style='color:#059669;'>● ACTIVA</strong>"}</div>`;
  document.getElementById("box-op").innerText = fmt(u.op, cCode); document.getElementById("box-sav").innerText = fmt(u.sav, cCode); document.getElementById("box-aeat").innerText = fmt(u.aeat, cCode);
  document.getElementById("box-aeat-nif").innerText = `${rule.taxName} · Nativo: ${fmtLocalNative(u.aeat, cCode)}`;


  const setH = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
  setH("mov-tbody", u.movements.map(m => `<tr><td>${m.date}</td><td><strong>${m.concept}</strong></td><td style="color:${m.amt >= 0 ? "#059669" : "#dc2626"};font-weight:700;">${m.amt >= 0 ? "Ingreso" : "Gasto"}</td><td style="color:${m.amt >= 0 ? "#059669" : "#dc2626"};font-weight:800;">${m.amt >= 0 ? "+" : ""}${fmt(m.amt, cCode)}</td><td><strong>${fmt(m.bal, cCode)}</strong></td></tr>`).join("") || "<tr><td colspan='5'>Sin movimientos aún.</td></tr>");
  setH("sem-tbody", (u.semantics || []).map(s => `<tr><td>${s.date}</td><td><strong>${s.qid}</strong></td><td>${s.txt}</td><td><strong>${s.dq}</strong></td></tr>`).join("") || "<tr><td colspan='4'>Sin órdenes semánticas aún.</td></tr>");
  setH("vault-list", u.vaults.map(v => `<div class="gold-card" style="padding:10px;"><strong>🐷 ${v.name}</strong><div style="font-size:1.15rem;font-weight:800;color:#002d72;">${fmt(v.bal, cCode)}</div></div>`).join(""));
  setH("virtual-card-box", `<div style="display:flex;justify-content:space-between;font-size:0.75rem;opacity:0.85;"><span>INFINITYHUNT QUANTUM CARD</span><span>Límite: ${fmt(c.limit, cCode)}/día</span></div><div style="font-family:monospace;font-size:1.15rem;font-weight:800;letter-spacing:1.5px;margin:0.6rem 0;">${c.pan}</div><div style="display:flex;justify-content:space-between;font-size:0.8rem;"><span>TITULAR: <strong>${u.name.toUpperCase()}</strong></span><span>CAD: <strong>${c.exp}</strong> · CVV: <strong>${c.cvv}</strong></span></div>`);
  const op = Math.max(0, Number(u.op) || 0), sav = Math.max(0, Number(u.sav) || 0), tax = Math.max(0, Number(u.aeat) || 0), tot = op + sav + tax || 1, pOp = +((op / tot) * 100).toFixed(1), pSav = +((sav / tot) * 100).toFixed(1), pTax = +((tax / tot) * 100).toFixed(1);
  setH("wealth-bar-chart", `<div style="display:flex;height:18px;border-radius:9px;overflow:hidden;background:#e2e8f0;margin-bottom:6px;"><div style="width:${pOp}%;background:#059669;"></div><div style="width:${pSav}%;background:#002d72;"></div><div style="width:${pTax}%;background:#ff6200;"></div></div><div style="display:flex;gap:14px;flex-wrap:wrap;font-size:0.82rem;font-weight:700;"><span style="color:#059669;">● Operativa: ${fmt(op, cCode)} (${pOp}%)</span><span style="color:#002d72;">● Ahorro 4,5%: ${fmt(sav, cCode)} (${pSav}%)</span><span style="color:#ff6200;">● Impuestos: ${fmt(tax, cCode)} (${pTax}%)</span></div>`);
  setH("rem-list", (u.scheduled || []).map(x => `<div style="padding:5px;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;"><span><strong>${x.concept}</strong> (${x.freq})</span><strong>${fmt(x.amt, cCode)}</strong></div>`).join("") || "<span style='color:#64748b;'>Sin remesas programadas.</span>");
  setH("fiscal-card-detail", `• <strong>Titular:</strong> ${u.name} (${u.dni}) · <strong>País:</strong> ${rule.label} (${rule.cur}) · <strong>Cuenta Nacional:</strong> ${u.iban} · <strong>Autoridad Fiscal:</strong> ${rule.taxName}`);
  setH("tax-consolidated-summary", `• <strong>Modelo Fiscal:</strong> ${cCode !== "ES" ? `Declaración Local ${rule.label} + Modelo 720` : "Modelo 123 IRPF (AEAT España)"} · <strong>Reserva Retenida:</strong> ${fmt(u.aeat, cCode)} (Nativo: ${fmtLocalNative(u.aeat, cCode)})`);
  setH("pgc-tbody", u.pgc.map(p => `<tr><td>${p.date}</td><td><strong>${p.cta}</strong></td><td>${p.concept}</td><td style="color:#059669;">${fmt(p.debe, cCode)}</td><td style="color:#dc2626;">${fmt(p.haber, cCode)}</td></tr>`).join("") || "<tr><td colspan='5'>Sin asientos aún.</td></tr>");
  setH("blackbox-tbody", (DB.blackBox || []).map(e => `<tr><td>${e.ts}</td><td><strong>${e.hash}</strong></td><td>${e.holderName} (${e.dni})</td><td>${e.eventDesc}</td><td>${e.amount === null ? "—" : fmt(e.amount)}</td></tr>`).join("") || "<tr><td colspan='5'>Caja Negra activa...</td></tr>");
  if (document.getElementById("edit-country")) document.getElementById("edit-country").value = cCode;
  if (document.getElementById("edit-name")) document.getElementById("edit-name").value = u.name;
  if (document.getElementById("edit-dni")) document.getElementById("edit-dni").value = u.dni;
  if (document.getElementById("edit-iban")) document.getElementById("edit-iban").value = u.iban;
  if (document.getElementById("edit-addr")) document.getElementById("edit-addr").value = u.addr;
};

document.addEventListener("DOMContentLoaded", function () {
  syncBankLiveNow(); render();
  setInterval(() => {
    const fmtT = tz => new Intl.DateTimeFormat("es-ES", { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date());
    const euUsd = (GLOBAL_RATES.USD + (Math.random() - 0.5) * 0.0012).toFixed(4), euGbp = (GLOBAL_RATES.GBP + (Math.random() - 0.5) * 0.0009).toFixed(4), btc = (55292 + (Math.random() - 0.5) * 85).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    
    
    (function startBloombergTicker() {
  let posX = 0, paused = false;
  const updateQuotes = () => {
    const tape = document.getElementById("bloomberg-tape");
    if (!tape) return;
    if (!document.getElementById("bloomberg-track")) tape.innerHTML = `<span id="bloomberg-track" style="display:inline-block;will-change:transform;"></span>`;
    const trk = document.getElementById("bloomberg-track");
    const line = `📡 BLOOMBERG LIVE: EUR/USD ${(GLOBAL_RATES.USD + (Math.random() - 0.5) * 0.001).toFixed(4)} · EUR/GBP ${(GLOBAL_RATES.GBP + (Math.random() - 0.5) * 0.001).toFixed(4)} · TESLA (TSLA) 352,40 $ (+2,18%) · NVIDIA (NVDA) 147,90 $ (+3,45%) · APPLE (AAPL) 229,80 $ (+0,95%) · MICROSOFT (MSFT) 418,50 $ (+1,12%) · INDITEX (ITX) 54,12 € (+1,40%) · SANTANDER (SAN) 4,68 € (+1,85%) · IBERDROLA (IBE) 13,85 € (+0,75%) · BBVA 9,42 € (+1,30%) · LVMH 618,00 € (+0,90%) · SAP 224,50 € (+1,60%) · TOYOTA 2.740 ¥ (+1,15%) · IBEX 35 ${(11659 + (Math.random() - 0.5) * 18).toFixed(2)} · S&P 500 ${(5969 + (Math.random() - 0.5) * 12).toFixed(2)} · NASDAQ 100 20.685,40 · DAX 40 19.322,10 · FTSE 100 8.262,08 · ORO LBMA 2.712,40 $ · BTCEUR ${(55292 + (Math.random() - 0.5) * 85).toFixed(2)} € [🟢 24/7] &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; `;
    if (!paused) trk.innerHTML = line + line;
    tape.onmouseenter = () => paused = true; tape.onmouseleave = () => paused = false;
  };
  updateQuotes(); setInterval(updateQuotes, 4000);
  const step = () => { const trk = document.getElementById("bloomberg-track"); if (trk && !paused) { posX -= 0.75; if (Math.abs(posX) >= trk.scrollWidth / 2) posX = 0; trk.style.transform = `translateX(${posX}px)`; } requestAnimationFrame(step); };
  requestAnimationFrame(step);
})();

    
    if (document.getElementById("bank-world-clocks-footer")) document.getElementById("bank-world-clocks-footer").innerText = `🌐 MERCADOS DE FONDOS DE INVERSIÓN EN VIVO · 🇪🇸 Madrid (BME): ${fmtT("Europe/Madrid")} · 🇬🇧 Londres (LSE): ${fmtT("Europe/London")} · 🇺🇸 Nueva York (NYSE/NASDAQ): ${fmtT("America/New_York")} · 🇩🇪 Fráncfort (XETRA): ${fmtT("Europe/Berlin")} · 🇯🇵 Tokio (TSE): ${fmtT("Asia/Tokyo")} · 🇭🇰 Hong Kong (HKEX): ${fmtT("Asia/Hong_Kong")}`;
  }, 1000);
});
