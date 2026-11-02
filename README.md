# A Luz do Mariri — Laboratório V7

Protótipo independente para GitHub Pages. Abra `index.html` diretamente no navegador ou publique na raiz do repositório `laboratorio-mariri`.

## Testes principais

1. Inicie com 10.000 Luz, 3.000 Mariri e 3.000 Chacrona.
2. Evolua a Casa do Instituto até o nível 5 para liberar duas equipes (níveis 10, 15 e 20 liberam 3, 4 e 5 equipes).
3. Evolua uma Escola Elemental: seu nível nunca pode ultrapassar o nível do Instituto. Forme aprendizes até a capacidade máxima.
4. Prepare uma equipe com Guia e aprendizes no Instituto; envie-a pelo mapa. Fora do Instituto, o botão de editar formação ficará bloqueado.
5. Prepare outra equipe e selecione ambas nos marcadores do mapa ou na aba Equipes. Clique numa criatura de alto nível e confirme Atacar.
6. Na aba Batalhas, confira o líder, o número de equipes, Guias, aprendizes e o poder conjunto. Mude o líder se desejar.
7. Retorne ao Instituto e use a Enfermaria para recuperar a Vitalidade do Guia.

## Regras

- Uma equipe por Guia; máximo de 5 equipes simultâneas, conforme nível do Instituto.
- Capacidade do Guia depende do nível individual; a Escola limita quantos aprendizes podem ser formados.
- Aprendizes alocados não estão disponíveis para outras equipes.
- A batalha só começa após confirmar a ordem Atacar. Defesa é automática.
- Cada equipe mantém posição e ordens independentes; equipes no mesmo alvo compartilham uma barra de Resistência.
- Aprendizes de Terra, Água, Fogo e Ar contribuem de forma diferente para o poder conjunto.
- Nenhuma conexão externa; progresso salvo no `localStorage` do navegador, separado das versões anteriores.

## Observação

Este é um laboratório de jogabilidade, não a integração ao jogo principal. O visual ainda é provisório. A Enfermaria recupera a Vitalidade do Guia; a saúde individual de cada aprendiz ainda não está modelada nesta versão.
