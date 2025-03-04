import axios from '@/utils/axios'
export const getAccountList = () => axios.get('/type/list')
export const getBillList = ({ date, type_id, page, page_size }) =>
  axios.get('/bill/list', {
    params: {
      date,
      type_id,
      page,
      page_size,
    },
  })
export const addBillList = (data) => axios.post('/bill/add', data)
// export const getAccountDetail = (id) => axios.get('/bill/detail', { params: { id } })
export const getAccountDetail = (id) => axios.get(`/bill/detail?id=${id}`)
export const deleteAccountDetail = (id) => axios.post('/bill/delete', { id })
export const updateAccountDetail = (data) => axios.post('/bill/update', data)
export const getAccountDate = (date) => axios.get(`/bill/data?date=${date}`)
