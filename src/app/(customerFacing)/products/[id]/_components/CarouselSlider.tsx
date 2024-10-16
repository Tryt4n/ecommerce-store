"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Keyboard,
  Zoom,
  FreeMode,
  Thumbs,
  HashNavigation,
  EffectFade,
  A11y,
} from "swiper/modules";
import Image from "@/components/Image";
import { carouselSliderThumbnailsBreakpoint } from "../_consts/breakpoints";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import "swiper/css/effect-fade";
import "swiper/css/thumbs";

type CarouselSliderProps = {
  productName: string;
  imagesUrl: string[];
};

export default function CarouselSlider({
  productName,
  imagesUrl,
}: CarouselSliderProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const { width } = useWindowSize();

  // Function to get the size of the thumbnails
  const handleResize = useCallback(() => {
    const breakpoint = carouselSliderThumbnailsBreakpoint.find(
      (bp) => width >= bp.minWidth
    );
    return breakpoint ? breakpoint.value : 200;
  }, [width]);

  const [mainImageSize, setMainImageSize] = useState(
    width !== 0 && width < 550 ? width - 48 : 500 // 500px is the default size and also the largest size - both width and height
  );
  const [thumbnailsSize, setThumbnailsSize] = useState(handleResize()); // 200px is the default size

  // Set the size of the images
  useEffect(() => {
    if (width === 0) return; // 0 is the default initialized value of the width

    if (width && width < 550) {
      setMainImageSize(width - 48); // 24px padding on each side
    }

    setThumbnailsSize(handleResize());
  }, [handleResize, width]);

  return (
    <div data-carousel-slider>
      {/* Main Slider */}
      <Swiper
        style={
          {
            "--swiper-pagination-color": "hsl(var(--primary))",
            "--swiper-navigation-color": "hsl(var(--primary))",
          } as React.CSSProperties
        }
        modules={[
          Navigation,
          Pagination,
          Keyboard,
          Zoom,
          FreeMode,
          Thumbs,
          HashNavigation,
          EffectFade,
          A11y,
        ]}
        navigation={true}
        pagination={{
          clickable: false,
          type: "bullets",
        }}
        keyboard={{
          enabled: true,
        }}
        zoom={{
          zoomedSlideClass: "cursor-zoom-out",
        }}
        loop={imagesUrl.length > 1 ? true : undefined}
        effect="fade"
        thumbs={
          imagesUrl.length > 1
            ? {
                swiper:
                  thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
              } // If thumbsSwiper doesn't exist or it is destroyed, set it to null
            : undefined
        }
        hashNavigation={{
          watchState: true, // Enable hash navigation
        }}
        className="mySwiper2 cursor-zoom-in bg-inherit"
      >
        {imagesUrl.map((url, index) => (
          <SwiperSlide
            key={`${url}-${index + 1}`}
            data-hash={`slide${index + 1}`} // Add data-hash to the slides (only for main slider)
            className="overflow-hidden rounded-2xl"
          >
            <div className="swiper-zoom-container">
              <Image
                src={url}
                alt={`${productName} - ${index} image`}
                aria-label="Double click/tap or pinch the image to zoom"
                containerClassNames={`bg-muted relative aspect-square h-[${mainImageSize}px] [&>img]:object-contain [&>img]:object-center mx-auto`}
                containerStyles={{
                  width: mainImageSize,
                  height: mainImageSize,
                }}
                customRawSize={2000} // 2000x2000 - size of the fetched image
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {imagesUrl.length > 1 && (
        // Thumbs Slider
        <Swiper
          onSwiper={setThumbsSwiper}
          modules={[Navigation, FreeMode, Thumbs, HashNavigation, A11y]}
          slidesPerView={width >= 480 ? 4 : 3} // On small screens reduce the number of slides from 4 to 3
          loop={true}
          freeMode={true} // Free mode allows the slides to keep moving after the user releases the slide
          grabCursor={true} // Change the cursor to a grab cursor when you hover over the slides
          watchSlidesProgress={true} // Docs say it's necessary for thumbs
          hashNavigation={{
            watchState: true, // Enable hash navigation
          }}
          className="mySwiper my-4 sm:my-8 [&>*>.swiper-slide-thumb-active]:opacity-25 [&>*>.swiper-slide-thumb-active]:transition-all"
        >
          {imagesUrl.map((url, index) => (
            <SwiperSlide key={`${url}-${index + 1}`}>
              <Image
                src={url}
                alt={`${productName} - ${index} thumbnail`}
                width={thumbnailsSize}
                height={thumbnailsSize}
                containerClassNames={`relative border-2 aspect-square border-primary bg-muted h-[${thumbnailsSize}px] rounded-2xl overflow-hidden cursor-pointer hover:opacity-75 transition-all`}
                containerStyles={{
                  width: thumbnailsSize,
                  height: thumbnailsSize,
                }}
                isThumbnail // Set the image as a thumbnail - it gives the default size of 440x440
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
