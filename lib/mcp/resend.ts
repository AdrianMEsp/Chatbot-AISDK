import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

const emailLayout = (content: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #18181b; background-color: #f4f4f5; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e4e4e7; }
        .header { background: #09090b; padding: 32px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em; }
        .content { padding: 40px; }
        .footer { padding: 24px; text-align: center; color: #71717a; font-size: 14px; border-top: 1px solid #e4e4e7; }
        .data-table { width: 100%; border-collapse: collapse; margin: 24px 0; }
        .data-table th { text-align: left; padding: 12px; border-bottom: 1px solid #e4e4e7; color: #71717a; font-weight: 500; font-size: 14px; }
        .data-table td { padding: 12px; border-bottom: 1px solid #e4e4e7; font-size: 15px; }
        .accent { color: #4f46e5; font-weight: 600; }
        .button { display: inline-block; padding: 12px 24px; background: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 500; margin-top: 16px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Chat IASDK</h1>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            &copy; ${new Date().getFullYear()} Asistente de IA. Todos los derechos reservados.
        </div>
    </div>
</body>
</html>
`;

const templates: Record<string, { subject: (data: any) => string; html: (data: any) => string }> = {
    default: {
        subject: () => '¡Gracias por tu interés!',
        html: ({ leadId }) => emailLayout(`
            <h2 style="margin-top: 0;">¡Hola!</h2>
            <p>Recibimos tu consulta con éxito. Estamos revisando la información para brindarte la mejor atención.</p>
            <p>Tu ID de referencia es: <strong class="accent">${leadId}</strong></p>
            <p>Nos pondremos en contacto contigo pronto.</p>
        `),
    },
    follow_up: {
        subject: () => '¿Sigues interesado en agendar tu cita?',
        html: ({ leadId }) => emailLayout(`
            <h2 style="margin-top: 0;">¡Hola de nuevo!</h2>
            <p>Notamos que aún no has agendado tu cita. ¿Podemos ayudarte con alguna duda?</p>
            <p>Estamos aquí para acompañarte en tu proceso.</p>
            <a href="#" class="button">Agendar mi cita</a>
            <p style="margin-top: 24px; font-size: 12px; color: #71717a;">ID de referencia: ${leadId}</p>
        `),
    },
    appointment_confirmed: {
        subject: ({ summary }) => `Confirmación: ${summary}`,
        html: ({ summary, start, description, isForAdmin, leadData }) => {
            const dateStr = new Date(start).toLocaleString('es-ES', { 
                weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' 
            });

            if (isForAdmin) {
                return emailLayout(`
                    <h2 style="margin-top: 0;">Nueva cita agendada</h2>
                    <p>Se ha programado una nueva reunión a través del asistente.</p>
                    
                    <h3 style="border-bottom: 2px solid #f4f4f5; padding-bottom: 8px;">Datos del Cliente</h3>
                    <table class="data-table">
                        <tr><th>Nombre</th><td>${leadData?.name || 'N/A'}</td></tr>
                        <tr><th>Email</th><td>${leadData?.email || 'N/A'}</td></tr>
                        <tr><th>Presupuesto</th><td>$${leadData?.budget || 0}</td></tr>
                        <tr><th>Interés</th><td style="text-transform: capitalize;">${leadData?.interest || 'N/A'}</td></tr>
                    </table>

                    <h3 style="border-bottom: 2px solid #f4f4f5; padding-bottom: 8px; margin-top: 32px;">Detalles de la Cita</h3>
                    <table class="data-table">
                        <tr><th>Título</th><td>${summary}</td></tr>
                        <tr><th>Fecha y Hora</th><td class="accent">${dateStr}</td></tr>
                        <tr><th>Descripción</th><td>${description || 'Sin descripción'}</td></tr>
                    </table>
                `);
            }

            return emailLayout(`
                <h2 style="margin-top: 0;">¡Cita Agendada!</h2>
                <p>Tu reunión ha sido confirmada con éxito. Aquí tienes los detalles:</p>
                
                <div style="background: #f8fafc; padding: 24px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 24px 0;">
                    <p style="margin: 0; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Título</p>
                    <p style="margin: 4px 0 16px 0; font-weight: 600; font-size: 18px;">${summary}</p>
                    
                    <p style="margin: 0; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Cuándo</p>
                    <p style="margin: 4px 0 0 0; font-weight: 600; font-size: 18px;" class="accent">${dateStr}</p>
                </div>

                <p>Ya hemos enviado la invitación a tu calendario. ¡Nos vemos pronto!</p>
            `);
        }
    }
};

export async function triggerEmailWorkflow({
    to,
    leadId,
    template = 'default',
    data = {}
}: {
    to: string;
    leadId: string;
    template?: string;
    data?: any;
}) {
    const fromEmail = 'onboarding@resend.dev';
    const mailPrimero = process.env.MAILPRIMERO || '';
    
    const t = templates[template] ?? templates.default;

    if (template === 'appointment_confirmed') {
        // Enviar al administrador
        await resend.emails.send({
            from: fromEmail,
            to: [mailPrimero],
            subject: `[ADMIN] Nueva Cita: ${data.summary}`,
            html: t.html({ ...data, leadId, isForAdmin: true }),
        });

        // Enviar al cliente
        await resend.emails.send({
            from: fromEmail,
            to: [to],
            subject: t.subject(data),
            html: t.html({ ...data, leadId, isForAdmin: false }),
        });
    } else {
        // Flujo normal (un solo correo) #Predecated
        await resend.emails.send({
            from: fromEmail,
            to: [to],
            subject: t.subject({ leadId, ...data }),
            html: t.html({ leadId, ...data }),
        });
    }
}
