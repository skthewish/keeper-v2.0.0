export const initialState = null;
export default function reducer(state, action) {
  if (action.type === "auth") {
    return action.payload;
  }
  return state;
}
