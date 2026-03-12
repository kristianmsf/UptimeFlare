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
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36',
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
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36',
        'Accept': 'text/html',
      },
    },
    {
      id: 'oracle-cloud',
      name: 'Oracle Cloud',
      method: 'GET',
      target: 'https://ocs.kmsfhost.com',
      expectedCodes: [200, 403],
      timeout: 15000,
      headers: {
        'User-Agent': 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36',
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

    onStatusChange: async (env, monitor, isUp, timeIncidentStart, timeNow) => {

      if(isUp){
      
        const duration = Math.floor((timeNow - timeIncidentStart)/60000)
        
        const msg =
        `✅ <b>SITE RECOVERED</b>
        
        Site: ${monitor.name}
        
        Tempo offline: ${duration} minutos`
        
        await sendTelegram(env, msg)
      
      }
    
    }
  },
}

async function sendTelegram(env, message) {
  const token = env.8644281881:AAFgRhLkLbkXp9OAxVex-a98GSMFZBp4xxI
  const chatId = env.549731136

  const url = `https://api.telegram.org/bot${token}/sendMessage`

  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "HTML"
    })
  })
}

const maintenances: MaintenanceConfig[] = []

export { pageConfig, workerConfig, maintenances }
