export const parseCookie = (cookieStr?: string) =>
  (cookieStr || "")
    .replace(" ", "")
    .split(";")
    .reduce<Record<string, string>>((ac, cr) => {
      const [key, value] = cr.split("=");
      return { ...ac, [key]: value };
    }, {});
