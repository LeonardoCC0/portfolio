// Inicializar ícones Lucide
lucide.createIcons();

// Configurações Iniciais
const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');
const langToggle = document.getElementById('langToggle');
const langText = document.getElementById('langText');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

// Conteúdo de Tradução
const translations = {
    pt: {
        nav: { about: "Sobre", skills: "Habilidades", experience: "Experiência", projects: "Projetos", goals: "Objetivos", contact: "Contato" },
        hero: {
            title: "Software Engineer in Progress",
            subtitle: "Aspirante a Engenheiro de Software focado em Full Stack Development, Inteligência Artificial e DevOps.",
            viewProjects: "Ver Projetos",
            contact: "Entrar em Contato",
            downloadCV: "Download CV",
        },
        about: { title: "Sobre Mim", text: "Sou Leonardo, tenho 16 anos e estou construindo minha trajetória para me tornar Engenheiro de Software. Sou uma pessoa proativa, responsável e comprometida com aprendizado contínuo. Tenho paixão por tecnologia, resolução de problemas e desenvolvimento de soluções que impactam positivamente a vida das pessoas. Meu objetivo é cursar uma universidade nos Estados Unidos e construir uma carreira sólida na área de tecnologia." },
        skills: { title: "Habilidades", fullStack: "Full Stack", ai: "Inteligência Artificial", devops: "DevOps", ml: "Machine Learning Fundamentals", aiSol: "AI Solutions", problem: "Problem Solving", cicd: "CI/CD Concepts", deploy: "Deployment Concepts" },
        experience: {
            title: "Experiência Profissional",
            role: "Assistente Administrativo e de Treinamentos",
            tasksTitle: "Responsabilidades",
            task1: "Organização de planilhas de frota e controle de banco de horas.",
            task2: "Auxílio em treinamentos de segurança NR-23, NR-33 e NR-35.",
            task3: "Suporte operacional e fiscalização do uso correto de EPIs.",
            resultsTitle: "Resultados",
            result1: "Melhor organização dos controles administrativos.",
            result2: "Apoio eficiente aos treinamentos e maior atenção à segurança."
        },
        project: { title: "Projeto em Destaque", description: "Plataforma de suporte técnico remoto e presencial que conecta clientes a profissionais especializados. O sistema permite que o usuário utilize uma IA para resolução inicial de problemas ou contrate um especialista para atendimento personalizado.", tech: "Tecnologias", viewCode: "Ver no GitHub" },
        education: { title: "Formação", degree: "Ensino Médio Técnico em TI", conclusion: "Conclusão: 2027", certs: "Certificações", cert1: "Lógica de Programação com JavaScript", langs: "Idiomas", lang1: "Português (Nativo)", lang2: "Inglês (B2)", lang3: "Espanhol (Básico)" },
        goals: { title: "Future Goals", text: "Busco oportunidades para desenvolver Engenharia de Software e Inteligência Artificial, com o objetivo de estudar nos Estados Unidos e contribuir para projetos de impacto global." },
        contact: { title: "Contato", subtitle: "Me envie um e-mail para oportunidades e parcerias." }
    },
    en: {
        nav: { about: "About", skills: "Skills", experience: "Experience", projects: "Projects", goals: "Goals", contact: "Contact" },
        hero: {
            title: "Software Engineer in Progress",
            subtitle: "Aspiring Software Engineer focused on Full Stack Development, Artificial Intelligence and DevOps.",
            viewProjects: "View Projects",
            contact: "Get in Touch",
            downloadCV: "Download CV",
        },
        about: { title: "About Me", text: "I am Leonardo, 16 years old, building my path to becoming a Software Engineer. I am proactive, responsible, and committed to continuous learning. I am passionate about technology, problem-solving, and developing solutions that positively impact people's lives. My goal is to attend a university in the United States and build a solid career in technology." },
        skills: { title: "Skills", fullStack: "Full Stack", ai: "Artificial Intelligence", devops: "DevOps", ml: "Machine Learning Fundamentals", aiSol: "AI Solutions", problem: "Problem Solving", cicd: "CI/CD Concepts", deploy: "Deployment Concepts" },
        experience: {
            title: "Professional Experience",
            role: "Administrative and Training Assistant",
            tasksTitle: "Responsibilities",
            task1: "Organized fleet spreadsheets and time bank control.",
            task2: "Assisted in NR-23, NR-33, and NR-35 safety training.",
            task3: "Provided operational support and enforced proper PPE usage.",
            resultsTitle: "Key Results",
            result1: "Improved administrative control organization.",
            result2: "Efficient training support and increased safety awareness."
        },
        project: { title: "Featured Project", description: "Remote and on-site technical support platform connecting clients to specialized professionals. The system allows users to leverage AI for initial problem resolution or hire a specialist for personalized assistance.", tech: "Technologies", viewCode: "View on GitHub" },
        education: { title: "Education", degree: "High School Tech in IT", conclusion: "Expected: 2027", certs: "Certifications", cert1: "Programming Logic with JavaScript", langs: "Languages", lang1: "Portuguese (Native)", lang2: "English (B2)", lang3: "Spanish (Basic)" },
        goals: { title: "Future Goals", text: "I seek opportunities to develop Software Engineering and Artificial Intelligence, aiming to study in the United States and contribute to global impact projects." },
        contact: { title: "Contact", subtitle: "Send me an email for opportunities and partnerships." }
    }
};

let currentLang = 'pt';

// Funções de Tema
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    if (theme === 'dark') {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    } else {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    }
}

// Inicializar Tema
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// Funções de Idioma
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    langText.textContent = lang === 'pt' ? 'EN' : 'PT';
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';

    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n').split('.');
        let value = translations[lang];
        
        for (const k of key) {
            value = value[k];
        }
        
        if (value) el.textContent = value;
    });
}

// Inicializar Idioma
const savedLang = localStorage.getItem('lang') || 'pt';
setLanguage(savedLang);

langToggle.addEventListener('click', () => {
    setLanguage(currentLang === 'pt' ? 'en' : 'pt');
});

// Menu Mobile
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Fechar menu ao clicar em link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Animação de Scroll (Reveal)
const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => {
    observer.observe(el);
});

// Atualizar ano no footer
document.getElementById('year').textContent = new Date().getFullYear();