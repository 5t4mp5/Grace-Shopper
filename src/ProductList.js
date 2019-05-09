import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getProductByPg, fetchProducts } from './store/product'
import Pager from './Pager';
import { lineItems, fetchLineItems } from './store/lineitem';
import Search from "./Search";


class ProductList extends Component {
    constructor(props){
        super(props)
        this.state = {
            count: 0,
        }
    }

    componentDidMount(){
        this.props.fetchProducts()
    }

    componentDidUpdate(prevProps){
        if(prevProps.cart.id !== this.props.cart.id){
            this.props.fetchLineItems(this.props.cart.id)
        }   
        if(prevProps.match.params.idx !== this.props.match.params.idx){
            this.props.getProductByPg(this.props.match.params.idx)
        }  
    }
    render(){
        const history = this.props.history;
        const Products = this.props.products.slice(0, 10);
        const totalItems = this.props.lineItems.reduce((acc, item) => {
            acc += item.quantity
            return acc
        }, 0)
        return(
            <div>
                <Pager history={history}/>
                <h1>Here are All of our Products:</h1>
                <Search history={history} match={this.props.match}/>
                <ul className='list-group'>
                    {
                        Products.map(p=>{
                            return (
                                <li key={p.id} className='list-group-item'>
                                    <span>{p.name}</span>
                                    <img className='product-image' onClick={()=>history.push(`/product/${p.id}`)} src={p.imageUrl}/>
                                    <p>${p.price}</p>
                                </li>)
                        })
                    }
                </ul>
                <img className = 'shopping-cart' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKorRm0enmL_tFIgvKcNcOjb_3YkWnny-CIK0BW5F9DoGocc7DkA' onClick={()=>{history.push('/cart')}}/>
                <span className = 'shopping-item-quantity'>{totalItems}</span>
            </div>
        )
    }
}  

const mapStateToProps = (state) => {
    return {
        products: state.products,
        lineItems: state.lineItems,
        cart: state.cart
    }
};

const mapDispatchToProps = dispatch => {
    return {
        fetchLineItems: cartId => dispatch(fetchLineItems(cartId)),
        fetchProducts: () => dispatch(fetchProducts()),
        getProductByPg: pgIdx => dispatch(getProductByPg(pgIdx))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
