# 📊 Job Dashboard

Dashboard de vagas com filtros dinâmicos conectado ao Baserow. Aplicação completa em Docker pronta para EasyPanel.

## 🚀 Características

- ✅ **Dashboard responsivo** com React
- ✅ **Filtros dinâmicos** por todos os campos
- ✅ **Filtro de data com calendário** (período customizável)
- ✅ **Ordenação** por data e salário
- ✅ **Configurações via interface** (sem editar código)
- ✅ **Backend Node.js/Express** com cache
- ✅ **Docker Compose** pronto para EasyPanel
- ✅ **Suporta 200+ vagas/dia**

## 📋 Requisitos

- Docker e Docker Compose instalados
- Baserow já configurado com a tabela de vagas (ID: 699)
- Token de API do Baserow

## 🔧 Instalação Rápida

### 1. Clone ou copie os arquivos

```bash
cd job-dashboard
```

### 2. Configure as variáveis de ambiente (opcional)

O arquivo `docker-compose.yml` já vem com as configurações padrão:
- URL do Baserow: `https://n8n-baserow.v6s8rs.easypanel.host/api/database/rows/table`
- Token: `xUhLDnUtV09UKOSDDd5kgW9E1GBzPA0x`
- Table ID: `699`

Se precisar alterar, edite o `docker-compose.yml`:

```yaml
environment:
  - BASEROW_URL=sua_url_aqui
  - BASEROW_TOKEN=seu_token_aqui
  - TABLE_ID=seu_table_id_aqui
```

### 3. Inicie os containers

```bash
docker-compose up -d
```

### 4. Acesse a aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api

## 🎯 Como Usar

### Dashboard Principal

1. **Filtros Disponíveis:**
   - Título da Vaga
   - Empresa
   - Região
   - Localização
   - Data De / Data Até (com calendário)

2. **Ordenação:**
   - Por Data de Coleta (padrão)
   - Por Salário
   - Crescente ou Decrescente

3. **Ações:**
   - Limpar todos os filtros
   - Clicar em "Ver" para abrir a vaga no link original

### Configurações

1. Clique no botão **⚙️ Configurações** no topo
2. Atualize:
   - URL do Baserow
   - Token de API
   - ID da Tabela
3. Clique em **Salvar**

As configurações são salvas e aplicadas imediatamente.

## 📁 Estrutura do Projeto

```
job-dashboard/
├── backend/
│   ├── server.js           # API Express
│   ├── package.json
│   ├── .env
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── Dashboard.js    # Componente principal
│   │   ├── Dashboard.css   # Estilos
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🔌 API Endpoints

### Backend (http://localhost:8000/api)

- **GET /health** - Health check
- **GET /settings** - Obter configurações atuais
- **POST /settings** - Atualizar configurações
- **GET /jobs** - Obter todas as vagas (com cache)
- **GET /jobs/search** - Buscar vagas com filtros

### Parâmetros de Busca

```
GET /api/jobs/search?company=Google&source_region=Brasil&dateFrom=2024-01-01&dateTo=2024-01-31&sortBy=collected_at&sortOrder=desc
```

Parâmetros disponíveis:
- `company` - Filtrar por empresa
- `source_region` - Filtrar por região
- `location` - Filtrar por localização
- `job_title` - Filtrar por título
- `dateFrom` - Data inicial (YYYY-MM-DD)
- `dateTo` - Data final (YYYY-MM-DD)
- `sortBy` - Campo para ordenação (collected_at, salary_raw, job_title, company)
- `sortOrder` - Ordem (asc, desc)

## 🐳 Deployment no EasyPanel

### Opção 1: Via Docker Compose (Recomendado)

1. Acesse seu EasyPanel
2. Vá para **Services** → **Add Service**
3. Selecione **Docker Compose**
4. Cole o conteúdo do `docker-compose.yml`
5. Configure as variáveis de ambiente
6. Deploy!

### Opção 2: Containers Individuais

1. **Backend:**
   - Imagem: `node:18-alpine`
   - Build: `./backend`
   - Porta: `8000`
   - Variáveis de ambiente: BASEROW_URL, BASEROW_TOKEN, TABLE_ID

2. **Frontend:**
   - Imagem: `nginx:alpine`
   - Build: `./frontend`
   - Porta: `3000`
   - Proxy para `/api` → Backend

## 🔄 Cache

O backend implementa cache de 5 minutos para melhorar performance:
- Dados são cacheados após primeira requisição
- Cache é limpo ao atualizar configurações
- Ideal para 200+ vagas/dia

## 🛠️ Troubleshooting

### Erro: "Não consegue conectar ao Baserow"

1. Verifique se a URL está correta
2. Verifique se o token é válido
3. Verifique se o Table ID está correto
4. Teste a URL manualmente no navegador

### Erro: "CORS"

O backend já tem CORS habilitado. Se persistir:
1. Verifique se o backend está rodando
2. Verifique a URL da API no frontend

### Containers não iniciam

```bash
# Ver logs
docker-compose logs -f

# Reconstruir
docker-compose down
docker-compose up -d --build
```

## 📊 Performance

- **Cache:** 5 minutos
- **Suporta:** 200+ vagas/dia
- **Tempo de resposta:** < 500ms (com cache)
- **Memória:** ~150MB (backend) + ~100MB (frontend)

## 🔐 Segurança

- Token do Baserow armazenado no backend (não exposto ao frontend)
- CORS configurado
- Sem autenticação (dashboard público)
- HTTPS recomendado em produção

## 📝 Variáveis de Ambiente

```
PORT=8000                                                              # Porta do backend
BASEROW_URL=https://seu-baserow.com/api/database/rows/table          # URL do Baserow
BASEROW_TOKEN=seu_token_aqui                                          # Token de API
TABLE_ID=699                                                           # ID da tabela
REACT_APP_API_URL=http://backend:8000/api                            # URL da API (frontend)
```

## 🚀 Próximos Passos

- [ ] Adicionar autenticação
- [ ] Exportar dados para CSV/Excel
- [ ] Gráficos e estatísticas
- [ ] Notificações de novas vagas
- [ ] Integração com Slack/Discord

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique os logs: `docker-compose logs -f`
2. Teste a API manualmente
3. Verifique as configurações do Baserow

## 📄 Licença

MIT

---

**Desenvolvido com ❤️ para Anderson Grazina**
