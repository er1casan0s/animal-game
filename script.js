// ==================== BOAS-VINDAS DIÁRIAS ====================
function verificarBoasVindasDiarias(){
    if(!usuarioAtual) return;
    
    const hoje = getDataHoje();
    const ultimoAviso = usuarioAtual.ultimoAvisoDiario;
    
    if(ultimoAviso === hoje) return; // Já foi avisado hoje
    
    // Marca como avisado
    usuarioAtual.ultimoAvisoDiario = hoje;
    salvarDadosUsuario();
    
    // ✅ Cria a notificação de boas-vindas
    setTimeout(() => {
        // Resumo dos sorteios de HOJE
        const sorteiosHoje = sorteios.filter(s => s.data === hoje);
        const apostasHoje = apostas.filter(a => a.data === hoje && a.status === "ganhou");
        const totalGanho = apostasHoje.reduce((s, a) => s + (a.recompensa || 0), 0);
        
        let textoResumo = "";
        if(sorteiosHoje.length === 0){
            textoResumo = "Ainda não houve sorteios hoje. Boa sorte nas suas apostas!";
        } else {
            const ganhadores = sorteiosHoje.filter(s => s.bicho).map(s => {
                const bicho = animais[s.bicho];
                return `${bicho.emoji} ${bicho.nome} + ${s.milhar}`;
            }).join(" | ");
            textoResumo = `Resultados de hoje: ${ganhadores}`;
        }
        
        criarNotificacao("info", 
            `👋 <b>Bem-vindo(a), ${usuarioAtual.nickname}!</b><br>${textoResumo}<br><br>💰 Você ganhou hoje: <b>${totalGanho} moedas</b>`,
            { acao: "abrirSorteios" }
        );
        
        // Mostra badge mesmo antes de abrir
        atualizarBadgeNotificacoes();
    }, 2000);
}





// ==================== DADOS DOS BICHOS ====================
const animais = {
    1:{nome:"Avestruz",emoji:"🦤"},2:{nome:"Águia",emoji:"🦅"},3:{nome:"Burro",emoji:"🫏"},
    4:{nome:"Borboleta",emoji:"🦋"},5:{nome:"Cachorro",emoji:"🐶"},6:{nome:"Cabra",emoji:"🐐"},
    7:{nome:"Carneiro",emoji:"🐏"},8:{nome:"Camelo",emoji:"🐪"},9:{nome:"Cobra",emoji:"🐍"},
    10:{nome:"Coelho",emoji:"🐰"},11:{nome:"Cavalo",emoji:"🐴"},12:{nome:"Elefante",emoji:"🐘"},
    13:{nome:"Galo",emoji:"🐓"},14:{nome:"Gato",emoji:"🐱"},15:{nome:"Jacaré",emoji:"🐊"},
    16:{nome:"Leão",emoji:"🦁"},17:{nome:"Macaco",emoji:"🐵"},18:{nome:"Porco",emoji:"🐷"},
    19:{nome:"Pavão",emoji:"🦚"},20:{nome:"Peru",emoji:"🦃"},21:{nome:"Touro",emoji:"🐂"},
    22:{nome:"Tigre",emoji:"🐯"},23:{nome:"Urso",emoji:"🐻"},24:{nome:"Veado",emoji:"🦌"},
    25:{nome:"Vaca",emoji:"🐮"}
};

const TURNOS = {
    manha: {nome:"Manhã",emoji:"🌅",inicio:8,inicioMin:0,resultado:12,resultadoMin:0,horaResultado:"12:00",premios:{bicho:50,milhar:75,bichoMilhar:100}},
    tarde: {nome:"Tarde",emoji:"☀️",inicio:13,inicioMin:0,resultado:17,resultadoMin:0,horaResultado:"17:00",premios:{bicho:50,milhar:75,bichoMilhar:100}},
    noite: {nome:"Noite",emoji:"🌙",inicio:18,inicioMin:0,resultado:20,resultadoMin:0,horaResultado:"20:00",premios:{bicho:100,milhar:200,bichoMilhar:500}}
};

const LIMITE_APOSTAS = 10;

const NIVEIS = [
    {nome:"Bronze",emoji:"🥉",xpMin:0,xpMax:100,multiplicador:1.0},
    {nome:"Prata",emoji:"🥈",xpMin:100,xpMax:300,multiplicador:1.1},
    {nome:"Ouro",emoji:"🥇",xpMin:300,xpMax:700,multiplicador:1.25},
    {nome:"Platina",emoji:"💠",xpMin:700,xpMax:1500,multiplicador:1.5},
    {nome:"Diamante",emoji:"💎",xpMin:1500,xpMax:999999,multiplicador:2.0}
];

const CONQUISTAS = [
    {id:"primeira_aposta",emoji:"🎯",nome:"Primeira Aposta",desc:"Faça sua primeira aposta",cond:u=>(u.apostas||[]).length>=1},
    {id:"primeira_vitoria",emoji:"🎉",nome:"Primeira Vitória",desc:"Ganhe uma aposta",cond:u=>(u.apostas||[]).filter(a=>a.status==="ganhou").length>=1},
    {id:"dez_apostas",emoji:"🔟",nome:"10 Apostas",desc:"Faça 10 apostas",cond:u=>(u.apostas||[]).length>=10},
    {id:"cem_apostas",emoji:"💯",nome:"100 Apostas",desc:"Faça 100 apostas",cond:u=>(u.apostas||[]).length>=100},
    {id:"cinco_vitorias",emoji:"⭐",nome:"5 Vitórias",desc:"Ganhe 5 apostas",cond:u=>(u.apostas||[]).filter(a=>a.status==="ganhou").length>=5},
    {id:"vinte_vitorias",emoji:"🌟",nome:"20 Vitórias",desc:"Ganhe 20 apostas",cond:u=>(u.apostas||[]).filter(a=>a.status==="ganhou").length>=20},
    {id:"mil_moedas",emoji:"💰",nome:"1000 Moedas",desc:"Acumule 1000 moedas",cond:u=>(u.moedas||0)>=1000},
    {id:"cinco_mil_moedas",emoji:"💎",nome:"5000 Moedas",desc:"Acumule 5000 moedas",cond:u=>(u.moedas||0)>=5000},
    {id:"acertou_milhar",emoji:"🎰",nome:"Milhar Exata",desc:"Acerte uma milhar",cond:u=>(u.apostas||[]).some(a=>a.tipoVitoria==="milhar"||a.tipoVitoria==="bicho-milhar")},
    {id:"combo_3",emoji:"🔥",nome:"Combo x3",desc:"Acerte 3 vezes seguidas",cond:u=>(u.maiorCombo||0)>=3},
    {id:"noturno",emoji:"🌙",nome:"Coruja",desc:"Ganhe no turno da noite",cond:u=>(u.apostas||[]).some(a=>a.status==="ganhou"&&a.turno==="noite")},
    {id:"nivel_diamante",emoji:"💎",nome:"Diamante",desc:"Alcance o nível Diamante",cond:u=>(u.xp||0)>=1500}
];

// ==================== BANCO DE MISSÕES (50) ====================
const BANCO_MISSOES = [
    {id:"aposta_1",emoji:"🎯",nome:"Primeira Aposta",desc:"Faça sua primeira aposta hoje",meta:1,tipo:"total_apostas",xp:10,dificuldade:"facil"},
    {id:"aposta_2",emoji:"🎲",nome:"Dupla",desc:"Faça 2 apostas hoje",meta:2,tipo:"total_apostas",xp:12,dificuldade:"facil"},
    {id:"aposta_3",emoji:"🎲",nome:"Trio",desc:"Faça 3 apostas hoje",meta:3,tipo:"total_apostas",xp:15,dificuldade:"facil"},
    {id:"aposta_4",emoji:"🎯",nome:"Quarteto",desc:"Faça 4 apostas hoje",meta:4,tipo:"total_apostas",xp:20,dificuldade:"medio"},
    {id:"aposta_5",emoji:"🎯",nome:"Dedicação",desc:"Faça 5 apostas hoje",meta:5,tipo:"total_apostas",xp:25,dificuldade:"medio"},
    {id:"aposta_7",emoji:"🎲",nome:"Viciado",desc:"Faça 7 apostas hoje",meta:7,tipo:"total_apostas",xp:35,dificuldade:"medio"},
    {id:"aposta_10",emoji:"🎲",nome:"Inabalável",desc:"Faça 10 apostas hoje",meta:10,tipo:"total_apostas",xp:60,dificuldade:"dificil"},
    {id:"aposta_15",emoji:"🔥",nome:"Imparável",desc:"Faça 15 apostas hoje",meta:15,tipo:"total_apostas",xp:100,dificuldade:"dificil"},
    {id:"vitoria_1",emoji:"🏆",nome:"Sortudo",desc:"Ganhe 1 aposta hoje",meta:1,tipo:"vitorias",xp:15,dificuldade:"facil"},
    {id:"vitoria_2",emoji:"🏆",nome:"Em Série",desc:"Ganhe 2 apostas hoje",meta:2,tipo:"vitorias",xp:25,dificuldade:"medio"},
    {id:"vitoria_3",emoji:"🔥",nome:"Em Chamas",desc:"Ganhe 3 apostas hoje",meta:3,tipo:"vitorias",xp:50,dificuldade:"medio"},
    {id:"vitoria_5",emoji:"⭐",nome:"Imbatível",desc:"Ganhe 5 apostas hoje",meta:5,tipo:"vitorias",xp:80,dificuldade:"dificil"},
    {id:"vitoria_milhar",emoji:"💰",nome:"Milhar Exata",desc:"Acerte uma milhar hoje",meta:1,tipo:"vitorias_milhar",xp:40,dificuldade:"medio"},
    {id:"vitoria_bicho_milhar",emoji:"💎",nome:"Combo Perfeito",desc:"Acerte bicho + milhar hoje",meta:1,tipo:"vitorias_bicho_milhar",xp:70,dificuldade:"dificil"},
    {id:"combo_2",emoji:"🔥",nome:"Combo x2",desc:"Acerte 2 seguidas",meta:2,tipo:"combo_atual",xp:30,dificuldade:"medio"},
    {id:"combo_3",emoji:"🔥",nome:"Combo x3",desc:"Acerte 3 seguidas",meta:3,tipo:"combo_atual",xp:60,dificuldade:"dificil"},
    {id:"aposta_manha",emoji:"🌅",nome:"Madrugador",desc:"Aposte no turno da manhã",meta:1,tipo:"aposta_manha",xp:15,dificuldade:"facil"},
    {id:"aposta_tarde",emoji:"☀️",nome:"Vespertino",desc:"Aposte no turno da tarde",meta:1,tipo:"aposta_tarde",xp:15,dificuldade:"facil"},
    {id:"aposta_noite",emoji:"🌙",nome:"Coruja",desc:"Aposte no turno da noite",meta:1,tipo:"aposta_noite",xp:20,dificuldade:"facil"},
    {id:"vitoria_manha",emoji:"🌅",nome:"Sol Nascente",desc:"Ganhe de manhã",meta:1,tipo:"vitoria_manha",xp:35,dificuldade:"medio"},
    {id:"vitoria_tarde",emoji:"☀️",nome:"Sol a Pino",desc:"Ganhe à tarde",meta:1,tipo:"vitoria_tarde",xp:35,dificuldade:"medio"},
    {id:"vitoria_noite",emoji:"🌙",nome:"Lua Cheia",desc:"Ganhe à noite",meta:1,tipo:"vitoria_noite",xp:50,dificuldade:"medio"},
    {id:"aposta_2_manha",emoji:"🌅",nome:"Matinal",desc:"Faça 2 apostas de manhã",meta:2,tipo:"aposta_manha",xp:25,dificuldade:"medio"},
    {id:"aposta_2_noite",emoji:"🌙",nome:"Notívago",desc:"Faça 2 apostas à noite",meta:2,tipo:"aposta_noite",xp:30,dificuldade:"medio"},
    {id:"aposta_par",emoji:"2️⃣",nome:"Parceiro",desc:"Aposte em bicho de grupo PAR",meta:1,tipo:"aposta_par",xp:15,dificuldade:"facil"},
    {id:"aposta_impar",emoji:"1️⃣",nome:"Imparável",desc:"Aposte em bicho de grupo ÍMPAR",meta:1,tipo:"aposta_impar",xp:15,dificuldade:"facil"},
    {id:"aposta_3_par",emoji:"2️⃣",nome:"Só Pares",desc:"Faça 3 apostas em grupos PARES",meta:3,tipo:"aposta_par",xp:40,dificuldade:"medio"},
    {id:"aposta_3_impar",emoji:"1️⃣",nome:"Só Ímpares",desc:"Faça 3 apostas em grupos ÍMPARES",meta:3,tipo:"aposta_impar",xp:40,dificuldade:"medio"},
    {id:"vitoria_par",emoji:"🎯",nome:"Par Perfeito",desc:"Ganhe com grupo PAR",meta:1,tipo:"vitoria_par",xp:35,dificuldade:"medio"},
    {id:"vitoria_impar",emoji:"🎯",nome:"Ímpar Sortudo",desc:"Ganhe com grupo ÍMPAR",meta:1,tipo:"vitoria_impar",xp:35,dificuldade:"medio"},
    {id:"aposta_leao",emoji:"🦁",nome:"Rei da Selva",desc:"Aposte no Leão",meta:1,tipo:"aposta_bicho_16",xp:20,dificuldade:"facil"},
    {id:"aposta_tigre",emoji:"🐯",nome:"Tigre",desc:"Aposte no Tigre",meta:1,tipo:"aposta_bicho_22",xp:20,dificuldade:"facil"},
    {id:"aposta_aguia",emoji:"🦅",nome:"Voo Alto",desc:"Aposte na Águia",meta:1,tipo:"aposta_bicho_2",xp:20,dificuldade:"facil"},
    {id:"aposta_cavalo",emoji:"🐴",nome:"Corredor",desc:"Aposte no Cavalo",meta:1,tipo:"aposta_bicho_11",xp:20,dificuldade:"facil"},
    {id:"aposta_gato",emoji:"🐱",nome:"Miau",desc:"Aposte no Gato",meta:1,tipo:"aposta_bicho_14",xp:20,dificuldade:"facil"},
    {id:"aposta_cobra",emoji:"🐍",nome:"Serpente",desc:"Aposte na Cobra",meta:1,tipo:"aposta_bicho_9",xp:20,dificuldade:"facil"},
    {id:"aposta_vaca",emoji:"🐮",nome:"Fazendeiro",desc:"Aposte na Vaca",meta:1,tipo:"aposta_bicho_25",xp:20,dificuldade:"facil"},
    {id:"aposta_urso",emoji:"🐻",nome:"Ursão",desc:"Aposte no Urso",meta:1,tipo:"aposta_bicho_23",xp:20,dificuldade:"facil"},
    {id:"vitoria_leao",emoji:"🦁",nome:"Leão Vencedor",desc:"Ganhe apostando no Leão",meta:1,tipo:"vitoria_bicho_16",xp:60,dificuldade:"dificil"},
    {id:"vitoria_tigre",emoji:"🐯",nome:"Tigre Campeão",desc:"Ganhe apostando no Tigre",meta:1,tipo:"vitoria_bicho_22",xp:60,dificuldade:"dificil"},
    {id:"vitoria_cavalo",emoji:"🐴",nome:"Cavalo Veloz",desc:"Ganhe apostando no Cavalo",meta:1,tipo:"vitoria_bicho_11",xp:60,dificuldade:"dificil"},
    {id:"aposta_com_milhar",emoji:"🔢",nome:"Milionário",desc:"Aposte usando milhar",meta:1,tipo:"aposta_com_milhar",xp:15,dificuldade:"facil"},
    {id:"aposta_3_com_milhar",emoji:"🔢",nome:"Fã de Milhar",desc:"Faça 3 apostas com milhar",meta:3,tipo:"aposta_com_milhar",xp:35,dificuldade:"medio"},
    {id:"aposta_sem_milhar",emoji:"🎯",nome:"Simples Assim",desc:"Aposte só no bicho (sem milhar)",meta:1,tipo:"aposta_sem_milhar",xp:10,dificuldade:"facil"},
    {id:"xp_50",emoji:"⭐",nome:"Meio Caminho",desc:"Ganhe 50 XP hoje",meta:50,tipo:"xp_hoje",xp:20,dificuldade:"medio"},
    {id:"xp_100",emoji:"⭐",nome:"Centenário",desc:"Ganhe 100 XP hoje",meta:100,tipo:"xp_hoje",xp:40,dificuldade:"medio"},
    {id:"xp_200",emoji:"🌟",nome:"Colecionador de XP",desc:"Ganhe 200 XP hoje",meta:200,tipo:"xp_hoje",xp:80,dificuldade:"dificil"},
    {id:"subir_nivel",emoji:"📈",nome:"Subindo na Vida",desc:"Suba 1 nível hoje",meta:1,tipo:"subir_nivel",xp:50,dificuldade:"medio"},
    {id:"ficar_top10",emoji:"🏆",nome:"Top 10",desc:"Entre no Top 10 do ranking",meta:1,tipo:"top10",xp:50,dificuldade:"medio"},
    {id:"ficar_top3",emoji:"🥉",nome:"Pódio",desc:"Entre no Top 3 do ranking",meta:1,tipo:"top3",xp:100,dificuldade:"dificil"},
    {id:"aposta_3_bichos_diferentes",emoji:"🦜",nome:"Diversificado",desc:"Aposte em 3 bichos diferentes hoje",meta:3,tipo:"bichos_diferentes",xp:30,dificuldade:"medio"},
    {id:"aposta_5_bichos_diferentes",emoji:"🦜",nome:"Zoológico",desc:"Aposte em 5 bichos diferentes hoje",meta:5,tipo:"bichos_diferentes",xp:60,dificuldade:"dificil"},
    {id:"aposta_valor_baixo",emoji:"🐜",nome:"Formiguinha",desc:"Aposte em bichos de grupo até 10",meta:1,tipo:"aposta_grupo_baixo",xp:15,dificuldade:"facil"},
    {id:"aposta_valor_alto",emoji:"🐘",nome:"Gigante",desc:"Aposte em bichos de grupo acima de 15",meta:1,tipo:"aposta_grupo_alto",xp:15,dificuldade:"facil"}
];

