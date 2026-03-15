import { useState } from "react";
import styled from "styled-components";
import apiClient from "../api/axiosConfig";
import useUser from "../features/authentication/useUser";

const Panel = styled.div`
  position: fixed;
  bottom: 20px;
  left: 300px;
  background: black;
  color: white;
  padding: 14px;
  border-radius: 10px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 16px;
`;

const Row = styled.div`
  display: flex;
  gap: 6px;
`;

const Button = styled.button`
  padding: 4px 12px;
  background: teal;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
`;

const DateInput = styled.input`
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 16px;
  color: black;
  font-weight: 600;
`;

export default function DevTimePanel() {
  const [date, setDate] = useState("");
  const { user } = useUser();
  const userID = user?.userID;

  if (import.meta.env.MODE !== "development") return null;

  const call = async (endpoint) => {
    await apiClient.post(`/dev/time/${endpoint}`);
    // reload the page to reflect the new time
    window.location.reload();
  };

  const setTime = async () => {
    await apiClient.post(`/dev/time/set-time`, { date });
    // reload the page to reflect the new time
    window.location.reload();
  };

  const createStreak = async () => {
    await apiClient.post(`/dev/habits/create-streak`, {
      userID,
    });
    window.location.reload();
  };

  return (
    <Panel>
      <div>Dev Time Controls</div>

      <Row>
        {/* lyf don go backward, what was I thinking */}
        {/* <button onClick={() => call("previous-day")}>-1 day</button> */}
        <Button onClick={() => call("next-day")}>+1 day</Button>
      </Row>

      <Row>
        <Button onClick={() => call("next-week")}>+1 week</Button>
        <Button onClick={() => call("next-month")}>+1 month</Button>
      </Row>

      <Row>
        <Button onClick={() => call("next-year")}>+1 year</Button>
      </Row>

      <Row>
        <Button onClick={() => call("reset")}>Reset</Button>
      </Row>

      <Row>
        <Button onClick={createStreak}>Create 50-day Streak Habit</Button>
      </Row>

      <Row>
        <DateInput
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Button onClick={setTime}>Set</Button>
      </Row>
    </Panel>
  );
}
