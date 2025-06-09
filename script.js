// ---- Prompts DATA ----
    const PROMPTS = [
      {
        id: 1,
        title: "Optimisation SEO pour articles de blog",
        prompt: "Analyse cet article et suggère des améliorations SEO concrètes, en détaillant pour chaque point (structure, mots-clés, méta-descriptions, lisibilité) :",
        category: "SEO",
        tags: ["SEO", "article", "optimisation"]
      },
      {
        id: 2,
        title: "Création de script vidéo accrocheur",
        prompt: "Rédige un script YouTube de 3 minutes sur [thème], avec une introduction percutante, une structure logique et un appel à l'action final.",
        category: "YouTube",
        tags: ["YouTube", "script", "vidéo"]
      },
      {
        id: 3,
        title: "Générateur de carrousel LinkedIn",
        prompt: "Donne-moi 5 idées de carrousels LinkedIn pour [secteur], avec un titre accrocheur pour chaque slide et une accroche finale.",
        category: "Social Media",
        tags: ["LinkedIn", "carrousel", "content"]
      },
      {
        id: 4,
        title: "Automatisation de veille concurrentielle",
        prompt: "Propose un flux de travail automatisé pour surveiller les concurrents dans [secteur], incluant outils à intégrer et alertes automatisées.",
        category: "Automatisation",
        tags: ["veille", "automatisation", "workflow"]
      },
      {
        id: 5,
        title: "Résumé automatique d’e-mails",
        prompt: "Synthétise ce mail en 3 points clés avec une tonalité professionnelle, prêt à être transféré à un collègue.",
        category: "Automatisation",
        tags: ["email", "résumé", "automatisation"]
      },
      {
        id: 6,
        title: "Titre d’article optimisé pour le SEO",
        prompt: "Suggère 5 titres optimisés SEO pour cet article, en intégrant les mots-clés principaux et une promesse forte.",
        category: "SEO",
        tags: ["SEO", "titre", "copywriting"]
      },
      {
        id: 7,
        title: "Checklist publication YouTube",
        prompt: "Dresse la checklist complète à suivre avant de publier une vidéo sur YouTube pour maximiser la portée organique.",
        category: "YouTube",
        tags: ["YouTube", "checklist", "publication"]
      },
      {
        id: 8,
        title: "Post LinkedIn viral",
        prompt: "Rédige un post LinkedIn prêt à devenir viral sur [sujet], en misant sur l’émotion et l’engagement.",
        category: "Social Media",
        tags: ["LinkedIn", "post", "viral"]
      },
      {
        id: 9,
        title: "Prompt ChatGPT pour génération de formulaires",
        prompt: "Propose un prompt pour générer un formulaire web efficace sur [sujet], en prenant en compte UX et validation.",
        category: "Automatisation",
        tags: ["formulaire", "ChatGPT", "UX"]
      },
      {
        id: 10,
        title: "Transcription automatique de meeting vidéo",
        prompt: "Génère une transcription claire et résumée de cette réunion vidéo, avec une liste des décisions et actions à suivre.",
        category: "Automatisation",
        tags: ["transcription", "meeting", "automatisation"]
      },
      {
        id: 11,
        title: "Analyse de chaîne YouTube concurrente",
        prompt: "Analyse cette chaîne YouTube : synthétise ses points forts/faibles, stratégies de contenu, fréquence idéale et opportunités à saisir.",
        category: "YouTube",
        tags: ["YouTube", "analyse", "concurrents"]
      },
      {
        id: 12,
        title: "Suggestions de hooks pour posts LinkedIn",
        prompt: "Donne-moi 7 hooks d’introduction irrésistibles pour un post LinkedIn sur [thématique].",
        category: "Social Media",
        tags: ["LinkedIn", "hook", "copywriting"]
      }
    ];

    // ------ Get unique tags ------
    function getAllTags() {
      const tags = new Set();
      PROMPTS.forEach(p => p.tags.forEach(tag => tags.add(tag)));
      return Array.from(tags).sort((a, b) => a.localeCompare(b,"fr",{sensitivity:'base'}));
    }

    // ------ Get unique categories ------
    function getAllCategories() {
      const cats = new Set();
      PROMPTS.forEach(p => cats.add(p.category));
      return Array.from(cats).sort((a, b) => a.localeCompare(b,"fr",{sensitivity:'base'}));
    }

    // ------ State ------
    let state = {
      search: "",
      tag: null,
    };

    // ------ Render Tags Filter ------
    function renderTagsFilter() {
      const allTags = getAllTags();
      const tagsFilter = document.getElementById("tagsFilter");
      tagsFilter.innerHTML = '';
      const btnAll = document.createElement('button');
      btnAll.className = 'tag-btn' + (state.tag === null ? ' selected' : '');
      btnAll.textContent = 'Tous les tags';
      btnAll.onclick = ()=>{state.tag=null;renderAll();};
      tagsFilter.appendChild(btnAll);

      allTags.forEach(tag => {
        const btn = document.createElement('button');
        btn.className = 'tag-btn' + (state.tag === tag ? ' selected' : '');
        btn.textContent = tag;
        btn.onclick = ()=>{state.tag=tag;renderAll();};
        tagsFilter.appendChild(btn);
      });
    }

    // ------ Filter & Render Prompts ------
    function filterPrompts() {
      let prompts = PROMPTS;
      if (state.tag) {
        prompts = prompts.filter(p=>p.tags.includes(state.tag));
      }
      if (state.search.trim()!=="") {
        const q = state.search.trim().toLowerCase();
        prompts = prompts.filter(p=>
          p.title.toLowerCase().includes(q) ||
          p.prompt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some(tag=>tag.toLowerCase().includes(q))
        );
      }
      return prompts;
    }

    function groupByCategory(prompts) {
      const group = {};
      prompts.forEach(p=>{
        if (!group[p.category]) group[p.category]=[];
        group[p.category].push(p);
      });
      return group;
    }

    function highlight(txt, query) {
      if (!query) return txt;
      const escQ = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return txt.replace(new RegExp(`(${escQ})`,'gi'),"<mark>$1</mark>");
    }

    function renderAll() {
      renderTagsFilter();
      const area = document.getElementById("promptsArea");
      const searchQuery = state.search.trim();
      const filtered = filterPrompts();
      if(filtered.length===0) {
        area.innerHTML = '<div class="no-result">Aucun prompt ne correspond à vos critères.</div>';
        return;
      }
      const grouped = groupByCategory(filtered);

      // Content
      let html = '';
      Object.entries(grouped).forEach(([cat, prompts])=>{
        html += `<section class="category-group"><div class="category-title">${cat}</div><div class="prompts-list">`;
        prompts.forEach(p=>{
          html += `<div class="prompt-card">` +
            `<div class="prompt-title">${highlight(p.title, searchQuery)}</div>` +
            `<div class="prompt-text">${highlight(p.prompt, searchQuery)}</div>` +
            `<div class="prompt-tags">` +
            p.tags.map(tag=>`<button class="prompt-tag" onclick="selectTag('${tag}')">${tag}</button>`).join('') +
            `</div>` +
          `</div>`;
        });
        html += `</div></section>`;
      });
      area.innerHTML = html;
    }

    // ---- Tag click from prompt card ------
    window.selectTag = function(tag) {
      state.tag = tag;
      document.getElementById('searchInput').blur(); // UX: close keyb on mobile
      renderAll();
      window.scrollTo({top: 0, behavior: "smooth"});
    }

    // ----- Search ------
    document.getElementById("searchInput").addEventListener("input", e=>{
      state.search = e.target.value;
      renderAll();
    });

    // ---- First render -----
    renderAll();