const MISSOES_ATIVAS_MAX = 3;

const LOJA_ITENS = [
    {id:"bola_cristal",emoji:"🔮",nome:"Bola de Cristal",desc:"Mostra uma dica do próximo sorteio",preco:200},
    {id:"trevo_sorte",emoji:"🍀",nome:"Trevo da Sorte",desc:"Garante XP dobrado na próxima aposta",preco:150},
    {id:"aposta_extra",emoji:"🎫",nome:"Aposta Extra",desc:"Permite 1 aposta além do limite",preco:300},
    {id:"poção_xp",emoji:"⚗️",nome:"Poção de XP",desc:"Ganha +50 XP instantaneamente",preco:100},
    {id:"escudo",emoji:"🛡️",nome:"Escudo",desc:"Devolve 50% das moedas da próxima perda",preco:250}
];

const AVATARES = ["🦁","🐯","🐘","🦅","🐍","🦋","🐶","🐱","🐰","🐻","🐼","🦊","🐸","🐵","🦉","🐴","🦄","🐲","🦖","🐺"];

const DOMINIOS_EMAIL_VALIDOS = ["gmail.com","hotmail.com","outlook.com","yahoo.com","yahoo.com.br","live.com","icloud.com","bol.com.br","uol.com.br","terra.com.br","protonmail.com","proton.me","aol.com","zoho.com","mail.com","gmail.com.br","hotmail.com.br","outlook.com.br","ymail.com"];

// ==================== ESTADO ====================
let usuarioAtual = null;
let apostas = [];
let sorteios = [];
let bichoSelecionado = null;
let milharSelecionada = null;
let modoAposta = "bicho";
let somLigado = true;
let verificadorInterval = null;
let usuarioRecuperacao = null;
let modalCallback = null;
let avatarSelecionado = "🦁";
let temaAtual = "tema-escuro";
let graficos = {};

// ==================== ÁUDIO ====================
let audioCtx = null;
let musicaTimer = null;

function initAudio(){
    if(!audioCtx){
        try{audioCtx=new (window.AudioContext||window.webkitAudioContext)();}catch(e){}
    }
    if(audioCtx&&audioCtx.state==="suspended")audioCtx.resume();
}

function tocarNota(freq,duracao=0.15,tipo="sine",volume=0.15,delay=0){
    if(!somLigado||!audioCtx)return;
    const t=audioCtx.currentTime+delay;
    const osc=audioCtx.createOscillator();
    const gain=audioCtx.createGain();
    osc.type=tipo;
    osc.frequency.setValueAtTime(freq,t);
    gain.gain.setValueAtTime(0,t);
    gain.gain.linearRampToValueAtTime(volume,t+0.01);
    gain.gain.exponentialRampToValueAtTime(0.001,t+duracao);
    osc.connect(gain);gain.connect(audioCtx.destination);
    osc.start(t);osc.stop(t+duracao+0.05);
}

function somClique(){tocarNota(880,0.08,"square",0.08);tocarNota(1320,0.08,"square",0.05,0.05);}
function somVitoria(){if(!somLigado)return;[523.25,659.25,783.99,1046.5].forEach((f,i)=>tocarNota(f,0.25,"triangle",0.2,i*0.12));}
function somDerrota(){if(!somLigado)return;[392,349.23,293.66,220].forEach((f,i)=>tocarNota(f,0.25,"sawtooth",0.15,i*0.13));}
function somMoeda(){tocarNota(1200,0.08,"triangle",0.2);tocarNota(1800,0.1,"triangle",0.18,0.06);tocarNota(2400,0.15,"triangle",0.15,0.12);}
function somConquista(){if(!somLigado)return;[523.25,659.25,783.99,1046.5,1318.5].forEach((f,i)=>tocarNota(f,0.3,"triangle",0.2,i*0.1));}

function iniciarMusica(){
    if(!somLigado||!audioCtx)return;
    pararMusica();
    const melodia=[{f:523.25,d:0.25,t:0},{f:587.33,d:0.25,t:0.25},{f:659.25,d:0.25,t:0.5},{f:523.25,d:0.25,t:0.75},{f:659.25,d:0.25,t:1},{f:587.33,d:0.5,t:1.25},{f:523.25,d:0.75,t:1.75},{f:392,d:0.25,t:2.5},{f:440,d:0.25,t:2.75},{f:493.88,d:0.25,t:3},{f:523.25,d:0.75,t:3.25}];
    function loop(){
        if(!somLigado||!audioCtx)return;
        melodia.forEach(n=>{
            const t=audioCtx.currentTime+n.t;
            const osc=audioCtx.createOscillator();
            const gain=audioCtx.createGain();
            osc.type="triangle";
            osc.frequency.setValueAtTime(n.f,t);
            gain.gain.setValueAtTime(0,t);
            gain.gain.linearRampToValueAtTime(0.04,t+0.02);
            gain.gain.exponentialRampToValueAtTime(0.001,t+n.d);
            osc.connect(gain);gain.connect(audioCtx.destination);
            osc.start(t);osc.stop(t+n.d+0.05);
        });
    }
    loop();
    musicaTimer=setInterval(loop,4000);
}
function pararMusica(){if(musicaTimer){clearInterval(musicaTimer);musicaTimer=null;}}
function toggleSom(){
    somLigado=!somLigado;
    const btn=document.getElementById("btn-som");
    if(somLigado){btn.innerText="🔊";btn.classList.remove("mudo");initAudio();iniciarMusica();somClique();}
    else{btn.innerText="🔇";btn.classList.add("mudo");pararMusica();}
}

// ==================== TEMA ====================
function carregarTema(){
    const t=localStorage.getItem("animalGame_tema")||"tema-escuro";
    temaAtual=t;
    document.body.className=t;
    // atualiza TODOS os ícones de tema (login + flutuante)
    ["icone-tema","icone-tema-flutuante"].forEach(id=>{
        const el=document.getElementById(id);
        if(el)el.innerText=t==="tema-claro"?"☀️":"🌙";
    });
}
function toggleTema(){
    temaAtual=temaAtual==="tema-escuro"?"tema-claro":"tema-escuro";
    document.body.className=temaAtual;
    ["icone-tema","icone-tema-flutuante"].forEach(id=>{
        const el=document.getElementById(id);
        if(el)el.innerText=temaAtual==="tema-claro"?"☀️":"🌙";
    });
    localStorage.setItem("animalGame_tema",temaAtual);
}

// ==================== DB ====================
const DB_KEY="animalGame_db_v3";

function carregarDB(){
    try{const r=localStorage.getItem(DB_KEY);if(!r)return{usuarios:[]};return JSON.parse(r);}catch(e){return{usuarios:[]};}
}
function salvarDB(db){try{localStorage.setItem(DB_KEY,JSON.stringify(db));}catch(e){}}

function hashSenha(s){
    let h=0;for(let i=0;i<s.length;i++){h=((h<<5)-h)+s.charCodeAt(i);h=h&h;}
    return "h_"+Math.abs(h).toString(36);
}

function salvarDadosUsuario(){
    if(!usuarioAtual)return;
    const db=carregarDB();
    const idx=db.usuarios.findIndex(u=>u.nickname===usuarioAtual.nickname);
    if(idx!==-1){
        db.usuarios[idx]={...db.usuarios[idx],
            apostas,sorteios,
            moedas:usuarioAtual.moedas,
            xp:usuarioAtual.xp||0,
            missoes:usuarioAtual.missoes||{},
            combo:usuarioAtual.combo||0,
            maiorCombo:usuarioAtual.maiorCombo||0,
            itens:usuarioAtual.itens||{},
            numerosSorte:usuarioAtual.numerosSorte||[],
            conquistas:usuarioAtual.conquistas||[],
            avatar:usuarioAtual.avatar||"🦁",
            ultimoLogin:usuarioAtual.ultimoLogin||null,
            loginStreak:usuarioAtual.loginStreak||0,
            amigos:usuarioAtual.amigos||[],
            notificacoes: usuarioAtual.notificacoes || [],
            solicitacoesAmizade: usuarioAtual.solicitacoesAmizade || [],
            ultimoAvisoDiario: usuarioAtual.ultimoAvisoDiario || null,
            ultimaPremiacaoSemanal: usuarioAtual.ultimaPremiacaoSemanal || null,
            ultimaPremiacaoMensal: usuarioAtual.ultimaPremiacaoMensal || null,
        };
        salvarDB(db);
        Object.assign(usuarioAtual,db.usuarios[idx]);
    }
}

function carregarDadosUsuario(){
    if(!usuarioAtual)return;
    apostas=usuarioAtual.apostas||[];
    sorteios=usuarioAtual.sorteios||[];
    usuarioAtual.xp=usuarioAtual.xp||0;
    usuarioAtual.combo=usuarioAtual.combo||0;
    usuarioAtual.maiorCombo=usuarioAtual.maiorCombo||0;
    usuarioAtual.itens=usuarioAtual.itens||{};
    usuarioAtual.numerosSorte=usuarioAtual.numerosSorte||[];
    usuarioAtual.conquistas=usuarioAtual.conquistas||[];
    usuarioAtual.missoes=usuarioAtual.missoes||{};
    usuarioAtual.ultimoLogin=usuarioAtual.ultimoLogin||null;
    usuarioAtual.loginStreak=usuarioAtual.loginStreak||0;
    usuarioAtual.amigos=usuarioAtual.amigos||[];
    usuarioAtual.notificacoes = usuarioAtual.notificacoes || [];
    usuarioAtual.solicitacoesAmizade = usuarioAtual.solicitacoesAmizade || [];
    usuarioAtual.ultimoAvisoDiario = usuarioAtual.ultimoAvisoDiario || null;
    usuarioAtual.ultimaPremiacaoSemanal = usuarioAtual.ultimaPremiacaoSemanal || null;
    usuarioAtual.ultimaPremiacaoMensal = usuarioAtual.ultimaPremiacaoMensal || null;
}

// ==================== NOTIFICAÇÕES ====================
function notificar(texto,tipo="info",duracao=3000){
    const el=document.createElement("div");
    el.className=`notificacao ${tipo}`;
    el.innerText=texto;
    document.getElementById("notificacoes-container").appendChild(el);
    setTimeout(()=>{el.style.opacity="0";el.style.transform="translateX(120%)";setTimeout(()=>el.remove(),300);},duracao);
}

// ==================== NÍVEIS/XP ====================
function getNivel(xp){
    return NIVEIS.find(n=>xp>=n.xpMin&&xp<n.xpMax)||NIVEIS[NIVEIS.length-1];
}

function adicionarXP(qtd){
    const antes=getNivel(usuarioAtual.xp);
    usuarioAtual.xp+=qtd;
    const depois=getNivel(usuarioAtual.xp);
    if(depois.nome!==antes.nome){
        notificar(`🎊 Subiu para ${depois.emoji} ${depois.nome}!`,"conquista",5000);
        somConquista();
        if(typeof confetti==="function")confetti({particleCount:100,spread:70,origin:{y:0.6}});
    }
    atualizarXPBar();
    salvarDadosUsuario();
}

function atualizarXPBar(){
    if(!usuarioAtual)return;
    const nivel=getNivel(usuarioAtual.xp);
    const xpAtual=usuarioAtual.xp-nivel.xpMin;
    const xpTotal=nivel.xpMax-nivel.xpMin;
    const porcentagem=Math.min(100,(xpAtual/xpTotal)*100);
    const elEmoji=document.getElementById("nivel-emoji");
    const elNome=document.getElementById("nivel-nome");
    const elTexto=document.getElementById("xp-texto");
    const elProx=document.getElementById("xp-proximo-nivel");
    const elFill=document.getElementById("xp-bar-fill");
    if(elEmoji)elEmoji.innerText=nivel.emoji;
    if(elNome)elNome.innerText=nivel.nome;
    if(elTexto)elTexto.innerText=`${xpAtual} / ${xpTotal} XP`;
    const prox=NIVEIS[NIVEIS.indexOf(nivel)+1];
    if(elProx)elProx.innerText=prox?`Próximo: ${prox.emoji} ${prox.nome}`:"Nível máximo! 💎";
    if(elFill)elFill.style.width=porcentagem+"%";
}

// ==================== MISSÕES ====================
function getDataHoje(){return new Date().toISOString().split("T")[0];}

function getMissoesHoje(){
    const hoje = getDataHoje();
    
    // ✅ Se não tem missoes ou é de outro dia, recria
    if(!usuarioAtual.missoes || 
       typeof usuarioAtual.missoes !== "object" ||
       usuarioAtual.missoes.data !== hoje ||
       !usuarioAtual.missoes.ativas ||
       usuarioAtual.missoes.ativas.length === 0){
        
        console.log("🔄 Criando missões novas para hoje:", hoje);
        
        usuarioAtual.missoes = {
            data: hoje,
            ativas: [],
            progresso: {},
            completadas: [],
            coletadas: [],
            sorteadas: []
        };
        
        gerarMissoesIniciais();
        verificarMissoesEstado();
        salvarDadosUsuario();
    }
    
    return usuarioAtual.missoes;
}

function gerarMissoesIniciais(){
    const m = usuarioAtual.missoes;
    // ✅ Sorteia 3 missões fáceis aleatórias
    const faceis = BANCO_MISSOES.filter(x => x.dificuldade === "facil");
    const sorteadas = sortearAleatorias(faceis, MISSOES_ATIVAS_MAX);
    
    sorteadas.forEach(missao => {
        if(!m.ativas.includes(missao.id)){
            m.ativas.push(missao.id);
            m.sorteadas.push(missao.id);
            m.progresso[missao.id] = 0;
        }
    });
    
    console.log("✅ Missões geradas:", m.ativas);
}

function sortearAleatorias(arr,qtd){
    const copia=[...arr];
    const resultado=[];
    while(resultado.length<qtd&&copia.length>0){
        const i=Math.floor(Math.random()*copia.length);
        resultado.push(copia.splice(i,1)[0]);
    }
    return resultado;
}

function substituirMissao(missaoId){
    const m=usuarioAtual.missoes;
    const idx=m.ativas.indexOf(missaoId);
    if(idx===-1)return;
    m.ativas.splice(idx,1);
    const disponiveis=BANCO_MISSOES.filter(x=>!m.sorteadas.includes(x.id));
    if(disponiveis.length===0)return;
    const nova=disponiveis[Math.floor(Math.random()*disponiveis.length)];
    m.ativas.push(nova.id);
    m.sorteadas.push(nova.id);
    m.progresso[nova.id]=0;
    salvarDadosUsuario();
}

function incrementarMissao(tipo,qtd=1){
    const m=getMissoesHoje();
    m.ativas.forEach(id=>{
        const missao=BANCO_MISSOES.find(x=>x.id===id);
        if(!missao)return;
        if(m.completadas.includes(id))return;
        let deveIncrementar=false;
        if(missao.tipo===tipo)deveIncrementar=true;
        if(tipo.startsWith("aposta_bicho_")&&missao.tipo===tipo)deveIncrementar=true;
        if(tipo.startsWith("vitoria_bicho_")&&missao.tipo===tipo)deveIncrementar=true;
        if(deveIncrementar){
            m.progresso[id]=(m.progresso[id]||0)+qtd;
        }
    });
    verificarMissoesEstado();
    salvarDadosUsuario();
    renderizarMissoesAtivas();
}

