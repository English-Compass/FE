import React from 'react'
import AllRoutes from './routes/Route.jsx'
import { AppProvider } from './context/AppContext.jsx'

export default function App() {

  return (
    <>
      <AppProvider>
          <AllRoutes />
      </AppProvider>
    </>
  )
}

