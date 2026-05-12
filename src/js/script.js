// DECARAÇÕES DOS ELEMENTOS USANDO DOM
const videoElemento = document.getElementById("video");
const botaoScanear = document.getElementById("bnt-texto");
const resultado = document.getElementById("resultado");
const canvas = document.getElementById("canvas");

// FUNÇÕES QUE HABILITA A CÂMERA
async function configurarCamera() {
    try {
        const midia =await navigator.mediaDevices.getUserMedia({
            video: {facingMode: "environment"}, // aciona a camera traseira
            audio: false
        });
        // recebe a função midia para habilitar a camera
        videoElemento.srcObject = midia;
        // garante que o video comece
        videoElemento.play();

    } catch(erro) {
        resultado.innerText="Erro ao acessar a câmera", erro
    }
}

// executa a função da câmera
configurarCamera();

// função para ler o texto que a camera pegar

botaoScanear.onclick = async () => {
    botaoScanear.disable = true; //habilita a camera
    resultado.innerText = "Fazendo a leitura, aguarde...";

    // 
    const contexto = canvas.getContext("2d");

    // 
    canvas.width = videoElemento.videoWidth;
    canvas.height = videoElemento.videoHeight;

    // reset para garantir que a foto nao saia invertida
    contexto.setTransform(1, 0, 0, 1, 0, 0)

    // filtro de contraste e escala de cinza antes de tirar a foto 
    // ajuda a evitar as letras aleatórias
    contexto.filter = 'contrast(1.2) grayscale(1)';
    try {
        const {data: {text}} =await Tesseract.recognize (
            canvas, // onde o texto vai aparecer
            'por' // idioma do texto
        );
        //
        const textoFinal = text.trim();
        resultado.innerText = textoFinal.length > 0 ? textoFinal : "Não foi possível identificar o texto"

    } catch(erro) {
        console.error(erro);
        resultado.innerText = "Erro ao processar", erro
    } 
    finally {
        // desabilita a camera para fazer uma nova cap0tura
        botaoScanear.diable=false;
    }
} 