function verificarMissoesEstado(){
    const m=getMissoesHoje();
    const hoje=getDataHoje();
    const apostasHoje=apostas.filter(a=>a.data===hoje);
    const vitoriasHoje=apostasHoje.filter(a=>a.status==="ganhou");

    console.log("🔍 Verificando missões. Apostas hoje:", apostasHoje.length, "| Vitórias:", vitoriasHoje.length);

    m.progresso["aposta_1"]=apostasHoje.length;
    m.progresso["aposta_2"]=apostasHoje.length;
    m.progresso["aposta_3"]=apostasHoje.length;
    m.progresso["aposta_4"]=apostasHoje.length;
    m.progresso["aposta_5"]=apostasHoje.length;
    m.progresso["aposta_7"]=apostasHoje.length;
    m.progresso["aposta_10"]=apostasHoje.length;
    m.progresso["aposta_15"]=apostasHoje.length;
    m.progresso["vitoria_1"]=vitoriasHoje.length;
    m.progresso["vitoria_2"]=vitoriasHoje.length;
    m.progresso["vitoria_3"]=vitoriasHoje.length;
    m.progresso["vitoria_5"]=vitoriasHoje.length;
    m.progresso["vitoria_milhar"]=vitoriasHoje.filter(a=>a.tipoVitoria==="milhar"||a.tipoVitoria==="bicho-milhar").length;
    m.progresso["vitoria_bicho_milhar"]=vitoriasHoje.filter(a=>a.tipoVitoria==="bicho-milhar").length;
    m.progresso["combo_2"]=usuarioAtual.combo||0;
    m.progresso["combo_3"]=usuarioAtual.combo||0;
    m.progresso["aposta_manha"]=apostasHoje.filter(a=>a.turno==="manha").length;
    m.progresso["aposta_tarde"]=apostasHoje.filter(a=>a.turno==="tarde").length;
    m.progresso["aposta_noite"]=apostasHoje.filter(a=>a.turno==="noite").length;
    m.progresso["aposta_2_manha"]=apostasHoje.filter(a=>a.turno==="manha").length;
    m.progresso["aposta_2_noite"]=apostasHoje.filter(a=>a.turno==="noite").length;
    m.progresso["vitoria_manha"]=vitoriasHoje.filter(a=>a.turno==="manha").length;
    m.progresso["vitoria_tarde"]=vitoriasHoje.filter(a=>a.turno==="tarde").length;
    m.progresso["vitoria_noite"]=vitoriasHoje.filter(a=>a.turno==="noite").length;
    m.progresso["aposta_par"]=apostasHoje.filter(a=>a.bichoNum%2===0).length;
    m.progresso["aposta_impar"]=apostasHoje.filter(a=>a.bichoNum%2===1).length;
    m.progresso["aposta_3_par"]=apostasHoje.filter(a=>a.bichoNum%2===0).length;
    m.progresso["aposta_3_impar"]=apostasHoje.filter(a=>a.bichoNum%2===1).length;
    m.progresso["vitoria_par"]=vitoriasHoje.filter(a=>a.bichoNum%2===0).length;
    m.progresso["vitoria_impar"]=vitoriasHoje.filter(a=>a.bichoNum%2===1).length;
    [2,9,11,14,16,22,23,25].forEach(num=>{
        m.progresso[`aposta_bicho_${num}`]=apostasHoje.filter(a=>a.bichoNum===num).length;
        m.progresso[`vitoria_bicho_${num}`]=vitoriasHoje.filter(a=>a.bichoNum===num).length;
    });
    m.progresso["aposta_com_milhar"]=apostasHoje.filter(a=>a.milhar!==null).length;
    m.progresso["aposta_3_com_milhar"]=apostasHoje.filter(a=>a.milhar!==null).length;
    m.progresso["aposta_sem_milhar"]=apostasHoje.filter(a=>a.milhar===null).length;
    const bichosUnicos=new Set(apostasHoje.map(a=>a.bichoNum));
    m.progresso["aposta_3_bichos_diferentes"]=bichosUnicos.size;
    m.progresso["aposta_5_bichos_diferentes"]=bichosUnicos.size;
    m.progresso["aposta_valor_baixo"]=apostasHoje.filter(a=>a.bichoNum<=10).length;
    m.progresso["aposta_valor_alto"]=apostasHoje.filter(a=>a.bichoNum>15).length;
    if(!m.xpInicioDia)m.xpInicioDia=usuarioAtual.xp||0;
    const xpHoje=(usuarioAtual.xp||0)-m.xpInicioDia;
    m.progresso["xp_50"]=xpHoje;
    m.progresso["xp_100"]=xpHoje;
    m.progresso["xp_200"]=xpHoje;
    if(!m.nivelInicioDia)m.nivelInicioDia=getNivel(usuarioAtual.xp||0).nome;
    const nivelAtual=getNivel(usuarioAtual.xp||0).nome;
    m.progresso["subir_nivel"]=m.nivelInicioDia!==nivelAtual?1:0;
    const db=carregarDB();
    const ordenados=[...db.usuarios].sort((a,b)=>(b.moedas||0)-(a.moedas||0));
    const posicao=ordenados.findIndex(u=>u.nickname===usuarioAtual.nickname)+1;
    m.progresso["ficar_top10"]=posicao<=10?1:0;
    m.progresso["ficar_top3"]=posicao<=3?1:0;
    
    console.log("📊 Progresso atualizado:", m.progresso);
}

function renderizarMissoesAtivas(){
    const container = document.getElementById("missoes-ativas");
    if(!container) return;
    
    garantir3MissoesAtivas();
    
    const m = getMissoesHoje();
    container.innerHTML = "";
    
    m.ativas.forEach(id => {
        const missao = BANCO_MISSOES.find(x => x.id === id);
        if(!missao) return;
        
        const progresso = Math.min(m.progresso[id] || 0, missao.meta);
        const completa = progresso >= missao.meta;
        const jaColetada = m.coletadas.includes(id);
        
        const card = document.createElement("div");
        // ✅ Se já foi coletada, fica com classe "coletada" (cinza)
        let classes = "missao-ativa-card";
        if(jaColetada) classes += " coletada";
        else if(completa) classes += " completa";
        card.className = classes;
        
        card.title = `${missao.desc} (+${missao.xp} XP)`;
        
        // ✅ Só clicável se está completa E não foi coletada
        if(completa && !jaColetada){
            card.onclick = () => coletarMissao(id);
        }
        
        card.innerHTML = `
            <span class="icone">${missao.emoji}</span>
            <span class="texto"><strong>${missao.nome}</strong> (${progresso}/${missao.meta})</span>
            ${jaColetada ? '<span class="icone">✅</span>' : (completa ? '<span class="icone">🎁</span>' : '')}
        `;
        container.appendChild(card);
    });
}

function garantir3MissoesAtivas(){
    const m = getMissoesHoje();
    while(m.ativas.length < MISSOES_ATIVAS_MAX){
        const disponiveis = BANCO_MISSOES.filter(x => !m.ativas.includes(x.id));
        if(disponiveis.length === 0) break;
        const nova = disponiveis[Math.floor(Math.random() * disponiveis.length)];
        m.ativas.push(nova.id);
        m.progresso[nova.id] = 0;
    }
    salvarDadosUsuario();
}


function coletarMissao(id){
    const missao=BANCO_MISSOES.find(m=>m.id===id);
    if(!missao)return;
    const m=getMissoesHoje();
    const progresso=m.progresso[id]||0;
    if(progresso<missao.meta)return;
    if(m.coletadas.includes(id))return;
    m.coletadas.push(id);
    m.completadas.push(id);
    adicionarXP(missao.xp);
    somConquista();
    notificar(`🎁 Missão "${missao.nome}" completa! +${missao.xp} XP`,"conquista",4000);
    substituirMissao(id);
    salvarDadosUsuario();
    renderizarMissoesAtivas();
}

function mostrarMissoes(){
    somClique();
    const container=document.getElementById("missoes-lista");
    const m=getMissoesHoje();
    container.innerHTML="";
    m.ativas.forEach(id=>{
        const missao=BANCO_MISSOES.find(x=>x.id===id);
        if(!missao)return;
        const progresso=Math.min(m.progresso[id]||0,missao.meta);
        const completa=progresso>=missao.meta;
        const jaColetada=m.coletadas.includes(id);
        const item=document.createElement("div");
        item.className=`missao-item ${jaColetada?"coletada":completa?"completa":""}`;
        item.innerHTML=`
            <span class="missao-emoji">${missao.emoji}</span>
            <div class="missao-info">
                <div class="missao-nome">${missao.nome}</div>
                <div class="missao-desc">${missao.desc}</div>
                <div class="missao-progresso">Progresso: ${progresso}/${missao.meta} • +${missao.xp} XP</div>
            </div>
            ${jaColetada?`<span style="color:#2ecc71;font-weight:700;">✅</span>`:completa?`<button class="gold" onclick="coletarMissao('${missao.id}');mostrarMissoes()">Coletar XP</button>`:""}
        `;
        container.appendChild(item);
    });
    document.getElementById("modal-missoes").classList.remove("hidden");
}

function fecharMissoes(){document.getElementById("modal-missoes").classList.add("hidden");}

// ==================== CONQUISTAS ====================
function verificarConquistas(){
    if(!usuarioAtual.conquistas)usuarioAtual.conquistas=[];
    CONQUISTAS.forEach(c=>{
        if(!usuarioAtual.conquistas.includes(c.id)&&c.cond(usuarioAtual)){
            usuarioAtual.conquistas.push(c.id);
            notificar(`🏅 Conquista desbloqueada: ${c.emoji} ${c.nome}`,"conquista",5000);
            somConquista();
            if(typeof confetti==="function")confetti({particleCount:80,spread:60,origin:{y:0.5}});
        }
    });
    salvarDadosUsuario();
}

function mostrarConquistas(){
    somClique();
    const container=document.getElementById("conquistas-lista");
    container.className="conquistas-grid";
    container.innerHTML="";
    CONQUISTAS.forEach(c=>{
        const desbloqueada=usuarioAtual.conquistas?.includes(c.id);
        const item=document.createElement("div");
        item.className=`conquista-item ${desbloqueada?"":"bloqueada"}`;
        item.innerHTML=`
            <span class="conquista-emoji">${desbloqueada?c.emoji:"🔒"}</span>
            <div class="conquista-info">
                <div class="conquista-nome">${c.nome}</div>
                <div class="conquista-desc">${c.desc}</div>
            </div>
        `;
        container.appendChild(item);
    });
    document.getElementById("modal-conquistas").classList.remove("hidden");
}
function fecharConquistas(){document.getElementById("modal-conquistas").classList.add("hidden");}

// ==================== LOJA ====================
function mostrarLoja(){
    somClique();
    document.getElementById("loja-moedas").innerText=usuarioAtual.moedas;
    const grid=document.getElementById("loja-grid");
    grid.className="loja-grid";
    grid.innerHTML="";
    LOJA_ITENS.forEach(item=>{
        const el=document.createElement("div");
        el.className="loja-item";
        el.innerHTML=`
            <span class="item-emoji">${item.emoji}</span>
            <div class="item-nome">${item.nome}</div>
            <div class="item-desc">${item.desc}</div>
            <div class="item-preco">🪙 ${item.preco}</div>
            <button class="gold" onclick="comprarItem('${item.id}')" ${usuarioAtual.moedas<item.preco?"disabled style='opacity:0.5'":""}>Comprar</button>
        `;
        grid.appendChild(el);
    });
    document.getElementById("modal-loja").classList.remove("hidden");
}
function fecharLoja(){document.getElementById("modal-loja").classList.add("hidden");}

function comprarItem(id){
    const item = LOJA_ITENS.find(i => i.id === id);
    if(!item) return;
    if(usuarioAtual.moedas < item.preco){
        notificar("❌ Moedas insuficientes!", "erro");
        return;
    }
    
    // Debita
    usuarioAtual.moedas -= item.preco;
    if(!usuarioAtual.itens) usuarioAtual.itens = {};
    usuarioAtual.itens[id] = (usuarioAtual.itens[id] || 0) + 1;
    
    // ✅ APLICA O EFEITO REAL DE CADA ITEM
    let efeitoTexto = "";
    
    switch(id){
        case "bola_cristal":
            // Mostra uma dica do próximo sorteio
            const dicaBicho = Math.floor(Math.random() * 25) + 1;
            const dicaMilhar = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
            usuarioAtual.dicaAtual = {
                bicho: dicaBicho,
                milhar: dicaMilhar,
                data: getDataHoje()
            };
            efeitoTexto = `Dica do próximo sorteio: ${animais[dicaBicho].emoji} ${animais[dicaBicho].nome} + ${dicaMilhar}`;
            break;
            
        case "trevo_sorte":
            // Próxima aposta ganha XP dobrado
            usuarioAtual.trevoAtivo = true;
            efeitoTexto = "Próxima aposta com XP dobrado!";
            break;
            
        case "aposta_extra":
            // +1 no limite de apostas
            efeitoTexto = "Você pode fazer 1 aposta a mais neste turno!";
            // O efeito é automático porque podeApostar() lê usuarioAtual.itens?.aposta_extra
            break;
            
        case "poção_xp":
            // +50 XP instantaneamente
            adicionarXP(50);
            efeitoTexto = "+50 XP adicionados!";
            // Remove do inventário (é consumível)
            usuarioAtual.itens[id] -= 1;
            if(usuarioAtual.itens[id] <= 0) delete usuarioAtual.itens[id];
            break;
            
        case "escudo":
            // Devolve 50% das moedas da próxima perda
            usuarioAtual.escudoAtivo = true;
            efeitoTexto = "Escudo ativado! Próxima perda devolve 50% das moedas.";
            break;
    }
    
    // ✅ Som
    somMoeda();
    
    // ✅ Toast rápido (canto da tela)
    notificar(`✅ Comprou ${item.emoji} ${item.nome}!`, "sucesso", 2500);
    
    // ✅ NOTIFICAÇÃO NO SININHO (com detalhes do efeito)
    criarNotificacao("vitoria",
        `🛒 <b>Compra realizada!</b><br>${item.emoji} <b>${item.nome}</b> por 🪙 ${item.preco}<br><small>${efeitoTexto}</small>`,
        { acao: "loja", itemId: id }
    );
    
    // ✅ Se for Bola de Cristal, mostra dica visível
    if(id === "bola_cristal"){
        setTimeout(() => {
            notificar(`🔮 Dica: ${animais[dicaBicho].emoji} ${animais[dicaBicho].nome} + ${dicaMilhar}`, "info", 6000);
        }, 800);
    }
    
    // Atualiza UI
    atualizarMoedas();
    atualizarXPBar();
    salvarDadosUsuario();
    mostrarLoja();
}
// ==================== AMIGOS ====================
function adicionarAmigo(nickname){
    // ✅ Agora envia uma SOLICITAÇÃO em vez de adicionar direto
    solicitarAmizade(nickname);
}

function removerAmigo(nickname){
    if(!usuarioAtual||!usuarioAtual.amigos)return;
    const idx=usuarioAtual.amigos.indexOf(nickname);
    if(idx===-1)return;
    usuarioAtual.amigos.splice(idx,1);
    notificar(`🗑️ ${nickname} removido dos amigos.`,"info");
    salvarDadosUsuario();
    if(abaRankAtual==="amigos")renderizarRanking();
    atualizarPerfilAmigos();
}

