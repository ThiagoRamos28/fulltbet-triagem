---
name: Painel — fulltbet
description: Instrumento de triagem pré-jogo — placar de estádio, não dashboard
colors:
  bg: "#040506"
  bg-grid: "#0a0d10"
  panel: "#0c0f13"
  panel-2: "#10141a"
  line: "#232a32"
  fg: "#e9ecef"
  fg-dim: "#7c8894"
  fg-faint: "#78828f"
  ok: "#23e6a8"
  ok-dim: "#0e3a30"
  miss: "#ff5a72"
  miss-dim: "#3a1620"
  pend: "#f7b53d"
  pend-dim: "#3a2c0e"
  info: "#4fb6ff"
typography:
  title:
    fontFamily: "'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.12em"
  body:
    fontFamily: "'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "normal"
  label:
    fontFamily: "'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace"
    fontSize: "10px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.06em"
rounded:
  card: "12px"
  control: "2px"
  micro: "2px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "18px"
  xl: "30px"
components:
  seven-segment-digit:
    backgroundColor: "transparent"
    textColor: "{colors.fg}"
  status-led-trio:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.control}"
  confidence-cell:
    backgroundColor: "{colors.line}"
    rounded: "{rounded.micro}"
  card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.fg}"
    rounded: "{rounded.card}"
    padding: "10px 12px"
  nav-cell:
    backgroundColor: "transparent"
    textColor: "{colors.fg-dim}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "34px"
---

# Design System: Painel — fulltbet

## Overview

**Creative North Star: "O Placar"**

A página lê como um placar de estádio em andamento ou um relógio de LED de posto de gasolina — não como uma cabine de avião (mundo anterior, ver histórico do projeto) e não como um dashboard genérico de SaaS. O mecanismo central: todo número de estado — os três contadores do placar (aguardando/bateu/não bateu), o leitor de data no cabeçalho, o placar final de cada card — é uma **máscara de sete segmentos desenhada em CSS puro** (`clip-path`, sem fonte de terceiro), com o segmento **apagado sempre desenhado como a mesma forma do aceso**, só tênue — nunca ausente. Essa é a assinatura visual que sobreviveu a três rodadas de revisão sem ser diluída.

O semáforo âmbar/verde/vermelho (aguardando/bateu/não bateu) é constraint pinado do usuário desde o mundo anterior — continua existindo, mas agora expresso como LED (um trio de pontos, o do estado atual aceso) em vez de pílula colorida com fundo tingido. Fundo quase preto, zero `box-shadow` em qualquer lugar (doutrina herdada e mantida — profundidade é sempre tonal). Rótulos versalete com tracking largo continuam a linguagem de categoria; texto corrido (nome de time, ajuda) continua em JetBrains Mono — a família mono nunca foi trocada, só o vocabulário numérico virou segmento.

**Rejeições confirmadas pelas três rodadas de revisão de acabamento:** pílula arredondada (`border-radius: 999px`) no primeiro viewport — contradizia a tese, virou célula quase reta (2px); âmbar usado pra qualquer coisa além do semáforo de status (contagem de seção, badge, barra de confiança) — âmbar hoje significa só "aceso = status ativo"; ícone de seção com peso de traço inconsistente — removido por completo em vez de uniformizado; fantasma de segmento com contraste alto o bastante pra ser lido como outro dígito (bug de leitura real, não estética, pego no tema claro) — corrigido com cor própria por tema.

**Key Characteristics:**
- Todo número de estado é máscara de sete segmentos; texto humano (nome de time, rótulo, ajuda) continua em JetBrains Mono
- Segmento apagado é sempre a mesma forma do aceso, em opacidade/cor tênue — nunca `display: none`, nunca ausência
- Semáforo âmbar/verde/vermelho expresso como LED (trio de pontos), não pílula com fundo tingido
- Zero `box-shadow`; profundidade é tonal (painel sobre fundo, borda de 1-2px)
- Âmbar reservado exclusivamente ao "aceso" do semáforo de status — nenhum outro uso na página
- Barra de confiança (0-5) é célula retangular alongada (10×22px), deliberadamente distinta do LED de status (ponto pequeno), pra não ler como "mais um status"
- Tema claro/escuro via `prefers-color-scheme` **com sobrescrita manual** (`ThemeToggle`, `data-theme` no `<html>`, persistida em `localStorage`) — a única capacidade nova desta rodada além da troca de pele
- Layout de duas colunas acima de 1100px, agrupadas por altura estimada de conteúdo (não pela ordem do menu de atalho, que foi realinhado pra bater com a ordem real de rolagem)

