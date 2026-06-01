import { motion } from 'framer-motion'
import { useStrings } from '../../i18n/index.js'
import styles from './RotateDevice.module.css'

export default function RotateDevice() {
  const s = useStrings()

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <motion.div
          className={styles.icon}
          animate={{ rotate: [0, 0, 90, 90, 0] }}
          transition={{
            duration: 3,
            times: [0, 0.2, 0.5, 0.8, 1],
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          📱
        </motion.div>
        <h1 className={styles.title}>{s.rotateDevice.title}</h1>
        <p className={styles.subtitle}>{s.rotateDevice.subtitle}</p>
        <p className={styles.message}>{s.rotateDevice.message}</p>
      </div>
    </div>
  )
}
