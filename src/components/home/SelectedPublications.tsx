'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Publication } from '@/types/publication';
import { useMessages } from '@/lib/i18n/useMessages';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
    enableOnePageMode?: boolean;
}

function isFirstAuthor(pub: Publication): boolean {
    return pub.authors.some(a => a.isHighlighted && (a.isMainAuthor || a.isCorresponding || a.name.includes('Yingxue Xu')));
}

export default function SelectedPublications({ publications, title, enableOnePageMode = false }: SelectedPublicationsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.selectedPublications;

    const journalPubs = publications.filter(p => p.journal).sort((a, b) => {
        const aFirst = isFirstAuthor(a) ? 0 : 1;
        const bFirst = isFirstAuthor(b) ? 0 : 1;
        if (aFirst !== bFirst) return aFirst - bFirst;
        return b.year - a.year;
    });

    const conferencePubs = publications.filter(p => p.conference).sort((a, b) => {
        const aFirst = isFirstAuthor(a) ? 0 : 1;
        const bFirst = isFirstAuthor(b) ? 0 : 1;
        if (aFirst !== bFirst) return aFirst - bFirst;
        return b.year - a.year;
    });

    const preprintPubs = publications.filter(p => !p.journal && !p.conference).sort((a, b) => {
        const aFirst = isFirstAuthor(a) ? 0 : 1;
        const bFirst = isFirstAuthor(b) ? 0 : 1;
        if (aFirst !== bFirst) return aFirst - bFirst;
        return b.year - a.year;
    });

    const getPaperLink = (pub: Publication): string | undefined => {
        if (pub.url) return pub.url;
        if (pub.doi) return `https://doi.org/${pub.doi}`;
        if (pub.arxivId) return `https://arxiv.org/abs/${pub.arxivId}`;
        return undefined;
    };

    const renderPublication = (pub: Publication, index: number) => {
        const paperLink = getPaperLink(pub);

        return (
            <motion.div
                key={pub.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg shadow-sm border border-neutral-200 dark:border-[rgba(148,163,184,0.24)] hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
            >
                <div className="flex gap-4">
                    {pub.preview && (
                        <div className="w-32 h-24 flex-shrink-0 relative rounded-lg overflow-hidden bg-neutral-200">
                            <Image
                                src={`/images/${pub.preview}`}
                                alt={pub.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-primary mb-2 leading-tight">
                            {paperLink ? (
                                <a
                                    href={paperLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-accent transition-colors"
                                >
                                    {pub.title}
                                </a>
                            ) : (
                                pub.title
                            )}
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-500 mb-1">
                            {pub.authors.map((author, idx) => (
                                <span key={idx}>
                                    <span className={`${author.isHighlighted ? 'font-semibold text-accent' : ''} ${author.isCoAuthor ? `underline underline-offset-4 ${author.isHighlighted ? 'decoration-accent' : 'decoration-neutral-400'}` : ''}`}>
                                        {author.name}
                                    </span>
                                    {author.isMainAuthor && (
                                        <sup className={`ml-0 ${author.isHighlighted ? 'text-accent' : 'text-neutral-600 dark:text-neutral-500'}`}>^</sup>
                                    )}
                                    {author.isCorresponding && (
                                        <sup className={`ml-0 ${author.isHighlighted ? 'text-accent' : 'text-neutral-600 dark:text-neutral-500'}`}>*</sup>
                                    )}
                                    {idx < pub.authors.length - 1 && ', '}
                                </span>
                            ))}
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-500 mb-2">
                            {(pub.journal || pub.conference) && (
                                <span className="italic">
                                    {pub.journal || pub.conference}{pub.year && `, ${pub.year}`}
                                </span>
                            )}
                            {pub.description && <span className="text-accent"> {pub.description}</span>}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {pub.url && (
                                <a
                                    href={pub.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors"
                                >
                                    Paper
                                </a>
                            )}
                            {pub.code && (
                                <a
                                    href={pub.code}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors"
                                >
                                    Code
                                </a>
                            )}
                            {pub.weights && (
                                <a
                                    href={pub.weights}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors"
                                >
                                    Weights
                                </a>
                            )}
                            {pub.benchmark && (
                                <a
                                    href={pub.benchmark}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors"
                                >
                                    Benchmark
                                </a>
                            )}
                            {pub.demo && (
                                <a
                                    href={pub.demo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors"
                                >
                                    Demo
                                </a>
                            )}
                            {pub.pdfUrl && (
                                <a
                                    href={pub.pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors"
                                >
                                    PDF
                                </a>
                            )}
                            {pub.doi && (
                                <a
                                    href={`https://doi.org/${pub.doi}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors"
                                >
                                    DOI
                                </a>
                            )}
                            {pub.eprint && !pub.arxivId && (
                                <a
                                    href={`https://arxiv.org/abs/${pub.eprint.replace('arXiv:', '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors"
                                >
                                    arXiv
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-serif font-bold text-primary">{resolvedTitle}</h2>
                <Link
                    href={enableOnePageMode ? "/#publications" : "/publications"}
                    prefetch={true}
                    className="text-accent hover:text-accent-dark text-sm font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                >
                    {messages.home.viewAll} →
                </Link>
            </div>

            {conferencePubs.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-primary mb-3">Conference Papers</h3>
                    <div className="space-y-4">
                        {conferencePubs.map((pub, idx) => renderPublication(pub, idx))}
                    </div>
                </div>
            )}

            {journalPubs.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-primary mb-3">Journal Papers</h3>
                    <div className="space-y-4">
                        {journalPubs.map((pub, idx) => renderPublication(pub, idx + conferencePubs.length))}
                    </div>
                </div>
            )}

            {preprintPubs.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-primary mb-3">Preprints</h3>
                    <div className="space-y-4">
                        {preprintPubs.map((pub, idx) => renderPublication(pub, idx + conferencePubs.length + journalPubs.length))}
                    </div>
                </div>
            )}
        </motion.section>
    );
}
