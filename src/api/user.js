import axios from '@/utils/axios'
export const useUserRegistr = ({ username, password }) =>
  axios.post('/user/register', { username, password })
export const useUserLogin = ({ username, password }) =>
  axios.post('/user/login', { username, password })
export const getUserInfo = () => axios.get('/user/get_userinfo')
export const changeUserPss = (data) => axios.post('/user/modify_pass', data)
