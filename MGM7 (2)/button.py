# Пустой обработчик события
def empty(self):
    pass

# Класс позволяющий работать с кнопками на джойстике
class Button:

    def __init__(self):
        self.state = False
        self.status = False
        self.id = 0
        self.__onstatuschange = empty
        self.__onstatechange = empty
    # Задается уникальный идентификатор кнопки
    def setID(self, id: int) -> None:
        self.id = id
    # Задается значение кнопки
    # Возвращает и вызывает обработчик ексли значение поменялось
    def setState(self, state: bool) -> bool:
        ret = self.state != state
        self.state = state
        if ret:
            self.__onstatechange(self)
        return ret
    # Задается статус кнопки (доступна или нет на данном джойстике)
    # Возвращает и вызывает обработчик если значение поменялось
    def setStatus(self, status: bool) -> bool:
        ret = self.status != status
        self.status = status
        if ret:
            self.__onstatuschange(self)
        return ret

    # Задание обработчиков событий
    def onStatusChanged(self, callback):
        self.__onstatuschange = callback

    def onStateChanged(self, callback):
        self.__onstatechange = callback

    def __str__(self):
        return format(self)

    def __format__(self, format_spec):
        return f"pushed:{self.state} available: {self.status}"

