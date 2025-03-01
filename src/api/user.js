import axios from '@/utils/axios'
export const useUserRegistr = ({ username, password }) =>
  axios.post('/user/register', { username, password })
export const useUserLogin = ({ username, password }) =>
  axios.post('/user/login', { username, password })
