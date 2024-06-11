import { describe, it, expect, vi } from "vitest";
import { prepareLastSevenDayView } from "../features/habits/SevenDayActionView.jsx";

describe("prepareLastSevenDayView", () => {
  it("should correctly prepare the last seven day view", () => {
    const dailyRecords = [
      {
        didIt: "yes",
        points: 1,
        date: "2024-06-01T08:52:05.498+00:00",
        _id: "66681035bf5119971bbakdjog863d",
      },
      {
        didIt: "yes",
        points: 1,
        date: "2024-06-02T08:52:05.498+00:00",
        _id: "66681035bf511997dkfjdlkf1bbd863d",
      },
      {
        didIt: "yes",
        points: 1,
        date: "2024-06-03T08:52:05.498+00:00",
        _id: "66681035bf511itnrnkrt9971bbd863d",
      },
      {
        didIt: "yes",
        points: 1,
        date: "2024-06-04T08:52:05.498+00:00",
        _id: "66681035bf51199alnbio71bbd863d",
      },
      {
        didIt: "yes",
        points: 1,
        date: "2024-06-05T08:52:05.498+00:00",
        _id: "66681035bf51199iep4271bbd863d",
      },
      {
        didIt: "yes",
        points: 1,
        date: "2024-06-06T08:52:05.498+00:00",
        _id: "66681035bkfmvf5119971bbd863d",
      },
      {
        didIt: "yes",
        points: 1,
        date: "2024-06-07T08:52:05.498+00:00",
        _id: "666810302k35bf5119971bbd863d",
      },
      {
        didIt: "unanswered",
        points: 0,
        date: "2024-06-08T08:52:05.498+00:00",
        _id: "6668103bniro5bf5119971bbd863d",
      },
      {
        didIt: "yes",
        points: 1,
        date: "2024-06-09T08:52:05.498+00:00",
        _id: "66opln681035bf5119971bbd863d",
      },
      {
        didIt: "yes",
        points: 1,
        date: "2024-06-10T08:52:05.498+00:00",
        _id: "66yytoe681035bf5119971bbd863d",
      },
      {
        didIt: "yes",
        points: 1,
        date: "2024-06-11T08:52:05.498+00:00",
        _id: "666nvkp81035bf5119971bbd863d",
      },
    ];

    // Mock today's date as June 11, 2024
    const mockDate = new Date("2024-06-11T08:52:05.498+00:00");
    vi.setSystemTime(mockDate);

    const result = prepareLastSevenDayView(dailyRecords);
    expect(result).toEqual([
      { weekday: "We", didIt: true, date: 5 },
      { weekday: "Th", didIt: true, date: 6 },
      { weekday: "Fr", didIt: true, date: 7 },
      { weekday: "Sa", didIt: null, date: 8 },
      { weekday: "Su", didIt: true, date: 9 },
      { weekday: "Mo", didIt: true, date: 10 },
      { weekday: "Tu", didIt: true, date: 11 },
    ]);

    vi.useRealTimers(); // Reset the mock timer
  });
});
