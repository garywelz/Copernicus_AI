"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESEARCH_SOURCES = void 0;
exports.RESEARCH_SOURCES = [
    // Primary Sources (Working APIs)
    {
        id: 'nasa_ads',
        name: 'NASA ADS',
        baseUrl: 'https://api.adsabs.harvard.edu/v1/',
        type: 'API',
        category: 'SCIENCE',
        requiresAuth: true,
        rateLimit: 1000,
        priority: 1,
        fields: ['astronomy', 'physics', 'space_science']
    },
    {
        id: 'zenodo',
        name: 'Zenodo',
        baseUrl: 'https://zenodo.org/api/v1/',
        type: 'API',
        category: 'MULTIDISCIPLINARY',
        requiresAuth: true,
        rateLimit: 1000,
        priority: 1,
        fields: ['all']
    },
    // No-Auth Sources (Always Available)
    {
        id: 'arxiv',
        name: 'arXiv',
        baseUrl: 'https://arxiv.org/api/',
        type: 'API',
        category: 'SCIENCE',
        requiresAuth: false,
        rateLimit: 1000,
        priority: 1,
        fields: ['physics', 'mathematics', 'computer_science', 'biology']
    },
    {
        id: 'pubmed_central',
        name: 'PubMed Central',
        baseUrl: 'https://www.ncbi.nlm.nih.gov/pmc/tools/openftlist/',
        type: 'OPEN_ACCESS',
        category: 'MEDICINE',
        requiresAuth: false,
        priority: 1,
        fields: ['medicine', 'biology', 'health']
    },
    {
        id: 'doaj',
        name: 'Directory of Open Access Journals',
        baseUrl: 'https://doaj.org/api/v2/',
        type: 'API',
        category: 'MULTIDISCIPLINARY',
        requiresAuth: false,
        rateLimit: 2000,
        priority: 1,
        fields: ['science', 'medicine', 'technology', 'humanities']
    },
    // Pending Setup
    {
        id: 'figshare',
        name: 'Figshare',
        baseUrl: 'https://api.figshare.com/v2/',
        type: 'API',
        category: 'MULTIDISCIPLINARY',
        requiresAuth: true,
        rateLimit: 1000,
        priority: 2,
        fields: ['all']
    },
    // Temporarily Unavailable
    {
        id: 'core',
        name: 'CORE',
        baseUrl: 'https://core.ac.uk/api/v3/',
        type: 'API',
        category: 'MULTIDISCIPLINARY',
        requiresAuth: true,
        rateLimit: 1000,
        priority: 3,
        fields: ['all']
    },
    {
        id: 'plos',
        name: 'PLOS',
        baseUrl: 'https://api.plos.org/v2/',
        type: 'API',
        category: 'SCIENCE',
        requiresAuth: true,
        rateLimit: 1000,
        priority: 3,
        fields: ['biology', 'medicine', 'genetics']
    },
    // Social Sciences and Humanities
    {
        id: 'ssrn',
        name: 'Social Science Research Network',
        baseUrl: 'https://www.ssrn.com/index.cfm/en/',
        type: 'OPEN_ACCESS',
        category: 'SOCIAL_SCIENCE',
        requiresAuth: false,
        fields: ['economics', 'law', 'social_sciences']
    },
    {
        id: 'jstor',
        name: 'JSTOR Open Content',
        baseUrl: 'https://www.jstor.org/open/',
        type: 'OPEN_ACCESS',
        category: 'HUMANITIES',
        requiresAuth: false,
        fields: ['history', 'literature', 'arts']
    },
    {
        id: 'internet_archive_scholar',
        name: 'Internet Archive Scholar',
        baseUrl: 'https://scholar.archive.org/',
        type: 'OPEN_ACCESS',
        category: 'MULTIDISCIPLINARY',
        requiresAuth: false,
        fields: ['all']
    },
    // Technology and Computer Science
    {
        id: 'dblp',
        name: 'DBLP Computer Science Bibliography',
        baseUrl: 'https://dblp.org/xml/',
        type: 'OPEN_ACCESS',
        category: 'TECHNOLOGY',
        requiresAuth: false,
        fields: ['computer_science']
    },
    {
        id: 'ieee_open',
        name: 'IEEE Open Access',
        baseUrl: 'https://open.ieee.org/',
        type: 'OPEN_ACCESS',
        category: 'TECHNOLOGY',
        requiresAuth: false,
        fields: ['engineering', 'computer_science', 'electronics']
    },
    // Preprint Servers
    {
        id: 'biorxiv',
        name: 'bioRxiv',
        baseUrl: 'https://www.biorxiv.org/',
        type: 'PREPRINT',
        category: 'SCIENCE',
        requiresAuth: false,
        fields: ['biology', 'life_sciences']
    },
    {
        id: 'medrxiv',
        name: 'medRxiv',
        baseUrl: 'https://www.medrxiv.org/',
        type: 'PREPRINT',
        category: 'MEDICINE',
        requiresAuth: false,
        fields: ['medicine', 'health_sciences']
    },
    {
        id: 'eric',
        name: 'Education Resources Information Center',
        baseUrl: 'https://eric.ed.gov/',
        type: 'OPEN_ACCESS',
        category: 'EDUCATION',
        requiresAuth: false,
        fields: ['education', 'teaching', 'learning']
    }
];
//# sourceMappingURL=sources.js.map