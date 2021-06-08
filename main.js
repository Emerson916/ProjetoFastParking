'use strcit'

//Modal Preços
const openModalPrecos = () => document.querySelector('#modal-Prices').classList.add('active');
const closeModalPrecos = () => document.querySelector('#modal-Prices').classList.remove('active');

//Modal Editar
const openModalEdit = () => document.querySelector('#modal-edit').classList.add('active');
const closeModalEdit = () => document.querySelector('#modal-edit').classList.remove('active');

//Modal Comprovante
const openModalReceipt = () => document.querySelector('#modal-receipt').classList.add('active');
const closeModalReceipt = () => document.querySelector('#modal-receipt').classList.remove('active');

//Banco de dados dos clientes
const bancoDeDados = () => JSON.parse(localStorage.getItem('bancoDeDados')) ?? [];
const setBancoDeDados = (bancoDeDados) => localStorage.setItem('bancoDeDados', JSON.stringify(bancoDeDados));

//Banco de dados dos preços
const BDpreco = () => JSON.parse(localStorage.getItem('preco')) ?? [];
const setBDPreco = (preco) => localStorage.setItem('preco', JSON.stringify(preco));


const inserirBD = (client) => {
    // ler(abrir) o banco de dados
    const lerBancoDeDados = bancoDeDados()
    // Adicionar o novo cliente 
    lerBancoDeDados.push(client)
    // Enviar(Salvar) ou fechar o banco de dados
    setBancoDeDados(lerBancoDeDados)
}

const inserirPreco = (preco) => {
    const lerPreco = BDpreco()
    lerPreco.push(preco)
    setBDPreco(lerPreco)
}

const updateClient = (client, index) => {
    const lerBancoDeDados = bancoDeDados()
    lerBancoDeDados[index] = client
    setBancoDeDados(lerBancoDeDados)
}

const clearTable = () => {
    const recordClient = document.querySelector('#tableClient tbody')
    while (recordClient.firstChild) {
        recordClient.removeChild(recordClient.lastChild);
    }
}

