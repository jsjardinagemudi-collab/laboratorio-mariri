# A Luz do Mariri — V12: O Mundo Desperta

Evolução incremental do HTML V11 fornecido. Jogo estático, sem build, CDN, bibliotecas em produção ou servidor de dados. Os nomes, tabelas e motor de simulação da V11 foram mantidos.

## Começar

Abra `index.html` ou, preferencialmente, sirva esta pasta com `python3 -m http.server 8000` e acesse `http://localhost:8000`.

Na primeira entrada, escolha Jornada (tutorial, quatro Guias iniciais) ou Laboratório livre (todos os 16 Guias disponíveis, recursos de teste). Prepare uma Companhia na aba Equipes. Alterne entre Instituto e Exploração.

- Instituto: Implantação → escolher prédio → clicar na clareira. A obra dura 30 segundos; requisitos e fila continuam ativos.
- Exploração: use os botões de equipe sob o mapa para seleção múltipla. Clique no terreno para movimentar. Clique numa criatura → Atacar → confirmar as equipes. “Ir até aqui” não ordena ataque.
- Mineração: clique num depósito conhecido → selecione equipes → Minerar.
- Grade: ativa a interface original, inclusive navegação dos marcadores. Serve também como alternativa ao Canvas.
- Animações: reduz os movimentos visuais sem pausar a simulação. Respeita a preferência de movimento reduzido do sistema.
- Backup: exporta o progresso em JSON. Restaurar pede confirmação e valida a estrutura antes de substituir o progresso V12.

## Publicar no repositorio laboratorio-mariri

1. Faça uma cópia/commit da V11 antes de substituir arquivos.
2. Extraia o ZIP. Envie **o conteúdo** da pasta à raiz da branch usada pelo GitHub Pages: `index.html`, `css/`, `js/`, `assets/` e documentação. Não envie apenas o ZIP nem deixe `index.html` dentro de uma pasta extra.
3. Faça o commit. Se Pages já estava configurado, mantenha a branch e pasta atuais. Caso ainda não esteja, configure Pages para servir a branch que contém estes arquivos a partir da raiz.
4. Após o deploy do GitHub terminar, abra a URL do laboratório e atualize a página. Todos os caminhos de recursos são relativos, compatíveis com subdiretórios.
5. Teste os dois mapas, uma ordem e a recarga antes de divulgar.

Nenhum arquivo do site Wix ou do jogo principal é alterado automaticamente. Não foi executado push no seu repositório.

## Salvamento e migração

A V11 fornecida usava a chave `mariri-lab-v10-2026-11`, apesar do nome da versão. A V12 usa `mariri-lab-v12-2026-11`. Se não há save V12, lê e copia o save V11 na **mesma origem e perfil do navegador**, preservando o original. Reiniciar V12 não apaga V11. Backups permitem transferir entre dispositivos/origens; não existe sincronização online. Um arquivo aberto por `file://` pode ter armazenamento separado ou restrito; use o backup ou um servidor local.

## Organização

| Arquivo | Responsabilidade |
|---|---|
| `index.html` | Estrutura e pontos de interação originais |
| `css/base.css` | Estilos V11 preservados para painéis e grade |
| `css/v12.css` | Dashboard verde/dourado e responsividade |
| `js/data.js` | Guias, criaturas, edifícios e árvore tecnológica originais |
| `js/engine.js` | Regras, simulação, progressão e ações V11; correções V12 documentadas |
| `js/persistence.js` | Save, migração, exportação e importação |
| `js/world.js` | Renderização procedural 2D pseudoisométrica e animações |
| `js/ui.js` | Apresentação V12, seleção de equipes e fichas |
| `js/portraits.js` | URLs individuais dos retratos, embutidos para funcionamento offline |
| `assets/guides/00.svg` a `16.svg` | Fontes editáveis dos retratos dos 16 Guias e Xamã |
| `tests/` | Verificações automatizadas e resultados |

Para substituir um personagem, altere sua entrada em `V12Portraits` para uma URL relativa, por exemplo `assets/guides/aranyaka.png`. Índices 0–15 seguem `CHARS`; índice 16 é Xamã Boiadeiro. Não mude a ordem dos Guias porque os saves usam os índices. O desenho pequeno dos personagens no Canvas é procedural e pode ser substituído separadamente na função `person()`.

A edição de SVG em `assets/guides/` exige atualizar sua URL em `portraits.js`; os retratos embutidos não são regenerados automaticamente. O preview HTML é uma cópia autocontida, gerada da mesma base, para abrir sem extrair o ZIP. Para regenerá-lo após alterações, execute `python3 tools/build_preview.py`.

Veja `RELATORIO.md` para escopo e limitações reais, e `tests/RESULTADOS.md` para verificações executadas.
