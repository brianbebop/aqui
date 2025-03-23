const perfisDiv = document.getElementById('perfis');
const adicionarPerfilButton = document.getElementById('adicionarPerfil');
const calcularButton = document.getElementById('calcular');
const resultadoDiv = document.getElementById('resultado');
const resumoBarrasTabela = document.getElementById('resumoBarras').getElementsByTagName('tbody')[0];
const nomeProjetoInput = document.getElementById('nomeProjeto');
const exportarCSVButton = document.getElementById('exportarCSV');

let perfis = [];
let contadorPerfil = 0;

const tamanhoBarra = 6000;

function calcularOtimizacao() {
    const perfisComTamanho = perfis
        .filter(perfil => perfil.input.value !== '')
        .map(perfil => ({
            id: perfil.id,
            tamanho: parseInt(perfil.input.value)
        }));

    // Separar perfis menores e maiores que 6000mm
    let perfisGrandes = perfisComTamanho.filter(p => p.tamanho > tamanhoBarra);
    let perfisPequenos = perfisComTamanho.filter(p => p.tamanho <= tamanhoBarra);

    let barras = [];

    // Primeiro, processar perfis grandes (acima de 6000mm)
    for (let perfil of perfisGrandes) {
        let tamanhoRestante = perfil.tamanho;
        while (tamanhoRestante > 0) {
            const tamanhoBarraAtual = Math.min(tamanhoBarra, tamanhoRestante);
            barras.push({ perfis: [{ ...perfil, tamanho: tamanhoBarraAtual }], espacoLivre: tamanhoBarra - tamanhoBarraAtual });
            tamanhoRestante -= tamanhoBarraAtual;
        }
    }

    // Ordenar perfis menores de forma decrescente para otimização (FFD)
    perfisPequenos.sort((a, b) => b.tamanho - a.tamanho);

    // Alocar perfis menores usando First Fit Decreasing (FFD)
    for (let perfil of perfisPequenos) {
        let colocado = false;

        for (let barra of barras) {
            if (barra.espacoLivre >= perfil.tamanho) {
                barra.perfis.push(perfil);
                barra.espacoLivre -= perfil.tamanho;
                colocado = true;
                break;
            }
        }

        // Se não couber em nenhuma barra existente, criar uma nova
        if (!colocado) {
            barras.push({ perfis: [perfil], espacoLivre: tamanhoBarra - perfil.tamanho });
        }
    }

    // Exibir o resultado na tabela
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
