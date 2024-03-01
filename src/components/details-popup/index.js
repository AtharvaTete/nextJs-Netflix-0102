"use client";

// This popup call in Navbar index.js page

import { motion } from "framer-motion";
import MuiModal from "@mui/material/Modal";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useContext, useEffect, useState } from "react";
import { Globalcontext } from "@/context";
import {
  getAllFavorites,
  getSimilarTVorMovie,
  getTVorMovieDetailsByID,
} from "@/utils";
import ReactPlayer from "react-player";
import MediaItem from "../media-item";
import { AiFillPlayCircle } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function DetailsPopup({ show, setShow, media }) {
  const router = useRouter();

  const {
    mediaDetails,
    setMediaDetails,
    similarMedias,
    setSimilarMedias,
    currentMediaInfoIDAndType,
    setCurrentMediaInfoIDAndType,
    loggedInAccount,
    setPageLoader,
  } = useContext(Globalcontext);

  const [key, setKey] = useState("");

  const { data: session } = useSession();

  useEffect(() => {
    if (currentMediaInfoIDAndType !== null) {
      async function getMediaDetails() {
        const extractMediaDetails = await getTVorMovieDetailsByID(
          currentMediaInfoIDAndType.type,
          currentMediaInfoIDAndType.id
        );

        const extractSimilarMovies = await getSimilarTVorMovie(
          currentMediaInfoIDAndType.type,
          currentMediaInfoIDAndType.id
        );

        const findIndexTrailer =
          extractMediaDetails &&
          extractMediaDetails.videos &&
          extractMediaDetails.videos.results &&
          extractMediaDetails.videos.results.length
            ? extractMediaDetails.videos.results.findIndex(
                (item) => item.type === "Trailer"
              )
            : -1;

        const findIndexClip =
          extractMediaDetails &&
          extractMediaDetails.videos &&
          extractMediaDetails.videos.results &&
          extractMediaDetails.videos.results.length
            ? extractMediaDetails.videos.results.findIndex(
                (item) => item.type === "Clip"
              )
            : -1;
        const allFavorites = await getAllFavorites(
          session?.user?.uid,
          loggedInAccount?._id
        );
        setMediaDetails(extractMediaDetails);
        console.log("extractMediaDetails", extractMediaDetails);
        setKey(
          findIndexTrailer !== -1
            ? extractMediaDetails.videos?.results[findIndexTrailer]?.key
            : findIndexClip !== -1
            ? extractMediaDetails.videos?.results[findIndexClip]?.key
            : "eKmEdwQLzoA"
        );

        setSimilarMedias(
          extractSimilarMovies.map((item) => ({
            ...item,
            type: currentMediaInfoIDAndType.type === "movie" ? "movie" : "tv",
            addedToFavorites:
              allFavorites && allFavorites.length
                ? allFavorites.map((fav) => fav.movieID).indexOf(item.id) > -1
                : false,
          }))
        );

        setPageLoader(false);
      }
      getMediaDetails();
    }
  }, [currentMediaInfoIDAndType, loggedInAccount]);

  function handleClose() {
    setShow(false);
    setCurrentMediaInfoIDAndType(null);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.5,
        ease: [0, 0.71, 0.2, 1.01],
      }}
    >
      <MuiModal
        open={show}
        onClose={handleClose}
        className="fixed !top-7 left-0 right-0 z-50 w-full mx-auto max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide"
      >
        <div>
          <button
            onClick={handleClose}
            className="modalButton flex items-center justify-center absolute top-5 right-5 bg-[#181818] hover:bg-[#181818] !z-40 border-none h-9 w-9"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          {console.log(key)}
          <div className="relative pt-[56.25%] ">
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${key}`}
              width={"100%"}
              height={"100%"}
              style={{ position: "absolute", top: "0", left: " 0" }}
              playing
              controls
            />

            <div className=" absolute bottom-[4.25rem] flex w-full items-center justify-between px-[1.5rem] ">
              <button
                onClick={() =>
                  router.push(
                    `/watch/${currentMediaInfoIDAndType?.type}/${currentMediaInfoIDAndType?.id}`
                  )
                }
                className="cursor-pointer flex items-center gap-x-2 rounded px-5 py-1.5 text-sm font-semibold transition hover:opacity-75 md:py-2.5 md:px-8 md:text-xl bg-white text-black "
              >
                <AiFillPlayCircle className="h-4 w-4 text-black md:h-7 md:w-7 cursor-pointer" />
                Play
              </button>
            </div>
          </div>
          <div className="rounded-b-md bg-[#181818] p-8 ">
            <div className="space-x-2 pb-4 flex gap-4">
              <div className=" text-green-400 font-semibold flex gap-2">
                <span>
                  {mediaDetails?.release_date
                    ? mediaDetails?.release_date.split("-")[0]
                    : "2023"}
                </span>
                <div
                  className="mt-10 mb-6 inline-flex border-2 text-red-400 border-white/40 
                 rounded px-2"
                >
                  HD
                </div>
              </div>
            </div>
            <h2 className=" cursor-pointer text-sm font-semibold text-[#e5e5e5] transition-colors duration-200 hover:text-white md:text-2xl ">
              More Like This
            </h2>
            <div className=" gap-3 grid grid-cols-5 items-center scrollbar-hide md:p-2 ">
              {similarMedias && similarMedias.length
                ? similarMedias
                    .filter(
                      (item) =>
                        item.backdrop_path !== null && item.poster_path !== null
                    )
                    .map((mediaItem) => (
                      <MediaItem
                        key={mediaItem.id}
                        media={mediaItem}
                        similarMovieView={true}
                      />
                    ))
                : null}
            </div>
          </div>
        </div>
      </MuiModal>
    </motion.div>
  );
}
