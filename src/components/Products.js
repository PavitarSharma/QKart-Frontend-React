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
// eslint-disable-next-line
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";



const Products = () => {
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
      console.log(error);
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

  const debounceSearch = (event) => {
    performSearch(event)
    if (debounceTimeout !== 0) {
      clearTimeout(debounceTimeout);
    }
    let timerId = setTimeout(() => performAPICall(event.target.value), 500);
    setDebounceTimeout(timerId);
  }



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
              onChange={debounceSearch}
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
        onChange={debounceSearch}
      />

      <Grid container spacing={2} sx={{ display: "flex" }}>
        <Grid item md={8} xs={12}>
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
        <Grid item md={4} xs={12}>
          <Box sx={{ md: { width: "25%" }, backgroundColor: "#E9F5E1" }}>
            <h1>Hello Card</h1>
          </Box>
        </Grid>
      </Grid>


      <Footer />
    </div>
  );
};

export default Products;
