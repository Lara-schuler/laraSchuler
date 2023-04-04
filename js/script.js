
let inputBuscarFilme = document.querySelector('#input-buscar-filme');
let btnBuscarFilme = document.querySelector('#btn-buscar-filme');


btnBuscarFilme.onclick = async () => {
    console.log("0");
    if (inputBuscarFilme.value.length == '') {
        alert('Preencha o campo!');
        return;
    }
    else if (inputBuscarFilme.value.length > 0) {
        let filmes = new Array();
        fetch('https://www.omdbapi.com/?apikey=8c76fa7d&s=' + inputBuscarFilme.value, { mode: "cors" })
            .then((resp) => resp.json())
            .then((resp) => {
                if (resp.Response == 'False') {
                    alert("Nenhum filme encontrado");
                    return;
                }
                resp.Search.forEach((item) => {
                    console.log(item);
                    let filme = new Filme(
                        item.imdbID,
                        item.Title,
                        item.Year,
                        null,
                        null,
                        null,
                        item.Poster,
                        null,
                        null,
                        null,
                        null
                    );
                    filmes.push(filme);
                });
                listarFilmes(filmes);
            });
    }

    return false;

}

let listarFilmes = async (filmes) => {
    let listaFilmes = await document.querySelector('#lista-filmes');
    listaFilmes.style.display = "flex";
    listaFilmes.innerHTML = "";
    document.querySelector("#mostrar-filme").innerHTML = "";
    document.querySelector("#mostrar-filme").style.display = "none";
    console.log(listaFilmes);
    if (filmes.length > 0) {
        filmes.forEach(async (filme) => {
            listaFilmes.appendChild(await filme.getCard());
            filme.getBtnDetalhes().onclick = () => {
                detalhesFilme(filme.id);
            }
        });
    }
}

let detalhesFilme = async (id) => {
    fetch('https://www.omdbapi.com/?apikey=8c76fa7d&i=' + id)
        .then((resp) => resp.json())
        .then((resp) => {
            console.log(resp)
            let filme = new Filme(
                resp.imdbID,
                resp.Title,
                resp.Year,
                resp.Genre.split(","),
                resp.Runtime,
                resp.Plot,
                resp.Poster,
                resp.Director,
                resp.Actors.split(","),
                resp.Rated,
                resp.imdbRating,
                //resp.btnDetalhes
            );
            console.log(filme);
            document.querySelector("#mostrar-filme").appendChild(filme.getDetalhesFilme());

            document.querySelector("#btnFechar").onclick = () => {
                document.querySelector('#lista-filmes').style.display = "flex";
                document.querySelector("#mostrar-filme").innerHTML = "";
                document.querySelector("#mostrar-filme").style.display = "none";
            }

            document.querySelector("#btnSalvar").onclick = () => {
                salvarFilme(filme)
            }
            document.querySelector("#btnRemover").onclick = () => {
                removerLocalStorage(filme);
            }

            document.querySelector("#lista-filmes").style.display = "none";
            document.querySelector("#mostrar-filme").style.display = "flex";

        });



}

let inicio = document.querySelector('#inicio');
inicio.onclick = () => {
    document.querySelector("#lista-filmes").style.display = "none";
    document.querySelector("#mostrar-filme").style.display = "none";
}

let navFavoritos = document.querySelector('#nav-favoritos');
navFavoritos.onclick = () => {
    listarFavoritos();
}
/*let editar = document.querySelector("#nav-editar");
editar.onclick = () => {
                document.querySelector('#lista-filmes').style.display = "none";
                document.querySelector("#mostrar-filme").innerHTML = "";
                document.querySelector("#mostrar-filme").style.display = "none";
                document.querySelector("#form-filme").style.display = "flex";
            }*/

let listarFavoritos = () => {
    //ler local storage
    let filmesFavoritos = localStorage.getItem('filmesFavoritos');
    filmesFavoritos = JSON.parse(filmesFavoritos);
    let filmes = new Array();
    filmesFavoritos.forEach((item) => {
        let filme = new Filme(
            item.id,
            item.titulo,
            item.ano,
            item.genero,
            item.duracao,
            item.sinopse,
            item.cartaz,
            item.direcao,
            item.elenco,
            item.classificacao,
            item.avaliacao
        );
        filmes.push(filme);
    });

    listarFilmes(filmes);


}

let salvarFilme = (filme) => {
    //localStorage.setItem("filme","La hora fría")
    let filmesString = localStorage.getItem('filmesFavoritos');
    console.log()
    let filmes = null;
    if (filmesString && filmesString != 'null') {
        filmes = JSON.parse(filmesString);
        console.log(filmes)
        filmes.push(filme)
    } else {
        filmes = [filme];
    }

    localStorage.setItem('filmesFavoritos', JSON.stringify(filmes));
}

let removerLocalStorage = (filme) => {
    localStorage.removeItem("filmesFavoritos");
}
