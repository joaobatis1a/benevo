# 🌱 Benevo

Sistema de gestão de doações para ONGs, com controle de estoque, recebimento e distribuição de itens entre doadores e beneficiários.

🔗 **Demo (somente frontend):** [https://benevo-demo.vercel.app/demo.html](https://benevo-demo.vercel.app/demo.html)

## 🧱 Estrutura do projeto

```
benevo-main/
├── backend/     → API em Java + Spring Boot + MongoDB
└── frontend/    → Interface web em HTML, CSS e JavaScript puro
```

## 🛠️ Tecnologias usadas

**Backend**
- ☕ Java 17
- 🍃 Spring Boot 3.3.3 (Web, Security, Data MongoDB)
- 🍃 MongoDB
- 🧩 Lombok
- 📦 Maven

**Frontend**
- 🌐 HTML5
- 🎨 CSS3
- ⚡ JavaScript (puro, sem framework)

## 📡 Endpoints da API

| Recurso | Método | Rota |
|---|---|---|
| Autenticação | `POST` | `/auth/login` |
| Doador | `POST` | `/doadores/registrar` |
| Doador | `POST` | `/doadores/login` |
| Beneficiário | `POST` | `/beneficiarios/registrar` |
| Beneficiário | `POST` | `/beneficiarios/validar-acesso` |
| Beneficiário | `POST` | `/beneficiarios/responder-desafio` |
| Beneficiário | `GET` | `/beneficiarios/ajuda-login` |
| Item | `POST` | `/item/cadastrar` |
| Item | `GET` | `/item/buscar` |
| Item | `GET` | `/item/{id}` |
| Item | `PUT` | `/item/atualizar/{id}` |
| Item | `DELETE` | `/item/deletar/{id}` |
| Item | `PUT` | `/item/resgatar/{itemId}` |
| Admin / Relatórios | `GET` | `/admin/ultimos-doadores` |
| Admin / Relatórios | `GET` | `/admin/ultimos-beneficiarios` |
| Admin / Relatórios | `GET` | `/admin/ultimas-doacoes` |

## 🚀 Como rodar o projeto localmente

### Pré-requisitos
- Java 17+
- Maven
- Uma instância do MongoDB (local ou Atlas)

### 1. Configurar o banco de dados
Por segurança, o arquivo `application.properties` com a credencial real do banco **não está incluído no repositório**. Em vez disso, existe um arquivo de exemplo:
```
backend/src/main/resources/application.properties.example
```
Copie esse arquivo, renomeie para `application.properties` (mesma pasta) e preencha com uma URI de conexão válida do MongoDB:
```properties
spring.data.mongodb.uri=mongodb+srv://SEU_USUARIO:SUA_SENHA@SEU_CLUSTER.mongodb.net/benevo?retryWrites=true&w=majority
```
> ⚠️ **Sem essa credencial preenchida, o backend não sobe.** Se você não tem acesso ao banco de dados do projeto, peça a URI de conexão para quem administra o MongoDB Atlas do Benevo, ou configure sua própria instância (local ou um cluster gratuito no Atlas).

> ⚠️ **Importante:** nunca deixe usuário e senha reais commitados nesse arquivo. Use variáveis de ambiente ou um arquivo `application-local.properties` ignorado pelo Git.

### 2. Rodar o backend
```bash
cd backend
./mvnw spring-boot:run
```
O servidor sobe por padrão em `http://localhost:8080`.

### 3. Rodar o frontend
O frontend é HTML/CSS/JS puro — não precisa de build. Basta servir a pasta `frontend/`:
```bash
cd frontend
python3 -m http.server 5500
```
Depois acesse `http://localhost:5500`.

> O frontend está configurado para chamar a API em `http://localhost:8080` (arquivo `frontend/assets/js/services/api.js`, constante `API_BASE_URL`). Se o backend rodar em outra porta ou endereço, atualize essa constante.

## 🔒 Segurança
Este projeto usa Spring Security para proteger rotas autenticadas via token. Certifique-se de nunca expor credenciais de banco de dados, chaves ou tokens em arquivos versionados no Git.

---

## 🌐 Demo (somente frontend) no Vercel

Este repositório também pode ser publicado como uma **demo visual** no Vercel — mostrando apenas a interface (`frontend/`), sem o backend.

### ⚠️ O que funciona
- Navegação entre as páginas (`index.html`, `cadastro-doador.html`, `dashboard-admin.html`, etc.)
- Layout, estilos e responsividade

### ⚠️ O que NÃO funciona
- Login, cadastro e qualquer ação que dependa da API (o frontend tenta chamar `http://localhost:8080`, que não existe em produção)
- Dados salvos no MongoDB
- Qualquer requisição feita via `frontend/assets/js/services/api.js`

Ou seja: essa demo serve para **mostrar a interface**, não o sistema funcionando de ponta a ponta.

### 🚀 Como fazer o deploy no Vercel

**Opção A — usando o `vercel.json` (recomendado)**
1. Suba este repositório (com o `vercel.json` na raiz) para o GitHub.
2. No Vercel, importe o repositório normalmente.
3. O `vercel.json` já diz pro Vercel usar a pasta `frontend/` como saída — não precisa mexer em Root Directory.
4. Deploy.

**Opção B — configurando manualmente no painel**
1. No Vercel, ao importar o projeto, vá em **Root Directory** e selecione `frontend`.
2. Não defina Build Command nem Output Directory (deixe em branco) — é HTML puro, sem build.
3. Deploy.

### 🔧 Para uma demo 100% funcional (com backend)
Seria necessário:
1. Hospedar o backend Spring Boot em um serviço compatível (Render, Railway, Fly.io, etc. — o Vercel não roda Java).
2. Hospedar o banco MongoDB (ex: MongoDB Atlas, tem plano grátis).
3. Trocar a constante `API_BASE_URL` em `frontend/assets/js/services/api.js` (atualmente `http://localhost:8080`) para a URL pública do backend hospedado.
4. Fazer o redeploy do frontend no Vercel.

## 📧 Contato
Para mais informações, entre em contato por e-mail: **profissionalba1is1a@gmail.com**