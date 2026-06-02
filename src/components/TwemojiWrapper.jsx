import Twemoji from 'react-twemoji'
import './TwemojiWrapper.css'

const TWEMOJI_OPTIONS = {
  folder: 'svg',
  ext: '.svg'
}

export default function TwemojiWrapper({ children }) {
  return (
    <Twemoji options={TWEMOJI_OPTIONS} className="twemoji-root">
      {children}
    </Twemoji>
  )
}
