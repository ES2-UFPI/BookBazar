import math

def calcula_distancia(latitude1, longitude1, latitude2, longitude2):
    latitude1, longitude1, latitude2, longitude2 = map(math.radians, [latitude1, longitude1, latitude2, longitude2])
    diferenca_latitude = latitude2 - latitude1
    diferenca_longitude = longitude2 - longitude1
    a =  math.sin(diferenca_latitude/2)**2 + math.cos(latitude1) * math.cos(latitude2) * math.sin(diferenca_longitude/2)**2
    c = 2 * math.asin(math.sqrt(a))
    raio = 6371

    return c * raio