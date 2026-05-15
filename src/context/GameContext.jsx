/* eslint-disable react-refresh/only-export-components */
import PropTypes from 'prop-types'
import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react'

const STORAGE_KEY = 'miriti_save_data'
const XP_PER_LEVEL = 500

export const defaultGameState = {
    perfil: {
        nome: 'Aluno',
        nivel: 1,
        xp: 0,
    },
    economia: {
        moedas: 50,
        energia: 100,
        diaAtual: 1,
    },
    inventario: {},
    fazenda: [],
    progressoPedagogico: {
        quizzesRespondidos: [],
        conceitosDesbloqueados: [],
    },
}

const GameContext = createContext(null)

function toPositiveNumber(value) {
    const numberValue = Number(value)
    return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : 0
}

function uniqueList(values) {
    return [...new Set(Array.isArray(values) ? values : [])]
}

function normalizeInventory(inventory) {
    if (!inventory || typeof inventory !== 'object' || Array.isArray(inventory)) {
        return {}
    }

    return Object.entries(inventory).reduce((accumulator, [itemId, quantity]) => {
        const normalizedQuantity = Math.max(0, Number(quantity) || 0)

        if (normalizedQuantity > 0) {
            accumulator[itemId] = normalizedQuantity
        }

        return accumulator
    }, {})
}

function normalizeFazenda(fazenda) {
    if (!Array.isArray(fazenda)) {
        return []
    }

    return fazenda
        .filter((plot) => plot && typeof plot === 'object' && typeof plot.id === 'string')
        .map((plot) => ({
            id: plot.id,
            tipo: plot.tipo ?? null,
            plantadoEm: Number(plot.plantadoEm) || 0,
            prontoParaColher: Boolean(plot.prontoParaColher),
        }))
}

function normalizeGameState(rawState) {
    const baseState = structuredClone(defaultGameState)

    if (!rawState || typeof rawState !== 'object') {
        return baseState
    }

    return {
        perfil: {
            ...baseState.perfil,
            ...(rawState.perfil && typeof rawState.perfil === 'object' ? rawState.perfil : {}),
            nivel: Math.max(1, Number(rawState?.perfil?.nivel) || baseState.perfil.nivel),
            xp: Math.max(0, Number(rawState?.perfil?.xp) || 0),
        },
        economia: {
            ...baseState.economia,
            ...(rawState.economia && typeof rawState.economia === 'object' ? rawState.economia : {}),
            moedas: Math.max(0, Number(rawState?.economia?.moedas) || baseState.economia.moedas),
            energia: Math.max(0, Number(rawState?.economia?.energia) || baseState.economia.energia),
            diaAtual: Math.max(1, Number(rawState?.economia?.diaAtual) || baseState.economia.diaAtual),
        },
        inventario: normalizeInventory(rawState.inventario),
        fazenda: normalizeFazenda(rawState.fazenda),
        progressoPedagogico: {
            quizzesRespondidos: uniqueList(rawState?.progressoPedagogico?.quizzesRespondidos),
            conceitosDesbloqueados: uniqueList(rawState?.progressoPedagogico?.conceitosDesbloqueados),
        },
    }
}

function getLevelFromXP(xp) {
    return Math.max(1, Math.floor(Math.max(0, xp) / XP_PER_LEVEL) + 1)
}

function reducer(state, action) {
    switch (action.type) {
        case 'HYDRATE':
            return action.payload
        case 'ADD_COINS': {
            const amount = toPositiveNumber(action.payload)

            if (amount <= 0) {
                return state
            }

            return {
                ...state,
                economia: {
                    ...state.economia,
                    moedas: state.economia.moedas + amount,
                },
            }
        }
        case 'SPEND_COINS': {
            const amount = toPositiveNumber(action.payload)

            if (amount <= 0 || state.economia.moedas < amount) {
                return state
            }

            return {
                ...state,
                economia: {
                    ...state.economia,
                    moedas: state.economia.moedas - amount,
                },
            }
        }
        case 'ADD_XP': {
            const amount = toPositiveNumber(action.payload)

            if (amount <= 0) {
                return state
            }

            const totalXP = state.perfil.xp + amount

            return {
                ...state,
                perfil: {
                    ...state.perfil,
                    xp: totalXP,
                    nivel: getLevelFromXP(totalXP),
                },
            }
        }
        case 'ADD_ITEM_TO_INVENTORY': {
            const { itemId, qtd } = action.payload ?? {}
            const amount = toPositiveNumber(qtd)

            if (!itemId || amount <= 0) {
                return state
            }

            return {
                ...state,
                inventario: {
                    ...state.inventario,
                    [itemId]: (Number(state.inventario[itemId]) || 0) + amount,
                },
            }
        }
        default:
            return state
    }
}

export function GameProvider({ children }) {
    const [gameState, dispatch] = useReducer(reducer, defaultGameState)
    const stateRef = useRef(gameState)
    const isHydratedRef = useRef(false)

    useEffect(() => {
        stateRef.current = gameState
    }, [gameState])

    useEffect(() => {
        try {
            const savedData = localStorage.getItem(STORAGE_KEY)

            if (!savedData) {
                dispatch({ type: 'HYDRATE', payload: defaultGameState })
                isHydratedRef.current = true
                return
            }

            const parsedData = JSON.parse(savedData)
            const normalizedData = normalizeGameState(parsedData)

            normalizedData.perfil.nivel = getLevelFromXP(normalizedData.perfil.xp)

            dispatch({ type: 'HYDRATE', payload: normalizedData })
        } catch (error) {
            console.warn('Falha ao carregar o save de Miriti; iniciando com o estado padrão.', error)
            dispatch({ type: 'HYDRATE', payload: defaultGameState })
        } finally {
            isHydratedRef.current = true
        }
    }, [])

    useEffect(() => {
        if (!isHydratedRef.current) {
            return
        }

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState))
        } catch (error) {
            console.error('Falha ao salvar o progresso de Miriti no localStorage.', error)
        }
    }, [gameState])

    const addCoins = (qtd) => {
        dispatch({ type: 'ADD_COINS', payload: qtd })
    }

    const spendCoins = (qtd) => {
        const amount = toPositiveNumber(qtd)

        if (amount <= 0 || stateRef.current.economia.moedas < amount) {
            return false
        }

        dispatch({ type: 'SPEND_COINS', payload: amount })
        return true
    }

    const addXP = (qtd) => {
        dispatch({ type: 'ADD_XP', payload: qtd })
    }

    const addItemToInventory = (itemId, qtd) => {
        dispatch({ type: 'ADD_ITEM_TO_INVENTORY', payload: { itemId, qtd } })
    }

    const value = useMemo(
        () => ({
            gameState,
            addCoins,
            spendCoins,
            addXP,
            addItemToInventory,
        }),
        [gameState],
    )

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
    const context = useContext(GameContext)

    if (!context) {
        throw new Error('useGame deve ser usado dentro de GameProvider')
    }

    return context
}

GameProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export { GameContext, STORAGE_KEY }