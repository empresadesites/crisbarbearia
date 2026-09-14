export const BARBERSHOP_INFO = {
  name: 'Cristopher BarberShop',
  category: 'Barbearia',
  address: 'Av. Londrina, 215 - Lj 4 - Veneza, Ipatinga - MG, 35164-291',
  phoneDisplay: '(33) 99816-8468',
  phoneInternational: '5533998168468',
  locationCity: 'Veneza, Ipatinga - MG',
  plusCode: 'GFFH+P6 Veneza, Ipatinga - MG',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Av.+Londrina,+215+-+Lj+4+-+Veneza,+Ipatinga+-+MG,+35164-291',
  googleMapsEmbed: 'https://www.google.com/maps?q=Av.+Londrina,+215+-+Lj+4+-+Veneza,+Ipatinga+-+MG,+35164-291&output=embed',
};

// Format phone string as (XX) XXXXX-XXXX
export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (!digits) return '';
  if (digits.length <= 2) {
    return `(${digits}`;
  }
  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

// Convert YYYY-MM-DD to DD/MM/YYYY
export function formatDateBR(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

// Convert DD/MM/YYYY to YYYY-MM-DD
export function parseDateBRtoISO(dateBR: string): string {
  const parts = dateBR.split('/');
  if (parts.length !== 3) return dateBR;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

// Generate WhatsApp confirmation message link
export function createWhatsAppConfirmationLink(appointment: {
  clienteNome: string;
  clienteTelefone: string;
  servicoNome: string;
  data: string; // YYYY-MM-DD
  horario: string;
}): string {
  const dateFormatted = formatDateBR(appointment.data);
  const text = `Olá, Cristopher BarberShop! Gostaria de confirmar meu agendamento.

Nome: ${appointment.clienteNome}
Telefone: ${appointment.clienteTelefone}
Serviço: ${appointment.servicoNome}
Data: ${dateFormatted}
Horário: ${appointment.horario}

Aguardo a confirmação. Obrigado!`;

  return `https://wa.me/${BARBERSHOP_INFO.phoneInternational}?text=${encodeURIComponent(text)}`;
}

// Floating WhatsApp general contact link
export function createWhatsAppGeneralLink(): string {
  const text = 'Olá! Vim pelo site da Cristopher BarberShop e gostaria de saber mais sobre os horários disponíveis.';
  return `https://wa.me/${BARBERSHOP_INFO.phoneInternational}?text=${encodeURIComponent(text)}`;
}

// Get day of week name in Portuguese
export function getDayNameBR(dayIndex: number): string {
  const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  return days[dayIndex] ?? '';
}

// Format relative date (Hoje, Amanhã, ou DD/MM)
export function formatFriendlyDate(dateStr: string): string {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  if (dateStr === todayStr) return 'Hoje';
  if (dateStr === tomorrowStr) return 'Amanhã';
  return formatDateBR(dateStr);
}
