""" 
Este script sirve para calcular los estadisticos del perfil de fertilizacion.
Los resultados que se arrojan aca, se pasan al suite de test del modulo de la app.
"""


def get_profile_stats(data, t, p):
    if len(data) == 0:
        return None
    s = sum(data)
    avg = s / len(data)
    diff_sq = [(x - avg) ** 2 for x in data]    
    std_dev = (sum(diff_sq) / (len(data)-1)) ** 0.5
    dose = avg/p/t*10    
    cv = std_dev / avg * 100
    return (dose, avg, std_dev, cv)
    

if __name__ == '__main__':
    all_test_cases = [
        {
            "name": "10 muestras, ida y vuelta, s bajo",
            "data": [4,4,4,5,7,7,5,4,4,4],
            "t": 0.4,
            "p": 2
        },
        {
            "name": "10 muestras, circular, s bajo",
            "data": [5,4,3,5,7,7,5,5,4,3],
            "t": 0.4,
            "p": 2
        },
        {
            "name": "10 muestras, ida y vuelta, s alto",
            "data": [10,9,8,8,9,10,9,9,10,9],
            "t": 0.4,
            "p": 2
        },
        {
            "name": "10 muestras, circular, s alto",
            "data": [10,9,8,9,10,9,8,9,10,9],
            "t": 0.4,
            "p": 2
        },
        {
            "name": "15 muestras, ida y vuelta, s bajo",
            "data": [3,4,3,4,6,6,7,9,7,6,5,5,3,4,3],
            "t": 0.4,
            "p": 2
        },
        {
            "name": "15 muestras, circular, s bajo",
            "data": [4,4,2,4,6,6,7,9,7,6,5,5,4,4,2],
            "t": 0.4,
            "p": 2
        },
        {
            "name": "15 muestras, ida y vuelta, s alto",
            "data": [11,13,9,10,12,10,9,13,11,11,10,11,11,13,9],
            "t": 0.4,
            "p": 2
        },
        {
            "name": "15 muestras, circular, s alto",
            "data": [11,13,9,10,11,11,11,13,9,10,11,11,11,13,9],
            "t": 0.4,
            "p": 2
        },
        {
            "name": "18 muestras, ida y vuelta, s bajo",
            "data": [5,5,6,5,5,6,7,7,9,8,8,7,5,7,6,6,6,7],
            "t": 0.4,
            "p": 2
        },
        {
            "name": "18 muestras, circular, s bajo",
            "data": [5,6,6,5,7,6,7,7,9,8,8,7,5,5,6,6,5,7],
            "t": 0.4,
            "p": 2
        },
        {
            "name": "18 muestras, ida y vuelta, s alto",
            "data": [10,13,10,10,11,11,10,10,13,10,11,11,10,10,11,11,10,13],
            "t": 0.4,
            "p": 2
        },
        {
            "name": "18 muestras, circular, s alto",
            "data": [11,12,11,10,10,11,11,10,11,12,11,10,10,11,11,10,11,12],
            "t": 0.4,
            "p": 2
        },
    ]

    for test_case in all_test_cases:
        print(get_profile_stats(test_case["data"], test_case["t"], test_case["p"]))
