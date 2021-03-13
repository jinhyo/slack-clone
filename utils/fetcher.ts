import axios from "axios";

function fetcher(url: string) {
  return axios.get(url).then((response) => response.data);
}

export default fetcher;
