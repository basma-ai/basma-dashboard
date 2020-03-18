// axios
import axios from 'axios'

const baseURL = "https://video-api.basma.ai"
// const baseURL = "http://localhost:1061"

export default axios.create({
  baseURL: baseURL
  // You can add your headers here
})
