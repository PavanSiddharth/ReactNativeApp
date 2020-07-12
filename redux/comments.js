import * as ActionTypes from './ActionTypes';

export const comments = (state = { errMess: null, comments:[]}, action) => {
  switch (action.type) {
    case ActionTypes.ADD_COMMENTS:
      return {...state, errMess: null, comments: action.payload};

    case ActionTypes.COMMENTS_FAILED:
      return {...state, errMess: action.payload};
    
      case ActionTypes.ADD_COMMENT:
        {
          let obj = action.payload;
          var d = new Date();
          var n = d.toISOString();
          obj.date = n;
          obj.id = (state.comments[state.comments.length - 1].id)+1
        return {...state, errMess: null, comments: state.comments.concat(obj)};
        }
    

    default:
      return state;
  }
};