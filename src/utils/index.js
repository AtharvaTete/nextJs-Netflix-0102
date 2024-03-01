const API_Key = "3e4ee85942ba21ce7bffaac6129e88a4";
const Base_URL = "http://api.themoviedb.org/3";

export const getTrendingMedias = async (type) => {
  try {
    const res = await fetch(
      `${Base_URL}/trending/${type}/day?api_key=${API_Key}&language=en-US`,
      {
        method: "GET",
      }
    );
    const data = await res.json();

    return data && data.results;
  } catch (error) {
    console.log(error);
  }
};

export const getTopratedMedias = async (type) => {
  try {
    const res = await fetch(
      `${Base_URL}/${type}/top_rated?api_key=${API_Key}&language=en-US`,
      {
        method: "GET",
      }
    );
    const data = await res.json();

    return data && data.results;
  } catch (error) {
    console.log(error);
  }
};

export const getPopularMedias = async (type) => {
  try {
    const res = await fetch(
      `${Base_URL}/${type}/popular?api_key=${API_Key}&language=en-US`,
      {
        method: "GET",
      }
    );
    const data = await res.json();

    return data && data.results;
  } catch (error) {
    console.log(error);
  }
};

export const getTVorMoviesByGenre = async (type, id) => {
  try {
    const res = await fetch(
      `${Base_URL}/discover/${type}?api_key=${API_Key}&language=en-US&include_adult=false&sort_by=popularity.desc&with_genres=${id}`,
      {
        method: "GET",
      }
    );
    const data = await res.json();

    return data && data.results;
  } catch (error) {
    console.log(error);
  }
};

export const getTVorMovieVideosDetailsByID = async (type, id) => {
  try {
    const res = await fetch(
      `${Base_URL}/${type}/${id}/videos?api_key=${API_Key}&language=en-US&append_to_response=video`,
      {
        method: "GET",
      }
    );
    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getTVorMovieSearchResults = async (type, query) => {
  try {
    const res = await fetch(
      `${Base_URL}/search/${type}?api_key=${API_Key}&include_adult=false&language=en-US&query=${query}`,
      {
        method: "GET",
      }
    );
    const data = await res.json();

    return data && data.results;
  } catch (error) {
    console.log(error);
  }
};

export const getTVorMovieDetailsByID = async (type, id) => {
  try {
    const res = await fetch(
      `${Base_URL}/${type}/${id}?api_key=${API_Key}&language=en-US&append_to_response=videos`,
      {
        method: "GET",
      }
    );

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(e);
  }
};

export const getSimilarTVorMovie = async (type, id) => {
  try {
    const res = await fetch(
      `${Base_URL}/${type}/${id}/similar?api_key=${API_Key}&language=en-US`,
      {
        method: "GET",
      }
    );
    const data = await res.json();

    return data && data.results;
  } catch (error) {
    console.log(error);
  }
};

export const getAllFavorites = async (uid, accountID) => {
  try {
    const res = await fetch(
      `/api/favorites/get-all-favorites?id=${uid}&accountID=${accountID}`,
      {
        method: "GET",
      }
    );
    const data = await res.json();

    return data && data.data;
  } catch (error) {
    console.log(error);
  }
};
