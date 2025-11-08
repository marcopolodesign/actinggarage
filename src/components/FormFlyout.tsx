import React, { useState, useEffect, useRef } from 'react';
import { useFormFlyout } from '../context/FormFlyoutContext';
import { submitForm } from '../api/submitForm';
import { gsap } from 'gsap';
import './FormFlyout.css';

interface FormData {
  name: string;
  phone: string;
  age: string;
  interests: string;
}

const FormFlyout: React.FC = () => {
  const { isOpen, closeFlyout } = useFormFlyout();
  const flyoutRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    age: '',
    interests: ''
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
    const age = urlParams.get('age') || '';
    const interests = urlParams.get('interests') || '';
    
    setUserEmail(email);
    if (name) {
      setFormData(prev => ({ ...prev, name }));
    }
    if (phone) {
      setFormData(prev => ({ ...prev, phone }));
    }
    if (age) {
      setFormData(prev => ({ ...prev, age }));
    }
    if (interests) {
      setFormData(prev => ({ ...prev, interests }));
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestChange = (interest: string) => {
    setFormData(prev => ({ ...prev, interests: interest }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log('Form data:', formData);
    console.log('User email:', userEmail);

    try {
      const result = await submitForm({
        ...formData,
        email: userEmail,
        source: 'email_campaign'
      });

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
            age: '',
            interests: ''
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

              {/* Phone and Age */}
              <div className="form-row">
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
                <div className="form-group">
                  <label htmlFor="age">EDAD</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
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