## Colors

Paleta quase monocromática (fundo/painel/texto em cinza-azulado neutro) com quatro acentos de status que carregam praticamente todo o significado de cor do sistema.

### Primary
- **Sinal Âmbar** (`--pend` #f7b53d escuro / #8a5f06 claro): exclusivamente o LED "aguardando" e o contador de segmento correspondente. Depois da 2ª rodada de revisão, não aparece em mais nenhum outro lugar — nem badge, nem contagem de seção, nem barra de confiança.

### Secondary
- **Sinal Verde** (`--ok` #23e6a8 escuro / #087054 claro): bateu.
- **Sinal Vermelho** (`--miss` #ff5a72 escuro / #c22e44 claro): não bateu.
- **Azul de Interface** (`--info` #4fb6ff escuro / #1c66c9 claro): só foco de teclado.

### Neutral
- **Fundo** (`--bg` #040506 escuro / #f2f0e8 claro), **Painel** (`--panel`), **Painel Secundário** (`--panel-2`), **Linha** (`--line`, toda borda de 1-2px do sistema).
- **Texto Primário** (`--fg`), **Texto Secundário** (`--fg-dim` — inclui a barra de confiança acesa, ver Named Rule), **Texto Terciário** (`--fg-faint`).

### Named Rules
**The Amber-Is-Status Rule.** `--pend` só pode significar "aguardando" no semáforo de status. Qualquer uso novo de âmbar em badge, contagem ou indicador graduado é regressão — já aconteceu duas vezes (revisão inicial e 2º verdict pass) e as duas vezes foi revertido.

**The Ghost-Is-Shape Rule.** Um segmento apagado é sempre a mesma forma geométrica do aceso, nunca removida do layout. A cor/opacidade do fantasma é a única coisa que muda, e ela é **calibrada por tema separadamente** (não é uma opacidade genérica): claro usa `--line` sólida, escuro usa `currentColor` a 26%. As duas rodadas de bug real do projeto (fantasma ilegível, depois fantasma lendo como outro dígito) vieram de tratar essa cor como constante entre temas.

**The No-Shadow Rule.** Nenhum elemento usa `box-shadow`. Herdada do mundo anterior, continua valendo.

## Typography

**Única família, para tudo:** JetBrains Mono. Números de estado não usam typography — são desenhados (ver Components). Todo o resto (nome de confronto, rótulo, ajuda) é texto normal nessa família.

### Hierarquia
- **Title** (700, 13px, tracking 0.12em, uppercase): título de seção.
- **Body** (400-600, 12-14px): nome de confronto, horário (quando não em segmento — ver nota), texto de ajuda.
- **Label** (700, 9.5-11px, tracking 0.04-0.1em, uppercase): rótulo abaixo do contador, badge.

Nota: horários de jogo (13:00 etc) migraram para `SevenSegmentDigits` (size 11) na 2ª rodada de correção — deixaram de ser Body e viraram numérico desenhado, mesmo em tamanho pequeno.

## Layout

Container `max-width: var(--content-max)` — 720px em coluna única (mobile/tablet), sobe pra 1240px acima de 1100px de largura, onde as 5 seções se dividem em duas colunas CSS (`display: contents` no mobile, `grid-template-columns: 1fr 1fr` no desktop). O agrupamento entre colunas segue **altura estimada de conteúdo** (Lay 0×1 + Bússola de um lado, Lay Visitante + Farol + Sonar do outro), não a ordem de leitura — decisão tomada depois de duas tentativas de CSS puro (Grid com `grid-column` fixo, `column-count` com balanceamento automático) convergirem pro mesmo desequilíbrio de ~330px. O menu de atalho (`nav.jump`) foi reordenado pra bater com essa nova ordem real de rolagem.

Cabeçalho fixo com altura medida em runtime (`ResizeObserver`), não chumbada. Ritmo vertical herdado do mundo anterior: seções em 30px, cards em 7px de gap.

## Elevation & Depth

Sistema estritamente plano, sem sombra em lugar nenhum — herdado do mundo anterior e nunca questionado pelas três rodadas de revisão. A única pista de profundidade é o cabeçalho fixo com `backdrop-filter: blur`.

## Shapes

Raio pequeno e quase uniforme agora: **2px** pra quase tudo que antes era pílula (nav, filtro, chip de bandeira) ou controle (botão de dia) — a família de sete segmentos não tem vocabulário de pílula, e a 1ª rodada de revisão tirou todo `border-radius: 999px` do primeiro viewport por contradizer a tese. **12px** continua reservado só pro card de jogo (`.card`), o único elemento que ainda lê como "container" no sentido antigo. Bordas sempre 1px sólidas em `--line`.

## Components

### Seven Segment Digit — Componente de assinatura
Máscara de 7 segmentos (`a` a `g`) desenhada em CSS `clip-path`, mapeada por dígito 0-9 (ver `SevenSegment.tsx`). Cada segmento aceso ou apagado é o MESMO elemento DOM — só `.on` muda a cor/opacidade, nunca `display`. Caractere não numérico (`×`, `/`, `:`) passa como texto de apoio na mesma cor, não vira segmento. Usado em: contadores do placar (size 26), leitor de data do cabeçalho, horário de cada linha (size 11), placar final dentro do card.

### Status LED Trio
Substituiu a pílula colorida do mundo anterior. Três pontos pequenos lado a lado (âmbar/verde/vermelho), só o do estado atual aceso — mesma informação de antes, vocabulário de LED de painel em vez de badge de dashboard.

### Confidence Bar (bargraph)
Indicador graduado 0-5, célula retangular 10×22px (não quadrada, de propósito — pra não ler como LED de status). Célula acesa em `--fg-dim` (não âmbar, não branco puro — métrica de apoio não pode competir em peso com o nome do confronto ao lado). Célula apagada reusa a MESMA cor/opacidade do fantasma de sete segmentos — mesma doutrina do sistema inteiro.

### Card (jogo)
`<details>` nativo, sem mudança de vocabulário desde o mundo anterior: 12px de raio, painel sobre fundo, abre/fecha via `grid-template-rows` 0fr→1fr.

### Nav Cell
Herda a forma de controle (2px, não mais pílula). Contorno apenas, texto dim que escurece no hover/focus, `scale(0.94)` no `:active`.

### Theme Toggle — Capacidade nova desta rodada
Ícone lua/sol desenhado (sem lib de ícone), no canto do cabeçalho. Três estados possíveis: segue o sistema (padrão, nenhum `data-theme` no `<html>`), forçado claro, forçado escuro — a escolha manual persiste em `localStorage` e um script inline síncrono no `<head>` aplica o tema salvo antes do primeiro paint, evitando flash.

## Do's and Don'ts

### Do:
- **Do** desenhar qualquer número de estado novo como `SevenSegmentDigits`, nunca como texto comum — é o que faz a página inteira ler como um instrumento e não como uma lista.
- **Do** calibrar a cor do fantasma por tema separadamente — nunca herdar a opacidade de um tema pro outro sem reconferir contraste.
- **Do** manter JetBrains Mono pra todo texto humano — a família nunca muda, só o vocabulário numérico.
- **Do** medir altura de elementos fixos em runtime.

### Don't:
- **Don't** usar âmbar (`--pend`) fora do LED/contador de status "aguardando" — regra quebrada duas vezes já, as duas revertidas.
- **Don't** trazer `border-radius: 999px` de volta — a família de sete segmentos não tem vocabulário de pílula.
- **Don't** adicionar `box-shadow`.
- **Don't** desenhar a barra de confiança com a mesma forma/cor do LED de status — os dois precisam ser distinguíveis à primeira vista.
- **Don't** deixar um segmento "apagado" sumir do layout — é sempre a mesma forma, só mais tênue.
