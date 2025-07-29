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
let contador_errores = 0
let sensorEstado = 0
let servoSprinklerDirection = 1
let servoSprinklerStep = 2
inicializar_dispositivos()
basic.showString("LISTO!")
basic.pause(1000)
basic.forever(function () {
    sensorEstado = pins.digitalReadPin(DigitalPin.P4)
    if (sensorEstado == 1) {
        contador_errores += 1
        makerbit.clearLcd1602()
        if (contador_errores > 5) {
            music.play(music.createSoundExpression(WaveShape.Triangle, 2735, 2691, 44, 26, 1000, SoundExpressionEffect.Tremolo, InterpolationCurve.Linear), music.PlaybackMode.LoopingInBackground)
            makerbit.showStringOnLcd1602("Error sensor!", makerbit.position1602(LcdPosition1602.Pos1), 15)
            makerbit.showStringOnLcd1602("Revisar conexion", makerbit.position1602(LcdPosition1602.Pos17), 20)
            basic.pause(3000)
            contador_errores = 0
        } else {
            makerbit.showStringOnLcd1602("Examinando nivel", makerbit.position1602(LcdPosition1602.Pos1), 20)
            makerbit.showStringOnLcd1602("de humedad", makerbit.position1602(LcdPosition1602.Pos17), 20)
            basic.pause(200)
            makerbit.showStringOnLcd1602(".", makerbit.position1602(LcdPosition1602.Pos27), 1)
            basic.pause(200)
            makerbit.showStringOnLcd1602(".", makerbit.position1602(LcdPosition1602.Pos28), 1)
            basic.pause(200)
            makerbit.showStringOnLcd1602(".", makerbit.position1602(LcdPosition1602.Pos29), 1)
            basic.pause(1000)
        }
    } else {
        contador_errores = 0
        makerbit.clearLcd1602()
        makerbit.showStringOnLcd1602("Humedad detectada", makerbit.position1602(LcdPosition1602.Pos1), 20)
        basic.pause(2000)
        music.play(music.createSoundExpression(WaveShape.Triangle, 2735, 2691, 41, 23, 1000, SoundExpressionEffect.Tremolo, InterpolationCurve.Linear), music.PlaybackMode.LoopingInBackground)
        makerbit.clearLcd1602()
        makerbit.showStringOnLcd1602("Nivel de agua:", makerbit.position1602(LcdPosition1602.Pos1), 20)
        makerbit.showStringOnLcd1602("insuficiente", makerbit.position1602(LcdPosition1602.Pos17), 14)
        basic.pause(1000)
        makerbit.clearLcd1602()
        makerbit.showStringOnLcd1602("Necesito agua!", makerbit.position1602(LcdPosition1602.Pos1), 20)
        makerbit.showStringOnLcd1602(":(", makerbit.position1602(LcdPosition1602.Pos17), 25)
        basic.pause(1000)
    }
    if (sensorEstado == 1) {
        basic.showIcon(IconNames.Asleep)
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
    if (sensorEstado == 0) {
        servoSprinklerAngle += servoSprinklerStep * servoSprinklerDirection
        pins.servoWritePin(AnalogPin.P2, servoSprinklerAngle)
        pins.servoWritePin(AnalogPin.P3, servoSprinklerAngle)
        if (servoSprinklerAngle >= 180) {
            servoSprinklerDirection = -1
        }
        if (servoSprinklerAngle <= 0) {
            servoSprinklerDirection = 1
        }
        basic.pause(30)
    } else {
        pins.servoWritePin(AnalogPin.P2, 0)
        pins.servoWritePin(AnalogPin.P3, 0)
        basic.pause(200)
    }
    basic.pause(1000)
})
