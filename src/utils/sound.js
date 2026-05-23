/**
 * Sistema de som do Miriti.
 * Usa Web Audio API para sintetizar todos os efeitos sonoros e a música ambiente
 * — sem dependência de arquivos de áudio externos. Tudo programaticamente.
 */

class SoundManager {
  constructor() {
    this.ctx = null
    this.masterMusic = null
    this.masterSfx = null
    this.musicVolume = 0.4
    this.sfxVolume = 0.6
    this.initialized = false
    this.musicPlaying = false
    this.musicNodes = []
    this.musicTimer = null
  }

  init() {
    if (this.initialized) return
    try {
      const AC = window.AudioContext || window.webkitAudioContext
      if (!AC) return
      this.ctx = new AC()
      this.masterMusic = this.ctx.createGain()
      this.masterMusic.gain.value = this.musicVolume
      this.masterMusic.connect(this.ctx.destination)

      this.masterSfx = this.ctx.createGain()
      this.masterSfx.gain.value = this.sfxVolume
      this.masterSfx.connect(this.ctx.destination)

      this.initialized = true
    } catch (e) {
      console.warn('Web Audio não disponível:', e)
    }
  }

  resumeIfSuspended() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  setMusicVolume(v) {
    this.musicVolume = v
    if (this.masterMusic) {
      this.masterMusic.gain.linearRampToValueAtTime(v, this.ctx.currentTime + 0.1)
    }
    if (v === 0) this.stopMusic()
    else if (!this.musicPlaying && this.initialized) this.startMusic()
  }

  setSfxVolume(v) {
    this.sfxVolume = v
    if (this.masterSfx) {
      this.masterSfx.gain.linearRampToValueAtTime(v, this.ctx.currentTime + 0.1)
    }
  }

  /** Toca uma nota com envelope ADSR simples. */
  _tone({ freq, duration = 0.15, type = 'sine', attack = 0.005, decay = 0.05, sustain = 0.5, release = 0.1, gain = 0.5, when = 0 }) {
    if (!this.initialized) return
    this.resumeIfSuspended()
    const t = this.ctx.currentTime + when
    const osc = this.ctx.createOscillator()
    const env = this.ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, t)
    env.gain.setValueAtTime(0, t)
    env.gain.linearRampToValueAtTime(gain, t + attack)
    env.gain.linearRampToValueAtTime(gain * sustain, t + attack + decay)
    env.gain.linearRampToValueAtTime(0, t + duration + release)
    osc.connect(env)
    env.connect(this.masterSfx)
    osc.start(t)
    osc.stop(t + duration + release + 0.05)
  }

  /** Toca um arpejo (sequência rápida de notas). */
  _arpeggio(freqs, gap = 0.06, opts = {}) {
    freqs.forEach((f, i) => this._tone({ freq: f, when: i * gap, ...opts }))
  }

  /** Sons do jogo. */
  play(name) {
    if (!this.initialized) return
    switch (name) {
      case 'click':
        this._tone({ freq: 880, duration: 0.06, type: 'sine', gain: 0.3 })
        this._tone({ freq: 1320, duration: 0.06, type: 'sine', gain: 0.2, when: 0.02 })
        break
      case 'hover':
        this._tone({ freq: 1200, duration: 0.04, type: 'sine', gain: 0.12 })
        break
      case 'correct':
        this._arpeggio([523.25, 659.25, 783.99, 1046.5], 0.08, { duration: 0.18, type: 'triangle', gain: 0.35 })
        break
      case 'wrong':
        this._tone({ freq: 220, duration: 0.18, type: 'square', gain: 0.22 })
        this._tone({ freq: 165, duration: 0.22, type: 'square', gain: 0.22, when: 0.1 })
        break
      case 'victory':
        this._arpeggio([523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98], 0.09,
          { duration: 0.22, type: 'triangle', gain: 0.4 })
        break
      case 'transition':
        this._tone({ freq: 660, duration: 0.1, type: 'sine', gain: 0.25 })
        this._tone({ freq: 880, duration: 0.1, type: 'sine', gain: 0.2, when: 0.06 })
        break
      case 'coin':
        this._tone({ freq: 988, duration: 0.06, type: 'square', gain: 0.25 })
        this._tone({ freq: 1318, duration: 0.12, type: 'square', gain: 0.2, when: 0.04 })
        break
      case 'star':
        this._arpeggio([1318, 1568, 1976], 0.05, { duration: 0.12, type: 'sine', gain: 0.3 })
        break
      case 'pop':
        this._tone({ freq: 600, duration: 0.05, type: 'sine', gain: 0.25 })
        break
      case 'whoosh':
        this._tone({ freq: 400, duration: 0.15, type: 'sawtooth', gain: 0.15 })
        break
      default:
        this._tone({ freq: 440, duration: 0.1, gain: 0.2 })
    }
  }

  /**
   * Música ambiente: loop suave em modo maior, melodia leve infantil.
   * Usa osciladores com baixo volume para criar uma atmosfera relaxante.
   */
  startMusic() {
    if (!this.initialized || this.musicPlaying || this.musicVolume === 0) return
    this.resumeIfSuspended()
    this.musicPlaying = true

    // Padrão melódico simples (notas em Hz — escala de Dó maior)
    const melody = [
      523.25, 659.25, 783.99, 659.25, // C5 E5 G5 E5
      523.25, 587.33, 698.46, 587.33, // C5 D5 F5 D5
      493.88, 587.33, 783.99, 587.33, // B4 D5 G5 D5
      523.25, 659.25, 880.00, 783.99  // C5 E5 A5 G5
    ]
    const bass = [130.81, 130.81, 174.61, 174.61, 196.00, 196.00, 220.00, 220.00] // C3 F3 G3 A3

    const stepDuration = 0.45
    let beat = 0

    const tick = () => {
      if (!this.musicPlaying) return
      const t = this.ctx.currentTime

      // Melodia
      const noteFreq = melody[beat % melody.length]
      const noteOsc = this.ctx.createOscillator()
      const noteGain = this.ctx.createGain()
      noteOsc.type = 'triangle'
      noteOsc.frequency.value = noteFreq
      noteGain.gain.setValueAtTime(0, t)
      noteGain.gain.linearRampToValueAtTime(0.06, t + 0.05)
      noteGain.gain.linearRampToValueAtTime(0, t + stepDuration * 0.9)
      noteOsc.connect(noteGain)
      noteGain.connect(this.masterMusic)
      noteOsc.start(t)
      noteOsc.stop(t + stepDuration)

      // Baixo (a cada 2 beats)
      if (beat % 2 === 0) {
        const bassFreq = bass[(beat / 2) % bass.length]
        const bassOsc = this.ctx.createOscillator()
        const bassGain = this.ctx.createGain()
        bassOsc.type = 'sine'
        bassOsc.frequency.value = bassFreq
        bassGain.gain.setValueAtTime(0, t)
        bassGain.gain.linearRampToValueAtTime(0.08, t + 0.05)
        bassGain.gain.linearRampToValueAtTime(0, t + stepDuration * 1.8)
        bassOsc.connect(bassGain)
        bassGain.connect(this.masterMusic)
        bassOsc.start(t)
        bassOsc.stop(t + stepDuration * 2)
      }

      beat++
      this.musicTimer = setTimeout(tick, stepDuration * 1000)
    }
    tick()
  }

  stopMusic() {
    this.musicPlaying = false
    if (this.musicTimer) {
      clearTimeout(this.musicTimer)
      this.musicTimer = null
    }
  }
}

export const sound = new SoundManager()
