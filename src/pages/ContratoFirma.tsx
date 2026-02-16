import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import SignaturePad from 'signature_pad'
import { contractService, type ContractData } from '../lib/contractService'

type PageState = 'loading' | 'not-found' | 'signed' | 'pending' | 'success' | 'error'

function getDeviceType(): string {
  const w = window.innerWidth
  if (w < 768) return 'mobile'
  if (w < 1024) return 'tablet'
  return 'desktop'
}

export default function ContratoFirma() {
  const { token } = useParams<{ token: string }>()
  const [pageState, setPageState] = useState<PageState>('loading')
  const [contract, setContract] = useState<ContractData | null>(null)
  const [accepted, setAccepted] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const signaturePadRef = useRef<SignaturePad | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Fetch contract data
  useEffect(() => {
    if (!token) {
      setPageState('not-found')
      return
    }

    const fetchContract = async () => {
      try {
        const response = await contractService.getContractByToken(token)
        if (!response.success || !response.contract) {
          setPageState('not-found')
          return
        }
        setContract(response.contract)
        if (response.contract.status === 'signed') {
          setPageState('signed')
        } else if (response.contract.status === 'voided') {
          setPageState('not-found')
        } else {
          setPageState('pending')
        }
      } catch {
        setPageState('not-found')
      }
    }

    fetchContract()
  }, [token])

  // Initialize signature pad
  const initSignaturePad = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ratio = Math.max(window.devicePixelRatio || 1, 1)
    canvas.width = canvas.offsetWidth * ratio
    canvas.height = canvas.offsetHeight * ratio
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.scale(ratio, ratio)

    if (signaturePadRef.current) {
      signaturePadRef.current.off()
    }

    signaturePadRef.current = new SignaturePad(canvas, {
      backgroundColor: 'rgb(255, 255, 255)',
      penColor: 'rgb(20, 20, 20)',
      minWidth: 1,
      maxWidth: 2.5,
      throttle: 16,
    })

    signaturePadRef.current.addEventListener('endStroke', () => {
      setHasSignature(!signaturePadRef.current!.isEmpty())
    })
  }, [])

  useEffect(() => {
    if (pageState !== 'pending') return
    // Wait for DOM to settle
    const timer = setTimeout(initSignaturePad, 100)
    return () => clearTimeout(timer)
  }, [pageState, initSignaturePad])

  // Handle resize
  useEffect(() => {
    if (pageState !== 'pending') return

    const handleResize = () => {
      const pad = signaturePadRef.current
      const canvas = canvasRef.current
      if (!pad || !canvas) return

      const data = pad.toData()
      const ratio = Math.max(window.devicePixelRatio || 1, 1)
      canvas.width = canvas.offsetWidth * ratio
      canvas.height = canvas.offsetHeight * ratio
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.scale(ratio, ratio)
      pad.clear()
      if (data.length > 0) pad.fromData(data)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [pageState])

  const handleClear = () => {
    signaturePadRef.current?.clear()
    setHasSignature(false)
  }

  const handleSubmit = async () => {
    if (!token || !contract || !signaturePadRef.current || signaturePadRef.current.isEmpty()) return

    setSubmitting(true)
    setErrorMsg('')

    try {
      const signatureData = signaturePadRef.current.toDataURL('image/png')
      const response = await contractService.signContract({
        signingToken: token,
        signatureData,
        signerName: contract.student_name,
        signerEmail: contract.student_email,
        userAgent: navigator.userAgent,
        deviceType: getDeviceType(),
      })

      if (response.success) {
        setPageState('success')
      } else {
        setErrorMsg(response.error || 'Error al firmar el contrato')
        setPageState('error')
      }
    } catch {
      setErrorMsg('Error de conexion. Por favor intenta nuevamente.')
      setSubmitting(false)
    }
  }

  const canSubmit = accepted && hasSignature && !submitting

  // ─── Loading ───
  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="font-druk text-[#FFBE00] text-5xl tracking-wider mb-4"
               style={{ animation: 'contractPulse 2s ease-in-out infinite' }}>
            TAG
          </div>
          <div className="w-12 h-[2px] bg-[#FFBE00]/40 mx-auto">
            <div className="h-full bg-[#FFBE00] animate-[contractSlide_1.2s_ease-in-out_infinite]"
                 style={{ width: '40%' }} />
          </div>
        </div>
      </div>
    )
  }

  // ─── Not Found ───
  if (pageState === 'not-found') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="font-druk text-[#FFBE00] text-4xl tracking-wider mb-6">TAG</div>
          <div className="w-16 h-[2px] bg-[#FFBE00]/30 mx-auto mb-8" />
          <h1 className="font-garamond text-white/90 text-2xl mb-3">
            Contrato no encontrado
          </h1>
          <p className="font-mdio text-white/40 text-sm leading-relaxed">
            El enlace que has utilizado no es valido o el contrato ya no esta disponible.
            Por favor contacta a TAG para obtener un nuevo enlace.
          </p>
        </div>
      </div>
    )
  }

  // ─── Already Signed ───
  if (pageState === 'signed' && contract) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="font-druk text-[#FFBE00] text-4xl tracking-wider mb-6">TAG</div>
          <div className="w-16 h-[2px] bg-[#FFBE00]/30 mx-auto mb-8" />
          <div className="w-16 h-16 rounded-full border-2 border-[#FFBE00]/40 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[#FFBE00]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="font-garamond text-white/90 text-2xl mb-3">
            Contrato firmado
          </h1>
          <p className="font-mdio text-white/40 text-sm leading-relaxed mb-2">
            {contract.student_name}
          </p>
          {contract.signed_at && (
            <p className="font-mdio text-white/30 text-xs">
              Firmado el {new Date(contract.signed_at).toLocaleDateString('es-AR', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </p>
          )}
        </div>
      </div>
    )
  }

  // ─── Success (just signed) ───
  if (pageState === 'success') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="text-center max-w-md animate-fadeIn">
          <div className="font-druk text-[#FFBE00] text-4xl tracking-wider mb-6">TAG</div>
          <div className="w-16 h-[2px] bg-[#FFBE00]/30 mx-auto mb-8" />
          <div className="w-20 h-20 rounded-full border-2 border-[#FFBE00] flex items-center justify-center mx-auto mb-6"
               style={{ animation: 'contractScaleIn 0.5s ease-out' }}>
            <svg className="w-10 h-10 text-[#FFBE00]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="font-garamond text-white/90 text-2xl mb-3">
            Contrato firmado exitosamente
          </h1>
          <p className="font-mdio text-white/40 text-sm leading-relaxed mb-1">
            Gracias, {contract?.student_name}.
          </p>
          <p className="font-mdio text-white/30 text-xs">
            Ya puedes cerrar esta pagina.
          </p>
        </div>
      </div>
    )
  }

  // ─── Error ───
  if (pageState === 'error') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="font-druk text-[#FFBE00] text-4xl tracking-wider mb-6">TAG</div>
          <div className="w-16 h-[2px] bg-[#FFBE00]/30 mx-auto mb-8" />
          <h1 className="font-garamond text-white/90 text-2xl mb-3">
            Error
          </h1>
          <p className="font-mdio text-white/40 text-sm leading-relaxed">
            {errorMsg}
          </p>
        </div>
      </div>
    )
  }

  // ─── Pending: Main Signing Experience ───
  return (
    <div ref={containerRef} className="min-h-screen bg-[#fafaf8]">
      <style>{`
        @keyframes contractPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes contractSlide {
          0% { transform: translateX(0); }
          50% { transform: translateX(150%); }
          100% { transform: translateX(0); }
        }
        @keyframes contractScaleIn {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* Header */}
      <header className="bg-[#0a0a0a] py-6 md:py-8">
        <div className="max-w-2xl mx-auto px-6 flex items-center justify-between">
          <div>
            <div className="font-druk text-[#FFBE00] text-3xl md:text-4xl tracking-wider leading-none">
              TAG
            </div>
            <div className="font-mdio text-white/30 text-[10px] md:text-xs tracking-[0.2em] uppercase mt-1">
              Escuela de Actuacion
            </div>
          </div>
          <div className="font-mdio text-white/20 text-[10px] tracking-wider uppercase">
            Contrato
          </div>
        </div>
      </header>

      {/* Thin golden line */}
      <div className="h-[2px] bg-[#FFBE00]" />

      {/* Content */}
      <main className="max-w-2xl mx-auto px-6 py-8 md:py-12">

        {/* Student Info */}
        <div className="mb-10 md:mb-12">
          <div className="font-mdio text-[#0a0a0a]/30 text-[10px] tracking-[0.15em] uppercase mb-2">
            Alumno
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
            <span className="font-garamond text-[#0a0a0a] text-xl md:text-2xl">
              {contract?.student_name}
            </span>
            <span className="font-mdio text-[#0a0a0a]/35 text-xs mt-1 sm:mt-0">
              {contract?.student_email}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#0a0a0a]/8 mb-10 md:mb-12" />

        {/* Contract Title */}
        <h1 className="font-druk text-[#0a0a0a] text-lg md:text-xl tracking-wide uppercase mb-8 md:mb-10 leading-tight">
          {contract?.contract_title}
        </h1>

        {/* Contract Body */}
        <div className="mb-10 md:mb-12">
          <div className="font-garamond text-[#0a0a0a]/75 text-[15px] md:text-base leading-[1.85] whitespace-pre-wrap">
            {contract?.contract_body?.split('\n\n').map((paragraph, i) => (
              <p key={i} className="mb-5 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#0a0a0a]/8 mb-8 md:mb-10" />

        {/* Acceptance Checkbox */}
        <label className="flex items-start gap-4 mb-10 md:mb-12 cursor-pointer group select-none">
          <div className="relative mt-[2px] flex-shrink-0">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-5 h-5 border-2 border-[#0a0a0a]/20 rounded-sm
                          peer-checked:bg-[#FFBE00] peer-checked:border-[#FFBE00]
                          transition-all duration-200
                          group-hover:border-[#0a0a0a]/40
                          flex items-center justify-center">
              {accepted && (
                <svg className="w-3 h-3 text-[#0a0a0a]" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
            </div>
          </div>
          <span className="font-garamond text-[#0a0a0a]/70 text-sm md:text-[15px] leading-relaxed">
            He leido y acepto los terminos y condiciones del presente contrato.
          </span>
        </label>

        {/* Signature Section */}
        <div className="mb-10 md:mb-12">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <div className="font-mdio text-[#0a0a0a]/30 text-[10px] tracking-[0.15em] uppercase mb-1">
                Firma del Alumno
              </div>
              <div className="font-mdio text-[#0a0a0a]/20 text-[10px]">
                Dibuja tu firma en el recuadro
              </div>
            </div>
            {hasSignature && (
              <button
                type="button"
                onClick={handleClear}
                className="font-mdio text-[10px] tracking-wider uppercase text-[#0a0a0a]/30
                         hover:text-[#0a0a0a]/60 transition-colors duration-200
                         border-b border-[#0a0a0a]/15 hover:border-[#0a0a0a]/30 pb-px"
              >
                Limpiar
              </button>
            )}
          </div>

          <div className="relative rounded-lg border-2 border-dashed border-[#0a0a0a]/12
                        bg-white overflow-hidden
                        transition-colors duration-200
                        focus-within:border-[#FFBE00]/50">
            <canvas
              ref={canvasRef}
              className="w-full cursor-crosshair"
              style={{
                touchAction: 'none',
                height: '200px',
              }}
            />
            {/* Signature line */}
            <div className="absolute bottom-8 left-8 right-8 h-px bg-[#0a0a0a]/8" />
            <div className="absolute bottom-4 left-8 font-mdio text-[8px] text-[#0a0a0a]/15 tracking-[0.1em] uppercase">
              Firma
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`
            w-full py-4 md:py-5 rounded-lg font-druk text-sm md:text-base tracking-wider uppercase
            transition-all duration-300 relative overflow-hidden
            ${canSubmit
              ? 'bg-[#FFBE00] text-[#0a0a0a] hover:bg-[#e5ab00] active:scale-[0.99] shadow-[0_2px_20px_rgba(255,190,0,0.3)]'
              : 'bg-[#0a0a0a]/5 text-[#0a0a0a]/25 cursor-not-allowed'
            }
          `}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-3">
              <span className="w-4 h-4 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />
              Firmando...
            </span>
          ) : (
            'Firmar Contrato'
          )}
        </button>

        {/* Subtle notice */}
        <p className="font-mdio text-[#0a0a0a]/20 text-[10px] text-center mt-4 leading-relaxed">
          Al firmar, confirmas tu identidad y aceptas los terminos del contrato.
        </p>
      </main>

      {/* Footer */}
      <footer className="py-8 md:py-10 mt-8">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="h-px bg-[#0a0a0a]/5 mb-6" />
          <div className="font-mdio text-[#0a0a0a]/15 text-[10px] tracking-[0.15em] uppercase">
            TAG Escuela de Actuacion &middot; {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </div>
  )
}
