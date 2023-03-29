import { 
  faArrowLeft,
  faMapPin,
  faPencil
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Event, EventType, Site } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { FC, useState } from "react";
import AdminHeader from "../../../../components/AdminHeader";
import MapTile from "../../../../components/MapTile";
import PageLayout from "../../../../components/PageLayout";
import { getServerAuthSession } from "../../../../server/auth";
import { prisma } from "../../../../server/db";
import { api } from "../../../../utils/api";
import { StrippedUser } from "../../../../utils/stripSensitiveValues";
import dateFormat from 'dateformat';
import { groupEvents } from "../../../../utils/eventGrouping";
import { formatDuration } from "../../../../utils/formatDuration";
import { calculateTimeWorked } from "../../../../utils/calculateTime";

type UserEventProps = {
  event: Event & {
    site: Site;
  };
};

const UserEvent: FC<UserEventProps> = ({ event }) => {
  const [open, setOpen] = useState(false);

  let action = '';
  switch (event.type) {
    case EventType.CLOCK_IN:
      action = "Clocked in at";
      break;
    case EventType.CLOCK_OUT:
      action = "Clocked out at";
      break;
    case EventType.BREAK_IN:
      action = "Started their lunch at";
      break;
    case EventType.BREAK_OUT:
      action = "Ended their lunch at";
      break;
    case EventType.START_TRAVEL:
      action = "Started transit at";
      break;
    case EventType.STOP_TRAVEL:
      action = "Stopped transit at";
      break;
  }

  return (
    <div
      className="rounded-md bg-sky-200 px-2 py-1.5 flex flex-col gap-1.5"
    >
      <div className="flex items-center">
        <span>
          {action + ' '}
          <Link href={`/admin/sites/${event.siteId}`} className="font-bold">
            {event.site.name ?? event.site.address}
          </Link>
        </span>
        <div className="flex-grow" />
        <FontAwesomeIcon
          className="cursor-pointer"
          onClick={() => setOpen(!open)}
          icon={faMapPin}
          fixedWidth
        />
      </div>
      {open && <MapTile lat={event.lat} lon={event.lon} />}
    </div>
  );
};


type ViewUserPageProps = {
  user: StrippedUser;
};

const ViewUserPage: NextPage<ViewUserPageProps> = ({ user }) => {
  const userEventsQuery = api.admin.getEventsForUser.useQuery({
    userId: user.id
  });

  return (
    <>
      <Head>
        <title>User {user.username} - Sundial Admin</title>
        <meta name="theme-color" content="#bae6fd" />
      </Head>
      <PageLayout>
        <AdminHeader>
          <div className="flex flex-row gap-4">
            <Link
              href="/admin/users"
              className="btn-primary p-3"
            >
              <FontAwesomeIcon fixedWidth icon={faArrowLeft} />
            </Link>

            <div className="flex flex-grow flex-col">
              <span className="font-bold">
                Viewing {user.username}
                {user.admin && " (admin)"}
              </span>
              <span className="text-sm">{user.id}</span>
            </div>
            
            <Link
              href={`/admin/users/${user.id}/edit`}
              className="btn-primary p-3"
            >
              <FontAwesomeIcon fixedWidth icon={faPencil} />
            </Link>
          </div>
        </AdminHeader>
        <div className="flex flex-grow flex-col p-4 gap-4">
          <div className="flex-grow">
            <div className="flex flex-col gap-4">
              {userEventsQuery.data && groupEvents(userEventsQuery.data).map(
                (eventGroup, index) => <div 
                  className="flex flex-col"
                  key={index}
                >
                  <h2 className="text-xl mb-4">
                    {dateFormat(
                      eventGroup.events[0]!.time,
                      "dddd, mmmm d, yyyy"
                    )}
                    {' - '}
                    {formatDuration(calculateTimeWorked(eventGroup))}
                  </h2>
                  
                  <div className="flex flex-col gap-2">
                    {eventGroup.events.map(event => 
                      <UserEvent
                        event={event}
                        key={event.id}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  ViewUserPageProps
> = async ({ params, req, res }) => {
  // admins only
  const session = await getServerAuthSession({ req, res });
  if (!session?.user.admin)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  const userId = params!.id as string;

  // look user up in db
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user)
    return {
      notFound: true,
    };

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
    },
  };
};

export default ViewUserPage;
