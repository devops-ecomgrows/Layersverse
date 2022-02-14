const Utils = {
  myLoader:  ({ src, width, quality }) => {
    return `${src}`;
  },
  /**
   * @description Convert bytes to variaty data sizes
   * @param bytes
   * @param decimals
   * @returns
   */
  bytesToSize: (bytes: number, decimals: number) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  },

  /**
   * @description Normalize file name with _
   * @param text
   * @returns
   */

  normalizeFilename: (text: string) => {
    return text.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  },

  /**
   * @description Check format email
   * @param email
   * @returns
   */
  checkEmail: (email: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  },

  /**
   * @description Checking str is list of number
   * @param str
   * @returns
   */
  checkNumber: (str: string) => {
    const re = /([0-9])*/g;
    return re.test(str);
  },

  /**
   * @description Get Date only
   * @param data
   * @returns
   */
  getDateOnly: (data: Date) => {
    const myDate =
      data.getUTCFullYear() +
      "-" +
      (data.getMonth() + 1) +
      "-" +
      data.getUTCDate();
    return myDate;
  },
};
export default Utils;
