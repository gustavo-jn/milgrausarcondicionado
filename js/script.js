// ===== Configuração =====
// TODO (103.01): trocar pelo número real da Mil Graus (com 55 + DDD, só números)
var numeroWhatsapp = "5500000000000";
var mensagemWhatsapp = "Olá! Vim pelo site e gostaria de pedir um orçamento.";

// ===== Botões de WhatsApp =====
// Todo link com a classe "link-whatsapp" abre a conversa já com a mensagem pronta
var linksWhatsapp = document.querySelectorAll(".link-whatsapp");
var enderecoWhatsapp = "https://wa.me/" + numeroWhatsapp + "?text=" + encodeURIComponent(mensagemWhatsapp);

linksWhatsapp.forEach(function (link) {
    link.href = enderecoWhatsapp;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
});

// ===== Menu do celular =====
var menuBotao = document.getElementById("menuBotao");
var menu = document.getElementById("menu");

menuBotao.addEventListener("click", function () {
    var aberto = menu.classList.toggle("aberto");
    menuBotao.setAttribute("aria-expanded", aberto);
});

// Fecha o menu ao clicar em um item
menu.querySelectorAll("a").forEach(function (item) {
    item.addEventListener("click", function () {
        menu.classList.remove("aberto");
        menuBotao.setAttribute("aria-expanded", false);
    });
});

// ===== Calculadora de BTUs =====
// Regra simples:
//   600 BTU por m², mais 600 por pessoa a partir da segunda, mais 20% se bater sol.
// Depois escolhemos o tamanho comercial mais próximo.
// Se a carga passar de 36.000 BTU/h, indicamos 2 aparelhos (ou mais) de tamanho menor.
var tamanhos = [7000, 9000, 12000, 18000, 24000, 30000, 36000];

var campoArea = document.getElementById("area");
var campoPessoas = document.getElementById("pessoas");
var campoSol = document.getElementById("sol");

function formatar(numero) {
    return numero.toLocaleString("pt-BR");
}

// Retorna o menor tamanho comercial que atende a carga informada
function tamanhoPara(carga) {
    for (var i = 0; i < tamanhos.length; i++) {
        if (tamanhos[i] >= carga) {
            return tamanhos[i];
        }
    }
    return tamanhos[tamanhos.length - 1];
}

// Devolve o texto da indicação, por exemplo "12.000" ou "2 × 24.000"
function indicacao(carga) {
    var quantidade = Math.ceil(carga / 36000);
    var tamanho = tamanhoPara(carga / quantidade);
    if (quantidade > 1) {
        return { texto: quantidade + " × " + formatar(tamanho), quantidade: quantidade, tamanho: tamanho };
    }
    return { texto: formatar(tamanho), quantidade: 1, tamanho: tamanho };
}

// Pinta a parte já preenchida da barra do controle deslizante
function pintarBarra(campo) {
    var porcentagem = (campo.value - campo.min) * 100 / (campo.max - campo.min);
    campo.style.setProperty("--preenchimento", porcentagem + "%");
}

function calcular() {
    var area = Number(campoArea.value);
    var pessoas = Number(campoPessoas.value);
    var sol = campoSol.checked;

    var cargaMetragem = area * 600;
    var carga = cargaMetragem + (pessoas - 1) * 600;
    if (sol) {
        carga = carga * 1.2;
    }
    carga = Math.round(carga);

    var chute = indicacao(cargaMetragem);
    var resultado = indicacao(carga);

    document.getElementById("areaValor").textContent = area + " m²";
    document.getElementById("pessoasValor").textContent = pessoas + (pessoas === 1 ? " pessoa" : " pessoas");
    document.getElementById("valorChute").textContent = chute.texto;
    document.getElementById("valorMilGraus").textContent = resultado.texto;
    document.getElementById("resultadoBtu").textContent = resultado.texto;
    document.getElementById("cargaCalculada").textContent = formatar(carga) + " BTU/h";
    document.getElementById("cargaMetragem").textContent = formatar(cargaMetragem) + " BTU/h";

    if (resultado.quantidade > 1) {
        document.getElementById("resultadoTexto").textContent =
            "Nesse tamanho, " + resultado.quantidade + " aparelhos climatizam melhor do que um só no limite.";
    } else {
        document.getElementById("resultadoTexto").textContent = "Um aparelho atende bem esse ambiente.";
    }

    pintarBarra(campoArea);
    pintarBarra(campoPessoas);

    // O botão já leva o resultado para o WhatsApp
    var texto = "Olá! Calculei no site: ambiente de " + area + " m², " + pessoas + " pessoa(s)" +
        (sol ? ", com sol da tarde" : "") + ". Indicou " + resultado.texto + " BTU/h. Gostaria de um orçamento.";
    document.getElementById("resultadoBotao").href = "https://wa.me/" + numeroWhatsapp + "?text=" + encodeURIComponent(texto);
}

// Recalcula na hora, sem botão
campoArea.addEventListener("input", calcular);
campoPessoas.addEventListener("input", calcular);
campoSol.addEventListener("change", calcular);
calcular();

// ===== Formulário de contato =====
// Não envia nada para servidor: só abre o WhatsApp com os dados digitados
document.getElementById("formContato").addEventListener("submit", function (evento) {
    evento.preventDefault();

    var nome = document.getElementById("contatoNome").value.trim();
    var telefone = document.getElementById("contatoZap").value.trim();

    var texto = "Olá! Meu nome é " + nome + " e meu WhatsApp é " + telefone + ". Gostaria de falar com a equipe da Mil Graus.";
    window.open("https://wa.me/" + numeroWhatsapp + "?text=" + encodeURIComponent(texto), "_blank", "noopener");
});
