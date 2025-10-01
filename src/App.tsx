import React, { useState, useEffect } from 'react';
import './App.css';
import { submitForm } from './api/submitForm';

interface FormData {
  name: string;
  phone: string;
  age: string;
  interests: string;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    age: '',
    interests: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');

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

    // Debug: Log the data being submitted
    console.log('Form data:', formData);
    console.log('User email:', userEmail);
    console.log('Complete submission data:', {
      ...formData,
      email: userEmail,
      source: 'email_campaign'
    });

    try {
      // Use production API with real Mailchimp integration
      const result = await submitForm({
        ...formData,
        email: userEmail,
        source: 'email_campaign'
      });

      if (result.success) {
        setSubmitted(true);
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="success-container">
        <div className="success-content">
          <h1>¡Gracias por tu interés!</h1>
          <p>Hemos recibido tu información y nos pondremos en contacto contigo pronto.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        {/* Left Column - Form */}
        <div className="form-section">
          <div className="form-header">
            <h1 className="greeting">HOLA {formData.name.toUpperCase()}!</h1>
            <p className="subtitle">Qué bueno que tengas ganas de sumarte a TAG!</p>
          </div>

          <form onSubmit={handleSubmit} className="form">
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
                <label htmlFor="phone">TELEFONO</label>
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
        </div>

        {/* Right Column - Branding */}
        <div className="branding-section">
          <div className="contact-info">
            <p>9333 98307</p>
            <p>+34 682 56 01 87</p>
            <p>hola@theactinggarage.com</p>
          </div>
          
          <div className="brand-content">
            <h1 className="brand-title">THE ACTING GARAGE</h1>
            <p className="brand-subtitle">ESPACIO DE TRANSFORMACIÓN CREATIVA</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;