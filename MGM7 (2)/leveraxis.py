# pragma once
# include "iostream"
from copy import copy
# Константы для определения положения в котором находится колесико либо сам джойстик
NEGATIVE = -1
NEUTRAL = 0
POSITIVE  = 1
ERROR = 2

# Класс хранящий данные о статусе оси
class AxisStatus:
    def __init__(self, value):
        self.value = value

    def __str__(self):
        return format(self)

    def __format__(self, format_spec):
        if self.value == NEGATIVE:
            return "NEGATIVE"
        elif self.value == NEUTRAL:
            return "NEUTRAL"
        elif self.value == POSITIVE:
            return "POSITIVE"
        elif self.value == ERROR:
            return "ERROR"
        else:
            return "UNKNOWN"

def empty(self):
    pass

#Класс хранящий информацию об оси (статус и значение)
class LeverAxis:

    def __init__(self):
        self.__statuschanged = copy(empty)
        self.__valuechanged = copy(empty)
        self.status: AxisStatus = AxisStatus(NEUTRAL)
        self.value = 0
        self.id = 0
    #Задается статус оси (одно значение) из двух значений (положительный или отрицательный)
    #Возврщается true, если значение поменялось
    def setState(self, negative: bool, positive: bool)->bool:
        status = None
        if positive and negative:
            status = AxisStatus(ERROR)
        elif positive:
            status = AxisStatus(POSITIVE)
        elif negative:
            status = AxisStatus(NEGATIVE)
        else:
            status = AxisStatus(NEUTRAL)

        ret = self.status.value != status.value
        self.status = copy(status)
        if ret:
            self.__statuschanged(self)
        return ret
    # Задается значение ОСИ
    def setValue(self, val):
        ret = self.value != val
        self.value = val
        if ret:
            self.__valuechanged(self)
        return ret
    #Задание функций обратного вызова
    def onStatusChanged(self, callback):
        self.__statuschanged = callback

    def onValueChanged(self, callback):
        self.__valuechanged = callback

    def __str__(self):
        return format(self)

    def __format__(self, format_spec):
        return f"Status: {self.status} value: {self.value}"
