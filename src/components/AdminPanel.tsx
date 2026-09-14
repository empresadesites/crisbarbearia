import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Scissors,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  Lock,
  LogOut,
  Database,
  Download,
  RotateCcw,
  Search,
  Filter,
  Save,
  X,
  Eye,
  Phone,
  CalendarRange,
} from 'lucide-react';
import {
  Appointment,
  AppointmentStatus,
  Barber,
  BarberService,
  BlockedSlot,
  ScheduleConfig,
} from '../types';
import { StorageService } from '../services/storage';
import { formatDateBR, formatPhoneNumber, getDayNameBR } from '../utils/helpers';

interface AdminPanelProps {
  onClose: () => void;
  onDataChanged: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onDataChanged }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('cristopher_admin_logged') === 'true';
  });
  const [passcode, setPasscode] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Active Navigation Tab: 'dashboard' | 'agendamentos' | 'servicos' | 'barbeiros' | 'horarios' | 'banco'
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'agendamentos' | 'servicos' | 'barbeiros' | 'horarios' | 'banco'
  >('dashboard');

  // Working data from storage
  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    StorageService.getAppointments()
  );
  const [services, setServices] = useState<BarberService[]>(() => StorageService.getServices());
  const [barbers, setBarbers] = useState<Barber[]>(() => StorageService.getBarbers());
  const [scheduleConfig, setScheduleConfig] = useState<ScheduleConfig>(() =>
    StorageService.getScheduleConfig()
  );

  // Filters for Appointments
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Edit / Add Modals State
  const [editingService, setEditingService] = useState<BarberService | null>(null);
  const [isAddingService, setIsAddingService] = useState<boolean>(false);

  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);
  const [isAddingBarber, setIsAddingBarber] = useState<boolean>(false);

  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [isAddingAppointment, setIsAddingAppointment] = useState<boolean>(false);

  // New Blocked Slot form
  const [newBlockDate, setNewBlockDate] = useState<string>('2026-09-15');
  const [newBlockTime, setNewBlockTime] = useState<string>('14:00');
  const [newBlockReason, setNewBlockReason] = useState<string>('Bloqueado');

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'cristopherbarber2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('cristopher_admin_logged', 'true');
      setLoginError('');
    } else {
      setLoginError('Senha incorreta. Verifique e tente novamente.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('cristopher_admin_logged');
  };

  const refreshData = () => {
    setAppointments(StorageService.getAppointments());
    setServices(StorageService.getServices());
    setBarbers(StorageService.getBarbers());
    setScheduleConfig(StorageService.getScheduleConfig());
    onDataChanged();
  };

  // Metrics for Dashboard
  const metrics = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayApts = appointments.filter((a) => a.data === today && a.status !== 'cancelado');
    const upcomingApts = appointments.filter((a) => a.data >= today && a.status !== 'cancelado');
    const pendingApts = appointments.filter((a) => a.status === 'pendente');
    const confirmedApts = appointments.filter((a) => a.status === 'confirmado');
    const cancelledApts = appointments.filter((a) => a.status === 'cancelado');

    return {
      todayCount: todayApts.length,
      upcomingCount: upcomingApts.length,
      pendingCount: pendingApts.length,
      confirmedCount: confirmedApts.length,
      cancelledCount: cancelledApts.length,
      todayList: todayApts,
    };
  }, [appointments]);

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((a) => {
        if (statusFilter !== 'todos' && a.status !== statusFilter) return false;
        if (dateFilter && a.data !== dateFilter) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchClient = a.clienteNome.toLowerCase().includes(q);
          const matchPhone = a.clienteTelefone.includes(q);
          const matchService = a.servicoNome.toLowerCase().includes(q);
          if (!matchClient && !matchPhone && !matchService) return false;
        }
        return true;
      })
      .sort((a, b) => {
        // Sort by date desc then time asc
        if (a.data !== b.data) return b.data.localeCompare(a.data);
        return a.horario.localeCompare(b.horario);
      });
  }, [appointments, statusFilter, dateFilter, searchQuery]);

  // Appointment Actions
  const handleUpdateStatus = (id: string, status: AppointmentStatus) => {
    StorageService.updateAppointmentStatus(id, status);
    refreshData();
  };

  const handleDeleteAppointment = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir permanentemente este agendamento?')) {
      StorageService.deleteAppointment(id);
      refreshData();
    }
  };

  // Blocked Slots Action
  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockDate || !newBlockTime) return;
    StorageService.addBlockedSlot(newBlockDate, newBlockTime, newBlockReason || 'Bloqueado');
    refreshData();
    setNewBlockReason('Bloqueado');
  };

  const handleRemoveBlock = (id: string) => {
    StorageService.removeBlockedSlot(id);
    refreshData();
  };

  // Export JSON Backup
  const handleExportData = () => {
    const backup = {
      services: StorageService.getServices(),
      barbers: StorageService.getBarbers(),
      appointments: StorageService.getAppointments(),
      clients: StorageService.getClients(),
      scheduleConfig: StorageService.getScheduleConfig(),
      exportDate: new Date().toISOString(),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `cristopher_barbershop_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Reset to default
  const handleResetData = () => {
    if (window.confirm('Atenção: Isso restaurará os serviços e configurações para o padrão inicial e limpará agendamentos. Deseja continuar?')) {
      StorageService.resetAll();
      refreshData();
    }
  };

  // If not authenticated, show modern login modal
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#121215] border border-[#2E2E36] rounded-2xl p-6 sm:p-8 shadow-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-xl bg-[#1C1C22] border border-[#C5A059]/40 flex items-center justify-center text-[#D4AF37] mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>

          <h2 className="font-heading text-xl sm:text-2xl font-bold text-white text-center mb-1">
            Painel Administrativo
          </h2>
          <p className="text-xs text-zinc-400 text-center mb-6">
            Área restrita da Cristopher BarberShop
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                Senha de Acesso
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Digite sua senha..."
                className="w-full px-4 py-3 rounded-xl bg-[#18181C] border border-[#2A2A30] text-white text-sm focus:outline-none focus:border-[#C5A059]"
                autoFocus
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-400 bg-red-950/40 p-2.5 rounded-lg border border-red-900/50">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full gold-button py-3 rounded-xl text-sm font-bold shadow-lg"
            >
              ENTRAR NO PAINEL
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0B0D] text-zinc-100 flex flex-col overflow-hidden">
      {/* Admin Top Header */}
      <header className="bg-[#121215] border-b border-[#222226] px-4 sm:px-8 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1A1A20] border border-[#C5A059]/40 flex items-center justify-center text-[#D4AF37]">
            <Scissors className="w-4 h-4 transform -rotate-45" />
          </div>
          <div>
            <h1 className="font-heading text-base sm:text-lg font-bold text-white leading-tight">
              Cristopher BarberShop • <span className="text-[#C5A059]">Painel Admin</span>
            </h1>
            <p className="text-[10px] text-zinc-400">Veneza, Ipatinga - MG</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleLogout}
            title="Sair do painel"
            className="p-2 rounded-lg bg-[#18181C] hover:bg-[#202026] text-zinc-400 hover:text-white border border-[#26262C] text-xs flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#C5A059] text-black font-bold text-xs flex items-center gap-1.5 shadow-md"
          >
            <X className="w-4 h-4" />
            <span>Fechar Admin</span>
          </button>
        </div>
      </header>

      {/* Admin Subheader Navigation Tabs */}
      <nav className="bg-[#151519] border-b border-[#222226] px-4 sm:px-8 flex items-center gap-1 sm:gap-4 overflow-x-auto shrink-0 scrollbar-none">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: Clock },
          { id: 'agendamentos', label: 'Agendamentos', icon: Calendar },
          { id: 'servicos', label: 'Serviços', icon: Scissors },
          { id: 'barbeiros', label: 'Barbeiros', icon: Users },
          { id: 'horarios', label: 'Horários & Bloqueios', icon: CalendarRange },
          { id: 'banco', label: 'Banco de Dados', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 sm:px-4 text-xs font-bold whitespace-nowrap flex items-center gap-2 border-b-2 transition-colors ${
                isActive
                  ? 'border-[#C5A059] text-[#D4AF37]'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Admin Scrollable Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#0B0B0E]">
        <div className="max-w-7xl mx-auto">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                <div className="bg-[#131317] border border-[#222228] p-4 rounded-xl">
                  <span className="text-zinc-400 text-xs font-medium">Hoje</span>
                  <p className="text-2xl font-black text-white mt-1">{metrics.todayCount}</p>
                  <span className="text-[10px] text-[#C5A059]">Agendados p/ hoje</span>
                </div>

                <div className="bg-[#131317] border border-[#222228] p-4 rounded-xl">
                  <span className="text-zinc-400 text-xs font-medium">Próximos</span>
                  <p className="text-2xl font-black text-blue-400 mt-1">{metrics.upcomingCount}</p>
                  <span className="text-[10px] text-zinc-500">A partir de hoje</span>
                </div>

                <div className="bg-[#131317] border border-[#222228] p-4 rounded-xl">
                  <span className="text-zinc-400 text-xs font-medium">Pendentes</span>
                  <p className="text-2xl font-black text-amber-400 mt-1">{metrics.pendingCount}</p>
                  <span className="text-[10px] text-zinc-500">Aguardando</span>
                </div>

                <div className="bg-[#131317] border border-[#222228] p-4 rounded-xl">
                  <span className="text-zinc-400 text-xs font-medium">Confirmados</span>
                  <p className="text-2xl font-black text-emerald-400 mt-1">
                    {metrics.confirmedCount}
                  </p>
                  <span className="text-[10px] text-zinc-500">Validados</span>
                </div>

                <div className="bg-[#131317] border border-[#222228] p-4 rounded-xl col-span-2 sm:col-span-1">
                  <span className="text-zinc-400 text-xs font-medium">Cancelados</span>
                  <p className="text-2xl font-black text-red-400 mt-1">{metrics.cancelledCount}</p>
                  <span className="text-[10px] text-zinc-500">Horários liberados</span>
                </div>
              </div>

              {/* Today's Schedule Overview */}
              <div className="bg-[#131317] border border-[#222228] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#D4AF37]" />
                    <span>Agendamentos de Hoje</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('agendamentos')}
                    className="text-xs text-[#C5A059] hover:underline font-semibold"
                  >
                    Ver todos ({appointments.length})
                  </button>
                </div>

                {metrics.todayList.length === 0 ? (
                  <p className="text-sm text-zinc-500 py-6 text-center">
                    Nenhum agendamento para a data de hoje.
                  </p>
                ) : (
                  <div className="divide-y divide-[#1E1E24]">
                    {metrics.todayList.map((apt) => (
                      <div
                        key={apt.id}
                        className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-extrabold text-[#D4AF37] px-2.5 py-1 rounded bg-[#1C1C22] border border-[#C5A059]/30">
                            {apt.horario}
                          </span>
                          <div>
                            <p className="text-sm font-bold text-white">{apt.clienteNome}</p>
                            <p className="text-xs text-zinc-400">
                              {apt.servicoNome} • {apt.clienteTelefone}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                              apt.status === 'confirmado'
                                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                                : apt.status === 'pendente'
                                ? 'bg-amber-950/60 text-amber-300 border border-amber-800'
                                : 'bg-red-950/60 text-red-300 border border-red-800'
                            }`}
                          >
                            {apt.status}
                          </span>

                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'confirmado')}
                            className="p-1.5 rounded bg-[#1C1C22] hover:bg-emerald-900/40 text-emerald-400"
                            title="Confirmar"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'cancelado')}
                            className="p-1.5 rounded bg-[#1C1C22] hover:bg-red-900/40 text-red-400"
                            title="Cancelar"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: AGENDAMENTOS */}
          {activeTab === 'agendamentos' && (
            <div className="space-y-6">
              {/* Controls bar */}
              <div className="bg-[#131317] border border-[#222228] p-4 rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Search input */}
                  <div className="relative flex-1 sm:w-60">
                    <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar cliente, tel ou serviço..."
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#18181D] border border-[#282830] text-xs text-white placeholder:text-zinc-500"
                    />
                  </div>

                  {/* Status filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="py-2 px-3 rounded-lg bg-[#18181D] border border-[#282830] text-xs text-zinc-200"
                  >
                    <option value="todos">Todos os Status</option>
                    <option value="confirmado">Confirmados</option>
                    <option value="pendente">Pendentes</option>
                    <option value="cancelado">Cancelados</option>
                  </select>

                  {/* Date filter */}
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="py-2 px-3 rounded-lg bg-[#18181D] border border-[#282830] text-xs text-zinc-200"
                  />

                  {(statusFilter !== 'todos' || dateFilter || searchQuery) && (
                    <button
                      onClick={() => {
                        setStatusFilter('todos');
                        setDateFilter('');
                        setSearchQuery('');
                      }}
                      className="text-xs text-zinc-400 hover:text-white underline px-1"
                    >
                      Limpar
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setIsAddingAppointment(true)}
                  className="gold-button py-2 px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Novo Agendamento</span>
                </button>
              </div>

              {/* Appointments List */}
              <div className="bg-[#131317] border border-[#222228] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-300">
                    <thead className="bg-[#17171C] text-zinc-400 uppercase font-semibold border-b border-[#222228]">
                      <tr>
                        <th className="p-4">Data & Horário</th>
                        <th className="p-4">Cliente</th>
                        <th className="p-4">Serviço</th>
                        <th className="p-4">Barbeiro</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1D1D24]">
                      {filteredAppointments.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-zinc-500">
                            Nenhum agendamento encontrado com os filtros selecionados.
                          </td>
                        </tr>
                      ) : (
                        filteredAppointments.map((apt) => (
                          <tr key={apt.id} className="hover:bg-[#18181D]">
                            <td className="p-4 whitespace-nowrap">
                              <span className="font-bold text-white block">
                                {formatDateBR(apt.data)}
                              </span>
                              <span className="text-[#D4AF37] font-extrabold">{apt.horario}</span>
                            </td>
                            <td className="p-4">
                              <span className="font-bold text-white block">{apt.clienteNome}</span>
                              <span className="text-zinc-500">{apt.clienteTelefone}</span>
                            </td>
                            <td className="p-4">
                              <span className="font-medium text-zinc-200 block">
                                {apt.servicoNome}
                              </span>
                              <span className="text-[10px] text-zinc-500">{apt.servicoPreco}</span>
                            </td>
                            <td className="p-4 whitespace-nowrap">
                              <span className="text-zinc-300">{apt.barbeiroNome}</span>
                            </td>
                            <td className="p-4 whitespace-nowrap">
                              <span
                                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                                  apt.status === 'confirmado'
                                    ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                                    : apt.status === 'pendente'
                                    ? 'bg-amber-950/60 text-amber-300 border border-amber-800'
                                    : 'bg-red-950/60 text-red-300 border border-red-800'
                                }`}
                              >
                                {apt.status}
                              </span>
                            </td>
                            <td className="p-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                {apt.status !== 'confirmado' && (
                                  <button
                                    onClick={() => handleUpdateStatus(apt.id, 'confirmado')}
                                    className="p-1.5 rounded bg-[#1C1C22] hover:bg-emerald-900/40 text-emerald-400"
                                    title="Confirmar"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {apt.status !== 'cancelado' && (
                                  <button
                                    onClick={() => handleUpdateStatus(apt.id, 'cancelado')}
                                    className="p-1.5 rounded bg-[#1C1C22] hover:bg-red-900/40 text-red-400"
                                    title="Cancelar"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteAppointment(apt.id)}
                                  className="p-1.5 rounded bg-[#1C1C22] hover:bg-red-950 text-zinc-500 hover:text-red-400"
                                  title="Excluir"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GERENCIAR SERVIÇOS */}
          {activeTab === 'servicos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-white">Serviços Cadastrados</h3>
                  <p className="text-xs text-zinc-400">
                    Adicione ou edite os preços, descrições e tempos de atendimento
                  </p>
                </div>

                <button
                  onClick={() => setIsAddingService(true)}
                  className="gold-button py-2 px-4 rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Serviço</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    className="bg-[#131317] border border-[#222228] rounded-xl p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-white text-base">{srv.nome}</h4>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            srv.status === 'ativo'
                              ? 'bg-emerald-950 text-emerald-300'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {srv.status}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mb-4">{srv.descricao}</p>
                    </div>

                    <div className="pt-3 border-t border-[#1F1F26] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-zinc-500 block text-[10px]">Duração / Valor</span>
                        <span className="font-bold text-white">
                          {srv.duracaoMinutos} min •{' '}
                          <span className="text-[#D4AF37]">{srv.preco}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingService(srv)}
                          className="p-1.5 rounded bg-[#1A1A20] hover:bg-[#252530] text-zinc-300 hover:text-[#D4AF37]"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Excluir o serviço "${srv.nome}"?`)) {
                              StorageService.deleteService(srv.id);
                              refreshData();
                            }
                          }}
                          className="p-1.5 rounded bg-[#1A1A20] hover:bg-red-950 text-zinc-400 hover:text-red-400"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: GERENCIAR BARBEIROS */}
          {activeTab === 'barbeiros' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-white">
                    Equipe de Barbeiros
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Estrutura preparada para 1 ou múltiplos profissionais
                  </p>
                </div>

                <button
                  onClick={() => setIsAddingBarber(true)}
                  className="gold-button py-2 px-4 rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Barbeiro</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {barbers.map((barber) => (
                  <div
                    key={barber.id}
                    className="bg-[#131317] border border-[#222228] rounded-xl p-5 flex items-start gap-4"
                  >
                    <img
                      src={barber.fotoUrl}
                      alt={barber.nome}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80";
                      }}
                      className="w-16 h-16 rounded-xl object-cover border border-[#C5A059]/40 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-base truncate">{barber.nome}</h4>
                        <span
                          className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            barber.status === 'ativo'
                              ? 'bg-emerald-950 text-emerald-300'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {barber.status}
                        </span>
                      </div>

                      <p className="text-xs text-[#C5A059] font-medium mt-0.5">
                        {barber.horarioAtendimento || 'Segunda a Sábado'}
                      </p>

                      <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                        {barber.especialidades.join(', ')}
                      </p>

                      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[#1F1F26]">
                        <button
                          onClick={() => setEditingBarber(barber)}
                          className="text-[11px] text-zinc-300 hover:text-[#D4AF37] flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" /> Editar
                        </button>
                        {barbers.length > 1 && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Remover o barbeiro "${barber.nome}"?`)) {
                                StorageService.deleteBarber(barber.id);
                                refreshData();
                              }
                            }}
                            className="text-[11px] text-red-400 hover:underline flex items-center gap-1 ml-auto"
                          >
                            <Trash2 className="w-3 h-3" /> Remover
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: GERENCIAR HORÁRIOS & BLOQUEIOS */}
          {activeTab === 'horarios' && (
            <div className="space-y-8">
              {/* Working Hours by Day of Week */}
              <div className="bg-[#131317] border border-[#222228] rounded-2xl p-6">
                <h3 className="font-heading text-lg font-bold text-white mb-2">
                  Dias e Horários de Atendimento
                </h3>
                <p className="text-xs text-zinc-400 mb-6">
                  Defina quais dias a barbearia abre e os horários de início e término.
                </p>

                <div className="space-y-3">
                  {[1, 2, 3, 4, 5, 6, 0].map((dayIdx) => {
                    const dayConfig = scheduleConfig.diasFuncionamento[dayIdx] || {
                      aberto: false,
                      inicio: '09:00',
                      fim: '19:30',
                    };

                    return (
                      <div
                        key={dayIdx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-[#17171C] border border-[#222228] gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={dayConfig.aberto}
                            onChange={(e) => {
                              const updated = { ...scheduleConfig };
                              updated.diasFuncionamento[dayIdx] = {
                                ...dayConfig,
                                aberto: e.target.checked,
                              };
                              StorageService.saveScheduleConfig(updated);
                              refreshData();
                            }}
                            className="w-4 h-4 rounded text-[#C5A059] focus:ring-0"
                          />
                          <span className="font-bold text-white w-32">
                            {getDayNameBR(dayIdx)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="text-zinc-500">Abertura:</label>
                          <input
                            type="time"
                            disabled={!dayConfig.aberto}
                            value={dayConfig.inicio}
                            onChange={(e) => {
                              const updated = { ...scheduleConfig };
                              updated.diasFuncionamento[dayIdx] = {
                                ...dayConfig,
                                inicio: e.target.value,
                              };
                              StorageService.saveScheduleConfig(updated);
                              refreshData();
                            }}
                            className="bg-[#101014] border border-[#282830] text-white px-2 py-1 rounded text-xs disabled:opacity-40"
                          />

                          <label className="text-zinc-500 ml-2">Fechamento:</label>
                          <input
                            type="time"
                            disabled={!dayConfig.aberto}
                            value={dayConfig.fim}
                            onChange={(e) => {
                              const updated = { ...scheduleConfig };
                              updated.diasFuncionamento[dayIdx] = {
                                ...dayConfig,
                                fim: e.target.value,
                              };
                              StorageService.saveScheduleConfig(updated);
                              refreshData();
                            }}
                            className="bg-[#101014] border border-[#282830] text-white px-2 py-1 rounded text-xs disabled:opacity-40"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Specific Blocked Slots (e.g., 15/09/2026 - 14:00 - Bloqueado) */}
              <div className="bg-[#131317] border border-[#222228] rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-white">
                      Bloqueio de Horários Específicos
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Impeça reservas em datas ou horários específicos (pausa para almoço, compromisso externo, etc.)
                    </p>
                  </div>
                </div>

                {/* Add new blocked slot form */}
                <form
                  onSubmit={handleAddBlock}
                  className="p-4 rounded-xl bg-[#17171C] border border-[#25252E] mb-6 flex flex-wrap items-end gap-3 text-xs"
                >
                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Data</label>
                    <input
                      type="date"
                      required
                      value={newBlockDate}
                      onChange={(e) => setNewBlockDate(e.target.value)}
                      className="bg-[#101014] border border-[#282830] text-white px-3 py-2 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Horário</label>
                    <input
                      type="time"
                      required
                      value={newBlockTime}
                      onChange={(e) => setNewBlockTime(e.target.value)}
                      className="bg-[#101014] border border-[#282830] text-white px-3 py-2 rounded-lg text-xs"
                    />
                  </div>

                  <div className="flex-1 min-w-[160px]">
                    <label className="block text-zinc-400 font-bold mb-1">Motivo (Opcional)</label>
                    <input
                      type="text"
                      value={newBlockReason}
                      onChange={(e) => setNewBlockReason(e.target.value)}
                      placeholder="Ex: Bloqueado, Almoço, Manutenção"
                      className="w-full bg-[#101014] border border-[#282830] text-white px-3 py-2 rounded-lg text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="gold-button py-2 px-4 rounded-lg font-bold text-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Bloquear Horário</span>
                  </button>
                </form>

                {/* Current blocked slots list */}
                <div className="divide-y divide-[#1D1D24]">
                  {scheduleConfig.horariosBloqueados.length === 0 ? (
                    <p className="text-xs text-zinc-500 py-4 text-center">
                      Nenhum horário bloqueado no momento.
                    </p>
                  ) : (
                    scheduleConfig.horariosBloqueados.map((blk) => (
                      <div
                        key={blk.id}
                        className="py-3 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-red-400 bg-red-950/40 border border-red-900/50 px-2 py-0.5 rounded">
                            {formatDateBR(blk.data)} às {blk.horario}
                          </span>
                          <span className="text-zinc-300 font-medium">{blk.motivo || 'Bloqueado'}</span>
                        </div>

                        <button
                          onClick={() => handleRemoveBlock(blk.id)}
                          className="text-xs text-zinc-400 hover:text-red-400 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Desbloquear</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: BANCO DE DADOS & PERSISTÊNCIA */}
          {activeTab === 'banco' && (
            <div className="space-y-6">
              <div className="bg-[#131317] border border-[#222228] rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                      <Database className="w-5 h-5 text-[#D4AF37]" />
                      <span>Estrutura de Banco de Dados</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Armazenamento persistente pronto para produção. Esquemas normalizados de Clientes, Agendamentos, Serviços, Barbeiros e Configurações.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportData}
                      className="px-4 py-2 rounded-lg bg-[#1F1F26] hover:bg-[#282833] text-white border border-[#2F2F3D] text-xs font-bold flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Exportar Backup JSON</span>
                    </button>

                    <button
                      onClick={handleResetData}
                      className="px-4 py-2 rounded-lg bg-red-950/30 hover:bg-red-950/60 text-red-300 border border-red-900/40 text-xs font-bold flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restaurar Padrão</span>
                    </button>
                  </div>
                </div>

                {/* Schemas breakdown preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-[#17171C] border border-[#222228]">
                    <h4 className="font-bold text-white mb-2 text-sm flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Clientes ({StorageService.getClients().length})</span>
                    </h4>
                    <pre className="text-[11px] text-zinc-400 font-mono bg-[#0D0D10] p-2.5 rounded border border-[#1F1F24]">
{`ID: string (UUID)
Nome: string
Telefone: string
DataCadastro: ISO Date`}
                    </pre>
                  </div>

                  <div className="p-4 rounded-xl bg-[#17171C] border border-[#222228]">
                    <h4 className="font-bold text-white mb-2 text-sm flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Agendamentos ({appointments.length})</span>
                    </h4>
                    <pre className="text-[11px] text-zinc-400 font-mono bg-[#0D0D10] p-2.5 rounded border border-[#1F1F24]">
{`ID: string
Cliente: string
Telefone: string
Serviço: string
Barbeiro: string
Data: YYYY-MM-DD
Horário: HH:mm
Status: 'confirmado' | ...`}
                    </pre>
                  </div>

                  <div className="p-4 rounded-xl bg-[#17171C] border border-[#222228]">
                    <h4 className="font-bold text-white mb-2 text-sm flex items-center gap-1.5">
                      <Scissors className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Serviços ({services.length})</span>
                    </h4>
                    <pre className="text-[11px] text-zinc-400 font-mono bg-[#0D0D10] p-2.5 rounded border border-[#1F1F24]">
{`ID: string
Nome: string
Descrição: string
Preço: string | number
Duração: number (minutos)
Status: 'ativo' | 'inativo'`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL: ADD / EDIT SERVICE */}
      {(editingService || isAddingService) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#121215] border border-[#2E2E36] rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingService ? 'Editar Serviço' : 'Novo Serviço'}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const srv: BarberService = {
                  id: editingService ? editingService.id : 'srv-' + Date.now(),
                  nome: (formData.get('nome') as string).trim(),
                  descricao: (formData.get('descricao') as string).trim(),
                  preco: (formData.get('preco') as string).trim() || 'Consultar',
                  duracaoMinutos: Number(formData.get('duracaoMinutos')) || 30,
                  status: (formData.get('status') as any) || 'ativo',
                };
                StorageService.saveService(srv);
                refreshData();
                setEditingService(null);
                setIsAddingService(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-zinc-300 font-bold mb-1">Nome do Serviço</label>
                <input
                  name="nome"
                  required
                  defaultValue={editingService?.nome || ''}
                  placeholder="Ex: Corte Degrade"
                  className="w-full bg-[#18181D] border border-[#282830] text-white p-2.5 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">Descrição</label>
                <textarea
                  name="descricao"
                  rows={2}
                  defaultValue={editingService?.descricao || ''}
                  placeholder="Detalhes do corte ou procedimento..."
                  className="w-full bg-[#18181D] border border-[#282830] text-white p-2.5 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Preço</label>
                  <input
                    name="preco"
                    defaultValue={editingService?.preco || 'Consultar'}
                    placeholder="Ex: Consultar ou R$ 50,00"
                    className="w-full bg-[#18181D] border border-[#282830] text-white p-2.5 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Duração (minutos)</label>
                  <input
                    name="duracaoMinutos"
                    type="number"
                    defaultValue={editingService?.duracaoMinutos || 30}
                    step={5}
                    min={10}
                    className="w-full bg-[#18181D] border border-[#282830] text-white p-2.5 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">Status</label>
                <select
                  name="status"
                  defaultValue={editingService?.status || 'ativo'}
                  className="w-full bg-[#18181D] border border-[#282830] text-white p-2.5 rounded-lg"
                >
                  <option value="ativo">Ativo (visível no site)</option>
                  <option value="inativo">Inativo (oculto)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#222228]">
                <button
                  type="button"
                  onClick={() => {
                    setEditingService(null);
                    setIsAddingService(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#18181D] text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button type="submit" className="gold-button px-5 py-2 rounded-lg font-bold">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT BARBER */}
      {(editingBarber || isAddingBarber) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#121215] border border-[#2E2E36] rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingBarber ? 'Editar Barbeiro' : 'Novo Barbeiro'}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const espStr = (formData.get('especialidades') as string) || '';
                const barber: Barber = {
                  id: editingBarber ? editingBarber.id : 'barber-' + Date.now(),
                  nome: (formData.get('nome') as string).trim(),
                  fotoUrl:
                    (formData.get('fotoUrl') as string).trim() ||
                    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
                  especialidades: espStr.split(',').map((s) => s.trim()).filter(Boolean),
                  status: (formData.get('status') as any) || 'ativo',
                  horarioAtendimento: (formData.get('horarioAtendimento') as string).trim(),
                };
                StorageService.saveBarber(barber);
                refreshData();
                setEditingBarber(null);
                setIsAddingBarber(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-zinc-300 font-bold mb-1">Nome do Profissional</label>
                <input
                  name="nome"
                  required
                  defaultValue={editingBarber?.nome || ''}
                  placeholder="Ex: Cristopher"
                  className="w-full bg-[#18181D] border border-[#282830] text-white p-2.5 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">URL da Foto</label>
                <input
                  name="fotoUrl"
                  defaultValue={editingBarber?.fotoUrl || ''}
                  placeholder="https://..."
                  className="w-full bg-[#18181D] border border-[#282830] text-white p-2.5 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">
                  Especialidades (separadas por vírgula)
                </label>
                <input
                  name="especialidades"
                  defaultValue={editingBarber?.especialidades.join(', ') || 'Degradê, Barba, Navalha'}
                  placeholder="Ex: Degradê, Barboterapia, Visagismo"
                  className="w-full bg-[#18181D] border border-[#282830] text-white p-2.5 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">Horário / Dias de Atendimento</label>
                <input
                  name="horarioAtendimento"
                  defaultValue={editingBarber?.horarioAtendimento || 'Segunda a Sábado'}
                  placeholder="Ex: Segunda a Sábado"
                  className="w-full bg-[#18181D] border border-[#282830] text-white p-2.5 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">Status</label>
                <select
                  name="status"
                  defaultValue={editingBarber?.status || 'ativo'}
                  className="w-full bg-[#18181D] border border-[#282830] text-white p-2.5 rounded-lg"
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#222228]">
                <button
                  type="button"
                  onClick={() => {
                    setEditingBarber(null);
                    setIsAddingBarber(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#18181D] text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button type="submit" className="gold-button px-5 py-2 rounded-lg font-bold">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MANUAL APPOINTMENT (Walk-in or phone call) */}
      {isAddingAppointment && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#121215] border border-[#2E2E36] rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              Agendamento Manual (Balcão / Telefone)
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const srvId = formData.get('servicoId') as string;
                const foundSrv = services.find((s) => s.id === srvId) || services[0];
                const barberId = formData.get('barbeiroId') as string;
                const foundBarber = barbers.find((b) => b.id === barberId) || barbers[0];

                StorageService.createAppointment({
                  clienteNome: (formData.get('clienteNome') as string).trim(),
                  clienteTelefone: (formData.get('clienteTelefone') as string).trim(),
                  servicoId: foundSrv.id,
                  servicoNome: foundSrv.nome,
                  servicoPreco: foundSrv.preco,
                  barbeiroId: foundBarber.id,
                  barbeiroNome: foundBarber.nome,
                  data: formData.get('data') as string,
                  horario: formData.get('horario') as string,
                  status: 'confirmado',
                });
                refreshData();
                setIsAddingAppointment(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-zinc-300 font-bold mb-1">Nome do Cliente *</label>
                <input
                  name="clienteNome"
                  required
                  placeholder="Nome do cliente"
                  className="w-full bg-[#18181D] border border-[#282830] text-white p-2.5 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">Telefone / WhatsApp *</label>
                <input
                  name="clienteTelefone"
                  required
                  placeholder="(33) 99999-9999"
                  className="w-full bg-[#18181D] border border-[#282830] text-white p-2.5 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Serviço</label>
                  <select
                    name="servicoId"
                    className="w-full bg-[#18181D] border border-[#282830] text-white p-2.5 rounded-lg"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Barbeiro</label>
                  <select
                    name="barbeiroId"
                    className="w-full bg-[#18181D] border border-[#282830] text-white p-2.5 rounded-lg"
                  >
                    {barbers.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Data</label>
                  <input
                    type="date"
                    name="data"
                    required
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full bg-[#18181D] border border-[#282830] text-white p-2.5 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Horário</label>
                  <input
                    type="time"
                    name="horario"
                    required
                    defaultValue="14:00"
                    className="w-full bg-[#18181D] border border-[#282830] text-white p-2.5 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#222228]">
                <button
                  type="button"
                  onClick={() => setIsAddingAppointment(false)}
                  className="px-4 py-2 rounded-lg bg-[#18181D] text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button type="submit" className="gold-button px-5 py-2 rounded-lg font-bold">
                  Criar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
