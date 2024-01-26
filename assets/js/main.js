const pokemonList    = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const backButton     = document.getElementById('btnBack')
const toUp           = document.getElementById('btnUp')
const background     = document.getElementById('background')
const pokemonDetail  = document.getElementById('pokemonDetail')
const about          = document.getElementById('about')
const baseStats      = document.getElementById('baseStats')
const evolution      = document.getElementById('evolution')
const moves          = document.getElementById('moves')

window.addEventListener('scroll', () => {
    if(window.scrollY > 100) {
        toUp.style.display = 'block'
    } else {
        toUp.style.display = 'none'
    }
})

toUp.addEventListener('click', () => {
    window.scrollTo({top:0})
})


const maxRecords = 151
const limit = 10
let offset = 0;


function showInfoDetail(e) {
    
    hideInfoDetail();

    if(e=='about') {
        document.getElementById('about').style.display = 'block'
        document.getElementById('spnAbout').style.borderBottom = '3px solid blue'
        document.getElementById('spnAbout').style.color = '#000'
    } else if(e=='baseStats') {
        document.getElementById('baseStats').style.display = 'block'
        document.getElementById('spnBaseStats').style.borderBottom = '3px solid blue'
        document.getElementById('spnBaseStats').style.color = '#000'
    } else if(e=='evolution') {
        document.getElementById('evolution').style.display = 'block'
        document.getElementById('spnEvolution').style.borderBottom = '3px solid blue'
        document.getElementById('spnEvolution').style.color = '#000'
    } else {
        document.getElementById('moves').style.display = 'block'
        document.getElementById('spnMoves').style.borderBottom = '3px solid blue'
        document.getElementById('spnMoves').style.color = '#000'
    }
}

function hideInfoDetail() {
    document.getElementById('about').style.display = 'none'
    document.getElementById('baseStats').style.display = 'none'
    document.getElementById('evolution').style.display = 'none'
    document.getElementById('moves').style.display = 'none'
    document.getElementById('spnAbout').style.borderBottom = 'none'
    document.getElementById('spnBaseStats').style.borderBottom = 'none'
    document.getElementById('spnEvolution').style.borderBottom = 'none'
    document.getElementById('spnMoves').style.borderBottom = 'none'
    document.getElementById('spnAbout').style.color = '#bcbdbf'
    document.getElementById('spnBaseStats').style.color = '#bcbdbf'
    document.getElementById('spnEvolution').style.color = '#bcbdbf'
    document.getElementById('spnMoves').style.color = '#bcbdbf'
}

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" onclick="selectPokemon(${pokemon.number})">
            <span class="number">#${pokemon.number.toString().padStart(3,"0")}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

const selectPokemon = async (number) =>{
    const url = `https://pokeapi.co/api/v2/pokemon/${number}`
    const res = await fetch(url)
    const pokemon = await res.json()
    openPokemon(pokemon)
}


