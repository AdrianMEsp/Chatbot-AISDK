import { z } from 'zod';
import { tool } from 'ai';
import { listAvailableSlots, createCalendarEvent } from '@/lib/mcp/google-calendar';

export const listSlotsTool = tool({
  description: 'Muestra los espacios disponibles en el calendario para los próximos días.',
  inputSchema: z.object({
    days: z.number().optional().default(7).describe('Número de días a consultar'),
  }),
  execute: async ({ days }) => {
    try {
      const slots = await listAvailableSlots(days);
      return {
        success: true,
        slots: slots.slice(0, 10), // Limitamos a 10 para no saturar el contexto
        message: `Se encontraron ${slots.length} espacios disponibles.`,
      };
    } catch (error) {
      console.error('Error listing slots:', error);
      return { success: false, error: 'No se pudieron obtener los espacios disponibles.' };
    }
  },
});

export const scheduleAppointmentTool = tool({
  description: 'Agenda una cita en el calendario.',
  inputSchema: z.object({
    summary: z.string().describe('Resumen o título de la reunión'),
    start: z.string().describe('Fecha y hora de inicio en formato ISO'),
    end: z.string().describe('Fecha y hora de fin en formato ISO'),
    email: z.string().email().describe('Email del asistente'),
    description: z.string().optional().describe('Descripción adicional para la reunión'),
  }),
  execute: async ({ summary, start, end, email, description }) => {
    try {
      const event = await createCalendarEvent({
        summary,
        description: description || 'Cita agendada por el asistente IA',
        start,
        end,
        attendeeEmail: email,
      });
      return {
        success: true,
        eventId: event.id,
        link: event.htmlLink,
        message: 'Cita agendada con éxito.',
      };
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      return { success: false, error: 'Hubo un error al agendar la cita.' };
    }
  },
});
