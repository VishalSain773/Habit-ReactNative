import { uId } from './types';

export const addUserId = userId => {
  return {
    type: uId,
    payload: userId
  }
}