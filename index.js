let bag = {
    restriction: 0,
    banachSpace: 0,
    items: [],
    sensitivityIndex: {
        costBulk: [],
        bulk:[]
    },
    incumbentes:[]
}

const iterations = [];
iterations[0] = [];
iterations[1] = [];
iterations[2] = [];
iterations[3] = [];

let neighbourPosition = 0;

const createBag = (min, max) => {
    bag.banachSpace = createBanachSpace(min, max);
};

const createItem = (maxCost, maxBulk, item) => {
    return {
            item,
            cost: Math.floor(Math.random() * (maxCost) + 1),
            bulk: Math.floor(Math.random() * (maxBulk) + 1)
        };
};

const createItems = (maxCost, maxBulk) => {
    for(let i = 0; i < bag.banachSpace; i += 1) {
        bag.items[i] = createItem(maxCost, maxBulk, i);
    }
};

const createBanachSpace = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};

const selectItem = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
};

const createCostBulkIndex = () => {
    for(let i = 0; i < bag.banachSpace; i += 1) {
        const item = bag.items[i];
        bag.sensitivityIndex.costBulk[i] = {
            item: i,
            value: (item.bulk === 0) ? 0 : item.cost/item.bulk
        };
    }
};

const createBulkIndex = (iteration) => {
    let costBulk = [...bag.sensitivityIndex.costBulk];
    costBulk.sort((it1, it2) => {
        if(it1.value < it2.value) {
            return 1;
        } else if(it1.value > it2.value) {
            return -1;
        } else {
            return 0;
        }
    });
    let candidates = [];
    for(let i = 0; i < Math.floor(bag.banachSpace * 0.2); i +=1) {
        candidates[i] = bag.items[costBulk[i].item];
    }
    candidates.sort((it1, it2) => {
        if(it1.bulk > it2.bulk) {
            return 1;
        } else if(it1.bulk < it2.bulk) {
            return -1;
        } else {
            return 0;
        }
    });
    let newEsquema = [];
    for(let i = 0; i < candidates.length / 2; i += 1) {
        newEsquema[i] = candidates[i];
    }
    iterations[iteration][0] = [];
    iterations[iteration][0].initialEsquema = formatEsquema(newEsquema);
    iterations[iteration][0].initialRestriction = calculateBulk(iterations[iteration][0].initialEsquema);
    iterations[iteration][0].objectiveFunction = calculateCostFromNeightbour(iterations[iteration][0].initialEsquema);
    iterations[iteration][0].costBulk = calculateCostBulkFromNeightbour(iterations[iteration][0].initialEsquema);
    //selectRandomCandidates(bulks, iteration);
};

const createCostIndex = (iteration) => {
    let costBulk = [...bag.sensitivityIndex.costBulk];
    costBulk.sort((it1, it2) => {
        if(it1.value < it2.value) {
            return 1;
        } else if(it1.value > it2.value) {
            return -1;
        } else {
            return 0;
        }
    });
    let candidates = [];
    for(let i = 0; i < Math.floor(bag.banachSpace * 0.2); i +=1) {
        candidates[i] = bag.items[costBulk[i].item];
    }
    
    candidates.sort((it1, it2) => {
        if(it1.cost < it2.cost) {
            return 1;
        } else if(it1.cost > it2.cost) {
            return -1;
        } else {
            return 0;
        }
    });
    let newEsquema = [];
    for(let i = 0; i < candidates.length / 2; i += 1) {
        newEsquema[i] = candidates[i];
    }
    iterations[iteration][0] = [];
    iterations[iteration][0].initialEsquema = formatEsquema(newEsquema);
    iterations[iteration][0].initialRestriction = calculateBulk(iterations[iteration][0].initialEsquema);
    iterations[iteration][0].objectiveFunction = calculateCostFromNeightbour(iterations[iteration][0].initialEsquema);
    iterations[iteration][0].costBulk = calculateCostBulkFromNeightbour(iterations[iteration][0].initialEsquema);
    //selectRandomCandidates(costs, iteration);
};

