import React from 'react'
import { Routes, Route, useParams, useSearchParams } from 'react-router-dom'
import LandingPageWithForm from './LandingPageWithForm'

// Simple wrapper to handle routing
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPageWithForm />} />
      <Route path="/:formId" element={<LandingPageWithForm />} />
    </Routes>
  )
}

export default App

