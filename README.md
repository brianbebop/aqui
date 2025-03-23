# **Otimização de Corte de Perfis (mm)**

## Descrição

Este projeto visa a otimização do corte de perfis de metal ou outros materiais em barras de 6000 mm. O objetivo é calcular a melhor forma de cortar esses perfis de modo a minimizar o desperdício de material.

O cálculo é feito automaticamente com base nos perfis fornecidos pelo usuário. O sistema organiza esses perfis em barras de tamanho fixo (6000 mm) e otimiza o uso, minimizando o espaço desperdiçado.

## Funcionalidades

- **Adicionar Perfis**: O usuário pode adicionar perfis com tamanho e quantidade.
- **Calcular**: O algoritmo calcula a melhor combinação de perfis para minimizar o desperdício de material.
- **Exportar Resultado**: O usuário pode exportar o resultado da otimização em formato CSV.
- **Remover Perfis**: Permite a remoção de perfis previamente adicionados.

## Como Usar

1. **Acesse a página do projeto**:
   [Acesse a página de otimização aqui](https://brianbebop.github.io/aqui/).

2. **Insira o Nome do Projeto**:
   - No campo "Nome do Projeto", insira o nome desejado para o projeto de otimização.

3. **Adicionar Perfis**:
   - Clique no botão "Adicionar Perfil" para adicionar um novo perfil.
   - Para cada perfil, insira o tamanho (em milímetros) e a quantidade de unidades desejadas.
   - O sistema criará um identificador único para cada perfil (A, B, C, etc.).

4. **Calcular a Otimização**:
   - Após adicionar os perfis, clique no botão "Calcular".
   - O sistema calculará a otimização e exibirá os resultados, mostrando as barras e o desperdício de material.

5. **Exportar para CSV**:
   - Se desejar, você pode exportar os resultados da otimização em formato CSV clicando no botão "Exportar CSV".

## Como Funciona o Algoritmo

O algoritmo de otimização segue os seguintes passos:

1. **Entrada**: O usuário insere os perfis com tamanho e quantidade de unidades.
2. **Processamento**:
   - O sistema divide os perfis maiores que 6000 mm em várias barras.
   - Os perfis são agrupados em barras para maximizar o uso do material disponível.
   - O algoritmo tenta combinar os perfis de maneira que ocupe o máximo possível de espaço.
3. **Saída**:
   - O sistema gera uma tabela com o número de barras necessárias e o espaço restante em cada uma.

### Fluxo do Algoritmo:
- O sistema aloca os perfis em barras de 6000 mm.
- Se um perfil não cabe na barra, ele é dividido em partes menores.
- O algoritmo tenta encontrar a melhor combinação de perfis em cada barra até que todos os perfis sejam alocados ou o espaço disponível seja totalmente usado.

## Instalação

Caso queira rodar o projeto localmente, siga os passos abaixo:

1. Clone o repositório:
   ```bash
   git clone https://github.com/SeuUsuario/Otimizacao-Corte-Perfis.git


---

💡 *Sinta-se à vontade para sugerir melhorias e reportar problemas!* 🚀

