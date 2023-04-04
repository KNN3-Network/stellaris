import axios from "axios";
import { baseURL } from "../config";

export default async function log(event: string, address: string) {
  return await axios.post(`${baseURL}/v1/trace`, {
    event,
    address,
    url: window.location.href,
  });
}