const createMaxCostIndex = (iteration) => {
    let costs = [...bag.items];
    costs.sort((it1, it2) => {
        if(it1.cost < it2.cost) {
            return 1;
        } else if(it1.cost > it2.cost) {
            return -1;
        } else {
            return 0;
        }
    });
    let candidates = [];
    for(let i = 0; i < Math.floor(bag.banachSpace * 0.2); i +=1) {
        candidates[i] = costs[i];
    }
    selectRandomCandidates(candidates, iteration);
};

const sensitivityIndex = () => {
    createCostBulkIndex();
};

const calculateRestriction = () => {
    let restriction = 0;
    bag.items.forEach(it => {
        restriction += it.bulk;
    });
    bag.restriction = restriction * (2/3);
};

const highQualityPoint = (iteration) => {
    let costBulk = [...bag.sensitivityIndex.costBulk];
    costBulk.sort((it1, it2) => {
        if(it1.value < it2.value) {
            return 1;
        } else if(it1.value > it2.value) {
            return -1;
        } else {
            return 0;
        }
    });
    selectRandomCandidates(costBulk, iteration);
    
};

const selectRandomCandidates = (items, iteration) => {
    let candidates = [];
    for(let i = 0; i < Math.floor(bag.banachSpace * 0.2); i +=1) {
        candidates[i] = items[i];
    }
    let newEsquema = [];
    let selected = false;
    while(newEsquema.length <= Math.floor(candidates.length / 2)) {
        let selectedItemIdx = selectItem(0, candidates.length);
        selected = false;
        for(let i = 0; i < newEsquema.length; i += 1) 
            if (!selected) selected = newEsquema[i].item == candidates[selectedItemIdx].item;
        if (!selected) newEsquema.push(candidates[selectedItemIdx]);
    }
    iterations[iteration][0] = [];
    iterations[iteration][0].initialEsquema = formatEsquema(newEsquema);
    iterations[iteration][0].initialRestriction = calculateBulk(iterations[iteration][0].initialEsquema);
    iterations[iteration][0].objectiveFunction = calculateCostFromNeightbour(iterations[iteration][0].initialEsquema);
    iterations[iteration][0].costBulk = calculateCostBulkFromNeightbour(iterations[iteration][0].initialEsquema);
};

const calculateBulk = (esquema) => {
    let bulk = 0;
    esquema.forEach((v, k) => {
        if (v === 1) bulk += bag.items[k].bulk;
    });
    return bulk;
};

const formatEsquema = (esquema) => {
    const formatEsquema = new Array(bag.banachSpace).fill(0);
    esquema.forEach(it => formatEsquema[it.item] = 1);
    return formatEsquema;
};

const highQualityPoint2 = (iteration) => {
    createBulkIndex(iteration);
};


const highQualityPoint3 = (iteration) => {
    createCostIndex(iteration);
};

const highQualityPoint4 = (iteration) => {
    createMaxCostIndex(iteration);
};

const calculateInitialPoints = (iteration) => {
    highQualityPoint(0);
    highQualityPoint2(1);
    highQualityPoint3(2);
    highQualityPoint4(3);
};

const ejecutarAlgoritmoTrayectoria = (heuristica) => {
    if(verificarSeleccionado()) {
        crearVecindario();
        seleccionarVecino();
        ejecutarAlgoritmoTrayectoria();
    }
};

const selectionMethod1 = (esquema) => {
    const len = esquema.length;
    const newEsquema = [...esquema];
    let isSelected = false;
    while(!isSelected) {
        const selectedItem = Math.floor(Math.random() * len + 1);
        if (newEsquema[selectedItem] === 0) {
            newEsquema[selectedItem] = 1;
            isSelected = !isSelected;
        }
    }
    return newEsquema;
};

const selectionMethod2 = (esquema) => {
    let costBulk = [...bag.sensitivityIndex.costBulk];
    const newEsquema = [...esquema];
    costBulk.sort((it1, it2) => {
        if(it1.value < it2.value) {
            return 1;
        } else if(it1.value > it2.value) {
            return -1;
        } else {
            return 0;
        }
    });
    let isSelected = false;
    let i = neighbourPosition;
    while(!isSelected && i < newEsquema.length) {
        if (newEsquema[costBulk[i].item] === 0) {
            newEsquema[costBulk[i].item] = 1;
            isSelected = true;
        } else {
            neighbourPosition += 1;
        }
        i += 1;
    }
    return newEsquema;
};

