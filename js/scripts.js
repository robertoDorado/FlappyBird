function novoElemento(tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

function Barreira(reversa = false) {
    this.elemento = novoElemento('div', 'barreira')
    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')
    this.elemento.appendChild(reversa ? corpo : borda)
    this.elemento.appendChild(reversa ? borda : corpo)

    this.setAltura = altura => corpo.style.height = `${altura}px`
}

function ParDeBarreiras(altura, abertura, x) {
    this.elemento = novoElemento('div', 'par-de-barreiras')

    this.superior = new Barreira(true)
    this.inferior = new Barreira(false)

    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura)
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
    this.setX = x => this.elemento.style.left = `${x}px`
    this.getLargura = () => this.elemento.clientWidth

    this.sortearAbertura()
    this.setX(x)

}

function Barreiras(altura, largura, abertura, espaco, notificarPonto) {

    this.pares = [
        new ParDeBarreiras(altura, abertura, largura),
        new ParDeBarreiras(altura, abertura, largura + espaco),
        new ParDeBarreiras(altura, abertura, largura + espaco * 2),
        new ParDeBarreiras(altura, abertura, largura + espaco * 3),
    ]

    this.deslocamento = 3
    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - this.deslocamento)

            if (par.getX() < - par.getLargura()) {
                par.setX(par.getX() + espaco * this.pares.length)
                par.sortearAbertura()
            }

            const meio = largura / 2
            const cruzouOMeio = par.getX() + this.deslocamento >= meio
                && par.getX() < meio
            if (cruzouOMeio) {
                notificarPonto()
                somEfeito()
            }
        })
    }
}

function somEfeito() {
    const efeito = document.querySelector('#stopButton4')
    efeito.click()
}

function Passaro(alturaJogo) {
    let voando = false

    this.elemento = novoElemento('img', 'passaro')
    this.elemento.src = 'img/flappy.png'

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`

    window.onkeydown = e => (e.keyCode == 38 ? voando = true : voando = false)
    window.onkeyup = e => voando = false

    this.animar = () => {
        const novoY = this.getY() + (voando ? 8 : -3)
        const alturaMaxima = alturaJogo - this.elemento.clientHeight

        if (novoY <= 0) {
            this.setY(0)
        } else if (novoY >= alturaMaxima) {
            this.setY(alturaMaxima)
        } else {
            this.setY(novoY)
        }
    }

    this.setY(alturaJogo / 2)
}

function nivelExplicito() {
    this.elemento = novoElemento('span', 'nivel')
}


function Progresso() {
    this.elemento = novoElemento('span', 'progresso')
    this.atualizarPontos = pontos => {
        this.elemento.innerHTML = pontos
    }
    this.atualizarPontos(0)
}

function FlappyBird() {
    let pontos = 0

    const areaDoJogo = document.querySelector('[wm-flappy]')
    const altura = areaDoJogo.clientHeight
    const largura = areaDoJogo.clientWidth

    const progresso = new Progresso()

    const barreiras = new Barreiras(altura, largura, 200, 500,
        () => progresso.atualizarPontos(++pontos))

    const passaro = new Passaro(altura)
    const nivel = new nivelExplicito()

    areaDoJogo.appendChild(nivel.elemento)
    areaDoJogo.appendChild(progresso.elemento)
    areaDoJogo.appendChild(passaro.elemento)
    barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

    this.start = () => {
        let temporizador = setInterval(() => {
            barreiras.animar()
            passaro.animar()
            let dificuldade = pontuacaoMinima(progresso, barreiras)

            barreiras.deslocamento = dificuldade[0]
            nivel.elemento.innerHTML = dificuldade[1]

            if (passaro.getY() == 0) {
                alert('perdeu!')
                clearInterval(temporizador)
                window.location.href = window.location.href
            }

            if (colidiu(passaro, barreiras)) {
                alert('perdeu!')
                clearInterval(temporizador)
                window.location.href = window.location.href
            }
        }, 20);
    }
}

function pontuacaoMinima(progresso, barreiras) {
    let minimo = parseInt(progresso.elemento.innerHTML)
    let deslocamento = parseInt(barreiras.deslocamento)
    let nivel = null

    switch (minimo) {
        case 1:
            deslocamento = 4
            nivel = "so easy! :)"
            break
        case 5:
            deslocamento = 5
            nivel = "I'm very good!"
            break
        case 15:
            deslocamento = 8
            nivel = "it's getting hard"
            break
        case 20:
            deslocamento = 9
            nivel = "damn, it's too fast!"
            break
        case 25:
            deslocamento = 10
            nivel = "watch out!"
            break
        case 40:
            deslocamento = 13
            nivel = "that's impossible"
            break
        case 45:
            deslocamento = 15
            nivel = "amazing!"
            break
    }

    return [deslocamento, nivel]
}

function estaoSobrepostos(elementoA, elementoB) {
    const a = elementoA.getBoundingClientRect()
    const b = elementoB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left
        && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top
        && b.top + b.height >= a.top
    return horizontal && vertical
}

function colidiu(passaro, barreiras) {
    let colidiu = false
    barreiras.pares.forEach(parDeBarreiras => {
        if (!colidiu) {
            const superior = parDeBarreiras.superior.elemento
            const inferior = parDeBarreiras.inferior.elemento
            colidiu = estaoSobrepostos(passaro.elemento, superior)
                || estaoSobrepostos(passaro.elemento, inferior)
        }
    })
    return colidiu
}

new FlappyBird().start()