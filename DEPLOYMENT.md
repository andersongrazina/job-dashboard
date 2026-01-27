# 🚀 Guia de Deployment - Job Dashboard

## Backend (EasyPanel)

### Configuração no EasyPanel

1. **Criar Nova Aplicação**
   - Nome: `job-dashboard-backend` (ou similar)
   - Tipo: Docker
   - Repositório: `https://github.com/andersongrazina/job-dashboard.git`
   - Branch: `main`

2. **Dockerfile**
   - Caminho: `Dockerfile.backend`
   - Contexto: Raiz do repositório

3. **Variáveis de Ambiente**
   ```
   PORT=8000
   BASEROW_URL=https://n8n-baserow.v6s8rs.easypanel.host/api/database/rows/table
   BASEROW_TOKEN=xUhLDnUtV09UKOSDDd5kgW9E1GBzPA0x
   TABLE_ID=699
   ```

4. **Porta**
   - Expor: `8000`
   - Protocolo: HTTP

5. **Health Check**
   - Endpoint: `GET /api/health`
   - Intervalo: 30s
   - Timeout: 3s

### Estrutura do Projeto

```
job-dashboard/
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   ├── .env
│   ├── Dockerfile (local)
│   └── .dockerignore
├── frontend/
│   ├── ...
│   └── Dockerfile
├── Dockerfile.backend (para EasyPanel)
├── .dockerignore (raiz)
└── README.md
```

### Troubleshooting

#### Erro: "package.json not found"
- ✅ Usar `Dockerfile.backend` (não `backend/Dockerfile`)
- ✅ Contexto de build deve ser a raiz do repositório
- ✅ Variáveis de ambiente devem estar configuradas

#### Erro: "Cannot connect to Baserow"
- ✅ Verificar `BASEROW_URL` e `BASEROW_TOKEN`
- ✅ Verificar se a URL é acessível
- ✅ Verificar se o token é válido

#### Erro: "Port already in use"
- ✅ Mudar `PORT` para outra porta (ex: 8001)
- ✅ Verificar se outra aplicação está usando a porta

### Endpoints Disponíveis

```
GET  /api/health              - Health check
GET  /api/settings            - Obter configurações
POST /api/settings            - Atualizar configurações
GET  /api/jobs                - Listar todas as vagas
GET  /api/jobs/search         - Buscar vagas com filtros
```

### Exemplo de Requisição

```bash
curl -X GET http://localhost:8000/api/jobs \
  -H "Content-Type: application/json"
```

### Logs

Para ver os logs em tempo real:
```bash
docker logs -f <container-id>
```

---

## Frontend (EasyPanel)

### Configuração no EasyPanel

1. **Criar Nova Aplicação**
   - Nome: `job-dashboard-frontend`
   - Tipo: Docker
   - Repositório: `https://github.com/andersongrazina/job-dashboard.git`
   - Branch: `main`

2. **Dockerfile**
   - Caminho: `frontend/Dockerfile`
   - Contexto: Raiz do repositório

3. **Variáveis de Ambiente**
   ```
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Porta**
   - Expor: `5173` (ou a porta configurada no Vite)

---

## Notas Importantes

- ✅ O `Dockerfile.backend` está na raiz para compatibilidade com EasyPanel
- ✅ O `backend/Dockerfile` é para desenvolvimento local
- ✅ Sempre fazer commit antes de fazer deploy
- ✅ Verificar logs após deploy para erros

---

**Última atualização:** 27 de Janeiro de 2026
