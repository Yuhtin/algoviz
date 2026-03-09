// src/algorithms/two-sum/code.ts
export const pythonCode = `def twoSum(nums, target):
    hashMap = {}

    for i, num in enumerate(nums):
        complement = target - num

        # Verifica se complemento existe
        if complement in hashMap:
            return [hashMap[complement], i]

        # Adiciona numero atual ao hash map
        hashMap[num] = i

    return None  # Nenhum par encontrado`