const selectionMethod3 = (esquema) => {
    let costs = [...bag.items];
    const newEsquema = [...esquema];
    costs.sort((it1, it2) => {
        if(it1.cost < it2.cost) {
            return 1;
        } else if(it1.cost > it2.cost) {
            return -1;
        } else {
            return 0;
        }
    });
    let isSelected = false;
    let i = neighbourPosition;
    while(!isSelected && i < newEsquema.length) {
        if (newEsquema[costs[i].item] === 0) {
            newEsquema[costs[i].item] = 1;
            isSelected = true;
        } else {
            neighbourPosition += 1;
        }
        i += 1;
    }
    return newEsquema;
};


const selectionMethod4= (esquema) => {
    let bulks = [...bag.items];
    const newEsquema = [...esquema];
    bulks.sort((it1, it2) => {
        if(it1.bulk > it2.bulk) {
            return 1;
        } else if(it1.bulk < it2.bulk) {
            return -1;
        } else {
            return 0;
        }
    });
    let isSelected = false;
    let i = neighbourPosition;
    while(!isSelected && i < newEsquema.length) {
        if (newEsquema[bulks[i].item] === 0) {
            newEsquema[bulks[i].item] = 1;
            isSelected = true;
        } else {
            neighbourPosition += 1;
        }
        i += 1;
    }
    return newEsquema;
};

const generateNeighbour = (selectionMethod, esquema) => {
    let neighbour = [];
    switch(selectionMethod) {
        case 1:
            neighbour = selectionMethod1(esquema);
            break;
        case 2:
            neighbour = selectionMethod2(esquema);
            break;
        case 3:
            neighbour = selectionMethod3(esquema);
            break;
        case 4:
            neighbour = selectionMethod4(esquema);
            break;
        default:
            break;
    }
    return neighbour;
};

const getSelectionMethod = () => {
    return Math.floor(Math.random() * 4 + 1);
};

const calculateCostBulkFromNeightbour = (neighbour) => {
    let costBulk = 0;
    neighbour.forEach((v, k) => {
        if (v === 1) bag.sensitivityIndex.costBulk.filter(it => it.item === k).forEach(it => costBulk += it.value); 
    });
    return costBulk;
};

const calculateBulkFromNeightbour = (neighbour) => {
    let bulk = 0;
    neighbour.forEach((v, k) => {
        if (v === 1) bulk += bag.items[k].bulk;
    });
    return bulk;
};

const calculateCostFromNeightbour = (neighbour) => {
    let cost = 0;
    neighbour.forEach((v, k) => {
        if (v === 1) cost += bag.items[k].cost;
    });
    return cost;
};

const createNeighborhood = (esquema) => {
    const selectionMethod = getSelectionMethod();
    const neighbours = [];
    neighbourPosition = 0;
    for(let i = 0; i < 3; i += 1) {
        const newNeighbour = generateNeighbour(selectionMethod, esquema);
        neighbours.push({neightbour:newNeighbour,
            costBulk:calculateCostBulkFromNeightbour(newNeighbour),
            bulk:calculateBulkFromNeightbour(newNeighbour),
            cost:calculateCostFromNeightbour(newNeighbour),
            selectionMethod: selectionMethod
        });
        neighbourPosition += 1;
    }
    return neighbours;
};

const selectNeighbourBulkCost = (neighbours) => {
    const bulkCost = [];
    bulkCost[0] = { costBulk:neighbours[0].costBulk, idx:0 };
    bulkCost[1] = { costBulk:neighbours[1].costBulk, idx:1 };
    bulkCost[2] = { costBulk:neighbours[2].costBulk, idx:2 };
    const bulkAux = [...bulkCost];
    bulkAux.sort((it1, it2) => {
        if(it1.costBulk > it2.costBulk) {
            return 1;
        } else if(it1.costBulk < it2.costBulk) {
            return -1;
        } else {
            return 0;
        }
    });
    bulkAux.reverse();
    return {esquema:neighbours[bulkAux[0].idx], costBulk:bulkAux[0].costBulk, selected: bulkAux[0].idx};
};

