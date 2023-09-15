import React, { useEffect } from 'react';
// commented out in favor of redux logic
//import { useStoreContext } from '../../utils/GlobalState';
import { useDispatch, useSelector } from 'react-redux';
import { UPDATE_PRODUCTS } from '../../utils/actions';
import { useQuery } from '@apollo/react-hooks';

import ProductItem from "../ProductItem";
import { QUERY_PRODUCTS } from "../../utils/queries";
import spinner from "../../assets/spinner.gif"

//import IndexDB helper which will allow the app to talk
// to the database
import { idbPromise } from "../../utils/helpers";

function ProductList() {

  const state = useSelector((state) => {
    return state
  });
  const dispatch = useDispatch();


  const { currentCategory } = state;

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {
    if (data) {
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products
      });

      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    } else if (!loading) {
      idbPromise('products', 'get').then((products) => {
        console.log("I am offline")
        dispatch({
          type: UPDATE_PRODUCTS,
          products: products
        });
      })
    }
  }, [loading, data, dispatch]);

  function filterProducts() {
    if (!currentCategory) {
      return state.products;
    }

    return state.products.filter(product => product.category._id === currentCategory);
  }



  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {state.products.length ? (
        <div className="flex-row">
          {filterProducts().map(product => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      {loading ?
        <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default ProductList;
