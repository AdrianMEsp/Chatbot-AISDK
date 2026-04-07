import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function triggerEmailWorkflow({ to, leadId }: { to: string; leadId: string }) {

    const fromEmail = 'onboarding@resend.dev' // solo para pruebas
    const mailPrimero = process.env.MAILPRIMERO || '';

    await resend.emails.send({

        from: fromEmail,
        to: [mailPrimero],
        subject: '¡Gracias por tu interés!',
        html: `<p>Recibimos tu consulta. Tu ID de seguimiento es <strong>${leadId}</strong>.</p>`,
    });
}