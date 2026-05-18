import { useState } from 'react'
import PropTypes from 'prop-types'

const PERGUNTAS = [
  {
    id: 1,
    pergunta: 'Você ganhou R$ 10,00 de mesada. O que é mais inteligente fazer?',
    opcoes: [
      'Gastar tudo em doces agora',
      'Guardar uma parte e gastar o resto com cuidado',
      'Perder o dinheiro',
      'Dar tudo para um amigo',
    ],
    correta: 1,
    explicacao: 'Guardar uma parte do dinheiro é o primeiro passo para ser um bom poupador!',
  },
  {
    id: 2,
    pergunta: 'O que é uma poupança?',
    opcoes: [
      'Um lugar para gastar dinheiro rápido',
      'Um tipo de brinquedo caro',
      'Um lugar seguro para guardar e fazer o dinheiro crescer',
      'Uma loja de doces',
    ],
    correta: 2,
    explicacao: 'A poupança guarda seu dinheiro com segurança e ele ainda cresce com o tempo!',
  },
  {
    id: 3,
    pergunta: 'Você quer comprar um brinquedo que custa R$ 50,00 mas só tem R$ 20,00. O que fazer?',
    opcoes: [
      'Chorar até ganhar o dinheiro',
      'Pegar emprestado e nunca devolver',
      'Guardar dinheiro aos poucos até completar os R$ 50,00',
      'Roubar o brinquedo',
    ],
    correta: 2,
    explicacao: 'Juntar dinheiro aos poucos para comprar o que queremos se chama poupar com objetivo!',
  },
  {
    id: 4,
    pergunta: 'O que é uma NECESSIDADE?',
    opcoes: [
      'Um videogame novo',
      'Comida, roupa e remédio',
      'Figurinhas raras',
      'Sorvete todo dia',
    ],
    correta: 1,
    explicacao: 'Necessidades são coisas que precisamos para viver, como comida, roupa e saúde!',
  },
  {
    id: 5,
    pergunta: 'Se você tem R$ 5,00 e gasta R$ 3,00, quanto sobra?',
    opcoes: [
      'R$ 1,00',
      'R$ 8,00',
      'R$ 2,00',
      'R$ 10,00',
    ],
    correta: 2,
    explicacao: 'R$ 5,00 menos R$ 3,00 = R$ 2,00. Saber calcular o troco é muito importante!',
  },
]

function TelaInicio({ onIniciar }) {
  return (
    <div style={estilos.container}>
      <div style={estilos.card}>
        <div style={{ fontSize: 80, marginBottom: 16 }}>🌿</div>
        <h1 style={estilos.titulo}>Quiz Financeiro</h1>
        <p style={estilos.subtitulo}>
          Teste seus conhecimentos sobre dinheiro e finanças!
        </p>
        <div style={estilos.infoBox}>
          <span style={{ fontSize: 24 }}>📝</span>
          <span style={{ color: '#fff', fontSize: 15, fontWeight: 600 }}>
            5 perguntas · Aprenda brincando!
          </span>
        </div>
        <button style={estilos.botaoPrimario} onClick={onIniciar}>
          🚀 Iniciar o Quiz!
        </button>
      </div>
    </div>
  )
}

TelaInicio.propTypes = { onIniciar: PropTypes.func.isRequired }

