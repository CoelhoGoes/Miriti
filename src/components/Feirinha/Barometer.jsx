import { useEffect, useMemo } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useStrings } from '../../i18n/index.js';
import styles from './Barometer.module.css';

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

export default function Barometer({ currentPrice, basePrice, minPrice, maxPrice }) {
    const s = useStrings();
    const controls = useAnimation();

    const getLevel = (percentage) => {
        if (percentage <= 20) {
            return { emoji: '❄️', label: s.feirinha.barometer.level1, color: 'var(--color-primary)' };
        }
        if (percentage <= 40) {
            return { emoji: '📉', label: s.feirinha.barometer.level2, color: 'var(--color-secondary)' };
        }
        if (percentage <= 60) {
            return { emoji: '😐', label: s.feirinha.barometer.level3, color: 'var(--color-warning)' };
        }
        if (percentage <= 80) {
            return { emoji: '📈', label: s.feirinha.barometer.level4, color: 'var(--color-warning)' };
        }
        return { emoji: '🔥', label: s.feirinha.barometer.level5, color: 'var(--color-danger)' };
    };

    const safeRange = maxPrice - minPrice;
    const rawPercentage = safeRange > 0
        ? ((currentPrice - minPrice) / safeRange) * 100
        : 0;
    const percentage = clamp(rawPercentage, 0, 100);

    const level = useMemo(() => getLevel(percentage), [percentage, s]);

    useEffect(() => {
        controls.start({
            width: `${percentage}%`,
            backgroundColor: level.color,
            transition: { duration: 0.6 },
        });
    }, [controls, percentage, level.color]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <span className={styles.emoji} aria-hidden="true">{level.emoji}</span>
                <span className={styles.label}>{level.label}</span>
            </div>

            <div className={styles.track}>
                <motion.div
                    className={styles.fill}
                    initial={{ width: '0%', backgroundColor: 'var(--color-surface-3)' }}
                    animate={controls}
                />
            </div>

            <div className={styles.footer}>
                <strong>{currentPrice} {s.feirinha.coins}</strong>
                <span className={styles.base}>{s.feirinha.base.replace('{price}', basePrice)}</span>
            </div>
        </div>
    );
}
