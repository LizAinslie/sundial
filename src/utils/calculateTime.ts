import { TypedEventGroup } from "./eventGrouping";
import { Event, EventType } from "@prisma/client";

export function calculateTimeWorked<T = {}>(group: TypedEventGroup<T>): number {
  let milliseconds = 0;

  let currentPayStartEvent: (Event & T) | null = null;
  for (const event of group.events) {
    switch (event.type) {
      case EventType.CLOCK_IN: {
        currentPayStartEvent = event;
        break;
      }
      case EventType.CLOCK_OUT: {
        if (!currentPayStartEvent) continue;
        milliseconds += (event.time.getTime() 
          - currentPayStartEvent!.time.getTime());
        currentPayStartEvent = null;
        break;
      }
      case EventType.BREAK_OUT: {
        if (!currentPayStartEvent) continue;
        milliseconds += (event.time.getTime() 
          - currentPayStartEvent!.time.getTime());
        currentPayStartEvent = null;
        break;
      }
      case EventType.BREAK_IN: {
        currentPayStartEvent = event;
        break;
      }
    }
  }

  return milliseconds;
};
