import { clsx, type ClassValue } from "clsx";
import { Timestamp } from "firebase/firestore";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shuffleArray = <T>(array: T[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const convertTimeStamp = (timestamp: Timestamp) => {
  try {
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  } catch (error) {
    console.error("Error converting timestamp:", error);
    return new Date();
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertDecisionDates = (obj: any) => {
  if (obj && typeof obj === "object") {
    for (const key in obj) {
      if (key.endsWith("At") || key.endsWith("Date") || key === "timestamp") {
        obj[key] = convertTimeStamp(obj[key] as Timestamp);
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        convertDecisionDates(obj[key]);
      }
    }
  }
};
