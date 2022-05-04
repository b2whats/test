export type Token = {
  access: string
  refresh: string
  lastLogin: Date
}

declare global {
  interface AppEvents {
    id2: string
  }
}