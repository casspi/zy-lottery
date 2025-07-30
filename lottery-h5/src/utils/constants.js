export const __DEV__ = import.meta.env.MODE === 'development'

export const BASE_URL = __DEV__ ? 'http://0.0.0.0:3000' : ''
