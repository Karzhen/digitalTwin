import can
import pdo
import copy
# Храним обработчики PDO
callbacks = {}
def empty(msg):
    pass
#По умолчанию ничего не делаем если приходит неизвестное pdo
on_unknown_pdo = empty
# Как придет ПДО - вызываем функцию обратного вызова
def onPDO(cob_id: int, callback):
    callbacks[cob_id] = callback
# Обработчик если пришло неизвестное PDO
def onUnknownPDO(callback):
    on_unknown_pdo = callback

# Работа CAN
def execute():
    #Создаем КЭН шину
    bus = can.Bus(interface='ixxat', bitrate='250000', channel='0')
    # Все время
    while True:
        # Получаем сообщение
        bus.recv()
        # Смотрим есть ли ПДО в шине
        for msg in bus:
            # Вызываем нужный обработчик PDO
            cob_id = msg.arbitration_id
            if cob_id in callbacks:
                callbacks[cob_id](msg)
            else:
                onUnknownPDO(msg)