function abrirAdicionarAmigo(){
    somClique();
    
    // ✅ Modal próprio, independente do sistema genérico
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.id = "modal-amigo-custom";
    overlay.style.zIndex = "10001"; // ✅ z-index maior para ficar acima de tudo
    
    overlay.innerHTML = `
        <div class="modal-box" style="max-width:420px;">
            <span class="modal-icone">👥</span>
            <h2>Adicionar Amigo</h2>
            <p>Digite o nickname do jogador:</p>
            <div class="form-group" style="text-align:left;margin-top:15px;">
                <label>Nickname:</label>
                <input type="text" id="input-amigo-nick" placeholder="Digite aqui o nome" maxlength="20" style="width:100%;padding:12px;border:2px solid #3498db;border-radius:8px;font-family:Poppins;font-size:15px;">
            </div>
            <div class="modal-botoes" style="margin-top:20px;">
                <button class="warning" id="btn-confirmar-amigo">✅ Sim, confirmar</button>
                <button class="secondary" id="btn-cancelar-amigo">❌ Cancelar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // ✅ Foca no input
    setTimeout(() => {
        const input = document.getElementById("input-amigo-nick");
        if(input) input.focus();
    }, 100);
    
    // ✅ Botão CONFIRMAR
    document.getElementById("btn-confirmar-amigo").onclick = function(){
        const nick = document.getElementById("input-amigo-nick").value.trim();
        if(!nick){
            notificar("❌ Digite um nickname!","erro");
            return;
        }
        // ✅ Fecha o modal PRIMEIRO
        overlay.remove();
        // ✅ Depois executa a ação
        solicitarAmizade(nick);
    };
    
    // ✅ Botão CANCELAR
    document.getElementById("btn-cancelar-amigo").onclick = function(){
        overlay.remove();
        somClique();
    };
    
    // ✅ Fechar ao clicar fora do modal
    overlay.onclick = function(e){
        if(e.target === overlay){
            overlay.remove();
        }
    };
    
    // ✅ Fechar com Enter no input
    setTimeout(() => {
        const input = document.getElementById("input-amigo-nick");
        if(input){
            input.addEventListener("keypress", function(e){
                if(e.key === "Enter"){
                    document.getElementById("btn-confirmar-amigo").click();
                }
            });
        }
    }, 150);
}

function atualizarPerfilAmigos(){
    const el=document.getElementById("perfil-amigos");
    if(!el)return;
    const amigos=usuarioAtual.amigos||[];
    if(amigos.length===0){
        el.innerHTML='<span style="color:#888;font-size:12px;">Nenhum amigo ainda. Vá em 🏆 → 👥 para adicionar.</span>';
        return;
    }
    const db=carregarDB();
    el.innerHTML=amigos.map(n=>{
        const u=db.usuarios.find(x=>x.nickname===n);
        return `<span class="badge-amigo">${u?.avatar||"🦁"} ${n}</span>`;
    }).join(" ");
}


// ==================== PERFIL ====================
function mostrarPerfil(){
    somClique();
    const u=usuarioAtual;
    const nivel=getNivel(u.xp||0);
    const total=apostas.length;
    const vit=apostas.filter(a=>a.status==="ganhou").length;
    const der=apostas.filter(a=>a.status==="perdeu").length;
    const taxa=total>0?Math.round((vit/total)*100):0;
    document.getElementById("perfil-conteudo").innerHTML=`
        <div class="perfil-header">
            <div class="perfil-avatar" id="perfil-avatar-atual" style="cursor:pointer;" onclick="abrirTrocarAvatar()" title="Clique para trocar o avatar">
                ${u.avatar||"🦁"}
            </div>
            <div class="perfil-info">
                <h3>${u.nickname}</h3>
                <span class="perfil-nivel">${nivel.emoji} ${nivel.nome}</span>
                <br>
                <button class="warning small" onclick="abrirTrocarAvatar()" style="margin-top:8px;">🎭 Trocar Avatar</button>
            </div>
        </div>
        <div class="perfil-stats">
            <div class="perfil-stat"><span class="valor">🪙 ${u.moedas}</span><span class="label">Moedas</span></div>
            <div class="perfil-stat"><span class="valor">⭐ ${u.xp||0}</span><span class="label">XP</span></div>
            <div class="perfil-stat"><span class="valor">${total}</span><span class="label">Apostas</span></div>
            <div class="perfil-stat"><span class="valor">${vit}</span><span class="label">Vitórias</span></div>
            <div class="perfil-stat"><span class="valor">${der}</span><span class="label">Derrotas</span></div>
            <div class="perfil-stat"><span class="valor">${taxa}%</span><span class="label">Taxa</span></div>
            <div class="perfil-stat"><span class="valor">🔥 ${u.maiorCombo||0}</span><span class="label">Maior Combo</span></div>
            <div class="perfil-stat"><span class="valor">🏅 ${(u.conquistas||[]).length}</span><span class="label">Conquistas</span></div>
        </div>
        <div style="background:#f8f9fa;border-radius:12px;padding:12px;margin-bottom:15px;">
            <div style="font-weight:800;color:#2c3e50;font-size:13px;margin-bottom:8px;">👥 Amigos (${(u.amigos||[]).length})</div>
            <div id="perfil-amigos"></div>
        </div>
        <div style="margin-top:20px;text-align:center;">
            <button class="danger" onclick="deletarConta()" style="padding:10px 20px;font-size:12px;">🗑️ Deletar Minha Conta e Todos os Dados</button>
            <p style="font-size:10px;color:#95a5a6;margin-top:8px;">Esta ação é permanente e segue a LGPD.</p>
        </div>
    `;
    document.getElementById("modal-perfil").classList.remove("hidden");
    atualizarPerfilAmigos();
}
function fecharPerfil(){document.getElementById("modal-perfil").classList.add("hidden");}


// ==================== TROCAR AVATAR ====================
function abrirTrocarAvatar(){
    somClique();
    
    // ✅ Marca o avatar atual como selecionado
    const avataresGrid = document.getElementById("avatares-trocar-grid");
    avataresGrid.innerHTML = "";
    
    AVATARES.forEach(a => {
        const el = document.createElement("div");
        el.className = `avatar-option ${a === (usuarioAtual.avatar || "🦁") ? "selecionado" : ""}`;
        el.innerText = a;
        el.style.cursor = "pointer";
        el.onclick = () => confirmarTrocaAvatar(a);
        avataresGrid.appendChild(el);
    });
    
    document.getElementById("modal-trocar-avatar").classList.remove("hidden");
}

function fecharTrocarAvatar(){
    somClique();
    document.getElementById("modal-trocar-avatar").classList.add("hidden");
}

function confirmarTrocaAvatar(novoAvatar){
    if(!usuarioAtual) return;
    
    // ✅ Atualiza no objeto do usuário
    usuarioAtual.avatar = novoAvatar;
    
    // ✅ Salva no banco de dados
    salvarDadosUsuario();
    
    somConquista();
    notificar(`🎭 Avatar trocado para ${novoAvatar}!`, "sucesso", 2000);
    
    // ✅ Fecha o modal de troca
    fecharTrocarAvatar();
    
    // ✅ Atualiza o perfil visível
    mostrarPerfil();
    
    // ✅ Atualiza a saudação do top-bar
    const saud = document.getElementById("saudacao");
    if(saud) saud.innerText = `Olá, ${usuarioAtual.nickname}! ${novoAvatar}`;
}
function fecharPerfil(){document.getElementById("modal-perfil").classList.add("hidden");}

// ==================== LOGIN/REGISTRO ====================
function mostrarLogin(){
    somClique();
    ["tela-registro","tela-recuperar","tela-link-email","tela-nova-senha"].forEach(id=>document.getElementById(id).classList.add("hidden"));
    document.getElementById("tela-login").classList.remove("hidden");
}

function mostrarRegistro(){
    somClique();
    ["tela-login","tela-recuperar","tela-link-email","tela-nova-senha"].forEach(id=>document.getElementById(id).classList.add("hidden"));
    document.getElementById("tela-registro").classList.remove("hidden");
    renderizarAvatares();
}

function renderizarAvatares(){
    const grid=document.getElementById("avatares-grid");
    grid.innerHTML="";
    AVATARES.forEach(a=>{
        const el=document.createElement("div");
        el.className=`avatar-option ${a===avatarSelecionado?"selecionado":""}`;
        el.innerText=a;
        el.onclick=()=>{avatarSelecionado=a;renderizarAvatares();};
        grid.appendChild(el);
    });
}

function mostrarRecuperarSenha(){
    somClique();
    ["tela-login","tela-registro","tela-link-email","tela-nova-senha"].forEach(id=>document.getElementById(id).classList.add("hidden"));
    document.getElementById("tela-recuperar").classList.remove("hidden");
    usuarioRecuperacao=null;
}

function mostrarMensagem(id,texto,tipo="erro"){
    const el=document.getElementById(id);
    el.className=`mensagem-auth ${tipo}`;
    el.innerText=texto;
    el.classList.remove("hidden");
}

function validarEmailReal(email){
    const regex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!regex.test(email))return{valido:false,motivo:"Formato inválido."};
    const dominio=email.split("@")[1].toLowerCase();
    if(!DOMINIOS_EMAIL_VALIDOS.includes(dominio))return{valido:false,motivo:"Use um e-mail de domínio conhecido."};
    if(email.split("@")[0].length<3)return{valido:false,motivo:"A parte antes do @ precisa ter 3+ caracteres."};
    return{valido:true};
}

function fazerRegistro(){
    const nickname=document.getElementById("registro-nickname").value.trim();
    const email=document.getElementById("registro-email").value.trim().toLowerCase();
    const senha=document.getElementById("registro-senha").value.trim();

    if(!nickname||nickname.length<2)return mostrarMensagem("mensagem-registro","❌ Nickname muito curto.","erro");
    if(!/^[a-zA-Z0-9_]+$/.test(nickname))return mostrarMensagem("mensagem-registro","❌ Use letras, números e _","erro");
    const chk=validarEmailReal(email);
    if(!chk.valido)return mostrarMensagem("mensagem-registro","❌ "+chk.motivo,"erro");
    if(!/^\d{8}$/.test(senha))return mostrarMensagem("mensagem-registro","❌ Senha deve ter 8 números.","erro");

    const db=carregarDB();
    if(db.usuarios.find(u=>u.email===email))return mostrarMensagem("mensagem-registro","❌ E-mail já cadastrado.","erro");
    if(db.usuarios.find(u=>u.nickname.toLowerCase()===nickname.toLowerCase()))return mostrarMensagem("mensagem-registro","❌ Nickname já em uso.","erro");

    const novo={nickname,email,senha:hashSenha(senha),moedas:0,xp:0,apostas:[],sorteios:[],avatar:avatarSelecionado,criadoEm:new Date().toISOString(),conquistas:[],missoes:{},itens:{},numerosSorte:[],combo:0,maiorCombo:0,ultimoLogin:null,loginStreak:0,amigos:[],notificacoes:[],solicitacoesAmizade:[]};
    db.usuarios.push(novo);
    salvarDB(db);

    mostrarMensagem("mensagem-registro","✅ Conta criada! Faça login.","sucesso");
    setTimeout(()=>{mostrarLogin();document.getElementById("login-nickname").value=nickname;},1500);
}

function fazerLogin(){
    const nickname=document.getElementById("login-nickname").value.trim();
    const senha=document.getElementById("login-senha").value.trim();
    const manterConectado = document.getElementById("manter-conectado")?.checked || false;
    
    if(!nickname||!senha)return mostrarMensagem("mensagem-login","❌ Preencha tudo.","erro");

    const db=carregarDB();
    const user=db.usuarios.find(u=>u.nickname.toLowerCase()===nickname.toLowerCase());
    if(!user)return mostrarMensagem("mensagem-login","❌ Nickname não cadastrado.","erro");
    if(user.senha!==hashSenha(senha))return mostrarMensagem("mensagem-login","❌ Senha incorreta.","erro");

    // ✅ Salva no histórico de contas
    salvarContaNoHistorico(user.nickname, user.avatar, user.email);
    
    // ✅ Se marcou "Manter conectado", salva sessão
    if(manterConectado){
        try{
            localStorage.setItem("animalGame_sessao", JSON.stringify({
                nickname: user.nickname,
                email: user.email,
                timestamp: Date.now()
            }));
        } catch(e){}
    } else {
        // Se desmarcou, remove a sessão
        try{ localStorage.removeItem("animalGame_sessao"); } catch(e){}
    }
    
    usuarioAtual=user;
    carregarDadosUsuario();
    iniciarSessao();
}

function fazerLogout(){
    if(!confirm("Deseja sair?"))return;
    salvarDadosUsuario();
    
    // ✅ Remove a sessão de "manter conectado"
    try{ localStorage.removeItem("animalGame_sessao"); } catch(e){}
    
    usuarioAtual=null;apostas=[];sorteios=[];
    document.getElementById("tela-jogo").classList.add("hidden");
    document.getElementById("tela-login").classList.remove("hidden");
    
    // ✅ Reseta checkbox
    const chk = document.getElementById("manter-conectado");
    if(chk) chk.checked = false;
    
    // ✅ Renderiza contas salvas
    renderizarContasSalvas();
    
    pararMusica();
}


function iniciarSessao(){
    // ✅ initAudio ANTES de tudo
    initAudio();
    
    ["tela-login","tela-registro","tela-recuperar","tela-link-email","tela-nova-senha"].forEach(id=>document.getElementById(id).classList.add("hidden"));
    document.getElementById("tela-jogo").classList.remove("hidden");
    document.getElementById("saudacao").innerText=`Olá, ${usuarioAtual.nickname}! ${usuarioAtual.avatar||"🍀"}`;
    renderizarVitrine();
    renderizarNumerosSorte();
    atualizarInterface();
    atualizarXPBar();
    renderizarMissoesAtivas();
    somClique();
    
    // ✅ MÚSICA COMEÇA DO INÍCIO
    pararMusica();
    if(somLigado){
        setTimeout(() => iniciarMusica(), 100);  // pequeno delay para o audioCtx estar pronto
    }
    
        // ✅ Verifica premiações
    setTimeout(() => verificarPremiacoesRanking(), 1000);

        // ✅ Notificação de boas-vindas diária
    verificarBoasVindasDiarias();
    verificarBonusLogin();
    verificarSorteios();
    if(verificadorInterval)clearInterval(verificadorInterval);
    verificadorInterval=setInterval(verificarSorteios,30000);
    setInterval(atualizarInterface,60000);

        atualizarBadgeNotificacoes();
}

// ==================== BÔNUS LOGIN DIÁRIO ====================
function verificarBonusLogin(){
    const hoje=getDataHoje();
    if(new Date().getDay()===0)return;
    const db=carregarDB();
    const userNoDB=db.usuarios.find(u=>u.nickname===usuarioAtual.nickname);
    const ultimoLogin=userNoDB?.ultimoLogin||usuarioAtual.ultimoLogin;
    if(ultimoLogin===hoje)return;
    const ontem=new Date();ontem.setDate(ontem.getDate()-1);
    const ontemStr=ontem.toISOString().split("T")[0];
    const streakAtual=userNoDB?.loginStreak||usuarioAtual.loginStreak||0;
    let streak=(ultimoLogin===ontemStr)?streakAtual+1:1;
    if(streak>6)streak=1;
    const bonusPorDia={1:2,2:3,3:4,4:6,5:8,6:10};
    const bonus=bonusPorDia[streak]||2;
    usuarioAtual.ultimoLogin=hoje;
    usuarioAtual.loginStreak=streak;
    usuarioAtual.moedas+=bonus;
    const idx=db.usuarios.findIndex(u=>u.nickname===usuarioAtual.nickname);
    if(idx!==-1){
        db.usuarios[idx].ultimoLogin=hoje;
        db.usuarios[idx].loginStreak=streak;
        db.usuarios[idx].moedas=usuarioAtual.moedas;
        salvarDB(db);
    }
    setTimeout(()=>{
        notificar(`🎁 Bônus de login! Dia ${streak}/6 - +${bonus} 🪙`,"conquista",5000);
        somMoeda();
        atualizarMoedas();
    },800);
}

// ==================== RECUPERAR SENHA ====================
function enviarLinkRecuperacao(){
    const email=document.getElementById("recuperar-email").value.trim().toLowerCase();
    if(!email)return mostrarMensagem("mensagem-recuperar","❌ Digite seu e-mail.","erro");
    const chk=validarEmailReal(email);
    if(!chk.valido)return mostrarMensagem("mensagem-recuperar","❌ "+chk.motivo,"erro");
    const db=carregarDB();
    const user=db.usuarios.find(u=>u.email===email);
    mostrarMensagem("mensagem-recuperar","📬 Se este e-mail estiver cadastrado, você receberá um link.","sucesso");
    usuarioRecuperacao=user||null;
    document.getElementById("email-destinatario").innerText=`Para: ${email}`;
    setTimeout(()=>{
        document.getElementById("tela-recuperar").classList.add("hidden");
        document.getElementById("tela-link-email").classList.remove("hidden");
    },1500);
}

function abrirNovaSenha(){
    somClique();
    if(!usuarioRecuperacao){
        document.getElementById("mensagem-link").className="mensagem-auth erro";
        document.getElementById("mensagem-link").innerText="❌ Link inválido ou expirado.";
        document.getElementById("mensagem-link").classList.remove("hidden");
        return;
    }
    document.getElementById("tela-link-email").classList.add("hidden");
    document.getElementById("tela-nova-senha").classList.remove("hidden");
    document.getElementById("texto-nova-senha").innerText=`Olá, ${usuarioRecuperacao.nickname}! Crie sua nova senha:`;
}

function salvarNovaSenha(){
    const n=document.getElementById("nova-senha").value.trim();
    const c=document.getElementById("confirmar-nova-senha").value.trim();
    if(!/^\d{8}$/.test(n))return mostrarMensagem("mensagem-nova-senha","❌ Senha: 8 números.","erro");
    if(n!==c)return mostrarMensagem("mensagem-nova-senha","❌ Senhas não coincidem.","erro");
    if(!usuarioRecuperacao)return;
    const db=carregarDB();
    const idx=db.usuarios.findIndex(u=>u.nickname===usuarioRecuperacao.nickname);
    if(idx===-1)return;
    db.usuarios[idx].senha=hashSenha(n);
    salvarDB(db);
    mostrarMensagem("mensagem-nova-senha","✅ Senha alterada! Redirecionando...","sucesso");
    const nick=db.usuarios[idx].nickname;
    usuarioRecuperacao=null;
    setTimeout(()=>{mostrarLogin();document.getElementById("login-nickname").value=nick;},1500);
}

// ==================== TURNO ====================
function getDiaSemana(){return new Date().getDay();}
function isDiaPermitido(){const d=getDiaSemana();return d>=1&&d<=6;}

function getTurnoAtual(){
    if(!isDiaPermitido())return null;
    const h=new Date().getHours();
    const m=new Date().getMinutes();
    const tm=h*60+m;
    const dia=getDiaSemana();
    if(tm>=480&&tm<720)return"manha";
    if(tm>=780&&tm<1020)return"tarde";
    if(dia>=1&&dia<=5&&tm>=1080&&tm<1200)return"noite";
    return null;
}

function jaPassouDoResultado(turno){
    const h=new Date().getHours();
    const m=new Date().getMinutes();
    const tm=h*60+m;
    const t=TURNOS[turno];
    return tm>=(t.resultado*60+t.resultadoMin);
}

function isTurnoJaSorteado(turno,data){return sorteios.some(s=>s.data===data&&s.turno===turno);}

// ==================== APOSTAS ====================
function contarApostasDoTurno(turno,data){return apostas.filter(a=>a.turno===turno&&a.data===data).length;}

function podeApostar(){
    const turno=getTurnoAtual();
    if(!turno)return{pode:false,motivo:"Fora do horário."};
    const dataHoje=getDataHoje();
    const limite=LIMITE_APOSTAS+(usuarioAtual.itens?.aposta_extra||0);
    const qtd=contarApostasDoTurno(turno,dataHoje);
    if(qtd>=limite)return{pode:false,motivo:`Limite de ${limite} apostas atingido.`};
    return{pode:true};
}

function verificarApostaDuplicada(bichoNum, milhar){
    const turno = getTurnoAtual();
    if(!turno) return { duplicada: false };
    
    const dataHoje = getDataHoje();
    const bichoNumInt = parseInt(bichoNum);
    const milharStr = milhar === null ? null : String(milhar);
    
    // ✅ Só verifica apostas PENDENTES do MESMO turno e MESMO dia
    const duplicada = apostas.find(a => {
        if(a.status !== "pendente") return false;   // ⚠️ Ignora apostas já resolvidas
        if(a.turno !== turno) return false;
        if(a.data !== dataHoje) return false;
        if(parseInt(a.bichoNum) !== bichoNumInt) return false;
        const aMilhar = a.milhar === null ? null : String(a.milhar);
        if(aMilhar !== milharStr) return false;
        return true;
    });
    
    // 🔍 DEBUG
    console.log("🔍 Verificando duplicada:", {bichoNumInt, milharStr, turno, dataHoje, totalApostas: apostas.length, duplicada: !!duplicada});
    
    if(duplicada){
        return {
            duplicada: true,
            motivo: milhar 
    ? `Já apostou no animal ${bichoNumInt.toString().padStart(2,"0")} com a milhar ${milhar} neste turno.`
    : `Já apostou só no animal ${bichoNumInt.toString().padStart(2,"0")} neste turno.`
        };
    }
    return { duplicada: false };
}

function atualizarContador(){
    const turno=getTurnoAtual();
    const box=document.getElementById("contador-box");
    const cnt=document.getElementById("contador-apostas");
    if(!turno){box.classList.add("hidden");return;}
    const limite=LIMITE_APOSTAS+(usuarioAtual.itens?.aposta_extra||0);
    const qtd=contarApostasDoTurno(turno,getDataHoje());
    box.classList.remove("hidden");
    cnt.innerText=`${qtd} / ${limite}`;
    box.classList.toggle("cheio",qtd>=limite);
    document.querySelectorAll("#vitrine .bicho-card").forEach(c=>{
        c.style.pointerEvents=qtd>=limite?"none":"auto";
        c.style.opacity=qtd>=limite?"0.4":"1";
    });
}

// ==================== SORTEIO ====================
function verificarSorteios(){
    const dataHoje=getDataHoje();
    Object.keys(TURNOS).forEach(turno=>{
        if(turno==="noite"&&(getDiaSemana()===0||getDiaSemana()===6))return;
        if(jaPassouDoResultado(turno)&&!isTurnoJaSorteado(turno,dataHoje)){
            const pend=apostas.filter(a=>a.status==="pendente"&&a.data===dataHoje&&a.turno===turno);
            if(pend.length>0)executarSorteioAnimado(turno,dataHoje);
            else{
                sorteios.push({turno,data:dataHoje,dataHora:new Date().toISOString(),semApostas:true});
                salvarDadosUsuario();
            }
        }
    });
    atualizarInterface();
}

function executarSorteioAnimado(turno,data){
    const bichoSorteado=Math.floor(Math.random()*25)+1;
    const milharSorteada=Math.floor(Math.random()*10000).toString().padStart(4,"0");
    const turnoInfo=TURNOS[turno];
    document.getElementById("sorteio-turno-info").innerText=`${turnoInfo.emoji} Turno ${turnoInfo.nome}`;
    const modal=document.getElementById("modal-sorteio");
    modal.classList.remove("hidden");
    const slotB=document.getElementById("slot-bicho");
    const slotM=document.getElementById("slot-milhar");
    const slotNome=document.getElementById("slot-bicho-nome");
    slotB.classList.add("girando");
    slotM.classList.add("girando");
    slotNome.innerText="";
    slotB.innerText="??";
    slotM.innerText="????";
    const duracao=3000;
    const inicio=Date.now();
    const anim=setInterval(()=>{
        slotB.innerText=(Math.floor(Math.random()*25)+1).toString().padStart(2,"0");
        slotM.innerText=Math.floor(Math.random()*10000).toString().padStart(4,"0");
        somClique();
        if(Date.now()-inicio>=duracao){
            clearInterval(anim);
            slotB.classList.remove("girando");
            slotM.classList.remove("girando");
            slotB.innerText=bichoSorteado.toString().padStart(2,"0");
            slotM.innerText=milharSorteada;
            slotNome.innerText=`${animais[bichoSorteado].emoji} ${animais[bichoSorteado].nome}`;
            setTimeout(()=>{modal.classList.add("hidden");processarResultado(bichoSorteado,milharSorteada,turno,data);},1200);
        }
    },80);
}

function processarResultado(bichoSorteado,milharSorteada,turno,data){
    const turnoInfo=TURNOS[turno];
    const bichoObj=animais[bichoSorteado];
    const nivel=getNivel(usuarioAtual.xp||0);
    sorteios.push({turno,data,dataHora:new Date().toISOString(),bicho:bichoSorteado,bichoEmoji:bichoObj.emoji,bichoNome:bichoObj.nome,milhar:milharSorteada});
    const apostasDoTurno=apostas.filter(a=>a.status==="pendente"&&a.data===data&&a.turno===turno);
    let ganhosTotais=0,vitorias=0,derrotas=0,xpGanho=0;
    apostasDoTurno.forEach(aposta=>{
        const acertouBicho=aposta.bichoNum===bichoSorteado;
        const acertouMilhar=aposta.milhar!==null&&aposta.milhar===milharSorteada;
        let ganhou=false,recompensa=0,tipoVitoria="";
        if(aposta.milhar===null){
            if(acertouBicho){ganhou=true;recompensa=turnoInfo.premios.bicho;tipoVitoria="bicho";}
        }else{
            if(acertouBicho&&acertouMilhar){ganhou=true;recompensa=turnoInfo.premios.bichoMilhar;tipoVitoria="bicho-milhar";}
            else if(acertouMilhar){ganhou=true;recompensa=turnoInfo.premios.milhar;tipoVitoria="milhar";}
        }
        if(ganhou){
            const bonusCombo=usuarioAtual.combo>=3?2:1;
            recompensa=Math.round(recompensa*nivel.multiplicador*bonusCombo);
            ganhosTotais+=recompensa;
            vitorias++;
            usuarioAtual.combo=(usuarioAtual.combo||0)+1;
            xpGanho+=20;
                }else{
            derrotas++;
            usuarioAtual.combo=0;
            xpGanho+=5;
            
            // ✅ Escudo ativo: devolve 50% das moedas
            if(usuarioAtual.escudoAtivo){
                const devolucao = Math.round(aposta.recompensa || 10);
                usuarioAtual.moedas += devolucao;
                usuarioAtual.escudoAtivo = false;
                notificar(`🛡️ Escudo usado! +${devolucao} moedas devolvidas.`, "info", 4000);
                criarNotificacao("info", 
                    `🛡️ <b>Escudo usado!</b> Você recuperou ${devolucao} moedas da aposta perdida.`,
                    {}
                );
            }
        }
        if(usuarioAtual.combo>(usuarioAtual.maiorCombo||0))usuarioAtual.maiorCombo=usuarioAtual.combo;
        aposta.status=ganhou?"ganhou":"perdeu";
        aposta.recompensa=recompensa;
        aposta.tipoVitoria=tipoVitoria;
        aposta.bichoSorteado=bichoSorteado;
        aposta.bichoSorteadoEmoji=bichoObj.emoji;
        aposta.bichoSorteadoNome=bichoObj.nome;
        aposta.milharSorteada=milharSorteada;
    });
    usuarioAtual.moedas+=ganhosTotais;
    adicionarXP(xpGanho);
    verificarMissoesEstado();
    renderizarMissoesAtivas();
    salvarDadosUsuario();
    verificarConquistas();
    atualizarMoedas();
    atualizarXPBar();
    const box=document.getElementById("modal-resultado-box");
    box.style.borderTopColor=ganhosTotais>0?"#2ecc71":"#e74c3c";
    const icone=document.getElementById("resultado-icone");
    const titulo=document.getElementById("resultado-titulo");
    if(ganhosTotais>0){
        icone.innerText="🎉";
        titulo.innerText="Parabéns!";
        somVitoria();
        somMoeda();
        if(typeof confetti==="function")confetti({particleCount:150,spread:90,origin:{y:0.6}});
        chuvaEmojis();
        if(navigator.vibrate)navigator.vibrate([100,50,100]);
    }else{
        icone.innerText="😢";
        titulo.innerText="Que pena...";
        somDerrota();
        if(navigator.vibrate)navigator.vibrate(200);
    }

        // ✅ Cria notificação de resultado
    if(ganhosTotais > 0){
        criarNotificacao("vitoria", 
            `🎉 Você <b>GANHOU</b> ${ganhosTotais} moedas no turno ${turnoInfo.nome}!`,
            { ganhos: ganhosTotais, turno: turnoInfo.nome }
        );
    } else {
        criarNotificacao("derrota", 
            `😢 Você perdeu todas as apostas do turno ${turnoInfo.nome}.`,
            { turno: turnoInfo.nome }
        );
    }
    document.getElementById("resultado-detalhes").innerHTML=`
        <p><strong>🎰 Sorteio:</strong> ${bichoObj.emoji} ${bichoObj.nome} (Grupo ${bichoSorteado.toString().padStart(2,"0")}) + ${milharSorteada}</p>
        <p><strong>${turnoInfo.emoji} Turno:</strong> ${turnoInfo.nome}</p>
        <hr style="margin:10px 0;border:none;border-top:1px dashed #ddd;">
        <p><strong>✅ Vitórias:</strong> ${vitorias}</p>
        <p><strong>❌ Derrotas:</strong> ${derrotas}</p>
        <p><strong>⭐ XP Ganho:</strong> +${xpGanho}</p>
    `;
    const recEl=document.getElementById("resultado-recompensa");
    if(ganhosTotais>0){
        recEl.classList.remove("hidden");
        recEl.innerHTML=`<span>🪙</span> +${ganhosTotais} moedas! <span>💰</span>`;
    }else{
        recEl.classList.add("hidden");
    }
    document.getElementById("modal-resultado").classList.remove("hidden");
}

function fecharResultado(){
    document.getElementById("modal-resultado").classList.add("hidden");
    atualizarInterface();
}

function chuvaEmojis(){
    const emojis=["🎉","✨","🌟","💫","🎊","🪙","⭐","🏆"];
    for(let i=0;i<30;i++){
        const el=document.createElement("div");
        el.className="emoji-chuva";
        el.innerText=emojis[Math.floor(Math.random()*emojis.length)];
        el.style.left=Math.random()*100+"%";
        el.style.animationDuration=(2+Math.random()*2)+"s";
        el.style.animationDelay=(Math.random()*0.5)+"s";
        el.style.fontSize=(24+Math.random()*20)+"px";
        document.body.appendChild(el);
        setTimeout(()=>el.remove(),5000);
    }
}

// ==================== INTERFACE ====================
function atualizarInterface(){
    const turno=getTurnoAtual();
    const dataHoje=getDataHoje();
    const dia=getDiaSemana();
    renderizarPainelTurnos(turno,dataHoje);
    
    const aviso=document.getElementById("aviso-fechado");
    const jogo=document.getElementById("jogo-ativo");
    
    // ✅ SEMPRE mostra a vitrine, mas bloqueia se não tem turno
    if(turno===null){
        // Mostra o aviso de fora do horário (mas NÃO esconde o jogo)
        aviso.classList.remove("hidden");
        
        // ✅ MAS mantém a vitrine visível (embaixo do aviso)
        jogo.classList.remove("hidden");
        
        if(dia===0){
            document.getElementById("aviso-icone").innerText="🚫";
            document.getElementById("aviso-titulo").innerText="Domingo - Fechado";
            document.getElementById("aviso-texto").innerText="Volte na segunda-feira!";
        }else{
            document.getElementById("aviso-icone").innerText="🌙";
            document.getElementById("aviso-titulo").innerText="Fora do Horário";
            document.getElementById("aviso-texto").innerText="Aguarde o próximo turno para apostar.";
        }
        
        // ✅ Adiciona classes de bloqueio na vitrine
        bloquearVitrine(true);
    }else{
        // Dentro do horário: esconde o aviso e libera a vitrine
        aviso.classList.add("hidden");
        jogo.classList.remove("hidden");
        bloquearVitrine(false);
        atualizarContador();
    }
    
    atualizarMoedas();
    if(!document.getElementById("painel-apostas").classList.contains("hidden"))renderizarPainelApostas();
}

// ✅ Nova função para bloquear/liberar a vitrine
function bloquearVitrine(bloquear){
    const vitrine = document.getElementById("vitrine");
    const etapaEscolha = document.getElementById("etapa-escolha");
    if(!vitrine || !etapaEscolha) return;
    
    if(bloquear){
        // Adiciona overlay e trava cliques
        vitrine.classList.add("vitrine-bloqueada");
        
        // Adiciona aviso acima da vitrine (se ainda não existe)
        let aviso = document.getElementById("aviso-fora-vitrine");
        if(!aviso){
            aviso = document.createElement("div");
            aviso.id = "aviso-fora-vitrine";
            aviso.className = "aviso-fora-horario";
            const turno = getTurnoAtual(); // Sempre null aqui
            const dia = getDiaSemana();
            
            let texto = "";
            if(dia === 0){
                texto = "O jogo não funciona aos domingos. Volte na segunda-feira! 🌅";
            } else if(dia === 6){
                texto = "Sábado tem apenas <b>Manhã</b> (08-12h) e <b>Tarde</b> (13-17h). Aguarde!";
            } else {
                texto = "Próximo turno em breve. Veja os horários no topo da tela! ⏰";
            }
            
            aviso.innerHTML = `
                <span class="titulo">🔒 Você pode ver os animais, mas não pode apostar agora</span>
                <span class="dica">${texto}</span>
            `;
            etapaEscolha.insertBefore(aviso, etapaEscolha.firstChild);
        }
    } else {
        // Remove bloqueios
        vitrine.classList.remove("vitrine-bloqueada");
        const aviso = document.getElementById("aviso-fora-vitrine");
        if(aviso) aviso.remove();
    }
}

function atualizarMoedas(){
    if(!usuarioAtual)return;
    const el=document.getElementById("moedas-total");
    if(el)el.innerText=usuarioAtual.moedas;
}

function renderizarPainelTurnos(turnoAtual,dataHoje){
    const c=document.getElementById("painel-turnos");
    c.innerHTML="";
    const agora=new Date();
    const tm=agora.getHours()*60+agora.getMinutes();
    const dia=getDiaSemana();
    Object.keys(TURNOS).forEach(key=>{
        const t=TURNOS[key];
        const ativo=key===turnoAtual;
        const jaSort=isTurnoJaSorteado(key,dataHoje);
        const inicioMin=t.inicio*60+t.inicioMin;
        const resultMin=t.resultado*60+t.resultadoMin;
        const dispHoje=!(key==="noite"&&(dia===0||dia===6));
        const esp=key==="noite";
        let st="";
        if(!dispHoje)st="🚫 HOJE NÃO";
        else if(ativo&&!jaSort)st="✅ ABERTO";
        else if(jaSort)st="🎰 SORTEADO";
        else if(tm<inicioMin)st=`⏰ ${t.inicio}h`;
        else if(tm>=resultMin)st=`🎰 ${t.horaResultado}`;
        else st="🔒 FECHADO";
        const card=document.createElement("div");
        let cls="turno-card ";
        cls+=ativo&&!jaSort?"ativo ":"fechado ";
        if(esp)cls+="especial";
        card.className=cls;
        card.innerHTML=`
            ${ativo&&!jaSort?'<div class="pulse-dot"></div>':""}
            <div class="turno-nome">${t.emoji} ${t.nome}</div>
            <div class="turno-horario">${t.inicio}h - ${t.horaResultado}</div>
            <div class="turno-premios">🪙 ${t.premios.bicho}/${t.premios.milhar}/${t.premios.bichoMilhar}</div>
            <div class="turno-status">${st}</div>
        `;
        c.appendChild(card);
    });
}

// ==================== VITRINE ====================
function renderizarVitrine(){
    const v=document.getElementById("vitrine");
    v.innerHTML="";
    for(const num in animais){
        const b=animais[num];
        const card=document.createElement("div");
        card.className="bicho-card";
        card.onclick=()=>selecionarBicho(parseInt(num));
        card.innerHTML=`
            <span class="numero-badge">${num.padStart(2,"0")}</span>
            <span class="emoji">${b.emoji}</span>
            <span class="nome-bicho">${b.nome}</span>
        `;
        v.appendChild(card);
    }
}

function selecionarBicho(numero){
    const chk=podeApostar();
    if(!chk.pode){
        const turno = getTurnoAtual();
        let msgExtra = "";
        if(!turno){
            msgExtra = " Aguarde o próximo turno!";
        } else {
            msgExtra = " " + chk.motivo;
        }
        notificar("🔒 Não é possível apostar agora." + msgExtra, "erro", 4000);
        return;
    }
    somClique();
    bichoSelecionado=numero;
    milharSelecionada=null;
    modoAposta="bicho";
    const b=animais[numero];
    document.getElementById("bicho-selecionado").innerHTML=`
        <span class="emoji">${b.emoji}</span>
        <span class="nome-bicho">${b.nome} (Grupo ${numero.toString().padStart(2,"0")})</span>
    `;
    atualizarPremiosBotoes();
    document.getElementById("opcao-bicho").classList.add("ativo");
    document.getElementById("opcao-bicho-milhar").classList.remove("ativo");
    document.getElementById("area-milhar").classList.add("hidden");
    document.getElementById("area-sem-milhar").classList.remove("hidden");
    document.getElementById("input-milhar-manual").value="";
    document.getElementById("etapa-escolha").classList.add("hidden");
    document.getElementById("etapa-milhar").classList.remove("hidden");
}

function atualizarPremiosBotoes(){
    const turno=getTurnoAtual();
    if(!turno)return;
    const p=TURNOS[turno].premios;
    document.getElementById("premio-bicho-txt").innerText=`Ganha +${p.bicho} 🪙`;
    document.getElementById("premio-milhar-txt").innerText=`+${p.milhar} a +${p.bichoMilhar} 🪙`;
}

function escolherModo(modo){
    somClique();
    modoAposta=modo;
    const bB=document.getElementById("opcao-bicho");
    const bBM=document.getElementById("opcao-bicho-milhar");
    const aM=document.getElementById("area-milhar");
    const aSM=document.getElementById("area-sem-milhar");
    if(modo==="bicho"){
        bB.classList.add("ativo");bBM.classList.remove("ativo");
        aM.classList.add("hidden");aSM.classList.remove("hidden");
    }else{
        bB.classList.remove("ativo");bBM.classList.add("ativo");
        aM.classList.remove("hidden");aSM.classList.add("hidden");
        setTimeout(()=>document.getElementById("input-milhar-manual").focus(),100);
    }
}

function confirmarMilharManual(){
    const i=document.getElementById("input-milhar-manual").value.trim();
    const erro=document.getElementById("erro-milhar");
    if(i===""){erro.innerText="❌ Digite uma milhar.";erro.classList.remove("hidden");return;}
    if(!/^\d{1,4}$/.test(i)){erro.innerText="❌ Use até 4 dígitos.";erro.classList.remove("hidden");return;}
    const mf=i.padStart(4,"0");
    erro.classList.add("hidden");
    somClique();
    milharSelecionada=mf;
    mostrarConfirmacao();
}

function apostarSoBicho(){somClique();milharSelecionada=null;mostrarConfirmacao();}

function mostrarConfirmacao(){
    const b=animais[bichoSelecionado];
    const temMilhar=milharSelecionada!==null;
    const turno=getTurnoAtual();
    const ti=TURNOS[turno];
    let info=temMilhar
        ?`<p>Milhar: <strong style="font-size:22px;color:#e67e22;letter-spacing:3px;">${milharSelecionada}</strong></p>
          <p style="font-size:13px;color:#27ae60;font-weight:600;">💰 Prêmios: Milhar +${ti.premios.milhar} | B+M +${ti.premios.bichoMilhar}</p>`
        :`<p style="color:#9b59b6;font-weight:bold;">🎯 Aposta apenas no Animal</p>
          <p style="font-size:13px;color:#27ae60;font-weight:600;">💰 Prêmio: ${ti.premios.bicho} moedas</p>`;
    document.getElementById("card-aposta").innerHTML=`
        <p>Você apostou em:</p>
        <p style="font-size:50px;margin:5px 0;">${b.emoji}</p>
        <p><strong>${b.nome}</strong> (Grupo ${bichoSelecionado.toString().padStart(2,"0")})</p>
        ${info}
        <p style="font-size:12px;color:#3498db;margin-top:15px;font-weight:700;">
            ${ti.emoji} Sorteio do turno ${ti.nome} às ${ti.horaResultado}
        </p>
    `;
    document.getElementById("etapa-milhar").classList.add("hidden");
    document.getElementById("etapa-confirmacao").classList.remove("hidden");
}

function voltarEscolhaBicho(){
    somClique();
    document.getElementById("etapa-milhar").classList.add("hidden");
    document.getElementById("etapa-escolha").classList.remove("hidden");
    bichoSelecionado=null;milharSelecionada=null;
}

function confirmarAposta(){
    const chk=podeApostar();
    if(!chk.pode){notificar("⚠️ "+chk.motivo,"erro");fazerOutraAposta();return;}
    const dup=verificarApostaDuplicada(bichoSelecionado,milharSelecionada);
    if(dup.duplicada){notificar("🚫 Aposta repetida! "+dup.motivo,"erro",4000);fazerOutraAposta();return;}

    const turno=getTurnoAtual();
    const dataHoje=getDataHoje();
    const b=animais[bichoSelecionado];

    apostas.push({
        id:Date.now()+Math.random(),
        bichoNum:bichoSelecionado,
        bichoNome:b.nome,
        bichoEmoji:b.emoji,
        milhar:milharSelecionada,
        turno,data:dataHoje,
        dataHora:new Date().toISOString(),
        status:"pendente",
        recompensa:0,
        bichoSorteado:null,
        milharSorteada:null
    });

   // adicionarXP(10);

       // ✅ Trevo da Sorte: XP dobrado
    const xpAposta = usuarioAtual.trevoAtivo ? 20 : 10;
    adicionarXP(xpAposta);
    if(usuarioAtual.trevoAtivo){
        usuarioAtual.trevoAtivo = false;
        notificar("🍀 Trevo consumido! XP dobrado aplicado (+20).", "info", 3000);
    }

    incrementarMissao("total_apostas",1);
    incrementarMissao(`aposta_bicho_${bichoSelecionado}`,1);
    if(milharSelecionada){
        incrementarMissao("aposta_com_milhar",1);
    } else {
        incrementarMissao("aposta_sem_milhar",1);
    }
    incrementarMissao("aposta_manha",turno==="manha"?1:0);
    incrementarMissao("aposta_tarde",turno==="tarde"?1:0);
    incrementarMissao("aposta_noite",turno==="noite"?1:0);
    incrementarMissao("aposta_par",bichoSelecionado%2===0?1:0);
    incrementarMissao("aposta_impar",bichoSelecionado%2===1?1:0);
    verificarMissoesEstado();

    salvarDadosUsuario();
    somClique();

    const ti=TURNOS[turno];
    document.getElementById("horario-sorteio-aposta").innerText=`${ti.emoji} ${ti.nome} - ${ti.horaResultado}`;
    document.getElementById("etapa-confirmacao").classList.add("hidden");
    document.getElementById("etapa-aposta-registrada").classList.remove("hidden");
    atualizarContador();
    verificarConquistas();
}

function fazerOutraAposta(){
    somClique();
    bichoSelecionado=null;milharSelecionada=null;modoAposta="bicho";
    document.getElementById("etapa-milhar").classList.add("hidden");
    document.getElementById("etapa-confirmacao").classList.add("hidden");
    document.getElementById("etapa-aposta-registrada").classList.add("hidden");
    document.getElementById("etapa-escolha").classList.remove("hidden");
    atualizarContador();
}

// ==================== MODAL ====================
function abrirModal(titulo,texto,icone,detalhes,cb){
    document.getElementById("modal-titulo").innerText=titulo;
    document.getElementById("modal-texto").innerText=texto;
    document.getElementById("modal-icone").innerText=icone||"⚠️";
    const d=document.getElementById("modal-detalhes");
    if(detalhes){d.innerHTML=detalhes;d.classList.remove("hidden");}else{d.classList.add("hidden");}
    modalCallback=cb;
    
    // ✅ Traduz os botões (se a função t() estiver disponível)
    if(typeof t === "function"){
        const btnConfirmar = document.querySelector("#modal-confirmacao .danger");
        const btnCancelar = document.querySelector("#modal-confirmacao .secondary");
        if(btnConfirmar) btnConfirmar.innerText = t("modal_confirmar");
        if(btnCancelar) btnCancelar.innerText = t("modal_cancelar");
    }
    
    document.getElementById("modal-confirmacao").classList.remove("hidden");
}
// ==================== DESFAZER ====================
function desfazerAposta(id){
    const a = apostas.find(x => String(x.id) === String(id));
    
    // ✅ Validações com mensagens claras
    if(!a){
        notificar("❌ Aposta não encontrada.", "erro", 3000);
        return;
    }
    if(a.status !== "pendente"){
        notificar("⚠️ Esta aposta já foi sorteada. Não é possível desfazer.", "erro", 4000);
        return;
    }
    if(jaPassouDoResultado(a.turno)){
        notificar("⚠️ O sorteio desta aposta já aconteceu. Não é possível desfazer.", "erro", 4000);
        return;
    }
    
    const ti = TURNOS[a.turno];
    abrirModal(
        "Desfazer Aposta?",
        "Tem certeza que deseja cancelar esta aposta?",
        '🤔',
        `<p><strong>🐾 Animal:</strong> ${a.bichoEmoji} ${a.bichoNome}</p>
         <p><strong>🔢 Milhar:</strong> ${a.milhar || "Só animal"}</p>
         <p><strong>${ti.emoji} Turno:</strong> ${ti.nome}</p>
         <p style="color:#e74c3c;font-weight:700;margin-top:10px;">⚠️ Esta ação não pode ser desfeita!</p>`,
        () => executarDesfazer(id)
    );
}

function executarDesfazer(id){
    const idx = apostas.findIndex(a => String(a.id) === String(id));
    if(idx === -1){
        notificar("❌ Aposta não encontrada.", "erro", 3000);
        return;
    }
    const rem = apostas[idx];
    
    // ✅ Remove do array
    apostas.splice(idx, 1);
    
    // ✅ Salva no banco
    salvarDadosUsuario();
    
    somClique();
    
    // ✅ Atualiza a interface
    atualizarContador();
    renderizarPainelApostas();
    
    notificar(`✅ Aposta desfeita! (${rem.bichoEmoji} ${rem.bichoNome})`, "sucesso", 3000);
}

// ==================== PAINEL DE APOSTAS ====================
function mostrarPainelApostas(){
    somClique();
    document.getElementById("painel-apostas").classList.remove("hidden");
    document.getElementById("conteudo-principal").classList.add("hidden");
    renderizarPainelApostas();
}
function fecharPainelApostas(){
    somClique();
    document.getElementById("painel-apostas").classList.add("hidden");
    document.getElementById("conteudo-principal").classList.remove("hidden");
}

function mudarAba(aba){
    somClique();
    ["apostas","sorteios","estatisticas"].forEach(k=>{
        document.getElementById("aba-"+k).classList.toggle("ativa",k===aba);
        document.getElementById("conteudo-"+k).classList.toggle("hidden",k!==aba);
    });
    if(aba==="sorteios")renderizarSorteios();
    if(aba==="estatisticas")renderizarGraficos();
}

function renderizarPainelApostas(){
    const est=document.getElementById("estatisticas");
    const lista=document.getElementById("lista-apostas");
    const total=apostas.length;
    const v=apostas.filter(a=>a.status==="ganhou").length;
    const d=apostas.filter(a=>a.status==="perdeu").length;
    est.innerHTML=`
        <div class="stat-card"><span class="valor">${total}</span><span class="label">Total</span></div>
        <div class="stat-card vitoria"><span class="valor">${v}</span><span class="label">Vitórias</span></div>
        <div class="stat-card derrota"><span class="valor">${d}</span><span class="label">Derrotas</span></div>
        <div class="stat-card moedas-stat"><span class="valor">🪙 ${usuarioAtual.moedas}</span><span class="label">Moedas</span></div>
    `;
    if(total===0){
        lista.innerHTML=`<div class="sem-apostas"><span class="icone">🎲</span>Sem apostas ainda.</div>`;
        return;
    }
    lista.innerHTML="";
    const turnoAtual=getTurnoAtual();
    [...apostas].reverse().forEach(a=>{
        const item=document.createElement("div");
        item.className=`aposta-item ${a.status}`;
        let badge="";
        if(a.status==="ganhou")badge='<span class="badge badge-ganhou">GANHOU</span>';
        else if(a.status==="perdeu")badge='<span class="badge badge-perdeu">perdeu</span>';
        else badge='<span class="badge badge-pendente">⏳</span>';
        const badgeM=a.status==="ganhou"&&a.recompensa?`<span class="badge badge-moedas">+${a.recompensa} 🪙</span>`:"";
        const ti=TURNOS[a.turno]||{nome:"?",emoji:"❓"};
        const badgeT=`<span class="badge badge-turno">${ti.emoji} ${ti.nome}</span>`;
        let det="";
        if(a.status==="pendente"){
            det=`<strong>${a.bichoNome}</strong> (G.${a.bichoNum.toString().padStart(2,"0")})<br>
                ${a.milhar?`Milhar: <strong>${a.milhar}</strong>`:"Só bicho"} ${badge} ${badgeT}`;
        }else{
            let tipo="";
            if(a.tipoVitoria==="milhar")tipo=" (só milhar!)";
            else if(a.tipoVitoria==="bicho-milhar")tipo=" (bicho+milhar!)";
            else if(a.tipoVitoria==="bicho")tipo=" (bicho!)";
            const mT=a.milhar
                ?`Milhar: <strong>${a.milhar}</strong> | Sorteado: <strong>${a.bichoSorteado.toString().padStart(2,"0")} + ${a.milharSorteada}</strong>`
                :`Sorteado: <strong>${a.bichoSorteado.toString().padStart(2,"0")}</strong>`;
            det=`<strong>${a.bichoNome}</strong> (G.${a.bichoNum.toString().padStart(2,"0")})<br>${mT}${tipo} ${badge} ${badgeM} ${badgeT}`;
        }
               // ✅ Pode desfazer se:
        // 1. Ainda está pendente
        // 2. O sorteio ainda não aconteceu
        // 3. É do mesmo dia
        const podeDesf = a.status === "pendente" 
                       && !jaPassouDoResultado(a.turno)
                       && a.data === getDataHoje();
        const btn = podeDesf ? `<button class="danger small" onclick="desfazerAposta(${a.id})">❌ Desfazer</button>` : "";
        item.innerHTML=`
            <div class="aposta-info">
                <span class="emoji-grande">${a.bichoEmoji}</span>
                <div class="detalhes">${det}</div>
            </div>
            <div class="aposta-acoes">${btn}</div>
        `;
        lista.appendChild(item);
    });
}

function renderizarSorteios(){
    const lista=document.getElementById("lista-sorteios");
    if(sorteios.length===0){
        lista.innerHTML=`<div class="sem-apostas"><span class="icone">🎰</span>Nenhum sorteio ainda.</div>`;
        return;
    }
    lista.innerHTML="";
    [...sorteios].reverse().forEach(s=>{
        const item=document.createElement("div");
        item.className="sorteio-registro";
        const ti=TURNOS[s.turno]||{nome:"?",emoji:"❓"};
        const df=new Date(s.dataHora).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"});
        if(s.semApostas){
            item.innerHTML=`
                <div class="sorteio-header">
                    <span class="sorteio-turno ${s.turno}">${ti.emoji} ${ti.nome}</span>
                    <span class="sorteio-data">${df}</span>
                </div>
                <div class="sorteio-resultado"><span style="color:#999;font-style:italic;">Sem apostas</span></div>
            `;
        }else{
            item.innerHTML=`
                <div class="sorteio-header">
                    <span class="sorteio-turno ${s.turno}">${ti.emoji} ${ti.nome}</span>
                    <span class="sorteio-data">${df}</span>
                </div>
                <div class="sorteio-resultado">
                    <span class="emoji-bicho">${s.bichoEmoji}</span>
                    <div>
                        <strong>${s.bichoNome}</strong> - G.${s.bicho.toString().padStart(2,"0")}<br>
                        Milhar: <strong>${s.milhar}</strong>
                    </div>
                </div>
            `;
        }
        lista.appendChild(item);
    });
}

// ==================== GRÁFICOS ====================
function renderizarGraficos(){
    if(!window.Chart) return;
    
    setTimeout(() => {
        // ========== GRÁFICO 1: EVOLUÇÃO DE MOEDAS ==========
const canvasEv = document.getElementById("grafico-evolucao");
if(graficos.ev) graficos.ev.destroy();

const apostasOrdenadas = [...apostas].sort((a, b) => 
    new Date(a.dataHora) - new Date(b.dataHora)
);

const apostasComResultado = apostasOrdenadas.filter(a => 
    a.status === "ganhou" || a.status === "perdeu"
);

let saldoAcumulado = 0;
const labels = ["Início"];
const data = [0];

apostasComResultado.forEach((a, i) => {
    if(a.status === "ganhou" && a.recompensa){
        saldoAcumulado += parseInt(a.recompensa) || 0;
    }
    labels.push(`#${i + 1}`);
    data.push(saldoAcumulado);
});

