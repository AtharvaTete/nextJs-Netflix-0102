"use client";

import CircleLoader from "@/components/circle-loader";
import CommonLayout from "@/components/common-layout";
import ManageAccount from "@/components/manage-account";
import UnauthPage from "@/components/unauth-page";
import { Globalcontext } from "@/context";
import {
  getAllFavorites,
  getPopularMedias,
  getTopratedMedias,
  getTrendingMedias,
} from "@/utils";
import { useSession } from "next-auth/react";
import PageLoader from "next/dist/client/page-loader";
import { useContext, useEffect } from "react";

export default function Browse() {
  const {
    loggedInAccount,
    pageLoader,
    setPageLoader,
    mediaData,
    setmediaData,
  } = useContext(Globalcontext);

  const { data: session } = useSession();

  useEffect(() => {
    async function getAllMedias() {
      const trendingTvShows = await getTrendingMedias("tv");
      const popularTvShows = await getPopularMedias("tv");
      const topratedTvShows = await getTopratedMedias("tv");

      const trendingMoviesShows = await getTrendingMedias("movie");
      const popularMoviesShows = await getPopularMedias("movie");
      const topratedMoviesShows = await getTopratedMedias("movie");
      const allFavorites = await getAllFavorites(
        session?.user?.uid,
        loggedInAccount?._id
      );

      setmediaData([
        ...[
          {
            title: "Trending TV Shows",
            medias: trendingTvShows,
          },
          {
            title: "Popular TV Shows",
            medias: popularTvShows,
          },
          {
            title: "Top rated TV shows",
            medias: topratedTvShows,
          },
        ].map((item) => ({
          ...item,
          medias: item.medias.map((mediaItems) => ({
            ...mediaItems,
            type: "tv",
            addedToFavorites:
              allFavorites && allFavorites.length
                ? allFavorites
                    .map((fav) => fav.movieID)
                    .indexOf(mediaItems.id) > -1
                : false,
          })),
        })),
        ...[
          {
            title: "Trending Movies",
            medias: trendingMoviesShows,
          },
          {
            title: "Popular Movies",
            medias: popularMoviesShows,
          },
          {
            title: "Top rated Movies",
            medias: topratedMoviesShows,
          },
        ].map((item) => ({
          ...item,
          medias: item.medias.map((mediaItems) => ({
            ...mediaItems,
            type: "movie",
            addedToFavorites:
              allFavorites && allFavorites.length
                ? allFavorites
                    .map((fav) => fav.movieID)
                    .indexOf(mediaItems.id) > -1
                : false,
          })),
        })),
      ]); 
      setPageLoader(false);
    }

    getAllMedias();
  }, []);

  if (session === null) return <UnauthPage />;

  if (loggedInAccount === null) return <ManageAccount />;

  if (pageLoader) return <CircleLoader />;

  console.log(mediaData);

  return (
    <main className="flex min-h-screen flex-col ">
      <CommonLayout mediaData={mediaData} />
    </main>
  );
}