function TelaQuiz({ pergunta, numero, total, onResponder }) {
  const [selecionada, setSelecionada] = useState(null)
  const [respondida, setRespondida] = useState(false)

  function handleOpcao(idx) {
    if (respondida) return
    setSelecionada(idx)
    setRespondida(true)
    setTimeout(() => {
      onResponder(idx === pergunta.correta)
      setSelecionada(null)
      setRespondida(false)
    }, 900)
  }

  function corBotao(idx) {
    if (!respondida) return estilos.botaoOpcao
    if (idx === pergunta.correta) return { ...estilos.botaoOpcao, ...estilos.botaoCorreto }
    if (idx === selecionada) return { ...estilos.botaoOpcao, ...estilos.botaoErrado }
    return { ...estilos.botaoOpcao, opacity: 0.5 }
  }

  return (
    <div style={estilos.container}>
      <div style={{ ...estilos.card, maxWidth: 560 }}>
        <div style={estilos.progresso}>
          <span style={{ color: '#f9ca24', fontWeight: 800 }}>Pergunta {numero} de {total}</span>
          <div style={estilos.barraProgresso}>
            <div style={{ ...estilos.barraPreenchida, width: `${(numero / total) * 100}%` }} />
          </div>
        </div>

        <div style={{ fontSize: 48, margin: '16px 0 8px' }}>🤔</div>
        <h2 style={estilos.perguntaTexto}>{pergunta.pergunta}</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
          {pergunta.opcoes.map((opcao, idx) => (
            <button
              key={idx}
              style={corBotao(idx)}
              onClick={() => handleOpcao(idx)}
            >
              <span style={estilos.letraOpcao}>
                {['A', 'B', 'C', 'D'][idx]}
              </span>
              {opcao}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

TelaQuiz.propTypes = {
  pergunta: PropTypes.object.isRequired,
  numero: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onResponder: PropTypes.func.isRequired,
}

function TelaParabens({ explicacao, onReiniciar }) {
  return (
    <div style={estilos.container}>
      <div style={estilos.card}>
        <div style={{ fontSize: 90, marginBottom: 8 }}>🎉</div>
        <h1 style={{ ...estilos.titulo, color: '#2ecc71' }}>Parabéns!</h1>
        <p style={estilos.subtitulo}>Você acertou! Muito bem!</p>
        <div style={{ ...estilos.infoBox, background: 'rgba(46,204,113,0.2)', borderColor: '#2ecc71' }}>
          <span style={{ fontSize: 22 }}>💡</span>
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 600, textAlign: 'left' }}>
            {explicacao}
          </span>
        </div>
        <button style={{ ...estilos.botaoPrimario, background: 'linear-gradient(135deg, #2ecc71, #27ae60)' }} onClick={onReiniciar}>
          🔄 Jogar Novamente
        </button>
      </div>
    </div>
  )
}

TelaParabens.propTypes = {
  explicacao: PropTypes.string.isRequired,
  onReiniciar: PropTypes.func.isRequired,
}

function TelaErrou({ onReiniciar }) {
  return (
    <div style={estilos.container}>
      <div style={estilos.card}>
        <div style={{ fontSize: 90, marginBottom: 8 }}>😅</div>
        <h1 style={{ ...estilos.titulo, color: '#e74c3c' }}>Ops! Errou!</h1>
        <p style={estilos.subtitulo}>Não desanime, tente de novo!</p>
        <div style={{ ...estilos.infoBox, background: 'rgba(231,76,60,0.2)', borderColor: '#e74c3c' }}>
          <span style={{ fontSize: 22 }}>💪</span>
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>
            Errar faz parte do aprendizado. Tente novamente!
          </span>
        </div>
        <button style={{ ...estilos.botaoPrimario, background: 'linear-gradient(135deg, #e74c3c, #c0392b)' }} onClick={onReiniciar}>
          🔄 Tentar Novamente
        </button>
      </div>
    </div>
  )
}

TelaErrou.propTypes = { onReiniciar: PropTypes.func.isRequired }

export default function QuizGame() {
  const [tela, setTela] = useState('inicio')
  const [indicePergunta, setIndicePergunta] = useState(0)
  const [explicacaoAtual, setExplicacaoAtual] = useState('')

  const perguntaAtual = PERGUNTAS[indicePergunta]

  function iniciar() {
    setIndicePergunta(0)
    setTela('quiz')
  }

  function handleResposta(acertou) {
    if (acertou) {
      setExplicacaoAtual(perguntaAtual.explicacao)
      setTela('parabens')
    } else {
      setTela('errou')
    }
  }

  function reiniciar() {
    setIndicePergunta(0)
    setTela('inicio')
  }

  function proximaPergunta() {
    const proximo = indicePergunta + 1
    if (proximo < PERGUNTAS.length) {
      setIndicePergunta(proximo)
      setTela('quiz')
    } else {
      reiniciar()
    }
  }

  return (
    <>
      {tela === 'inicio' && <TelaInicio onIniciar={iniciar} />}
      {tela === 'quiz' && (
        <TelaQuiz
          pergunta={perguntaAtual}
          numero={indicePergunta + 1}
          total={PERGUNTAS.length}
          onResponder={handleResposta}
        />
      )}
      {tela === 'parabens' && (
        <TelaParabens
          explicacao={explicacaoAtual}
          onReiniciar={() => {
            const proximo = indicePergunta + 1
            proximo < PERGUNTAS.length ? proximaPergunta() : reiniciar()
          }}
        />
      )}
      {tela === 'errou' && <TelaErrou onReiniciar={reiniciar} />}
    </>
  )
}

const estilos = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(180deg, #173b24 0%, #1f5a37 40%, #12311f 100%)',
    padding: 24,
    fontFamily: "'Nunito', 'Fredoka One', sans-serif",
  },
  card: {
    background: 'rgba(255,255,255,0.07)',
    borderRadius: 24,
    padding: '40px 36px',
    maxWidth: 480,
    width: '100%',
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.12)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
  },
  titulo: {
    color: '#f9ca24',
    fontSize: 32,
    fontWeight: 900,
    margin: '0 0 12px',
  },
  subtitulo: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 16,
    margin: '0 0 24px',
  },
  infoBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: 'rgba(249,202,36,0.15)',
    border: '1px solid rgba(249,202,36,0.4)',
    borderRadius: 16,
    padding: '14px 18px',
    marginBottom: 28,
  },
  botaoPrimario: {
    width: '100%',
    padding: '16px 24px',
    background: 'linear-gradient(135deg, #f9ca24, #f0932b)',
    border: 'none',
    borderRadius: 16,
    color: '#12311f',
    fontSize: 18,
    fontWeight: 900,
    cursor: 'pointer',
    fontFamily: 'inherit',
    boxShadow: '0 8px 20px rgba(249,202,36,0.35)',
  },
  progresso: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 8,
  },
  barraProgresso: {
    height: 8,
    background: 'rgba(255,255,255,0.15)',
    borderRadius: 99,
    overflow: 'hidden',
  },
  barraPreenchida: {
    height: '100%',
    background: 'linear-gradient(90deg, #f9ca24, #f0932b)',
    borderRadius: 99,
    transition: 'width 0.4s ease',
  },
  perguntaTexto: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 800,
    lineHeight: 1.4,
    margin: 0,
  },
  botaoOpcao: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    width: '100%',
    padding: '14px 18px',
    background: 'rgba(255,255,255,0.09)',
    border: '1.5px solid rgba(255,255,255,0.15)',
    borderRadius: 14,
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'inherit',
    transition: 'all 0.15s',
  },
  botaoCorreto: {
    background: 'rgba(46,204,113,0.3)',
    borderColor: '#2ecc71',
  },
  botaoErrado: {
    background: 'rgba(231,76,60,0.3)',
    borderColor: '#e74c3c',
  },
  letraOpcao: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.15)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 900,
    fontSize: 14,
    flexShrink: 0,
  },
}