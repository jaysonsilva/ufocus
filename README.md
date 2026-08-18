# UFOCUS

UFOCUS é um projeto de produtividade pensado para ajudar pessoas a organizar tarefas e manter foco com ciclos de Pomodoro. A aplicação combina um backend em Django com uma interface em React para oferecer um dashboard moderno de gerenciamento pessoal.

## Visão geral

O sistema permite:
- autenticação de usuários com JWT;
- cadastro e login;
- criação, edição e conclusão de tarefas;
- acompanhamento de sessões de foco e pausas;
- painel de dashboard com visualização de informações do usuário e do ambiente de trabalho.

O objetivo do projeto é manter tudo em um único fluxo: usuário faz login, organiza tarefas, executa o timer Pomodoro e registra o tempo dedicado ao foco.

## Stack tecnológica

### Backend
- Python
- Django
- Django REST Framework
- JWT via djangorestframework-simplejwt
- PostgreSQL
- CORS para integração com o frontend

### Frontend
- React
- TypeScript
- Vite
- React Router DOM
- Axios

## Estrutura do projeto

```text
project/
├── backend/
│   ├── api/
│   │   ├── admin.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── core/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── .env
│   ├── manage.py
│   └── .venv/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── index.html
├── .gitignore
├── README.md
└── .env.example (opcional, se você quiser criar uma cópia)
```

## Funcionalidades principais

### Autenticação
- cadastro de usuário;
- login com username e password;
- geração de access token e refresh token;
- rotas protegidas para o dashboard e demais dados pessoais.

### Gestão de tarefas
- criação de tarefas por usuário;
- listagem de tarefas pessoais;
- marcação de tarefa como concluída;
- exclusão de tarefas;
- ordenação por data de criação.

### Sessões de foco
- registro de sessões de foco;
- registro de pausas curtas e longas;
- persistência de tempo e tipo de sessão;
- vínculo com o usuário autenticado.

### Dashboard
- área principal da aplicação;
- sidebar e header com informações do usuário;
- componente de timer Pomodoro;
- blocos de lista de tarefas;
- área reservada para métricas e visão geral.

## Fluxo da aplicação

1. O usuário acessa a tela de login.
2. O frontend envia username e password para a API do backend.
3. O backend valida as credenciais e retorna tokens JWT.
4. O frontend armazena os tokens no localStorage.
5. O dashboard é carregado com os dados do usuário logado.
6. O timer e as tarefas passam a operar em contexto autenticado.

## Requisitos

Antes de rodar o projeto, certifique-se de ter instalado:
- Python 3.10+
- Node.js 18+
- npm
- PostgreSQL
- Git

## Configuração do backend

Entre na pasta do backend e crie um ambiente virtual:

```bash
cd backend
python -m venv .venv
```

Ative o ambiente virtual:

No Windows (PowerShell):
```powershell
.\.venv\Scripts\Activate.ps1
```

No Windows (CMD):
```cmd
.venv\Scripts\activate.bat
```

No Linux/macOS:
```bash
source .venv/bin/activate
```

Instale as dependências necessárias:

```bash
pip install django djangorestframework djangorestframework-simplejwt python-dotenv django-cors-headers psycopg2-binary
```

Crie um arquivo `.env` dentro da pasta `backend` com as variáveis do banco e do Django:

```env
SECRET_KEY=sua_chave_secreta_aqui
DB_NAME=ufocus
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_HOST=localhost
DB_PORT=5432
```

Em seguida, rode as migrações e inicie o servidor:

```bash
python manage.py migrate
python manage.py runserver
```

O backend ficará disponível em:
- http://localhost:8000

## Configuração do frontend

Abra outro terminal e execute:

```bash
cd frontend
npm install
npm run dev
```

A aplicação frontend fica disponível em:
- http://localhost:5173

## Endpoints principais

### Autenticação
- `POST /api/token/` — login e geração de access/refresh token
- `POST /api/token/refresh/` — renovação do token de acesso

### Usuário
- `GET /api/me/` — retorna o perfil do usuário autenticado
- `POST /api/register/` — cadastro de novo usuário

### Tarefas
- `GET /api/tasks/` — lista tarefas do usuário
- `POST /api/tasks/` — cria nova tarefa
- `PATCH /api/tasks/:id/` — atualiza tarefa
- `DELETE /api/tasks/:id/` — remove tarefa

### Sessões de foco
- `GET /api/focus-sessions/` — lista sessões registradas
- `POST /api/focus-sessions/` — registra nova sessão

## Observações importantes

- O projeto usa autenticação por JWT e protege rotas do usuário logado.
- A configuração atual do backend aponta para PostgreSQL, então o banco precisa estar rodando antes do `migrate`.
- O frontend usa o endpoint do backend em `http://localhost:8000/api/`.
- A aplicação está em fase de desenvolvimento, com dashboard e funcionalidades principais já estruturadas.

## Como contribuir

1. Faça um fork do projeto.
2. Crie uma branch para a sua funcionalidade.
3. Faça commits claros e objetivos.
4. Abra um pull request descrevendo a alteração.

## Licença

Este projeto não definiu uma licença específica até o momento. Caso queira, você pode adicionar uma licença antes de publicar o repositório publicamente.
