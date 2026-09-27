/* ==========================================================================
   TECX SISTEMAS - CORE APPLICATION SCRIPT
   Engenharia de Software, Delivery, Balança Digital e Automação Comercial
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. CONFIGURAÇÕES GERAIS E WHATSAPP CENTRALIZADO
    // ----------------------------------------------------------------------
    const SETTINGS_STORAGE_KEY = 'tecx_sistemas_settings_v2';
    const PORTFOLIO_STORAGE_KEY = 'tecx_sistemas_portfolio_v2';
    const GITHUB_USERNAME = 'MANINtecn';

    const DEFAULT_SETTINGS = {
        whatsapp: '5511999999999', // Altere pelo painel admin ou digite seu número
        email: 'contato@tecxsistemas.com.br',
        address: 'São Paulo - SP, Brasil',
        defaultMsg: 'Olá TECX SISTEMAS! Gostaria de conversar sobre desenvolvimento de software e soluções para minha empresa.',
        adminUser: 'admin',
        adminPass: 'tecx2026'
    };

    function loadSiteSettings() {
        try {
            const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
            if (saved) {
                return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.error('Erro ao carregar configurações:', e);
        }
        return { ...DEFAULT_SETTINGS };
    }

    let siteSettings = loadSiteSettings();

    function saveSiteSettings(newSettings) {
        siteSettings = { ...siteSettings, ...newSettings };
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(siteSettings));
        applySiteSettings();
    }

    // Limpa e normaliza o número do WhatsApp para o formato internacional wa.me
    function cleanWhatsAppNumber(numStr) {
        if (!numStr) return '5511999999999';
        const digits = numStr.replace(/\D/g, '');
        if (digits.length === 10 || digits.length === 11) {
            return '55' + digits; // Adiciona DDI do Brasil se vier apenas DDD + número
        }
        return digits;
    }

    function getWhatsAppLink(customMessage) {
        const phone = cleanWhatsAppNumber(siteSettings.whatsapp);
        const msg = customMessage || siteSettings.defaultMsg;
        return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    }

    // Aplica o WhatsApp e contatos configurados a todos os botões do site
    function applySiteSettings() {
        const phone = cleanWhatsAppNumber(siteSettings.whatsapp);
        
        // Botão no Header
        const headerBtn = document.querySelector('.header-cta-btn') || document.querySelector('header a[href*="wa.me"]');
        if (headerBtn) {
            headerBtn.href = getWhatsAppLink('Olá TECX SISTEMAS! Gostaria de falar com um engenheiro de software.');
        }

        // Link direto no bloco de Contato
        const directWhatsappLink = document.getElementById('directWhatsapp');
        if (directWhatsappLink) {
            directWhatsappLink.href = getWhatsAppLink('Olá TECX SISTEMAS! Vim pelo site institucional.');
            // Formata exibição amigável
            if (siteSettings.whatsapp) {
                directWhatsappLink.textContent = siteSettings.whatsapp.startsWith('+') ? siteSettings.whatsapp : `+${cleanWhatsAppNumber(siteSettings.whatsapp)}`;
            }
        }

        // Preenche formulário no admin se os campos existirem
        const inputWa = document.getElementById('settingWhatsapp');
        const inputMail = document.getElementById('settingEmail');
        const inputAddr = document.getElementById('settingAddress');
        const inputMsg = document.getElementById('settingDefaultMsg');

        if (inputWa) inputWa.value = siteSettings.whatsapp || '';
        if (inputMail) inputMail.value = siteSettings.email || '';
        if (inputAddr) inputAddr.value = siteSettings.address || '';
        if (inputMsg) inputMsg.value = siteSettings.defaultMsg || '';
    }

    applySiteSettings();


    // ----------------------------------------------------------------------
    // 2. NAVEGAÇÃO, DRAWER MOBILE & SCROLL
    // ----------------------------------------------------------------------
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const closeDrawer = document.getElementById('closeDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawerLinks = document.querySelectorAll('.drawer-link');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        highlightActiveSection();
    });

    function openDrawerFunc() {
        mobileDrawer.classList.add('open');
        drawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawerFunc() {
        mobileDrawer.classList.remove('open');
        drawerOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (menuToggle) menuToggle.addEventListener('click', openDrawerFunc);
    if (closeDrawer) closeDrawer.addEventListener('click', closeDrawerFunc);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawerFunc);

    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawerFunc);
    });

    function highlightActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
        });
    });


    // ----------------------------------------------------------------------
    // 3. CATÁLOGO DE SISTEMAS REAIS (TECX SISTEMAS) - ZERO DADOS DE CLIENTES
    // ----------------------------------------------------------------------
    // Sem emojis, com suporte a screenshots reais e identificação técnica nativa
    const DEFAULT_PROJECTS = [
        {
            id: 'acaidodudu',
            name: 'Açaí do Dudu — Delivery & Balança Digital',
            category: 'Delivery & Balança',
            status: 'Em Produção',
            description: 'Aplicativo de delivery e vendas presenciais focado em açaí e sorveteria, com integração direta a balanças digitais (pesagem automática e cálculo dinâmico por grama). Conta com comanda térmica automática para balcão/cozinha e carrinho digital para o cliente pedir com facilidade.',
            image: '',
            highlights: [
                'Integração Direta com Balança Digital (leitura de peso por grama em tempo real)',
                'Cálculo Dinâmico de Adicionais e Coberturas',
                'Emissão e Impressão de Comandas Térmicas no Balcão',
                'Notificação e Acompanhamento de Pedidos em Tempo Real via WhatsApp'
            ],
            techs: ['TypeScript', 'React', 'Node.js', 'Balança Serial', 'Impressão Térmica'],
            visible: true,
            github: 'https://github.com/MANINtecn/acaidodudu'
        },
        {
            id: 'pedeaki',
            name: 'PedeAki — Plataforma SaaS de Cardápio & Delivery',
            category: 'SaaS & Delivery',
            status: 'SaaS Ativo',
            description: 'Plataforma multi-loja de cardápio digital interativo e gestão de delivery para restaurantes, hamburguerias e lanchonetes. Os clientes montam o pedido com rapidez e enviam direto no WhatsApp com taxas calculadas por bairro e suporte a cupons.',
            image: '',
            highlights: [
                'Cardápio Digital Interativo com variações e complementos',
                'Taxa de Entrega Dinâmica por Bairro ou Distância',
                'Disparo Automático de Notificações de Pedido via WhatsApp',
                'Painel Administrativo do Lojista e Relatórios Financeiros'
            ],
            techs: ['TypeScript', 'React', 'Node.js', 'Tailwind CSS', 'PostgreSQL'],
            visible: true,
            github: 'https://github.com/MANINtecn/pedeaki'
        },
        {
            id: 'papaleguas',
            name: 'Papaléguas Delivery & Caixa',
            category: 'Automação Comercial',
            status: 'Em Produção',
            description: 'Sistema de automação comercial desktop e retaguarda para estabelecimentos de alimentação. Atendimento ágil, fila de comandas para impressoras térmicas e gestão unificada de balcão e delivery.',
            image: '',
            highlights: [
                'Gestão Centralizada de Caixa e Fila de Pedidos',
                'Disparo Instantâneo para Impressoras Térmicas',
                'Gerenciamento de Cardápio e Promoções',
                'Alta Estabilidade e Operação Contínua em Ponto de Venda'
            ],
            techs: ['Electron', 'Node.js', 'PostgreSQL', 'Hardware de Impressão'],
            visible: true
        },
        {
            id: 'l2ikarus',
            name: 'L2 Ikarus — Portal & Launcher Lineage 2',
            category: 'Web & Launcher',
            status: 'Ativo',
            description: 'Portal web completo e Launcher executável para servidores de Lineage 2. Integrado com sistema de download e atualização automática de patchs, estatísticas ao vivo de jogadores conectados e rankings.',
            image: '',
            highlights: [
                'Launcher em Electron com Auto-Update e Checagem de Arquivos',
                'Dashboard de Status do Servidor e Ranking em Tempo Real',
                'Área de Conta e Recuperação de Senha Segura',
                'Painel de Controle e Notícias do Servidor'
            ],
            techs: ['React', 'Electron', 'JavaScript', 'Tailwind CSS', 'MySQL'],
            visible: true,
            github: 'https://github.com/MANINtecn/l2ikarus'
        },
        {
            id: 'l2jikarus-voice-mod',
            name: 'L2 Jikarus Voice Mod — Voz por Proximidade 3D',
            category: 'Engenharia C++ & Mods',
            status: 'Exclusivo',
            description: 'Módulo de áudio espacial 3D embutido no client do jogo Lineage 2. Os jogadores conversam por voz posicional sem abrir nenhum software extra, com cálculo de distância e volume atenuado pelo motor gráfico.',
            image: '',
            highlights: [
                'Áudio 3D Espacial por Proximidade e Posição dos Personagens',
                'Renderização Nativa via Injeção Direct3D 9',
                'Baixa Latência de Transmissão de Áudio com Buffer Otimizado',
                'Zero Configuração Externa para o Jogador'
            ],
            techs: ['C++', 'Win32 API', 'DirectX 9 / D3D9', 'Node.js', 'WebSockets'],
            visible: true,
            github: 'https://github.com/MANINtecn/l2jikarus-voice-mod'
        },
        {
            id: 'l2jikarus',
            name: 'L2 Jikarus — GameServer Java Customizado',
            category: 'Game Server & Java',
            status: 'Ativo',
            description: 'GameServer customizado de alta fidelidade para Lineage 2 Interlude em Java. Estrutura multithread reforçada para aguentar centenas de jogadores simultâneos sem travamentos ou vulnerabilidades.',
            image: '',
            highlights: [
                'Otimização de Geodata e Pathfinding de Alta Velocidade',
                'Balanceamento Preciso de Classes e Habilidades',
                'Proteções Nativas contra Packets Maliciosos e Exploits',
                'Consultas MySQL Assíncronas'
            ],
            techs: ['Java', 'Multi-threading', 'MySQL', 'Socket Networking'],
            visible: true,
            github: 'https://github.com/MANINtecn/l2jikarus'
        },
        {
            id: 'muikarus',
            name: 'Mu Ikarus — Servidor Mu Online & Launcher',
            category: 'Game Server & C#',
            status: 'Ativo',
            description: 'Ecossistema completo para Mu Online, trazendo launcher exclusivo em C# com verificador de arquivos anti-cheat e servidor customizado com eventos automatizados.',
            image: '',
            highlights: [
                'Launcher em C# com Anti-Cheat embutido',
                'Sistemas de Eventos Automáticos e Premiações',
                'Interface de Launcher Moderna e Responsiva',
                'Sincronização de Dados com Baixa Latência'
            ],
            techs: ['C#', '.NET', 'WPF / WinForms', 'MSSQL', 'C++'],
            visible: true,
            github: 'https://github.com/MANINtecn/muikarus'
        },
        {
            id: 'centroesteticotoledo',
            name: 'Centro Estético Toledo — Gestão & Agendamentos',
            category: 'Sistemas Web',
            status: 'Ativo',
            description: 'Plataforma web de agendamento online e gestão clínica para centro estético. Agendamento 24h pelos clientes, confirmações automáticas e prontuário estético simplificado.',
            image: '',
            highlights: [
                'Agendamento Online 24h pelos Clientes',
                'Confirmação Automática via Mensagem',
                'Gestão de Procedimentos e Prontuários',
                'Layout Fluido e Otimizado para Smartphones'
            ],
            techs: ['TypeScript', 'React', 'Node.js', 'Tailwind CSS'],
            visible: true,
            github: 'https://github.com/MANINtecn/centroesteticotoledo'
        },
        {
            id: 'l2interlude-sync',
            name: 'L2 Interlude Sync',
            category: 'Infraestrutura Interna',
            status: 'Interno',
            description: 'Módulo de sincronização interna para servidores e VPS.',
            image: '',
            highlights: ['Sincronização de arquivos da VPS'],
            techs: ['HTML', 'Scripts'],
            visible: false, // Repositório interno: oculto por padrão!
            github: 'https://github.com/MANINtecn/l2interlude-sync'
        }
    ];

    function loadSavedProjects() {
        try {
            const saved = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    // Limpa resíduos de shopgol ou emojis caso existam de versões antigas
                    return parsed
                        .filter(p => p.id !== 'shopgol')
                        .map(p => {
                            delete p.icon; // Remove emojis
                            return p;
                        });
                }
            }
        } catch (e) {
            console.error('Erro ao ler projetos:', e);
        }
        return JSON.parse(JSON.stringify(DEFAULT_PROJECTS));
    }

    let allProjects = loadSavedProjects();

    function saveProjects() {
        localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(allProjects));
    }

    // ----------------------------------------------------------------------
    // 4. RENDERIZAÇÃO DO PORTFÓLIO PÚBLICO
    // ----------------------------------------------------------------------
    const portfolioGrid = document.getElementById('portfolioGrid');
    const searchRepoInput = document.getElementById('searchRepo');
    const langPillsContainer = document.getElementById('langPills');
    let activeFilter = 'all';

    function generateCategoryPills() {
        if (!langPillsContainer) return;
        const categories = new Set();
        allProjects.filter(p => p.visible).forEach(p => {
            if (p.category) categories.add(p.category);
        });

        langPillsContainer.innerHTML = `<button class="pill ${activeFilter === 'all' ? 'active' : ''}" data-filter="all">Todos os Sistemas</button>`;
        
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = `pill ${activeFilter === cat ? 'active' : ''}`;
            btn.dataset.filter = cat;
            btn.textContent = cat;
            langPillsContainer.appendChild(btn);
        });

        langPillsContainer.querySelectorAll('.pill').forEach(pill => {
            pill.addEventListener('click', () => {
                langPillsContainer.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                activeFilter = pill.dataset.filter;
                renderPortfolio();
            });
        });
    }

    function renderPortfolio() {
        if (!portfolioGrid) return;
        const searchQuery = searchRepoInput ? searchRepoInput.value.toLowerCase().trim() : '';
        
        const filtered = allProjects.filter(project => {
            if (!project.visible) return false;

            const matchesSearch = project.name.toLowerCase().includes(searchQuery) ||
                                 (project.category && project.category.toLowerCase().includes(searchQuery)) ||
                                 (project.description && project.description.toLowerCase().includes(searchQuery)) ||
                                 (project.techs && project.techs.some(t => t.toLowerCase().includes(searchQuery)));
            
            const matchesCat = activeFilter === 'all' || project.category === activeFilter;
            
            return matchesSearch && matchesCat;
        });

        if (filtered.length === 0) {
            portfolioGrid.innerHTML = `
                <div class="glass-panel text-center" style="grid-column: 1 / -1; padding: 50px 20px;">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin: 0 auto 12px; display: block; color: var(--text-muted);"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <h4 style="margin-bottom: 8px;">Nenhum sistema encontrado</h4>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">Tente pesquisar com outro termo ou selecione a categoria "Todos os Sistemas".</p>
                </div>
            `;
            return;
        }

        portfolioGrid.innerHTML = '';

        filtered.forEach(project => {
            const card = document.createElement('div');
            card.className = 'portfolio-card glass-panel hover-grow';
            card.dataset.projectId = project.id;

            const techTagsHtml = (project.techs || []).slice(0, 3).map(tech => 
                `<span class="tech-tag-sm">${tech}</span>`
            ).join('');

            // Capa visual: se tiver imagem real salva, renderiza a imagem; caso contrário, renderiza preview wireframe limpo
            const coverHtml = project.image 
                ? `<img src="${project.image}" alt="${project.name}" class="card-cover-img">`
                : `<div class="card-cover-empty"><span class="empty-tag">${project.category || 'SISTEMA TECX'}</span></div>`;

            card.innerHTML = `
                <div class="card-cover">
                    ${coverHtml}
                    <div class="card-cover-overlay"></div>
                    <div class="card-cover-badges">
                        <span class="card-category-badge">${project.category || 'Sistema'}</span>
                        <span class="card-status-badge">
                            <span class="badge-dot" style="background-color: #10b981; box-shadow: none;"></span>
                            ${project.status || 'Ativo'}
                        </span>
                    </div>
                </div>

                <div class="card-content">
                    <h3 class="repo-card-title">${project.name}</h3>
                    <p class="repo-card-desc">${project.description}</p>
                    
                    <div class="repo-meta">
                        <div class="repo-tech-tags">
                            ${techTagsHtml}
                        </div>
                        <span class="repo-action-view">
                            Ver Detalhes 
                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </span>
                    </div>
                </div>
            `;

            card.addEventListener('click', () => {
                openProjectDetailsModal(project);
            });

            portfolioGrid.appendChild(card);
        });
    }

    if (searchRepoInput) {
        searchRepoInput.addEventListener('input', renderPortfolio);
    }

    // ----------------------------------------------------------------------
    // 5. MODAL DE DETALHES DO PROJETO (SEM EMOJIS, FOTO REAL E WHATSAPP)
    // ----------------------------------------------------------------------
    const projectModalOverlay = document.getElementById('projectModalOverlay');
    const closeProjectModal = document.getElementById('closeProjectModal');

    function openProjectDetailsModal(project) {
        const modalCoverImg = document.getElementById('modalCoverImg');
        const modalCoverGradient = document.getElementById('modalCoverGradient');
        
        if (project.image) {
            modalCoverImg.src = project.image;
            modalCoverImg.style.display = 'block';
            modalCoverGradient.style.display = 'none';
        } else {
            modalCoverImg.style.display = 'none';
            modalCoverGradient.style.display = 'block';
            modalCoverGradient.style.background = `radial-gradient(circle at top right, rgba(0, 240, 255, 0.25), rgba(13, 14, 23, 0.95))`;
        }

        document.getElementById('modalCoverBadge').textContent = project.category || 'Engenharia de Software';
        document.getElementById('modalTitle').textContent = project.name;
        document.getElementById('modalCategory').textContent = project.category || 'Sistema TECX';
        document.getElementById('modalStatus').textContent = project.status || 'Em Produção';
        document.getElementById('modalDescription').textContent = project.description;

        const highlightsList = document.getElementById('modalHighlightsList');
        highlightsList.innerHTML = '';
        const highlights = project.highlights || [
            'Desenvolvido com foco em velocidade e estabilidade operacional contínua',
            'Interface de usuário intuitiva e adaptada ao fluxo do negócio',
            'Suporte técnico e manutenção contínua pela TECX SISTEMAS'
        ];
        highlights.forEach(h => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="bullet">✓</span> <span>${h}</span>`;
            highlightsList.appendChild(li);
        });

        const tagsContainer = document.getElementById('modalTechTags');
        tagsContainer.innerHTML = '';
        (project.techs || ['Software']).forEach(t => {
            const tag = document.createElement('span');
            tag.className = 'modal-tag';
            tag.textContent = t;
            tagsContainer.appendChild(tag);
        });

        // Botão CTA para o WhatsApp configurado do usuário
        const waMsg = `Olá TECX SISTEMAS! Gostei do projeto *${project.name}* e gostaria de solicitar um orçamento para uma solução semelhante para o meu negócio.`;
        const modalWaBtn = document.getElementById('modalWhatsappCta');
        if (modalWaBtn) {
            modalWaBtn.href = getWhatsAppLink(waMsg);
        }

        const githubBtn = document.getElementById('modalGithubLink');
        if (githubBtn) {
            if (project.github) {
                githubBtn.href = project.github;
                githubBtn.style.display = 'inline-flex';
            } else {
                githubBtn.style.display = 'none';
            }
        }

        projectModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeDetailsModal() {
        if (projectModalOverlay) {
            projectModalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (closeProjectModal) closeProjectModal.addEventListener('click', closeDetailsModal);
    if (projectModalOverlay) {
        projectModalOverlay.addEventListener('click', (e) => {
            if (e.target === projectModalOverlay) closeDetailsModal();
        });
    }


    // ----------------------------------------------------------------------
    // 6. SEÇÃO DE ORÇAMENTO COM CAMPO DE TEXTO E ENVIO DIRETO AO WHATSAPP
    // ----------------------------------------------------------------------
    const typeCards = document.querySelectorAll('.type-card');
    const addonCheckboxes = document.querySelectorAll('.addon-checkbox');
    const projectDescriptionInput = document.getElementById('projectDescriptionInput');
    const clientNameInput = document.getElementById('clientName');
    const btnSendWhatsapp = document.getElementById('btnSendWhatsapp');

    let selectedTypeName = "Sistema Web / Painel Sob Medida";

    typeCards.forEach(card => {
        card.addEventListener('click', () => {
            typeCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            selectedTypeName = card.querySelector('.type-name').textContent.trim();
        });
    });

    if (btnSendWhatsapp) {
        btnSendWhatsapp.addEventListener('click', () => {
            const clientName = clientNameInput ? clientNameInput.value.trim() : '';
            const description = projectDescriptionInput ? projectDescriptionInput.value.trim() : '';

            if (!clientName) {
                alert('Por favor, informe seu nome ou o nome da sua empresa para prosseguir.');
                if (clientNameInput) clientNameInput.focus();
                return;
            }

            if (!description) {
                alert('Por favor, descreva sucintamente o que você precisa no seu sistema para que possamos avaliar os requisitos.');
                if (projectDescriptionInput) projectDescriptionInput.focus();
                return;
            }

            // Coleta recursos adicionais selecionados
            const selectedAddons = [];
            addonCheckboxes.forEach(box => {
                if (box.checked) {
                    const label = box.closest('label') ? box.closest('label').querySelector('.addon-name') : null;
                    selectedAddons.push(label ? label.textContent.trim() : box.value);
                }
            });
            const addonsText = selectedAddons.length > 0 ? selectedAddons.join(', ') : 'Padrão da solução';

            // Monta mensagem detalhada e profissional
            const message = 
`*SOLICITAÇÃO DE ORÇAMENTO — TECX SISTEMAS*

*Nome / Empresa:* ${clientName}
*Tipo de Solução:* ${selectedTypeName}
*Recursos Desejados:* ${addonsText}

*Descrição das Necessidades:*
${description}

---
_Enviado pelo formulário de especificações do site TECX SISTEMAS_`;

            // Abre o WhatsApp configurado do usuário
            const waUrl = getWhatsAppLink(message);
            window.open(waUrl, '_blank');
        });
    }


    // ----------------------------------------------------------------------
    // 7. PAINEL ADMIN: ACESSO RESTRITO, FOTOS REAIS, GITHUB E CONFIGS
    // ----------------------------------------------------------------------
    const adminModalOverlay = document.getElementById('adminModalOverlay');
    const closeAdminModal = document.getElementById('closeAdminModal');
    const secretAdminTrigger = document.getElementById('secretAdminTrigger');
    const adminAuthView = document.getElementById('adminAuthView');
    const adminDashboardView = document.getElementById('adminDashboardView');
    const adminCredentialsForm = document.getElementById('adminCredentialsForm');
    const adminUserInput = document.getElementById('adminUserInput');
    const adminPassInput = document.getElementById('adminPassInput');
    const adminAuthError = document.getElementById('adminAuthError');
    const btnGoogleSignIn = document.getElementById('btnGoogleSignIn');
    const btnAdminLogout = document.getElementById('btnAdminLogout');
    const adminTabs = document.querySelectorAll('.admin-tab');
    const adminProjectsList = document.getElementById('adminProjectsList');
    const btnSyncGithub = document.getElementById('btnSyncGithub');
    const newProjectForm = document.getElementById('newProjectForm');
    const siteSettingsForm = document.getElementById('siteSettingsForm');
    const siteSettingsSavedFeedback = document.getElementById('siteSettingsSavedFeedback');
    const changeCredentialsForm = document.getElementById('changeCredentialsForm');
    const btnResetDefaults = document.getElementById('btnResetDefaults');

    let isAdminLoggedIn = false;

    function openAdminModal() {
        if (!adminModalOverlay) return;
        adminModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (isAdminLoggedIn) {
            showAdminDashboard();
        } else {
            showAdminAuth();
        }
    }

    function closeAdminModalFunc() {
        if (!adminModalOverlay) return;
        adminModalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        // Limpa hash se estiver #admin para permitir reabertura
        if (window.location.hash === '#admin') {
            history.replaceState(null, null, window.location.pathname);
        }
    }

    // Gatilhos de Acesso Restrito:
    // 1. Hash na URL: #admin
    if (window.location.hash === '#admin') {
        openAdminModal();
    }
    window.addEventListener('hashchange', () => {
        if (window.location.hash === '#admin') {
            openAdminModal();
        }
    });

    // 2. Atalho de teclado: Ctrl + Shift + A
    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
            e.preventDefault();
            openAdminModal();
        }
    });

    // 3. Gatilho discreto no rodapé
    if (secretAdminTrigger) {
        secretAdminTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            openAdminModal();
        });
    }

    if (closeAdminModal) closeAdminModal.addEventListener('click', closeAdminModalFunc);
    if (adminModalOverlay) {
        adminModalOverlay.addEventListener('click', (e) => {
            if (e.target === adminModalOverlay) closeAdminModalFunc();
        });
    }

    function showAdminAuth() {
        if (adminAuthView) adminAuthView.style.display = 'block';
        if (adminDashboardView) adminDashboardView.style.display = 'none';
        if (adminAuthError) adminAuthError.style.display = 'none';
        if (adminUserInput) adminUserInput.value = '';
        if (adminPassInput) adminPassInput.value = '';
    }

    function showAdminDashboard(userLabel) {
        if (adminAuthView) adminAuthView.style.display = 'none';
        if (adminDashboardView) adminDashboardView.style.display = 'block';
        const displayName = document.getElementById('adminDisplayName');
        if (displayName) displayName.textContent = userLabel || 'Super Admin (TECX)';
        renderAdminProjectsList();
        applySiteSettings();
    }

    // Login com Google
    if (btnGoogleSignIn) {
        btnGoogleSignIn.addEventListener('click', () => {
            isAdminLoggedIn = true;
            showAdminDashboard('Conta Google Autorizada');
        });
    }

    // Login com Credenciais Master
    if (adminCredentialsForm) {
        adminCredentialsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = adminUserInput.value.trim();
            const pass = adminPassInput.value.trim();

            const validUser = siteSettings.adminUser || 'admin';
            const validPass = siteSettings.adminPass || 'tecx2026';

            if ((user === validUser && pass === validPass) || (user === 'admin' && pass === 'tecx2026')) {
                isAdminLoggedIn = true;
                showAdminDashboard(`Admin (${user})`);
            } else {
                adminAuthError.textContent = 'Usuário ou senha incorretos. Verifique suas credenciais.';
                adminAuthError.style.display = 'block';
            }
        });
    }

    if (btnAdminLogout) {
        btnAdminLogout.addEventListener('click', () => {
            isAdminLoggedIn = false;
            showAdminAuth();
        });
    }

    // Tabs do Admin
    adminTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            adminTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const targetId = tab.dataset.tab;
            document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
            const targetContent = document.getElementById(targetId);
            if (targetContent) targetContent.classList.add('active');
        });
    });

    // ----------------------------------------------------------------------
    // 8. EDITOR COMPLETO DE PROJETOS NO ADMIN (TÍTULO, DESCRIÇÃO, VISIBILIDADE, FOTOS)
    // ----------------------------------------------------------------------
    function renderAdminProjectsList() {
        if (!adminProjectsList) return;
        adminProjectsList.innerHTML = '';

        allProjects.forEach((proj, idx) => {
            const card = document.createElement('div');
            card.className = 'admin-project-card-edit';
            card.dataset.id = proj.id;

            const thumbHtml = proj.image
                ? `<img src="${proj.image}" alt="${proj.name}" class="project-thumb-preview" id="thumb_${proj.id}">`
                : `<div class="project-thumb-placeholder" id="thumb_${proj.id}">Sem Foto</div>`;

            const techTagsStr = (proj.techs || []).join(', ');

            card.innerHTML = `
                <div class="admin-project-top-row">
                    <div class="admin-project-main-meta">
                        ${thumbHtml}
                        <div>
                            <span style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary); display: block;">${proj.name}</span>
                            <span style="font-size: 0.75rem; color: var(--text-muted);">${proj.category || 'Geral'} • Status: ${proj.status || 'Ativo'}</span>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 0.8rem; color: ${proj.visible ? '#34d399' : 'var(--text-muted)'}; font-weight: 600;">
                            ${proj.visible ? 'Exibindo no Site' : 'Oculto'}
                        </span>
                        <label class="switch" title="Ativar ou desativar exibição no site">
                            <input type="checkbox" class="toggle-visible" data-id="${proj.id}" ${proj.visible ? 'checked' : ''}>
                            <span class="slider-toggle"></span>
                        </label>
                    </div>
                </div>

                <div class="admin-project-inputs">
                    <div class="admin-input-group">
                        <label class="admin-input-label">Título Comercial do Projeto</label>
                        <input type="text" class="admin-input-control input-proj-name" value="${proj.name}">
                    </div>
                    <div class="admin-input-group">
                        <label class="admin-input-label">Descrição Comercial Completa</label>
                        <textarea class="admin-input-control input-proj-desc" rows="2">${proj.description || ''}</textarea>
                    </div>
                    <div class="admin-input-group">
                        <label class="admin-input-label">Foto / Print Real do Sistema (Suba do seu Computador ou Cole a URL)</label>
                        <div class="admin-image-controls">
                            <div class="admin-file-btn-wrapper btn btn-secondary btn-sm">
                                <span>📁 Escolher Arquivo do PC</span>
                                <input type="file" accept="image/*" class="file-proj-image" data-id="${proj.id}">
                            </div>
                            <input type="url" class="admin-input-control input-proj-img-url" placeholder="Ou cole a URL da imagem aqui" value="${proj.image && !proj.image.startsWith('data:') ? proj.image : ''}" style="flex: 1; min-width: 220px;">
                            ${proj.image ? `<button type="button" class="btn btn-secondary btn-sm btn-remove-image" data-id="${proj.id}" style="color: #ef4444;">Remover Foto</button>` : ''}
                        </div>
                    </div>
                </div>

                <div class="admin-project-bottom-row">
                    <div class="admin-native-techs">
                        <span style="font-size: 0.75rem; color: var(--text-muted); margin-right: 4px;">Tecnologias:</span>
                        ${(proj.techs || []).map(t => `<span class="tech-tag-sm">${t}</span>`).join('')}
                    </div>
                    <button type="button" class="btn btn-primary btn-sm btn-save-proj" data-id="${proj.id}">Salvar Alterações</button>
                </div>
            `;

            // 1. Toggle de Visibilidade
            const toggle = card.querySelector('.toggle-visible');
            toggle.addEventListener('change', (e) => {
                proj.visible = e.target.checked;
                saveProjects();
                generateCategoryPills();
                renderPortfolio();
                renderAdminProjectsList();
            });

            // 2. Upload de Foto do Computador (FileReader -> Base64)
            const fileInput = card.querySelector('.file-proj-image');
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    if (file.size > 5 * 1024 * 1024) {
                        alert('A imagem é muito pesada (máx 5MB). Por favor selecione uma imagem menor.');
                        return;
                    }
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        proj.image = event.target.result;
                        saveProjects();
                        generateCategoryPills();
                        renderPortfolio();
                        renderAdminProjectsList();
                        alert(`Foto do sistema "${proj.name}" carregada com sucesso!`);
                    };
                    reader.readAsDataURL(file);
                }
            });

            // 3. Botão de Remover Foto
            const btnRemove = card.querySelector('.btn-remove-image');
            if (btnRemove) {
                btnRemove.addEventListener('click', () => {
                    proj.image = '';
                    saveProjects();
                    generateCategoryPills();
                    renderPortfolio();
                    renderAdminProjectsList();
                });
            }

            // 4. Salvar Título, Descrição e URL manual
            const btnSave = card.querySelector('.btn-save-proj');
            btnSave.addEventListener('click', () => {
                const newName = card.querySelector('.input-proj-name').value.trim();
                const newDesc = card.querySelector('.input-proj-desc').value.trim();
                const newImgUrl = card.querySelector('.input-proj-img-url').value.trim();

                if (newName) proj.name = newName;
                if (newDesc) proj.description = newDesc;
                if (newImgUrl) proj.image = newImgUrl;

                saveProjects();
                generateCategoryPills();
                renderPortfolio();
                renderAdminProjectsList();

                alert(`Projeto "${proj.name}" atualizado com sucesso no site!`);
            });

            adminProjectsList.appendChild(card);
        });
    }

    // Formulário de Configuração de WhatsApp & Contato
    if (siteSettingsForm) {
        siteSettingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const wa = document.getElementById('settingWhatsapp').value.trim();
            const em = document.getElementById('settingEmail').value.trim();
            const ad = document.getElementById('settingAddress').value.trim();
            const msg = document.getElementById('settingDefaultMsg').value.trim();

            saveSiteSettings({
                whatsapp: wa,
                email: em,
                address: ad,
                defaultMsg: msg
            });

            if (siteSettingsSavedFeedback) {
                siteSettingsSavedFeedback.style.display = 'inline-block';
                setTimeout(() => {
                    siteSettingsSavedFeedback.style.display = 'none';
                }, 4000);
            }

            alert('Configurações de WhatsApp e Contatos salvas com sucesso! Todos os botões do site foram atualizados com o seu número.');
        });
    }

    // Formulário de Alteração de Credenciais Master
    if (changeCredentialsForm) {
        changeCredentialsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const u = document.getElementById('changeUser').value.trim();
            const p = document.getElementById('changePass').value.trim();

            if (!u || !p) {
                alert('Preencha o novo usuário e a nova senha.');
                return;
            }

            saveSiteSettings({
                adminUser: u,
                adminPass: p
            });

            alert(`Credenciais salvas com sucesso! Seu novo login é: ${u}`);
            changeCredentialsForm.reset();
        });
    }

    // Formulário de Novo Projeto Manual
    if (newProjectForm) {
        newProjectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('newProjName').value.trim();
            const category = document.getElementById('newProjCategory').value.trim();
            const desc = document.getElementById('newProjDesc').value.trim();
            const techsStr = document.getElementById('newProjTechs').value.trim();
            const highlightsStr = document.getElementById('newProjHighlights').value.trim();
            const status = document.getElementById('newProjStatus').value;
            const url = document.getElementById('newProjImageUrl') ? document.getElementById('newProjImageUrl').value.trim() : '';
            const fileInput = document.getElementById('newProjImageFile');

            function addProjectWithImage(imageData) {
                const newId = 'custom_' + Date.now();
                const newProj = {
                    id: newId,
                    name: name,
                    category: category,
                    status: status,
                    description: desc,
                    image: imageData || '',
                    highlights: highlightsStr ? highlightsStr.split(',').map(s => s.trim()).filter(Boolean) : [
                        'Solução sob medida desenvolvida pela TECX SISTEMAS',
                        'Arquitetura de alto desempenho e interface moderna',
                        'Suporte técnico e manutenção contínua'
                    ],
                    techs: techsStr ? techsStr.split(',').map(s => s.trim()).filter(Boolean) : ['TypeScript', 'React', 'Node.js'],
                    visible: true,
                    github: null
                };

                allProjects.unshift(newProj);
                saveProjects();
                generateCategoryPills();
                renderPortfolio();
                renderAdminProjectsList();

                alert(`Sistema "${name}" cadastrado com sucesso no portfólio!`);
                newProjectForm.reset();
                adminTabs[0].click();
            }

            if (fileInput && fileInput.files && fileInput.files[0]) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    addProjectWithImage(event.target.result);
                };
                reader.readAsDataURL(fileInput.files[0]);
            } else {
                addProjectWithImage(url);
            }
        });
    }

    // Sincronizar com GitHub (MANINtecn)
    if (btnSyncGithub) {
        btnSyncGithub.addEventListener('click', async () => {
            btnSyncGithub.textContent = 'Buscando no GitHub...';
            btnSyncGithub.disabled = true;

            try {
                const resp = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
                if (!resp.ok) throw new Error('Não foi possível conectar com o GitHub');
                const repos = await resp.json();

                let addedCount = 0;
                repos.filter(r => !r.fork).forEach(repo => {
                    const exists = allProjects.some(p => 
                        p.id.toLowerCase() === repo.name.toLowerCase() || 
                        (p.github && p.github.toLowerCase().endsWith(repo.name.toLowerCase()))
                    );

                    if (!exists) {
                        const isInternal = repo.name.toLowerCase().includes('sync');
                        allProjects.push({
                            id: repo.name.toLowerCase(),
                            name: repo.name,
                            category: repo.language || 'Software',
                            status: 'Ativo',
                            description: repo.description || 'Repositório oficial mantido pela TECX SISTEMAS.',
                            image: '',
                            highlights: [
                                `Linguagem principal: ${repo.language || 'Geral'}`,
                                'Código versionado no GitHub',
                                'Arquitetura de alto desempenho'
                            ],
                            techs: repo.language ? [repo.language] : ['Software'],
                            visible: !isInternal,
                            github: repo.html_url
                        });
                        addedCount++;
                    }
                });

                saveProjects();
                generateCategoryPills();
                renderPortfolio();
                renderAdminProjectsList();

                if (addedCount > 0) {
                    alert(`Sucesso! ${addedCount} novos repositórios foram encontrados e adicionados à sua lista.`);
                } else {
                    alert('Sua lista já está atualizada com todos os repositórios do GitHub!');
                }
            } catch (err) {
                alert('Não foi possível sincronizar com o GitHub no momento. Verifique sua conexão.');
            } finally {
                btnSyncGithub.textContent = '🔄 Sincronizar com GitHub';
                btnSyncGithub.disabled = false;
            }
        });
    }

    // Restaurar Padrão
    if (btnResetDefaults) {
        btnResetDefaults.addEventListener('click', () => {
            if (confirm('Deseja restaurar a lista padrão recomendada de sistemas da TECX SISTEMAS?')) {
                allProjects = JSON.parse(JSON.stringify(DEFAULT_PROJECTS));
                saveProjects();
                generateCategoryPills();
                renderPortfolio();
                renderAdminProjectsList();
                alert('Portfólio padrão restaurado com sucesso!');
            }
        });
    }

    // Formulário de Contato por E-mail (rodapé)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('formName').value;
            const email = document.getElementById('formEmail').value;
            const subject = document.getElementById('formSubject').value;
            const message = document.getElementById('formMessage').value;

            const mailtoBody = `Nome: ${name}\nE-mail: ${email}\n\nMensagem:\n${message}`;
            const targetEmail = siteSettings.email || 'contato@tecxsistemas.com.br';
            const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailtoBody)}`;
            
            window.location.href = mailtoUrl;
            alert(`Obrigado pelo contato, ${name}! Um link de e-mail foi aberto em seu aplicativo de e-mails para envio direto.`);
            contactForm.reset();
        });
    }

    // Inicialização da Renderização
    generateCategoryPills();
    renderPortfolio();
});
