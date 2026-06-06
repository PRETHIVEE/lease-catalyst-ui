import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Formats a UTC ISO string to "YYYY-MM-DD  hh:mm A" in local time.
 * Input:  "2026-05-14T07:40:40.221095Z"
 * Output: "2026-05-14  10:40 PM"
 */
export const formatDateTime = (isoString: string): string => {
  return dayjs.utc(isoString).local().format("YYYY-MM-DD  hh:mm A");
};

export const trimLeadingSpace = (inputValue: string) => {
  // Get the input value from parameter
  // Check if the first character is a space
  if (inputValue.charAt(0) === " ") {
    // Remove the space at the beginning
    const newValue = inputValue.trimStart();
    return newValue;
  } else {
    // If the first character is not a space, update the state normally
    return inputValue;
  }
};

export const getFileExtension = (filename: string) => {
  if (!filename || !filename.includes(".")) return "";
  return filename.slice(filename.lastIndexOf(".") + 1).toLowerCase();
};

export async function getPresignedUrl(s3_path: string) {
  const region = import.meta.env.VITE_AWS_REGION;
  const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
  const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
  const bucket = import.meta.env.VITE_AWS_BUCKET;

  if (!region || !accessKeyId || !secretAccessKey || !bucket) {
    throw new Error(
      "Missing AWS env vars. Define VITE_AWS_REGION, VITE_AWS_ACCESS_KEY_ID, VITE_AWS_SECRET_ACCESS_KEY, and VITE_AWS_BUCKET."
    );
  }

  const s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: s3_path,
  });
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

export const fileDownloader = (url: string) => {
  const link = document.createElement("a");
  link.href = url;
  // link.download = "extractedOutput.csv"; // Set the filename
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
