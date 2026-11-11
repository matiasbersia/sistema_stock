import { Hono } from 'hono';
import { cors } from 'hono/cors';
import Routes from './routes/rutas';
import correoController from './controllers/resend';

const app = new Hono();

// Middlewares
app.use('*', cors());

// Tus rutas (reemplazan a app.use('/', Routes))
app.route('/', Routes);

// Exportación obligatoria para Cloudflare Workers
export default {
  // 1. Maneja las peticiones HTTP (reemplaza a app.listen)
  fetch: app.fetch,

  // 2. Maneja la tarea programada (reemplaza a node-cron)
  async scheduled(event, env, ctx) {
    console.log("⏰ Ejecutando cron semanal en Cloudflare...");
    
    try {
      await correoController.notificarSinStock(
        {},
        {
          json: (msg) => console.log("📧 Envío semanal OK:", msg),
          status: () => ({ json: console.log })
        },
        env // Pasamos las variables de entorno de Cloudflare
      );
    } catch (error) {
      console.error("❌ Error en la tarea programada:", error);
    }
  }
};