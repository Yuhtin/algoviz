// src/algorithms/bubble-sort/code.ts
export const pythonCode = `def bubbleSort(array):
    n = len(array)

    for i in range(n - 1):
        swapped = False

        for j in range(n - i - 1):
            # Compara elementos adjacentes
            if array[j] > array[j + 1]:
                # Troca se fora de ordem
                array[j], array[j + 1] = array[j + 1], array[j]
                swapped = True

        # Otimizacao: para se nenhuma troca
        if not swapped:
            break

    return array`
