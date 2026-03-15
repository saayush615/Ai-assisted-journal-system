import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'

function App() {

  return (
    <>
      <Routes>

        <Route
          path='/'
          element={
            <Home />
          }
        />

        <Route
          path='/dashboard'
          element={
            <Dashboard />
          }
        />

        {/* 404 Not Found */}
        <Route 
          path='*' 
          element={
            <div className='flex flex-col items-center justify-center min-h-screen'>
              <h1 className='text-4xl font-bold text-gray-800 dark:text-white'>404</h1>
              <p className='text-gray-600 dark:text-gray-400 mt-2'>Page not found</p>
              <a href='/' className='mt-4 text-green-600 hover:underline'>Go Home</a>
            </div>
          } 
        />
      </Routes>
    </>
  )
}

export default App
