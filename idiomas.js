// ==================== IDIOMAS ====================
const TRADUCOES = {
    pt: {
        // Login / Registro
        "titulo_app": "Animal Game",
        "subtitulo_app": "Escolha • Aposte • Sorteie",
        "entrar": "🔐 Entrar",
        "nickname": "👤 Nickname",
        "senha": "🔑 Senha (8 números)",
        "btn_entrar": "Entrar 🔓",
        "sem_conta": "Não tem conta? Cadastre-se",
        "esqueci_senha": "🔑 Esqueci minha senha",
        "sobre_jogo": "ℹ️ Sobre o Jogo",
        "ver_ranking": "🏆 Ver Ranking",
        "cadastro": "📝 Cadastro",
        "nickname_label": "👤 Nickname (único, 2-20)",
        "email_label": "📧 E-mail real",
        "senha_label": "🔑 Senha (8 números)",
        "avatar_label": "🎭 Escolha seu avatar",
        "btn_cadastrar": "Cadastrar ✅",
        "ja_tem_conta": "Já tem conta? Faça login",
        "recuperar_senha": "🔑 Recuperar Senha",
        "redefinir_senha": "🔄 Redefinir Senha",
        "digite_email": "Digite o e-mail cadastrado na sua conta.",
        "email_cadastrado": "📧 E-mail",
        "btn_enviar_link": "Enviar Link 📧",
        "voltar_login": "⬅ Voltar ao Login",
        "verifique_email": "📬 Verifique seu e-mail",
        "ola": "Olá",
        "recebemos_solicitacao": "Recebemos uma solicitação para redefinir sua senha.",
        "clique_abaixo": "Clique abaixo:",
        "btn_redefinir": "🔓 Redefinir Minha Senha",
        "ignorar_email": "⚠️ Se não solicitou, ignore.",
        "nova_senha_titulo": "🔐 Nova Senha",
        "nova_senha_label": "🔑 Nova Senha",
        "confirmar_senha_label": "🔑 Confirmar",
        "btn_salvar_senha": "Salvar ✅",
        "cancelar": "⬅ Cancelar",

        // Top Bar
        "suas_moedas": "Suas moedas",
        "seu_nivel": "Seu nível e XP",
        "perfil": "Ver Perfil",
        "missoes": "Missões Diárias",
        "conquistas": "Conquistas",
        "loja": "Loja de Itens",
        "sobre": "Sobre o Jogo",
        "som": "Ligar/Desligar Som",
        "ranking": "Ver Ranking",
        "minhas_apostas": "Minhas Apostas",
        "sair": "Sair da Conta",
        "nivel": "Nível",
        "proximo_nivel": "Próximo",

        // Turnos
        "manha": "Manhã",
        "tarde": "Tarde",
        "noite": "Noite",
        "aberto": "ABERTO",
        "fechado": "FECHADO",
        "sorteado": "SORTEADO",
        "hoje_nao": "HOJE NÃO",

        // Aposta
        "apostas_turno": "Apostas no turno atual",
        "numeros_sorte": "⭐ Seus Números da Sorte",
        "editar": "Editar",
        "escolha_bicho": "👇 Escolha o seu animal:",
        "voce_escolheu": "Você escolheu:",
        "como_apostar": "💰 Como quer apostar?",
        "so_bicho": "🎯 Só o Animal",
        "bicho_milhar": "🎯💰 Animal + Milhar",
        "milhar_livre": "A milhar é 100% livre!",
        "milhar_livre_desc": "Escolha qualquer número de 0000 a 9999.",
        "digite_milhar": "🔢 Digite a milhar desejada:",
        "confirmar": "Confirmar",
        "apostar_bicho": "Apostar só no Animal 🎯",
       "trocar_bicho": "⬅ Trocar Animal",
        "confirmar_aposta": "✅ Confirmar",
        "cancelar_aposta": "❌ Cancelar",
        "aposta_registrada": "Sua aposta foi registrada!",
        "vai_concorrer": "Vai concorrer no sorteio:",
        "nova_aposta": "Fazer Nova Aposta 🔄",
        "ver_apostas": "📋 Ver Minhas Apostas",

        // Painel
        "apostas": "🐾 Apostas",
        "sorteios": "🎰 Sorteios",
        "estatisticas": "📊 Estatísticas",
        "total": "Total",
        "vitorias": "Vitórias",
        "derrotas": "Derrotas",
        "moedas": "Moedas",
        "desfazer": "❌ Desfazer",
        "sem_apostas": "Você ainda não fez nenhuma aposta.",
        "sem_sorteios": "Nenhum sorteio ainda.",
        "evolucao": "📈 Evolução de Moedas",
        "pizza": "🥧 Apostas (Vitórias x Derrotas)",
        "bichos_sorteados": "🏆 Animais Mais Sorteados",

        // Modais
        "sorteando": "🎰 Sorteando...",
        "resultado": "Resultado",
        "parabens": "Parabéns!",
        "que_pena": "Que pena...",
        "fechar": "Fechar",

        // Loja
        "loja_titulo": "🏪 Loja de Itens",
        "loja_desc": "Gaste suas moedas em itens especiais",
        "suas_moedas": "Suas moedas:",
        "comprar": "Comprar",

        // Missões
        "missoes_titulo": "🎯 Missões Diárias",
        "progresso": "Progresso",
        "recompensa": "Recompensa",
        "coletar_xp": "Coletar XP",

        // Conquistas
        "conquistas_titulo": "🏅 Conquistas",

        // Perfil
        "perfil_titulo": "👤 Perfil",
        "xp": "XP",
        "taxa": "Taxa",
        "maior_combo": "Maior Combo",
        "membro_desde": "Membro desde",

        // Sobre
        "sobre_titulo": "ℹ️ Sobre o Animal Game",
        "dias_func": "📅 Dias de Funcionamento",
        "seg_sex": "Seg-Sex",
        "sabado": "Sábado",
        "domingo": "Domingo",
        "fechado_dom": "Fechado",
        "tres_turnos": "3 turnos",
        "dois_turnos": "2 turnos",
        "apostas_label": "Apostas",
        "resultado_label": "Resultado",
        "premios_label": "Prêmios",
        "novos_recursos": "🎮 Novos Recursos",
        "projeto_academico": "Projeto Acadêmico",
        "fins_educacionais": "Fins exclusivamente educacionais.",
        "voltar": "⬅ Voltar",
        "sobre_turno_manha": "🌅 Manhã",
        "sobre_turno_tarde": "☀️ Tarde",
        "sobre_turno_noite": "🌙 Noite (Seg-Sex)",

        // Ranking
        "ranking_titulo": "🏆 Ranking",
        "geral": "🌍 Geral",
        "semanal": "📅 Semanal",
        "amigos": "👥 Amigos",
        "sem_jogadores": "Nenhum jogador ainda.",

        // Rodapé
        "rodape": "Animal Game | ES@2026",

        // Notificações / Mensagens
        "fora_horario": "Fora do horário.",
        "limite_atingido": "Limite atingido.",
        "aposta_repetida": "Aposta repetida!",
        "jogo_fechado": "Jogo Fechado",
        "dom_fechado": "Domingo - Fechado",
        "volte_segunda": "Volte na segunda-feira!",
        "fora_horario_msg": "Fora do Horário",
        "aguarde_turno": "Aguarde o próximo turno.",
        "bonus_login": "Bônus de login!",
        "missao_completa": "Missão completa!",
        "conquista_desbloqueada": "Conquista desbloqueada:",
        "subiu_nivel": "Subiu para",

        // Campos de formulário (placeholders)
        "placeholder_nickname": "Seu nickname",
        "placeholder_senha": "00000000",
        "placeholder_email": "seu@email.com",
        "placeholder_milhar": "0000",
        "idioma_titulo": "🌐 Idioma / Language",
        "idioma_escolha": "Escolha um idioma:",
        "modal_confirmar": "✅ Sim, confirmar",
        "modal_cancelar": "❌ Cancelar",
        "modal_titulo_padrao": "Confirmar?",
        "modal_texto_padrao": "Tem certeza que deseja fazer isso?",
    },

    en: {
        "titulo_app": "Animal Game",
        "subtitulo_app": "Choose • Bet • Draw",
        "entrar": "🔐 Login",
        "nickname": "👤 Nickname",
        "senha": "🔑 Password (8 digits)",
        "btn_entrar": "Login 🔓",
        "sem_conta": "Don't have an account? Sign up",
        "esqueci_senha": "🔑 Forgot password",
        "sobre_jogo": "ℹ️ About the Game",
        "ver_ranking": "🏆 View Ranking",
        "cadastro": "📝 Sign Up",
        "nickname_label": "👤 Nickname (unique, 2-20)",
        "email_label": "📧 Real email",
        "senha_label": "🔑 Password (8 digits)",
        "avatar_label": "🎭 Choose your avatar",
        "btn_cadastrar": "Sign Up ✅",
        "ja_tem_conta": "Already have an account? Login",
        "recuperar_senha": "🔑 Recover Password",
        "redefinir_senha": "🔄 Reset Password",
        "digite_email": "Enter the email registered on your account.",
        "email_cadastrado": "📧 Email",
        "btn_enviar_link": "Send Link 📧",
        "voltar_login": "⬅ Back to Login",
        "verifique_email": "📬 Check your email",
        "ola": "Hello",
        "recebemos_solicitacao": "We received a request to reset your password.",
        "clique_abaixo": "Click below:",
        "btn_redefinir": "🔓 Reset My Password",
        "ignorar_email": "⚠️ If you didn't request it, ignore.",
        "nova_senha_titulo": "🔐 New Password",
        "nova_senha_label": "🔑 New Password",
        "confirmar_senha_label": "🔑 Confirm",
        "btn_salvar_senha": "Save ✅",
        "cancelar": "⬅ Cancel",

        "suas_moedas": "Your coins",
        "seu_nivel": "Your level and XP",
        "perfil": "View Profile",
        "missoes": "Daily Missions",
        "conquistas": "Achievements",
        "loja": "Item Shop",
        "sobre": "About the Game",
        "som": "Sound On/Off",
        "ranking": "View Ranking",
        "minhas_apostas": "My Bets",
        "sair": "Logout",
        "nivel": "Level",
        "proximo_nivel": "Next",

        "manha": "Morning",
        "tarde": "Afternoon",
        "noite": "Night",
        "aberto": "OPEN",
        "fechado": "CLOSED",
        "sorteado": "DRAWN",
        "hoje_nao": "NOT TODAY",

        "apostas_turno": "Bets in current shift",
        "numeros_sorte": "⭐ Your Lucky Numbers",
        "editar": "Edit",
        "escolha_bicho": "👇 Choose your animal:",
        "voce_escolheu": "You chose:",
        "como_apostar": "💰 How to bet?",
        "so_bicho": "🎯 Animal Only",
        "bicho_milhar": "🎯💰 Animal + Number",
        "milhar_livre": "The number is 100% free!",
        "milhar_livre_desc": "Choose any number from 0000 to 9999.",
        "digite_milhar": "🔢 Enter the desired number:",
        "confirmar": "Confirm",
        "apostar_bicho": "Bet Animal Only 🎯",
        "trocar_bicho": "⬅ Change Animal",
        "confirmar_aposta": "✅ Confirm",
        "cancelar_aposta": "❌ Cancel",
        "aposta_registrada": "Your bet was registered!",
        "vai_concorrer": "Will compete in the draw:",
        "nova_aposta": "New Bet 🔄",
        "ver_apostas": "📋 View My Bets",

        "apostas": "🐾 Bets",
        "sorteios": "🎰 Draws",
        "estatisticas": "📊 Statistics",
        "total": "Total",
        "vitorias": "Wins",
        "derrotas": "Losses",
        "moedas": "Coins",
        "desfazer": "❌ Undo",
        "sem_apostas": "You haven't made any bets yet.",
        "sem_sorteios": "No draws yet.",
        "evolucao": "📈 Coin Evolution",
        "pizza": "🥧 Bets (Wins x Losses)",
        "bichos_sorteados": "🏆 Most Drawn Animals",

        "sorteando": "🎰 Drawing...",
        "resultado": "Result",
        "parabens": "Congratulations!",
        "que_pena": "Too bad...",
        "fechar": "Close",

        "loja_titulo": "🏪 Item Shop",
        "loja_desc": "Spend your coins on special items",
        "suas_moedas": "Your coins:",
        "comprar": "Buy",

        "missoes_titulo": "🎯 Daily Missions",
        "progresso": "Progress",
        "recompensa": "Reward",
        "coletar_xp": "Collect XP",

        "conquistas_titulo": "🏅 Achievements",

        "perfil_titulo": "👤 Profile",
        "xp": "XP",
        "taxa": "Rate",
        "maior_combo": "Best Combo",
        "membro_desde": "Member since",

        "sobre_titulo": "ℹ️ About Animal Game",
        "dias_func": "📅 Operating Days",
        "seg_sex": "Mon-Fri",
        "sabado": "Saturday",
        "domingo": "Sunday",
        "fechado_dom": "Closed",
        "tres_turnos": "3 shifts",
        "dois_turnos": "2 shifts",
        "apostas_label": "Bets",
        "resultado_label": "Result",
        "premios_label": "Prizes",
        "novos_recursos": "🎮 New Features",
        "projeto_academico": "Academic Project",
        "fins_educacionais": "Educational purposes only.",
        "voltar": "⬅ Back",
        "sobre_turno_manha": "🌅 Morning",
        "sobre_turno_tarde": "☀️ Afternoon",
        "sobre_turno_noite": "🌙 Night (Mon-Fri)",

        "ranking_titulo": "🏆 Ranking",
        "geral": "🌍 Overall",
        "semanal": "📅 Weekly",
        "amigos": "👥 Friends",
        "sem_jogadores": "No players yet.",

        "rodape": "Animal Game | ES@2026",

        "fora_horario": "Outside hours.",
        "limite_atingido": "Limit reached.",
        "aposta_repetida": "Duplicate bet!",
        "jogo_fechado": "Game Closed",
        "dom_fechado": "Sunday - Closed",
        "volte_segunda": "Come back on Monday!",
        "fora_horario_msg": "Outside Hours",
        "aguarde_turno": "Wait for the next shift.",
        "bonus_login": "Login bonus!",
        "missao_completa": "Mission complete!",
        "conquista_desbloqueada": "Achievement unlocked:",
        "subiu_nivel": "Leveled up to",

        "placeholder_nickname": "Your nickname",
        "placeholder_senha": "00000000",
        "placeholder_email": "you@email.com",
        "placeholder_milhar": "0000",
        "idioma_titulo": "🌐 Language / Idioma",
        "idioma_escolha": "Choose a language:",
        "modal_confirmar": "✅ Yes, confirm",
        "modal_cancelar": "❌ Cancel",
        "modal_titulo_padrao": "Confirm?",
        "modal_texto_padrao": "Are you sure you want to do this?",
    },

    es: {
        "titulo_app": "Animal Game",
        "subtitulo_app": "Elige • Apuesta • Sorteo",
        "entrar": "🔐 Entrar",
        "nickname": "👤 Apodo",
        "senha": "🔑 Contraseña (8 números)",
        "btn_entrar": "Entrar 🔓",
        "sem_conta": "¿No tienes cuenta? Regístrate",
        "esqueci_senha": "🔑 Olvidé mi contraseña",
        "sobre_jogo": "ℹ️ Sobre el Juego",
        "ver_ranking": "🏆 Ver Ranking",
        "cadastro": "📝 Registro",
        "nickname_label": "👤 Apodo (único, 2-20)",
        "email_label": "📧 Correo real",
        "senha_label": "🔑 Contraseña (8 números)",
        "avatar_label": "🎭 Elige tu avatar",
        "btn_cadastrar": "Registrarse ✅",
        "ja_tem_conta": "¿Ya tienes cuenta? Inicia sesión",
        "recuperar_senha": "🔑 Recuperar Contraseña",
        "redefinir_senha": "🔄 Restablecer Contraseña",
        "digite_email": "Ingresa el correo registrado en tu cuenta.",
        "email_cadastrado": "📧 Correo",
        "btn_enviar_link": "Enviar Enlace 📧",
        "voltar_login": "⬅ Volver al Login",
        "verifique_email": "📬 Revisa tu correo",
        "ola": "Hola",
        "recebemos_solicitacao": "Recibimos una solicitud para restablecer tu contraseña.",
        "clique_abaixo": "Haz clic abajo:",
        "btn_redefinir": "🔓 Restablecer Mi Contraseña",
        "ignorar_email": "⚠️ Si no lo solicitaste, ignóralo.",
        "nova_senha_titulo": "🔐 Nueva Contraseña",
        "nova_senha_label": "🔑 Nueva Contraseña",
        "confirmar_senha_label": "🔑 Confirmar",
        "btn_salvar_senha": "Guardar ✅",
        "cancelar": "⬅ Cancelar",

        "suas_moedas": "Tus monedas",
        "seu_nivel": "Tu nivel y XP",
        "perfil": "Ver Perfil",
        "missoes": "Misiones Diarias",
        "conquistas": "Logros",
        "loja": "Tienda de Objetos",
        "sobre": "Sobre el Juego",
        "som": "Sonido On/Off",
        "ranking": "Ver Ranking",
        "minhas_apostas": "Mis Apuestas",
        "sair": "Salir",
        "nivel": "Nivel",
        "proximo_nivel": "Próximo",

        "manha": "Mañana",
        "tarde": "Tarde",
        "noite": "Noche",
        "aberto": "ABIERTO",
        "fechado": "CERRADO",
        "sorteado": "SORTEADO",
        "hoje_nao": "HOY NO",

        "apostas_turno": "Apuestas en el turno actual",
        "numeros_sorte": "⭐ Tus Números de la Suerte",
        "editar": "Editar",
        "escolha_bicho": "👇 Elige tu animal:",
        "voce_escolheu": "Elegiste:",
        "como_apostar": "💰 ¿Cómo apostar?",
        "so_bicho": "🎯 Solo Animal",
        "bicho_milhar": "🎯💰 Animal + Número",
        "milhar_livre": "¡El número es 100% libre!",
        "milhar_livre_desc": "Elige cualquier número de 0000 a 9999.",
        "digite_milhar": "🔢 Ingresa el número deseado:",
        "confirmar": "Confirmar",
        "apostar_bicho": "Apostar Solo Animal 🎯",
        "trocar_bicho": "⬅ Cambiar Animal",
        "confirmar_aposta": "✅ Confirmar",
        "cancelar_aposta": "❌ Cancelar",
        "aposta_registrada": "¡Tu apuesta fue registrada!",
        "vai_concorrer": "Competirá en el sorteo:",
        "nova_aposta": "Nueva Apuesta 🔄",
        "ver_apostas": "📋 Ver Mis Apuestas",

        "apostas": "🐾 Apuestas",
        "sorteios": "🎰 Sorteos",
        "estatisticas": "📊 Estadísticas",
        "total": "Total",
        "vitorias": "Victorias",
        "derrotas": "Derrotas",
        "moedas": "Monedas",
        "desfazer": "❌ Deshacer",
        "sem_apostas": "Aún no has hecho ninguna apuesta.",
        "sem_sorteios": "Sin sorteos aún.",
        "evolucao": "📈 Evolución de Monedas",
        "pizza": "🥧 Apuestas (Victorias x Derrotas)",
        "bichos_sorteados": "🏆 Animales Más Sorteados",

        "sorteando": "🎰 Sorteando...",
        "resultado": "Resultado",
        "parabens": "¡Felicidades!",
        "que_pena": "Qué pena...",
        "fechar": "Cerrar",

        "loja_titulo": "🏪 Tienda de Objetos",
        "loja_desc": "Gasta tus monedas en objetos especiales",
        "suas_moedas": "Tus monedas:",
        "comprar": "Comprar",

        "missoes_titulo": "🎯 Misiones Diarias",
        "progresso": "Progreso",
        "recompensa": "Recompensa",
        "coletar_xp": "Recoger XP",

        "conquistas_titulo": "🏅 Logros",

        "perfil_titulo": "👤 Perfil",
        "xp": "XP",
        "taxa": "Tasa",
        "maior_combo": "Mejor Combo",
        "membro_desde": "Miembro desde",

        "sobre_titulo": "ℹ️ Sobre el Animal Game",
        "dias_func": "📅 Días de Funcionamiento",
        "seg_sex": "Lun-Vie",
        "sabado": "Sábado",
        "domingo": "Domingo",
        "fechado_dom": "Cerrado",
        "tres_turnos": "3 turnos",
        "dois_turnos": "2 turnos",
        "apostas_label": "Apuestas",
        "resultado_label": "Resultado",
        "premios_label": "Premios",
        "novos_recursos": "🎮 Nuevas Funciones",
        "projeto_academico": "Proyecto Académico",
        "fins_educacionais": "Solo con fines educativos.",
        "voltar": "⬅ Volver",
        "sobre_turno_manha": "🌅 Mañana",
        "sobre_turno_tarde": "☀️ Tarde",
        "sobre_turno_noite": "🌙 Noche (Lun-Vie)",

        "ranking_titulo": "🏆 Ranking",
        "geral": "🌍 General",
        "semanal": "📅 Semanal",
        "amigos": "👥 Amigos",
        "sem_jogadores": "Sin jugadores aún.",

        "rodape": "Animal Game | ES@2026",

        "fora_horario": "Fuera de horario.",
        "limite_atingido": "Límite alcanzado.",
        "aposta_repetida": "¡Apuesta duplicada!",
        "jogo_fechado": "Juego Cerrado",
        "dom_fechado": "Domingo - Cerrado",
        "volte_segunda": "¡Vuelve el lunes!",
        "fora_horario_msg": "Fuera de Horario",
        "aguarde_turno": "Espera el próximo turno.",
        "bonus_login": "¡Bono de login!",
        "missao_completa": "¡Misión completa!",
        "conquista_desbloqueada": "Logro desbloqueado:",
        "subiu_nivel": "Subió al nivel",

        "placeholder_nickname": "Tu apodo",
        "placeholder_senha": "00000000",
        "placeholder_email": "tu@email.com",
        "placeholder_milhar": "0000",
        "idioma_titulo": "🌐 Idioma / Language",
        "idioma_escolha": "Elige un idioma:",
        "modal_confirmar": "✅ Sí, confirmar",
        "modal_cancelar": "❌ Cancelar",
        "modal_titulo_padrao": "¿Confirmar?",
        "modal_texto_padrao": "¿Estás seguro de que quieres hacer esto?",
    }
};

