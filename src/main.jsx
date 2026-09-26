import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import './App.css'
import Home from './routes/Home'
import DetailView from './routes/DetailView'
import NotFound from './routes/NotFound'
import HomeButton from './Components/HomeButton'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* Home button pinned on every page */}
      <HomeButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coinDetails/:id" element={<DetailView />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
