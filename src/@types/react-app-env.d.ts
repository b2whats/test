declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
  }
}

declare module 'testRemoteApp/App' {
  const App: React.ComponentType

  export default App
}
