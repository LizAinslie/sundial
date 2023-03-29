import { Event } from "@prisma/client";

export type TypedEventArray<T = {}> = (Event & T)[];
export type TypedEventGroup<T = {}> = { 
  date: Date;
  events: TypedEventArray<T>;
};

export function groupEvents<T = {}>(events: TypedEventArray<T>): 
  TypedEventGroup<T>[] {
  const groups = events.reduce((groups, event) => {
    const date = event.time;
    if (!groups[date.getDate().toString()]) {
      groups[date.getDate().toString()] = [];
    }
    groups[date.getDate().toString()]!.push(event);
    return groups;
  }, {} as Record<string, TypedEventArray<T>>);

  const groupArrays = Object.keys(groups).map((date) => {
    const events = groups[date]!!
    return {
      date: events[0]!.time,
      events,
    };
  });

  return groupArrays;
}
