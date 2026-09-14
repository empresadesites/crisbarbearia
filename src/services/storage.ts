import {
  Appointment,
  Barber,
  BarberService,
  BlockedSlot,
  Client,
  GalleryPhoto,
  ScheduleConfig,
} from '../types';

const STORAGE_KEYS = {
  SERVICES: 'cristopher_barbershop_services',
  BARBERS: 'cristopher_barbershop_barbers',
  APPOINTMENTS: 'cristopher_barbershop_appointments',
  CLIENTS: 'cristopher_barbershop_clients',
  SCHEDULE_CONFIG: 'cristopher_barbershop_schedule_config',
  GALLERY: 'cristopher_barbershop_gallery',
  ADMIN_AUTH: 'cristopher_barbershop_admin_auth',
};

// Initial services as requested:
// Corte Masculino, Barba, Corte + Barba, Acabamento, Sobrancelha, Platinado / Coloração
// Price is "Consultar" as official prices were not supplied.
export const INITIAL_SERVICES: BarberService[] = [
  {
    id: 'srv-1',
    nome: 'Corte Masculino',
    descricao: 'Corte tradicional, degradê, fade ou tesoura com lavagem e finalização de alto padrão.',
    preco: 'Consultar',
    duracaoMinutos: 40,
    status: 'ativo',
    categoria: 'corte',
  },
  {
    id: 'srv-2',
    nome: 'Barba',
    descricao: 'Design de barba, toalha quente, alinhamento na navalha e hidratação com óleos essenciais.',
    preco: 'Consultar',
    duracaoMinutos: 30,
    status: 'ativo',
    categoria: 'barba',
  },
  {
    id: 'srv-3',
    nome: 'Corte + Barba',
    descricao: 'Experiência completa. Alinhamento de cabelo e barba com acabamento impecável.',
    preco: 'Consultar',
    duracaoMinutos: 60,
    status: 'ativo',
    categoria: 'combo',
  },
  {
    id: 'srv-4',
    nome: 'Acabamento',
    descricao: 'Alinhamento do contorno (pezinho), costeletas e nuca para manter o visual sempre em dia.',
    preco: 'Consultar',
    duracaoMinutos: 20,
    status: 'ativo',
    categoria: 'corte',
  },
  {
    id: 'srv-5',
    nome: 'Sobrancelha',
    descricao: 'Alinhamento e limpeza sutil da sobrancelha na navalha ou pinça, respeitando o desenho masculino.',
    preco: 'Consultar',
    duracaoMinutos: 15,
    status: 'ativo',
    categoria: 'outro',
  },
  {
    id: 'srv-6',
    nome: 'Platinado / Coloração',
    descricao: 'Descoloração global profissional, platinado uniforme ou camuflagem de fios brancos.',
    preco: 'Consultar',
    duracaoMinutos: 90,
    status: 'ativo',
    categoria: 'quimica',
  },
];

export const INITIAL_BARBERS: Barber[] = [
  {
    id: 'barber-1',
    nome: 'Cristopher',
    fotoUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
    especialidades: ['Degradê Navalhado', 'Barboterapia', 'Visagismo', 'Acabamento Fino'],
    status: 'ativo',
    horarioAtendimento: 'Segunda a Sábado',
  },
];

export const INITIAL_SCHEDULE_CONFIG: ScheduleConfig = {
  diasFuncionamento: {
    0: { aberto: false, inicio: '00:00', fim: '00:00' }, // Domingo fechado
    1: { aberto: true, inicio: '09:00', fim: '19:30' },  // Segunda
    2: { aberto: true, inicio: '09:00', fim: '19:30' },  // Terça
    3: { aberto: true, inicio: '09:00', fim: '19:30' },  // Quarta
    4: { aberto: true, inicio: '09:00', fim: '19:30' },  // Quinta
    5: { aberto: true, inicio: '09:00', fim: '19:30' },  // Sexta
    6: { aberto: true, inicio: '08:30', fim: '18:00' },  // Sábado
  },
  intervaloMinutos: 30,
  horariosBloqueados: [],
};

export const INITIAL_APPOINTMENTS: Appointment[] = [];

