# ResumeAI — Assistente de Resumo Inteligente com IA

O **ResumeAI** é um assistente web focado na análise, classificação e síntese de textos em português brasileiro. O projeto foi desenvolvido como parte dos requisitos práticos da **Residência em Software & Inteligência Artificial — Porto Digital 2026**.

A aplicação utiliza o modelo de linguagem **LLaMA 3.3 70B Versatile** por meio da infraestrutura de altíssima velocidade da **Groq API**, entregando resumos estruturados de forma quase instantânea para o usuário final.

---

## 🚀 Funcionalidades do MVP

- **Processamento Ultrarrápido:** Integração direta com a API da Groq para respostas em milissegundos.
- **Modelagem de Estilos Personalizados:** Suporte a 4 perfis distintos de síntese adaptados à necessidade do usuário:
  - *Conciso:* Resumos diretos de 3 a 5 frases focados na essência.
  - *Tópicos:* Extração estrita de pontos-chave em bullet points.
  - *Executivo:* Estruturação profissional contendo contexto, principais achados e conclusão.
  - *Didático:* Tradução de termos complexos para linguagem simples e acessível.
- **Análise Semântica Multidimensional:** Além do resumo, a IA analisa o texto de entrada e retorna dinamicamente metadados estruturados:
  - Detecção automática do **Tema Principal** (em 2 a 4 palavras).
  - Identificação do **Tom Linguístico** (Informativo, Técnico, Acadêmico, etc.).
  - Criação de uma lista explícita de **Pontos-Chave**.
- **Interface Moderna & Fluida:** Layout limpo e responsivo com efeitos visuais sutis (efeitos de glow e noise overlay).

---

## 🛠️ Arquitetura e Engenharia de Prompt

O verdadeiro motor do projeto reside na camada de **Prompt Engineering (v2.1)**. Como o frontend se comunica recebendo dados tipados para renderizar as tags visuais na tela, o *System Prompt* foi desenhado para blindar e forçar o comportamento do modelo a responder exclusivamente em formato JSON puro.

Para entender a fundo nossa evolução de prompts, o processo de validação manual e os cenários reais de falha mapeados durante o desenvolvimento, consulte nossos documentos dedicados na pasta raiz:
- 📝 [Documentação de Prompt Engineering](./prompt-engineering.md)
- ❌ [Registro de Prompts que Falharam](./prompts-falharam.md)

---

## 🔌 O Papel do MuleSoft na Arquitetura (Visão Corporativa)

Embora este MVP frontend realize chamadas diretas à API para validação de escopo acadêmico, em um cenário de produção escalável e corporativo, o projeto prevê a integração com o **MuleSoft** atuando como a camada de **Enterprise Service Bus (ESB) / API Gateway**. 

O diagrama de arquitetura idealizado posiciona o MuleSoft no "meio de campo" entre o Frontend e os provedores de LLM, desempenhando quatro funções críticas:

1. **Segurança e Abstração de Credenciais:** O arquivo `script.js` deixaria de apontar para a Groq e chamaria o endpoint do MuleSoft. O MuleSoft armazena as chaves de API secretas em seu ambiente seguro, evitando a exposição de credenciais (como tokens de autenticação) no navegador do cliente.
2. **Rate Limiting e Governança:** Para proteger o orçamento de tokens e evitar abusos na API, o MuleSoft implementa políticas automáticas de *Throttling*. É possível configurar regras restritas, como limitar cada usuário a no máximo 5 resumos por minuto, bloqueando requisições excessivas antes que cheguem à API da IA.
3. **Mediação de Dados e Agnosticismo de LLM:** O frontend passa a enviar sempre o mesmo padrão de requisição JSON. Se amanhã a equipe decidir trocar a Groq pela OpenAI (ChatGPT) ou por um modelo local na AWS, a mudança é feita 100% dentro do MuleSoft através do *DataWeave*. O frontend nunca precisará ser reescrito.
4. **Auditoria e Logs de Uso:** Centralização das métricas de consumo de tokens, tempo de resposta e volumetria de textos processados para relatórios gerenciais e de auditoria de dados.

---

## 📁 Estrutura de Arquivos do Projeto

```text
resumo-ia/
│
├── index.html            # Estrutura e semântica da interface do usuário
├── style.css             # Estilização moderna e responsividade baseada em tokens de design
├── script.js             # Lógica de controle do DOM, requisição assíncrona e parsing de dados
├── prompt-engineering.md # Relatório técnico exigido pela rubrica 1.2
└── prompts-falharam.md   # Relatório de tratamento de erros e iterações exigido pela rubrica 1.5
🔧 Como Executar Localmente
Como o projeto é estruturado em frontend puro, você não precisa instalar dependências pesadas (como Node.js ou Docker) para rodar a interface.

Clone o Repositório:

Bash
git clone [https://github.com/hugopires2k/resumo-ia.git](https://github.com/hugopires2k/resumo-ia.git)
cd resumo-ia/resumo-ia
Configure sua Chave de API:
Abra o arquivo script.js e localize a linha da variável de autenticação da API. Substitua o placeholder pela sua chave real gerada no painel da Groq:

JavaScript
// Altere na linha correspondente do cabeçalho da requisição:
"Authorization": "Bearer SUA_CHAVE_GROQ_AQUI"
Nota de segurança: Nunca submeta commits para repositórios públicos contendo sua chave real ativa.

Inicie a Aplicação:
Basta dar um duplo clique no arquivo index.html para abri-lo diretamente em qualquer navegador moderno, ou utilize a extensão Live Server no VS Code para desenvolvimento em tempo real.

🎓 Equipe e Contexto
Este projeto foi desenvolvido de forma autoral para avaliação na disciplina de construção de MVPs com foco em inteligência artificial.

Instituição: Porto Digital — Recife/PE

Programa: Residência em Software & IA 2026
