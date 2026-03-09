// src/algorithms/single-cycle/code.ts
export const pythonCode = `def hasSingleCycle(array):
    n = len(array)
    numElementsVisited = 0
    currentIdx = 0

    while numElementsVisited < n:
        # Se voltamos ao 0 antes de visitar todos
        if numElementsVisited > 0 and currentIdx == 0:
            return False

        numElementsVisited += 1

        # Formula do modulo seguro
        currentIdx = (currentIdx + array[currentIdx]) % n

    # Ciclo unico se voltamos ao indice 0
    return currentIdx == 0`

export const lineHighlights: Record<number, number[]> = {
  0: [1, 2, 3],      // Inicializacao
  1: [5, 6, 7, 8],   // Check early return
  2: [10],           // Incrementa visitados
  3: [13],           // Calcula proximo indice
  4: [16],           // Retorna resultado
}
