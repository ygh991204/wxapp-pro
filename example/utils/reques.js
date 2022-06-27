
import { createAxios } from '../dist/index'

const axios = createAxios({
  baseUrl: 'https://switch.deovo.com:8001/api/v1/'
})

axios.onRequest(config => {
  return config
})

axios.onResponse(response => {
 return response.data
}, err => {
  console.log(err)
})


export const request = axios.request