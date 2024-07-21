import { type DayContentProps } from "react-day-picker";
import Popover from "../../ui/Popover.jsx";
import styled from "styled-components";

// @ts-ignore
const StyledDay = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`;

export default function CustomDayComponent(props: DayContentProps) {
  return (
    <Popover
      placementX={"center" as string}
      placementY={"top" as string}
      triggerType={"click" as string}
    >
      <Popover.Trigger id={props.date.getDate() as number}>
        <StyledDay>{props.date.getDate()}</StyledDay>
      </Popover.Trigger>
      <Popover.Content id={props.date.getDate() as number}>.</Popover.Content>
    </Popover>
  );
}
