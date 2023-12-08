import pdo

# Возврщает бит числа (сам байт и номер бита от 0 до 7) начиная с младшего
def getBit(byte: int, ind: int) -> bool:
    return ((byte & (1 << (7 - ind))) >> (7 - ind)) and True

# Сравнивает два байта выдает строку в которой видно что поменялось
def compareByte(b1: int, b2: int) -> (str,str):
    s = ""
    for i in range(8):
        d1 = getBit(b1, i)
        d2 = getBit(b2, i)

        if d1 != d2:
            s += str(int(d2))
        else:
            s += "-"
    return s
# Сравнивает два PDO, выводит что изменилось
def compare(pdo1: pdo.PDO, pdo2: pdo.PDO, pdoName: str):
    for i in range(8):
        b1 = pdo1.get(i)
        b2 = pdo2.get(i)
        if b1 != b2:
            print(f"PDO {pdoName} Byte {i} {compareByte(b1, b2)}")

