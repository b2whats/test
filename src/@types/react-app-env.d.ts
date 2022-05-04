declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test'
  }
}

declare module '@rb-mf/web-wlb-remote/App' {
  const App: React.ComponentType

  export default App
}