const selectNeighbourCost = (neighbours) => {
    const bulkCost = [];
    bulkCost[0] = { cost:neighbours[0].cost, idx:0 };
    bulkCost[1] = { cost:neighbours[1].cost, idx:1 };
    bulkCost[2] = { cost:neighbours[2].cost, idx:2 };
    const bulkAux = [...bulkCost];
    bulkAux.sort((it1, it2) => {
        if(it1.cost > it2.cost) {
            return 1;
        } else if(it1.cost < it2.cost) {
            return -1;
        } else {
            return 0;
        }
    });
    bulkAux.reverse();
    return {esquema:neighbours[bulkAux[0].idx], cost:bulkAux[0].cost, selected: bulkAux[0].idx};
};

const selectNeighbourBulk = (neighbours) => {
    const bulkCost = [];
    bulkCost[0] = { bulk:neighbours[0].bulk, idx:0 };
    bulkCost[1] = { bulk:neighbours[1].bulk, idx:1 };
    bulkCost[2] = { bulk:neighbours[2].bulk, idx:2 };
    const bulkAux = [...bulkCost];
    bulkAux.sort((it1, it2) => {
        if(it1.bulk < it2.bulk) {
            return 1;
        } else if(it1.bulk > it2.bulk) {
            return -1;
        } else {
            return 0;
        }
    });
    bulkAux.reverse();
    return {esquema:neighbours[bulkAux[0].idx], bulk:bulkAux[0].bulk, selected: bulkAux[0].idx};
};

const trajectoryAlgorithm = (iteration, idx = 0) => {
    if (iteration > 200) return;
    try{
        iterations[iteration][idx].neighbours = createNeighborhood(iterations[iteration][idx].initialEsquema);
        const selectionMethod = getSelectionMethod();
        console.log({ selectionMethod });
        switch(selectionMethod) {
            case 1:
                const randomNeighbour = Math.floor(Math.random() * 2);
                const selected = {
                    esquema:iterations[iteration][idx].neighbours[randomNeighbour],
                    costBulk:iterations[iteration][idx].neighbours[randomNeighbour].costBulk, 
                    selected: randomNeighbour
                };
                iterations[iteration][idx].candidateEsquema = selected;
                iterations[iteration][idx].neighbourSelectedMethod = 'Aleatorio';
                break;
            case 2:
                iterations[iteration][idx].candidateEsquema = selectNeighbourBulkCost(iterations[iteration][idx].neighbours);
                iterations[iteration][idx].neighbourSelectedMethod = 'Costo/Volumen';
                break;
            case 3:
                iterations[iteration][idx].candidateEsquema = selectNeighbourCost(iterations[iteration][idx].neighbours);
                iterations[iteration][idx].neighbourSelectedMethod = 'Mayor Costo';
                break;
            case 4:
                iterations[iteration][idx].candidateEsquema = selectNeighbourBulk(iterations[iteration][idx].neighbours);
                iterations[iteration][idx].neighbourSelectedMethod = 'Menor Volumen';
                break;
        }
        iterations[iteration][idx].neighbourSelected = iterations[iteration][idx].candidateEsquema.selected;
        
        if (iterations[iteration][idx].candidateEsquema.esquema.bulk < bag.restriction) {
            iterations[iteration][idx+1] = [];
            iterations[iteration][idx+1].initialEsquema = iterations[iteration][idx].candidateEsquema.esquema.neightbour;
            iterations[iteration][idx+1].initialRestriction = iterations[iteration][idx].candidateEsquema.esquema.bulk;
            iterations[iteration][idx+1].objectiveFunction = iterations[iteration][idx].candidateEsquema.esquema.cost;
            iterations[iteration][idx+1].costBulk = iterations[iteration][idx].candidateEsquema.esquema.costBulk;
            printIteration(iterations[iteration][idx], iteration, idx, false);
            trajectoryAlgorithm(iteration, idx+1);
        } else {
            printIteration(iterations[iteration][idx], iteration, idx, true);
            printIncumbente(iterations[iteration][idx], iteration);
            return bag.incumbentes.push(iterations[iteration][idx]);
        }
    }catch(ex) {
        console.error(ex, iterations[iteration]);
    }
};

