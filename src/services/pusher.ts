import Pusher from "pusher";
const pusherAppId = process.env.PUSHER_APP_ID;
const pusherAppKey = process.env.PUSHER_APP_KEY;
const pusherAppSecret = process.env.PUSHER_APP_SECRET;
const pusherAppCluster = process.env.PUSHER_APP_CLUSTER;

if (!pusherAppId || !pusherAppKey || !pusherAppSecret || !pusherAppCluster) {
  throw new Error(
    "Pusher environment variables not set. Please set them in your .env file."
  );
}

export const pusher = new Pusher({
  appId: pusherAppId,
  key: pusherAppKey,
  secret: pusherAppSecret,
  cluster: "us3",
  useTLS: true,
});
