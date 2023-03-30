import { Event } from "@prisma/client";
import moment from "moment";

export type TypedEventArray<T = {}> = (Event & T)[];
export type TypedEventGroup<T = {}> = { 
  date: Date;
  events: TypedEventArray<T>;
};

export function groupEventsByWeek<T = {}>(events: TypedEventArray<T>): 
  TypedEventGroup<T>[] {
  const groups = events.reduce((groups, event) => {
    const date = event.time;
    const yearWeek = `${moment(date).year()}-${moment(date).week()}`;
    if (!groups[yearWeek]) groups[yearWeek] = [];
    groups[yearWeek]!.push(event);
    return groups;
  }, {} as Record<string, TypedEventArray<T>>);

  const groupArrays = Object.keys(groups).map((date) => {
    const events = groups[date]!!;
    return {
      date: events[0]!.time,
      events,
    };
  });

  return groupArrays;
}

export function groupEventsByDay<T = {}>(events: TypedEventArray<T>): 
  TypedEventGroup<T>[] {
  const groups = events.reduce((groups, event) => {
    const date = event.time.getDate();
    if (!groups[date]) groups[date] = [];
    groups[date]!.push(event);
    return groups;
  }, {} as Record<string, TypedEventArray<T>>);

  const groupArrays = Object.keys(groups).map((date) => {
    const events = groups[date]!!;
    return {
      date: events[0]!.time,
      events,
    };
  });

  return groupArrays;
}
