# A Luz do Mariri — V15 Dashboard Visual Integrado (teste)

## O que foi integrado
- Mapa em tela cheia, renderização isométrica procedural com cores e detalhes de terreno aprimorados.
- Barra esquerda de ícones compactos, expansível e recolhível.
- Três atalhos compactos no canto inferior direito: Visão Geral, Guias e Equipes.
- Coluna superior direita com retratos das equipes e Vitalidade, quando existem equipes.
- Painéis claros flutuantes sem substituir o mapa.
- Missões, Eventos, Desafios e Calendário de hoje + 7 dias.
- Preservação do motor V14/V15.1, incluindo recursos, construção, combate, pesquisas e salvamento local.

## Limitações importantes
- Esta é uma versão de teste do dashboard e do mapa procedural, não um mapa com assets 3D profissionais ou animações AAA. O visual de arte conceitual aprovado anteriormente não é ainda um asset jogável integrado.
- Eventos, Desafios e Calendário são exemplos visuais, não agendam atividades nem dão recompensas.
- Missões e Conquistas antigas continuam operadas pelo motor herdado. O painel de Missões pode atualizar enquanto o relógio do jogo avança.
- A história e introdução narrativa serão implementadas após a avaliação da jogabilidade, conforme solicitado.
- Verificações de sintaxe JavaScript e geração da prévia foram executadas; testes automatizados em navegador ficaram bloqueados pelo ambiente. Validar em navegador antes de substituir a versão estável.

## Publicação
1. Faça **Backup** JSON do jogo atual, no mesmo navegador/domínio.
2. Extraia o ZIP e envie o **conteúdo** à raiz do repositório GitHub Pages (substitua arquivos com os mesmos nomes).
3. Abra o site e pressione Ctrl+Shift+R para ignorar o cache.
4. Teste mapa Instituto/Exploração, barra lateral, construção, equipes, Guias, Missões e Calendário.
5. Não use Reiniciar durante testes de migração. Se possível teste inicialmente em navegador/perfil separado.
