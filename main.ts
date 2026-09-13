// ==========================================
// TORRE INFINITA DE PARKOUR: RESGATE + BOOST
// ==========================================

namespace SpriteKind {
    export const Amigo = SpriteKind.create()
    export const Parede = SpriteKind.create()
    export const BoostItem = SpriteKind.create()
}

// Configuração Visual do Jogador
let jogador = sprites.create(img`
    . . . . . f f f f . . . . . 
    . . . f f 4 4 4 4 f f . . . 
    . . f 4 5 5 5 5 5 5 4 f . . 
    . f 4 5 5 1 f 5 1 5 5 4 f . 
    . f 4 5 5 f f 5 f f 5 5 4 f . 
    . f 4 5 5 5 5 5 5 5 5 5 4 f . 
    . . f 1 1 1 1 1 1 1 1 f . . 
    . . . f f f f f f f f . . . 
    . . . f 6 6 6 6 6 6 f . . . 
    . . f 6 6 6 6 6 6 6 6 f . . 
    . . f 6 f 6 6 6 6 f 6 f . . 
    . . . f . f f f f . f . . . 
    . . . . . f . . f . . . . . 
`, SpriteKind.Player)

controller.moveSprite(jogador, 110, 0)
jogador.ay = 450
scene.cameraFollowSprite(jogador)
jogador.setPosition(80, 100)

let amigosResgatados: Sprite[] = []
let noChao = false
let podePuloDuplo = false

let multiplicadorPontos = 1
let estaComBoost = false

scene.setBackgroundColor(9)
info.setScore(0)

let imagensAmigos = [
    img`
    . . . . . f f f f . . . . . 
    . . . f f 7 7 7 7 f f . . . 
    . . f 7 7 7 7 7 7 7 7 f . . 
    . f 7 7 7 1 f 7 1 7 7 7 f . 
    . f 7 7 7 5 5 7 5 5 7 7 f . 
    . f 7 7 7 7 7 7 7 7 7 7 f . 
    . . f f f f f f f f f f . . 
    . . . f 8 8 8 8 8 8 f . . . 
    . . . f 8 8 8 8 8 8 f . . . 
    . . . . f . . . . f . . . . 
    `,
    img`
    . . . . . f f f f . . . . . 
    . . . f f 5 5 5 5 f f . . . 
    . . f 5 5 5 5 5 5 5 5 f . . 
    . f 5 5 5 1 f 5 1 5 5 5 f . 
    . f 5 5 5 f f 5 f f 5 5 f . 
    . f 5 5 5 5 5 5 5 5 5 5 f . 
    . . f f f f f f f f f f . . 
    . . . f 2 2 2 2 2 2 f . . . 
    . . . f 2 2 2 2 2 2 f . . . 
    . . . . f . . . . f . . . . 
    `,
    img`
    . . . . . f f f f . . . . . 
    . . . f f 3 3 3 3 f f . . . 
    . . f 3 3 3 3 3 3 3 3 f . . 
    . f 3 3 3 1 f 3 1 3 3 3 f . 
    . f 3 3 3 f f 3 f f 3 3 f . 
    . f 3 3 3 3 3 3 3 3 3 3 f . 
    . . f f f f f f f f f f . . 
    . . . f 7 7 7 7 7 7 f . . . 
    . . . f 7 7 7 7 7 7 f . . . 
    . . . . f . . . . f . . . . 
    `
]

let imgPlataforma = img`
    e e e e e e e e e e e e e e e e 
    e 1 1 1 1 1 1 e 1 1 1 1 1 1 1 e 
    e e e e e e e e e e e e e e e e 
`

let imgBoost = img`
    . . . . . . . . . . . . . . . . 
    . . . . . . 5 5 . . . . . . . . 
    . . . . . 5 5 5 5 . . . . . . . 
    . . . . . 5 5 5 5 . . . . . . . 
    . . 5 5 5 5 5 5 5 5 5 5 . . . . 
    . . . 5 5 5 5 5 5 5 5 . . . . . 
    . . . . 5 5 5 5 5 5 . . . . . . 
    . . . . 5 5 . . 5 5 . . . . . . 
    . . . 5 5 . . . . 5 5 . . . . . 
    . . . . . . . . . . . . . . . . 
`

for (let x = 0; x < 160; x += 16) {
    let p = sprites.create(imgPlataforma, SpriteKind.Parede)
    p.setPosition(x + 8, 120)
}

let ultimaAlturaGerada = 100

function gerenciarTorre() {
    while (ultimaAlturaGerada > jogador.y - 160) {
        ultimaAlturaGerada -= Math.randomRange(28, 42)
        let posX = Math.randomRange(20, 140)

        let plat = sprites.create(imgPlataforma, SpriteKind.Parede)
        plat.setPosition(posX, ultimaAlturaGerada)

        let chance = Math.randomRange(1, 100)
        if (chance <= 30) {
            let imgSorteada = imagensAmigos[Math.randomRange(0, imagensAmigos.length - 1)]
            let amigo = sprites.create(imgSorteada, SpriteKind.Amigo)
            amigo.setPosition(posX, ultimaAlturaGerada - 12)
        } else if (chance > 30 && chance <= 45) {
            let boost = sprites.create(imgBoost, SpriteKind.BoostItem)
            boost.setPosition(posX, ultimaAlturaGerada - 12)
        }
    }
}

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (noChao) {
        jogador.vy = -170
        noChao = false
        podePuloDuplo = true
        music.jumpUp.play()
    } else if (podePuloDuplo) {
        jogador.vy = -150
        podePuloDuplo = false
        jogador.startEffect(effects.ashes, 150)
        music.smallCrash.play()
    }
})

game.onUpdate(function () {
    gerenciarTorre()

    let encostandoChao = false
    for (let plat of sprites.allOfKind(SpriteKind.Parede)) {
        if (jogador.overlapsWith(plat)) {
            if (jogador.vy >= 0 && jogador.y <= plat.y - 4) {
                jogador.y = plat.y - 10
                jogador.vy = 0
                encostandoChao = true
            }
        }
    }

    if (encostandoChao) {
        noChao = true
        podePuloDuplo = true
    }

    if (jogador.y > ultimaAlturaGerada + 220) {
        game.over(false, effects.melt)
    }

    let alturaBase = Math.floor((100 - jogador.y) / 10)
    let pontuacaoCalculada = alturaBase * multiplicadorPontos

    if (pontuacaoCalculada > info.score()) {
        info.setScore(pontuacaoCalculada)
    }

    let alvoX = jogador.x
    let alvoY = jogador.y

    for (let i = 0; i < amigosResgatados.length; i++) {
        let seguidor = amigosResgatados[i]

        seguidor.x += (alvoX - seguidor.x) * 0.2
        seguidor.y += (alvoY - seguidor.y) * 0.2

        alvoX = seguidor.x - (controller.dx() < 0 ? -12 : 12)
        alvoY = seguidor.y
    }
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.Amigo, function (player, amigo) {
    amigo.setKind(SpriteKind.Food)
    amigosResgatados.push(amigo)

    music.baDing.play()
    amigo.startEffect(effects.hearts, 400)
    info.changeScoreBy(50 * multiplicadorPontos)
})

// Coleta do Item Boost 2X ajustada para o padrão nativo
sprites.onOverlap(SpriteKind.Player, SpriteKind.BoostItem, function (player, item) {
    item.destroy()
    music.powerUp.play()

    multiplicadorPontos = 2
    estaComBoost = true
    jogador.startEffect(effects.fire, 6000)

    control.runInParallel(function () {
        pause(6000)
        multiplicadorPontos = 1
        estaComBoost = false
    })
})