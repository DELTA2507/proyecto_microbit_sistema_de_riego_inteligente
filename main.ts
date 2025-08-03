function mostrarMensajeLCD (sensorValor: number) {
    makerbit.clearLcd1602()
    if (sensorValor >= 700) {
        music.stopAllSounds()
        music.play(music.createSoundExpression(WaveShape.Triangle, 2735, 2691, 102, 98, 500, SoundExpressionEffect.Tremolo, InterpolationCurve.Linear), music.PlaybackMode.LoopingInBackground)
        makerbit.showStringOnLcd1602("Nivel de agua:", makerbit.position1602(LcdPosition1602.Pos1), 20)
        makerbit.showStringOnLcd1602("insuficiente", makerbit.position1602(LcdPosition1602.Pos17), 14)
        basic.pause(1500)
        makerbit.clearLcd1602()
        makerbit.showStringOnLcd1602("Necesito agua!", makerbit.position1602(LcdPosition1602.Pos1), 20)
        makerbit.showStringOnLcd1602(":(", makerbit.position1602(LcdPosition1602.Pos17), 25)
        basic.pause(1500)
    } else {
        music.stopAllSounds()
        makerbit.showStringOnLcd1602("Nivel de agua:", makerbit.position1602(LcdPosition1602.Pos1), 20)
        makerbit.showStringOnLcd1602("Óptimo", makerbit.position1602(LcdPosition1602.Pos17), 20)
        basic.pause(1500)
        makerbit.clearLcd1602()
        makerbit.showStringOnLcd1602("Estoy hidratada!", makerbit.position1602(LcdPosition1602.Pos1), 20)
        makerbit.showStringOnLcd1602(":)", makerbit.position1602(LcdPosition1602.Pos17), 20)
        basic.pause(1500)
    }
}
function inicializar_dispositivos () {
    basic.pause(1000)
    makerbit.connectLcd(39)
    basic.pause(500)
    makerbit.setLcdBacklight(LcdBacklight.On)
    makerbit.clearLcd1602()
    makerbit.showStringOnLcd1602("Iniciando...", makerbit.position1602(LcdPosition1602.Pos1), 15)
    basic.pause(2000)
    makerbit.clearLcd1602()
    makerbit.showStringOnLcd1602("Conectando sensor", makerbit.position1602(LcdPosition1602.Pos1), 20)
    basic.pause(1000)
}
let servoSprinklerAngle = 0
let sensorValor = 0
music.setVolume(100)
let servoSprinklerDirection = 1
let servoSprinklerStep = 2
inicializar_dispositivos()
basic.forever(function () {
    makerbit.showStringOnLcd1602("" + (sensorValor.toString()), makerbit.position1602(LcdPosition1602.Pos30), 4)
    basic.pause(500)
})
basic.forever(function () {
    sensorValor = pins.analogReadPin(AnalogPin.P3)
    mostrarMensajeLCD(sensorValor)
    basic.pause(1000)
    if (sensorValor < 700) {
        basic.showIcon(IconNames.Happy)
        basic.pause(1600)
    } else {
        basic.showLeds(`
            . . # . .
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            `)
        basic.pause(100)
        basic.showLeds(`
            . . # . .
            . # . # .
            . . # . .
            . . . . .
            . . . . .
            `)
        basic.pause(100)
        basic.showLeds(`
            . . # . .
            . . # . .
            . # . # .
            # . . . #
            . # # # .
            `)
        basic.pause(100)
        basic.showLeds(`
            . . . . .
            . . # . .
            . # # # .
            # # # # #
            . # # # .
            `)
        basic.pause(100)
        basic.showLeds(`
            . . . . .
            . . . . .
            . . # . .
            # # # # #
            . # # # .
            `)
        basic.pause(100)
        basic.showLeds(`
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            . . # . .
            `)
        basic.pause(1000)
        basic.showIcon(IconNames.Happy)
        basic.pause(1500)
    }
    basic.pause(1000)
})
basic.forever(function () {
    if (sensorValor > 700) {
        servoSprinklerAngle += servoSprinklerStep * servoSprinklerDirection
        pins.servoWritePin(AnalogPin.P2, servoSprinklerAngle)
        if (servoSprinklerAngle >= 180) {
            servoSprinklerDirection = -1
        }
        if (servoSprinklerAngle <= 0) {
            servoSprinklerDirection = 1
        }
    } else {
        pins.servoWritePin(AnalogPin.P2, 0)
    }
    basic.pause(30)
})
