import Popover from "../../ui/Popover.jsx";
import styled from "styled-components";
import { isSameDay, format } from "date-fns";
import Heading from "../../ui/Heading.jsx";
import useSingleHabit from "./useSingleHabit.js";
import Tag from "../../ui/Tag.jsx";

interface CustomDayComponentProps {
  date: any;
  dailyRecords: Array<{
    date: string;
    didIt: "yes" | "no" | "unanswered";
  }>;
  habitID: any;
}

export interface TagProps {
  type: "green" | "red" | "silver";
}

// @ts-ignore
const StyledDay = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`;

const HeadingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const tagColorBasedOnAnswer: Record<string, "green" | "red" | "silver"> = {
  yes: "green",
  no: "red",
  unanswered: "silver",
};

const CustomDayComponent: React.FC<CustomDayComponentProps> = ({
  date,
  dailyRecords,
  habitID,
}) => {
  const currentRecordInstence = dailyRecords.find((record: any) =>
    isSameDay(new Date(record.date), date),
  );
  const { data } = useSingleHabit();
  const { name } = data.habit;

  const hasRecordForDate = Boolean(currentRecordInstence);

  return (
    <Popover
      placementX={"center" as string}
      placementY={"top" as string}
      triggerType={"click" as string}
    >
      <Popover.Trigger id={date.getDate() as number}>
        <StyledDay>{date.getDate()}</StyledDay>
      </Popover.Trigger>
      <Popover.Content id={date.getDate() as number}>
        {hasRecordForDate ? (
          <HeadingRow>
            <Heading as="h3">
              {name} on {format(date, "MMM dd, yyyy")}
            </Heading>
            <Tag
              // @ts-ignore
              type={
                // @ts-ignore
                tagColorBasedOnAnswer[
                  currentRecordInstence?.didIt ?? "silver"
                ] as "green" | "red" | "silver"
              }
            >
              {currentRecordInstence?.didIt ?? ""}
            </Tag>
          </HeadingRow>
        ) : (
          <></>
        )}
      </Popover.Content>
    </Popover>
  );
};

export default CustomDayComponent;
