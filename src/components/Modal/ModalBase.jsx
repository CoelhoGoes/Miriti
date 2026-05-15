import './ModalBase.css'

export default function ModalBase({ isOpen, onClose, children }) {
    if (!isOpen) {
        return null
    }

    return (
        <div className="modal-base-overlay" role="presentation" onClick={onClose}>
            <div
                className="modal-base-container"
                role="dialog"
                aria-modal="true"
                onClick={(event) => event.stopPropagation()}
            >
                <button type="button" className="modal-base-close" onClick={onClose} aria-label="Fechar modal">
                    ×
                </button>
                {children}
            </div>
        </div>
    )
}