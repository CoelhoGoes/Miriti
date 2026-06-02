import { useEffect } from 'react'
import twemoji from '@twemoji/api'
import Twemoji from 'react-twemoji'
import './TwemojiWrapper.css'

const TWEMOJI_OPTIONS = {
  folder: 'svg',
  ext:    '.svg',
}

// react-twemoji only parses its own DOM subtree.
// Portals (OptionsModal, MascotChat, RewardModal) render into #modal-root which
// is outside that subtree, so we parse it manually after every render cycle.
function usePortalTwemoji() {
  useEffect(() => {
    const modalRoot = document.getElementById('modal-root')
    if (modalRoot) twemoji.parse(modalRoot, TWEMOJI_OPTIONS)
  })
}

export default function TwemojiWrapper({ children }) {
  usePortalTwemoji()

  return (
    <Twemoji options={TWEMOJI_OPTIONS} className="twemoji-root">
      {children}
    </Twemoji>
  )
}
