'use client';

import { motion } from 'framer-motion';
import { useMessages } from '@/lib/i18n/useMessages';

export interface NewsItem {
    date: string;
    content: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
}

function formatContent(content: string) {
    const venuePattern = /(Nature Communications|Nature Biomedical Engineering|The Innovation Informatics|IEEE Transactions on Medical Imaging|CVPR|MICCAI|ICLR|ICCV|TCSVT)/g;
    const parts = content.split(venuePattern);
    
    return parts.map((part, i) => {
        if (venuePattern.test(part)) {
            return <strong key={i} className="italic font-bold">{part}</strong>;
        }
        return part;
    });
}

export default function News({ items, title }: NewsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.news;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">{resolvedTitle}</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {items.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                        <span className="text-xs text-neutral-500 mt-1 w-16 flex-shrink-0">{item.date}</span>
                        <p className="text-sm text-neutral-700">{formatContent(item.content)}</p>
                    </div>
                ))}
            </div>
        </motion.section>
    );
}
