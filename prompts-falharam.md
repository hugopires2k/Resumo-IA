# Prompts que Falharam — ResumeAI

Esse documento registra dois momentos reais em que os prompts não funcionaram como esperado, o que aprendemos com isso e como ajustamos.

---

## Caso 1 — A IA ignorava o estilo escolhido

### O que acontecia

No começo, o user prompt era genérico demais. A gente enviava algo assim:

```
Resuma o texto abaixo. Estilo: executivo.

Texto:
[texto do usuário]
```

O problema é que o modelo praticamente ignorava o "estilo: executivo". O resumo que voltava era sempre o mesmo formato independente do que o usuário escolhesse — parágrafos soltos, sem estrutura, sem diferença entre conciso, executivo ou didático.

### Por que falhou

A instrução estava vaga. "Estilo: executivo" não diz nada concreto para o modelo. Ele não sabe o que você espera de um resumo executivo se você não explicar.

### Como ajustamos

Substituímos o rótulo vago por uma instrução descritiva e específica para cada estilo:

```
Estilo solicitado: Escreva um resumo executivo profissional destacando: contexto, principais achados e conclusão.
```

Depois dessa mudança, os quatro estilos passaram a gerar respostas visivelmente diferentes entre si. Validamos rodando o mesmo artigo nos 4 modos e comparando lado a lado — a diferença ficou clara.

---

## Caso 2 — O JSON vinha quebrado e derrubava a aplicação

### O que acontecia

Quando implementamos a resposta em JSON pela primeira vez, o prompt dizia apenas:

```
Retorne a resposta em formato JSON com as chaves: resumo, tema, tom, pontos_chave.
```

O modelo obedecia... mais ou menos. Às vezes vinha assim:

```
Aqui está o resumo em JSON:

```json
{
  "resumo": "...",
  ...
}
```
```

Outras vezes vinha com texto depois do JSON, ou com aspas quebradas dentro dos valores. O `JSON.parse()` explodia e a aplicação inteira parava com um erro genérico que não ajudava o usuário a entender o que tinha acontecido.

### Por que falhou

O modelo foi treinado para ser conversacional e "educado" — ele quer contextualizar a resposta. Sem proibir explicitamente esse comportamento, ele continua fazendo isso.

### Como ajustamos

Adicionamos uma instrução proibitiva explícita no final do system prompt:

```
Retorne SOMENTE o JSON, sem backticks, sem texto antes ou depois.
```

Além disso, adicionamos um segundo bloco try/catch no código, separado do tratamento de erro da API, específico para o parse do JSON. Assim, se por algum motivo o modelo ainda retornar algo malformado, o usuário vê uma mensagem clara pedindo para tentar novamente — em vez de um erro técnico sem sentido.

Depois do ajuste, rodamos 20 chamadas seguidas com textos diferentes e o JSON veio bem formado em todas elas.
