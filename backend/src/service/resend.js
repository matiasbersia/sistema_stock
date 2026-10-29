
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const enviarCorreo = async (destino, asunto, mensaje) => {
    try {
        const data = await resend.emails.send({
            from: 'Sistema Stock <onboarding@resend.dev>',
            to: destino,
            subject: asunto,
            text: mensaje
        });

        console.log("📧 Email enviado:", data);
        return true;
    } catch (error) {
        console.error("❌ Error al enviar:", error);
        return false;
    }
};

module.exports = enviarCorreo;
