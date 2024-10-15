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

  const handleResize = useCallback(() => {
    if (width >= 1280) {
      return 200;
    } else if (width >= 1024) {
      return 150;
    } else if (width >= 768) {
      return 175;
    } else if (width >= 600) {
      return 135;
    } else if (width >= 520) {
      return 115;
    } else if (width >= 480) {
      return 100;
    } else if (width >= 425) {
      return 125;
    } else if (width >= 350) {
      return 100;
    } else if (width < 350) {
      return 90;
    } else {
      return 200;
    }
  }, [width]);

  const [mainImageSize, setMainImageSize] = useState(
    width !== 0 && width < 550 ? width - 48 : 500
  );
  const [thumbnailsSize, setThumbnailsSize] = useState(handleResize());

  // Set the size of the images
  useEffect(() => {
    if (width && width < 550) {
      setMainImageSize(width - 48); // 24px padding on each side
    }

    setThumbnailsSize(handleResize());
  }, [handleResize, width]);

  return (
    <div data-carousel-slider>
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
        spaceBetween={10}
        navigation={true}
        pagination={{
          clickable: false,
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
              }
            : undefined
        }
        hashNavigation={{
          watchState: true,
        }}
        className="mySwiper2 cursor-zoom-in bg-inherit"
      >
        {imagesUrl.map((url, index) => (
          <SwiperSlide
            key={`${url}-${index + 1}`}
            data-hash={`slide${index + 1}`}
          >
            <div className="swiper-zoom-container">
              <Image
                src={url}
                alt={`${productName} - ${index} image`}
                containerClassNames={`bg-muted relative aspect-square h-[${mainImageSize}px] [&>img]:object-contain [&>img]:object-center mx-auto`}
                customRawSize={2000}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {imagesUrl.length > 1 && (
        <Swiper
          onSwiper={setThumbsSwiper}
          modules={[Navigation, FreeMode, Thumbs, HashNavigation, A11y]}
          slidesPerView={width >= 480 ? 4 : 3}
          loop={true}
          freeMode={true}
          grabCursor={true}
          hashNavigation={{
            watchState: true,
          }}
          className="mySwiper my-4 sm:my-8 [&>*>.swiper-slide-thumb-active]:opacity-25 [&>*>.swiper-slide-thumb-active]:transition-all"
        >
          {imagesUrl.map((url, index) => (
            <SwiperSlide key={`${url}-${index + 1}`}>
              <Image
                src={url}
                alt={`${productName} - ${index} image`}
                width={thumbnailsSize}
                height={thumbnailsSize}
                containerClassNames={`relative border-2 border-primary bg-muted h-[${thumbnailsSize}px] rounded-2xl overflow-hidden cursor-pointer hover:opacity-75 transition-all`}
                containerStyles={{
                  width: thumbnailsSize,
                  height: thumbnailsSize,
                }}
                isThumbnail
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
