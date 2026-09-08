---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: []
---

## Scope

Surface: Painel — fulltbet (triagem pré-jogo), toda a página. Visitor mode: Operate.

## Audience, job, action, proof, constraints

Usuário único (Thiago), consulta repetida no celular ao longo do dia, decisão ao vivo. Job: escanear estado (aguardando/bateu/não bateu) e confiança em segundos. Constraint pinado pelo usuário: o semáforo âmbar/verde/vermelho de status sobrevive a qualquer troca de mundo visual.

## Direction contract

THESIS: Um instrumento de triagem se lê como um placar de estádio em andamento, não como uma cabine de avião — todo número é uma máscara de segmentos aceso/apagado, recusando a linguagem de pílula arredondada de dashboard genérico.

OWN-WORLD: Fundo quase preto, dígitos de sete segmentos desenhados em CSS/SVG (sem depender de fonte especial) para todo número de estado — contadores do placar, estrelas de confiança como blocos de segmento cheios/fantasma. Segmento apagado é sempre desenhado como fantasma tênue da mesma forma, nunca simplesmente ausente. Vermelho/âmbar/verde de LED continuam a linguagem literal de status. JetBrains Mono segue para todo texto humano (nomes de time, rótulos) — só numéricos/status viram máscara de segmento. Cards mantêm a doutrina flat/sem-sombra do DESIGN.md atual.

STORY: Thiago olha de relance e lê o estado como lê um placar de estádio — sem decodificar cor de pílula, porque aceso/apagado JÁ é o estado.

FIRST VIEWPORT: Cabeçalho com navegador de dia como leitor de data em segmentos; abaixo, o placar do dia (aguardando/bateu/não bateu) como três contadores grandes em segmento lado a lado, com o estilo fantasma visível mesmo em repouso.

FORM: challenger "signals-instruments-seven-segment-alarm-clock" venceu nos dois eixos (identificação de audiência e clareza de produto) contra a direção sorteada (notação de torneio de xadrez, índice 6, declinada — doou a disciplina de anotação terza/simbólica para rótulos compactos). Seed key a79e406b.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Unresolved decisions

- Cor exata do "fantasma" do segmento apagado (opacidade sobre a cor acesa) — a resolver na implementação, dentro da paleta já commitada.
- Se o filtro por estrelas e os badges de seção também migram pro vocabulário de segmento ou continuam como pill/chip (provável: continuam pill, para não sobrecarregar tudo em segmento).
