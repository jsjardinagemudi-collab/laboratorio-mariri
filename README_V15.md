# A Luz do Mariri — Laboratório V15 (teste)

Atualização incremental sobre V14, sem recriar o motor do jogo.

## Implementado
- Mapa como área principal em tela cheia, com navegação inferior compacta.
- Painel lateral flutuante com fundo claro e menu secundário.
- Acesso principal a Instituto, Equipes, Guias, Batalhas, Construir e Inventário.
- Filtro de Guias por elemento, função e recrutamento; classificação por nível mantida.
- Quatro escolas elementais incluídas como prédios implantáveis, cada uma com requisitos.
- Escolas devem ser construídas antes de novas formações ou evoluções.
- Clique em prédios apresenta Entrar, Evoluir e Informações; evolução do Instituto redirecionada ao fluxo existente.

## Limitações conhecidas
- Evolução individual de todos os edifícios ainda não implementada; alguns atalhos abrem o menu de construções.
- Layout deve ser testado em celulares de diferentes dimensões.
- Não foi realizada suíte automatizada de testes de navegador; houve validação sintática de JavaScript e integridade ZIP.
- O arquivo preview.html é autocontido; para GitHub Pages publique o conteúdo completo do ZIP.
- Antes de substituir o site, exporte o backup do jogo na versão atual.