// Se não tem apostas, mostra aviso
if(apostasComResultado.length === 0){
    labels.length = 0;
    data.length = 0;
    labels.push("Sem apostas ainda", "Faça sua 1ª aposta!");
    data.push(0, 0);
}

graficos.ev = new Chart(canvasEv, {
    type: "line",
    data: {
        labels: labels,
        datasets: [{
            label: "Moedas ganhas",
            data: data,
            borderColor: "#f1c40f",
            backgroundColor: "rgba(241,196,15,0.2)",
            borderWidth: 3,
            pointBackgroundColor: "#e67e22",
            pointBorderColor: "#fff",
            pointRadius: 6,
            pointHoverRadius: 8,
            tension: 0.3,
            fill: true
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `🪙 ${context.parsed.y} moedas acumuladas`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: Math.max(1, Math.ceil(saldoAcumulado / 5)) || 1,
                    color: "#888"
                },
                grid: { color: "rgba(0,0,0,0.05)" }
            },
            x: {
                ticks: { color: "#888" },
                grid: { display: false }
            }
        }
    }
});
        // ========== GRÁFICO 2: PIZZA (Vitórias x Derrotas) ==========
        const canvasPi = document.getElementById("grafico-pizza");
        if(graficos.pi) graficos.pi.destroy();
        
        const v = apostas.filter(a => a.status === "ganhou").length;
        const d = apostas.filter(a => a.status === "perdeu").length;
        const p = apostas.filter(a => a.status === "pendente").length;
        
        graficos.pi = new Chart(canvasPi, {
            type: "doughnut",
            data: {
                labels: ["Vitórias", "Derrotas", "Pendentes"],
                datasets: [{
                    data: [v, d, p],
                    backgroundColor: ["#2ecc71", "#e74c3c", "#f1c40f"],
                    borderWidth: 3,
                    borderColor: "#fff"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: "bottom" }
                }
            }
        });
        
        
    }, 100);
}

