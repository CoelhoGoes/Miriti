import { motion } from 'framer-motion'
import { FaTimes, FaVolumeUp, FaMusic, FaMagic, FaGlobe, FaTrash, FaUniversalAccess, FaFont, FaEye } from 'react-icons/fa'
import { sound } from '../utils/sound.js'
import { useGame } from '../context/GameContext.jsx'
import { useStrings, LANGUAGES } from '../i18n/index.js'
import { useState } from 'react'
import './OptionsModal.css'

export default function OptionsModal({ onClose }) {
  const { state, updateSettings, resetProgress } = useGame()
  const { settings } = state
  const s = useStrings()
  const [confirmReset, setConfirmReset] = useState(false)

  const handleMusicVolume = (e) => {
    const v = parseFloat(e.target.value)
    updateSettings({ musicVolume: v })
    sound.setMusicVolume(v)
  }

  const handleSfxVolume = (e) => {
    const v = parseFloat(e.target.value)
    updateSettings({ sfxVolume: v })
    sound.setSfxVolume(v)
    sound.play('pop')
  }

  const toggleAnimations = () => {
    sound.play('click')
    updateSettings({ animationsEnabled: !settings.animationsEnabled })
  }

  const handleLanguage = (langId) => {
    if (langId === settings.language) return
    sound.play('click')
    updateSettings({ language: langId })
  }

  const handleReset = () => {
    sound.play('wrong')
    resetProgress()
    setConfirmReset(false)
  }

  const handleClose = () => {
    sound.play('click')
    onClose()
  }

  return (
    <motion.div
      className="options-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClose}
    >
      <motion.div
        className="options-modal"
        initial={{ scale: 0.7, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.7, opacity: 0, y: 40 }}
        transition={{ type: 'spring', damping: 18, stiffness: 200 }}
        onClick={e => e.stopPropagation()}
      >
        <button className="options-close" onClick={handleClose} aria-label="X">
          <FaTimes />
        </button>

        <h2 className="options-title">{s.options.title}</h2>

        <div className="options-group">
          <label className="options-label">
            <FaMusic /> {s.options.music}
            <span className="options-value">{Math.round(settings.musicVolume * 100)}%</span>
          </label>
          <input
            type="range"
            min="0" max="1" step="0.05"
            value={settings.musicVolume}
            onChange={handleMusicVolume}
            className="options-slider"
            style={{ '--pct': `${settings.musicVolume * 100}%` }}
          />
        </div>

        <div className="options-group">
          <label className="options-label">
            <FaVolumeUp /> {s.options.sfx}
            <span className="options-value">{Math.round(settings.sfxVolume * 100)}%</span>
          </label>
          <input
            type="range"
            min="0" max="1" step="0.05"
            value={settings.sfxVolume}
            onChange={handleSfxVolume}
            className="options-slider"
            style={{ '--pct': `${settings.sfxVolume * 100}%` }}
          />
        </div>

        {/* Idioma */}
        <div className="options-group">
          <label className="options-label">
            <FaGlobe /> {s.options.language}
          </label>
          <div className="options-lang-row">
            {LANGUAGES.map(lang => (
              <button
                key={lang.id}
                className={`options-lang-btn ${settings.language === lang.id ? 'active' : ''}`}
                onClick={() => handleLanguage(lang.id)}
                onMouseEnter={() => sound.play('hover')}
              >
                <span className="lang-flag">{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Animações */}
        <div className="options-toggle-row single">
          <button
            className={`options-toggle ${settings.animationsEnabled ? 'on' : 'off'}`}
            onClick={toggleAnimations}
          >
            <FaMagic />
            <span>{s.options.animations}</span>
            <span className="toggle-indicator">
              {settings.animationsEnabled ? s.options.on : s.options.off}
            </span>
          </button>
        </div>

        {/* Acessibilidade */}
        <div className="options-a11y">
          <div className="options-a11y-title">
            <FaUniversalAccess /> {s.a11y.sectionTitle}
          </div>

          {/* Tamanho da fonte */}
          <div className="options-group">
            <label className="options-label">
              <FaFont /> {s.a11y.fontSize}
            </label>
            <div className="options-font-row">
              {[
                { v: 1, label: s.a11y.fontSmall, size: '0.85rem' },
                { v: 2, label: s.a11y.fontMedium, size: '1rem' },
                { v: 3, label: s.a11y.fontLarge, size: '1.2rem' },
                { v: 4, label: s.a11y.fontXLarge, size: '1.4rem' }
              ].map(opt => (
                <button
                  key={opt.v}
                  type="button"
                  className={`options-font-btn ${settings.fontScale === opt.v ? 'active' : ''}`}
                  onClick={() => { sound.play('click'); updateSettings({ fontScale: opt.v }) }}
                  aria-label={`${s.a11y.fontSize} ${opt.label}`}
                  style={{ fontSize: opt.size }}
                >
                  Aa
                </button>
              ))}
            </div>
          </div>

          {/* Modo daltônico */}
          <div className="options-group">
            <label className="options-label">
              <FaEye /> {s.a11y.colorblind}
            </label>
            <div className="options-cb-row">
              {[
                { id: 'none', label: s.a11y.cbNone },
                { id: 'deuter', label: s.a11y.cbDeuter },
                { id: 'protan', label: s.a11y.cbProtan },
                { id: 'tritan', label: s.a11y.cbTritan }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  className={`options-cb-btn ${settings.colorblindMode === opt.id ? 'active' : ''}`}
                  onClick={() => { sound.play('click'); updateSettings({ colorblindMode: opt.id }) }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        <div className="options-danger">
          {!confirmReset ? (
            <button
              className="options-reset-btn"
              onClick={() => { sound.play('hover'); setConfirmReset(true) }}
            >
              <FaTrash /> {s.options.reset}
            </button>
          ) : (
            <div className="options-confirm">
              <p>{s.options.resetConfirm}</p>
              <div className="options-confirm-actions">
                <button
                  className="options-confirm-btn cancel"
                  onClick={() => { sound.play('click'); setConfirmReset(false) }}
                >
                  {s.options.cancel}
                </button>
                <button
                  className="options-confirm-btn confirm"
                  onClick={handleReset}
                >
                  {s.options.resetYes}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
