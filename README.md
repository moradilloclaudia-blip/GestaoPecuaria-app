# Gestão Pecuária

MVP responsivo para análise técnica e financeira de lotes em confinamento bovino. A aplicação calcula desempenho, custos, investimento, receita, margem, ROI e ponto de equilíbrio em tempo real.

## Executar localmente

Requisitos: Node.js 20 ou superior e npm.

```bash
npm install
npm run dev
```

Abra o endereço exibido pelo Vite (normalmente `http://localhost:5173`).

Para testar exatamente a versão otimizada de produção após executar o build:

```bash
npm run build
npm run preview
```

O servidor de prévia também informa no terminal o endereço para acesso pelo navegador.

## Verificações

```bash
npm test
npm run lint
npm run build
```

## Estrutura

- `src/domain/`: tipos, regras zootécnicas e financeiras independentes da interface.
- `src/components/`: componentes reutilizáveis de formulário e apresentação.
- `src/App.tsx`: composição das telas de dashboard e análise do lote.

### Regra da arroba produzida

Nesta versão, a arroba produzida corresponde ao **ganho de peso vivo dividido por 15**. O custo da arroba produzida usa apenas custos do período (alimentação e outros custos); a compra dos animais é capital de aquisição e não entra nesse numerador. A função isolada `liveWeightArrobas` facilita a futura inclusão de regras de carcaça.

## Evolução planejada

A camada de domínio não depende do React e permite incorporar persistência, múltiplas propriedades e ciclos, novas modalidades produtivas, DRE, autenticação e relatórios sem reescrever as regras principais.

## Prévia sem dependências

Quando o acesso ao registry npm estiver indisponível, há uma prévia navegável que não depende de pacotes externos. Ela preserva as mesmas premissas de cálculo do MVP:

```bash
npm run preview:static
```

Acesse `http://localhost:4173/preview/`. Essa alternativa permite navegar pelo dashboard, editar as principais premissas e observar o recálculo dos indicadores diretamente no navegador.

## Publicação no GitHub Pages

O workflow `.github/workflows/pages.yml` publica automaticamente a prévia quando
esta branch chega à `main`. O endereço público aparece no resumo da execução
**Publicar prévia no GitHub Pages**, na aba **Actions** do repositório. A URL termina
em `/preview/` e não requer Node.js ou instalação no computador de quem acessa.
