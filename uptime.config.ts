import { MaintenanceConfig, PageConfig, WorkerConfig } from './types/config'

const pageConfig: PageConfig = {
  title: "Kristian's Status Page",
  links: [
    { link: 'https://github.com/kristianmsf', label: 'GitHub' },
  ],
  maintenances: {
    upcomingColor: 'gray',
  },
}


const workerConfig: WorkerConfig = {
  kvWriteCooldownMinutes: 3,

  monitors: [
    {
      id: 'kmsf-host',
      name: 'Asura Hosting',
      method: 'GET',
      target: 'https://kmsfhost.com',
      expectedCodes: [200, 403],
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'text/html',
      },
      hideLatencyChart: false,
    },
    {
      id: 'kristian-msf',
      name: 'Lifetime Hosting',
      method: 'GET',
      target: 'https://kristianmsf.com',
      expectedCodes: [200, 403],
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0',
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
      await fetch("SEU_WEBHOOK_AQUI", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: monitor.id,
          name: monitor.name,
          status: "DOWN",
          reason,
          timeNow,
          start: timeIncidentStart,
          latency: null
        })
      });
    },

    onStatusChange: async (env, monitor, isUp, timeIncidentStart, timeNow, reason) => {
      await fetch("SEU_WEBHOOK_AQUI", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: monitor.id,
          name: monitor.name,
          status: isUp ? "UP" : "DOWN",
          reason,
          timeNow,
          start: timeIncidentStart,
          latency: null
        })
      });
    }
  },
}

const maintenances: MaintenanceConfig[] = []

export { pageConfig, workerConfig, maintenances }
