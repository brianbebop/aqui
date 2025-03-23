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
        .filter(perfil => perfil.input.value !== '' && perfil.quantidade.value !== '')
        .flatMap(perfil => 
            Array.from({ length: parseInt(perfil.quantidade.value) }, () => ({
                id: perfil.id,
                tamanho: parseInt(perfil.input.value)
            }))
        );

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

        combinar([], espacoLivre, 0);
        return melhorCombinacao;
    }

    const barras = [];
    let perfisRestantes = [...perfisComTamanho];

    while (perfisRestantes.length > 0) {
        let perfilAtual = perfisRestantes.shift();

        if (perfilAtual.tamanho > tamanhoBarra) {
            let tamanhoRestante = perfilAtual.tamanho;
            while (tamanhoRestante > 0) {
                const tamanhoBarraAtual = Math.min(tamanhoBarra, tamanhoRestante);
                barras.push({ perfis: [{ ...perfilAtual, tamanho: tamanhoBarraAtual }], espacoLivre: tamanhoBarra - tamanhoBarraAtual });
                tamanhoRestante -= tamanhoBarraAtual;
            }
        } else {
            let barraEncontrada = false;
            for (let i = 0; i < barras.length; i++) {
                if (barras[i].espacoLivre >= perfilAtual.tamanho) {
                    barras[i].perfis.push(perfilAtual);
                    barras[i].espacoLivre -= perfilAtual.tamanho;
                    barraEncontrada = true;
                    break;
                }
            }
            if (!barraEncontrada) {
                barras.push({ perfis: [perfilAtual], espacoLivre: tamanhoBarra - perfilAtual.tamanho });
            }
        }
    }

    let otimizacaoContinua = true;
    while (otimizacaoContinua) {
        otimizacaoContinua = false;
        for (let i = 0; i < barras.length; i++) {
            if (barras[i].espacoLivre > 0) {
                const perfisCabiveis = perfisRestantes.filter(perfil => perfil.tamanho <= barras[i].espacoLivre);
                if (perfisCabiveis.length > 0) {
                    const melhorCombinacao = encontrarMelhorCombinacao(perfisCabiveis, barras[i].espacoLivre);
                    if (melhorCombinacao.perfis.length > 0) {
                        barras[i].perfis = [...barras[i].perfis, ...melhorCombinacao.perfis];
                        barras[i].espacoLivre = melhorCombinacao.sobra;
                        perfisRestantes = perfisRestantes.filter(perfil => !melhorCombinacao.perfis.includes(perfil));
                        otimizacaoContinua = true;
                    }
                }
            }
        }
    }

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
        <input type="number" id="quantidade-${perfilId}" placeholder="Quantidade" min="1" value="1">
        <button class="remover-perfil">Remover</button>
    `;
    perfisDiv.appendChild(perfilDiv);
    perfis.push({ id: perfilId, input: perfilDiv.querySelector('input[type=number]'), quantidade: perfilDiv.querySelector('input[id^=quantidade]') });
    contadorPerfil++;

    const removerButton = perfilDiv.querySelector('.remover-perfil');
    removerButton.addEventListener('click', () => {
        perfis = perfis.filter(perfil => perfil.id !== perfilId);
        perfilDiv.remove();
        calcularOtimizacao();
    });
});

calcularButton.addEventListener('click', () => {
    calcularOtimizacao();
});
