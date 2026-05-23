import { useEffect, useMemo } from 'react';
import { motion, useAnimation } from 'framer-motion';
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
    up: { scale: [1, 1.12, 1], color: '#22a06b' },
    down: { scale: [1, 1.12, 1], color: '#d64545' },
    flat: { scale: 1, color: '#7f8c8d' },
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
    const trend = useMemo(
        () => getTrend(currentPrice, previousPrice),
        [currentPrice, previousPrice]
    );

    const trendControls = useAnimation();
    useEffect(() => {
        trendControls.start(trend.key);
    }, [trendControls, trend.key]);

    const basketCount = basketSlot ? basketSlot.quantity : 0;
    const basketIsFullByRule = Boolean(basketSlot && basketCount >= 8);

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
                        <h3 className={styles.name}>{product.name}</h3>
                        <span className={styles.riskBadge}>{product.riskProfile}</span>
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

            <p className={styles.currentPrice}><strong>{currentPrice} moedas</strong></p>

            {product.hasCooldown && basketSlot && (
                cooldownActive ? (
                    <div className={styles.cooldownBadge}>
                        🔒 Venda em {roundsLeft} rodada(s)
                    </div>
                ) : (
                    <div className={styles.readyBadge}>✅ Pronto para vender</div>
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
                    Comprar
                </motion.button>

                {basketSlot && basketSlot.quantity > 0 && (
                    <motion.button
                        type="button"
                        className={styles.sellButton}
                        disabled={cooldownActive}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSell(product.id, 1)}
                    >
                        Vender ({basketSlot.quantity})
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
}
