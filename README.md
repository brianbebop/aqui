Documentação do Projeto: Otimização de Corte de Perfis (mm)
1. Descrição do Projeto
Este projeto consiste em uma aplicação web que otimiza o corte de perfis de metal, madeira ou outros materiais, minimizando o desperdício. O usuário insere o tamanho dos perfis desejados e o sistema calcula a melhor combinação para cortar a partir de barras de tamanho padrão (6000mm), exibindo o resultado em uma tabela e permitindo a exportação para CSV.

2. Estrutura do Projeto
index.html: Estrutura HTML da página web, incluindo formulários, tabelas e botões.
style.css: Folha de estilo CSS para a aparência da página.
script.js: Código JavaScript principal, contendo a lógica de otimização e manipulação da interface.
3. Funcionalidades
Adicionar Perfis: Permite adicionar múltiplos perfis com tamanhos personalizados.
Remover Perfis: Permite remover perfis individuais da lista.
Cálculo de Otimização: Calcula a melhor combinação de cortes para minimizar o desperdício.
Exibição de Resultados: Exibe os resultados em uma tabela, mostrando a combinação de perfis por barra e a sobra de cada barra.
Exportação para CSV: Permite exportar os resultados para um arquivo CSV.
Nome do Projeto: Permite inserir o nome do projeto, que é exibido no título e usado no nome do arquivo CSV exportado.
4. Variáveis Globais
perfisDiv: Referência para a div que contém os perfis inseridos pelo usuário.
adicionarPerfilButton: Referência para o botão "Adicionar Perfil".
calcularButton: Referência para o botão "Calcular".
resultadoDiv: Referência para a div que contém os resultados da otimização.
resumoBarrasTabela: Referência para a tabela que exibe os resultados.
nomeProjetoInput: Referência para o campo de entrada do nome do projeto.
exportarCSVButton: Referência para o botão "Exportar CSV".
perfis: Array que armazena os perfis inseridos pelo usuário.
contadorPerfil: Contador para gerar IDs únicos para os perfis.
5. Funções
calcularOtimizacao(): Função principal que realiza o cálculo da otimização.
Obtém os tamanhos dos perfis inseridos pelo usuário.
Implementa o algoritmo de otimização, que inclui:
Função auxiliar encontrarMelhorCombinacao() para encontrar a melhor combinação de perfis para uma barra.
Lógica para dividir perfis maiores que o tamanho da barra padrão.
Exibe os resultados na tabela.
Atualiza o título da página com o nome do projeto, se fornecido.
Evento de clique do botão "Adicionar Perfil":
Cria um novo elemento div para o perfil.
Adiciona um campo de entrada para o tamanho do perfil e um botão "Remover".
Adiciona o perfil ao array perfis.
Adiciona um evento de clique ao botão "Remover" para remover o perfil da lista e recalcular a otimização.
Evento de clique do botão "Calcular":
Chama a função calcularOtimizacao() para realizar o cálculo.
Evento de clique do botão "Exportar CSV":
Gera o conteúdo CSV com base nos resultados da tabela.
Cria um link para download do arquivo CSV.
6. Algoritmo de Otimização
O algoritmo de otimização utiliza uma abordagem de força bruta combinada com uma estratégia gulosa para encontrar a melhor combinação de cortes.

Divisão de Perfis Grandes: Perfis com tamanho maior que a barra padrão são divididos em múltiplos segmentos.
Combinação de Perfis: A função encontrarMelhorCombinacao() explora todas as combinações possíveis de perfis para encontrar a que deixa a menor sobra na barra.
Estratégia Gulosa: O algoritmo itera sobre os perfis restantes, escolhendo a melhor combinação para cada barra e removendo os perfis utilizados.

7. Como Executar o Projeto
Clone o repositório para o seu computador.
Abra o arquivo index.html em um navegador web.
Insira os tamanhos dos perfis desejados e clique em "Calcular".
Opcionalmente, insira o nome do projeto e clique em "Exportar CSV" para baixar os resultados.
