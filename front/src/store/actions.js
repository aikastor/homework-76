import axiosApi from "../axiosApi";

export const MESSAGES_REQUEST = 'GET_MESSAGES_REQUEST';
export const MESSAGES_SUCCESS = 'GET_MESSAGES_SUCCESS';
export const MESSAGES_FAILURE = 'GET_MESSAGES_FAILURE';

export const SEND_MSG_REQUEST = 'SEND _MSG_ REQUEST';
export const SEND_MSG_SUCCESS = 'SEND_MSG_SUCCESS ';
export const SEND_MSG_ERROR = 'SEND_MSG_ERROR';

export const messagesRequest = () => ({type: MESSAGES_REQUEST});
export const messagesSuccess = (messages) => ({type: MESSAGES_SUCCESS, messages});
export const messagesFailure = (e) => ({type: MESSAGES_FAILURE, e});

export const sendMsgRequest = ()=>({type: SEND_MSG_REQUEST});
export const sendMsgSuccess = () => ({type: SEND_MSG_SUCCESS});
export const sendMessageError = (e) => ({type: SEND_MSG_ERROR, e});

export const loadMessages = (date) => {
  return async (dispatch) => {
    try {
      dispatch (messagesRequest());
      if(date) {
        const response = await axiosApi.get(`/messages?datetime=${date}`);
        dispatch(messagesSuccess(response.data))
      } else {
        const response = await axiosApi.get('/messages');
        dispatch(messagesSuccess(response.data))
      }
    } catch (error) {
      dispatch(messagesFailure({error}));
    }
  }
};

export const sendMessage = (msg) => {
  return async (dispatch) => {
    try {
      dispatch(sendMsgRequest());
      await axiosApi.post('/messages', msg);
      dispatch(sendMsgSuccess())
    } catch (error) {
      dispatch(sendMessageError(error.response.data.error))
    }
  }
};
