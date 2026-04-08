import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import SignaturePad from 'signature_pad'
import { contractService, type ContractData, type StudentUpdates, type SignedFormData } from '../lib/contractService'
import { supabase } from '../lib/supabase'

type ActiveCourse = { id: string; name: string; schedule: string | null; start_date: string | null; end_date: string | null }

type PageState = 'loading' | 'not-found' | 'signed' | 'pending' | 'success' | 'error'

function getDeviceType(): string {
  const w = window.innerWidth
  if (w < 768) return 'mobile'
  if (w < 1024) return 'tablet'
  return 'desktop'
}

/** Returns contract body from section 4 onward so we don't duplicate the empty 1–3 fill-in blocks (we render those with data above). */
function contractBodyFromSection4(body: string | undefined): string {
  if (!body) return ''
  const marker = '4. PRECIO'
  const idx = body.indexOf(marker)
  if (idx === -1) return body
  return body.slice(idx).trim()
}

const MARKER_58 = '5.8. Información para tu bienestar:'
const MARKER_6 = '6. CESIÓN DE DERECHOS DE IMAGEN'

/** Splits body (from section 4) into part before 5.8, and part from 6 onward. Used to inject editable 5.8 in place. */
function splitBodyAt58(body: string): { before58: string; after58: string } {
  const full = contractBodyFromSection4(body)
  const idx58 = full.indexOf(MARKER_58)
  const idx6 = full.indexOf(MARKER_6)
  if (idx58 === -1 || idx6 === -1 || idx6 <= idx58) {
    return { before58: full, after58: '' }
  }
  const before58 = full.slice(0, idx58).trimEnd()
  const after58 = full.slice(idx6).trimStart()
  return { before58, after58 }
}

