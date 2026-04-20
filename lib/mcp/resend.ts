import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

const templates: Record<string, { subject: string; html: (id: string) => string }> = {
    default: {
        subject: '¡Gracias por tu interés!',
        html: (id) => `<p>Recibimos tu consulta. Tu ID es <strong>${id}</strong>.</p>`,
    },
    follow_up: {
        subject: '¿Seguís interesado?',
        html: (id) => `<p>Notamos que aún no agendaste tu cita. ¿Podemos ayudarte? ID: <strong>${id}</strong>.</p>`,
    },
};

export async function triggerEmailWorkflow({
    leadId,
    template = 'default',
}: {
    to: string;
    leadId: string;
    template?: string;
}) {
    const t = templates[template] ?? templates.default;
    const fromEmail = 'onboarding@resend.dev' // solo para pruebas
    const mailPrimero = process.env.MAILPRIMERO || '';

    await resend.emails.send({
        from: fromEmail,
        to: [mailPrimero],
        subject: t.subject,
        html: t.html(leadId),
    });
}