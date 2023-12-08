# Класс имплементирующий PDO
class PDO:
    # Инициализируем 0
    def __init__(self, data):
        self.data = [0, 0, 0, 0, 0, 0, 0, 0]
        for i in range(8):
            self.data[i] = data[i]
    # Выдает байт по индексу
    def get(self, ind):
        return self.data[ind]
    # Устаналивает байт по индексу
    def set(self, ind, val):
        self.data[ind] = val

    def __format__(self, format_spec):
        s = ""
        for i in range(8):
            s += hex(self.data[i])
            s += ', '
        return s[:-2]
        #return f"{self.data[0]}, {self.data[1]}, {self.data[2]}, {self.data[3]}, {self.data[4]}, {self.data[5]}, {self.data[6]}, {self.data[7]}"

    def __str__(self):
        return format(self)

#Создаем пустое PDO
def createEmpty() -> PDO:
    return PDO(data=([0] * 8))

# Копируем PDO по значению а не ссылке
def copy(pdo: PDO) -> PDO:
    new_pdo = createEmpty()
    for i in range(8):
        new_pdo.set(i,  pdo.get(i))
    return new_pdo
