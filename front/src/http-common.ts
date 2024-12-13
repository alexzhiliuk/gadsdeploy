import axios from "axios";

export default axios.create({
  baseURL: "https://fakestoreapi.com/products",
  headers: {
    "Content-type": "application/json"
  }
});