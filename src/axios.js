// axios
import axios from 'axios'

const baseURL = "https://video-api.basma.ai"

export default axios.create({
  baseURL: baseURL
  // You can add your headers here
})
