import axios from 'axios';

const SET_LINEITEMS = 'SET_LINEITEMS';

const setLineItems = items => ({
  type: SET_LINEITEMS,
  items
});

export const lineItems = (state = [], action) => {
  switch (action.type) {
    case SET_LINEITEMS:
      return action.items;
    default:
      return state;
  }
};

export const fetchLineItems = cartId => dispatch => {
  if (cartId === undefined) {
    const items = JSON.parse(localStorage.getItem('lineItems'))
    return new Promise(() => dispatch(setLineItems(items)))
  } else {
  return axios.get(`/api/lineitems/cart/${cartId}`)
    .then(items => dispatch(setLineItems(items.data)))
  }
};


export const addLineItem = (product, cartId) => dispatch => {

  if(cartId === undefined){
    let items = JSON.parse(localStorage.getItem('lineItems'))  
    if(!items){
      items=[]
    }
    items.push(product)
    localStorage.setItem('lineItems', JSON.stringify(items));
    return new Promise(() => dispatch(fetchLineItems()))
  }
  else{
    return axios.post('/api/lineitems', product)
      .then(() => dispatch(fetchLineItems(cartId)))
  }
};

export const delLineItem = (item) => dispatch => {
  if(item.cartId === undefined){
    let items = JSON.parse(localStorage.getItem('lineItems'))  
    localStorage.setItem('lineItems', JSON.stringify(items.filter(item=>item.productId!==item.productId)))
    return new Promise(() => dispatch(fetchLineItems()))
  }
  else{
    return axios.delete(`/api/lineitems/${item.id}`)
    .then(() => dispatch(fetchLineItems(item.cartId)))
  }
};

export const updateLineItem = (id, formData, cartId) => dispatch => {
  if(cartId===undefined){
    console.log(formData)
    let items = JSON.parse(localStorage.getItem('lineItems'))  
    let newitems = items.filter(item=>item.productId!==formData.productId)
    if(!newitems){
      newitems=[]
    }
    newitems.push(formData)
    localStorage.setItem('lineItems', JSON.stringify(newitems))
    return new Promise(() => dispatch(fetchLineItems()))
  }
  else{
    return axios.put(`/api/lineitems/${id}`, formData)
    .then(() => dispatch(fetchLineItems(cartId)))
  }
}
