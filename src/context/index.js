"use client";

import CircleLoader from "@/components/circle-loader";
import { useSession } from "next-auth/react";
import { createContext, useEffect, useState } from "react";

export const Globalcontext = createContext(null);

export default function GlobalState({ children }) {
  const [loggedInAccount, setLoggedInAccount] = useState(null); //to user account log in or not
  const [accounts, setAccounts] = useState([]);
  const [pageLoader, setPageLoader] = useState(true);
  const [mediaData, setmediaData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [currentMediaInfoIDAndType, setCurrentMediaInfoIDAndType] =
    useState(null);
  const [showDetailsPopup, setshowDetailsPopup] = useState(false);
  const [mediaDetails, setMediaDetails] = useState(null);
  const [similarMedias, setSimilarMedias] = useState([]);
  const [favorites, setfavorites] = useState([]);

  const { data: session } = useSession();

  // this use effect store the data in the session and that data is available after the refress the page
  useEffect(() => {
    setLoggedInAccount(JSON.parse(sessionStorage.getItem("loggedInAccount")));
  }, []);

  if (session === undefined) return <CircleLoader />;

  return (
    <Globalcontext.Provider
      value={{
        loggedInAccount,
        setLoggedInAccount,
        accounts,
        setAccounts,
        pageLoader,
        setPageLoader,
        mediaData,
        setmediaData,
        currentMediaInfoIDAndType,
        setCurrentMediaInfoIDAndType,
        searchResults,
        setSearchResults,
        showDetailsPopup,
        setshowDetailsPopup,
        mediaDetails,
        setMediaDetails,
        similarMedias,
        setSimilarMedias,
        favorites,
        setfavorites,
      }}
    >
      {children}
    </Globalcontext.Provider>
  );
}
