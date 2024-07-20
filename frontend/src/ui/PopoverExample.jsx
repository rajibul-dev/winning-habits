import Button from "./Button.jsx";
import Popover from "./Popover.jsx";

export default function PopoverExample() {
  return (
    <Popover placementX="center" placementY="top">
      <Popover.Trigger triggerType="click" id="example">
        <Button>Open</Button>
      </Popover.Trigger>
      <Popover.Content id="example">
        This is right in the middle
      </Popover.Content>
    </Popover>
  );
}
