export const getOptions = (data) => ({
  method: data ? "POST" : "GET",
  mode: "cors",
  cache: "no-cache",
  credentials: "same-origin",
  headers: {
    "Content-Type": "application/json",
  },
  referrerPolicy: "no-referrer",
  ...(data && { body: JSON.stringify(data) }),
});
