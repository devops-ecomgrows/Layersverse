import React from "react";
import Image from "next/image";
import { ImageLoader } from "./ImageLoader";
interface InputProps {
  /**
   * Image Source
   */
  src: string;
  /**
   * Image Title
   */
  title: string;
  /**
   * Image description
   */
  description?: string;
  /**
   * Image alt text
   */
  alt?: string;
}
function ImageGrid({ files }: { files: InputProps[] }) {
  return (
    <ul
      role="list"
      className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
    >
      {files.map((file, idx) => (
        <li key={idx} className="relative">
          <div className="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
            <ImageLoader
              src={file.src}
              alt=""
              className="object-cover pointer-events-none group-hover:opacity-75"
              layout="fill"
            />
            <button
              type="button"
              className="absolute inset-0 focus:outline-none"
            >
              <span className="sr-only">View details for {file.title}</span>
            </button>
          </div>
          <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">
            {file.title}
          </p>
          <p className="block text-sm font-medium text-gray-500 pointer-events-none">
            {file.description}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default ImageGrid;
