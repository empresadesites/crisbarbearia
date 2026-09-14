export type AppointmentStatus = 'pendente' | 'confirmado' | 'cancelado' | 'concluido';

export interface Client {
  id: string;
  nome: string;
  telefone: string;
  dataCadastro: string; // ISO string
}

export interface BarberService {
  id: string;
  nome: string;
  descricao: string;
  preco: string; // "Consultar" or specific value like "R$ 45,00"
  duracaoMinutos: number;
  status: 'ativo' | 'inativo';
  categoria?: 'corte' | 'barba' | 'combo' | 'quimica' | 'outro';
}

export interface Barber {
  id: string;
  nome: string;
  fotoUrl: string;
  especialidades: string[];
  status: 'ativo' | 'inativo';
  horarioAtendimento?: string;
}

export interface Appointment {
  id: string;
  clienteNome: string;
  clienteTelefone: string;
  servicoId: string;
  servicoNome: string;
  servicoPreco: string;
  barbeiroId: string;
  barbeiroNome: string;
  data: string; // YYYY-MM-DD
  horario: string; // HH:mm
  status: AppointmentStatus;
  dataCriacao: string; // ISO string
  observacoes?: string;
}

export interface DaySchedule {
  aberto: boolean;
  inicio: string; // "09:00"
  fim: string; // "19:30"
}

export interface BlockedSlot {
  id: string;
  data: string; // YYYY-MM-DD
  horario: string; // HH:mm
  motivo?: string; // e.g. "Almoço", "Bloqueado", "Manutenção"
}

export interface ScheduleConfig {
  diasFuncionamento: {
    [dayOfWeek: number]: DaySchedule; // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  };
  intervaloMinutos: number; // e.g. 30
  horariosBloqueados: BlockedSlot[];
}

export interface GalleryPhoto {
  id: string;
  url: string;
  titulo: string;
  categoria: 'cortes' | 'barba' | 'detalhes' | 'ambiente';
}
