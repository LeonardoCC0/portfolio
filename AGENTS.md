# Regras do projeto

- Site de portfólio pessoal em HTML, CSS e JavaScript puro (sem frameworks).
- Antes de criar ou alterar qualquer coisa, leia referencias.md, identidade.md e funcionalidades.md.
- Mantenha o código organizado: um arquivo CSS (style.css), um JS geral (script.js), o JS do objeto 3D (cromado3d.js) e uma página só (index.html). estudos.html, projetos.html e contato.html só redirecionam para index.html?secao=...
- Igual à referência, o site é uma página só: as 4 seções ficam em blocos `.pagina` dentro de `#conteudo`, e só a ativa aparece. Passar o mouse numa coluna da barra (`.nav-item`) troca a seção; com o mouse na barra o objeto 3D vira pontinhos, e ao sair o objeto sólido volta.
- Os dados de cada seção (nome, objeto 3D, legenda, endereço) ficam nos atributos `data-*` de cada `.nav-item`. O objeto 3D não segue o mouse: só gira sozinho.
- A referência é o mats.zip: posições, tamanhos e espaçamentos devem continuar iguais aos dele.
- Nada de layout genérico de template: siga as referências e a identidade visual do aluno.
- Sempre responsivo (celular e computador).
- Todas as cores ficam em variáveis CSS no `:root`, com versão clara em `[data-theme="light"]`. Nunca escreva cor solta no meio do CSS.
- Textos do site em português, tom direto.
- Depois de cada mudança, explique em 2 linhas o que foi feito.

## O que NÃO fazer
- Não usar Bootstrap, Tailwind, React ou qualquer framework. Exceção: Three.js e opentype.js (carregados pelo importmap) para o objeto 3D do topo.
- Nada de efeito pixelado no objeto do topo: ele é 3D cromado de verdade.
- Não adicionar seções que não estão em funcionalidades.md.
- Não usar cores vibrantes ou gradientes coloridos: a paleta é a da minha foto (azul-marinho, branco, cinza-azulado do céu e o azul-claro do blazer como destaque). Use sempre as variáveis de identidade.md.
- O site é inspirado no mats.zip, mas não é cópia: veja em referencias.md o que foi mudado de propósito e mantenha essas mudanças.
- Não inventar informações sobre o Leonardo (projetos, cursos, idiomas). Se faltar, deixe um comentário `<!-- TODO -->`.
