import { EventType, Site } from "@prisma/client";
import { FC } from "react";
import { api } from "../utils/api";
import useLocation from "../utils/hooks/useLocation";
import moment from "moment";
import "moment-duration-format";
import ReactTimeago from "react-timeago";

moment

type ClockInProps = {
  onClockedIn?: () => void;
};

type ClockOutProps = {
  onClockedOut?: () => void;
};

type ClockStateProps = {
  onStateChange: () => void;
  siteId: string;
  time: Date,
};

const ClockedOut: FC<Omit<ClockStateProps, 'time'> & ClockInProps> = ({ siteId, onClockedIn, onStateChange }) => {
  const location = useLocation();
  const clockInMutation = api.timeClock.clockIn.useMutation({
    onSuccess() {
      onStateChange?.();
      onClockedIn?.();
    },
  });

  return (
    <button
      className="rounded-md bg-sky-200 hover:bg-sky-300 transition duration-300 ease-in-out px-4 py-3"
      onClick={async () => {
        await clockInMutation.mutateAsync({
          lat: location.latitude,
          lon: location.longitude,
          siteId,
        });
      }}
    >
      Clock In
    </button>
  );
};

const ClockedIn: FC<ClockStateProps & ClockOutProps> = ({ time, siteId, onClockedOut, onStateChange }) => {
  console.log(time)
  const location = useLocation();
  const clockOutMutation = api.timeClock.clockOut.useMutation({
    onSuccess() {
      onStateChange?.();
      onClockedOut?.();
    },
  });
  const startTravelMutation = api.timeClock.startTravel.useMutation({
    onSuccess() {
      onStateChange?.();
    },
  });
  const startBreakMutation = api.timeClock.startBreak.useMutation({
    onSuccess() {
      onStateChange?.();
    },
  });
  
  return (
    <div className="rounded-lg p-4 bg-sky-200 flex flex-col gap-4">
      <div className="flex gap-4 items-end">
        <span className="text-lg font-bold">Clocked In</span>
        <span className="text-sky-700"><ReactTimeago date={time} /></span>
      </div>
      <button
        className="rounded-md bg-sky-200 hover:bg-sky-300 transition duration-300 ease-in-out px-4 py-3"
        onClick={async () => {
          await clockOutMutation.mutateAsync({
            lat: location.latitude,
            lon: location.longitude,
            siteId,
          });
        }}
      >
        Clock Out
      </button>
      <button
        className="rounded-md bg-sky-200 hover:bg-sky-300 transition duration-300 ease-in-out px-4 py-3"
        onClick={async () => {
          await startTravelMutation.mutateAsync({
            lat: location.latitude,
            lon: location.longitude,
            siteId,
          });
        }}
      >
        Start Travel
      </button>
      <button
        className="rounded-t-md bg-sky-200 hover:bg-sky-300 transition duration-300 ease-in-out px-4 py-3"
        onClick={async () => {
          await startBreakMutation.mutateAsync({
            lat: location.latitude,
            lon: location.longitude,
            siteId,
          });
        }}
      >
        Start Lunch
      </button>
    </div>
  );
};

const OnBreak: FC<ClockStateProps & ClockOutProps> = ({ time, siteId, onClockedOut, onStateChange }) => {
  const location = useLocation();
  const stopBreakMutation = api.timeClock.stopBreak.useMutation({
    onSuccess(_, variables) {
      onStateChange?.();
      if (variables.clockOut) onClockedOut?.();
    },
  }); 

  return (
    <div className="rounded-lg p-4 bg-sky-200 flex flex-col gap-4">
      <div className="flex gap-4 items-end">
        <span className="text-lg font-bold">On Break</span>
        <span className="text-sky-700"><ReactTimeago date={time} /></span>
      </div>
      <button
        className="rounded-md bg-sky-200 hover:bg-sky-300 transition duration-300 ease-in-out px-4 py-3"
        onClick={async () => {
          await stopBreakMutation.mutateAsync({
            lat: location.latitude,
            lon: location.longitude,
            siteId,
          });
        }}
      >
        End Break & Clock In
      </button>
      <button
        className="rounded-md bg-sky-200 hover:bg-sky-300 transition duration-300 ease-in-out px-4 py-3"
        onClick={async () => {
          await stopBreakMutation.mutateAsync({
            lat: location.latitude,
            lon: location.longitude,
            siteId,
            clockOut: true,
          });
        }}
      >
        End Break & Clock Out
      </button>
    </div>
  );
};

