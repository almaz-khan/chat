"use client";

import axios from "axios";
import { Check, UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequest[];
  sesstionId: string;
}

const FriendRequests: FC<FriendRequestsProps> = ({
  incomingFriendRequests,
  sesstionId,
}) => {
  const router = useRouter();
  const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
    incomingFriendRequests
  );

  const acceptFriend = async (senderId: string) => {
    await axios.post("/api/friends/accept", { id: senderId });

    setFriendRequests((prev) =>
      prev.filter((req) => req.senderId !== senderId)
    );
  };

  const denyFriend = async (senderId: string) => {
    await axios.post("/api/friends/deny", { id: senderId });

    setFriendRequests((prev) =>
      prev.filter((req) => req.senderId !== senderId)
    );
  };

  return (
    <>
      {friendRequests.length === 0 ? (
        <div className="text-sm">Nothing to show here</div>
      ) : (
        friendRequests.map((friendRequest) => {
          return (
            <div
              key={friendRequest.senderId}
              className="flex gap4 items-center"
            >
              <UserPlus className="text-black" />
              <p className="font-mdeium text-lg">{friendRequest.senderEmail}</p>
              <button
                onClick={() => acceptFriend(friendRequest.senderId)}
                arai-label="accept friend"
                className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md"
              >
                <Check className="font-semibold text-white w-3/4 h-3/4" />
              </button>
              <button
                onClick={() => denyFriend(friendRequest.senderId)}
                arai-label="deny friend"
                className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
              >
                <X className="font-semibold text-white w-3/4 h-3/4" />
              </button>
            </div>
          );
        })
      )}
    </>
  );
};

export default FriendRequests;