const printIteration = (itData, iteration, i, isIncumbente) => {
    if (typeof itData === 'undefined') return;
    let el;
    console.log({itData});
    let table = '';
    if (i === 0) {
        el = document.getElementById('alg_'+iteration);
        table = '<table id="table_alg_'+ iteration+'"><tr><th>Iteracion</th><th>Esquema</th>';
        table += '<th>Costo/Volumen</th><th>Funcion objetivo</th><th>Volumen</th><th>Metodo Creacion Vecindario</th>';
        table += '<th>Metodo Seleccion Nuevo Esquema</th><th>Vecino Seleccionado</th>';
        table += '<th>Vecino 1</th><th>Costo/Volumen Vecino 1</th><th>Costo Vecino 1</th><th>Volumen Vecino 1</th>';
        table += '<th>Vecino 2</th><th>Costo/Volumen Vecino 2</th><th>Costo Vecino 2</th><th>Volumen Vecino 2</th>';
        table += '<th>Vecino 3</th><th>Costo/Volumen Vecino 3</th><th>Costo Vecino 3</th><th>Volumen Vecino 3</th>';
        table += '<th>Volumen Mochila</th></tr>';
    } else {
        el = document.getElementById('table_alg_'+iteration);
    }
    if (isIncumbente) {
        table += '<tr class="incumbente">';
    } else {
        if (i ===0 ) {
            table += '<tr class="initialPoint">';
        } else {
            table += '<tr>';
        }
    }
    if (i === 0) {
        table += '<td>Punto de Partida</td>';
    } else {
        if (!isIncumbente) {
            table += '<td>' + (i + 1) + '</td>';
        } else {
            table += '<td>' + (i + 1) + ' -  Mejor Incumbente</td>';
        }
    }
    table += '<td>' + itData.initialEsquema + '</td>';
    table += '<td>' + itData.costBulk.toString().replace('.',',') + '</td>';
    table += '<td>' + itData.objectiveFunction + '</td>';
    table += '<td>' + itData.initialRestriction.toString().replace('.',',') + '</td>';
    table += '<td>' + getNameMethod(itData.neighbours[0].selectionMethod) + '</td>';
    table += '<td>' + itData.neighbourSelectedMethod + '</td>';
    table += '<td>' + ( itData.neighbourSelected + 1) + '</td>';
    table += '<td '+ ((itData.neighbourSelected === 0 && !isIncumbente) ? "class='selected'" : (itData.neighbourSelected === 0 && isIncumbente) ? "class='error'" : '') + '>' + itData.neighbours[0].neightbour + '</td>';
    table += '<td '+ ((itData.neighbourSelected === 0 && !isIncumbente) ? "class='selected'" :(itData.neighbourSelected === 0 && isIncumbente) ? "class='error'" : '') + '>' + itData.neighbours[0].costBulk.toString().replace('.',',') + '</td>';
    table += '<td '+ ((itData.neighbourSelected === 0 && !isIncumbente) ? "class='selected'" :(itData.neighbourSelected === 0 && isIncumbente) ? "class='error'" : '') + '>' + itData.neighbours[0].cost + '</td>';
    table += '<td '+ ((itData.neighbourSelected === 0 && !isIncumbente) ? "class='selected'" :(itData.neighbourSelected === 0 && isIncumbente) ? "class='error'" : '') + '>' + itData.neighbours[0].bulk + '</td>';
    table += '<td '+ ((itData.neighbourSelected === 1 && !isIncumbente) ? "class='selected'" :(itData.neighbourSelected === 1 && isIncumbente) ? "class='error'" : '') + '>' + itData.neighbours[1].neightbour + '</td>';
    table += '<td '+ ((itData.neighbourSelected === 1 && !isIncumbente) ? "class='selected'" :(itData.neighbourSelected === 1 && isIncumbente) ? "class='error'" : '') + '>' + itData.neighbours[1].costBulk.toString().replace('.',',') + '</td>';
    table += '<td '+ ((itData.neighbourSelected === 1 && !isIncumbente) ? "class='selected'" :(itData.neighbourSelected === 1 && isIncumbente) ? "class='error'" : '') + '>' + itData.neighbours[1].cost + '</td>';
    table += '<td '+ ((itData.neighbourSelected === 1 && !isIncumbente) ? "class='selected'" :(itData.neighbourSelected === 1 && isIncumbente) ? "class='error'" : '') + '>' + itData.neighbours[1].bulk + '</td>';
    table += '<td '+ ((itData.neighbourSelected === 2 && !isIncumbente) ? "class='selected'" :(itData.neighbourSelected === 2 && isIncumbente) ? "class='error'" : '') + '>' + itData.neighbours[2].neightbour + '</td>';
    table += '<td '+ ((itData.neighbourSelected === 2 && !isIncumbente) ? "class='selected'" :(itData.neighbourSelected === 2 && isIncumbente) ? "class='error'" : '') + '>' + itData.neighbours[2].costBulk.toString().replace('.',',') + '</td>';
    table += '<td '+ ((itData.neighbourSelected === 2 && !isIncumbente) ? "class='selected'" :(itData.neighbourSelected === 2 && isIncumbente) ? "class='error'" : '') + '>' + itData.neighbours[2].cost + '</td>';
    table += '<td '+ ((itData.neighbourSelected === 2 && !isIncumbente) ? "class='selected'" :(itData.neighbourSelected === 2 && isIncumbente) ? "class='error'" : '') + '>' + itData.neighbours[2].bulk + '</td>';
    table += '<td>' + bag.restriction.toString().replace('.',',') + '</td>';
    table += '</tr>';
    
    el.insertAdjacentHTML( 'beforeend', table );
};

