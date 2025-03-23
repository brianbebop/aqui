const perfisDiv = document.getElementById('perfis');
const adicionarPerfilButton = document.getElementById('adicionarPerfil');
const calcularButton = document.getElementById('calcular');
const resultadoDiv = document.getElementById('resultado');
const resumoBarrasTabela = document.getElementById('resumoBarras').getElementsByTagName('tbody')[0];
const nomeProjetoInput = document.getElementById('nomeProjeto');
const exportarCSVButton = document.getElementById('exportarCSV');

let perfis = [];
let contadorPerfil = 0;

function calcularOtimizacao() {
    const tamanhoBarra = 6000;
    const perfisComTamanho = perfis
        .filter(perfil => perfil.input.value !== '') // Ignora perfis com valor vazio
        .map(perfil => ({
            id: perfil.id,
            tamanho: parseInt(perfil.input.value)
        }));

    // Função para encontrar a melhor combinação de perfis para uma barra
    function encontrarMelhorCombinacao(perfisRestantes, espacoLivre) {
    const n = perfisRestantes.length;
    const dp = Array(n + 1).fill(null).map(() => Array(espacoLivre + 1).fill(0));
    const selecao = Array(n + 1).fill(null).map(() => Array(espacoLivre + 1).fill(false));

    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= espacoLivre; j++) {
            if (perfisRestantes[i - 1].tamanho <= j) {
                if (perfisRestantes[i - 1].tamanho + dp[i - 1][j - perfisRestantes[i - 1].tamanho] > dp[i - 1][j]) {
                    dp[i][j] = perfisRestantes[i - 1].tamanho + dp[i - 1][j - perfisRestantes[i - 1].tamanho];
                    selecao[i][j] = true;
                } else {
                    dp[i][j] = dp[i - 1][j];
                }
            } else {
                dp[i][j] = dp[i - 1][j];
            }
        }
    }

    const melhorCombinacao = { perfis: [], sobra: espacoLivre - dp[n][espacoLivre] };
    let i = n, j = espacoLivre;
    while (i > 0 && j > 0) {
        if (selecao[i][j]) {
            melhorCombinacao.perfis.unshift(perfisRestantes[i - 1]);
            j -= perfisRestantes[i - 1].tamanho;
        }
        i--;
    }
    return melhorCombinacao;
}
    // Algoritmo de otimização
    
    const barras = [];
    let perfisRestantes = [...perfisComTamanho];
    while (perfisRestantes.length > 0) {
        const perfilAtual = perfisRestantes[0];
        if (perfilAtual.tamanho > tamanhoBarra) {
            // Divide o perfil em múltiplas barras
            const quantidadeBarras = Math.ceil(perfilAtual.tamanho / tamanhoBarra);
            for (let i = 0; i < quantidadeBarras; i++) {
                const tamanhoBarraAtual = Math.min(tamanhoBarra, perfilAtual.tamanho - i * tamanhoBarra);
                const barraAtual = { perfis: [{ ...perfilAtual, tamanho: tamanhoBarraAtual }], espacoLivre: tamanhoBarra - tamanhoBarraAtual };
                barras.push(barraAtual);

                // Tenta otimizar o espaço restante na barra atual
                if (barraAtual.espacoLivre > 0) {
                    const melhorCombinacao = encontrarMelhorCombinacao(perfisRestantes.filter(p => p !== perfilAtual), barraAtual.espacoLivre);
                    if (melhorCombinacao.perfis.length > 0) {
                        barraAtual.perfis = [...barraAtual.perfis, ...melhorCombinacao.perfis];
                        barraAtual.espacoLivre = melhorCombinacao.sobra;

                        // Remove os perfis utilizados da lista perfisRestantes
                        melhorCombinacao.perfis.forEach(perfilUsado => {
                            perfisRestantes = perfisRestantes.filter(perfil => perfil.id !== perfilUsado.id);
                        });
                    }
                }
            }
            perfisRestantes.shift(); // Remove o perfil dividido
        } else {
            // Encontra a melhor combinação para a barra
            const melhorCombinacao = encontrarMelhorCombinacao(perfisRestantes, tamanhoBarra);
            barras.push({ perfis: melhorCombinacao.perfis, espacoLivre: melhorCombinacao.sobra });
            perfisRestantes = perfisRestantes.filter(
                perfil => !melhorCombinacao.perfis.includes(perfil)
            );
        }
    }

    // Exibe o resultado na tabela
    resumoBarrasTabela.innerHTML = ''; // Limpa a tabela
    barras.forEach((barra, index) => {
        const novaLinha = resumoBarrasTabela.insertRow();
        const colunaBarra = novaLinha.insertCell(0);
        const colunaPerfis = novaLinha.insertCell(1);
        const colunaSobra = novaLinha.insertCell(2);

        colunaBarra.textContent = `Barra ${index + 1}`;
        colunaPerfis.textContent = barra.perfis.map(perfil => `${perfil.id} (${perfil.tamanho}mm)`).join(', ');
        colunaSobra.textContent = `${barra.espacoLivre} mm`;
    });

    // Exibe o nome do projeto
    const nomeProjeto = nomeProjetoInput.value;
    if (nomeProjeto) {
        document.querySelector('h1').textContent = `Otimização de Corte de Perfis (mm) - ${nomeProjeto}`;
    } else {
        document.querySelector('h1').textContent = `Otimização de Corte de Perfis (mm)`;
    }
}

adicionarPerfilButton.addEventListener('click', () => {
    const perfilId = String.fromCharCode(65 + contadorPerfil);
    const perfilDiv = document.createElement('div');
    perfilDiv.classList.add('perfil');
    perfilDiv.innerHTML = `
        <label for="perfil-${perfilId}">Perfil ${perfilId} (mm):</label>
        <input type="number" id="perfil-${perfilId}" placeholder="Tamanho (mm)">
        <button class="remover-perfil">Remover</button>
    `;
    perfisDiv.appendChild(perfilDiv);
    perfis.push({ id: perfilId, input: perfilDiv.querySelector('input') });
    contadorPerfil++;

    // Adiciona o evento de clique para o botão "Remover"
    const removerButton = perfilDiv.querySelector('.remover-perfil');
    removerButton.addEventListener('click', () => {
        perfis = perfis.filter(perfil => perfil.id !== perfilId);
        perfilDiv.remove();
        calcularOtimizacao(); // Recalcula automaticamente após remover o perfil
    });
});

calcularButton.addEventListener('click', () => {
    calcularOtimizacao();
});



exportarCSVButton.addEventListener('click', () => {
    const nomeProjeto = nomeProjetoInput.value || 'Otimizacao_Corte_Perfis';
    const nomeArquivo = `${nomeProjeto}.csv`;

    let csvContent = 'Barra,Perfis,Sobra (mm)\r\n'; // Cabeçalho CSV
    const linhasTabela = resumoBarrasTabela.rows;
    for (let i = 0; i < linhasTabela.length; i++) {
        const linha = linhasTabela[i];
        const colunas = linha.cells;
        const linhaCSV = `${colunas[0].textContent},"${colunas[1].textContent}",${colunas[2].textContent}\r\n`;
        csvContent += linhaCSV;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, nomeArquivo);
    } else {
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', nomeArquivo);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});
