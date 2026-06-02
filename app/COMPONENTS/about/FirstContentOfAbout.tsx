"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import Image from "next/image";

const sketchImage = "/assets/about/pho.jpg";
const officeImage1 = "/assets/about/office10.jpg";
const officeImage2 = "/assets/about/office11.jpg";
const officeImage3 = "/assets/about/office12.jpg";

const FirstContentOfAbout = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent server-side translation updates until component mounts in the browser
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: isMounted ? containerRef : undefined,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 18,
    mass: 0.5,
  });

  // Parallax Travel Maps
  const yMain = useTransform(smoothProgress, [0, 1], [0, 80]);
  const y1 = useTransform(smoothProgress, [0, 1], [0, 120]);
  const y2 = useTransform(smoothProgress, [0, 1], [0, 180]);
  const y3 = useTransform(smoothProgress, [0, 1], [0, 240]);

  return (
    <section
      ref={containerRef}
      className="relative w-full px-5 py-12 lg:px-[55px]"
    >
      {/* TOP LABEL */}
      <div className="mb-0 lg:mb-0">
        <span className="text-[11px] uppercase tracking-[0.25em] text-black font-light">
          / ABOUT US
        </span>
      </div>

      {/* MAIN LAYOUT */}
      <div className="relative">
        
        {/* Mobile / Tablet Viewport */}
        <div className="relative h-[620px] rounded-[8px] lg:hidden">
          <motion.div 
            style={{ y: isMounted ? yMain : 0 }} 
            className="absolute left-0 top-0 h-[530px] w-[72%] rounded-[8px] overflow-hidden"
          >
            <Image
              src={sketchImage}
              alt="About Sketch"
              fill
              className="object-cover grayscale"
              sizes="(max-width: 1023px) 72vw, 100vw"
            />
          </motion.div>

          <motion.div style={{ y: isMounted ? y1 : 0 }} className="absolute right-[22%] top-[210px] h-[132px] w-[116px] overflow-hidden rounded-[8px]">
            <Image src={officeImage2} alt="" fill className="object-cover grayscale" sizes="116px" />
          </motion.div>
          <motion.div style={{ y: isMounted ? y2 : 0 }} className="absolute right-0 top-[302px] h-[140px] w-[116px] overflow-hidden rounded-[8px]">
            <Image src={officeImage3} alt="" fill className="object-cover grayscale" sizes="116px" />
          </motion.div>
          <motion.div style={{ y: isMounted ? y3 : 0 }} className="absolute right-[8%] bottom-0 h-[110px] w-[152px] overflow-hidden rounded-[8px]">
            <Image src={officeImage1} alt="" fill className="object-cover grayscale" sizes="152px" />
          </motion.div>

          <div className="absolute bottom-[116px] left-5 max-w-[305px]">
            <p className="font-custom text-[25px] uppercase leading-[1.02] tracking-[0.04em] text-white">
              Born in 2012, in the restless energy of Prishtina — a place where ideas don’t sit still, and neither do we.
            </p>
          </div>
        </div>

        {/* Desktop Viewport */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as const }}
          viewport={{ once: true }}
          className="relative hidden lg:h-[90vh] 2xl:h-[80vh] w-full lg:block"
        >
          <div className="absolute inset-0">
            <div className="absolute inset-y-0 left-0 w-[68%] overflow-hidden rounded-[8px]">
              <motion.div style={{ y: isMounted ? yMain : 0 }} className="relative h-[118%] w-full">
                <Image
                  src={sketchImage}
                  alt="About background"
                  fill
                  priority
                  className="object-cover grayscale"
                  sizes="68vw"
                />
              </motion.div>
            </div>
          </div>

          <div className="absolute bottom-[52px] left-[28px] z-20 max-w-[470px]">
            <p className="font-custom text-sm lg:text-[40px] uppercase leading-[1.2] text-white">
              Born in 2012, in the restless energy of Prishtina—a place where ideas don’t sit still, and neither do we.
            </p>
          </div>

          <motion.div style={{ y: isMounted ? y1 : 0 }} className="absolute left-[54%] top-[200px] z-30 h-[156px] w-[212px] lg:h-[30vh] overflow-hidden rounded-[8px]">
            <Image src={officeImage1} alt="" fill className="object-cover grayscale" sizes="212px" />
          </motion.div>
          
          <motion.div style={{ y: isMounted ? y1 : 0 }} className="absolute left-[72%] top-[80px] z-70 h-[156px] w-[152px] lg:h-[20vh] overflow-hidden">
            <motion.svg
              animate={{ rotate: 360 }}
              transition={{ duration: 25, ease: "linear", repeat: Infinity }}
              viewBox="0 0 204 205"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-full"
            >
              <path d="M11.1132 128.228L8.26591 119.572L1.85547 121.689L10.274 147.285L16.6845 145.168L13.8372 136.513L40.4977 127.707L37.7738 119.422L11.1132 128.228Z" fill="black"/>
              <path d="M35.7253 98.6466L23.3414 96.7957L24.1591 91.3074L37.5538 86.3591L38.9881 76.715L23.9741 82.574C23.6524 80.3121 22.7569 78.4128 21.2877 76.8708C19.8185 75.3315 17.9712 74.394 15.7486 74.0609C11.9763 73.4968 8.98963 74.1173 6.79383 75.9199C4.59804 77.7224 3.18779 80.707 2.56847 84.8762L0 102.128L34.441 107.273L35.7253 98.6466ZM18.1321 87.9414L16.9578 95.842L7.67054 94.4558L8.84485 86.5552C9.07542 85.0052 9.63577 83.9065 10.5205 83.2644C11.408 82.6224 12.6252 82.4128 14.1721 82.6465C15.7191 82.8776 16.8237 83.431 17.4859 84.3067C18.1455 85.1825 18.3627 86.394 18.1321 87.9468V87.9414Z" fill="black"/>
              <path d="M52.0558 47.6059L41.1224 62.4212L34.5162 57.5267L43.908 44.7986L38.4815 40.7771L29.0897 53.5051L23.9769 49.7147L34.039 36.084L28.6125 32.0625L13.376 52.7073L41.3717 73.4542L57.4823 51.6274L52.0558 47.6059Z" fill="black"/>
              <path d="M102.854 0L91.4752 1.93956L81.5069 17.7328L79.1798 4.03494L70.5977 5.49901L76.4397 39.8954L85.0218 38.4313L83.3193 28.4084L87.5608 22.2378L99.5371 35.9571L109.103 34.3265L92.7165 15.3097L102.854 0Z" fill="black"/>
              <path d="M124.882 41.6003C128.515 42.9623 131.946 43.1853 135.18 42.2692C139.067 41.1813 141.778 38.5862 143.309 34.4868L151.261 13.1919L143.108 10.1348L135.41 30.742C134.622 32.8535 133.555 34.2665 132.209 34.9838C130.863 35.7011 129.241 35.7037 127.348 34.9919C125.485 34.2934 124.281 33.2323 123.734 31.8058C123.187 30.3793 123.308 28.6117 124.096 26.5002L131.794 5.89303L123.641 2.83594L115.686 24.1308C114.155 28.2302 114.498 31.9697 116.718 35.3491C118.555 38.1672 121.276 40.2491 124.879 41.6003H124.882Z" fill="black"/>
              <path d="M164.813 67.5169L170.111 79.302L165.824 83.1274L169.661 91.662L196.008 65.3141L192.313 57.0938L155.282 59.67L159.097 68.1589L164.816 67.5169H164.813ZM186.418 64.7499L175.162 74.7916L171.487 66.6143L186.418 64.7499Z" fill="black"/>
              <path d="M169.323 94.6094L168.527 103.294L180.994 104.444L180.487 109.97L167.393 115.665L166.503 125.376L181.163 118.682C181.611 120.92 182.613 122.768 184.166 124.224C185.718 125.68 187.616 126.51 189.855 126.717C193.654 127.066 196.598 126.282 198.692 124.358C200.783 122.435 202.022 119.375 202.408 115.179L204.003 97.8062L169.329 94.6121L169.323 94.6094ZM196.043 113.855C195.901 115.415 195.402 116.544 194.555 117.237C193.705 117.93 192.501 118.204 190.944 118.059C189.386 117.916 188.252 117.425 187.544 116.589C186.836 115.754 186.552 114.553 186.694 112.992L187.423 105.038L196.775 105.9L196.046 113.855H196.043Z" fill="black"/>
              <path d="M185.013 148.018L160.985 133.469L156.483 140.934L180.508 155.484L175.803 163.285L181.581 166.78L195.493 143.715L189.718 140.217L185.013 148.018Z" fill="black"/>
              <path d="M147.824 150.996L141.135 156.578L163.42 183.388L170.109 177.806L147.824 150.996Z" fill="black"/>
              <path d="M132.254 177.819L125.023 179.038C122.417 179.476 120.852 178.923 120.329 177.376C119.897 176.108 120.318 174.858 121.592 173.633C122.576 172.677 123.779 171.957 125.198 171.474C128.501 170.348 132.147 170.641 136.136 172.355L141.051 166.128C135.423 163.041 129.71 162.485 123.905 164.462C119.892 165.83 116.851 167.675 114.782 170.002C111.964 173.169 111.307 176.965 112.806 181.386C113.792 184.293 115.72 186.122 118.591 186.869C120.852 187.444 123.986 187.396 127.994 186.722L131.316 186.16C134.538 185.615 136.423 186.147 136.97 187.753C137.305 188.742 137.043 189.746 136.182 190.765C135.423 191.678 134.501 192.32 133.42 192.688C129.804 193.921 126.375 193.523 123.136 191.501L118.441 198.149C123.675 201.094 129.241 201.564 135.136 199.554C138.965 198.251 141.783 196.307 143.592 193.725C145.66 190.778 146.056 187.433 144.788 183.691C143.078 178.649 138.901 176.691 132.257 177.813L132.254 177.819Z" fill="black"/>
              <path d="M98.0625 169.237L89.4295 168.133L85.8771 196.036L76.8526 194.884L76 201.592L102.682 205.001L103.535 198.293L94.5128 197.14L98.0625 169.237Z" fill="black"/>
              <path d="M74.8873 163.928L70.5494 167.718L59.498 161.051L60.8492 155.46L52.8463 150.633L46.1543 187.323L53.8624 191.973L82.8421 168.731L74.882 163.928H74.8873ZM54.3584 182.316L57.9054 167.64L65.5733 172.266L54.3557 182.316H54.3584Z" fill="black"/>
              <path d="M61.4633 28.1216L57.7608 21.6797C53.9376 23.8852 49.9481 26.6146 46.5244 29.3627L51.1627 35.1626C55.3961 31.7643 59.4338 29.2929 61.4633 28.1216Z" fill="black"/>
              <path d="M24.6494 155.303C25.7594 157.03 28.7836 161.541 32.8401 166.126L38.3926 161.194C34.5721 156.875 31.6819 152.509 30.8856 151.273L24.6494 155.303Z" fill="black"/>
              <path d="M167.197 45.5813L172.623 40.5121C169.72 37.3932 166.341 34.2555 162.851 31.4375L158.196 37.2266C161.419 39.8271 164.532 42.7176 167.199 45.584L167.197 45.5813Z" fill="black"/>
            </motion.svg>
          </motion.div>

          <motion.div style={{ y: isMounted ? y2 : 0 }} className="absolute right-[25%] top-[400px] z-30 h-[196px] w-[212px] overflow-hidden rounded-[8px]">
            <Image src={officeImage2} alt="" fill className="object-cover grayscale" sizes="212px" />
          </motion.div>

          <motion.div style={{ y: isMounted ? y3 : 0 }} className="absolute right-[3.5%] top-[100px] z-30 h-[156px] w-[212px] lg:h-[50vh] overflow-hidden rounded-[8px]">
            <Image src={officeImage3} alt="" fill className="object-cover grayscale" sizes="212px" />
          </motion.div>
        </motion.div>
      </div>

      {/* BOTTOM TEXT */}
      <motion.div
        initial={{ opacity: 0.35, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1.1,
          delay: 0.2,
          ease: [0.16, 1, 0.3, 1] as const,
        }}
        viewport={{ once: true }}
        className="mt-24 ml-auto w-1/2 flex justify-end items-end lg:mt-24"
      >
        <p className="text-[18px] leading-[1.2] text-black/55 md:text-[22px] lg:text-[46px] text-right font-custom z-50">
          “No templates, no safe routes—just bold concepts, crafted to make brands felt, not just seen.”
        </p>
      </motion.div>
    </section>
  );
};

export default FirstContentOfAbout;