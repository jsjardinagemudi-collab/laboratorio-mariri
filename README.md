# A Luz do Mariri — Laboratório V14

Evolução incremental da V12 recebida. Nenhum backend ou dependência de produção.

## Novidades V14
- Indicadores individuais de Vitalidade, Harmonia e poder nas batalhas.
- Botão **Localizar** nas equipes e atalho no mapa.
- Guias mostram força base e projeção por nível.
- Baús podem conceder fragmentos de armadura, peça cosmética e aceleradores.
- Oficina de armadura cosmética: 15 fragmentos por peça.
- Aceleradores: 1, 5, 30, 60, 480, 720 e 1440 minutos; aplicáveis a uma obra ou pesquisa ativa.
- Árvore tecnológica expandida com 11 novas pesquisas, requisitos e tempos.
- Ajustes visuais e de acessibilidade.

## Instalar / publicar
Extraia o ZIP e envie **o conteúdo da pasta** à raiz do repositório GitHub Pages. Abra `index.html` para jogar. `preview.html` é a versão autocontida para teste. Não é necessário `npm install` para jogar.

## Progresso e segurança
A V14 usa uma chave própria `mariri-lab-v13-2026-11`, evitando sobrescrever diretamente a V12. A migração automática depende do `js/persistence.js` e do mesmo domínio/navegador. **Exporte um backup da V12 antes de publicar.** Teste restauração antes de depender dela. Os arquivos V12 não são apagados.

## Limites
A armadura é cosmética; os poderes supremos continuam com as regras do motor herdado, sem habilidades únicas completas para os 16 Guias. A navegação **Localizar** destaca a equipe e mostra suas coordenadas, mas ainda não implementa câmera com zoom/pan. As novas pesquisas usam a fila existente, sem novos efeitos econômicos específicos.


Veja RELATORIO_V14.md para mudanças desta versão.
