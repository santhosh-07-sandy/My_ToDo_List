const CACHE_NAME = 'growthpath-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg'
  // Vite injects assets normally, we will rely on network-first for JS/CSS in dev.
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Fallback or ignore for offline
      });
    })
  );
});

// Scheduling Background Notifications
self.addEventListener('message', async (event) => {
  if (event.data && event.data.type === 'SCHEDULE_TASKS') {
    const tasks = event.data.payload;
    const now = new Date();

    for (const task of tasks) {
      if (!task.time || !task.activity) continue;
      
      const parts = task.time.split('-');
      const startStr = parts[0].trim();
      
      const match = startStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (!match) continue;

      let [_, hours, minutes, period] = match;
      hours = parseInt(hours, 10);
      minutes = parseInt(minutes, 10);
      
      if (period.toUpperCase() === 'PM' && hours !== 12) hours += 12;
      if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;

      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0, 0);

      // Only schedule if the time is in the future today
      if (scheduledTime > now) {
        
        const title = `Time for: ${task.activity}`;
        const options = {
          body: `GrowthPath task reminder (${task.category})`,
          icon: '/icon.svg',
          tag: `task-${task.activity}-${Date.now()}`
        };

        // Attempt to use Notification Triggers API
        if ('showTrigger' in Notification.prototype) {
          options.showTrigger = new TimestampTrigger(scheduledTime.getTime());
          
          try {
            await self.registration.showNotification(title, options);
            console.log(`Scheduled exact offline notification for: ${task.activity} at ${scheduledTime.toLocaleTimeString()}`);
          } catch (e) {
            console.error("Failed to schedule trigger", e);
          }
        } else {
          // Fallback: If showTrigger is not supported, we can't reliably wake up the SW later.
          // However, for demonstration, we set a timeout if the SW happens to stay alive.
          // In reality, this will likely be killed by the browser soon.
          const delay = scheduledTime.getTime() - now.getTime();
          setTimeout(() => {
            self.registration.showNotification(title, options);
          }, delay);
          console.log(`Scheduled unreliable timeout notification for: ${task.activity} at ${scheduledTime.toLocaleTimeString()}`);
        }
      }
    }
  }
});
