export const Result = {
  ok(data, log) {
    const result = {
      ok: true,
      data,
      error: null,
    };

    if (log) {
      console.log("SUCCESS\n", "DATA", data + "\n", result);
    }

    return result;
  },
  error(message, cause) {
    const result = {
      ok: false,
      data: null,
      error: new Error(message, cause),
    };

    console.error(
      "ERROR\n",
      "MESSAGE",
      message + "\n",
      "CAUSE",
      cause + "\n",
      result,
    );

    return result;
  },
  empty() {
    return {
      ok: false,
      data: null,
      error: null,
    };
  },
};
