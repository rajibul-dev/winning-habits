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
        didIt: "unanswered",
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
        didIt: "no",
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
      { weekday: "Th", didIt: null, date: 6 },
      { weekday: "Fr", didIt: true, date: 7 },
      { weekday: "Sa", didIt: false, date: 8 },
      { weekday: "Su", didIt: true, date: 9 },
      { weekday: "Mo", didIt: true, date: 10 },
      { weekday: "Tu", didIt: true, date: 11 },
    ]);

    vi.useRealTimers(); // Reset the mock timer
  });

  it("should create 7 days even when dailly records are less than 7 days", () => {
    const dailyRecords = [
      {
        didIt: "no",
        points: 0,
        date: "2024-06-09T08:52:05.498+00:00",
        _id: "666hokp81035bf5119971bbd863d",
      },
      {
        didIt: "yes",
        points: 1,
        date: "2024-06-10T08:52:05.498+00:00",
        _id: "666hokp81035bf5119971bbd863d",
      },
      {
        didIt: "unanswered",
        points: 0,
        date: "2024-06-11T08:52:05.498+00:00",
        _id: "666nvkp81035bf5119971bbd863d",
      },
    ];

    // Mock today's date as June 11, 2024
    const mockDate = new Date("2024-06-11T08:52:05.498+00:00");
    vi.setSystemTime(mockDate);

    const result = prepareLastSevenDayView(dailyRecords);
    expect(result).toEqual([
      { weekday: "We", didIt: null, date: 5 },
      { weekday: "Th", didIt: null, date: 6 },
      { weekday: "Fr", didIt: null, date: 7 },
      { weekday: "Sa", didIt: null, date: 8 },
      { weekday: "Su", didIt: false, date: 9 },
      { weekday: "Mo", didIt: true, date: 10 },
      { weekday: "Tu", didIt: null, date: 11 },
    ]);
  });

  it("should correctly prepare the last seven day view even when the data is too long", () => {
    // Create daily records for 700 days from June 1, 2022, to June 1, 2024
    const startDate = new Date("2022-06-01T08:52:05.498+00:00");
    const dailyRecords = Array.from({ length: 700 }, (_, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);
      return {
        didIt: index % 3 === 0 ? "yes" : index % 3 === 1 ? "no" : "unanswered",
        points: 1,
        date: date.toISOString(),
        _id: `record_${index}`,
      };
    });

    // Manually specify input for the last seven days
    const lastSevenDaysInput = [
      {
        didIt: "yes",
        points: 1,
        date: "2024-05-26T08:52:05.498+00:00",
        _id: "record_693",
      },
      {
        didIt: "no",
        points: 1,
        date: "2024-05-27T08:52:05.498+00:00",
        _id: "record_694",
      },
      {
        didIt: "unanswered",
        points: 1,
        date: "2024-05-28T08:52:05.498+00:00",
        _id: "record_695",
      },
      {
        didIt: "yes",
        points: 1,
        date: "2024-05-29T08:52:05.498+00:00",
        _id: "record_696",
      },
      {
        didIt: "no",
        points: 1,
        date: "2024-05-30T08:52:05.498+00:00",
        _id: "record_697",
      },
      {
        didIt: "unanswered",
        points: 1,
        date: "2024-05-31T08:52:05.498+00:00",
        _id: "record_698",
      },
      {
        didIt: "yes",
        points: 1,
        date: "2024-06-01T08:52:05.498+00:00",
        _id: "record_699",
      },
    ];

    // Mock today's date as June 1, 2024
    const mockDate = new Date("2024-06-01T08:52:05.498+00:00");
    vi.setSystemTime(mockDate);

    const result = prepareLastSevenDayView([
      ...lastSevenDaysInput,
      ...dailyRecords,
    ]);
    expect(result).toEqual([
      { weekday: "Su", didIt: true, date: 26 },
      { weekday: "Mo", didIt: false, date: 27 },
      { weekday: "Tu", didIt: null, date: 28 },
      { weekday: "We", didIt: true, date: 29 },
      { weekday: "Th", didIt: false, date: 30 },
      { weekday: "Fr", didIt: null, date: 31 },
      { weekday: "Sa", didIt: true, date: 1 },
    ]);

    vi.useRealTimers(); // Reset the mock timer
  });
});