// ==================== RANKING ====================
let abaRankAtual="geral";

function mostrarRanking(){
    somClique();
    document.getElementById("painel-apostas").classList.add("hidden");
    document.getElementById("conteudo-principal").classList.add("hidden");
    document.getElementById("tela-ranking").classList.remove("hidden");
    renderizarRanking();
}
function mostrarRankingLogin(){
    somClique();
    ["tela-login","tela-registro","tela-sobre","tela-recuperar","tela-link-email","tela-nova-senha"].forEach(id=>document.getElementById(id).classList.add("hidden"));
    document.getElementById("tela-ranking").classList.remove("hidden");
    document.getElementById("tela-ranking").classList.add("painel-apostas");
    renderizarRanking();
}
function fecharRanking(){
    somClique();
    document.getElementById("tela-ranking").classList.add("hidden");
    if(usuarioAtual)document.getElementById("conteudo-principal").classList.remove("hidden");
    else document.getElementById("tela-login").classList.remove("hidden");
}

function mudarAbaRank(aba){
    somClique();
    abaRankAtual=aba;
    ["geral","semanal","amigos"].forEach(k=>document.getElementById("aba-rank-"+k).classList.toggle("ativa",k===aba));
    renderizarRanking();
}

function renderizarRanking(){
    const lista = document.getElementById("lista-ranking");
    const db = carregarDB();
    let users = [...db.usuarios];

    if(abaRankAtual === "amigos"){
        const amigos = usuarioAtual?.amigos || [];
        users = users.filter(u => amigos.includes(u.nickname));
        if(users.length === 0){
            lista.innerHTML = `
                <div class="ranking-vazio">
                    <span class="icone">👥</span>
                    Você ainda não tem amigos adicionados.<br><br>
                    <button class="warning" onclick="abrirAdicionarAmigo()">➕ Adicionar Amigo</button>
                </div>`;
            return;
        }
    } else if(abaRankAtual === "semanal"){
        const seteDias = new Date(); seteDias.setDate(seteDias.getDate() - 7);
        users = users.map(u => ({...u, _apostasRecentes: (u.apostas || []).filter(a => new Date(a.dataHora) > seteDias).length}));
        users.sort((a,b) => b._apostasRecentes - a._apostasRecentes);
    } else {
        users.sort((a,b) => (b.moedas || 0) - (a.moedas || 0));
    }

    if(users.length === 0){
        lista.innerHTML = `<div class="ranking-vazio"><span class="icone">🏆</span>Nenhum jogador ainda.</div>`;
        return;
    }

    lista.innerHTML = "";

    if(abaRankAtual === "amigos"){
        const btnWrap = document.createElement("div");
        btnWrap.style.cssText = "margin-bottom:12px;text-align:center;";
        btnWrap.innerHTML = `<button class="warning" onclick="abrirAdicionarAmigo()">➕ Adicionar Amigo</button>`;
        lista.appendChild(btnWrap);
    }

    users.forEach((u,i) => {
        const pos = i + 1;
        const item = document.createElement("div");
        item.className = "ranking-item";
        if(pos <= 3 && abaRankAtual === "geral") item.classList.add(`pos-${pos}`);
        const ehEu = usuarioAtual && u.nickname === usuarioAtual.nickname;
        if(ehEu) item.classList.add("eu");
        let med = pos === 1 ? "🥇" : pos === 2 ? "🥈" : pos === 3 ? "🥉" : "";
        const badge = ehEu ? '<span class="voce-badge">VOCÊ</span>' : "";
        const nivel = getNivel(u.xp || 0);
        let valorMostrar;
        if(abaRankAtual === "semanal") valorMostrar = `📊 ${u._apostasRecentes || 0}`;
        else valorMostrar = `🪙 ${u.moedas || 0}`;

        // ✅ BOTÃO DE AÇÃO CORRETO
        let botaoAmigo = "";
        if(!ehEu && usuarioAtual){
            const jaAmigo = (usuarioAtual.amigos || []).includes(u.nickname);
            
            if(jaAmigo){
                // Se já é amigo E está na aba de amigos → botão de remover
                if(abaRankAtual === "amigos"){
                    botaoAmigo = `<button class="danger small" onclick="removerAmigo('${u.nickname}')" title="Remover amigo">🗑️</button>`;
                }
                // Se já é amigo e NÃO está na aba de amigos → mostra ✅ (só indicador)
                else {
                    botaoAmigo = `<span class="badge-amigo-status" title="Você já é amigo">✅ Amigo</span>`;
                }
            } else {
                // ✅ Verifica se já enviou solicitação
                const solicitacaoPendente = (u.solicitacoesAmizade || []).some(s => s.de === usuarioAtual.nickname);
                
                if(solicitacaoPendente){
                    botaoAmigo = `<span class="badge-pendente-amigo" title="Solicitação enviada">⏳ Enviado</span>`;
                } else {
                    botaoAmigo = `<button class="warning small" onclick="adicionarAmigo('${u.nickname}')" title="Adicionar amigo">➕</button>`;
                }
            }
        }
        
        // Na aba "amigos" com você mesmo, não mostra nada
        if(ehEu && abaRankAtual === "amigos"){
            botaoAmigo = "";
        }

        item.innerHTML = `
            <div class="ranking-pos">${med || pos}</div>
            <div class="ranking-info">
                <div class="ranking-nick">${u.avatar || "🦁"} ${u.nickname} ${badge}</div>
                ${(() => {
    const ehEu = usuarioAtual && u.nickname === usuarioAtual.nickname;
    const ehAmigo = (usuarioAtual?.amigos || []).includes(u.nickname);
    // ✅ Só mostra número de apostas se for você mesmo OU seu amigo
    const apostasVisiveis = (ehEu || ehAmigo) ? `${(u.apostas || []).length} apostas` : '🔒 privado';
    return `<div class="ranking-detalhes">${nivel.emoji} ${nivel.nome} • ${apostasVisiveis}</div>`;
})()}
            </div>
            <div class="ranking-moedas">${valorMostrar}</div>
            ${botaoAmigo}
        `;
        lista.appendChild(item);
    });
}

