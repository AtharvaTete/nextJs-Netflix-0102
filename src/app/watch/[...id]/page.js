"use client";

import CircleLoader from "@/components/circle-loader";
import { Globalcontext } from "@/context";
import { getTVorMovieVideosDetailsByID } from "@/utils";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import ReactPlayer from "react-player";

export default function Watch() {
  const [mediaDetails, setMediaDetails] = useState(null);
  const [key, setKey] = useState(null);

  const params = useParams();

  const { pageLoader, setPageLoader } = useContext(Globalcontext);

  useEffect(() => {
    async function getMediaDetails() {
      const extractMediaDetails = await getTVorMovieVideosDetailsByID(
        params.id[0],
        params.id[1]
      );
      
      if (extractMediaDetails) {
        const findIndexTrailer = extractMediaDetails.results?.findIndex(
          (item) => item.type === "Trailer"
        );

        const findIndexClip = extractMediaDetails.results?.findIndex(
          (item) => item.type === "Clip"
        );
        setMediaDetails(extractMediaDetails);
        setKey(
          findIndexTrailer !== -1
            ? extractMediaDetails.results[findIndexTrailer]?.key
            : findIndexClip !== -1
            ? extractMediaDetails.results[findIndexClip]?.key
            : "eKmEdwQLzoA"
        );
        setPageLoader(false);
      }
    }

    getMediaDetails();
  }, [params]);

  if (pageLoader && mediaDetails === null) return <CircleLoader />;

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
      {/* this is react player that play the youtube video */}
      <ReactPlayer
        url={`https://www.youtube.com/watch?v=${key}`}
        width={"100%"}
        height={"100%"}
        style={{ position: "absolute", top: "0", left: " 0" }}
        playing
        // controls
        controls={{ back: true }}
      />
    </motion.div>
  );
}
