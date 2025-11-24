import React, { useState, useEffect, useRef } from 'react';
import { useFormFlyout } from '../context/FormFlyoutContext';
import { submitForm } from '../api/submitForm';
import { gsap } from 'gsap';
import './FormFlyout.css';

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
  'Garage Kids',
  'Garage New Generation',
  'Garage New Generation Hybrid',
  'Garage Evolution',
  'Garage Classic',
  'Garage Workshops'
];

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
    if (name) {
      setFormData(prev => ({ ...prev, name }));
    }
    if (phone) {
      setFormData(prev => ({ ...prev, phone }));
    }
    if (birthday) {
      setFormData(prev => ({ ...prev, birthday }));
    }
    if (interests) {
      setFormData(prev => ({ ...prev, interests }));
    }
    if (gender) {
      setFormData(prev => ({ ...prev, gender }));
    }
    if (course) {
      setFormData(prev => ({ ...prev, course }));
    }
  }, []);

  // GSAP animations
  useEffect(() => {
    if (isOpen) {
      gsap.set(flyoutRef.current, { x: '-100%' });
      gsap.set(overlayRef.current, { opacity: 0 });
      
      const tl = gsap.timeline();
      tl.to(overlayRef.current, { opacity: 1, duration: 0.3 })
        .to(flyoutRef.current, { x: '0%', duration: 0.4, ease: 'power2.out' }, '-=0.1');
    } else {
      if (flyoutRef.current && overlayRef.current) {
        const tl = gsap.timeline();
        tl.to(flyoutRef.current, { x: '-100%', duration: 0.3, ease: 'power2.in' })
          .to(overlayRef.current, { opacity: 0, duration: 0.2 }, '-=0.1');
      }
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const { name, value } = target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestChange = (interest: string) => {
    setFormData(prev => ({ ...prev, interests: interest }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Capture UTM parameters fresh at submission time
    const urlParams = new URLSearchParams(window.location.search);
    const utm_source = urlParams.get('utm_source') || '';
    const utm_medium = urlParams.get('utm_medium') || 'organic'; // Default to 'organic' if not present
    const utm_campaign = urlParams.get('utm_campaign') || '';
    const utm_id = urlParams.get('utm_id') || '';
    
    // Source is always 'website_form' for contact form submissions
    const source = 'website_form';

    const currentUtmParams = {
      utm_source,
      utm_medium,
      utm_campaign,
      utm_id,
    };

    // Format birthday from YYYY-MM-DD to MM/DD
    let formattedBirthday = '';
    if (formData.birthday) {
      const date = new Date(formData.birthday);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      formattedBirthday = `${month}/${day}`;
    }

    console.log('Form data:', formData);
    console.log('User email:', userEmail);
    console.log('UTM params:', currentUtmParams);
    console.log('Source:', source);
    console.log('Formatted birthday:', formattedBirthday);

    const submissionData = {
      ...formData,
      birthday: formattedBirthday,
      email: userEmail,
      source,
      ...currentUtmParams
    };

    console.log('Full submission data with UTMs:', submissionData);

    try {
      const result = await submitForm(submissionData);

      if (result.success) {
        setSubmitted(true);
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
          window.gtag('event', 'conversion', {
            send_to: 'AW-17688095812/dXncCM7MhLsbEMTYq_JB',
          });
        }
        setTimeout(() => {
          setSubmitted(false);
          closeFlyout();
          // Reset form
          setFormData({
            name: '',
            phone: '',
            birthday: '',
            interests: '',
            gender: '',
            course: ''
          });
          setUserEmail('');
        }, 2000);
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
      closeFlyout();
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
              <h1>¡Gracias por tu interés!</h1>
              <p>Hemos recibido tu información y nos pondremos en contacto contigo pronto.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flyout-header">
              <button className="close-button" onClick={closeFlyout}>
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