// Idioma atual
let idiomaAtual = localStorage.getItem("animalGame_idioma") || "pt";

// Retorna tradução
function t(chave){
    return TRADUCOES[idiomaAtual]?.[chave] || TRADUCOES["pt"][chave] || chave;
}

        // Aplica em todos os elementos com data-i18n
function aplicarIdioma(){
    // Textos
    document.querySelectorAll("[data-i18n]").forEach(el=>{
        const chave = el.getAttribute("data-i18n");
        const traducao = t(chave);
        if(traducao){
            if(el.hasAttribute("data-i18n-html")){
                el.innerHTML = traducao;
            } else {
                el.innerText = traducao;
            }
        }
    });
    
    // Placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{
        const chave = el.getAttribute("data-i18n-placeholder");
        const traducao = t(chave);
        if(traducao) el.placeholder = traducao;
    });
    
    // Títulos (tooltips)
    document.querySelectorAll("[data-i18n-title]").forEach(el=>{
        const chave = el.getAttribute("data-i18n-title");
        const traducao = t(chave);
        if(traducao) el.title = traducao;
    });
}

// Troca idioma
function trocarIdioma(novoIdioma){
    if(!TRADUCOES[novoIdioma]) return;
    idiomaAtual = novoIdioma;
    localStorage.setItem("animalGame_idioma", novoIdioma);
    
    // ✅ Fecha o modal primeiro
    if(typeof fecharModal === "function") fecharModal();
    
    // ✅ Recarrega a página para aplicar TUDO (login, jogo, modais, etc)
    setTimeout(()=>{
        location.reload();
    }, 200);
}

