import { useEffect, useMemo } from 'react';
import { motion, useAnimation } from 'framer-motion';
import styles from './Barometer.module.css';

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function getLevel(percentage) {
    if (percentage <= 20) {
        return { emoji: '❄️', label: 'Muito barato!', color: '#4a90d9' };
    }
    if (percentage <= 40) {
        return { emoji: '📉', label: 'Caindo', color: '#74b9ff' };
    }
    if (percentage <= 60) {
        return { emoji: '😐', label: 'Normal', color: '#f9ca24' };
    }
    if (percentage <= 80) {
        return { emoji: '📈', label: 'Subindo', color: '#f0932b' };
    }
    return { emoji: '🔥', label: 'Muito caro!', color: '#eb4d4b' };
}

export default function Barometer({ currentPrice, basePrice, minPrice, maxPrice }) {
    const controls = useAnimation();

    const safeRange = maxPrice - minPrice;
    const rawPercentage = safeRange > 0
        ? ((currentPrice - minPrice) / safeRange) * 100
        : 0;
    const percentage = clamp(rawPercentage, 0, 100);

    const level = useMemo(() => getLevel(percentage), [percentage]);

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
                    initial={{ width: '0%', backgroundColor: '#c9ced6' }}
                    animate={controls}
                />
            </div>

            <div className={styles.footer}>
                <strong>{currentPrice} moedas</strong>
                <span className={styles.base}>Base: {basePrice}</span>
            </div>
        </div>
    );
}
