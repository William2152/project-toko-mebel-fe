import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { storeRedux } from '../app/storeRedux.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={storeRedux}>
      <App />
    </Provider>
  </StrictMode>,
)
