function leer_chirp_humedad () {
    try {
        // Comando para leer humedad del sensor Chirp
        pins.i2cWriteNumber(CHIRP_ADDR, 0, NumberFormat.UInt8BE, false)
        basic.pause(50)  // Reducir pausa
        let humedad_raw = pins.i2cReadNumber(CHIRP_ADDR, NumberFormat.UInt16BE, false)
        return humedad_raw
    } catch {
        return -1
    }
}
function inicializar_dispositivos () {
    // Inicializar LCD primero
    basic.pause(1000)
    // 0x24
    makerbit.connectLcd(36)
    basic.pause(500)
    makerbit.setLcdBacklight(LcdBacklight.On)
    makerbit.clearLcd1602()
    // Mostrar mensaje de inicio
    makerbit.showStringOnLcd1602("Iniciando...", makerbit.position1602(LcdPosition1602.Pos1), 15)
    basic.pause(2000)
    // Probar comunicación con sensor
    makerbit.clearLcd1602()
    makerbit.showStringOnLcd1602("Conectando sensor", makerbit.position1602(LcdPosition1602.Pos1), 20)
    basic.pause(1000)
}
let servoSprinklerAngle = 0
let contador_errores = 0
let humedad = -1
// Dirección del sensor Chirp (verificar que sea correcta)
// 0x20 - confirmar esta dirección
let CHIRP_ADDR = 32
let servoSprinklerDirection = 1
let servoSprinklerStep = 2
// Inicializar todo
inicializar_dispositivos()
basic.showString("LISTO!")
basic.pause(1000)
basic.forever(function () {
    humedad = leer_chirp_humedad()
    if (humedad <= -1) {
        contador_errores += 1
        makerbit.clearLcd1602()
        if (contador_errores > 5) {
            makerbit.showStringOnLcd1602("Error sensor!", makerbit.position1602(LcdPosition1602.Pos1), 15)
            makerbit.showStringOnLcd1602("Revisar conexion", makerbit.position1602(LcdPosition1602.Pos17), 20)
            basic.pause(3000)
            // Reset contador
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
        // Reset si lee correctamente
        contador_errores = 0
        makerbit.clearLcd1602()
        makerbit.showStringOnLcd1602("Humedad: " + humedad, makerbit.position1602(LcdPosition1602.Pos1), 15)
        basic.pause(1000)
        if (humedad < 300) {
            makerbit.clearLcd1602()
            makerbit.showStringOnLcd1602("Nivel de agua:", makerbit.position1602(LcdPosition1602.Pos1), 20)
            makerbit.showStringOnLcd1602("insuficiente", makerbit.position1602(LcdPosition1602.Pos17), 14)
            basic.pause(1000)
            makerbit.clearLcd1602()
            makerbit.showStringOnLcd1602("Necesito agua!", makerbit.position1602(LcdPosition1602.Pos1), 20)
            makerbit.showStringOnLcd1602(":(", makerbit.position1602(LcdPosition1602.Pos17), 25)
            basic.pause(1000)
        } else {
            makerbit.clearLcd1602()
            makerbit.showStringOnLcd1602("Nivel de agua:", makerbit.position1602(LcdPosition1602.Pos1), 20)
            makerbit.showStringOnLcd1602("Óptimo", makerbit.position1602(LcdPosition1602.Pos17), 20)
            basic.pause(1000)
            makerbit.clearLcd1602()
            makerbit.showStringOnLcd1602("Estoy hidratada!", makerbit.position1602(LcdPosition1602.Pos1), 25)
            makerbit.showStringOnLcd1602(":)", makerbit.position1602(LcdPosition1602.Pos17), 25)
            basic.pause(1000)
        }
    }
    basic.pause(2000)
})
basic.forever(function () {
    if (humedad == -1) {
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
        if (humedad < 300) {
            basic.showIcon(IconNames.Sad)
            basic.pause(1500)
        } else {
            basic.showIcon(IconNames.Happy)
            basic.pause(1500)
        }
    }
    basic.pause(2000)
})
basic.forever(function () {
    if (humedad > -1 && humedad < 300) {
        servoSprinklerAngle += servoSprinklerStep * servoSprinklerDirection
        pins.servoWritePin(AnalogPin.P3, servoSprinklerAngle)
        pins.servoWritePin(AnalogPin.P4, servoSprinklerAngle)
        if (servoSprinklerAngle >= 180) {
            servoSprinklerDirection = -1
        }
        if (servoSprinklerAngle <= 0) {
            servoSprinklerDirection = 1
        }
        basic.pause(30)
    } else {
        pins.servoWritePin(AnalogPin.P3, 0)
        pins.servoWritePin(AnalogPin.P4, 0)
        basic.pause(200)
    }
})
