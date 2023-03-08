import { EventType, Site } from "@prisma/client";
import { FC } from "react";
import { api } from "../utils/api";
import useLocation from "../utils/hooks/useLocation";

type ClockInProps = {
  onClockedIn?: () => void;
};

type ClockStateProps = {
  siteId: string;
} & ClockInProps;

const ClockedOut: FC<ClockStateProps> = ({ siteId, onClockedIn }) => {
  const location = useLocation();
  const clockInMutation = api.timeClock.clockIn.useMutation();

  return (
    <button
      className="rounded-md bg-sky-200 hover:bg-sky-300 transition duration-300 ease-in-out px-4 py-3"
      onClick={async () => {
        await clockInMutation.mutateAsync({
          lat: location.latitude,
          lon: location.longitude,
          siteId,
        });
        onClockedIn?.();
      }}
    >
      Clock In
    </button>
  );
};

export type TimeClockProps = {
  site: Site;
  onClockOut?: () => void;
} & ClockInProps;

const TimeClock: FC<TimeClockProps> = ({ site, onClockedIn, onClockedOut }) => {
  const lastClockStateQuery = api.timeClock.getLastClockState.useQuery();
    
  if (lastClockStateQuery.data) {
    const lastClockState = lastClockStateQuery.data;
    switch (lastClockState.type) {
      case EventType.START_TRAVEL: {
        return (<></>);
      }
      case EventType.STOP_TRAVEL: {
        return (<></>);
      }
      case EventType.CLOCK_IN: {
        return (<></>);
      }
      case EventType.CLOCK_OUT: {
        return <ClockedOut siteId={site.id} />;
      }
      case EventType.BREAK_IN: {
        return (<></>);
      }
      case EventType.BREAK_OUT: {
        return (<></>);
      }
    }
    
  } else return <ClockedOut siteId={site.id} onClockedIn={onClockedIn} />;
}

export default TimeClock;