// ==================== NÚMEROS DA SORTE ====================
function renderizarNumerosSorte(){
    const grid=document.getElementById("numeros-sorte-grid");
    if(!grid)return;
    grid.innerHTML="";
    const nums=usuarioAtual.numerosSorte||[];
    if(nums.length===0){
        grid.innerHTML='<span style="color:#888;font-size:12px;font-style:italic;">Sem números cadastrados</span>';
        return;
    }
    nums.forEach(n=>{
        const btn=document.createElement("button");
        btn.className="numero-sorte-btn";
        btn.innerText=n;
        btn.title="Apostar rápido neste número";
        btn.onclick=()=>notificar(`💡 Use este número ${n} na sua aposta!`,"info");
        grid.appendChild(btn);
    });
}

function abrirConfigNumerosSorte(){
    somClique();
    const atuais=usuarioAtual.numerosSorte||[];
    abrirModal("⭐ Números da Sorte","Digite até 3 milhares separadas por vírgula.\nExemplo: 1234, 5678, 9012",'⭐',
        `<div class="form-group" style="text-align:left;">
            <label>Milhares (separadas por vírgula):</label>
            <input type="text" id="input-numeros-sorte" value="${atuais.join(", ")}" placeholder="1234, 5678" maxlength="40" style="width:100%;padding:10px;border:2px solid #f1c40f;border-radius:8px;font-family:Poppins;">
        </div>`,()=>{
        const val=document.getElementById("input-numeros-sorte").value;
        const arr=val.split(",").map(s=>s.trim()).filter(s=>/^\d{1,4}$/.test(s)).slice(0,3).map(s=>s.padStart(4,"0"));
        usuarioAtual.numerosSorte=arr;
        salvarDadosUsuario();
        renderizarNumerosSorte();
        notificar("⭐ Números salvos!","sucesso");
    });
}

// ==================== SOBRE ====================
function mostrarSobre(){
    somClique();
    ["tela-login","tela-registro","tela-jogo","tela-ranking","tela-recuperar","tela-link-email","tela-nova-senha"].forEach(id=>document.getElementById(id).classList.add("hidden"));
    document.getElementById("tela-sobre").classList.remove("hidden");
}
function fecharSobre(){
    somClique();
    document.getElementById("tela-sobre").classList.add("hidden");
    if(usuarioAtual)document.getElementById("tela-jogo").classList.remove("hidden");
    else document.getElementById("tela-login").classList.remove("hidden");
}

// ==================== RELÓGIO ====================
function atualizarRelogio(){
    const a=new Date();
    const h=String(a.getHours()).padStart(2,"0");
    const m=String(a.getMinutes()).padStart(2,"0");
    const s=String(a.getSeconds()).padStart(2,"0");
    const el=document.getElementById("relogio-hora");
    if(el)el.innerText=`${h}:${m}:${s}`;
}
atualizarRelogio();
setInterval(atualizarRelogio,1000);


// ==================== CONTAS SALVAS ====================
function salvarContaNoHistorico(nickname, avatar, email){
    try{
        let contas = JSON.parse(localStorage.getItem("animalGame_contas_salvas") || "[]");
        // Remove se já existe
        contas = contas.filter(c => c.nickname.toLowerCase() !== nickname.toLowerCase());
        // Adiciona no início
        contas.unshift({ nickname, avatar, email, ultimoAcesso: new Date().toISOString() });
        // Limita a 5 contas
        contas = contas.slice(0, 5);
        localStorage.setItem("animalGame_contas_salvas", JSON.stringify(contas));
    } catch(e){ console.warn("Erro ao salvar conta:", e); }
}

function carregarContasSalvas(){
    try{
        return JSON.parse(localStorage.getItem("animalGame_contas_salvas") || "[]");
    } catch(e){ return []; }
}

function renderizarContasSalvas(){
    const box = document.getElementById("contas-salvas-box");
    const lista = document.getElementById("lista-contas-salvas");
    if(!box || !lista) return;
    
    const contas = carregarContasSalvas();
    if(contas.length === 0){
        box.classList.add("hidden");
        return;
    }
    
    box.classList.remove("hidden");
    lista.innerHTML = "";
    
    contas.forEach(conta => {
        const item = document.createElement("div");
        item.className = "conta-salva-item";
        item.title = `Último acesso: ${new Date(conta.ultimoAcesso).toLocaleDateString("pt-BR")}`;
        item.innerHTML = `
            <span class="avatar-mini">${conta.avatar || "🦁"}</span>
            <span class="nick">${conta.nickname}</span>
            <button class="btn-remover-conta" onclick="event.stopPropagation(); removerContaSalva('${conta.nickname}')" title="Remover">✖</button>
        `;
        item.onclick = () => {
            document.getElementById("login-nickname").value = conta.nickname;
            document.getElementById("login-senha").focus();
        };
        lista.appendChild(item);
    });
}

function removerContaSalva(nickname){
    try{
        let contas = JSON.parse(localStorage.getItem("animalGame_contas_salvas") || "[]");
        contas = contas.filter(c => c.nickname.toLowerCase() !== nickname.toLowerCase());
        localStorage.setItem("animalGame_contas_salvas", JSON.stringify(contas));
        renderizarContasSalvas();
        somClique();
    } catch(e){}
}

// ==================== AUTO-LOGIN (Manter Conectado) ====================
function tentarAutoLogin(){
    try{
        const sessao = JSON.parse(localStorage.getItem("animalGame_sessao") || "null");
        if(!sessao) return false;
        
        // Sessão expira em 30 dias
        const DIAS_30 = 30 * 24 * 60 * 60 * 1000;
        if(Date.now() - sessao.timestamp > DIAS_30){
            localStorage.removeItem("animalGame_sessao");
            return false;
        }
        
        const db = carregarDB();
        const user = db.usuarios.find(u => u.nickname === sessao.nickname);
        if(!user) return false;
        
        // Faz login automático
        usuarioAtual = user;
        carregarDadosUsuario();
        iniciarSessao();
        notificar(`👋 Bem-vindo de volta, ${user.nickname}!`, "sucesso", 3000);
        return true;
    } catch(e){
        console.warn("Erro no auto-login:", e);
        return false;
    }
}

// ==================== SISTEMA DE NOTIFICAÇÕES ====================
function criarNotificacao(tipo, texto, dados = {}){
    if(!usuarioAtual) return;
    if(!usuarioAtual.notificacoes) usuarioAtual.notificacoes = [];
    
    const notif = {
        id: Date.now() + Math.random(),
        tipo: tipo,            // "amizade", "vitoria", "derrota", "info"
        texto: texto,
        dados: dados,
        lida: false,
        dataHora: new Date().toISOString()
    };
    
    usuarioAtual.notificacoes.unshift(notif);
    
    // Limita a 30 notificações
    if(usuarioAtual.notificacoes.length > 30){
        usuarioAtual.notificacoes = usuarioAtual.notificacoes.slice(0, 30);
    }
    
    salvarDadosUsuario();
    atualizarBadgeNotificacoes();
    
    // Notificação toast também
    const tipos = {
        "amizade": "info",
        "vitoria": "sucesso",
        "derrota": "erro",
        "info": "info"
    };
    notificar(texto, tipos[tipo] || "info", 4000);
    
    // Som específico
    if(tipo === "vitoria") somMoeda();
    else if(tipo === "derrota") somDerrota();
    else if(tipo === "amizade") somConquista();
}

function atualizarBadgeNotificacoes(){
    const badge = document.getElementById("badge-notificacoes");
    if(!badge) return;
    
    const naoLidas = (usuarioAtual?.notificacoes || []).filter(n => !n.lida).length;
    
    if(naoLidas > 0){
        badge.innerText = naoLidas > 99 ? "99+" : naoLidas;
        badge.classList.remove("hidden");
    } else {
        badge.classList.add("hidden");
    }
}

function togglePainelNotificacoes(){
    const painel = document.getElementById("painel-notificacoes");
    if(!painel) return;
    if(painel.classList.contains("hidden")){
        renderizarNotificacoes();
        painel.classList.remove("hidden");
        somClique();
    } else {
        painel.classList.add("hidden");
    }
}

function renderizarNotificacoes(){
    const lista = document.getElementById("lista-notificacoes");
    if(!lista) return;
    
    const notifs = usuarioAtual?.notificacoes || [];
    
    if(notifs.length === 0){
        lista.innerHTML = `
            <div class="notif-vazio">
                <span class="icone">🔔</span>
                Nenhuma notificação ainda.
            </div>
        `;
        return;
    }
    
    lista.innerHTML = "";
    
    notifs.forEach(notif => {
        const item = document.createElement("div");
        item.className = `notif-item ${notif.tipo} ${notif.lida ? "" : "nao-lida"}`;
        
        let emoji = "🔔";
        if(notif.tipo === "amizade") emoji = "👥";
        else if(notif.tipo === "vitoria") emoji = "🎉";
        else if(notif.tipo === "derrota") emoji = "😢";
        
        const data = new Date(notif.dataHora);
        const agora = new Date();
        const diffMin = Math.floor((agora - data) / 60000);
        let tempoStr;
        if(diffMin < 1) tempoStr = "Agora";
        else if(diffMin < 60) tempoStr = `${diffMin}min atrás`;
        else if(diffMin < 1440) tempoStr = `${Math.floor(diffMin/60)}h atrás`;
        else tempoStr = data.toLocaleDateString("pt-BR");
        
        // Ações específicas para solicitações de amizade
        let acoesHTML = "";
        if(notif.tipo === "amizade" && notif.dados && notif.dados.status === "pendente"){
            acoesHTML = `
                <div class="notif-acoes">
                    <button class="small success" onclick="event.stopPropagation(); aceitarAmizade('${notif.dados.de}', ${notif.id})">✅</button>
                    <button class="small danger" onclick="event.stopPropagation(); rejeitarAmizade('${notif.dados.de}', ${notif.id})">❌</button>
                </div>
            `;
        }
        
        item.innerHTML = `
            <span class="notif-emoji">${emoji}</span>
            <div class="notif-conteudo">
                <div class="notif-texto">${notif.texto}</div>
                <div class="notif-data">${tempoStr}</div>
            </div>
            ${acoesHTML}
        `;
        
                item.onclick = () => {
            if(!notif.lida){
                notif.lida = true;
                salvarDadosUsuario();
                atualizarBadgeNotificacoes();
                renderizarNotificacoes();
            }
            
            // ✅ Se for notificação de boas-vindas, abre a aba de sorteios
            if(notif.dados && notif.dados.acao === "abrirSorteios"){
                togglePainelNotificacoes(); // fecha painel
                mostrarPainelApostas();
                setTimeout(() => mudarAba("sorteios"), 100);
            }
        };
        
        lista.appendChild(item);
    });
}

function marcarTodasComoLidas(){
    if(!usuarioAtual) return;
    (usuarioAtual.notificacoes || []).forEach(n => n.lida = true);
    salvarDadosUsuario();
    atualizarBadgeNotificacoes();
    renderizarNotificacoes();
    somClique();
}

function limparNotificacoes(){
    if(!usuarioAtual) return;
    if(!confirm("Limpar todas as notificações?")) return;
    usuarioAtual.notificacoes = [];
    salvarDadosUsuario();
    atualizarBadgeNotificacoes();
    renderizarNotificacoes();
    somClique();
}

// ==================== SOLICITAÇÕES DE AMIZADE ====================
function solicitarAmizade(nickname){
    if(!usuarioAtual) return;
    if(nickname.toLowerCase() === usuarioAtual.nickname.toLowerCase()){
        notificar("❌ Você não pode se adicionar!","erro");
        return;
    }
    
    const db = carregarDB();
    const alvo = db.usuarios.find(u => u.nickname.toLowerCase() === nickname.toLowerCase());
    if(!alvo){
        notificar(`❌ Jogador "${nickname}" não encontrado.`,"erro");
        return;
    }
    
    if((usuarioAtual.amigos || []).includes(alvo.nickname)){
        notificar("⚠️ Já é seu amigo!","erro");
        return;
    }
    
    if(!alvo.solicitacoesAmizade) alvo.solicitacoesAmizade = [];
    if(alvo.solicitacoesAmizade.some(s => s.de === usuarioAtual.nickname)){
        notificar("⚠️ Solicitação já enviada!","info");
        return;
    }
    
    alvo.solicitacoesAmizade.push({
        de: usuarioAtual.nickname,
        avatar: usuarioAtual.avatar || "🦁",
        data: new Date().toISOString()
    });
    
    if(!alvo.notificacoes) alvo.notificacoes = [];
    alvo.notificacoes.unshift({
        id: Date.now() + Math.random(),
        tipo: "amizade",
        texto: `<b>${usuarioAtual.nickname}</b> quer ser seu amigo!`,
        dados: { de: usuarioAtual.nickname, status: "pendente" },
        lida: false,
        dataHora: new Date().toISOString()
    });
    
    const idx = db.usuarios.findIndex(u => u.nickname === alvo.nickname);
    if(idx !== -1){
        db.usuarios[idx] = alvo;
        salvarDB(db);
    }

        // ✅ Atualiza o ranking se estiver aberto
    if(typeof renderizarRanking === "function" && 
       !document.getElementById("tela-ranking").classList.contains("hidden")){
        renderizarRanking();
    }
    
    somConquista();
    notificar(`✅ Solicitação enviada para ${alvo.nickname}!`, "sucesso");
}