export default function ContratoFirma() {
  const { token } = useParams<{ token: string }>()
  const [pageState, setPageState] = useState<PageState>('loading')
  const [contract, setContract] = useState<ContractData | null>(null)
  const [accepted, setAccepted] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const submittingRef = useRef(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [signedSignatureData, setSignedSignatureData] = useState<string | null>(null)
  const [wellbeingNotes, setWellbeingNotes] = useState('')
  const [wellbeingConsent, setWellbeingConsent] = useState<'authorize' | 'decline' | null>(null)
  const [activeCourses, setActiveCourses] = useState<ActiveCourse[]>([])
  const [formData, setFormData] = useState<{
    student_name: string
    student_email: string
    student_phone: string
    student_date_of_birth: string
    student_address: string
    student_id_document: string
    student_instagram: string
    student_tiktok: string
    tutor_full_name: string
    tutor_id_document: string
    course_name: string
    course_schedule: string
    course_start_date: string
    course_end_date: string
    total_price: string
    enrollment_fee: string
    payment_type: 'pago_unico' | 'pago_fraccionado'
    installments: string
    installment_amount: string
  }>({
    student_name: '', student_email: '', student_phone: '', student_date_of_birth: '', student_address: '',
    student_id_document: '', student_instagram: '', student_tiktok: '', tutor_full_name: '', tutor_id_document: '',
    course_name: '', course_schedule: '', course_start_date: '', course_end_date: '',
    total_price: '', enrollment_fee: '', payment_type: 'pago_unico', installments: '', installment_amount: '',
  })
  const printRef = useRef<HTMLDivElement>(null)

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

  // Initialize form data from contract when loaded (pending view)
  useEffect(() => {
    if (!contract || pageState !== 'pending') return
    const dob = contract.student_date_of_birth
    const dobStr = dob ? (typeof dob === 'string' && dob.includes('T') ? dob.slice(0, 10) : String(dob).slice(0, 10)) : ''
    const startDate = contract.course_start_date ? String(contract.course_start_date).slice(0, 10) : ''
    const endDate = contract.course_end_date ? String(contract.course_end_date).slice(0, 10) : ''
    setFormData({
      student_name: contract.student_name ?? '',
      student_email: contract.student_email ?? '',
      student_phone: contract.student_phone ?? '',
      student_date_of_birth: dobStr,
      student_address: contract.student_address ?? '',
      student_id_document: contract.student_id_document ?? '',
      student_instagram: contract.student_instagram?.replace(/^@/, '') ?? '',
      student_tiktok: contract.student_tiktok?.replace(/^@/, '') ?? '',
      tutor_full_name: contract.tutor_full_name ?? '',
      tutor_id_document: contract.tutor_id_document ?? '',
      course_name: contract.course_name ?? '',
      course_schedule: contract.course_schedule ?? '',
      course_start_date: startDate,
      course_end_date: endDate,
      total_price: '', enrollment_fee: '', payment_type: 'pago_unico', installments: '', installment_amount: '',
    })
  }, [contract?.id, pageState])

  // Fetch active course instances for "Nombre del curso" dropdown
  useEffect(() => {
    if (pageState !== 'pending') return
    let cancelled = false
    async function fetchCourses() {
      const { data, error } = await supabase
        .from('course_instances')
        .select('id, name, schedule, start_date, end_date')
        .eq('is_active', true)
        .order('start_date', { ascending: true })
      if (cancelled || error) return
      setActiveCourses((data ?? []).map((r: { id: string; name: string; schedule: string | null; start_date: string | null; end_date: string | null }) => ({
        id: r.id,
        name: r.name ?? '',
        schedule: r.schedule ?? null,
        start_date: r.start_date ? String(r.start_date).slice(0, 10) : null,
        end_date: r.end_date ? String(r.end_date).slice(0, 10) : null
      })))
    }
    fetchCourses()
    return () => { cancelled = true }
  }, [pageState])

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
    if (submittingRef.current) return
    submittingRef.current = true

    setSubmitting(true)
    setErrorMsg('')

    try {
      const signatureData = signaturePadRef.current.toDataURL('image/png')
      const studentUpdates: StudentUpdates = {
        name: formData.student_name.trim() || null,
        email: formData.student_email.trim() || null,
        phone: formData.student_phone.trim() || null,
        date_of_birth: formData.student_date_of_birth.trim() || null,
        address: formData.student_address.trim() || null,
        id_document: formData.student_id_document.trim() || null,
        instagram: formData.student_instagram.trim() ? (formData.student_instagram.startsWith('@') ? formData.student_instagram : `@${formData.student_instagram}`) : null,
        tiktok: formData.student_tiktok.trim() ? (formData.student_tiktok.startsWith('@') ? formData.student_tiktok : `@${formData.student_tiktok}`) : null,
        tutor_full_name: formData.tutor_full_name.trim() || null,
        tutor_id_document: formData.tutor_id_document.trim() || null,
      }
      const signedFormData: SignedFormData = {}
      if (formData.total_price.trim()) signedFormData.total_price = formData.total_price
      if (formData.enrollment_fee.trim()) signedFormData.enrollment_fee = formData.enrollment_fee
      signedFormData.payment_type = formData.payment_type
      if (formData.installments.trim()) signedFormData.installments = parseInt(formData.installments, 10) || null
      if (formData.installment_amount.trim()) signedFormData.installment_amount = formData.installment_amount
      if (wellbeingConsent) signedFormData.wellbeing_consent = wellbeingConsent
      if (wellbeingNotes.trim()) signedFormData.wellbeing_notes = wellbeingNotes.trim()

      const response = await contractService.signContract({
        signingToken: token,
        signatureData,
        signerName: formData.student_name.trim() || contract.student_name,
        signerEmail: formData.student_email.trim() || contract.student_email,
        userAgent: navigator.userAgent,
        deviceType: getDeviceType(),
        wellbeingNotes: wellbeingNotes.trim() || undefined,
        studentUpdates,
        signedFormData: Object.keys(signedFormData).length ? signedFormData : undefined,
      })

      if (response.success) {
        setSignedSignatureData(signatureData)
        setPageState('success')
      } else {
        setErrorMsg(response.error || 'Error al firmar el contrato')
        setPageState('error')
      }
    } catch {
      setErrorMsg('Error de conexion. Por favor intenta nuevamente.')
    } finally {
      setSubmitting(false)
      submittingRef.current = false
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

  // ─── Already Signed or Success: show full printable contract ───
  if ((pageState === 'signed' || pageState === 'success') && contract) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] print:bg-white">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="text-center mb-8 animate-fadeIn print:hidden">
            <div className="font-druk text-[#FFBE00] text-4xl tracking-wider mb-4">TAG</div>
            <div className="w-16 h-[2px] bg-[#FFBE00]/30 mx-auto mb-6" />
            <div className="w-20 h-20 rounded-full border-2 border-[#FFBE00] flex items-center justify-center mx-auto mb-4"
                 style={pageState === 'success' ? { animation: 'contractScaleIn 0.5s ease-out' } : undefined}>
              <svg className="w-10 h-10 text-[#FFBE00]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h1 className="font-garamond text-white/90 text-2xl mb-2">
              {pageState === 'success' ? 'Contrato firmado exitosamente' : 'Contrato firmado'}
            </h1>
            <p className="font-mdio text-white/40 text-sm leading-relaxed mb-4">
              {pageState === 'success'
                ? `Gracias, ${formData.student_name.trim() || contract.student_name}. Guarda o imprime tu copia abajo.`
                : `${contract.student_name}. Aquí tienes tu copia del contrato.`}
            </p>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-6 py-3 rounded-lg font-druk text-sm tracking-wider uppercase bg-[#FFBE00] text-[#0a0a0a] hover:bg-[#e5ab00] transition-colors print:hidden"
            >
              Imprimir contrato
            </button>
          </div>

          {/* Printable signed contract copy — use formData when just signed (success), else contract (and signed_form_data when loaded) */}
          <div ref={printRef} className="bg-[#fafaf8] text-[#0a0a0a] rounded-lg p-6 md:p-10 print:bg-white print:p-0 print:shadow-none">
            <div className="font-druk text-[#0a0a0a] text-xl tracking-wider mb-2">TAG</div>
            <div className="h-px bg-[#FFBE00] w-24 mb-6" />
            <div className="flex flex-wrap justify-between gap-4 mb-6">
              <div>
                <div className="font-mdio text-[#0a0a0a]/40 text-[10px] tracking-[0.15em] uppercase mb-1">Número de matrícula</div>
                <div className="font-garamond text-sm">{contract.enrollment_number || '—'}</div>
              </div>
              <div>
                <div className="font-mdio text-[#0a0a0a]/40 text-[10px] tracking-[0.15em] uppercase mb-1">Fecha de matrícula</div>
                <div className="font-garamond text-sm">
                  {contract.enrollment_date ? new Date(contract.enrollment_date).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }) : (contract.created_at ? new Date(contract.created_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—')}
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h2 className="font-druk text-[#0a0a0a] text-xs tracking-wide uppercase mb-3">1. Datos del alumno</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 font-garamond text-[#0a0a0a]/85 text-sm">
                <div><span className="text-[#0a0a0a]/50">Nombre completo:</span> {(pageState === 'success' ? formData.student_name : contract.student_name) || '—'}</div>
                <div><span className="text-[#0a0a0a]/50">DNI/NIE/Pasaporte:</span> {(pageState === 'success' ? formData.student_id_document : contract.student_id_document) || '—'}</div>
                <div><span className="text-[#0a0a0a]/50">Fecha de nacimiento:</span> {(pageState === 'success' ? formData.student_date_of_birth : contract.student_date_of_birth) ? new Date((pageState === 'success' ? formData.student_date_of_birth : contract.student_date_of_birth)!).toLocaleDateString('es-AR') : '—'}</div>
                <div><span className="text-[#0a0a0a]/50">Dirección:</span> {(pageState === 'success' ? formData.student_address : contract.student_address) || '—'}</div>
                <div className="sm:col-span-2"><span className="text-[#0a0a0a]/50">Email:</span> {(pageState === 'success' ? formData.student_email : contract.student_email) || '—'}</div>
                <div><span className="text-[#0a0a0a]/50">Teléfono:</span> {(pageState === 'success' ? formData.student_phone : contract.student_phone) || '—'}</div>
                <div><span className="text-[#0a0a0a]/50">Instagram:</span> {(pageState === 'success' ? formData.student_instagram : contract.student_instagram?.replace(/^@/, '')) ? `@${(pageState === 'success' ? formData.student_instagram : contract.student_instagram?.replace(/^@/, '') || '')}` : '—'}</div>
                <div><span className="text-[#0a0a0a]/50">TikTok:</span> {(pageState === 'success' ? formData.student_tiktok : contract.student_tiktok?.replace(/^@/, '')) ? `@${(pageState === 'success' ? formData.student_tiktok : contract.student_tiktok?.replace(/^@/, '') || '')}` : '—'}</div>
              </div>
            </div>
            <div className="mb-6">
              <h2 className="font-druk text-[#0a0a0a] text-xs tracking-wide uppercase mb-3">2. Datos del padre/madre/tutor (si el alumno es menor de edad)</h2>
              {(() => {
                const dobStr = pageState === 'success' ? formData.student_date_of_birth : contract.student_date_of_birth
                const birth = dobStr ? new Date(dobStr) : null
                const today = new Date()
                let age: number | null = null
                if (birth && !Number.isNaN(birth.getTime())) {
                  age = today.getFullYear() - birth.getFullYear()
                  if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--
                }
                const isMinor = age !== null && age < 18
                const tutorName = pageState === 'success' ? formData.tutor_full_name : contract.tutor_full_name
                const tutorDoc = pageState === 'success' ? formData.tutor_id_document : contract.tutor_id_document
                const hasTutorData = !!(tutorName?.trim() || tutorDoc?.trim())
                if (!isMinor) {
                  return <p className="font-garamond text-[#0a0a0a]/70 text-sm italic">No aplica — El alumno es mayor de edad.</p>
                }
                if (!hasTutorData) {
                  return <p className="font-garamond text-[#0a0a0a]/60 text-sm italic">Datos del padre/madre/tutor no facilitados.</p>
                }
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 font-garamond text-[#0a0a0a]/85 text-sm">
                    <div><span className="text-[#0a0a0a]/50">Nombre completo:</span> {tutorName || '—'}</div>
                    <div><span className="text-[#0a0a0a]/50">DNI/NIE/Pasaporte:</span> {tutorDoc || '—'}</div>
                  </div>
                )
              })()}
            </div>
            <div className="mb-6">
              <h2 className="font-druk text-[#0a0a0a] text-xs tracking-wide uppercase mb-3">3. Datos del curso</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 font-garamond text-[#0a0a0a]/85 text-sm">
                <div className="sm:col-span-2"><span className="text-[#0a0a0a]/50">Nombre del curso:</span> {(pageState === 'success' ? formData.course_name : contract.course_name) || '—'}</div>
                <div><span className="text-[#0a0a0a]/50">Horario:</span> {(pageState === 'success' ? formData.course_schedule : contract.course_schedule) || '—'}</div>
                <div><span className="text-[#0a0a0a]/50">Fecha de inicio:</span> {(pageState === 'success' ? formData.course_start_date : contract.course_start_date) ? new Date((pageState === 'success' ? formData.course_start_date : contract.course_start_date)!).toLocaleDateString('es-AR') : '—'}</div>
                <div><span className="text-[#0a0a0a]/50">Fecha de finalización:</span> {(pageState === 'success' ? formData.course_end_date : contract.course_end_date) ? new Date((pageState === 'success' ? formData.course_end_date : contract.course_end_date)!).toLocaleDateString('es-AR') : '—'}</div>
              </div>
            </div>
            {(pageState === 'success' && (formData.total_price || formData.enrollment_fee || formData.payment_type)) || (contract.signed_form_data && (contract.signed_form_data.total_price != null || contract.signed_form_data.enrollment_fee != null)) ? (
              <div className="mb-6">
                <h2 className="font-druk text-[#0a0a0a] text-xs tracking-wide uppercase mb-3">4. Precio y forma de pago</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 font-garamond text-[#0a0a0a]/85 text-sm">
                  <div><span className="text-[#0a0a0a]/50">Precio total del curso:</span> {(pageState === 'success' ? formData.total_price : contract.signed_form_data?.total_price) ?? '—'} €</div>
                  <div><span className="text-[#0a0a0a]/50">Matrícula:</span> {(pageState === 'success' ? formData.enrollment_fee : contract.signed_form_data?.enrollment_fee) ?? '—'} €</div>
                  <div className="sm:col-span-2"><span className="text-[#0a0a0a]/50">Forma de pago:</span> {(pageState === 'success' ? formData.payment_type : contract.signed_form_data?.payment_type) === 'pago_fraccionado' ? `Pago fraccionado${(pageState === 'success' ? formData.installments : contract.signed_form_data?.installments) ? ` (${pageState === 'success' ? formData.installments : contract.signed_form_data?.installments} cuotas de ${(pageState === 'success' ? formData.installment_amount : contract.signed_form_data?.installment_amount) ?? '—'} €)` : ''}` : 'Pago único'}</div>
                </div>
              </div>
            ) : null}
            <div className="h-px bg-[#0a0a0a]/10 mb-6" />
            <h2 className="font-druk text-[#0a0a0a] text-base tracking-wide uppercase mb-4">
              {contract.contract_title}
            </h2>
            <div className="font-garamond text-[#0a0a0a]/75 text-sm leading-[1.85] whitespace-pre-wrap mb-8">
              {contractBodyFromSection4(contract.contract_body).split('\n\n').map((paragraph, i) => (
                <p key={i} className="mb-4 last:mb-0">{paragraph}</p>
              ))}
            </div>
            <div className="h-px bg-[#0a0a0a]/10 mb-6" />
            <div className="mb-6">
              <div className="font-mdio text-[#0a0a0a]/40 text-[10px] tracking-[0.15em] uppercase mb-2">Firma del Alumno</div>
              {(signedSignatureData || contract.signature_data) && (
                <img src={signedSignatureData || contract.signature_data!} alt="Firma" className="max-w-xs h-20 object-contain object-left" />
              )}
              {contract.signed_at && (
                <p className="font-mdio text-[#0a0a0a]/30 text-xs mt-1">
                  Firmado el {contract.signed_at ? new Date(contract.signed_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="font-mdio text-[#0a0a0a]/40 text-[10px] tracking-[0.15em] uppercase mb-1">Por TAG</div>
                <img src="/signatures/firma-tony.png" alt="Firma Tony Corvillo" className="max-w-[180px] min-h-[56px] object-contain object-left mb-1 invert" />
                <div className="font-garamond text-[#0a0a0a]/70 text-sm">Tony Corvillo</div>
              </div>
              <div>
                <div className="font-mdio text-[#0a0a0a]/40 text-[10px] tracking-[0.15em] uppercase mb-1">Por TAG</div>
                <img src="/signatures/firma-andres.png" alt="Firma Andrés Vicente" className="max-w-[180px] min-h-[56px] object-contain object-left mb-1 invert" />
                <div className="font-garamond text-[#0a0a0a]/70 text-sm">Andrés Vicente</div>
              </div>
            </div>
          </div>

          <p className="font-mdio text-white/30 text-xs text-center mt-6 print:hidden">
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

        {/* Header: Número y fecha de matrícula */}
        <div className="flex flex-wrap justify-between gap-4 mb-8">
          <div>
            <div className="font-mdio text-[#0a0a0a]/40 text-[10px] tracking-[0.15em] uppercase mb-1">Número de matrícula</div>
            <div className="font-garamond text-[#0a0a0a] text-sm">{contract?.enrollment_number || '—'}</div>
          </div>
          <div>
            <div className="font-mdio text-[#0a0a0a]/40 text-[10px] tracking-[0.15em] uppercase mb-1">Fecha de matrícula</div>
            <div className="font-garamond text-[#0a0a0a] text-sm">
              {contract?.enrollment_date ? new Date(contract.enrollment_date).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }) : (contract?.created_at ? new Date(contract.created_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—')}
            </div>
          </div>
        </div>

        {/* 1. DATOS DEL ALUMNO — editable */}
        <div className="mb-8">
          <h2 className="font-druk text-[#0a0a0a] text-xs tracking-wide uppercase mb-4">1. Datos del alumno</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 font-garamond text-sm">
            <div>
              <label className="block text-[#0a0a0a]/50 mb-1">Nombre completo</label>
              <input type="text" className="rounded-lg border border-[#0a0a0a]/12 bg-white px-3 py-2 text-[#0a0a0a]/90 text-sm focus:border-[#FFBE00]/50 focus:outline-none focus:ring-1 focus:ring-[#FFBE00]/30 w-full" value={formData.student_name} onChange={e => setFormData(f => ({ ...f, student_name: e.target.value }))} placeholder="—" />
            </div>
            <div>
              <label className="block text-[#0a0a0a]/50 mb-1">DNI/NIE/Pasaporte</label>
              <input type="text" className="rounded-lg border border-[#0a0a0a]/12 bg-white px-3 py-2 text-[#0a0a0a]/90 text-sm focus:border-[#FFBE00]/50 focus:outline-none focus:ring-1 focus:ring-[#FFBE00]/30 w-full" value={formData.student_id_document} onChange={e => setFormData(f => ({ ...f, student_id_document: e.target.value }))} placeholder="—" />
            </div>
            <div>
              <label className="block text-[#0a0a0a]/50 mb-1">Fecha de nacimiento</label>
              <input type="date" className="rounded-lg border border-[#0a0a0a]/12 bg-white px-3 py-2 text-[#0a0a0a]/90 text-sm focus:border-[#FFBE00]/50 focus:outline-none focus:ring-1 focus:ring-[#FFBE00]/30 w-full" value={formData.student_date_of_birth} onChange={e => setFormData(f => ({ ...f, student_date_of_birth: e.target.value }))} />
            </div>
            <div>
              <label className="block text-[#0a0a0a]/50 mb-1">Dirección</label>
              <input type="text" className="rounded-lg border border-[#0a0a0a]/12 bg-white px-3 py-2 text-[#0a0a0a]/90 text-sm focus:border-[#FFBE00]/50 focus:outline-none focus:ring-1 focus:ring-[#FFBE00]/30 w-full" value={formData.student_address} onChange={e => setFormData(f => ({ ...f, student_address: e.target.value }))} placeholder="—" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[#0a0a0a]/50 mb-1">Email</label>
              <input type="email" className="rounded-lg border border-[#0a0a0a]/12 bg-white px-3 py-2 text-[#0a0a0a]/90 text-sm focus:border-[#FFBE00]/50 focus:outline-none focus:ring-1 focus:ring-[#FFBE00]/30 w-full" value={formData.student_email} onChange={e => setFormData(f => ({ ...f, student_email: e.target.value }))} placeholder="—" />
            </div>
            <div>
              <label className="block text-[#0a0a0a]/50 mb-1">Teléfono</label>
              <input type="tel" className="rounded-lg border border-[#0a0a0a]/12 bg-white px-3 py-2 text-[#0a0a0a]/90 text-sm focus:border-[#FFBE00]/50 focus:outline-none focus:ring-1 focus:ring-[#FFBE00]/30 w-full" value={formData.student_phone} onChange={e => setFormData(f => ({ ...f, student_phone: e.target.value }))} placeholder="—" />
            </div>
            <div>
              <label className="block text-[#0a0a0a]/50 mb-1">Instagram</label>
              <div className="flex items-center gap-1">
                <span className="text-[#0a0a0a]/50">@</span>
                <input type="text" className="rounded-lg border border-[#0a0a0a]/12 bg-white px-3 py-2 text-[#0a0a0a]/90 text-sm focus:border-[#FFBE00]/50 focus:outline-none focus:ring-1 focus:ring-[#FFBE00]/30 flex-1" value={formData.student_instagram} onChange={e => setFormData(f => ({ ...f, student_instagram: e.target.value }))} placeholder="—" />
              </div>
            </div>
            <div>
              <label className="block text-[#0a0a0a]/50 mb-1">TikTok</label>
              <div className="flex items-center gap-1">
                <span className="text-[#0a0a0a]/50">@</span>
                <input type="text" className="rounded-lg border border-[#0a0a0a]/12 bg-white px-3 py-2 text-[#0a0a0a]/90 text-sm focus:border-[#FFBE00]/50 focus:outline-none focus:ring-1 focus:ring-[#FFBE00]/30 flex-1" value={formData.student_tiktok} onChange={e => setFormData(f => ({ ...f, student_tiktok: e.target.value }))} placeholder="—" />
              </div>
            </div>
          </div>
        </div>

        {/* 2. DATOS DEL PADRE/MADRE/TUTOR — editable when minor */}
        <div className="mb-8">
          <h2 className="font-druk text-[#0a0a0a] text-xs tracking-wide uppercase mb-4">2. Datos del padre/madre/tutor (si el alumno es menor de edad)</h2>
          {(() => {
            const dobStr = formData.student_date_of_birth
            const birth = dobStr ? new Date(dobStr) : null
            const today = new Date()
            let age: number | null = null
            if (birth && !Number.isNaN(birth.getTime())) {
              age = today.getFullYear() - birth.getFullYear()
              if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--
            }
            const isMinor = age !== null && age < 18
            if (!isMinor) {
              return (
                <p className="font-garamond text-[#0a0a0a]/70 text-sm italic">
                  No aplica — El alumno es mayor de edad.
                </p>
              )
            }
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 font-garamond text-sm">
                <div>
                  <label className="block text-[#0a0a0a]/50 mb-1">Nombre completo</label>
                  <input type="text" className="rounded-lg border border-[#0a0a0a]/12 bg-white px-3 py-2 text-[#0a0a0a]/90 text-sm focus:border-[#FFBE00]/50 focus:outline-none focus:ring-1 focus:ring-[#FFBE00]/30 w-full" value={formData.tutor_full_name} onChange={e => setFormData(f => ({ ...f, tutor_full_name: e.target.value }))} placeholder="—" />
                </div>
                <div>
                  <label className="block text-[#0a0a0a]/50 mb-1">DNI/NIE/Pasaporte</label>
                  <input type="text" className="rounded-lg border border-[#0a0a0a]/12 bg-white px-3 py-2 text-[#0a0a0a]/90 text-sm focus:border-[#FFBE00]/50 focus:outline-none focus:ring-1 focus:ring-[#FFBE00]/30 w-full" value={formData.tutor_id_document} onChange={e => setFormData(f => ({ ...f, tutor_id_document: e.target.value }))} placeholder="—" />
                </div>
              </div>
            )
          })()}
        </div>

        {/* 3. DATOS DEL CURSO — editable */}
        <div className="mb-8">
          <h2 className="font-druk text-[#0a0a0a] text-xs tracking-wide uppercase mb-4">3. Datos del curso</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 font-garamond text-sm">
            <div className="sm:col-span-2">
              <label className="block text-[#0a0a0a]/50 mb-1">Nombre del curso</label>
              <select
                className="rounded-lg border border-[#0a0a0a]/12 bg-white px-3 py-2 text-[#0a0a0a]/90 text-sm focus:border-[#FFBE00]/50 focus:outline-none focus:ring-1 focus:ring-[#FFBE00]/30 w-full"
                value={formData.course_name}
                onChange={(e) => {
                  const name = e.target.value
                  const instance = activeCourses.find((c) => c.name === name)
                  setFormData((f) => ({
                    ...f,
                    course_name: name,
                    ...(instance && {
                      course_schedule: instance.schedule ?? f.course_schedule,
                      course_start_date: instance.start_date ?? f.course_start_date,
                      course_end_date: instance.end_date ?? f.course_end_date
                    })
                  }))
                }}
              >
                <option value="">— Selecciona un curso —</option>
                {activeCourses.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
                {formData.course_name && !activeCourses.some((c) => c.name === formData.course_name) && (
                  <option value={formData.course_name}>{formData.course_name}</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-[#0a0a0a]/50 mb-1">Horario</label>
              <input type="text" className="rounded-lg border border-[#0a0a0a]/12 bg-white px-3 py-2 text-[#0a0a0a]/90 text-sm focus:border-[#FFBE00]/50 focus:outline-none focus:ring-1 focus:ring-[#FFBE00]/30 w-full" value={formData.course_schedule} onChange={e => setFormData(f => ({ ...f, course_schedule: e.target.value }))} placeholder="—" />
            </div>
            <div>
              <label className="block text-[#0a0a0a]/50 mb-1">Fecha de inicio</label>
              <input type="date" className="rounded-lg border border-[#0a0a0a]/12 bg-white px-3 py-2 text-[#0a0a0a]/90 text-sm focus:border-[#FFBE00]/50 focus:outline-none focus:ring-1 focus:ring-[#FFBE00]/30 w-full" value={formData.course_start_date} onChange={e => setFormData(f => ({ ...f, course_start_date: e.target.value }))} />
            </div>
            <div>
              <label className="block text-[#0a0a0a]/50 mb-1">Fecha de finalización</label>
              <input type="date" className="rounded-lg border border-[#0a0a0a]/12 bg-white px-3 py-2 text-[#0a0a0a]/90 text-sm focus:border-[#FFBE00]/50 focus:outline-none focus:ring-1 focus:ring-[#FFBE00]/30 w-full" value={formData.course_end_date} onChange={e => setFormData(f => ({ ...f, course_end_date: e.target.value }))} />
            </div>
          </div>
        </div>

        {/* 4. PRECIO, FORMA DE PAGO — editable */}
        <div className="mb-8">
          <h2 className="font-druk text-[#0a0a0a] text-xs tracking-wide uppercase mb-4">4. Precio, forma de pago y condiciones</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 font-garamond text-sm">
            <div>
              <label className="block text-[#0a0a0a]/50 mb-1">Precio total del curso (€)</label>
              <input type="number" step="0.01" min="0" className="rounded-lg border border-[#0a0a0a]/12 bg-white px-3 py-2 text-[#0a0a0a]/90 text-sm focus:border-[#FFBE00]/50 focus:outline-none focus:ring-1 focus:ring-[#FFBE00]/30 w-full" value={formData.total_price} onChange={e => setFormData(f => ({ ...f, total_price: e.target.value }))} placeholder="—" />
            </div>
            <div>
              <label className="block text-[#0a0a0a]/50 mb-1">Matrícula (€)</label>
              <input type="number" step="0.01" min="0" className="rounded-lg border border-[#0a0a0a]/12 bg-white px-3 py-2 text-[#0a0a0a]/90 text-sm focus:border-[#FFBE00]/50 focus:outline-none focus:ring-1 focus:ring-[#FFBE00]/30 w-full" value={formData.enrollment_fee} onChange={e => setFormData(f => ({ ...f, enrollment_fee: e.target.value }))} placeholder="—" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[#0a0a0a]/50 mb-2">Forma de pago</label>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="payment_type" checked={formData.payment_type === 'pago_unico'} onChange={() => setFormData(f => ({ ...f, payment_type: 'pago_unico' }))} className="rounded-full border-[#0a0a0a]/30 text-[#FFBE00] focus:ring-[#FFBE00]/30" />
                  <span className="text-[#0a0a0a]/85">Pago único</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="payment_type" checked={formData.payment_type === 'pago_fraccionado'} onChange={() => setFormData(f => ({ ...f, payment_type: 'pago_fraccionado' }))} className="rounded-full border-[#0a0a0a]/30 text-[#FFBE00] focus:ring-[#FFBE00]/30" />
                  <span className="text-[#0a0a0a]/85">Pago fraccionado</span>
                </label>
              </div>
            </div>
            {formData.payment_type === 'pago_fraccionado' && (
              <>
                <div>
                  <label className="block text-[#0a0a0a]/50 mb-1">Número de cuotas</label>
                  <input type="number" min="1" className="rounded-lg border border-[#0a0a0a]/12 bg-white px-3 py-2 text-[#0a0a0a]/90 text-sm focus:border-[#FFBE00]/50 focus:outline-none focus:ring-1 focus:ring-[#FFBE00]/30 w-full" value={formData.installments} onChange={e => setFormData(f => ({ ...f, installments: e.target.value }))} placeholder="—" />
                </div>
                <div>
                  <label className="block text-[#0a0a0a]/50 mb-1">Importe por cuota (€)</label>
                  <input type="number" step="0.01" min="0" className="rounded-lg border border-[#0a0a0a]/12 bg-white px-3 py-2 text-[#0a0a0a]/90 text-sm focus:border-[#FFBE00]/50 focus:outline-none focus:ring-1 focus:ring-[#FFBE00]/30 w-full" value={formData.installment_amount} onChange={e => setFormData(f => ({ ...f, installment_amount: e.target.value }))} placeholder="—" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#0a0a0a]/8 mb-10 md:mb-12" />

        {/* Contract Title */}
        <h1 className="font-druk text-[#0a0a0a] text-lg md:text-xl tracking-wide uppercase mb-8 md:mb-10 leading-tight">
          {contract?.contract_title}
        </h1>

        {/* Contract Body: before 5.8, then editable 5.8 in place (point 5), then from 6 onward */}
        <div className="mb-10 md:mb-12">
          {(() => {
            const { before58, after58 } = splitBodyAt58(contract?.contract_body ?? '')
            const has58Section = before58 !== contractBodyFromSection4(contract?.contract_body) && after58 !== ''
            const fullBody = contractBodyFromSection4(contract?.contract_body)
            const editable58Block = (
              <div className="mb-6">
                <div className="font-druk text-[#0a0a0a] text-xs tracking-wide uppercase mb-2">
                  5.8. Información para tu bienestar:
                </div>
                <p className="text-[#0a0a0a]/70 text-sm mb-3">
                  En TAG trabajamos con ejercicios que pueden implicar intensidad emocional y física. Para adaptar nuestra metodología a tus necesidades y garantizar un entorno seguro de aprendizaje, te invitamos a compartir VOLUNTARIAMENTE:
                </p>
                <p className="text-[#0a0a0a]/60 text-sm mb-3">
                  ¿Hay algo sobre tu estado de salud (física o emocional) que consideres importante que conozcamos para adaptar las clases a tus necesidades?
                </p>
                <div className="space-y-3 mb-4">
                  <label className="flex items-start gap-3 cursor-pointer group select-none">
                    <input
                      type="checkbox"
                      checked={wellbeingConsent === 'authorize'}
                      onChange={() => setWellbeingConsent((prev) => (prev === 'authorize' ? null : 'authorize'))}
                      className="mt-1 rounded border-[#0a0a0a]/30 text-[#FFBE00] focus:ring-[#FFBE00]/30"
                    />
                    <span className="text-[#0a0a0a]/85 text-sm">
                      Autorizo expresamente a TAG a tratar esta información de salud con el único fin de adaptar la metodología pedagógica a mis necesidades.
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group select-none">
                    <input
                      type="checkbox"
                      checked={wellbeingConsent === 'decline'}
                      onChange={() => setWellbeingConsent((prev) => (prev === 'decline' ? null : 'decline'))}
                      className="mt-1 rounded border-[#0a0a0a]/30 text-[#FFBE00] focus:ring-[#FFBE00]/30"
                    />
                    <span className="text-[#0a0a0a]/85 text-sm">
                      No deseo compartir información en este momento.
                    </span>
                  </label>
                </div>
                <div className="mt-2">
                  <label className="block text-[#0a0a0a]/60 text-sm mb-1">Información que deseo compartir (opcional):</label>
                  <textarea
                    className="w-full rounded-lg border border-[#0a0a0a]/12 bg-white px-4 py-3 font-garamond text-sm text-[#0a0a0a]/85 placeholder-[#0a0a0a]/30 focus:border-[#FFBE00]/50 focus:outline-none focus:ring-1 focus:ring-[#FFBE00]/30"
                    rows={3}
                    value={wellbeingNotes}
                    onChange={(e) => setWellbeingNotes(e.target.value)}
                    placeholder="Ejemplos: ansiedad, lesiones físicas, limitaciones de movilidad..."
                  />
                </div>
                <p className="text-[#0a0a0a]/50 text-xs mt-3">
                  Esta información es VOLUNTARIA, CONFIDENCIAL (solo equipo docente) y para ADAPTAR la metodología. Puedes actualizarla en cualquier momento.
                </p>
              </div>
            )
            if (!has58Section) {
              return (
                <div className="font-garamond text-[#0a0a0a]/75 text-[15px] md:text-base leading-[1.85] whitespace-pre-wrap">
                  {fullBody.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="mb-5 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                  {editable58Block}
                </div>
              )
            }
            return (
              <div className="font-garamond text-[#0a0a0a]/75 text-[15px] md:text-base leading-[1.85]">
                {before58 && (
                  <div className="whitespace-pre-wrap mb-6">
                    {before58.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="mb-5 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
                {editable58Block}
                {after58 && (
                  <div className="whitespace-pre-wrap">
                    {after58.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="mb-5 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )
          })()}
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

        {/* TAG signatures (Tony & Andrés) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 mb-10 md:mb-12">
          <div>
            <div className="font-mdio text-[#0a0a0a]/30 text-[10px] tracking-[0.15em] uppercase mb-2">
              Por TAG
            </div>
            <img src="/signatures/firma-tony.png" alt="Firma Tony Corvillo" className="max-w-[180px] min-h-[56px] object-contain object-left mb-1 invert" />
            <div className="font-garamond text-[#0a0a0a]/70 text-sm">Tony Corvillo</div>
          </div>
          <div>
            <div className="font-mdio text-[#0a0a0a]/30 text-[10px] tracking-[0.15em] uppercase mb-2">
              Por TAG
            </div>
            <img src="/signatures/firma-andres.png" alt="Firma Andrés Vicente" className="max-w-[180px] min-h-[56px] object-contain object-left mb-1 invert" />
            <div className="font-garamond text-[#0a0a0a]/70 text-sm">Andrés Vicente</div>
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
