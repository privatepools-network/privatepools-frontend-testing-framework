import axiosInstance from '@/lib/helpers/axios'
import { jsonToGraphQLQuery } from 'json-to-graphql-query'

export default async function useGraphQLQuery(url, query) {
  if (typeof query != 'string') {
    query = jsonToGraphQLQuery({ query })
  }
  try {
    const {
      data: { data },
    } = await axiosInstance.post(url, { query })
    return data
  } catch (error) {
    console.log(error)
  }
}
