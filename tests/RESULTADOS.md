# Testes V12

Executados em 02/11/2026, Chromium 153 headless via Playwright, desktop 1536×1060 e viewport móvel 390×844. Relógio controlado para executar filas e ciclos de produção sem aguardar os tempos reais. Testes usam a interface e fixtures salvas para isolar cooperação, mineração e pesquisa.

| Verificação | Resultado | Evidência |
|---|---|---|
| Inicialização livre | PASS | 16 Guias disponíveis e dois mapas presentes |
| Clique pseudoisométrico | PASS | Célula 4,4 corresponde ao terreno visual; custo debitado uma única vez |
| Construção | PASS | Fila conclui em 30s, ocupa a célula e registra unidade/contador |
| Produção | PASS | Mariri é creditado no ritmo da simulação |
| Produção com painel aberto | PASS | Sem crédito duplicado durante pausa de simulação |
| Formação | PASS | Guia recrutado forma Companhia e é selecionado |
| Movimentação e névoa | PASS | Equipe chega a 11,7 e revela regiões; ordem não inicia ataque |
| Combate cooperativo | PASS | Duas equipes atacam o mesmo alvo, reduzem uma resistência compartilhada e exibem barra real |
| Vitória e recompensas | PASS | Alvo transformado, recompensa e progressão persistidas |
| Mineração | PASS | Depósito conhecido aceita ordem e produz respeitando capacidade |
| Pesquisa | PASS | Requisito, custo e cronômetro da árvore tecnológica funcionam |
| Navegação completa | PASS | Todos os 15 painéis renderizam sem erro |
| Guias | PASS | 16 fichas com retratos e dados originais |
| Salvamento e recarga | PASS | Instituto, equipes, construções e tecnologias preservados |
| Migração V11 | PASS | Copia a chave histórica sem apagar o save anterior |
| Backup JSON | PASS | Arquivo exportado contém versão e estado completo |
| Validação de backup | PASS | Importação inválida mantém o progresso existente |
| Restauração | PASS | Backup válido restaura após confirmação |
| Responsividade | PASS | 390px sem overflow horizontal; navegação e mapa presentes |
| Preview e Jornada | PASS | HTML autocontido inicia tutorial, escolha de Guia e Companhia no nível inicial |
| Runtime | PASS | Nenhuma exceção JavaScript |

Nenhuma exceção JavaScript capturada. O HTML autocontido também foi aberto e iniciou a Jornada com seleção de Guia e formação inicial. Capturas de desktop/celular foram inspecionadas durante a validação. Não foram usados dispositivos físicos.

## Reproduzir

Instale Playwright em um ambiente de desenvolvimento: `npm install --no-save playwright` e `npx playwright install chromium`. Rode `node tests/functional.cjs` dentro desta pasta. O teste sobe um servidor temporário automaticamente. Para usar um navegador já instalado, defina `MARIRI_BROWSER` com o caminho do executável. Para usar um servidor existente, defina `MARIRI_URL`. As dependências de teste não são necessárias para jogar/publicar.
