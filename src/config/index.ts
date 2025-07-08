export const config = {
  server: {
    port: parseInt(process.env.PORT || '4002', 10),
    host: process.env.HOST || 'localhost'
  },
  database: {
    url: process.env.DATABASE_URL || 'postgresql://mychelper_use:LordBless@localhost:5432/mychelper_daily_readings'
  },
  app: {
    name: 'Daily Readings Subgraph',
    version: '1.0.0'
  },
  youversion: {
    apiKey: process.env.YOUVERSION_API_KEY || '',
    baseUrl: 'https://api-dev.youversion.com/v1/bibles',
    defaultVersion: 12
  }
}; 