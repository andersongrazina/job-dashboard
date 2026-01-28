import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Dashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  // Filtros
  const [filters, setFilters] = useState({
    company: '',
    source_region: '',
    location: '',
    job_title: '',
    dateFrom: null,
    dateTo: null
  });

  // Ordenação
  const [sortBy, setSortBy] = useState('collected_at');
  const [sortOrder, setSortOrder] = useState('desc');

  // Calendário
  const [showCalendar, setShowCalendar] = useState(null);

  // Configurações
  const [settings, setSettings] = useState({
    baserowUrl: '',
    tableId: '',
    tokenConfigured: false
  });

  const [newSettings, setNewSettings] = useState({
    baserowUrl: '',
    baserowToken: '',
    tableId: ''
  });

  // Carregar configurações ao iniciar
  useEffect(() => {
    loadSettings();
  }, []);

  // Carregar vagas quando filtros mudam
  useEffect(() => {
    if (settings.tokenConfigured) {
      loadJobs();
    }
  }, [filters, sortBy, sortOrder, settings]);

  const loadSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/settings`);
      setSettings(response.data);
      setNewSettings({
        baserowUrl: response.data.baserowUrl,
        baserowToken: '',
        tableId: response.data.tableId
      });
    } catch (err) {
      console.error('Erro ao carregar configurações:', err);
    }
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/settings`, newSettings);
      setSettings(response.data.config);
      setShowSettings(false);
      alert('Configurações salvas com sucesso!');
    } catch (err) {
      alert('Erro ao salvar configurações: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.company) params.append('company', filters.company);
      if (filters.source_region) params.append('source_region', filters.source_region);
      if (filters.location) params.append('location', filters.location);
      if (filters.job_title) params.append('job_title', filters.job_title);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom.toISOString().split('T')[0]);
      if (filters.dateTo) params.append('dateTo', filters.dateTo.toISOString().split('T')[0]);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const response = await axios.get(`${API_URL}/jobs/search?${params}`);
      setJobs(response.data.data);
    } catch (err) {
      setError('Erro ao carregar vagas: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateSelect = (date, field) => {
    handleFilterChange(field, date);
    setShowCalendar(null);
  };

  const clearFilters = () => {
    setFilters({
      company: '',
      source_region: '',
      location: '',
      job_title: '',
      dateFrom: null,
      dateTo: null
    });
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('pt-BR');
  };

  const extractSalary = (salaryRaw) => {
    if (!salaryRaw) return 'N/A';
    return salaryRaw;
  };

  return (
    <div className="dashboard">
      <header className="header">
        <div className="header-content">
          <h1>💼 Dashboard de Vagas</h1>
          <button 
            className="settings-btn"
            onClick={() => setShowSettings(!showSettings)}
          >
            ⚙️ Configurações
          </button>
        </div>
      </header>

      {showSettings && (
        <div className="settings-panel">
          <h2>Configurações do Baserow</h2>
          <div className="settings-form">
            <div className="form-group">
              <label>URL do Baserow:</label>
              <input
                type="text"
                value={newSettings.baserowUrl}
                onChange={(e) => setNewSettings({...newSettings, baserowUrl: e.target.value})}
                placeholder="https://seu-baserow.com/api/database/rows/table"
              />
            </div>
            <div className="form-group">
              <label>Token de API:</label>
              <input
                type="password"
                value={newSettings.baserowToken}
                onChange={(e) => setNewSettings({...newSettings, baserowToken: e.target.value})}
                placeholder="Seu token do Baserow"
              />
            </div>
            <div className="form-group">
              <label>ID da Tabela:</label>
              <input
                type="text"
                value={newSettings.tableId}
                onChange={(e) => setNewSettings({...newSettings, tableId: e.target.value})}
                placeholder="699"
              />
            </div>
            <div className="settings-buttons">
              <button onClick={saveSettings} disabled={loading} className="btn-primary">
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
              <button onClick={() => setShowSettings(false)} className="btn-secondary">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="filters-section">
        <h2>🔍 Filtros</h2>
        
        <div className="filters-grid">
          <div className="filter-group">
            <label>Título da Vaga:</label>
            <input
              type="text"
              placeholder="Ex: Desenvolvedor"
              value={filters.job_title}
              onChange={(e) => handleFilterChange('job_title', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Empresa:</label>
            <input
              type="text"
              placeholder="Ex: Google"
              value={filters.company}
              onChange={(e) => handleFilterChange('company', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Região:</label>
            <input
              type="text"
              placeholder="Ex: Brasil"
              value={filters.source_region}
              onChange={(e) => handleFilterChange('source_region', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Localização:</label>
            <input
              type="text"
              placeholder="Ex: São Paulo"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Data De:</label>
            <div className="date-input-wrapper">
              <input
                type="text"
                placeholder="Selecione a data"
                value={formatDate(filters.dateFrom)}
                readOnly
                onClick={() => setShowCalendar(showCalendar === 'from' ? null : 'from')}
              />
              {showCalendar === 'from' && (
                <div className="calendar-popup">
                  <Calendar
                    onChange={(date) => handleDateSelect(date, 'dateFrom')}
                    value={filters.dateFrom}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="filter-group">
            <label>Data Até:</label>
            <div className="date-input-wrapper">
              <input
                type="text"
                placeholder="Selecione a data"
                value={formatDate(filters.dateTo)}
                readOnly
                onClick={() => setShowCalendar(showCalendar === 'to' ? null : 'to')}
              />
              {showCalendar === 'to' && (
                <div className="calendar-popup">
                  <Calendar
                    onChange={(date) => handleDateSelect(date, 'dateTo')}
                    value={filters.dateTo}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="filters-actions">
          <button onClick={clearFilters} className="btn-secondary">
            Limpar Filtros
          </button>
        </div>
      </div>

      <div className="sort-section">
        <h2>📊 Ordenação</h2>
        <div className="sort-controls">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="collected_at">Data de Coleta</option>
            <option value="salary_raw">Salário</option>
            <option value="job_title">Título</option>
            <option value="company">Empresa</option>
          </select>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="desc">Decrescente</option>
            <option value="asc">Crescente</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="results-section">
        <h2>📋 Resultados ({jobs.length} vagas)</h2>
        
        {loading && <div className="loading">Carregando vagas...</div>}

        {!loading && jobs.length === 0 && (
          <div className="no-results">Nenhuma vaga encontrada com os filtros selecionados.</div>
        )}

        {!loading && jobs.length > 0 && (
          <div className="jobs-table-wrapper">
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Empresa</th>
                  <th>Localização</th>
                  <th>Região</th>
                  <th>Salário</th>
                  <th>Data</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, index) => (
                  <tr key={index}>
                    <td className="job-title">{job.job_title}</td>
                    <td>{job.company}</td>
                    <td>{job.location}</td>
                    <td>{job.source_region}</td>
                    <td className="salary">{extractSalary(job.salary_raw)}</td>
                    <td>{new Date(job.collected_at).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <a href={job.job_link} target="_blank" rel="noopener noreferrer" className="link-btn">
                        Ver
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
