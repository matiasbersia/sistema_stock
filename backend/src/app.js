require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const Routes = require('./routes/rutas');
const cors = require('cors');
const cron = require('node-cron');
const correoController = require('./controllers/resend');

app.use(cors());
app.use(express.json());
app.use('/', Routes);

// ====================== CONFIGURACIÓN ======================
const DIA_SEMANAL = 1;        // 1 = Lunes, 2 = Martes, ..., 7 = Domingo
const HORA_ENVIO = "00:00";    // Formato HH:MM (24 horas)
// ============================================================

// Convertir hora en minutos y horas
const [hora, minuto] = HORA_ENVIO.split(":");

// ====================== ENVÍO SEMANAL ======================
cron.schedule(
    `${minuto} ${hora} * * ${DIA_SEMANAL}`,
    () => {
        correoController.notificarSinStock(
            {},
            {
                json: (msg) => console.log("📧 Envío semanal OK:", msg),
                status: () => ({ json: console.log })
            }
        );
    },
    {
        timezone: "America/Argentina/Buenos_Aires"
    }
);
// ============================================================

// ---------------------- Iniciar servidor ----------------------
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});