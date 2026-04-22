import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'primary';

export async function getBusySlots(timeMin: Date, timeMax: Date) {
  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      items: [{ id: CALENDAR_ID }],
    },
  });

  return response.data.calendars?.[CALENDAR_ID]?.busy || [];
}

export async function listAvailableSlots(daysAhead = 7) {
  const now = new Date();
  const end = new Date();
  end.setDate(now.getDate() + daysAhead);

  const busySlots = await getBusySlots(now, end);
  
  // Logic to calculate free slots during working hours (9:00 - 18:00)
  const workingStartHour = 9;
  const workingEndHour = 18;
  const slotDurationMinutes = 30;

  const availableSlots: { start: string; end: string }[] = [];

  const timezoneOffset = parseInt(process.env.TIMEZONE_OFFSET || '-3');

  // Función para formatear fecha con offset local: 2026-04-22T09:00:00-03:00
  const formatLocal = (date: Date) => {
    // Ajustamos la fecha al offset para obtener los valores locales
    const localDate = new Date(date.getTime() + timezoneOffset * 60 * 60 * 1000);
    const iso = localDate.toISOString().split('.')[0]; // YYYY-MM-DDTHH:mm:ss
    const offsetSign = timezoneOffset >= 0 ? '+' : '-';
    const offsetHours = Math.abs(timezoneOffset).toString().padStart(2, '0');
    return `${iso}${offsetSign}${offsetHours}:00`;
  };

  for (let i = 0; i < daysAhead; i++) {
    const currentDate = new Date();
    currentDate.setDate(now.getDate() + i);
    // Establecer 9:00 AM local (ajustando desde UTC)
    currentDate.setUTCHours(workingStartHour - timezoneOffset, 0, 0, 0);

    const dayEnd = new Date(currentDate);
    dayEnd.setUTCHours(workingEndHour - timezoneOffset, 0, 0, 0);

    let currentPointer = new Date(Math.max(currentDate.getTime(), now.getTime()));

    while (currentPointer.getTime() + slotDurationMinutes * 60000 <= dayEnd.getTime()) {
      const slotEnd = new Date(currentPointer.getTime() + slotDurationMinutes * 60000);
      
      const isBusy = busySlots.some(busy => {
        const busyStart = new Date(busy.start!).getTime();
        const busyEnd = new Date(busy.end!).getTime();
        const sStart = currentPointer.getTime();
        const sEnd = slotEnd.getTime();
        return (sStart < busyEnd && sEnd > busyStart);
      });

      if (!isBusy) {
        availableSlots.push({
          start: formatLocal(currentPointer),
          end: formatLocal(slotEnd),
        });
      }

      currentPointer = new Date(currentPointer.getTime() + slotDurationMinutes * 60000);
    }
  }

  return availableSlots;
}

export async function createCalendarEvent({
  summary,
  description,
  start,
  end,
  attendeeEmail,
}: {
  summary: string;
  description: string;
  start: string;
  end: string;
  attendeeEmail: string;
}) {
  const timezone = process.env.TIMEZONE || 'America/Argentina/Buenos_Aires';

  const event = await calendar.events.insert({
    calendarId: CALENDAR_ID,
    requestBody: {
      summary,
      description,
      start: { 
        dateTime: start,
        timeZone: timezone
      },
      end: { 
        dateTime: end,
        timeZone: timezone
      },
      attendees: [{ email: attendeeEmail }],
      reminders: {
        useDefault: true,
      },
    },
  });

  return event.data;
}