function openPokemon(pokemon) {


    const types   = pokemon.types.map((typeSlot) => typeSlot.type.name)
    const [type]  = types
    pokemon.types = types
    pokemon.type  = type

    const abilities   = pokemon.abilities.map((abilitySlot) => abilitySlot.ability.name).join(', ')
    const [ability]   = abilities
    pokemon.abilities = abilities
    pokemon.ability   = ability

    const moves   = pokemon.moves.map((moveSlot) => '<li>'+ moveSlot.move.name + '</li>').join('')
    const[move]   = moves
    pokemon.moves = moves
    pokemon.move  = move

    pokemon.hp      = pokemon.stats[0].base_stat
    pokemon.atk     = pokemon.stats[1].base_stat
    pokemon.def     = pokemon.stats[2].base_stat
    pokemon.spcatk  = pokemon.stats[3].base_stat
    pokemon.spcdef  = pokemon.stats[4].base_stat
    pokemon.speed   = pokemon.stats[5].base_stat

    pokemon.hp = pokemon.stats[0].base_stat

 
    const photo = pokemon.sprites.other.dream_world.front_default

    const pokemonCard = 
     `
        <div class="card-pokemon ${pokemon.type}">
                <div class="card-header">
                    <header>
                        <ion-icon name="arrow-back-outline" onclick="hidePokemon()"></ion-icon>
                        <ion-icon name="heart-outline"></ion-icon>
                    </header>
                    <div class="pokemon-name">
                        <h1 class="name capitalize">
                            ${pokemon.name}
                        </h1>
                        <p>#${pokemon.id.toString().padStart(3,"0")}</p>
                    </div>

                    <div class="pokemon-type">
                        <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                        </ol>

                        <div class="poke-images">

                            <div>
                                <img src="assets/images/points.png" alt="">
                            </div>

                            <div>
                                <img src="assets/images/pokeball.png" alt="">
                            </div>

                        </div>      
                    </div>

                </div>
                <div class="card-details">
                    <header>
                        <img class="poke-image" src="${photo}">
                        <nav class="navbar">
                            <ul>
                                <li><span id="spnAbout" onclick="showInfoDetail('about')">About</span></li>
                                <li><span  id="spnBaseStats" onclick="showInfoDetail('baseStats')">Base Stats</span></li>
                                <li hidden><span id="spnEvolution" onclick="showInfoDetail('evolution')">Evolution</span></li>
                                <li><span id="spnMoves" onclick="showInfoDetail('moves')">Moves</span></li>
                            </ul>
                        </nav>
                    </header>
                    <section class="poke-info">
                        <div class="poke-info-details" id="about">
                            <table>
                                <tr>
                                    <td class="col1">Hight</td>
                                    <td class="col2">${(pokemon.height/10).toFixed(2)} m</td>
                                </tr>
                                <tr>
                                    <td class="col1">Weight</td>
                                    <td class="col2">${pokemon.weight/10} kg</td>
                                </tr>
                                <tr>
                                    <td class="col1">Base Exp.</td>
                                    <td class="col2">${pokemon.base_experience}</td>
                                <tr>
                                    <td class="col1">Abilities</td>
                                    <td class="col2 capitalize">${pokemon.abilities}</td>    
                                </tr>
                            </table>
                        </div>

                        <div class="poke-info-details" id="baseStats">
                            <table>
                                <tr>
                                    <td class="col1">HP</td>
                                    <td class="col2">
                                        <div class="stats-bar">                                     
                                            <div  style="width: ${pokemon.hp}%"></div>                                        
                                        </div>                          
                                    </td>
                                </tr>
                                <tr>
                                    <td class="col1">Attack</td>
                                    <td class="col2">
                                        <div class="stats-bar">    
                                            <div style="width: ${pokemon.atk}%"></div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="col1">Defense</td>
                                    <td class="col2">
                                        <div class="stats-bar">    
                                            <div  style="width: ${pokemon.def}%"></div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="col1">Sp. Atk</td>
                                    <td class="col2">
                                        <div class="stats-bar">    
                                            <div  style="width: ${pokemon.spcatk}%"></div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="col1">Sp. Def</td>
                                    <td class="col2">
                                        <div class="stats-bar">    
                                            <div  style="width: ${pokemon.spcdef}%"></div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="col1">Spped</td>
                                    <td class="col2">
                                        <div class="stats-bar">    
                                            <div  style="width: ${pokemon.speed}%"></div>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div class="poke-info-details" id="evolution">
                        evolution
                        </div>
                        <div class="poke-info-details" id="moves">  
                            <ul>                     
                                ${pokemon.moves}
                            </ul>
                        </div>
                    </section>
                </div>
            </div>
     `    

     pokemonDetail.innerHTML = pokemonCard

    background.style.display = 'block';
    pokemonDetail.style.top = '-10%';
}

function hidePokemon() {
    background.style.display = 'none';
    pokemonDetail.style.top = '-120%';
}

