import axios from 'axios';

export const http = (base?: string) => {
  const baseURL = base ?? 'http://127.0.0.1:3021';
  // const storeUser = useStoreUser();

  return axios.create({
    baseURL,
    // headers: {
    //   Authorization: `Bearer ${storeUser.token}`
    // }
  });
};