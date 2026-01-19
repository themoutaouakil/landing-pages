import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import PublicForm from './PublicForm'
import ImigoAmbassadorLandingPage from './ImigoAmbassadorLandingPage'

export default function LandingPageWithForm() {
  const { formId } = useParams()
  const [searchParams] = useSearchParams()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1920)
  
  // Get form ID from URL param or query string
  const actualFormId = formId || searchParams.get('form') || 'entree-express'
  
  const isAmbassador = actualFormId === 'ambassador'

  // Handle window resize
  useEffect(() => {
    if (isAmbassador) return
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isAmbassador])

  // If it's the ambassador form, render the ambassador landing page
  if (isAmbassador) {
    return <ImigoAmbassadorLandingPage />
  }
  
  // Helper functions for responsive values
  const isMobile = windowWidth <= 480
  const isTablet = windowWidth <= 768
  const getPadding = () => isMobile ? '16px' : isTablet ? '20px' : '40px'
  const getSectionPadding = () => isMobile ? '40px 16px' : isTablet ? '60px 20px' : '100px 40px'
  const getHeroPadding = () => isMobile ? '32px 16px' : isTablet ? '40px 20px' : '80px 40px'
  const getFontSize = (desktop, tablet, mobile) => isMobile ? mobile : isTablet ? tablet : desktop

  return (
    <div style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
      minHeight: '100vh',
      background: '#ffffff',
      overflowX: 'hidden'
    }}>
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html, body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        html {
          scroll-behavior: smooth;
        }

        .gradient-text {
          background: linear-gradient(135deg, #E84E2B 0%, #d63f1f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .card-hover {
          transition: all 0.3s ease;
        }

        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .floating {
          animation: float 6s ease-in-out infinite;
        }

        @media (max-width: 768px) {
          .mobile-menu {
            display: block !important;
          }
          .desktop-menu {
            display: none !important;
          }
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 20px !important;
          }
          .steps-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .benefits-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .services-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
        
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #f0f0f0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: isTablet ? '16px 20px' : '20px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #E84E2B 0%, #d63f1f 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '700',
              fontSize: '20px'
            }}>
              IM
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>
                IMIGO Immigration
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Cabinet agréé N° R705681
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-menu" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <a href="#avantages" style={{ fontSize: '15px', fontWeight: '600', color: '#6b7280', textDecoration: 'none', transition: 'color 0.2s' }}>
              Avantages
            </a>
            <a href="#processus" style={{ fontSize: '15px', fontWeight: '600', color: '#6b7280', textDecoration: 'none', transition: 'color 0.2s' }}>
              Processus
            </a>
            <a href="#services" style={{ fontSize: '15px', fontWeight: '600', color: '#6b7280', textDecoration: 'none', transition: 'color 0.2s' }}>
              Services
            </a>
            <a href="#formulaire" style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #E84E2B 0%, #d63f1f 100%)',
              color: 'white',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '600',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(232,78,43,0.3)',
              transition: 'transform 0.2s'
            }}>
              Évaluation gratuite
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#1a1a1a',
              padding: '8px'
            }}>
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div style={{
            padding: isTablet ? '20px' : '20px 40px',
            background: 'white',
            borderTop: '1px solid #f0f0f0'
          }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <a href="#avantages" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '16px', fontWeight: '600', color: '#6b7280', textDecoration: 'none' }}>
                Avantages
              </a>
              <a href="#processus" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '16px', fontWeight: '600', color: '#6b7280', textDecoration: 'none' }}>
                Processus
              </a>
              <a href="#services" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '16px', fontWeight: '600', color: '#6b7280', textDecoration: 'none' }}>
                Services
              </a>
              <a href="#formulaire" onClick={() => setIsMenuOpen(false)} style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #E84E2B 0%, #d63f1f 100%)',
                color: 'white',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                textDecoration: 'none',
                textAlign: 'center'
              }}>
                Évaluation gratuite
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)',
        padding: getHeroPadding(),
        overflow: 'hidden'
      }}>
        <div className="hero-grid" style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
          alignItems: 'center'
        }}>
          {/* Left Content */}
          <div className="fade-in-up">
            <div style={{
              display: 'inline-block',
              padding: '8px 16px',
              background: '#fff5f3',
              borderRadius: '20px',
              marginBottom: '24px'
            }}>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#E84E2B' }}>
                Entrée Express Canada
              </span>
            </div>

            <h1 style={{
              fontSize: getFontSize('56px', '40px', '32px'),
              fontWeight: '800',
              lineHeight: '1.1',
              marginBottom: '24px',
              color: '#1a1a1a'
            }}>
              Votre nouvelle vie au
              <span className="gradient-text"> Canada</span>
            </h1>

            <p style={{
              fontSize: getFontSize('20px', '18px', '16px'),
              color: '#6b7280',
              lineHeight: '1.6',
              marginBottom: '32px'
            }}>
              Obtenez votre résidence permanente au Canada en moins de 6 mois avec 
              le programme Entrée Express. Accompagnement professionnel de A à Z.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: isTablet ? '32px' : '48px' }}>
              <a href="#formulaire" style={{
                padding: isMobile ? '12px 24px' : '16px 32px',
                background: 'linear-gradient(135deg, #E84E2B 0%, #d63f1f 100%)',
                color: 'white',
                borderRadius: '12px',
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: '700',
                textDecoration: 'none',
                boxShadow: '0 8px 20px rgba(232,78,43,0.3)',
                transition: 'transform 0.2s',
                display: 'inline-block',
                width: isMobile ? '100%' : 'auto',
                textAlign: 'center'
              }}>
                Commencer mon évaluation
              </a>
              <a href="#processus" style={{
                padding: isMobile ? '12px 24px' : '16px 32px',
                background: 'white',
                color: '#1a1a1a',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: '700',
                textDecoration: 'none',
                transition: 'all 0.2s',
                display: 'inline-block',
                width: isMobile ? '100%' : 'auto',
                textAlign: 'center'
              }}>
                Découvrir le processus
              </a>
            </div>

            {/* Trust Indicators */}
            <div style={{
              display: 'flex',
              gap: isMobile ? '16px' : '32px',
              flexWrap: 'wrap',
              paddingTop: '32px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <div>
                <div style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '700', color: '#E84E2B', marginBottom: '4px' }}>
                  500+
                </div>
                <div style={{ fontSize: isMobile ? '12px' : '14px', color: '#6b7280' }}>
                  Clients accompagnés
                </div>
              </div>
              <div>
                <div style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '700', color: '#E84E2B', marginBottom: '4px' }}>
                  95 %
                </div>
                <div style={{ fontSize: isMobile ? '12px' : '14px', color: '#6b7280' }}>
                  Taux de réussite
                </div>
              </div>
              <div>
                <div style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '700', color: '#E84E2B', marginBottom: '4px' }}>
                  15 ans
                </div>
                <div style={{ fontSize: isMobile ? '12px' : '14px', color: '#6b7280' }}>
                  D'expérience
                </div>
              </div>
            </div>
          </div>

          {/* Right Image/Illustration */}
          {!isTablet && (
            <div className="floating" style={{ position: 'relative' }}>
              <div style={{
                background: 'linear-gradient(135deg, #E84E2B 0%, #d63f1f 100%)',
                borderRadius: '24px',
                padding: '60px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '200px',
                  height: '200px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%'
                }}></div>
                <div style={{
                  position: 'absolute',
                  bottom: '-30px',
                  left: '-30px',
                  width: '150px',
                  height: '150px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%'
                }}></div>

                <div style={{
                  position: 'relative',
                  zIndex: 1,
                  textAlign: 'center',
                  color: 'white'
                }}>
                  <svg width="200" height="200" viewBox="0 0 200 200" fill="none" style={{ marginBottom: '24px' }}>
                    <circle cx="100" cy="100" r="80" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                    <path d="M100 40 L120 80 L160 80 L130 105 L145 145 L100 120 L55 145 L70 105 L40 80 L80 80 Z" fill="white"/>
                  </svg>
                  <h3 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '12px' }}>
                    Entrée Express
                  </h3>
                  <p style={{ fontSize: '16px', opacity: 0.9 }}>
                    Le chemin le plus rapide vers la résidence permanente canadienne
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Form Section - Moved right after Hero */}
      <section id="formulaire" style={{
        padding: getSectionPadding(),
        background: 'linear-gradient(135deg, #1D2133 0%, #2d3548 100%)',
        color: 'white',
        minHeight: 'auto'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isTablet ? '32px' : '48px' }}>
            <h2 style={{ 
              fontSize: getFontSize('42px', '32px', '28px'), 
              fontWeight: '700', 
              marginBottom: '16px' 
            }}>
              Évaluation gratuite de votre profil
            </h2>
            <p style={{ 
              fontSize: getFontSize('18px', '16px', '14px'), 
              opacity: 0.9 
            }}>
              Remplissez ce formulaire pour recevoir une analyse complète de vos chances
            </p>
          </div>

          {/* Integrated Form - Direct component, NOT iframe */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            overflow: 'visible',
            minHeight: 'auto',
            height: 'auto'
          }}>
            <PublicForm 
              formIdOverride={actualFormId} 
              embedded={true}
              utmSource={searchParams.get('utm_source') || ''}
              utmMedium={searchParams.get('utm_medium') || ''}
              utmCampaign={searchParams.get('utm_campaign') || ''}
              agent={searchParams.get('agent') || ''}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        background: '#1D2133',
        color: 'white',
        padding: isMobile ? '40px 16px' : isTablet ? '40px 20px' : '60px 40px'
      }}>
        <div className="stats-grid" style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '40px',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: getFontSize('48px', '36px', '32px'), fontWeight: '700', marginBottom: '8px' }}>6 mois</div>
            <div style={{ fontSize: isMobile ? '12px' : '16px', opacity: 0.8 }}>Délai moyen de traitement</div>
          </div>
          <div>
            <div style={{ fontSize: getFontSize('48px', '36px', '32px'), fontWeight: '700', marginBottom: '8px' }}>100 %</div>
            <div style={{ fontSize: isMobile ? '12px' : '16px', opacity: 0.8 }}>Accompagnement personnalisé</div>
          </div>
          <div>
            <div style={{ fontSize: getFontSize('48px', '36px', '32px'), fontWeight: '700', marginBottom: '8px' }}>24/7</div>
            <div style={{ fontSize: isMobile ? '12px' : '16px', opacity: 0.8 }}>Support disponible</div>
          </div>
          <div>
            <div style={{ fontSize: getFontSize('48px', '36px', '32px'), fontWeight: '700', marginBottom: '8px' }}>3 étapes</div>
            <div style={{ fontSize: isMobile ? '12px' : '16px', opacity: 0.8 }}>Processus simplifié</div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="avantages" style={{ padding: getSectionPadding(), background: 'white' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isTablet ? '40px' : '60px' }}>
            <h2 style={{ 
              fontSize: getFontSize('42px', '32px', '28px'), 
              fontWeight: '700', 
              marginBottom: '16px', 
              color: '#1a1a1a' 
            }}>
              Pourquoi choisir le Canada ?
            </h2>
            <p style={{ 
              fontSize: getFontSize('18px', '16px', '14px'), 
              color: '#6b7280', 
              maxWidth: '700px', 
              margin: '0 auto',
              padding: isMobile ? '0 16px' : '0'
            }}>
              Le Canada offre une qualité de vie exceptionnelle et des opportunités professionnelles uniques
            </p>
          </div>

          <div className="benefits-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px'
          }}>
            {[
              {
                title: 'Système de santé universel',
                description: 'Accès gratuit aux soins de santé pour tous les résidents permanents et citoyens',
                icon: (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E84E2B" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                )
              },
              {
                title: 'Économie stable et prospère',
                description: 'Marché du travail dynamique avec des salaires compétitifs et de nombreuses opportunités',
                icon: (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E84E2B" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23"/>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                )
              },
              {
                title: 'Éducation de qualité',
                description: 'Système éducatif reconnu mondialement, études gratuites pour les enfants',
                icon: (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E84E2B" strokeWidth="2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                )
              },
              {
                title: 'Multiculturalisme',
                description: 'Société inclusive qui célèbre la diversité culturelle et religieuse',
                icon: (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E84E2B" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                )
              },
              {
                title: 'Sécurité et qualité de vie',
                description: 'Classé parmi les pays les plus sûrs au monde avec un environnement paisible',
                icon: (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E84E2B" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                )
              },
              {
                title: 'Nature spectaculaire',
                description: 'Paysages à couper le souffle, parcs nationaux et espaces verts infinis',
                icon: (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E84E2B" strokeWidth="2">
                    <path d="M17 8l4-4M21 12v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6"/>
                    <circle cx="9" cy="9" r="2"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                  </svg>
                )
              }
            ].map((benefit, idx) => (
              <div key={idx} className="card-hover" style={{
                padding: isMobile ? '24px' : '32px',
                background: 'white',
                border: '2px solid #f0f0f0',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                <div style={{ marginBottom: '20px' }}>
                  {benefit.icon}
                </div>
                <h3 style={{ 
                  fontSize: isMobile ? '18px' : '20px', 
                  fontWeight: '700', 
                  marginBottom: '12px', 
                  color: '#1a1a1a' 
                }}>
                  {benefit.title}
                </h3>
                <p style={{ 
                  fontSize: isMobile ? '14px' : '15px', 
                  color: '#6b7280', 
                  lineHeight: '1.6' 
                }}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="processus" style={{ padding: getSectionPadding(), background: '#f9fafb' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isTablet ? '40px' : '60px' }}>
            <h2 style={{ 
              fontSize: getFontSize('42px', '32px', '28px'), 
              fontWeight: '700', 
              marginBottom: '16px', 
              color: '#1a1a1a' 
            }}>
              Notre processus en 6 étapes
            </h2>
            <p style={{ 
              fontSize: getFontSize('18px', '16px', '14px'), 
              color: '#6b7280', 
              maxWidth: '700px', 
              margin: '0 auto',
              padding: isMobile ? '0 16px' : '0'
            }}>
              Un accompagnement structuré et transparent du début à la fin
            </p>
          </div>

          <div className="steps-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px'
          }}>
            {[
              {
                step: '01',
                title: 'Évaluation initiale',
                description: 'Analyse complète de votre profil et calcul de votre score CRS',
                color: '#E84E2B'
              },
              {
                step: '02',
                title: 'Préparation des documents',
                description: 'Constitution et vérification de votre dossier complet',
                color: '#f59e0b'
              },
              {
                step: '03',
                title: 'Tests linguistiques',
                description: 'Accompagnement pour les examens TEF/IELTS selon vos besoins',
                color: '#f59e0b'
              },
              {
                step: '04',
                title: 'Équivalence des diplômes',
                description: 'Obtention de l\'ECA pour vos qualifications académiques',
                color: '#3b82f6'
              },
              {
                step: '05',
                title: 'Soumission du profil',
                description: 'Création et dépôt de votre profil Entrée Express',
                color: '#3b82f6'
              },
              {
                step: '06',
                title: 'Demande de résidence',
                description: 'Finalisation après réception de l\'invitation à présenter une demande',
                color: '#10b981'
              }
            ].map((process, idx) => (
              <div key={idx} style={{
                padding: isMobile ? '24px' : '32px',
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  left: isMobile ? '24px' : '32px',
                  width: isMobile ? '50px' : '60px',
                  height: isMobile ? '50px' : '60px',
                  background: process.color,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: isMobile ? '20px' : '24px',
                  fontWeight: '700',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                }}>
                  {process.step}
                </div>
                <div style={{ marginTop: isMobile ? '30px' : '40px' }}>
                  <h3 style={{ 
                    fontSize: isMobile ? '18px' : '20px', 
                    fontWeight: '700', 
                    marginBottom: '12px', 
                    color: '#1a1a1a' 
                  }}>
                    {process.title}
                  </h3>
                  <p style={{ 
                    fontSize: isMobile ? '14px' : '15px', 
                    color: '#6b7280', 
                    lineHeight: '1.6' 
                  }}>
                    {process.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" style={{ padding: getSectionPadding(), background: 'white' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isTablet ? '40px' : '60px' }}>
            <h2 style={{ 
              fontSize: getFontSize('42px', '32px', '28px'), 
              fontWeight: '700', 
              marginBottom: '16px', 
              color: '#1a1a1a' 
            }}>
              Nos services inclus
            </h2>
            <p style={{ 
              fontSize: getFontSize('18px', '16px', '14px'), 
              color: '#6b7280', 
              maxWidth: '700px', 
              margin: '0 auto',
              padding: isMobile ? '0 16px' : '0'
            }}>
              Un accompagnement complet pour maximiser vos chances de succès
            </p>
          </div>

          <div className="services-grid" style={{
            display: 'grid',
            gridTemplateColumns: isTablet ? '1fr' : '1fr 1fr',
            gap: isMobile ? '20px' : '32px'
          }}>
            <div style={{
              padding: isMobile ? '24px' : '40px',
              background: 'linear-gradient(135deg, #fff5f3 0%, #ffffff 100%)',
              borderRadius: '20px',
              border: '2px solid #fecaca'
            }}>
              <h3 style={{ 
                fontSize: isMobile ? '20px' : '24px', 
                fontWeight: '700', 
                marginBottom: '24px', 
                color: '#E84E2B' 
              }}>
                Services professionnels
              </h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {[
                  'Évaluation détaillée de votre éligibilité',
                  'Conseil personnalisé sur votre stratégie',
                  'Préparation complète des documents',
                  'Révision et optimisation de votre profil',
                  'Soumission et suivi de votre dossier',
                  'Support jusqu\'à l\'obtention de la résidence permanente'
                ].map((service, idx) => (
                  <li key={idx} style={{
                    padding: '12px 0',
                    fontSize: '16px',
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {service}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{
              padding: isMobile ? '24px' : '40px',
              background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)',
              borderRadius: '20px',
              border: '2px solid #bfdbfe'
            }}>
              <h3 style={{ 
                fontSize: isMobile ? '20px' : '24px', 
                fontWeight: '700', 
                marginBottom: '24px', 
                color: '#3b82f6' 
              }}>
                Garanties et engagement
              </h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {[
                  'Cabinet agréé et régulé au Maroc',
                  '15 ans d\'expérience en immigration',
                  'Taux de réussite de 95 %',
                  'Transparence totale des frais',
                  'Confidentialité absolue garantie',
                  'Disponibilité et réactivité assurées'
                ].map((guarantee, idx) => (
                  <li key={idx} style={{
                    padding: '12px 0',
                    fontSize: '16px',
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {guarantee}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#1a1a1a',
        color: 'white',
        padding: isMobile ? '40px 16px 20px' : isTablet ? '40px 20px 20px' : '60px 40px 30px'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '40px',
            marginBottom: '40px'
          }}>
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
                IMIGO Immigration
              </h4>
              <p style={{ fontSize: '14px', opacity: 0.8, lineHeight: '1.6' }}>
                Cabinet agréé spécialisé dans l'immigration au Canada. Votre partenaire de confiance depuis 15 ans.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
                Contact
              </h4>
              <p style={{ fontSize: '14px', opacity: 0.8, lineHeight: '1.8' }}>
                +212 5 22 27 72 13<br/>
                contact@imigo-immigration.ma<br/>
                Casablanca, Maroc
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
                Horaires
              </h4>
              <p style={{ fontSize: '14px', opacity: 0.8, lineHeight: '1.8' }}>
                Lundi - Vendredi : 9 h - 18 h<br/>
                Samedi : 9 h - 13 h<br/>
                Dimanche : Fermé
              </p>
            </div>
          </div>

          <div style={{
            paddingTop: '30px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center',
            fontSize: '14px',
            opacity: 0.6
          }}>
            © 2025 IMIGO Immigration. Tous droits réservés. Cabinet agréé N° R705681
          </div>
        </div>
      </footer>
    </div>
  )
}

