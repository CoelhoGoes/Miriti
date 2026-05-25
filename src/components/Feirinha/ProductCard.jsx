import { useEffect, useMemo } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useStrings, useLanguage } from '../../i18n/index.js';
import { useGame } from '../../context/GameContext.jsx';
import Barometer from './Barometer';
import styles from './ProductCard.module.css';

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35 },
    },
};

const trendVariants = {
    up: { scale: [1, 1.12, 1], color: 'var(--color-success)' },
    down: { scale: [1, 1.12, 1], color: 'var(--color-danger)' },
    flat: { scale: 1, color: 'var(--color-text-secondary)' },
};

function getTrend(currentPrice, previousPrice) {
    if (currentPrice > previousPrice) return { key: 'up', emoji: '⬆️' };
    if (currentPrice < previousPrice) return { key: 'down', emoji: '⬇️' };
    return { key: 'flat', emoji: '➡️' };
}

export default function ProductCard({
    product,
    currentPrice,
    previousPrice,
    basketSlot,
    round,
    onBuy,
    onSell,
}) {
    const { state } = useGame();
    const s = useStrings();
    const lang = useLanguage();
    const t = (obj) => (obj && typeof obj === 'object') ? (obj[lang] ?? obj.pt) : obj;

    const trend = useMemo(
        () => getTrend(currentPrice, previousPrice),
        [currentPrice, previousPrice]
    );

    const trendControls = useAnimation();
    useEffect(() => {
        trendControls.start(trend.key);
    }, [trendControls, trend.key]);

    const basketLines = state.basket.length;
    const productInBasket = Boolean(basketSlot);
    const basketIsFullByRule = basketLines >= 8 && !productInBasket;

    const roundsHeld = basketSlot ? round - basketSlot.roundBought : 0;
    const cooldownActive = Boolean(
        product.hasCooldown
        && basketSlot
        && roundsHeld < product.cooldownRounds
    );
    const roundsLeft = cooldownActive ? product.cooldownRounds - roundsHeld : 0;

    return (
        <motion.div
            className={styles.card}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
        >
            <div className={styles.header}>
                <div className={styles.mainInfo}>
                    <span className={styles.emoji} aria-hidden="true">{product.emoji}</span>
                    <div className={styles.nameBlock}>
                        <h3 className={styles.name}>{t(product.name)}</h3>
                        <span className={styles.riskBadge}>{t(product.riskProfile)}</span>
                    </div>
                </div>
                <motion.span
                    className={styles.trend}
                    variants={trendVariants}
                    initial={false}
                    animate={trendControls}
                    aria-label="tendencia de preco"
                >
                    {trend.emoji}
                </motion.span>
            </div>

            <Barometer
                currentPrice={currentPrice}
                basePrice={product.basePrice}
                minPrice={product.minPrice}
                maxPrice={product.maxPrice}
            />

            <p className={styles.currentPrice}><strong>{currentPrice} {s.feirinha.coins}</strong></p>

            {product.hasCooldown && basketSlot && (
                cooldownActive ? (
                    <div className={styles.cooldownBadge}>
                        🔒 {s.feirinha.sellIn.replace('{n}', roundsLeft)}
                    </div>
                ) : (
                    <div className={styles.readyBadge}>{s.feirinha.readyToSell}</div>
                )
            )}

            <div className={styles.actions}>
                <motion.button
                    type="button"
                    className={styles.buyButton}
                    disabled={basketIsFullByRule}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onBuy(product.id)}
                >
                    {s.feirinha.buy}
                </motion.button>

                {basketSlot && basketSlot.quantity > 0 && (
                    <motion.button
                        type="button"
                        className={styles.sellButton}
                        disabled={cooldownActive}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSell(product.id, 1)}
                    >
                        {s.feirinha.sell} ({basketSlot.quantity})
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
}
