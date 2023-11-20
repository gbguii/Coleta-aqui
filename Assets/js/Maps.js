var userLocation;
let map;


async function initMap(){

    const { Map } = await google.maps.importLibrary("maps");

    map = new Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
    });
    
    // Pegar a localização
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            pegaInfoLocalizacao, erroRecuperarLocalizacao
            
        );
    }
      
}

function erroRecuperarLocalizacao(error) {
    // Tratamento de erros
    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.error("Permissão para geolocalização negada pelo usuário.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.error("Informações de geolocalização não disponíveis.");
            break;
        case error.TIMEOUT:
            console.error("Tempo limite da solicitação de geolocalização expirou.");
            break;
        default:
            console.error("Erro desconhecido na geolocalização.");
    }
}

function pegaInfoLocalizacao(position){
    userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };
}


async function consultaLugares(localBusca) {
    // Realizar a consulta de estabelecimentos
    if(userLocation == null || userLocation == undefined || userLocation == ""){
        throw new Error("É necessário permitir acesso a sua localização.");
    }
    var request = {
        location: userLocation,
        radius: 50000, // Raio de busca em metros
        keyword: localBusca, // Tipo de lugar que você deseja procurar
    };

    var service = new google.maps.places.PlacesService(map); // 'map' é seu objeto de mapa

    // Função que retorna uma Promessa para a solicitação nearbySearch
    function buscaEstabelecimentos() {
        return new Promise((resolve, reject) => {
            service.nearbySearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    resolve(results);
                } else {
                    reject(new Error("Erro na solicitação nearbySearch"));
                }
            });
        });
    }

    try {
        // Aguarde a conclusão da buscaEstabelecimentos
        const resultados = await buscaEstabelecimentos();
        let listaRotas = [];
        for(let i in resultados){
            let request = criaObjetoRequestParaRotas(resultados[i]);
            let route = await getRotaAsync(request);
            const origemLatitude = route.legs[0].start_location.lat();
            const origemLongitude = route.legs[0].start_location.lng();
            const origem = origemLatitude + "," + origemLongitude;
            // Coordenadas do destino (latitude e longitude)
            const destinoLatitude = route.legs[0].end_location.lat();
            const destinoLongitude = route.legs[0].end_location.lng();
            const destino = destinoLatitude + "," + destinoLongitude;
            const objResultadoRotas = {
                rotas: route,
                distancia: route.legs[0].distance.text,
                duracao: route.legs[0].duration.text,
                nomeEstabelecimento: resultados[i].name,
                endereco: resultados[i].vicinity,
                origem: origem,
                destino: destino
            }
            listaRotas.push(objResultadoRotas);
        }
        return listaRotas;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Função assíncrona para obter uma rota
async function getRotaAsync(request) {
    const directionsService = new google.maps.DirectionsService();
    return new Promise((resolve, reject) => {
        directionsService.route(request, (response, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                const route = response.routes[0];
                resolve(route);
            } else {
                reject(new Error('Erro na solicitação de rota.'));
            }
        });
    });
}

function criaObjetoRequestParaRotas(estabelecimento){
    const userLatLng = new google.maps.LatLng(userLocation.lat, userLocation.lng);

    // Exemplo de cálculo de rota para um local específico (primeiro resultado da pesquisa):
    const destination = new google.maps.LatLng(estabelecimento.geometry.location.lat(), estabelecimento.geometry.location.lng());

    const request = {
        origin: userLatLng,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
    };

    return request;
}

  