export const INITIAL_GALLERY: GalleryPhoto[] = [
  {
    id: 'gal-1',
    url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
    titulo: 'Corte Degradê & Barba Alinhada',
    categoria: 'cortes',
  },
  {
    id: 'gal-2',
    url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    titulo: 'Navalha Tradicional & Acabamento',
    categoria: 'detalhes',
  },
  {
    id: 'gal-fachada',
    url: '/fachada.jpg',
    titulo: 'Fachada Cristopher BarberShop (Av. Londrina, 215)',
    categoria: 'ambiente',
  },
  {
    id: 'gal-3',
    url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
    titulo: 'Ambiente & Estilo',
    categoria: 'ambiente',
  },
  {
    id: 'gal-4',
    url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80',
    titulo: 'Barboterapia com Toalha Quente',
    categoria: 'barba',
  },
  {
    id: 'gal-5',
    url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
    titulo: 'Corte Moderno Masculino',
    categoria: 'cortes',
  },
  {
    id: 'gal-6',
    url: 'https://images.unsplash.com/photo-1593702295094-aea22597af65?auto=format&fit=crop&w=800&q=80',
    titulo: 'Equipamentos & Detalhes de Precisão',
    categoria: 'detalhes',
  },
];

// Helper to safely load from LocalStorage
function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to storage:`, err);
  }
}

export const StorageService = {
  // Services
  getServices(): BarberService[] {
    return getStored<BarberService[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  },
  saveServices(services: BarberService[]) {
    setStored(STORAGE_KEYS.SERVICES, services);
  },
  saveService(service: BarberService) {
    const services = this.getServices();
    const index = services.findIndex((s) => s.id === service.id);
    if (index >= 0) {
      services[index] = service;
    } else {
      services.push(service);
    }
    this.saveServices(services);
  },
  deleteService(id: string) {
    const services = this.getServices().filter((s) => s.id !== id);
    this.saveServices(services);
  },

  // Barbers
  getBarbers(): Barber[] {
    return getStored<Barber[]>(STORAGE_KEYS.BARBERS, INITIAL_BARBERS);
  },
  saveBarbers(barbers: Barber[]) {
    setStored(STORAGE_KEYS.BARBERS, barbers);
  },
  saveBarber(barber: Barber) {
    const barbers = this.getBarbers();
    const index = barbers.findIndex((b) => b.id === barber.id);
    if (index >= 0) {
      barbers[index] = barber;
    } else {
      barbers.push(barber);
    }
    this.saveBarbers(barbers);
  },
  deleteBarber(id: string) {
    const barbers = this.getBarbers().filter((b) => b.id !== id);
    this.saveBarbers(barbers);
  },

  // Appointments
  getAppointments(): Appointment[] {
    const raw = getStored<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, []);
    const cleaned = raw.filter((a) => !a.id.startsWith('apt-sample-'));
    if (cleaned.length !== raw.length) {
      this.saveAppointments(cleaned);
    }
    return cleaned;
  },
  saveAppointments(appointments: Appointment[]) {
    setStored(STORAGE_KEYS.APPOINTMENTS, appointments);
  },
  createAppointment(appointment: Omit<Appointment, 'id' | 'dataCriacao'>): Appointment {
    const appointments = this.getAppointments();
    const newApt: Appointment = {
      ...appointment,
      id: 'apt-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      dataCriacao: new Date().toISOString(),
    };
    appointments.push(newApt);
    this.saveAppointments(appointments);

    // Also register or update client
    this.registerOrUpdateClient(newApt.clienteNome, newApt.clienteTelefone);

    return newApt;
  },
  updateAppointmentStatus(id: string, status: Appointment['status']) {
    const appointments = this.getAppointments();
    const apt = appointments.find((a) => a.id === id);
    if (apt) {
      apt.status = status;
      this.saveAppointments(appointments);
    }
  },
  updateAppointment(appointment: Appointment) {
    const appointments = this.getAppointments();
    const index = appointments.findIndex((a) => a.id === appointment.id);
    if (index >= 0) {
      appointments[index] = appointment;
      this.saveAppointments(appointments);
    }
  },
  deleteAppointment(id: string) {
    const appointments = this.getAppointments().filter((a) => a.id !== id);
    this.saveAppointments(appointments);
  },

  // Clients
  getClients(): Client[] {
    return getStored<Client[]>(STORAGE_KEYS.CLIENTS, []);
  },
  registerOrUpdateClient(nome: string, telefone: string): Client {
    const clients = this.getClients();
    let client = clients.find((c) => c.telefone.replace(/\D/g, '') === telefone.replace(/\D/g, ''));
    if (!client) {
      client = {
        id: 'cli-' + Date.now(),
        nome,
        telefone,
        dataCadastro: new Date().toISOString(),
      };
      clients.push(client);
    } else {
      client.nome = nome;
    }
    setStored(STORAGE_KEYS.CLIENTS, clients);
    return client;
  },

  // Schedule Config
  getScheduleConfig(): ScheduleConfig {
    return getStored<ScheduleConfig>(STORAGE_KEYS.SCHEDULE_CONFIG, INITIAL_SCHEDULE_CONFIG);
  },
  saveScheduleConfig(config: ScheduleConfig) {
    setStored(STORAGE_KEYS.SCHEDULE_CONFIG, config);
  },
  addBlockedSlot(date: string, horario: string, motivo: string = 'Bloqueado'): BlockedSlot {
    const config = this.getScheduleConfig();
    const newBlock: BlockedSlot = {
      id: 'block-' + Date.now(),
      data: date,
      horario,
      motivo,
    };
    config.horariosBloqueados.push(newBlock);
    this.saveScheduleConfig(config);
    return newBlock;
  },
  removeBlockedSlot(id: string) {
    const config = this.getScheduleConfig();
    config.horariosBloqueados = config.horariosBloqueados.filter((b) => b.id !== id);
    this.saveScheduleConfig(config);
  },

  // Gallery
  getGallery(): GalleryPhoto[] {
    const photos = getStored<GalleryPhoto[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
    // Automatically sanitize and remove any broken or outdated 404 links
    let sanitized = photos.filter((p) => p.url && !p.url.includes('photo-1517832606589-7929c392f566'));
    if (!sanitized.some((p) => p.url === '/fachada.jpg')) {
      sanitized = [
        {
          id: 'gal-fachada',
          url: '/fachada.jpg',
          titulo: 'Fachada Cristopher BarberShop (Av. Londrina, 215)',
          categoria: 'ambiente',
        },
        ...sanitized,
      ];
    }
    if (sanitized.length !== photos.length || !photos.some((p) => p.url === '/fachada.jpg')) {
      this.saveGallery(sanitized);
    }
    return sanitized;
  },
  saveGallery(gallery: GalleryPhoto[]) {
    setStored(STORAGE_KEYS.GALLERY, gallery);
  },
  addGalleryPhoto(photo: Omit<GalleryPhoto, 'id'>) {
    const gallery = this.getGallery();
    const newPhoto: GalleryPhoto = {
      ...photo,
      id: 'gal-' + Date.now(),
    };
    gallery.unshift(newPhoto);
    this.saveGallery(gallery);
    return newPhoto;
  },
  deleteGalleryPhoto(id: string) {
    const gallery = this.getGallery().filter((g) => g.id !== id);
    this.saveGallery(gallery);
  },

  // Timeslot Availability Engine
  getAvailableSlots(
    dateStr: string, // "YYYY-MM-DD"
    barberId?: string
  ): { time: string; available: boolean; reason?: 'ocupado' | 'bloqueado' | 'passado' }[] {
    const config = this.getScheduleConfig();
    
    // Parse date safely
    const [year, month, day] = dateStr.split('-').map(Number);
    const targetDate = new Date(year, month - 1, day);
    const dayOfWeek = targetDate.getDay();

    const daySchedule = config.diasFuncionamento[dayOfWeek];
    if (!daySchedule || !daySchedule.aberto) {
      return []; // Day closed / Day off
    }

    const startMinutes = timeToMinutes(daySchedule.inicio);
    const endMinutes = timeToMinutes(daySchedule.fim);
    const interval = config.intervaloMinutos || 30;

    const allSlots: string[] = [];
    for (let m = startMinutes; m < endMinutes; m += interval) {
      allSlots.push(minutesToTime(m));
    }

    // Existing active appointments on this date
    const appointments = this.getAppointments().filter(
      (a) => a.data === dateStr && a.status !== 'cancelado' && (!barberId || a.barbeiroId === barberId)
    );

    // Blocked slots on this date
    const blocked = config.horariosBloqueados.filter((b) => b.data === dateStr);

    return allSlots.map((time) => {
      // Check if booked by appointment
      const isBooked = appointments.some((a) => a.horario === time);
      if (isBooked) {
        return { time, available: false, reason: 'ocupado' };
      }

      // Check if blocked by admin
      const isBlocked = blocked.some((b) => b.horario === time);
      if (isBlocked) {
        return { time, available: false, reason: 'bloqueado' };
      }

      return { time, available: true };
    });
  },

  // Reset demo data
  resetAll() {
    localStorage.removeItem(STORAGE_KEYS.SERVICES);
    localStorage.removeItem(STORAGE_KEYS.BARBERS);
    localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
    localStorage.removeItem(STORAGE_KEYS.CLIENTS);
    localStorage.removeItem(STORAGE_KEYS.SCHEDULE_CONFIG);
    localStorage.removeItem(STORAGE_KEYS.GALLERY);
  },
};

function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
