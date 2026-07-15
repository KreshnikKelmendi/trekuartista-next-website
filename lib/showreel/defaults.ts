export const DEFAULT_SHOWREEL_DESKTOP_URL =
  "https://res.cloudinary.com/dmzjjud3z/video/upload/v1779716841/showreel-1_mxq4af.mp4";

export const DEFAULT_SHOWREEL_MOBILE_URL =
  "https://res.cloudinary.com/dmzjjud3z/video/upload/v1779716236/showreel-2_q1vynk.mp4";

export type ShowreelSettings = {
  desktopUrl: string;
  mobileUrl: string;
};

export function isCustomShowreelUrl(url: string) {
  return url.includes("/works-media/showreel/") && !url.includes("/incoming/");
}
