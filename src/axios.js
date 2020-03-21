// axios
import axios from 'axios'

// const baseURL = "https://video-api.basma.ai"
// const baseURL = "http://localhost:1061"
const baseURL = "https://3cf5a986.ngrok.io"

export default axios.create({
  baseURL: baseURL
  // You can add your headers here
})
