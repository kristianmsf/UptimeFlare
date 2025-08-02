import { MaintenanceConfig, PageConfig, WorkerConfig } from './types/config'

const pageConfig: PageConfig = {
  title: "Kristian's Status Page",
  links: [
    { link: 'https://github.com/kristianmsf', label: 'GitHub' },
    { link: 'mailto:kristian@kmsfhost.com', label: 'Contato', highlight: true },
  ],
  group: {
    '🌐 Sites públicos': ['kmsfhost', 'kristianmsf'],
  },
}

const workerConfig: WorkerConfig = {
  kvWriteCooldownMinutes: 3,
  monitors: [
    {
      id: 'kmsfhost',
      name: 'KMSF Host',
      method: 'GET',
      target: 'https://kmsfhost.com',
      expectedCodes: [418],
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115 Safari/537.36',
        'Accept': 'text/html',
      },
    },
    {
      id: 'kristianmsf',
      name: 'Kristian MSF',
      method: 'GET',
      target: 'https://kristianmsf.com',
      expectedCodes: [200, 403],
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115 Safari/537.36',
        'Accept': 'text/html',
      },
    },
  ],
  notification: {
    timeZone: 'Asia/Tokyo',
    gracePeriod: 2,
    skipNotificationIds: [],
  },
  callbacks: {
    onIncident: async (env, monitor, timeIncidentStart, timeNow, reason) => {
      await fetch("https://script.google.com/macros/s/AKfycby9ZfqqZieLcK8I26cUBrDrDTofQezAoJisP3rw6sZljTPy2IrqGHgEUfIkrAvganNw/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: monitor.id,
          name: monitor.name,
          url: monitor.target?.toString(),
          status: "DOWN",
          reason,
          timeNow,
          start: timeIncidentStart,
          latency: monitor.lastResponseTime ?? null
        })
      });
    },
  
    onStatusChange: async (env, monitor, isUp, timeIncidentStart, timeNow, reason) => {
      await fetch("https://script.google.com/macros/s/AKfycby9ZfqqZieLcK8I26cUBrDrDTofQezAoJisP3rw6sZljTPy2IrqGHgEUfIkrAvganNw/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: monitor.id,
          name: monitor.name,
          url: monitor.target?.toString(),
          status: isUp ? "UP" : "DOWN",
          reason,
          timeNow,
          start: timeIncidentStart,
          latency: monitor.lastResponseTime ?? null
        })
      });
    }
  },
}

const maintenances: MaintenanceConfig[] = []

export { pageConfig, workerConfig, maintenances }
