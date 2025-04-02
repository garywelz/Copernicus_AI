"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCitation = formatCitation;
function formatAuthors(authors, style) {
    switch (style) {
        case 'APA':
            if (authors.length === 1)
                return authors[0];
            if (authors.length === 2)
                return `${authors[0]} & ${authors[1]}`;
            return `${authors[0]} et al.`;
        case 'MLA':
            if (authors.length === 1)
                return authors[0];
            if (authors.length === 2)
                return `${authors[0]} and ${authors[1]}`;
            return `${authors[0]} et al.`;
        case 'Chicago':
            if (authors.length === 1)
                return authors[0];
            if (authors.length === 2)
                return `${authors[0]} and ${authors[1]}`;
            return `${authors[0]} et al.`;
        case 'IEEE':
            return authors.join(', ');
        default:
            return authors.join(', ');
    }
}
function formatDate(date, style) {
    const d = new Date(date);
    const year = d.getFullYear();
    switch (style) {
        case 'APA':
            return `(${year})`;
        case 'MLA':
            return year.toString();
        case 'Chicago':
            return year.toString();
        case 'IEEE':
            return year.toString();
        default:
            return year.toString();
    }
}
function formatTitle(title, style) {
    switch (style) {
        case 'APA':
            return title;
        case 'MLA':
            return `"${title}"`;
        case 'Chicago':
            return `"${title}"`;
        case 'IEEE':
            return `"${title}"`;
        default:
            return title;
    }
}
function formatJournal(journal, style) {
    switch (style) {
        case 'APA':
            return journal;
        case 'MLA':
            return journal;
        case 'Chicago':
            return journal;
        case 'IEEE':
            return journal;
        default:
            return journal;
    }
}
function formatDOI(doi, style) {
    switch (style) {
        case 'APA':
            return `https://doi.org/${doi}`;
        case 'MLA':
            return `https://doi.org/${doi}`;
        case 'Chicago':
            return `https://doi.org/${doi}`;
        case 'IEEE':
            return `https://doi.org/${doi}`;
        default:
            return `https://doi.org/${doi}`;
    }
}
function formatCitation(paper, config) {
    const { authors, title, journal, publicationDate, doi } = paper;
    const formattedAuthors = formatAuthors(authors, config.style);
    const formattedDate = formatDate(publicationDate, config.style);
    const formattedTitle = formatTitle(title, config.style);
    const formattedJournal = formatJournal(journal, config.style);
    const formattedDOI = config.includeDOI && doi ? formatDOI(doi, config.style) : '';
    switch (config.style) {
        case 'APA':
            return `${formattedAuthors}. ${formattedDate}. ${formattedTitle}. ${formattedJournal}.${formattedDOI ? ` ${formattedDOI}` : ''}`;
        case 'MLA':
            return `${formattedAuthors}. ${formattedTitle}. ${formattedJournal}, ${formattedDate}${formattedDOI ? `, ${formattedDOI}` : ''}`;
        case 'Chicago':
            return `${formattedAuthors}. ${formattedTitle}. ${formattedJournal} ${formattedDate}${formattedDOI ? `. ${formattedDOI}` : ''}`;
        case 'IEEE':
            return `${formattedAuthors}, ${formattedTitle}, ${formattedJournal}, ${formattedDate}${formattedDOI ? `, ${formattedDOI}` : ''}`;
        default:
            return `${formattedAuthors} - ${formattedTitle}`;
    }
}
//# sourceMappingURL=citationFormatter.js.map