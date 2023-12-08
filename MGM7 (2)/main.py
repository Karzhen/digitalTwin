import asyncio

import js1 as js
import mcan
import pdo
import leveraxis
import serial
# Собственно джойстик
js1: js.JS1

# Вызывается при нажатие кнопки
def buttonStateChanged(button):
    print(f"Button {button.id} pushed: {button.state}")

# Вызывается когда кнопка доступна (если она существует на рукоятке)
def buttonStatusChanged(button):
    print(f"Button {button.id} available: {button.state}")

# Вызывается при изменении поворота джойстика по X
def xValueChanged(x):
    print(f"X value: {x.value}")

# Вызывается при повороте джойстика по Y
def yValueChanged(y):
    print(f"Y value: {y.value}")

#Вызывается при изменении статуса оси X
def onXStatusChanged(wheel: leveraxis.LeverAxis):
    print(f"X: {wheel.status}")

#Вызывается при изменении статуса оси Y
def onYStatusChanged(wheel: leveraxis.LeverAxis):
    print(f"Y: {wheel.status}")

#Вызывается при изменении статуса колесика на джойстике X (колесико 1)
def onXWheelStatusChanged(wheel: leveraxis.LeverAxis):
    print(f"X Wheel:", wheel.status)

#Вызывается при изменении статуса колесика на джойстике Y (колесико 2)
def onYWheelStatusChanged(wheel: leveraxis.LeverAxis):
    print(f"Y Wheel:", wheel.status)

#Вызывается при изменении отклонения колесика на джойстике Y (колесико 2)
def onYWheelValueChanged(wheel: leveraxis.LeverAxis):
    print(f"Y Wheel: {wheel.value}")

#Вызывается при изменении отклонения колесика на джойстике X (колесико 1)
def onXWheelValueChanged(wheel: leveraxis.LeverAxis):
    print(f"X Wheel: {wheel.value}")






def main():
    # Создаем обработчик джойстика
    js1 = js.JS1(pdo.createEmpty(), pdo.createEmpty(), pdo.createEmpty())
    # Задаем обработчики событий
    js1.x.onValueChanged(xValueChanged)
    js1.y.onValueChanged(yValueChanged)

    # initialize X axis
    js1.x.onStatusChanged(onXStatusChanged)
    js1.y.onStatusChanged(onYStatusChanged)

    js1.x_wheel.onStatusChanged(onXWheelStatusChanged)
    js1.y_wheel.onStatusChanged(onYWheelStatusChanged)
    js1.x_wheel.onValueChanged(onXWheelValueChanged)
    js1.y_wheel.onValueChanged(onYWheelValueChanged)
    js1.button.onStateChanged(buttonStateChanged)
    # добавляем обработчики для каждого PDO от джойстика
    # всего их 3 и одно (0x755) служебное (показывает что джойстик жив)
    mcan.onPDO(0x1D5, lambda msg: js1.setPDO1(pdo.PDO(msg.data))) # parsing PDO1
    mcan.onPDO(0x2D5, lambda msg: js1.setPDO2(pdo.PDO(msg.data))) # parsing PDO2
    mcan.onPDO(0x3D5, lambda msg: js1.setPDO3(pdo.PDO(msg.data))) # parsing PDO3
    mcan.onPDO(0x755, lambda msg: js1.onHeartbeat()) # parsing heartbeat
    # если пришло неизвестное pdo то печатаем его id
    mcan.onUnknownPDO(lambda msg: print(f"UNKNOWN PDO {msg.arbitration_id}"))
    # работать, СAN
    mcan.execute()


main()
