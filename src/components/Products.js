import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Box,
  Typography
} from "@mui/material";
// import { Box } from "@mui/system";
import axios from "axios";

import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Cart, { generateCartItemsFrom } from "./Cart";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";



const Products = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [error, setError] = useState("")
  const [debounceTimeout, setDebounceTimeout] = useState(0)

  const performAPICall = async (text) => {
    try {
      let url = `${config.endpoint}/products`

      if (text !== "") {
        url = `${config.endpoint}/products/search?value=${text}`
      }

      const response = await axios.get(url)
      const data = response.data
      setIsLoading(false)
      setProducts(data)
    } catch (error) {
      setIsLoading(false)
      setProducts([])
      setError("No products found")
      //console.log(error);
    }
  }

  useEffect(() => {
    setIsLoading(true)
    performAPICall(search)
  }, [search])

  const performSearch = (e) => {
    setSearch(e.target.value);
    // if (timeOutDebounce !== 0) {
    //   clearTimeout(timeOutDebounce);
    // }
    // let timerId = setTimeout(() => performAPICall(e.target.value), 500);
    // setTimeOutDebounce(timerId);
  };

  const debounceSearch = (event, debounceTimeout) => {
    performSearch(event)
    if (debounceTimeout !== 0) {
      clearTimeout(debounceTimeout);
    }
    let timerId = setTimeout(() => performAPICall(event.target.value), 500);
    setDebounceTimeout(timerId);
  }

  // const debounceSearch = (event, debounceTimeout) => {
  //   if (debounceTimeout !== 0) {
  //     clearTimeout(debounceTimeout);
  //   }
  //   const timeout = setTimeout(async () => {
  //     setDataArray(await performSearch(event.target.value));
  //   }, 500);
  //   setDebounceTimeout(timeout);
  // };



  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      token = localStorage.getItem("token")
      const response = await axios.get(config.endpoint + "/cart", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = response.data

      console.log(data);
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };



  // useEffect(() => {
  //   setIsLoading(true)
  //   performAPICall(search)
  // }, [search])


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    const prodIds = items.map((item) => {
      return item.productId;
    })
    return (prodIds.includes(productId));
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    /*try {
      // console.log(token,items,products,productId,qty,options)
      if (!token) {
        enqueueSnackbar("Login to add an item to the Cart", {
          variant: "error",
        });
      } else if (options.preventDuplicate && isItemInCart(items, productId)) {
        enqueueSnackbar(
          "Item already in cart. Use the cart sidebar to update quantity or remove item.",
          { variant: "error" }
        );
      } else {
        //console.log(token,items,products,productId,qty,options)
        const res = await axios.post(
          `${config.endpoint}/cart`,
          { productId: productId, qty: qty },
          {
            headers: { Authorization: "Bearer " + token }
          }
        );
        //console.log(res.data)
        setFetchedcart(res.data);
        setCartList(generateCartItemsFrom(res.data, products));
        // console.log("inside useeffect",fetchedcart,res)
      }
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      }
    }*/
  };






  return (
    <div>
      <Header

        children={
          (<div className="search">
            <TextField
              className="search-desktop"
              fullWidth
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Search color="primary" />
                  </InputAdornment>
                ),
              }}
              placeholder="Search for items/categories"
              name="search"
              value={search}
              onChange={(e) => {
                debounceSearch(e, debounceTimeout);
              }}
            />
          </div>)
        }

        hasHiddenAuthButtons={false}>

      </Header>
      <TextField
        className="search-mobile"
        fullWidth
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        value={search}
        onChange={(e) => {
          debounceSearch(e, debounceTimeout);
        }}
      />

      <Grid container spacing={2} sx={{ display: "flex" }}>
        <Grid item md={localStorage.getItem("username") ? 8 : 12} xs={12}>
          <Box>
            <Grid container>
              <Grid item className="product-grid">
                <Box className="hero">
                  <p className="hero-heading">
                    India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                    to your door step
                  </p>
                </Box>
              </Grid>
            </Grid>

            {
              isLoading ?
                <div className="loading">
                  <CircularProgress />
                  <Typography variant="p" sx={{ marginTop: "1rem" }}>Loading Products</Typography>
                </div> :
                <Grid container spacing={2} sx={{ padding: "3rem 4rem" }} >
                  {
                    products && products.map(product => (
                      <Grid item md={3} sm={6} xs={12} key={product._id} >
                        <ProductCard product={product} />
                      </Grid>
                    ))

                  }
                </Grid>}

            {
              error ? <Grid container sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                <SentimentDissatisfied />
                <Typography variant="p" sx={{ marginTop: "1rem" }}>{error}</Typography>
              </Grid> : ""
            }

          </Box>
        </Grid>

        {/* Cart */}
        {
          localStorage.getItem("username") ?
            <Grid item md={4} xs={12} sx={{ md: { width: "25%", }, backgroundColor: "#E9F5E1", height: "100vh" }}>
              <Box >
                <Cart products={products} handleQuantity={addToCart} />

              </Box>
            </Grid> :
            null
        }
      </Grid>


      <Footer />
    </div>
  );
};

export default Products;
