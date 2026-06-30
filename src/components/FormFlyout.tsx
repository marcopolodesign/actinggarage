import React, { useState, useEffect, useRef } from 'react';
import { useFormFlyout } from '../context/FormFlyoutContext';
import { submitForm } from '../api/submitForm';
import { upsertLead } from '../api/upsertLead';
import { getUtms } from '../utils/utm';
import { getMetaAttribution } from '../utils/metaAttribution';
import { supabase } from '../lib/supabase';
import { trackFormConversion } from '../utils/trackConversion';
import { computeAge } from '../utils/age';
import { gsap } from 'gsap';
import './FormFlyout.css';

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

interface FormData {
  name: string;
  phone: string;
  birthday: string;
  interests: string;
  gender: string;
  course: string;
}

const COURSES = [
  'Garage Pro',
  'Garage Theatre',
  'Garage Cinema',
  'Garage Hybrid',
  'Garage Hybrid Plus',
  'Garage Mini Kids',
  'Garage Kids',
  'Garage New Generation',
  'Garage New Generation Cámara',
  'Garage New Generation Hybrid',
  'Garage Evolution',
  'Garage Classic',
  'Garage Workshops'
];

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const FormFlyout: React.FC = () => {
  const { isOpen, closeFlyout } = useFormFlyout();
  const flyoutRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    birthday: '',
    interests: '',
    gender: '',
    course: ''
  });
  const [userEmail, setUserEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [crmRef, setCrmRef] = useState<{ name: string; id: string } | null>(null);

  // Ref always holds latest snapshot so pagehide/beforeunload closures can read it
  const pendingRef = useRef({ userEmail, formData, submitted });
  useEffect(() => {
    pendingRef.current = { userEmail, formData, submitted };
  }, [userEmail, formData, submitted]);

  // Get URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email') || '';
    const name = urlParams.get('name') || '';
    const phone = urlParams.get('phone') || '';
    const birthday = urlParams.get('birthday') || '';
    const interests = urlParams.get('interests') || '';
    const gender = urlParams.get('gender') || '';
    const course = urlParams.get('course') || '';

    setUserEmail(email);
    if (name) setFormData(prev => ({ ...prev, name }));
    if (phone) setFormData(prev => ({ ...prev, phone }));
    if (birthday) setFormData(prev => ({ ...prev, birthday }));
    if (interests) setFormData(prev => ({ ...prev, interests }));
    if (gender) setFormData(prev => ({ ...prev, gender }));
    if (course) setFormData(prev => ({ ...prev, course }));
  }, []);

  // GSAP animations
  useEffect(() => {
    if (isOpen) {
      gsap.set(flyoutRef.current, { x: '-100%' });
      gsap.set(overlayRef.current, { opacity: 0 });

      const tl = gsap.timeline();
      tl.to(overlayRef.current, { opacity: 1, duration: 0.3 })
        .to(flyoutRef.current, { x: '0%', duration: 0.4, ease: 'power2.out' }, '-=0.1');

      setTimeout(() => {
        if (typeof window !== 'undefined' && typeof window.fbq !== 'undefined') {
          try {
            window.fbq('trackCustom', 'FormStart', {
              content_name: 'Contact Form',
              content_category: 'Lead Generation'
            });
            console.log('Meta Pixel: FormStart event tracked');
          } catch (error) {
            console.error('Meta Pixel: Error tracking FormStart', error);
          }
        } else {
          console.warn('Meta Pixel: fbq not available for FormStart tracking');
        }
      }, 100);
    } else {
      if (flyoutRef.current && overlayRef.current) {
        const tl = gsap.timeline();
        tl.to(flyoutRef.current, { x: '-100%', duration: 0.3, ease: 'power2.in' })
          .to(overlayRef.current, { opacity: 0, duration: 0.2 }, '-=0.1');
      }
    }
  }, [isOpen]);

  // Upsert abandon lead on tab close / navigation away (sendBeacon path)
  useEffect(() => {
    if (!isOpen) return;

    const handlePageHide = () => {
      const { userEmail: email, formData: fd, submitted: wasSubmitted } = pendingRef.current;
      if (wasSubmitted || !isValidEmail(email)) return;

      const { utm_source, utm_medium, utm_campaign, utm_id } = getUtms();
      const data = {
        email:        email.trim().toLowerCase(),
        name:         fd.name         || null,
        phone:        fd.phone        || null,
        birthday:     fd.birthday     || null,
        age:          computeAge(fd.birthday) || null,
        interests:    fd.interests    || null,
        gender:       fd.gender       || null,
        course:       fd.course       || null,
        source:       'website_form',
        utm_source:   utm_source      || null,
        utm_medium:   utm_medium      || 'organic',
        utm_campaign: utm_campaign    || null,
        utm_id:       utm_id          || null,
      };

      navigator.sendBeacon(
        '/api/upsert-lead',
        new Blob([JSON.stringify(data)], { type: 'application/json' })
      );
    };

    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('beforeunload', handlePageHide);

    return () => {
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('beforeunload', handlePageHide);
    };
  }, [isOpen]);

  // Build the abandon payload and fire upsertLead (used on X button / backdrop close)
  const flushAbandon = () => {
    if (submitted || !isValidEmail(userEmail)) return;
    const { utm_source, utm_medium, utm_campaign, utm_id } = getUtms();
    upsertLead({
      email:        userEmail.trim().toLowerCase(),
      name:         formData.name         || undefined,
      phone:        formData.phone        || undefined,
      birthday:     formData.birthday     || undefined,
      age:          computeAge(formData.birthday) || undefined,
      interests:    formData.interests    || undefined,
      gender:       formData.gender       || undefined,
      course:       formData.course       || undefined,
      source:       'website_form',
      utm_source:   utm_source            || undefined,
      utm_medium:   utm_medium            || 'organic',
      utm_campaign: utm_campaign          || undefined,
      utm_id:       utm_id               || undefined,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const { name, value } = target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestChange = (interest: string) => {
    setFormData(prev => ({ ...prev, interests: interest }));
  };

  const handleClose = () => {
    flushAbandon();
    closeFlyout();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { utm_source, utm_medium, utm_campaign, utm_id } = getUtms();
    const { fbc, fbp } = getMetaAttribution();
    const source = 'website_form';
    const currentUtmParams = { utm_source, utm_medium, utm_campaign, utm_id };

    // Generate event_id before submit so Pixel and CAPI share the same ID (deduplication)
    const event_id = crypto.randomUUID();

    const birthdayForSubmit = formData.birthday || '';
    const calculatedAge = computeAge(formData.birthday);

    const submissionData = {
      ...formData,
      birthday: birthdayForSubmit,
      age: calculatedAge,
      email: userEmail,
      source,
      ...currentUtmParams
    };

    try {
      const result = await submitForm(submissionData);

      if (result.success) {
        setSubmitted(true);

        // Fetch CRM entry to show verification to the user (non-blocking)
        supabase
          .from('prospects')
          .select('id, name')
          .eq('email', userEmail.trim().toLowerCase())
          .order('created_at', { ascending: false })
          .limit(1)
          .then(({ data }) => {
            if (data?.[0]) setCrmRef({ id: data[0].id.slice(0, 8).toUpperCase(), name: data[0].name });
          });

        trackFormConversion({ email: userEmail, phone: formData.phone, name: formData.name });

        if (typeof window !== 'undefined' && typeof window.fbq !== 'undefined') {
          try {
            const PIXEL_ID = '834745809170874';
            // Re-init with advanced matching so Meta can match this lead to a user profile
            window.fbq('init', PIXEL_ID, {
              em: userEmail.trim().toLowerCase(),
              ph: formData.phone.replace(/[\s\-\(\)]/g, ''),
            });

            const leadParams: any = {
              content_name: 'Contact Form Submission',
              content_category: 'Lead Generation',
              content_type: 'form',
              status: true
            };
            if (formData.course) {
              leadParams.content_ids = [formData.course];
            }
            // Pass event_id so Meta deduplicates with the CAPI call below
            window.fbq('track', 'Lead', leadParams, { eventID: event_id });
            console.log('Meta Pixel: Lead event tracked', { ...leadParams, event_id });
          } catch (error) {
            console.error('Meta Pixel: Error tracking Lead', error);
          }
        } else {
          console.warn('Meta Pixel: fbq not available for Lead tracking');
        }

        // Fire CAPI server-side (non-blocking — don't await)
        fetch('https://pyiypxvvruwvwfcsprrb.supabase.co/functions/v1/capi-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_id,
            email: userEmail.trim().toLowerCase(),
            phone: formData.phone || undefined,
            fbc,
            fbp,
            client_user_agent: navigator.userAgent,
            event_source_url: window.location.href,
          }),
        }).catch(err => console.warn('CAPI call failed (non-critical):', err));

        setTimeout(() => {
          setSubmitted(false);
          setCrmRef(null);
          closeFlyout();
          setFormData({
            name: '',
            phone: '',
            birthday: '',
            interests: '',
            gender: '',
            course: ''
          });
          setUserEmail('');
        }, 4000);
      } else {
        throw new Error(result.message);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="flyout-overlay"
      onClick={handleOverlayClick}
    >
      <div ref={flyoutRef} className="flyout-container bg-tag-yellow">
        {submitted ? (
          <div className="success-container">
            <div className="success-content">
              <h1>¡Gracias{formData.name ? `, ${formData.name.split(' ')[0]}` : ''}!</h1>
              <p>Hemos recibido tu información y nos pondremos en contacto contigo pronto.</p>
              {crmRef && (
                <div style={{
                  marginTop: '1.5rem',
                  padding: '1rem 1.25rem',
                  background: 'rgba(0,0,0,0.08)',
                  borderRadius: '8px',
                  textAlign: 'left',
                }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.4rem', opacity: 0.6 }}>
                    SOLICITUD VERIFICADA ✓
                  </p>
                  <p style={{ fontSize: '0.85rem', margin: 0 }}>
                    <strong>{crmRef.name}</strong> — ref. <code style={{ fontSize: '0.8rem' }}>#{crmRef.id}</code>
                  </p>
                  <p style={{ fontSize: '0.75rem', marginTop: '0.3rem', opacity: 0.7, margin: '0.3rem 0 0' }}>
                    Te contactaremos en las próximas 24–48h.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flyout-header">
              <button className="close-button" onClick={handleClose}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <h1 className="greeting">HOLA {formData.name.toUpperCase() || 'Tu'}!</h1>
              <p className="subtitle">Qué bueno que tengas ganas de sumarte a TAG!</p>
            </div>

            <form onSubmit={handleSubmit} className="flyout-form">
              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email">EMAIL</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                  className="form-input"
                  placeholder="tu@email.com"
                />
              </div>

              {/* Name Field */}
              <div className="form-group">
                <label htmlFor="name">NOMBRE Y APELLIDO</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>

              {/* Phone */}
              <div className="form-group">
                <label htmlFor="phone">TELÉFONO</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>

              {/* Birthday */}
              <div className="form-group">
                <label htmlFor="birthday">FECHA DE NACIMIENTO</label>
                <input
                  type="date"
                  id="birthday"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>

              {/* Interests */}
              <div className="form-group">
                <label>¿CUÁLES SON TUS INTERESES?</label>
                <div className="interests-container">
                  <button
                    type="button"
                    className={`interest-button ${formData.interests === 'teatro' ? 'selected' : ''}`}
                    onClick={() => handleInterestChange('teatro')}
                  >
                    TEATRO
                  </button>
                  <button
                    type="button"
                    className={`interest-button ${formData.interests === 'cine' ? 'selected' : ''}`}
                    onClick={() => handleInterestChange('cine')}
                  >
                    CINE
                  </button>
                  <button
                    type="button"
                    className={`interest-button ${formData.interests === 'teatro-cine' ? 'selected' : ''}`}
                    onClick={() => handleInterestChange('teatro-cine')}
                  >
                    TEATRO & CINE
                  </button>
                </div>
              </div>

              {/* Gender */}
              <div className="form-group">
                <label htmlFor="gender">GÉNERO</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Seleccionar...</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="no_especificado">No especificado</option>
                </select>
              </div>

              {/* Course */}
              <div className="form-group">
                <label htmlFor="course">¿QUÉ CURSO TE INTERESA?</label>
                <select
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Seleccionar curso (opcional)...</option>
                  {COURSES.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !formData.interests}
                className="submit-button"
              >
                {isSubmitting ? 'ENVIANDO...' : 'ENVIAR'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default FormFlyout;