const getNameMethod = (idMethod) => {
    if (idMethod === 1) return 'Aleatorio';
    if (idMethod === 2) return 'Costo/Volumen';
    if (idMethod === 3) return 'Mayor Costo';
    if (idMethod === 4) return 'Menor Volumen';
};

const printIncumbente = (incumbente, iteration) => {
    const el = document.getElementById('incumbente_'+iteration);
    console.log(incumbente);
    let table = '<table id="tbl_'+ iteration+'"><tr><th>Incumbente '+ (iteration+1)+'</th>';
    table += '<th>Costo/Valor</th><th>Funcion objetivo</th><th>Volumen</th><th>Volumen Mochila</th></tr>';
    table += '<tr>';
    table += '<td>' + incumbente.initialEsquema + '</td>';
    table += '<td>' + incumbente.costBulk.toString().replace('.',',') + '</td>';
    table += '<td>' + incumbente.objectiveFunction + '</td>';
    table += '<td>' + incumbente.initialRestriction + '</td>';
    table += '<td>' + bag.restriction.toString().replace('.',',') + '</td>';
    table += '</tr>';
    table += '</table>';
    
    el.innerHTML = table;
};

function exportToJsonFile(jsonData, name) {
    console.log(jsonData);
    let dataStr = JSON.stringify(jsonData);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    let exportFileDefaultName = `${name}.json`;

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

const jsonBag = '{"restriction":631.3333333333333,"banachSpace":46,"items":[{"item":0,"cost":53,"bulk":18},{"item":1,"cost":8,"bulk":10},{"item":2,"cost":4,"bulk":2},{"item":3,"cost":92,"bulk":2},{"item":4,"cost":95,"bulk":50},{"item":5,"cost":16,"bulk":16},{"item":6,"cost":67,"bulk":12},{"item":7,"cost":53,"bulk":12},{"item":8,"cost":80,"bulk":45},{"item":9,"cost":16,"bulk":11},{"item":10,"cost":94,"bulk":30},{"item":11,"cost":26,"bulk":9},{"item":12,"cost":15,"bulk":29},{"item":13,"cost":70,"bulk":47},{"item":14,"cost":57,"bulk":15},{"item":15,"cost":80,"bulk":4},{"item":16,"cost":27,"bulk":17},{"item":17,"cost":58,"bulk":36},{"item":18,"cost":3,"bulk":4},{"item":19,"cost":45,"bulk":2},{"item":20,"cost":52,"bulk":26},{"item":21,"cost":52,"bulk":21},{"item":22,"cost":84,"bulk":4},{"item":23,"cost":84,"bulk":3},{"item":24,"cost":9,"bulk":37},{"item":25,"cost":75,"bulk":42},{"item":26,"cost":53,"bulk":46},{"item":27,"cost":3,"bulk":15},{"item":28,"cost":60,"bulk":15},{"item":29,"cost":15,"bulk":31},{"item":30,"cost":100,"bulk":25},{"item":31,"cost":86,"bulk":2},{"item":32,"cost":85,"bulk":44},{"item":33,"cost":15,"bulk":17},{"item":34,"cost":36,"bulk":13},{"item":35,"cost":97,"bulk":33},{"item":36,"cost":17,"bulk":9},{"item":37,"cost":70,"bulk":20},{"item":38,"cost":86,"bulk":12},{"item":39,"cost":28,"bulk":18},{"item":40,"cost":2,"bulk":21},{"item":41,"cost":70,"bulk":6},{"item":42,"cost":21,"bulk":28},{"item":43,"cost":24,"bulk":17},{"item":44,"cost":75,"bulk":22},{"item":45,"cost":98,"bulk":49}],"sensitivityIndex":{"costBulk":[{"item":0,"value":2.9444444444444446},{"item":1,"value":0.8},{"item":2,"value":2},{"item":3,"value":46},{"item":4,"value":1.9},{"item":5,"value":1},{"item":6,"value":5.583333333333333},{"item":7,"value":4.416666666666667},{"item":8,"value":1.7777777777777777},{"item":9,"value":1.4545454545454546},{"item":10,"value":3.1333333333333333},{"item":11,"value":2.888888888888889},{"item":12,"value":0.5172413793103449},{"item":13,"value":1.4893617021276595},{"item":14,"value":3.8},{"item":15,"value":20},{"item":16,"value":1.588235294117647},{"item":17,"value":1.6111111111111112},{"item":18,"value":0.75},{"item":19,"value":22.5},{"item":20,"value":2},{"item":21,"value":2.4761904761904763},{"item":22,"value":21},{"item":23,"value":28},{"item":24,"value":0.24324324324324326},{"item":25,"value":1.7857142857142858},{"item":26,"value":1.1521739130434783},{"item":27,"value":0.2},{"item":28,"value":4},{"item":29,"value":0.4838709677419355},{"item":30,"value":4},{"item":31,"value":43},{"item":32,"value":1.9318181818181819},{"item":33,"value":0.8823529411764706},{"item":34,"value":2.769230769230769},{"item":35,"value":2.9393939393939394},{"item":36,"value":1.8888888888888888},{"item":37,"value":3.5},{"item":38,"value":7.166666666666667},{"item":39,"value":1.5555555555555556},{"item":40,"value":0.09523809523809523},{"item":41,"value":11.666666666666666},{"item":42,"value":0.75},{"item":43,"value":1.411764705882353},{"item":44,"value":3.409090909090909},{"item":45,"value":2}]},"incumbentes":[]}';//JSON.stringify(bag);
bag = JSON.parse(jsonBag);
//createBag(40, 60);
//createItems(100,50);
sensitivityIndex();
calculateRestriction();
calculateInitialPoints();
trajectoryAlgorithm(0);
trajectoryAlgorithm(1);
trajectoryAlgorithm(2);
trajectoryAlgorithm(3);


/*
setTimeout(() =>
exportToJsonFile(bag, 'bag'), 5000);
setTimeout(() =>
exportToJsonFile(iterations[0], 'iteration_0'), 5000);
setTimeout(() =>
exportToJsonFile(iterations[1], 'iteration_1'), 5000);
setTimeout(() =>
exportToJsonFile(iterations[2], 'iteration_2'), 5000);
setTimeout(() =>
exportToJsonFile(iterations[3], 'iteration_3'), 5000);
*/

console.log({ bag });
console.log({ iterations });