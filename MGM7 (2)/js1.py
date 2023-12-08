import button
import pdo
import pdo as p
import leveraxis
import utills

# Возвращает бит числа под номером
def getBit(number, ind):
    return (number & (1 << ind)) >> ind

# Берется старшая пара бит
def getFirstPair(number):
    return (number & 0b11000000) >> 6

# Берется вторая пара бит
def getSecondPair(number):
    return (number & 0b00110000) >> 4

# Берется препоследняя пара бит
def getThirdPair(number):
    return (number & 0b00001100) >> 2

# Берется младшая пара бит из байта
def getForthPair(number):
    return (number & 0b00000011) >> 0

# Из двух байт делаем знаковое 16 битное число
def combine_signed(n1, n2):
    return int.from_bytes([n1, n2], byteorder='little', signed=True)

# Пустое PDO
emptyPDO = p.PDO(data=[0, 0, 0, 0, 0, 0, 0, 0])


class JS1:

    def __init__(self, pdo1, pdo2, pdo3):
        # Инициализируем все значения пустыми
        self.pdo = [pdo.createEmpty()] * 3
        # Кнопка на джойстике
        self.button: button.Button = button.Button()
        # Перемещение джойстика по X
        self.x = leveraxis.LeverAxis()

        #Перемещение джойстика по Y
        self.y = leveraxis.LeverAxis()

        # Колесико горизонтальное на рукоятке
        self.x_wheel = leveraxis.LeverAxis()
        # Колесико вертикальное на рукоятке
        self.y_wheel = leveraxis.LeverAxis()
        self.pdo[0] = pdo1
        self.pdo[1] = pdo2
        self.pdo[2] = pdo3

    def __str__(self):
        return format(self)

    def __format__(self, format_spec):
        s = "JS1:\nX:"
        s += str(self.x)
        s += "\nY:"
        s += str(self.y)

        s += f"Wheel X: {str(self.x_wheel)}\n"
        s += f"Wheel Y: {str(self.y_wheel)}\n"
        s += f"Button : {str(self.button)}\n"
        return s
    # Ничего не делаем если пришло сообщение от джойстика
    # Если пришло значит он в сети
    # Можно выдавать оповещение что джойстик отключен если он не подает сигналы какое-то время
    def onHeartbeat(self):
        pass
    # Парсинг PDO №1
    def setPDO1(self, pdo: pdo.PDO):
        # состояние кнопки находится в 0 бите 1 байта
        self.button.setState(utills.getBit(pdo.get(1), 0))
        # значение Y положительно?
        yPositive = utills.getBit(pdo.get(2), 1)
        # значение Y отрицательно?
        yNegative = utills.getBit(pdo.get(2), 0)
        # значение X отрицательно?
        xNegative = utills.getBit(pdo.get(2), 2)
        # значение X положительно?
        xPositive = utills.getBit(pdo.get(2), 3)
        # Обновляем значения
        self.x.setState(xNegative, xPositive)
        self.y.setState(yNegative, yPositive)

        # аналогично для двух колесиков на ручке
        y_wheel_negative = utills.getBit(pdo.get(1), 6)
        y_wheel_positive = utills.getBit(pdo.get(1), 7)

        x_wheel_negative = utills.getBit(pdo.get(1), 2)
        x_wheel_positive = utills.getBit(pdo.get(1), 1)

        self.x_wheel.setState(x_wheel_negative, x_wheel_positive)
        self.y_wheel.setState(y_wheel_negative, y_wheel_positive)
    #Парсинг PDO №2
    def setPDO2(self, pdo: p.PDO):
        # X джойстика – байт 0 и 1
        # Y джойстика – байт 2 и 3
        # делаем из двух байт – одно 16 битное знаковое
        x = combine_signed(pdo.get(0), pdo.get(1))
        y = combine_signed(pdo.get(2), pdo.get(3))
        self.x.setValue(x)
        self.y.setValue(y)
        return True
    # Парсинг PDO №3
    def setPDO3(self, pdo: p.PDO) -> None:
        #положение колесика X – 4 и 5 байт
        # из двух байт делаем 16 битное значение со знаком
        x_wheel = combine_signed(pdo.get(4), pdo.get(5))
        # для положение колесика Y аналогично
        # почему то оно в другое сторону считается
        # поэтому берем значение с обратеым знаком
        y_wheel = -combine_signed(pdo.get(2), pdo.get(3))
        # задаем значение
        self.x_wheel.setValue(x_wheel)
        self.y_wheel.setValue(y_wheel)
        #обновляем pdo
        self.pdo[2] = pdo
