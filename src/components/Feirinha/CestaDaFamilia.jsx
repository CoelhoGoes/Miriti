import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PRODUCTS } from '../../data/products';
import { useStrings, useLanguage } from '../../i18n/index.js';
import styles from './CestaDaFamilia.module.css';

const miniModalVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
};

const SLOT_IDS = ['slot-1', 'slot-2', 'slot-3', 'slot-4', 'slot-5', 'slot-6', 'slot-7', 'slot-8'];

function getDifferenceClass(diff) {
    if (diff > 0) return styles.positive;
    if (diff < 0) return styles.negative;
    return styles.neutral;
}

export default function CestaDaFamilia({ basket, marketPrices, round, onSell }) {
    const s = useStrings();
    const lang = useLanguage();
    const t = (obj) => (obj && typeof obj === 'object') ? (obj[lang] ?? obj.pt) : obj;
    const [selectedProductId, setSelectedProductId] = useState(null);

    const productsById = useMemo(() => {
        const map = {};
        PRODUCTS.forEach((product) => {
            map[product.id] = product;
        });
        return map;
    }, []);

    const normalizedBasket = Array.isArray(basket) ? basket : [];
    const filledSlots = normalizedBasket.slice(0, 8);

    const selectedSlot = filledSlots.find((slot) => slot.productId === selectedProductId) || null;
    const selectedProduct = selectedSlot ? productsById[selectedSlot.productId] : null;

    const totalInvestido = filledSlots.reduce(
        (acc, slot) => acc + (slot.boughtAt * slot.quantity),
        0
    );
    const valorAtual = filledSlots.reduce(
        (acc, slot) => acc + ((marketPrices[slot.productId] || 0) * slot.quantity),
        0
    );
    const diferenca = valorAtual - totalInvestido;

    const precoAtualSelecionado = selectedSlot
        ? (marketPrices[selectedSlot.productId] || 0)
        : 0;
    const lucroUnidade = selectedSlot ? (precoAtualSelecionado - selectedSlot.boughtAt) : 0;

    const roundsHeld = selectedSlot ? (round - selectedSlot.roundBought) : 0;
    const cooldownAtivo = Boolean(
        selectedSlot
        && selectedProduct?.hasCooldown
        && roundsHeld < selectedProduct.cooldownRounds
    );
    const roundsRestantes = cooldownAtivo ? (selectedProduct.cooldownRounds - roundsHeld) : 0;

    return (
        <section className={styles.wrapper}>
            <h3 className={styles.title}>{s.feirinha.basketTitle}</h3>

            <div className={styles.grid}>
                {SLOT_IDS.map((slotId, position) => {
                    const slot = filledSlots[position];
                    if (!slot) {
                        return <div key={slotId} className={styles.slotEmpty} aria-hidden="true">+</div>;
                    }
                    const product = productsById[slot.productId];
                    return (
                        <motion.button
                            key={slotId}
                            type="button"
                            className={styles.slotFilled}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedProductId(slot.productId)}
                        >
                            <span className={styles.slotEmoji} aria-hidden="true">{product?.emoji || '🧺'}</span>
                            <span className={styles.qtyBadge}>x{slot.quantity}</span>
                        </motion.button>
                    );
                })}
            </div>

            <div className={styles.footer}>
                <div className={styles.line}>
                    <span>{s.feirinha.totalInvested}</span>
                    <strong>{totalInvestido} {s.feirinha.coins}</strong>
                </div>
                <div className={styles.line}>
                    <span>{s.feirinha.currentValue}</span>
                    <strong>{valorAtual} {s.feirinha.coins}</strong>
                </div>
                <div className={styles.line}>
                    <span>{s.feirinha.difference}</span>
                    <strong className={getDifferenceClass(diferenca)}>
                        {diferenca > 0 ? '+' : ''}{diferenca} {s.feirinha.coins}
                    </strong>
                </div>
            </div>

            <AnimatePresence>
                {selectedSlot && selectedProduct && (
                    <motion.div
                        className={styles.inlineModal}
                        variants={miniModalVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <h4 className={styles.modalTitle}>
                            {selectedProduct.emoji} {t(selectedProduct.name)}
                        </h4>

                        <p className={styles.modalInfo}>
                            {s.feirinha.sellModal.boughtAt} {selectedSlot.boughtAt} {s.feirinha.coins} | {s.feirinha.sellModal.currentPrice} {precoAtualSelecionado} {s.feirinha.coins}
                        </p>

                        <p className={styles.modalInfo}>
                            {s.feirinha.sellModal.profitPerUnit}{' '}
                            <strong className={getDifferenceClass(lucroUnidade)}>
                                {lucroUnidade > 0 ? '+' : ''}{lucroUnidade} {s.feirinha.coins}
                            </strong>
                        </p>

                        {cooldownAtivo && (
                            <p className={styles.cooldownWarning}>
                                🔒 {s.feirinha.sellModal.cooldownWarn}
                            </p>
                        )}

                        <div className={styles.modalActions}>
                            <motion.button
                                type="button"
                                className={styles.sellOne}
                                whileTap={{ scale: 0.95 }}
                                disabled={cooldownAtivo}
                                onClick={() => onSell(selectedSlot.productId, 1)}
                            >
                                {s.feirinha.sellModal.sellOne}
                            </motion.button>
                            <motion.button
                                type="button"
                                className={styles.sellAll}
                                whileTap={{ scale: 0.95 }}
                                disabled={cooldownAtivo}
                                onClick={() => onSell(selectedSlot.productId, selectedSlot.quantity)}
                            >
                                {s.feirinha.sellModal.sellAll}
                            </motion.button>
                            <motion.button
                                type="button"
                                className={styles.closeMiniModal}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedProductId(null)}
                            >
                                {s.feirinha.sellModal.close}
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
