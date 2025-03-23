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
        .filter(perfil => perfil.input.value !== '')
        .map(perfil => ({
            id: perfil.id,
            tamanho: parseInt(perfil.input.value)
        }));

    function encontrarMelhorCombinacao(perfisRestantes, espacoLivre) {
        function encontrarMelhorCombinacao(perfisRestantes, espacoLivre) {
            let melhorCombinacao = { perfis: [], sobra: espacoLivre };
    
            function combinar(combinacaoAtual, sobraAtual, indiceAtual) {
                if (sobraAtual < melhorCombinacao.sobra) {
                    melhorCombinacao = { perfis: combinacaoAtual, sobra: sobraAtual };
                }
    
                if (indiceAtual < perfisRestantes.length) {
                    const perfilAtual = perfisRestantes[indiceAtual];
                    if (sobraAtual >= perfilAtual.tamanho) {
                        combinar(
                            [...combinacaoAtual, perfilAtual],
                            sobraAtual - perfilAtual.tamanho,
                            indiceAtual + 1
                        );
                    }
                    combinar(combinacaoAtual, sobraAtual, indiceAtual + 1);
                }
            }
    }

    const barras = [];
    let perfisRestantes = [...perfisComTamanho];

    // Encontra o perfil maior
    let perfilMaior = perfisRestantes.reduce((maior, perfil) => {
        return perfil.tamanho > maior.tamanho ? perfil : maior;
    }, perfisRestantes[0]);

    // Processa o perfil maior primeiro
    if (perfilMaior.tamanho > tamanhoBarra) {
        const quantidadeBarras = Math.ceil(perfilMaior.tamanho / tamanhoBarra);
        let tamanhoRestante = perfilMaior.tamanho;
        for (let i = 0; i < quantidadeBarras; i++) {
            const tamanhoBarraAtual = Math.min(tamanhoBarra, tamanhoRestante);
            barras.push({ perfis: [{ ...perfilMaior, tamanho: tamanhoBarraAtual }], espacoLivre: tamanhoBarra - tamanhoBarraAtual });
            tamanhoRestante -= tamanhoBarraAtual;
        }
    } else {
        barras.push({ perfis: [perfilMaior], espacoLivre: tamanhoBarra - perfilMaior.tamanho });
    }

    // Remove o perfil maior da lista de perfis restantes
    perfisRestantes = perfisRestantes.filter(perfil => perfil.id !== perfilMaior.id);

    // Otimiza as sobras
    barras.forEach(barra => {
        if (barra.espacoLivre > 0) {
            const perfisCabiveis = perfisRestantes.filter(perfil => perfil.tamanho <= barra.espacoLivre);
            if (perfisCabiveis.length > 0) {
                // Seleciona o perfil que gera o menor desperdício
                const perfilMelhorEncaixe = perfisCabiveis.reduce((melhor, perfil) => {
                    return barra.espacoLivre - perfil.tamanho < barra.espacoLivre - melhor.tamanho ? perfil : melhor;
                }, perfisCabiveis[0]);

                barra.perfis.push(perfilMelhorEncaixe);
                barra.espacoLivre -= perfilMelhorEncaixe.tamanho;
                perfisRestantes = perfisRestantes.filter(perfil => perfil.id !== perfilMelhorEncaixe.id);
            }
        }
    });

    // Adiciona os perfis restantes a novas barras
    perfisRestantes.forEach(perfil => {
        barras.push({ perfis: [perfil], espacoLivre: tamanhoBarra - perfil.tamanho });
    });

    // Exibe o resultado na tabela
    resumoBarrasTabela.innerHTML = '';
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
