# Relatório de entrega — V12: O Mundo Desperta

## Base e escopo

Esta entrega evolui `index(2).html` e `README.md` fornecidos como V11. Não havia ZIP anexado nesta solicitação. O dashboard aprovado não estava entre os anexos visuais: o tema foi aplicado conforme as características solicitadas (verde profundo, dourado, navegação lateral e painéis). Não se afirma reprodução exata de uma imagem ausente.

O motor V11 foi aproveitado, sem recriar a jogabilidade. A renderização nova interpreta o estado real e encaminha cliques às ações originais. O jogo continua inteiramente local e estático, compatível com GitHub Pages.

## Funcionalidades preservadas

| Sistema | Situação na V12 |
|---|---|
| Dois mapas | Instituto 12×9 e Exploração 18×12, com alternância original |
| 16 Guias e mentor | Nomes, elementos, funções, descrições e valores originais; Xamã Boiadeiro permanece no tutorial |
| Evolução e talentos | Níveis, experiência, vínculo e árvores existentes mantidos |
| Escolas e aprendizes | Formação, limites, distribuição por Companhia e cronômetros mantidos |
| Equipes independentes | Seleção múltipla, ordens separadas, retorno e edição no Instituto |
| Batalhas cooperativas | Várias equipes no mesmo alvo, liderança, Vitalidade, Harmonia, Supremo e recompensas |
| Exploração | Névoa real, descobertas, coleta, minas, criaturas e ruínas originais |
| Economia | Recursos, capacidade de armazém, produção, tokens e custos originais |
| Construção | Posicionamento, pré-requisitos, fila e evolução com cronômetros |
| Pesquisas | Árvore tecnológica e painel legado mantidos; nenhum efeito novo de tecnologia foi inventado |
| Baús, missões, conquistas | Regras, três recompensas por baú e progressão mantidas |
| Salvamento | Save próprio da V12, migração por cópia da chave V11 e backup JSON |

Preservar não significa completar promessas narrativas que a V11 não implementava. Por exemplo, Supremos continuam usando os cálculos genéricos por função do motor original; todas as descrições individuais foram conservadas, mas nem todas possuem um efeito mecânico exclusivo. As pesquisas legadas e a nova árvore também mantêm suas diferenças originais.

## Implementações visuais e de interface

- Mapa do Instituto pseudoisométrico em Canvas 2D, com terreno em losangos, caminhos, flores, árvores, sombras e iluminação ambiente procedural.
- Casas, armazém, enfermaria, centro de conhecimento, oficina, mina e duas plantações com desenhos distintos.
- Obras mostram estrutura provisória, trabalhador, progresso e tempo restante. Obras de evolução também recebem indicação visual.
- Plantações exibem ciclo visual e oficina tem fumaça. A animação não interfere no cálculo de produção.
- Habitantes circulam no Instituto. São figurantes de ambiente, não equipes com ordens ou tarefas econômicas.
- Exploração recebe vegetação, relevos nas minas, água animada, ruínas e névoa que respeita `seen`.
- Companhias se deslocam suavemente entre as posições reais, com pequenos seguidores, Vitalidade, número da equipe e total de integrantes.
- Botões individuais sob o mapa permitem selecionar e retirar equipes da seleção, inclusive quando ocupam a mesma célula.
- Criaturas têm movimento de repouso e reação visual a combate. Os alvos mantêm comportamento lógico da V11 e uma resistência compartilhada real.
- Traços de ação, partículas e um painel de resistência representam os confrontos em andamento.
- 16 retratos SVG provisórios com cores elementais, roupas e ornamentos variados, além do retrato do Xamã. Substituição individual por URL sem alterar os IDs.
- Fichas mostram nome, elemento, caminho simbólico de apresentação, papel, especialidades, orientação de uso, talentos e Supremo. Os caminhos adicionados são rótulos editoriais e não alteram o Mapa Interior ou as regras.
- Tema verde/dourado, navegação lateral em telas grandes e navegação horizontal em celular. Modo de grade preserva a interação original; células têm acionamento por Enter/Espaço.
- Controle de animações e respeito à preferência de movimento reduzido do sistema.

## Correções e compatibilidade

1. Produção de Mariri/Chacrona não é mais creditada repetidamente quando um popup pausa o relógio exatamente num múltiplo de dez. O mesmo tick só pode gerar um crédito.
2. Conclusões de pesquisa/construção são salvas e reapresentadas também enquanto a Exploração é o mapa ativo.
3. Implantação registra o contador de construções e os passos aplicáveis do tutorial.
4. Construções econômicas legadas passam a aparecer no Instituto ao concluir. Suas evoluções atualizam a indicação de nível.
5. Instalar uma nova unidade de mina não reduz um nível econômico preexistente.
6. A chave histórica da V11 (`mariri-lab-v10-2026-11`) é copiada para uma chave própria V12; nunca é apagada ou substituída pela V12.
7. Falha de escrita no armazenamento gera aviso; o usuário pode exportar o backup. Importação verifica a estrutura antes de pedir substituição.

## Arquitetura entregue

Código estático dividido em HTML, CSS, dados, persistência, mundo visual, retratos, interface V12 e motor. As funções de painéis legados permanecem no motor para reduzir risco de regressão; sua extração integral fica como melhoria de manutenção. Não há dependência externa em produção, bundler ou etapa de instalação.

Os SVGs editáveis e as URLs embutidas correspondentes são fornecidos. O script Python `tools/build_preview.py` regenera o preview autocontido a partir dos arquivos de publicação, evitando manter duas implementações diferentes.

## Pendências e limites

- Arte atual é procedural/vetorial provisória. Não inclui sprites finais desenhados quadro a quadro nem ilustrações finais dos cenários.
- Personagens pequenos no mapa usam um gerador visual. O retrato individual pode ser trocado sem mudar esse desenho; sprites finais do mapa exigirão adaptar `person()`.
- Figurantes do Instituto são cosméticos. Guias não receberam uma nova simulação de tarefas autônomas no Instituto.
- Criaturas não receberam IA nova de perseguição, patrulhas entre células ou encontros aleatórios. A respiração e os efeitos visuais não mudam a agressividade original.
- O relevo e os rios seguem o terreno determinístico V11. Não foi acrescentada navegação com obstáculos, pontes obrigatórias, zoom, arrasto de câmera ou seleção por retângulo. A seleção múltipla funciona pelos botões e marcadores.
- Construções ainda usam a fila única e os limites originais. Tecnologias com descrições de novas filas não passam a criar filas extras nesta entrega.
- Não foram criados poderes exclusivos completos além dos efeitos existentes. Descrições de controle e produção devem ser conciliadas com efeitos mecânicos numa próxima etapa de balanceamento.
- Save local por origem/perfil; sem conta, banco online, multiplayer entre usuários ou sincronização. Cooperação aqui é entre Companhias da mesma partida.
- Produção e caminhada seguem os ticks da partida. Não há cálculo completo de produção durante horas com a página fechada; obras e pesquisas usam horários absolutos.
- Validação em Chromium desktop e viewport móvel, não em aparelhos físicos ou todos os navegadores. O resultado dos testes consta em `tests/RESULTADOS.md`.
- Não houve publicação, push, modificação do Wix ou acesso ao repositório `laboratorio-mariri`. O ZIP está preparado para publicação manual.

## Próxima melhoria recomendada

Substituir gradualmente os desenhos procedurais por sprites individuais, mantendo os mesmos IDs e a interface de renderização. Isso permite elevar a qualidade artística sem mexer novamente no motor de progressão.