const createRow = (client, index) => {
    const recordClient = document.querySelector('#tableClient tbody')
    const newTr = document.createElement('tr')
    newTr.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.placa}</td>
        <td>${client.data}</td>
        <td>${client.hora}</td>
        <td>
            <button type='button' class='button_comp' id="button-receipt" data-action="comprovante-${index}">Comp.</button>
            <button type='button' class='button_edit' id="button-edit" data-action="editar-${index}">Editar</button>
            <button type='button' class='button_exit' id="button-exit" data-action="deletar-${index}">Saída</button>
        </td>
    `
    recordClient.appendChild(newTr)
} 

const updateTable = () => {
    // limpar tabela
    clearTable()
    // ler o banco de dados
    const lerBancoDeDados = bancoDeDados()
    // Criar linhas na tbody com os registros
    lerBancoDeDados.forEach(createRow)
}

const clearInput = () => {
    const inputs = Array.from(document.querySelectorAll('input'));
    inputs.forEach(input => input.value = "");
}

const date = new Date();
const dateTime = {
    'day': date.getDate(),
    'mounth': date.getMonth() + 1,
    'year': date.getFullYear(),
    'hours': date.getHours(),
    'minutes': date.getMinutes()
}

const getDateNow = () => {
    const dateNow = dateTime['mounth'] > 9 ?
        dateTime['day'] + '/' + dateTime['mounth'] + '/' + dateTime['year']
        :
        dateTime['day'] + '/0' + dateTime['mounth'] + '/' + dateTime['year'];

    return dateNow;
}

const getHoursNow = () => {
    const timeNow = dateTime['hours'] + ':' + dateTime['minutes'];

    return timeNow;
}

const isValidForm = () => document.querySelector('.register_container').reportValidity()

const saveClient = () => {

    if (isValidForm()) {
        const newClient = {
            nome: document.querySelector('#name').value,
            placa: document.querySelector('#slab').value,
            data: getDateNow(),
            hora: getHoursNow()
        }

         const index = document.querySelector('#name').dataset.index

            if (index == '') { 
                inserirBD(newClient)
            } else {
                updateClient(newClient, index)
            }

        clearInput();
        updateTable();
    }
}

const isValidFormPrice = () => document.querySelector('#form-price').reportValidity();

const savePrice = () => {
    if (isValidFormPrice()) {
        const newPrice = {
            primeiraHora: document.querySelector('#primeira-hora').value,
            demaisHoras: document.querySelector('#demais-horas').value
        }
        inserirPreco(newPrice);
        clearInput();
        closeModalPrecos();
    }
}

const isValidFormEdit = () => document.querySelector('#form-edit').reportValidity();

const saveClientEdited = () => {
    if (isValidFormEdit()) {
        const newClient = {
            nome: document.querySelector('#nome-edited').value,
            placa: document.querySelector('#placa-edited').value,
            data: document.querySelector('#data').value,
            hora: document.querySelector('#hora').value,
        }
        inserirBD(newClient);
        clearInput();
        closeModalEdit();
        updateTable();
    }
}

const deleteClient = (index) => {
    const lerBancoDeDados = bancoDeDados()
    const resp = confirm(`Após a saída o cliente, ${lerBancoDeDados[index].nome}, será excluido, deseja continuar?`)
    
    if (resp) {
        lerBancoDeDados.splice(index, 1)
        setBancoDeDados(lerBancoDeDados)
        updateTable()
    }
}

const deleteClientEdit = (index) => {
    const lerBancoDeDados = bancoDeDados()
    const resp = confirm(`O cliente atual, ${lerBancoDeDados[index].nome}, será editado, deseja continuar?`)
    
    if (resp) {
        lerBancoDeDados.splice(index, 1)
        setBancoDeDados(lerBancoDeDados)
        updateTable()
    }
}

const editClient = (index) => {
    console.log(index)

    const lerBancoDeDados = bancoDeDados()
    document.querySelector('#nomeEdited').value = lerBancoDeDados[index].nome
    document.querySelector('#placaEdited').value = lerBancoDeDados[index].placa
    document.querySelector('#data').value = lerBancoDeDados[index].data
    document.querySelector('#hora').value = lerBancoDeDados[index].hora
    
    deleteClientEdit(index);
}

const setReceipt = (index) => {
    const lerBancoDeDados = bancoDeDados();
    const input = Array.from(document.querySelectorAll('#form-receipt input'));
    input[0].value = lerBancoDeDados[index].nome;
    input[1].value = lerBancoDeDados[index].placa;
    input[2].value = lerBancoDeDados[index].data;
    input[3].value = lerBancoDeDados[index].hora;
}

const actionButtons = (event) => {
    const button = event.target;
    if (button.id == "button-receipt") {
        const index = button.dataset.action.slip('-');
        openModalReceipt();
        setReceipt(index[index]);
    } else if (button.id == "button-exit") {
        const index = button.dataset.action.slip('-'); 
        openModalExit();
        setExit(index);
    } else if (button.id == "button-edit") {
        const index = button.dataset.action.split('-');
       
        openModalEdit();
        editClient(index[1])
    }
}
//Modal preços
document.querySelector('#precos').addEventListener('click', () => { openModalPrecos(); clearInput() });
document.querySelector('#close-prices').addEventListener('click', () => { closeModalPrecos(); clearInput() });
document.querySelector('#cancelar-prices').addEventListener('click', () => { closeModalPrecos(); clearInput() });

//Salvar novo cliente
document.querySelector('#salvar')
    .addEventListener('click', saveClient);

//SALVAR PREÇO
document.querySelector('#salvarPreco')
    .addEventListener('click', savePrice);

// SELETOR DOS BOTÕES
document.querySelector('#tableClient').addEventListener('click', actionButtons);

//MODAL EDITAR
document.querySelector('#close-edit')
    .addEventListener('click', () => { closeModalEdit(); clearInput() });

document.querySelector('#cancelar-edit')
    .addEventListener('click', () => { closeModalEdit(); clearInput() });    

//MODAL COMPROVANTE
document.querySelector('#close-receipt')
    .addEventListener('click', () => { closeModalReceipt(); clearInputs() });

document.querySelector('#cancelar-receipt')
    .addEventListener('click', () => { closeModalReceipt(); clearInputs() });    

//SALVAR EDITAR
document.querySelector('#editar')
    .addEventListener('click', saveClientEdited);
updateTable ()

//teste git 