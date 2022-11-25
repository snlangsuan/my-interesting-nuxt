export const dotp = (x, y) => {
  const dotpSum = (a, b) => {
    return a + b
  }
  const dotpTimes = (a, i) => {
    return x[i] * y[i]
  }

  return x.map(dotpTimes).reduce(dotpSum, 0)
}
export const cosineSimilarity = (a, b) => {
  const similarity = dotp(a, b) / (Math.sqrt(dotp(a, a)) * Math.sqrt(dotp(b, b)))
  return similarity
}
