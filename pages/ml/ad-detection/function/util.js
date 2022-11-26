import { similarity } from 'ml-distance'
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
  // const similarity = dotp(a, b) / (Math.sqrt(dotp(a, a)) * Math.sqrt(dotp(b, b)))
  return similarity.cosine(a, b)
}

// export const eucDistance = (a, b) => {
//   return a
//       .map((x, i) => Math.abs( x - b[i] ) ** 2) // square the difference
//       .reduce((sum, now) => sum + now) // sum
//       ** (1/2)
// }

// export const eucSimilarity = (a, b) => {
//   const similarity = distance.euclidean(a, b)
//   console.log(similarity)
//   return 1 / (1 + similarity)
// }
