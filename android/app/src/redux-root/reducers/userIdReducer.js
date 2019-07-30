import { uId } from '../actions/types';

const initialState = {
  user_id: '',
};

const userIdReducer = (state = initialState, action) => {
  switch(action.type) {
    case uId:
      return {
        ...state,
        user_id: state.user_id
      };
    default:
      return state;
  }
}

export default userIdReducer;