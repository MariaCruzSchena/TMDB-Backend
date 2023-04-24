const axios = require("axios");
require("dotenv").config();
const { APYKEY } = process.env;

const getAllMedia = async (req, res, next) => {
  try {
    const query = req.query.query;
    const baseURL = "https://api.themoviedb.org/3";
    const search = {
      endpoint: "/search/multi",
      params: {
        api_key: APYKEY,
        language: "en-US",
        query: query,
        page: 1,
        include_adult: false,
      },
    };

    const requests = [];

    for (let i = 1; i <= 5; i++) {
      search.params.page = i;
      requests.push(
        axios.get(`${baseURL}${search.endpoint}`, {
          params: search.params,
        })
      );
    }

    Promise.all(requests)
      .then((responses) => {
        const movies = responses.flatMap((response) => response.data.results);        
        res.send(movies);
      })
      .catch((error) => {        
        res.status(404).send("Couldn't get media");
      });
  } catch (error) {
    res.status(404).send("Get all media request failed");
  }
};

const getSelectedMedia = async (req, res, next) => {
  try {    
    const { id } = req.params;
    const { type } = req.query;
    const baseURL = "https://api.themoviedb.org/3";
    const endpoint = `/${type}/${id}`;
    const params = {
      api_key: APYKEY,
      language: "en-US",
    };

    const response = await axios.get(`${baseURL}${endpoint}`, {
      params: params,
    });
    res.send(response.data);
  } catch (error) {
    res.status(404).send("Get selected media request failed");
  }
};

//THIS REQUEST HAS NO FUNCTIONALITY IN THIS SITE FOR NOW. 
const discoverSelectedType = async (req, res) => {
  try {
    const { type } = req.params;
    const baseURL = "https://api.themoviedb.org/3";
    const endpoint = `/discover/${type}`;
    const params = {
      api_key: APYKEY,
      language: "en-US",
      sort_by: "popularity.desc",
      page: 1,
      include_video: true,
    };

    const requests = [];

    for (let i = 1; i <= 5; i++) {
      params.page = i;
      requests.push(
        axios.get(`${baseURL}${endpoint}`, {
          params: params,
        })
      );
    }
    const responses = await Promise.all(requests);
    const media = responses.flatMap((response) => response.data.results);    
    res.send(media);
  } catch (error) {
    res.status(404).send("Discover selected type request failed");
  }
};

module.exports = { getAllMedia, getSelectedMedia, discoverSelectedType };