// Atualiza o visual do botão de idioma
function atualizarBotaoIdioma(){
    const bandeiras = {pt:"🇧🇷",en:"🇺🇸",es:"🇪🇸"};
    ["btn-idioma","btn-idioma-login"].forEach(id=>{
        const el = document.getElementById(id);
        if(el) el.innerText = bandeiras[idiomaAtual] || "🌐";
    });
}

// Abre seletor de idioma
function abrirSeletorIdioma(){
    const idiomas = [
        {cod:"pt", nome:"🇧🇷 Português"},
        {cod:"en", nome:"🇺🇸 English"},
        {cod:"es", nome:"🇪🇸 Español"}
    ];
    const botoes = idiomas.map(i =>
        `<button onclick="trocarIdioma('${i.cod}')" style="width:100%;margin:5px 0;padding:12px;background:${i.cod===idiomaAtual?'#f1c40f':'#3498db'};color:${i.cod===idiomaAtual?'#2c3e50':'white'};border-radius:10px;font-weight:700;border:none;cursor:pointer;font-family:Poppins,sans-serif;">${i.nome}</button>`
    ).join("");

    abrirModal(t("idioma_titulo"), t("idioma_escolha"), "🌐", botoes, ()=>{});
    
    // ✅ Traduz os botões do modal imediatamente
    setTimeout(()=>{
        const btnConfirmar = document.querySelector("#modal-confirmacao .danger");
        const btnCancelar = document.querySelector("#modal-confirmacao .secondary");
        if(btnConfirmar) btnConfirmar.innerText = t("modal_confirmar");
        if(btnCancelar) btnCancelar.innerText = t("modal_cancelar");
    }, 50);
}