import { similarity } from 'ml-distance'

export const cosineSimilarity = (a, b) => {
  return similarity.cosine(a, b)
}

