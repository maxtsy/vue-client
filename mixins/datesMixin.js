export const datesMixin = {
  methods: {
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}.${month}.${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [day, month, year] = date.split(".");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    getDate(date) {
      if (!date) return null;

      const [datePart, timePart] = date.split(" ");
      const [day, month, year] = datePart.split(".");

      return `${day.padStart(2, "0")}.${month.padStart(2, "0")}.${year}`;
    },
    getDateTimeFromUtc(date, includeTime = true) {
      if (!date) return null;

      const [datePart, timePart] = date.split("T");
      const [year, month, day] = datePart.split("-");
      const stringOfTime = includeTime ? " " + timePart : "";
      return `${day.padStart(2, "0")}.${month.padStart(
        2,
        "0"
      )}.${year}${stringOfTime}`;
    },
    dateFromString(date) {
      var expDateArr,
        expr = new RegExp("\\d{2}.\\d{2}.\\d{4}", "ig"),
        expr2 = new RegExp("\\d{2}.\\d{2}.\\d{4} \\d{2}:\\d{2}:\\d{2}", "ig");

      if (date !== "" && expr2.test(date)) {
        var dateArr = date.split(" "),
          dateArrDate = dateArr[0].split("."),
          dateArrTime = dateArr[1].split(":");

        var d = new Date(
          parseInt(dateArrDate[2]),
          parseInt(dateArrDate[1]) - 1,
          parseInt(dateArrDate[0]),
          parseInt(dateArrTime[0]),
          parseInt(dateArrTime[1]),
          parseInt(dateArrTime[2])
        );

        return d;
      } else if (date !== "" && expr.test(date)) {
        expDateArr = date.split(".");

        return new Date(
          parseInt(expDateArr[2]),
          parseInt(expDateArr[1]) - 1,
          parseInt(expDateArr[0])
        );
      } else return false;
    },
  },
};
