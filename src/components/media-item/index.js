"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import {
  PlusIcon,
  ChevronDownIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";
import { Globalcontext } from "@/context";
import { useSession } from "next-auth/react";
import { getAllFavorites } from "@/utils";

const baseUrl = "http://image.tmdb.org/t/p/w500";

export default function MediaItem({
  media,
  searchView = false,
  similarMovieView = false,
  listView = false,
  title,
}) {
  const pathName = usePathname();
  const router = useRouter();

  const {
    setshowDetailsPopup,
    loggedInAccount,
    setfavorites,
    similarMedias,
    setSimilarMedias,
    searchResults,
    setSearchResults,
    mediaData,
    setmediaData,
    setCurrentMediaInfoIDAndType,
  } = useContext(Globalcontext);

  const { data: session } = useSession();

  async function updateFavorites() {
    const res = await getAllFavorites(session?.user?.uid, loggedInAccount?._id);
    if (res) {
      setfavorites(
        res.map((item) => ({
          ...item,
          addedToFavorites: true,
        }))
      );
    }
  }

  async function handleAddToFavorite(item) {
    const { backdrop_path, poster_path, id, type } = item;
    const res = await fetch("/api/favorites/add-favorite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        backdrop_path,
        poster_path,
        movieID: id,
        type,
        uid: session?.user?.uid,
        accountID: loggedInAccount?._id,
      }),
    });

    const data = await res.json();

    if (data && data.success) {
      if (pathName.includes("my-list")) updateFavorites();

      if (searchView) {
        let updatedSearchResults = [...searchResults];

        const indexOfCurrentAddedMedia = updatedSearchResults.findIndex(
          (item) => item.id === id
        );

        updatedSearchResults[indexOfCurrentAddedMedia] = {
          ...updatedSearchResults[indexOfCurrentAddedMedia],
          addedToFavorites: true,
        };

        setSearchResults(updatedSearchResults);
      } else if (similarMovieView) {
        let updatedSimilarResults = [...similarMedias];

        const indexOfCurrentAddedMedia = updatedSimilarResults.findIndex(
          (item) => item.id === id
        );

        updatedSimilarResults[indexOfCurrentAddedMedia] = {
          ...updatedSimilarResults[indexOfCurrentAddedMedia],
          addedToFavorites: true,
        };

        setSimilarMedias(updatedSimilarResults);
      } else {
        let updatedMediaData = [...mediaData];

        const findIndexOfRowItem = updatedMediaData.findIndex(
          (item) => item.title === title
        );

        let currentMovieArreyFromRowItem =
          updatedMediaData[findIndexOfRowItem].medias;

        const findIndexOfCurrentMovie = currentMovieArreyFromRowItem.findIndex(
          (item) => item.id === id
        );

        currentMovieArreyFromRowItem[findIndexOfCurrentMovie] = {
          ...currentMovieArreyFromRowItem[findIndexOfCurrentMovie],
          addedToFavorites: true,
        };
        setmediaData(updatedMediaData);
      }
    }
  }
  async function handleRemoveFavorite(item) {
    const res = await fetch(`/api/favorites/remove-favorite?id=${item._id}`, {
      method: "DELETE",
    });
    const data = await res.json();

    if (data.success) {
      updateFavorites();
    }
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
      <div className=" relative cardWrapper h-28 min-w-[180px] cursor-pointer md:min-w-[260px] transform transition duration-500 hover:scale-110 hover:z-[999]">
        <Image
          src={`${baseUrl}/${media?.backdrop_path || media?.poster_path}`}
          alt="Media"
          layout="fill"
          className="rounded sm object-cover md:rounded-sm "
          onClick={() =>
            router.push(
              `/watch/${media?.type}/${listView ? media.movieID : media?.id}`
            )
          }
        />
        <div className="space-x-3 hidden absolute p-2 bottom-0 buttonWrapper">
          <button
            onClick={
              media?.addedToFavorites
                ? listView
                  ? () => handleRemoveFavorite(media)
                  : null
                : () => handleAddToFavorite(media)
            }
            className={` ${
              media?.addedToFavorites && !listView && "cursor-not-allowed"
            }  cursor-pointer border flex p-2 items-center gap-x-2 rounded-full  text-sm font-semibold transition hover:opacity-90 border-white   bg-black opacity-75 text-black
          `}
          >
            {media?.addedToFavorites ? (
              <CheckIcon color="ffffff" className="h-7 w-7" />
            ) : (
              <PlusIcon color="ffffff" className="h-7 w-7" />
            )}
          </button>
          <button
            onClick={() => {
              setshowDetailsPopup(true);
              setCurrentMediaInfoIDAndType({
                type: media?.type,
                id: listView ? media?.movieID : media?.id,
              });
            }}
            className="cursor-pointer p-2 border flex items-center gap-x-2 rounded-full  text-sm font-semibold transition hover:opacity-90  border-white  bg-black opacity-75 "
          >
            <ChevronDownIcon color="ffffff" className="h-7 w-7" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
