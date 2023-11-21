var sectionResultados = document.querySelector(".resultados-oleo");
var sectionResultadosLampada = document.querySelector(".resultados-lampada");

async function consultaPontoColeta(){
    try {
        await this.consultaColetaOleo();
        await this.consultaColetaLampada();
        document.querySelector('.section-resultados').scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        mudaVisibilidadeLoading();
        document.querySelector('#texto-erro').innerHTML = error.message;
        exibeModal("modal-erro", 5000);
    }
}

async function consultaColetaLampada(){
    try {
        var resultadoHTMLLampada = '';
        mudaVisibilidadeLoading();


        let lampada = await consultaLugares("Coleta de lampada");
        lampada = ordenaLista(lampada);


        // Iterar sobre a lista de objetos
        for (var i = 0; i < lampada.length; i++) {
            var item = lampada[i];
            let destino = item.endereco.replaceAll(" ", "+");
            const urlGoogleMaps = `https://www.google.com/maps?q=${destino}`;

            // Construir o componente HTML com base nos dados do objeto
            let componente = `
            <div class="resultados">
                <div class="info-resultados">
                    <divc class="nome-da-coleta">
                        <h4>${item.nomeEstabelecimento}</h4>
                    </divc>
                </div>
                <div class="info-endereco">
                    <div>
                        <p>${item.endereco}</p>
                        <p>Há ${item.distancia}</p>
                    </div>
                </div>
                <div class="info-maps">
                    <p><a href="${urlGoogleMaps}" class="info-maps-link" target="blank">Ver no mapa</a></p>
                    <p class="btn-compartilhar" data-value="${item.endereco}">Copiar endereço</p>
                </div>
            </div>
        `;

            // Adicionar o componente à variável resultadoHTML
            resultadoHTMLLampada += componente;
''
        }
        sectionResultadosLampada.style = "display: flex";
        sectionResultadosLampada.innerHTML = resultadoHTMLLampada;

        mudaVisibilidadeLoading();
        eventoCompartilhar();
    } catch (error) {
        mudaVisibilidadeLoading();
        document.querySelector('#texto-erro').innerHTML = error.message;
        exibeModal("modal-erro", 5000);
    }
    
    
}


async function consultaColetaOleo(){
    try {
        mudaVisibilidadeLoading();
        var resultadoHTMLOleo = '';
        let oleo = await consultaLugares("Coleta de oleo");
        oleo = ordenaLista(oleo);
        // Iterar sobre a lista de objetos
        for (var i = 0; i < oleo.length; i++) {
            var item = oleo[i];
            let destino = item.endereco.replaceAll(" ", "+");
            const urlGoogleMaps = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destino)}`;

            // Construir o componente HTML com base nos dados do objeto
            let componente = `
            <div class="resultados">
                <div class="info-resultados">
                    <divc class="nome-da-coleta">
                        <h4>${item.nomeEstabelecimento}</h4>
                    </divc>
                </div>
                <div class="info-endereco">
                    <div>
                        <p>${item.endereco}</p>
                        <p>Há ${item.distancia}</p>
                    </div>
                </div>
                <div class="info-maps">
                    <p><a href="${urlGoogleMaps}" class="info-maps-link" target="blank">Ver no mapa</a></p>
                    <p class="btn-compartilhar" data-value="${item.endereco}">Copiar endereço</p>
                </div>
            </div>
        `;

            // Adicionar o componente à variável resultadoHTML
            resultadoHTMLOleo += componente;

        }
        sectionResultados.style = "display: flex";
        sectionResultados.innerHTML = resultadoHTMLOleo;
        mudaVisibilidadeLoading();
        eventoCompartilhar();
    } catch (error) {
        mudaVisibilidadeLoading();
        document.querySelector('#texto-erro').innerHTML = error.message;
        exibeModal("modal-erro", 5000);
    }
    
}

function ordenaLista(array){
    array = array.sort((a, b) => {
        return Number.parseFloat(a.distancia) - Number.parseFloat(b.distancia);
    })
    let novoArray = array.slice(0, 6);
    return novoArray;
}

function eventoCompartilhar(){
    let botoesCompartilhar = document.querySelectorAll(".btn-compartilhar");

    botoesCompartilhar.forEach((botao) => {
        
        botao.addEventListener("click", () => {
            
            const valor = botao.getAttribute('data-value');
            const el = document.createElement('textarea');
            el.value = valor;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            exibeModal("modal", 2000);

    
        })
    })

}

function exibeModal(campoId, tempoExibição){
    document.querySelector("#"+ campoId).style = "display: flex;";
    setTimeout(() => {
        document.querySelector("#"+ campoId).style = "display: none;";
    }, tempoExibição);
}


function mudaVisibilidadeLoading(){
    var element = document.getElementById("loading");

    if (element) {
        if (element.style.display === 'none' || element.style.display === '') {
            element.style.display = 'block'; // Ou outro valor, como 'inline', 'inline-block', etc.
        } else {
            element.style.display = 'none';
        }
    } else {
        console.error('Elemento não encontrado com o ID: ' + elementId);
    }
}

// Adicione um ouvinte de evento para o clique no elemento com a classe "meu-elemento"
document.querySelector('#home').addEventListener('click', function() {
    // Use a função scrollIntoView() para rolar para o elemento de destino
    document.querySelector('.main-text').scrollIntoView({ behavior: 'smooth' });
});

// Adicione um ouvinte de evento para o clique no elemento com a classe "meu-elemento"
document.querySelector('#sobre').addEventListener('click', function() {
    // Use a função scrollIntoView() para rolar para o elemento de destino
    document.querySelector('.section-sobre').scrollIntoView({ behavior: 'smooth' });
});

// Adicione um ouvinte de evento para o clique no elemento com a classe "meu-elemento"
document.querySelector('#coleta').addEventListener('click', function() {
    // Use a função scrollIntoView() para rolar para o elemento de destino
    document.querySelector('.section-resultados').scrollIntoView({ behavior: 'smooth' });
});

