import { createContext, useContext } from 'react'

const ScreenContext = createContext({
  screen: 'home',
  setScreen: () => {},
})

/**
 * Provider que expõe a tela actual e setter para descendentes.
 * Deve ser usado em App.jsx, recebendo o state actual de `screen`.
 *
 * @param {Object} props
 * @param {string} props.screen - chave actual da tela (ex: 'home', 'farm')
 * @param {Function} props.setScreen - setter do state de screen
 * @param {React.ReactNode} props.children
 */
export function ScreenProvider({ screen, setScreen, children }) {
  return (
    <ScreenContext.Provider value={{ screen, setScreen }}>
      {children}
    </ScreenContext.Provider>
  )
}

/**
 * Hook para consumir a tela actual em qualquer componente descendente.
 * Retorna { screen, setScreen }.
 *
 * @returns {{ screen: string, setScreen: Function }}
 */
export function useScreen() {
  const ctx = useContext(ScreenContext)
  if (!ctx) {
    throw new Error('useScreen() deve ser usado dentro de <ScreenProvider>')
  }
  return ctx
}

export default ScreenContext
