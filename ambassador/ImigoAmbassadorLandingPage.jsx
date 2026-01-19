import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import * as portefeuilleAgentService from '../features/portefeuilleAgent/services/portefeuilleAgentService'
import '../App.css'

export default function ImigoAmbassadorLandingPage() {
  const [searchParams] = useSearchParams()
  const [hoveredButton, setHoveredButton] = useState(null)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: ''
  })
  const [checkboxes, setCheckboxes] = useState({
    acceptContact: false,
    watchedVideo: false
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('')
  const [videoLoaded, setVideoLoaded] = useState(false) // For lazy loading YouTube iframe

  // Get UTM parameters from URL
  const utmSource = searchParams.get('utm_source') || ''
  const utmMedium = searchParams.get('utm_medium') || ''
  const utmCampaign = searchParams.get('utm_campaign') || ''
  const agent = searchParams.get('agent') || ''
  const assignedUser = searchParams.get('assigned_user') || ''
  const formOnly = searchParams.get('form_only') === 'true' // Show only form, not full landing page

  // Lazy load YouTube iframe when video section is near viewport
  useEffect(() => {
    if (formOnly || videoLoaded) return // Skip if form-only mode or already loaded

    const videoContainer = document.querySelector('.video-container')
    if (!videoContainer) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVideoLoaded(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '200px' // Start loading 200px before it comes into view
      }
    )

    observer.observe(videoContainer)

    return () => {
      observer.disconnect()
    }
  }, [formOnly, videoLoaded])

  // Scroll to form when clicking CTA buttons
  const scrollToForm = () => {
    const formSection = document.getElementById('agent-registration-form')
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (submitStatus === 'error') {
      setSubmitStatus(null)
      setErrorMessage('')
    }
  }

  const handleCheckboxChange = (name) => {
    setCheckboxes(prev => ({ ...prev, [name]: !prev[name] }))
    // Clear error when user checks/unchecks
    if (submitStatus === 'error') {
      setSubmitStatus(null)
      setErrorMessage('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    // Validate checkboxes
    if (!checkboxes.acceptContact || !checkboxes.watchedVideo) {
      setSubmitStatus('error')
      setErrorMessage('Veuillez accepter les deux conditions pour continuer.')
      return
    }

    // Validate form fields
    if (!formData.full_name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setSubmitStatus('error')
      setErrorMessage('Veuillez remplir tous les champs obligatoires.')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email.trim())) {
      setSubmitStatus('error')
      setErrorMessage('Veuillez entrer une adresse email valide.')
      return
    }

    setSubmitting(true)
    setSubmitStatus(null)

    try {
      // Prepare agent request data
      const requestData = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        submitted_by: null, // Public form, no user ID
        utm_source: utmSource || null,
        utm_medium: utmMedium || null,
        utm_campaign: utmCampaign || null,
        agent: agent || null,
        assigned_user_id: assignedUser || null
      }

      const { data, error } = await portefeuilleAgentService.submitAgentRequest(requestData)

      if (error) {
        setSubmitStatus('error')
        setErrorMessage(error.message || 'Une erreur est survenue. Veuillez réessayer.')
      } else {
        setSubmitStatus('success')
        // Reset form
        setFormData({ full_name: '', email: '', phone: '' })
        setCheckboxes({ acceptContact: false, watchedVideo: false })
        // Scroll to success message
        setTimeout(() => {
          const formSection = document.getElementById('agent-registration-form')
          if (formSection) {
            formSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
        
        // Redirect to imigoimmigration.com after 2 seconds
        setTimeout(() => {
          try {
            // Try to redirect the parent page (if in iframe)
            if (window.top && window.top !== window.self) {
              window.top.location.href = 'https://imigoimmigration.com'
            } else {
              // If not in iframe, redirect normally
              window.location.href = 'https://imigoimmigration.com'
            }
          } catch (e) {
            // If cross-origin restrictions prevent top access, try parent
            try {
              window.parent.location.href = 'https://imigoimmigration.com'
            } catch (e2) {
              // Fallback to normal redirect
              window.location.href = 'https://imigoimmigration.com'
            }
          }
        }, 2000)
      }
    } catch (error) {
      console.error('Error submitting agent request:', error)
      setSubmitStatus('error')
      setErrorMessage('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setSubmitting(false)
    }
  }

  // If form_only mode, show only the form section
  if (formOnly) {
    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        background: '#f9fafb',
        fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        padding: '60px 20px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        overflow: 'visible',
        boxSizing: 'border-box'
      }}>
        <div style={{
          maxWidth: '600px',
          width: '100%',
          background: 'white',
          borderRadius: '20px',
          padding: '50px 40px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          boxSizing: 'border-box',
          overflow: 'visible'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1D2133',
            marginTop: '0',
            marginBottom: '30px',
            paddingTop: '0',
            textAlign: 'center',
            lineHeight: '1.3'
          }}>
            Candidater au programme Ambassadeur
          </h2>
          
          {/* Form */}
          <form onSubmit={handleSubmit}>
            {submitStatus === 'success' && (
              <div style={{
                background: '#10b981',
                color: 'white',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '30px',
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                ✅ Votre candidature a été envoyée avec succès ! Nous vous contacterons bientôt.
              </div>
            )}

            {submitStatus === 'error' && (
              <div style={{
                background: '#ef4444',
                color: 'white',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '30px',
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                ❌ {errorMessage}
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="full_name" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1D2133' }}>
                Nom complet *
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1D2133' }}>
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '30px' }}>
              <label htmlFor="phone" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1D2133' }}>
                Téléphone *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>

            {/* Mandatory Checkboxes */}
            <div style={{ marginBottom: '30px', padding: '20px', background: '#f9fafb', borderRadius: '12px', border: '2px solid #e5e7eb' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={checkboxes.acceptContact}
                    onChange={() => handleCheckboxChange('acceptContact')}
                    style={{
                      width: '20px',
                      height: '20px',
                      marginTop: '2px',
                      cursor: 'pointer',
                      accentColor: '#D43C14'
                    }}
                  />
                  <span style={{ fontSize: '16px', color: '#1D2133', lineHeight: '1.5' }}>
                    J'accepte être contacté par Imigo *
                  </span>
                </label>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={checkboxes.watchedVideo}
                    onChange={() => handleCheckboxChange('watchedVideo')}
                    style={{
                      width: '20px',
                      height: '20px',
                      marginTop: '2px',
                      cursor: 'pointer',
                      accentColor: '#D43C14'
                    }}
                  />
                  <span style={{ fontSize: '16px', color: '#1D2133', lineHeight: '1.5' }}>
                    J'ai bien vu la vidéo *
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                background: submitting ? '#9ca3af' : 'linear-gradient(135deg, #D43C14 0%, #ff6b3d 100%)',
                color: 'white',
                fontSize: '18px',
                fontWeight: '700',
                padding: '18px 40px',
                border: 'none',
                borderRadius: '12px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: submitting ? 'none' : '0 10px 30px rgba(212, 60, 20, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              {submitting ? 'Envoi en cours...' : 'Envoyer ma candidature'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: '#ffffff',
      fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      overflowX: 'hidden'
    }}>
      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .hero-title {
            font-size: 48px !important;
          }
          .hero-subtitle {
            font-size: 18px !important;
          }
          .section-title {
            font-size: 36px !important;
          }
          .nav-container {
            padding: 16px 20px !important;
          }
          .nav-logo {
            font-size: 24px !important;
          }
          .nav-button {
            padding: 10px 24px !important;
            font-size: 14px !important;
          }
          .hero-section {
            padding: 100px 20px 60px !important;
          }
          .section-padding {
            padding: 60px 20px !important;
          }
          #agent-registration-form {
            padding: 80px 20px 100px 20px !important;
          }
          #agent-registration-form form {
            padding: 40px 30px !important;
          }
          .benefits-grid {
            grid-template-columns: 1fr !important;
          }
          .steps-grid {
            grid-template-columns: 1fr !important;
          }
          .role-grid {
            grid-template-columns: 1fr !important;
          }
          .offers-grid {
            grid-template-columns: 1fr !important;
          }
          .cta-button {
            font-size: 16px !important;
            padding: 16px 36px !important;
          }
          .video-container {
            height: 300px !important;
          }
          .footer-grid {
            flex-direction: column !important;
            gap: 20px !important;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 36px !important;
          }
          .section-title {
            font-size: 28px !important;
          }
        }
      `}</style>

      {/* Navigation Bar */}
      <nav className="nav-container" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(29, 33, 51, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '20px 60px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000,
        borderBottom: '1px solid rgba(212, 60, 20, 0.2)'
      }}>
        <div className="nav-logo" style={{
          fontSize: '32px',
          fontWeight: '900',
          color: '#D43C14',
          letterSpacing: '2px'
        }}>
          IMIGO
        </div>
        <button
          className="nav-button"
          onMouseEnter={() => setHoveredButton('nav')}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={scrollToForm}
          style={{
            background: hoveredButton === 'nav' ? '#ff6b3d' : '#D43C14',
            color: 'white',
            fontSize: '16px',
            fontWeight: '700',
            padding: '12px 32px',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          Je candidate
        </button>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1D2133 0%, #0f1219 100%)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 60px 80px',
        marginTop: 0
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(212, 60, 20, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212, 60, 20, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          opacity: 0.3
        }} />

        {/* Decorative Circles */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(212, 60, 20, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)'
        }} />

        <div style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1200px',
          textAlign: 'center'
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(212, 60, 20, 0.15)',
            border: '2px solid rgba(212, 60, 20, 0.3)',
            borderRadius: '50px',
            padding: '12px 28px',
            marginBottom: '40px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#D43C14',
              boxShadow: '0 0 10px rgba(212, 60, 20, 0.6)'
            }} />
            <span style={{
              color: '#D43C14',
              fontSize: '16px',
              fontWeight: '700',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>
              Programme Exclusif
            </span>
          </div>

          {/* Main Title */}
          <h1 className="hero-title" style={{
            fontSize: '72px',
            fontWeight: '900',
            color: '#ffffff',
            margin: '0 0 20px 0',
            lineHeight: '1.1',
            letterSpacing: '-2px'
          }}>
            Devenez Ambassadeur
          </h1>
          <h1 className="hero-title" style={{
            fontSize: '72px',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #D43C14 0%, #ff6b3d 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 30px 0',
            lineHeight: '1.1',
            letterSpacing: '-2px'
          }}>
            Imigo Immigration
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle" style={{
            fontSize: '24px',
            color: '#b8bdd0',
            margin: '0 0 50px 0',
            lineHeight: '1.6',
            fontWeight: '400',
            maxWidth: '900px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Aidez votre réseau à concrétiser un projet Canada
          </p>

          <p className="hero-subtitle" style={{
            fontSize: '20px',
            color: '#7d8398',
            margin: '0 0 60px 0',
            lineHeight: '1.6',
            fontWeight: '400',
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Un programme simple, transparent et professionnel : vous recommandez, nous gérons tout le reste
          </p>

          {/* Benefits */}
          <div className="benefits-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            marginBottom: '60px',
            maxWidth: '1000px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(212, 60, 20, 0.2)',
              borderRadius: '16px',
              padding: '30px',
              textAlign: 'left'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'rgba(212, 60, 20, 0.1)',
                border: '2px solid rgba(212, 60, 20, 0.3)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D43C14" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#ffffff',
                margin: '0 0 10px 0'
              }}>
                Rôle simple
              </h3>
              <p style={{
                fontSize: '15px',
                color: '#b8bdd0',
                margin: 0,
                lineHeight: '1.6'
              }}>
                Recommandation & mise en relation (aucun travail technique)
              </p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(212, 60, 20, 0.2)',
              borderRadius: '16px',
              padding: '30px',
              textAlign: 'left'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'rgba(212, 60, 20, 0.1)',
                border: '2px solid rgba(212, 60, 20, 0.3)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D43C14" strokeWidth="2.5">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#ffffff',
                margin: '0 0 10px 0'
              }}>
                Traçabilité
              </h3>
              <p style={{
                fontSize: '15px',
                color: '#b8bdd0',
                margin: 0,
                lineHeight: '1.6'
              }}>
                Lien personnalisé + suivi clair de vos recommandations
              </p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(212, 60, 20, 0.2)',
              borderRadius: '16px',
              padding: '30px',
              textAlign: 'left'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'rgba(212, 60, 20, 0.1)',
                border: '2px solid rgba(212, 60, 20, 0.3)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D43C14" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <polyline points="2 17 12 22 22 17"/>
                  <polyline points="2 12 12 17 22 12"/>
                </svg>
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#ffffff',
                margin: '0 0 10px 0'
              }}>
                Sérieux
              </h3>
              <p style={{
                fontSize: '15px',
                color: '#b8bdd0',
                margin: 0,
                lineHeight: '1.6'
              }}>
                Cabinet basé à Casablanca depuis 7 ans + bureau à Tanger
              </p>
            </div>
          </div>

          {/* CTA */}
          <button
            className="cta-button"
            onMouseEnter={() => setHoveredButton('hero')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={scrollToForm}
            style={{
              background: hoveredButton === 'hero' 
                ? 'linear-gradient(135deg, #ff6b3d 0%, #D43C14 100%)'
                : 'linear-gradient(135deg, #D43C14 0%, #ff6b3d 100%)',
              color: 'white',
              fontSize: '20px',
              fontWeight: '700',
              padding: '20px 50px',
              border: 'none',
              borderRadius: '60px',
              cursor: 'pointer',
              boxShadow: '0 15px 40px rgba(212, 60, 20, 0.4)',
              transition: 'all 0.3s ease',
              transform: hoveredButton === 'hero' ? 'translateY(-2px)' : 'translateY(0)'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" style={{ marginRight: '10px', verticalAlign: 'middle' }}>
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Je regarde la vidéo & je candidate
          </button>
        </div>
      </section>

      {/* Video Section */}
      <section className="section-padding" style={{
        padding: '100px 60px',
        background: '#1D2133',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(212, 60, 20, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212, 60, 20, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          opacity: 0.3
        }} />
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10
        }}>
          <h2 className="section-title" style={{
            fontSize: '48px',
            fontWeight: '900',
            color: '#ffffff',
            margin: '0 0 20px 0'
          }}>
            Regardez cette vidéo (2 minutes)
          </h2>
          <p className="hero-subtitle" style={{
            fontSize: '20px',
            color: '#b8bdd0',
            margin: '0 0 50px 0',
            lineHeight: '1.6'
          }}>
            Le rôle exact de l'Ambassadeur
          </p>

          <p className="hero-subtitle" style={{
            fontSize: '18px',
            color: '#b8bdd0',
            margin: '0 0 50px 0',
            lineHeight: '1.6',
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            En moins de 2 minutes, je vous explique : le concept, votre rôle, comment vous êtes rémunéré, et les prochaines étapes.
          </p>

          {/* YouTube Video Embed - Optimized with lazy loading */}
          <div className="video-container" style={{
            width: '100%',
            maxWidth: '900px',
            height: '506px',
            margin: '0 auto',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            border: '4px solid #D43C14',
            position: 'relative',
            background: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {videoLoaded ? (
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/ZitdmF-QnnE"
                title="Imigo Ambassador Program"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%'
                }}
              />
            ) : (
              // Placeholder with play button - loads instantly
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1D2133 0%, #0f1219 100%)',
                cursor: 'pointer'
              }}
              onClick={() => setVideoLoaded(true)}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(212, 60, 20, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 30px rgba(212, 60, 20, 0.5)',
                  transition: 'transform 0.2s'
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                    <polygon points="8 5 19 12 8 19 8 5"/>
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding" style={{
        padding: '100px 60px',
        background: '#0f1219',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10
        }}>
          <h2 className="section-title" style={{
            fontSize: '48px',
            fontWeight: '900',
            color: '#ffffff',
            margin: '0 0 20px 0'
          }}>
            Comment ça fonctionne ?
          </h2>
          <p className="hero-subtitle" style={{
            fontSize: '20px',
            color: '#b8bdd0',
            margin: '0 0 60px 0'
          }}>
            Très simple
          </p>

          <div className="steps-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px'
          }}>
            {[1, 2, 3].map((step, i) => {
              const steps = [
                { title: 'Vous recommandez', desc: 'Vous partagez votre lien personnalisé à vos contacts intéressés.' },
                { title: 'Nous prenons le relais', desc: 'Imigo contacte la personne, réalise l\'évaluation et gère le dossier de A à Z.' },
                { title: 'Vous êtes rémunéré', desc: 'Commission calculée sur les honoraires Imigo, dès que le client signe et paie sa première tranche.' }
              ]
              return (
                <div key={i} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '20px',
                  padding: '40px',
                  border: '2px solid rgba(212, 60, 20, 0.2)',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: '#D43C14',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    fontSize: '28px',
                    fontWeight: '900',
                    color: 'white'
                  }}>
                    {step}
                  </div>
                  <h3 style={{
                    fontSize: '22px',
                    fontWeight: '800',
                    color: '#ffffff',
                    margin: '0 0 15px 0'
                  }}>
                    {steps[i].title}
                  </h3>
                  <p style={{
                    fontSize: '16px',
                    color: '#b8bdd0',
                    margin: 0,
                    lineHeight: '1.6'
                  }}>
                    {steps[i].desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* What You Do / Don't Do */}
      <section className="section-padding" style={{
        padding: '100px 60px',
        background: '#1D2133',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10
        }}>
          <h2 className="section-title" style={{
            fontSize: '48px',
            fontWeight: '900',
            color: '#ffffff',
            margin: '0 0 60px 0',
            textAlign: 'center'
          }}>
            Votre rôle
          </h2>

          <div className="role-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
            gap: '40px'
          }}>
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '20px',
              padding: '40px',
              border: '3px solid #10b981',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '30px'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <h3 style={{
                  fontSize: '28px',
                  fontWeight: '900',
                  color: '#10b981',
                  margin: 0
                }}>
                  Vous faites
                </h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {['Recommandation / mise en relation', 'Partage du lien', 'Suivi simple (optionnel)'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#10b981" style={{ marginTop: '2px', flexShrink: 0 }}>
                      <polyline points="20 6 9 17 4 12" stroke="#10b981" strokeWidth="2" fill="none"/>
                    </svg>
                    <p style={{ fontSize: '16px', color: '#ffffff', margin: 0, lineHeight: '1.6' }}>
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '20px',
              padding: '40px',
              border: '3px solid #ef4444',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '30px'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                <h3 style={{
                  fontSize: '28px',
                  fontWeight: '900',
                  color: '#ef4444',
                  margin: 0
                }}>
                  Vous ne faites pas
                </h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {['Vente / négociation', 'Conseil juridique', 'Gestion de dossier / documents'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#ef4444" style={{ marginTop: '2px', flexShrink: 0 }}>
                      <line x1="18" y1="6" x2="6" y2="18" stroke="#ef4444" strokeWidth="2"/>
                      <line x1="6" y1="6" x2="18" y2="18" stroke="#ef4444" strokeWidth="2"/>
                    </svg>
                    <p style={{ fontSize: '16px', color: '#ffffff', margin: 0, lineHeight: '1.6' }}>
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="section-padding" style={{
        padding: '100px 60px',
        background: '#0f1219',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10
        }}>
          <h2 className="section-title" style={{
            fontSize: '48px',
            fontWeight: '900',
            color: '#ffffff',
            margin: '0 0 20px 0'
          }}>
            Ce que vous recevez
          </h2>
          <p className="hero-subtitle" style={{
            fontSize: '20px',
            color: '#b8bdd0',
            margin: '0 0 60px 0'
          }}>
            En rejoignant le programme
          </p>

          <div className="offers-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px'
          }}>
            {[
              { icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', title: 'Contrat cadre clair', desc: 'Droits & obligations' },
              { icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', title: 'Supports marketing', desc: 'Textes, visuels, scripts' },
              { icon: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71', title: 'Lien personnalisé', desc: 'Tracking automatique' },
              { icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', title: 'Canal WhatsApp dédié', desc: 'Support équipe Imigo' },
              { icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', title: 'Mini-formation', desc: 'Formation commerciale' }
            ].map((item, i) => (
              <div key={i} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '35px 25px',
                border: '2px solid rgba(212, 60, 20, 0.2)',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'rgba(212, 60, 20, 0.1)',
                  border: '2px solid rgba(212, 60, 20, 0.3)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D43C14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon}/>
                  </svg>
                </div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '800',
                  color: '#ffffff',
                  margin: '0 0 10px 0'
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#b8bdd0',
                  margin: 0
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding" style={{
        padding: '100px 60px',
        background: '#1D2133',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10
        }}>
          <h2 className="section-title" style={{
            fontSize: '48px',
            fontWeight: '900',
            color: '#ffffff',
            margin: '0 0 60px 0',
            textAlign: 'center'
          }}>
            Questions fréquentes
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {[
              { q: 'Comment la commission est-elle calculée ?', a: 'Pourcentage sur les honoraires Imigo (HT) uniquement (hors frais officiels).' },
              { q: 'Quand est-elle due ?', a: 'À la signature du contrat + paiement de la première tranche par le client.' },
              { q: 'Quand suis-je payé ?', a: 'Consolidation mensuelle + paiement mensuel (ou selon accord).' },
              { q: 'Comment suivez-vous mes recommandations ?', a: 'Chaque ambassadeur reçoit un lien unique (CRM) qui identifie automatiquement l\'ambassadeur référent.' },
              { q: 'Puis-je communiquer publiquement sur le programme ?', a: 'Oui, et nous fournissons même des supports prêts à publier. Si vous créez votre propre publication, une validation est nécessaire avant utilisation.' }
            ].map((item, i) => (
              <div key={i} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '30px',
                border: '2px solid rgba(212, 60, 20, 0.2)'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '800',
                  color: '#D43C14',
                  margin: '0 0 15px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span style={{
                    width: '28px',
                    height: '28px',
                    background: '#D43C14',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '900',
                    flexShrink: 0
                  }}>
                    ?
                  </span>
                  {item.q}
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#b8bdd0',
                  margin: 0,
                  lineHeight: '1.6',
                  paddingLeft: '38px'
                }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="agent-registration-form" className="section-padding" style={{
        padding: '100px 60px 120px 60px',
        background: 'linear-gradient(135deg, #1D2133 0%, #0f1219 100%)',
        position: 'relative',
        minHeight: 'auto',
        overflow: 'visible'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(212, 60, 20, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212, 60, 20, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          opacity: 0.3
        }} />

        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
          width: '100%'
        }}>
          <h2 className="section-title" style={{
            fontSize: '48px',
            fontWeight: '900',
            color: 'white',
            margin: '0 0 20px 0',
            textAlign: 'center'
          }}>
            Candidater au programme
          </h2>
          <p className="hero-subtitle" style={{
            fontSize: '20px',
            color: '#b8bdd0',
            margin: '0 0 60px 0',
            textAlign: 'center',
            lineHeight: '1.6'
          }}>
            Remplissez ce formulaire pour rejoindre le programme. Une fois reçu, nous vous créerons votre lien personnalisé et vous enverrons la suite du parcours.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{
            background: 'white',
            borderRadius: '20px',
            padding: '60px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            border: '4px solid #D43C14',
            width: '100%',
            boxSizing: 'border-box',
            overflow: 'visible'
          }}>
            {submitStatus === 'success' && (
              <div style={{
                background: '#10b981',
                color: 'white',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '30px',
                textAlign: 'center',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                ✅ Votre candidature a été envoyée avec succès ! Nous vous contacterons bientôt.
              </div>
            )}

            {submitStatus === 'error' && (
              <div style={{
                background: '#ef4444',
                color: 'white',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '30px',
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                ❌ {errorMessage}
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="full_name" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1D2133' }}>
                Nom complet *
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1D2133' }}>
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '30px' }}>
              <label htmlFor="phone" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1D2133' }}>
                Téléphone *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>

            {/* Mandatory Checkboxes */}
            <div style={{ marginBottom: '30px', padding: '20px', background: '#f9fafb', borderRadius: '12px', border: '2px solid #e5e7eb' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={checkboxes.acceptContact}
                    onChange={() => handleCheckboxChange('acceptContact')}
                    style={{
                      width: '20px',
                      height: '20px',
                      marginTop: '2px',
                      cursor: 'pointer',
                      accentColor: '#D43C14'
                    }}
                  />
                  <span style={{ fontSize: '16px', color: '#1D2133', lineHeight: '1.5' }}>
                    J'accepte être contacté par Imigo *
                  </span>
                </label>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={checkboxes.watchedVideo}
                    onChange={() => handleCheckboxChange('watchedVideo')}
                    style={{
                      width: '20px',
                      height: '20px',
                      marginTop: '2px',
                      cursor: 'pointer',
                      accentColor: '#D43C14'
                    }}
                  />
                  <span style={{ fontSize: '16px', color: '#1D2133', lineHeight: '1.5' }}>
                    J'ai bien vu la vidéo *
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                background: submitting ? '#9ca3af' : 'linear-gradient(135deg, #D43C14 0%, #ff6b3d 100%)',
                color: 'white',
                fontSize: '18px',
                fontWeight: '700',
                padding: '18px 40px',
                border: 'none',
                borderRadius: '12px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: submitting ? 'none' : '0 10px 30px rgba(212, 60, 20, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              {submitting ? 'Envoi en cours...' : 'Envoyer ma candidature'}
            </button>
          </form>
        </div>
      </section>

      {/* Footer - keeping the same structure */}
      <footer className="section-padding" style={{
        background: '#1D2133',
        padding: '60px 60px 40px',
        borderTop: '1px solid rgba(212, 60, 20, 0.2)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '36px',
            fontWeight: '900',
            color: '#D43C14',
            letterSpacing: '2px',
            marginBottom: '30px'
          }}>
            IMIGO IMMIGRATION
          </div>

          <div className="footer-grid" style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            marginBottom: '30px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#b8bdd0',
              fontSize: '16px'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D43C14" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Casablanca (siège)
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#b8bdd0',
              fontSize: '16px'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D43C14" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Tanger (bureau)
            </div>
          </div>

          <div style={{
            paddingTop: '30px',
            borderTop: '1px solid rgba(212, 60, 20, 0.2)',
            color: '#7d8398',
            fontSize: '14px'
          }}>
            © 2026 IMIGO Immigration. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  )
}