const OnTravel: FC<ClockStateProps & ClockOutProps> = ({ time, siteId, onClockedOut, onStateChange }) => {
  const location = useLocation();
  const stopTravelMutation = api.timeClock.stopTravel.useMutation({
    onSuccess(_, variables) {
      onStateChange?.();
      if (variables.clockOut) onClockedOut?.();
    },
  }); 

  return (
    <div className="rounded-lg p-4 bg-sky-200 flex flex-col gap-4">
      <div className="flex gap-4 items-end">
        <span className="text-lg font-bold">In Transit</span>
        <span className="text-sky-700"><ReactTimeago date={time} /></span>
      </div>
      <button
        className="rounded-md bg-sky-200 hover:bg-sky-300 transition duration-300 ease-in-out px-4 py-3"
        onClick={async () => {
          await stopTravelMutation.mutateAsync({
            lat: location.latitude,
            lon: location.longitude,
            siteId,
          });
        }}
      >
        End Travel & Clock In
      </button>
      <button
        className="rounded-md bg-sky-200 hover:bg-sky-300 transition duration-300 ease-in-out px-4 py-3"
        onClick={async () => {
          await stopTravelMutation.mutateAsync({
            lat: location.latitude,
            lon: location.longitude,
            siteId,
            clockOut: true,
          });
          onClockedOut?.();
        }}
      >
        End Travel & Clock Out
      </button>
    </div>
  );
};


export type TimeClockProps = {
  site: Site;
} & ClockInProps & ClockOutProps;

const TimeClock: FC<TimeClockProps> = ({ site, onClockedIn, onClockedOut }) => {
  const lastClockStateQuery = api.timeClock.getLastClockState.useQuery();
    
  if (lastClockStateQuery.data) {
    const lastClockState = lastClockStateQuery.data;
    switch (lastClockState.type) {
      case EventType.START_TRAVEL: {
        return <OnTravel 
          siteId={site.id}
          time={lastClockState.time}
          onClockedOut={() => {
            onClockedOut?.();
          }}
          onStateChange={() => {
            lastClockStateQuery.refetch();
          }}
        />;
      }
      case EventType.STOP_TRAVEL: {
        return <ClockedIn
          siteId={site.id}
          time={lastClockState.time}
          onClockedOut={() => {
            onClockedOut?.();
          }}
          onStateChange={() => {
            lastClockStateQuery.refetch();
          }}
        />;
      }
      case EventType.CLOCK_IN: {
        return <ClockedIn
          siteId={site.id}
          time={lastClockState.time}
          onClockedOut={() => {
            onClockedOut?.();
          }}
          onStateChange={() => {
            lastClockStateQuery.refetch();
          }}

        />;
      }
      case EventType.CLOCK_OUT: {
        return <ClockedOut
          siteId={site.id}
          onClockedIn={() => {
            onClockedIn?.();
          }}
          onStateChange={() => {
            lastClockStateQuery.refetch();
          }}

        />;
      }
      case EventType.BREAK_IN: {
        return <ClockedIn
          siteId={site.id}
          time={lastClockState.time}
          onClockedOut={() => {
            onClockedOut?.();
          }}
          onStateChange={() => {
            lastClockStateQuery.refetch();
          }}
        />;
      }
      case EventType.BREAK_OUT: {
        return <OnBreak
          siteId={site.id}
          time={lastClockState.time}
          onClockedOut={() => {
            onClockedOut?.();
          }}
          onStateChange={() => {
            lastClockStateQuery.refetch();
          }}
        />;
      }
    } 
  } else return <ClockedOut
    siteId={site.id}
    onClockedIn={onClockedIn}
    onStateChange={() => {
      lastClockStateQuery.refetch();
    }}
  />;
}

export default TimeClock;
