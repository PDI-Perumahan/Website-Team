import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function checkFileType(file: File) {
  if (file?.name) {
    console.log(file.name);
    const fileType = file.name.split(".").pop();
    if (fileType === "glb") return true;
  }
  return false;
}
