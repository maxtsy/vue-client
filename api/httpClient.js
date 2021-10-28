import axios from "axios";

const VUE_APP_BASE_HOST = OMInsurance.host;
const VUE_APP_BASE_PATH = OMInsurance.path;

const httpClient = axios.create({
  baseURL: VUE_APP_BASE_HOST + VUE_APP_BASE_PATH,
  headers: {
    "Content-Type": "application/json",
  },
});

/* httpClient.interceptors.response.use(function(response) {
  try {
    if (response.data) {
      console.log(response.json())
      response.data = JSON.parse(response.data);
    }
  } catch (data) {
    throw new Error(
      `[httpClient] Error parsing response JSON data - ${JSON.stringify(error)}`
    );
  }

  return response;
}); */

export default httpClient;
