# Recuperação de senha

//Requisitos funcionais
**RF**
- O usuário deve poder recuiperar sua senha informando seu e-mail;
- O usuário deve receber um e-mail com instruções de recuperação de senha;
- O usuário deve poder resetar sua senha;


//Requisitos não funcionais (requisitos técnicos, libs, dbs)
**RNF**
- Utilizar Mailtrap para testar envios em ambiente de dev;
- Utilizar Amazon SES para envios em produção;
- O envio de emails deve acontecer em segundo plano (background job);


//Regras de negócio
**RN**
- O link enviado por email para resetar senha, deve expirar em 2h;
- O usuário precisa confirmar a nova senha ao resetar sua senha;


# Atualização do perfil

**RF**
- O usuário deve poder atualizar seu perfil (nome, email e senha)

**RN**
- O usuário não pode alterar seu email para um email já utilizado;
- Para atualizar sua senha o usuário deve informar a senha antiga;
- Para atualizar sua senha o usuário deve confirmar a nova senha; 


# Painel do prestador

**RF**
- O usuário deve poder listar seus agendamentos num dia expecífico;
- O pre3stador deve receber uma notificação sempre que houver um novo agendamentos;
- O prestador deve poder visualizar as notificações não lidas;

**RNF**
- Os agendamentos do prestador do dia, devem ser armazenados em cache;
- As notificações do prestador devbem ser armazenados no MongoDB;
- As notificações do prestador devem ser enviadas em tempo-real utilizando Socket.IO

**RN**
- A notificação deve ter um status de lida ou não lida para que op prestador possa controlar;


# Agendamento de serviços

**RF**
- O usuário deve poder listar todos os prestadores de serviço cadastrados;
- O usuário deve poder listar os dias de um mês com pelo menos um horário disponivel de um prestador;
- O usuário deve poder listar horários disponíveis em um dia específico de um prestador;
- O usuário deve poder realizar um agendamento com um prestador em um horário disponivel;

**RNF**
- A listagem de prestadores deve ser armazenado em cache;


**RN**
- Cada agendamento deve durar 1 hora;
- Os agendamentos devem estar disponíveis entre 8h as 18h (Primeiro as 8h ultimo as 17h);
- O usuário não pode agendar em um horário passado;
- O usuário não pode agendar com ele mesmo;
- O usuário não pode agendar em um horário já ocupado;
