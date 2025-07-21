import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
  token:"skhbDEKwFvigAnviMdXcucnucQWsKOeZCyIYLX7em4ZtnmL76L11cKD35siuSX3uRApooHQaLGU9yZvQyH6mxrnghCttuugVWmNAALcN0VY4CdYhi6QPGagfA9ESXCBU2ewaryI6NEmi2OTgQlHnQ6pQxr32jyFwbNNHsTiR5FuuEcrKgBEX"
})
