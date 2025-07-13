function i2c_start () {
    pins.digitalWritePin(SDA_PIN, 1)
    pins.digitalWritePin(SCL_PIN, 1)
    basic.pause(1)
    pins.digitalWritePin(SDA_PIN, 0)
    basic.pause(1)
    pins.digitalWritePin(SCL_PIN, 0)
    basic.pause(1)
}
function i2c_write_byte (data: number) {
    for (let i = 0; i <= 7; i++) {
        i2c_write_bit((data >> (7 - i)) & 1)
    }
    return i2c_read_bit()
}
function i2c_read_byte (ack: number) {
    data = 0
    for (let index = 0; index < 8; index++) {
        data = (data << 1) | i2c_read_bit()
    }
    i2c_write_bit(ack)
    return data
}
function leer_chirp_humedad () {
    i2c_start()
    if (i2c_write_byte(CHIRP_ADDR << 1) != 0) {
        i2c_stop()
        return -1
    }
    if (i2c_write_byte(0) != 0) {
        i2c_stop()
        return -1
    }
    i2c_start()
    if (i2c_write_byte((CHIRP_ADDR << 1) | 1) != 0) {
        i2c_stop()
        return -1
    }
    high = i2c_read_byte(0)
    low = i2c_read_byte(1)
    i2c_stop()
    return (high << 8) | low
}
function i2c_read_bit () {
    pins.digitalWritePin(SDA_PIN, 1)
    basic.pause(1)
    pins.digitalWritePin(SCL_PIN, 1)
    basic.pause(1)
    bit = pins.digitalReadPin(SDA_PIN)
    pins.digitalWritePin(SCL_PIN, 0)
    basic.pause(1)
    return bit
}
function i2c_write_bit (bit: number) {
    pins.digitalWritePin(SDA_PIN, bit)
    basic.pause(1)
    pins.digitalWritePin(SCL_PIN, 1)
    basic.pause(1)
    pins.digitalWritePin(SCL_PIN, 0)
    basic.pause(1)
}
function i2c_stop () {
    pins.digitalWritePin(SDA_PIN, 0)
    pins.digitalWritePin(SCL_PIN, 1)
    basic.pause(1)
    pins.digitalWritePin(SDA_PIN, 1)
    basic.pause(1)
}
let humedad = 0
let bit = 0
let SCL_PIN = 0
let SDA_PIN = 0
let low = 0
let high = 0
let data = 0
SDA_PIN = DigitalPin.P2
SCL_PIN = DigitalPin.P1
let CHIRP_ADDR = 32
makerbit.setLcdBacklight(LcdBacklight.On)
makerbit.clearLcd1602()
makerbit.connectLcd(39)
pins.digitalWritePin(SCL_PIN, 1)
pins.digitalWritePin(SDA_PIN, 1)
basic.showString("INICIANDO...")
basic.pause(9000)
basic.forever(function () {
    humedad = leer_chirp_humedad()
    makerbit.clearLcd1602()
    if (humedad == -1) {
        makerbit.clearLcd1602()
        makerbit.showStringOnLcd1602("Examinando nivel", makerbit.position1602(LcdPosition1602.Pos1), 20)
        makerbit.showStringOnLcd1602("de humedad", makerbit.position1602(LcdPosition1602.Pos17), 20)
        basic.pause(200)
        makerbit.showStringOnLcd1602(".", makerbit.position1602(LcdPosition1602.Pos27), 1)
        basic.pause(200)
        makerbit.showStringOnLcd1602(".", makerbit.position1602(LcdPosition1602.Pos28), 1)
        basic.pause(200)
        makerbit.showStringOnLcd1602(".", makerbit.position1602(LcdPosition1602.Pos29), 1)
        basic.pause(1000)
    } else {
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
            makerbit.clearLcd1602()
            basic.showIcon(IconNames.Happy)
            basic.pause(1500)
        }
    }
    basic.pause(2000)
})
