function mostrarMensajeLCD (sensorValor: number) {
    if (encendido == 1) {
        makerbit.clearLcd1602()
        if (sensorValor >= 700) {
            music.stopAllSounds()
            music.play(music.createSoundExpression(
            WaveShape.Triangle,
            2735,
            2735,
            102,
            107,
            1500,
            SoundExpressionEffect.Tremolo,
            InterpolationCurve.Linear
            ), music.PlaybackMode.InBackground)
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
}
function apagar_dispositivos () {
    basic.clearScreen()
    encendido = 0
    basic.pause(1000)
    makerbit.clearLcd1602()
    makerbit.showStringOnLcd1602("Apagando...", makerbit.position1602(LcdPosition1602.Pos1), 15)
    basic.pause(2000)
    basic.showLeds(`
        . . # . .
        # . # . #
        # . # . #
        # . . . #
        # # # # #
        `)
    makerbit.clearLcd1602()
    makerbit.setLcdBacklight(LcdBacklight.Off)
    music.stopAllSounds()
    pins.servoWritePin(AnalogPin.P2, 0)
    pins.analogWritePin(AnalogPin.P3, 0)
}
input.onButtonPressed(Button.A, function () {
    if (encendido == 0) {
        inicializar_dispositivos()
    }
})
input.onButtonPressed(Button.B, function () {
    if (encendido == 1) {
        apagar_dispositivos()
    }
})
function inicializar_dispositivos () {
    basic.clearScreen()
    basic.pause(1000)
    makerbit.connectLcd(39)
    basic.pause(500)
    makerbit.setLcdBacklight(LcdBacklight.On)
    makerbit.clearLcd1602()
    makerbit.showStringOnLcd1602("Iniciando...", makerbit.position1602(LcdPosition1602.Pos1), 15)
    basic.pause(2000)
    encendido = 1
}
let servoSprinklerAngle = 0
let encendido = 0
let sensorValor = 0
let servoSprinklerDirection = 1
let servoSprinklerStep = 2
music.setVolume(138)
apagar_dispositivos()
basic.forever(function () {
    if (encendido == 1) {
        makerbit.showStringOnLcd1602("" + (sensorValor), makerbit.position1602(LcdPosition1602.Pos30), 4)
    }
})
basic.forever(function () {
    if (encendido == 1) {
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
            basic.showIcon(IconNames.Sad)
            basic.pause(1500)
        }
        basic.pause(1000)
    }
})
basic.forever(function () {
    if (encendido == 1) {
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
    }
})
basic.forever(function () {
    if (encendido == 1) {
        sensorValor = pins.analogReadPin(AnalogPin.P3)
        mostrarMensajeLCD(sensorValor)
    }
})
