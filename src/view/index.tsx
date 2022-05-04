import React, { StrictMode } from 'react'
import localforage from 'localforage'

import ReactDOM from 'react-dom'
import { registerServiceWorker } from '../worker/registerServiceWorker'

import { App } from './Application'

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
)

registerServiceWorker()


localforage.createInstance({
  name: 'nameHere'
})