function aceitarAmizade(nickname, notifId){
    if(!usuarioAtual) return;
    
    // Adiciona nos amigos do usuário
    if(!usuarioAtual.amigos) usuarioAtual.amigos = [];
    if(!usuarioAtual.amigos.includes(nickname)){
        usuarioAtual.amigos.push(nickname);
    }
    
    // Adiciona o usuário na lista de amigos do outro
    const db = carregarDB();
    const outro = db.usuarios.find(u => u.nickname === nickname);
    if(outro){
        if(!outro.amigos) outro.amigos = [];
        if(!outro.amigos.includes(usuarioAtual.nickname)){
            outro.amigos.push(usuarioAtual.nickname);
        }
        
        // Remove a solicitação do outro
        if(outro.solicitacoesAmizade){
            outro.solicitacoesAmizade = outro.solicitacoesAmizade.filter(s => s.de !== usuarioAtual.nickname);
        }
        
        // Notifica o outro que foi aceito
        if(!outro.notificacoes) outro.notificacoes = [];
        outro.notificacoes.unshift({
            id: Date.now() + Math.random(),
            tipo: "info",
            texto: `<b>${usuarioAtual.nickname}</b> aceitou sua solicitação de amizade! ✅`,
            dados: {},
            lida: false,
            dataHora: new Date().toISOString()
        });
        
        const idx = db.usuarios.findIndex(u => u.nickname === outro.nickname);
        if(idx !== -1){
            db.usuarios[idx] = outro;
            salvarDB(db);
        }
    }
    
    // Marca a notificação como lida e remove
    usuarioAtual.notificacoes = (usuarioAtual.notificacoes || []).filter(n => n.id !== notifId);
    
    somConquista();
    notificar(`✅ ${nickname} adicionado como amigo!`, "sucesso");
    salvarDadosUsuario();
    atualizarBadgeNotificacoes();
    renderizarNotificacoes();
    if(abaRankAtual === "amigos") renderizarRanking();
}

function rejeitarAmizade(nickname, notifId){
    if(!usuarioAtual) return;
    
    // Remove a solicitação no DB
    const db = carregarDB();
    const outro = db.usuarios.find(u => u.nickname === nickname);
    if(outro && outro.solicitacoesAmizade){
        outro.solicitacoesAmizade = outro.solicitacoesAmizade.filter(s => s.de !== usuarioAtual.nickname);
        const idx = db.usuarios.findIndex(u => u.nickname === outro.nickname);
        if(idx !== -1){
            db.usuarios[idx] = outro;
            salvarDB(db);
        }
    }
    
    // Remove a notificação
    usuarioAtual.notificacoes = (usuarioAtual.notificacoes || []).filter(n => n.id !== notifId);
    
    notificar(`❌ Solicitação de ${nickname} rejeitada.`, "info");
    salvarDadosUsuario();
    atualizarBadgeNotificacoes();
    renderizarNotificacoes();
}

// ==================== AVISO LEGAL E LGPD ====================
function aceitarAvisoLegal(){
    // ✅ NÃO salva mais no localStorage — só esconde o modal no momento
    const modal = document.getElementById("modal-aviso-legal");
    if(modal) modal.style.display = "none";
    
    // ✅ Libera a rolagem da página
    document.body.style.overflow = "";
    
    // ✅ Inicia áudio (precisa ser gesto do usuário)
    initAudio();
    iniciarMusica();
    somClique();
}

function checarAvisoLegal(){
    // ✅ SEMPRE retorna false — força o aviso a aparecer sempre
    return false;
}

function abrirLGPD(){
    somClique();
    const telas = ["tela-login","tela-registro","tela-jogo","tela-sobre","tela-ranking","tela-recuperar","tela-link-email","tela-nova-senha","tela-termos"];
    telas.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.classList.add("hidden");
    });
    document.getElementById("tela-lgpd").classList.remove("hidden");
    if(usuarioAtual) salvarDadosUsuario();
}

function abrirTermos(){
    somClique();
    const telas = ["tela-login","tela-registro","tela-jogo","tela-sobre","tela-ranking","tela-recuperar","tela-link-email","tela-nova-senha","tela-lgpd"];
    telas.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.classList.add("hidden");
    });
    document.getElementById("tela-termos").classList.remove("hidden");
    if(usuarioAtual) salvarDadosUsuario();
}

function voltarParaInicio(){
    somClique();
    document.getElementById("tela-lgpd").classList.add("hidden");
    document.getElementById("tela-termos").classList.add("hidden");
    
    // ✅ Se estiver logado, volta pro perfil; senão, pra tela de login
    if(usuarioAtual){
        mostrarPerfil();
    } else {
        mostrarLogin();
    }
}

// ==================== DELETAR CONTA ====================
function deletarConta(){
    if(!usuarioAtual) return;
    if(!confirm("⚠️ Tem certeza? Todos os seus dados (conta, apostas, conquistas, amigos) serão APAGADOS PERMANENTEMENTE.")) return;
    if(!confirm("Esta ação NÃO PODE SER DESFEITA. Deseja realmente deletar sua conta?")) return;
    
    const db = carregarDB();
    const idx = db.usuarios.findIndex(u => u.nickname === usuarioAtual.nickname);
    if(idx !== -1){
        db.usuarios.splice(idx, 1);
        salvarDB(db);
    }
    
    // Remove das contas salvas
    try{
        let contas = JSON.parse(localStorage.getItem("animalGame_contas_salvas") || "[]");
        contas = contas.filter(c => c.nickname !== usuarioAtual.nickname);
        localStorage.setItem("animalGame_contas_salvas", JSON.stringify(contas));
    }catch(e){}
    
    // Remove a sessão
    try{ localStorage.removeItem("animalGame_sessao"); }catch(e){}
    
    // Fecha o modal de perfil
    fecharPerfil();
    
    // Reset do estado
    usuarioAtual = null;
    apostas = [];
    sorteios = [];
    
    notificar("🗑️ Conta deletada com sucesso.","info", 4000);
    setTimeout(() => {
        document.getElementById("tela-jogo").classList.add("hidden");
        document.getElementById("tela-login").classList.remove("hidden");
        renderizarContasSalvas();
        pararMusica();
    }, 1000);
}

// ==================== BANNER LGPD ====================
function checarBannerLGPD(){
    try{
        if(localStorage.getItem("animalGame_lgpd_aceito") === "true") return false;
        return true;
    }catch(e){ return true; }
}

function aceitarLGPD(){
    try{ localStorage.setItem("animalGame_lgpd_aceito", "true"); }catch(e){}
    const banner = document.getElementById("banner-lgpd");
    if(banner) banner.remove();
}

function criarBannerLGPD(){
    if(!checarBannerLGPD()) return;
    const banner = document.createElement("div");
    banner.id = "banner-lgpd";
    banner.className = "banner-lgpd";
    banner.innerHTML = `
        <div class="texto-lgpd">
            🍪 <strong>Este site usa armazenamento local (localStorage)</strong> para salvar seus dados de jogo (nickname, e-mail, histórico). 
            Não usamos cookies de terceiros. Ao continuar, você concorda com nossa 
            <a href="#" onclick="event.preventDefault(); abrirLGPD();" style="color:#f1c40f;font-weight:700;">Política de Privacidade</a>.
        </div>
        <div class="botoes-lgpd">
            <button class="gold" onclick="aceitarLGPD()">✅ Aceitar</button>
            <button class="secondary" onclick="abrirLGPD()">Ver mais</button>
        </div>
    `;
    document.body.appendChild(banner);
}

// ==================== PREFERÊNCIAS DO SISTEMA ====================
function detectarPreferenciasSistema(){
    // Tema escuro/claro automático se o usuário nunca escolheu
    const temaSalvo = localStorage.getItem("animalGame_tema");
    if(!temaSalvo){
        const prefereEscuro = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        const tema = prefereEscuro ? "tema-escuro" : "tema-claro";
        document.body.className = tema;
        temaAtual = tema;
    }
    
    // Detectar idioma do navegador se o usuário nunca escolheu
    const idiomaSalvo = localStorage.getItem("animalGame_idioma");
    if(!idiomaSalvo){
        const langNav = (navigator.language || "pt-BR").toLowerCase();
        let idioma = "pt";
        if(langNav.startsWith("en")) idioma = "en";
        else if(langNav.startsWith("es")) idioma = "es";
        if(typeof idiomaAtual !== "undefined"){
            idiomaAtual = idioma;
            localStorage.setItem("animalGame_idioma", idioma);
        }
    }
    
    // Detectar preferência de som
    const prefereSilencioso = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(prefereSilencioso) somLigado = false;
    
    console.log("🎨 Preferências detectadas:", {
        tema: temaAtual,
        idioma: typeof idiomaAtual !== "undefined" ? idiomaAtual : "pt",
        somLigado: somLigado
    });
}


// ==================== INIT FINAL (Aviso SEMPRE aparece, LGPD, Preferências) ====================
document.addEventListener("DOMContentLoaded", function(){
    // ✅ Detecta preferências IMEDIATAMENTE
    detectarPreferenciasSistema();
    carregarTema();

    // ✅ SEMPRE mostra o aviso legal (não usa localStorage)
    setTimeout(() => {
        const modal = document.getElementById("modal-aviso-legal");
        if(modal){
            modal.style.display = "flex";
            modal.classList.remove("hidden");
        }
        document.body.style.overflow = "hidden";
    }, 300);

    // ✅ Banner LGPD aparece DEPOIS
    setTimeout(() => criarBannerLGPD(), 3000);
});


// ==================== PREMIAÇÃO DE RANKING ====================
function verificarPremiacoesRanking(){
    if(!usuarioAtual) return;
    
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth() + 1;
    const diaSemana = hoje.getDay(); // 1=seg, 5=sex, 0=dom
    
    // ✅ RANKING SEMANAL — paga toda SEGUNDA-FEIRA (premia a semana anterior)
    const chaveSemanal = `${ano}-S${getNumeroSemana(hoje)}`;
    if(!usuarioAtual.ultimaPremiacaoSemanal || usuarioAtual.ultimaPremiacaoSemanal !== chaveSemanal){
        // Só paga se for segunda-feira (dia 1)
        if(diaSemana === 1){
            premiarRankingSemanal(chaveSemanal);
        }
    }
    
    // ✅ RANKING MENSAL — paga dia 1º de cada mês
    const chaveMensal = `${ano}-${mes}`;
    if(!usuarioAtual.ultimaPremiacaoMensal || usuarioAtual.ultimaPremiacaoMensal !== chaveMensal){
        if(hoje.getDate() === 1){
            premiarRankingMensal(chaveMensal);
        }
    }
}

function getNumeroSemana(data){
    const d = new Date(Date.UTC(data.getFullYear(), data.getMonth(), data.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function premiarRankingSemanal(chave){
    const db = carregarDB();
    // Top 3 por moedas na semana (simplificado: por apostas dos últimos 7 dias)
    const seteDias = new Date();
    seteDias.setDate(seteDias.getDate() - 7);
    const ordenados = [...db.usuarios].sort((a, b) => {
        const apA = (a.apostas || []).filter(x => new Date(x.dataHora) > seteDias).length;
        const apB = (b.apostas || []).filter(x => new Date(x.dataHora) > seteDias).length;
        return apB - apA;
    });
    
    const premios = [
        { moedas: 10, xp: 10, nome: "🥇 1º lugar semanal" },
        { moedas: 5, xp: 0, nome: "🥈 2º lugar semanal" },
        { moedas: 3, xp: 0, nome: "🥉 3º lugar semanal" }
    ];
    
    ordenados.slice(0, 3).forEach((user, i) => {
        const idx = db.usuarios.findIndex(u => u.nickname === user.nickname);
        if(idx !== -1){
            db.usuarios[idx].moedas = (db.usuarios[idx].moedas || 0) + premios[i].moedas;
            db.usuarios[idx].xp = (db.usuarios[idx].xp || 0) + premios[i].xp;
            db.usuarios[idx].ultimaPremiacaoSemanal = chave;
            
            // Notificação para o vencedor (se for o usuário atual)
            if(user.nickname === usuarioAtual.nickname){
                usuarioAtual.moedas = db.usuarios[idx].moedas;
                usuarioAtual.xp = db.usuarios[idx].xp;
                usuarioAtual.ultimaPremiacaoSemanal = chave;
                setTimeout(() => {
                    criarNotificacao("vitoria", 
                        `🏆 Você ficou em <b>${i+1}º lugar no ranking semanal!</b><br>Prêmio: +${premios[i].moedas} moedas +${premios[i].xp} XP`,
                        {}
                    );
                }, 3000);
            }
        }
    });
    
    salvarDB(db);
    salvarDadosUsuario();
    console.log("✅ Premiação semanal paga:", chave);
}

function premiarRankingMensal(chave){
    const db = carregarDB();
    const ordenados = [...db.usuarios].sort((a, b) => (b.moedas || 0) - (a.moedas || 0));
    
    const premios = [
        { moedas: 200, xp: 20, nome: "🥇 1º lugar mensal" },
        { moedas: 100, xp: 10, nome: "🥈 2º lugar mensal" },
        { moedas: 50, xp: 5, nome: "🥉 3º lugar mensal" }
    ];
    
    ordenados.slice(0, 3).forEach((user, i) => {
        const idx = db.usuarios.findIndex(u => u.nickname === user.nickname);
        if(idx !== -1){
            db.usuarios[idx].moedas = (db.usuarios[idx].moedas || 0) + premios[i].moedas;
            db.usuarios[idx].xp = (db.usuarios[idx].xp || 0) + premios[i].xp;
            db.usuarios[idx].ultimaPremiacaoMensal = chave;
            
            if(user.nickname === usuarioAtual.nickname){
                usuarioAtual.moedas = db.usuarios[idx].moedas;
                usuarioAtual.xp = db.usuarios[idx].xp;
                usuarioAtual.ultimaPremiacaoMensal = chave;
                setTimeout(() => {
                    criarNotificacao("vitoria", 
                        `🏆 Você ficou em <b>${i+1}º lugar no ranking MENSAL!</b><br>Prêmio: +${premios[i].moedas} moedas +${premios[i].xp} XP`,
                        {}
                    );
                }, 3000);
            }
        }
    });
    
    salvarDB(db);
    salvarDadosUsuario();
    console.log("✅ Premiação mensal paga:", chave);
}


// ==================== CONFIRMAR/CANCELAR MODAL ====================
function confirmarModal(){
    // ✅ Executa a ação de callback (se existir)
    if(modalCallback && typeof modalCallback === "function"){
        modalCallback();
        modalCallback = null;
    }
    
    // Fecha o modal
    document.getElementById("modal-confirmacao").classList.add("hidden");
}

function fecharModal(){
    modalCallback = null;
    document.getElementById("modal-confirmacao").classList.add("hidden");
    somClique();
}


// ==================== INIT FINAL ====================
// ✅ Renderiza contas salvas na tela de login
renderizarContasSalvas();

// ✅ Tenta fazer auto-login se houver sessão salva
document.addEventListener("DOMContentLoaded", function(){
    setTimeout(() => {
        const fezAutoLogin = tentarAutoLogin();
        if(!fezAutoLogin){
            // Se não fez auto-login, aplica idioma normalmente
            if(typeof aplicarIdioma === "function" && idiomaAtual !== "pt"){
                aplicarIdioma();
            }
        }
    }, 200);
});

// ==================== INIT ====================
carregarTema();

// ==================== EVENTOS ====================
document.getElementById("login-senha").addEventListener("keypress",e=>{if(e.key==="Enter")fazerLogin();});
document.getElementById("login-nickname").addEventListener("keypress",e=>{if(e.key==="Enter")document.getElementById("login-senha").focus();});
document.getElementById("registro-senha").addEventListener("keypress",e=>{if(e.key==="Enter")fazerRegistro();});
document.getElementById("registro-nickname").addEventListener("keypress",e=>{if(e.key==="Enter")document.getElementById("registro-email").focus();});
document.getElementById("registro-email").addEventListener("keypress",e=>{if(e.key==="Enter")document.getElementById("registro-senha").focus();});
document.getElementById("recuperar-email").addEventListener("keypress",e=>{if(e.key==="Enter")enviarLinkRecuperacao();});
document.getElementById("nova-senha").addEventListener("keypress",e=>{if(e.key==="Enter")document.getElementById("confirmar-nova-senha").focus();});
document.getElementById("confirmar-nova-senha").addEventListener("keypress",e=>{if(e.key==="Enter")salvarNovaSenha();});

document.getElementById("login-senha").addEventListener("input",function(){this.value=this.value.replace(/\D/g,"").slice(0,8);});
document.getElementById("registro-senha").addEventListener("input",function(){this.value=this.value.replace(/\D/g,"").slice(0,8);});
document.getElementById("nova-senha").addEventListener("input",function(){this.value=this.value.replace(/\D/g,"").slice(0,8);});
document.getElementById("confirmar-nova-senha").addEventListener("input",function(){this.value=this.value.replace(/\D/g,"").slice(0,8);});
document.getElementById("input-milhar-manual").addEventListener("input",function(){this.value=this.value.replace(/\D/g,"").slice(0,4);});
document.getElementById("input-milhar-manual").addEventListener("keypress",e=>{if(e.key==="Enter")confirmarMilharManual();});