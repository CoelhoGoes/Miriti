import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PRODUCTS } from '../../data/products';
import { useStrings, useLanguage } from '../../i18n/index.js';
import styles from './EventCard.module.css';

const modalVariants = {
    initial: { y: '100%', rotate: -3, opacity: 0 },
    animate: {
        y: 0,
        rotate: 0,
        opacity: 1,
        transition: { type: 'spring', damping: 18, stiffness: 200 },
    },
    exit: {
        y: '100%',
        opacity: 0,
        transition: { duration: 0.25 },
    },
};

export default function EventCard({ event, onClose }) {
    const s = useStrings();
    const lang = useLanguage();
    const t = (obj) => (obj && typeof obj === 'object') ? (obj[lang] ?? obj.pt) : obj;
    const [showTip, setShowTip] = useState(false);
    const [tipText, setTipText] = useState('');

    const productById = useMemo(() => {
        const map = {};
        PRODUCTS.forEach((product) => {
            map[product.id] = product;
        });
        return map;
    }, []);

    useEffect(() => {
        if (!showTip) return undefined;
        const timeout = setTimeout(() => {
            setShowTip(false);
            setTipText('');
        }, 4000);
        return () => clearTimeout(timeout);
    }, [showTip]);

    const handleClose = () => {
        if (event?.educationalTip) {
            setTipText(t(event.educationalTip));
            setShowTip(true);
        }
        onClose();
    };

    return (
        <>
            <AnimatePresence>
                {event && (
                    <motion.div
                        className={styles.overlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className={styles.modal}
                            variants={modalVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <motion.div
                                className={styles.bigEmoji}
                                animate={{ scale: [0.8, 1.1, 1] }}
                                transition={{ duration: 0.55 }}
                                aria-hidden="true"
                            >
                                {event.emoji}
                            </motion.div>

                            <h2 className={styles.title}>{t(event.title)}</h2>
                            <p className={styles.description}>{t(event.description)}</p>

                            <section className={styles.effectsSection}>
                                <h3 className={styles.effectsTitle}>{s.feirinha.whatChanges}</h3>
                                <div className={styles.effectsList}>
                                    {event.effects.map((effect, index) => {
                                        const product = productById[effect.productId];
                                        const positive = effect.delta > 0;
                                        return (
                                            <div
                                                key={`${effect.productId}-${index}`}
                                                className={styles.effectRow}
                                            >
                                                <span className={styles.effectName}>
                                                    {product?.emoji || '🧺'} {t(product?.name) || effect.productId}
                                                </span>
                                                <span
                                                    className={positive ? styles.deltaUp : styles.deltaDown}
                                                >
                                                    {positive ? '+' : ''}{effect.delta} {s.feirinha.coins}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            <motion.button
                                type="button"
                                className={styles.closeButton}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleClose}
                            >
                                {s.feirinha.understood}
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showTip && tipText && (
                    <motion.div
                        className={styles.tipBubble}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 16 }}
                        transition={{ duration: 0.28 }}
                    >
                        <span className={styles.tipEmoji} aria-hidden="true">💬</span>
                        <p>{tipText}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
