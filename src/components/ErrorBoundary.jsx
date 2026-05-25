import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Miriti — erro capturado:', error, info)
  }

  handleReset = () => {
    this.setState({ error: null })
    if (this.props.onReset) this.props.onReset()
  }

  render() {
    if (this.state.error) {
      const t = this.props.strings || {
        title: 'Ops! Algo deu errado',
        message: 'O jogo encontrou um probleminha, mas você pode continuar.',
        button: 'Voltar ao início'
      }
      return (
        <div className="error-screen">
          <div className="error-box">
            <div className="error-emoji">🐔</div>
            <h2>{t.title}</h2>
            <p>{t.message}</p>
            <pre className="error-detail">
              {String(this.state.error?.message || this.state.error)}
            </pre>
            <button className="error-btn" onClick={this.handleReset}>
              {t.button}
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
