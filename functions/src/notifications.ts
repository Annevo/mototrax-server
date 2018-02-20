import * as Expo from "expo-server-sdk"

const { send } = require("micro")
const firebase = require("./firebase")

const expo = new Expo()

const db = firebase.database()
module.exports.register = async (req, res) => {
  const { token, user } = req.body

  return db
    .ref(`users/${user}/token`)
    .set(token)
    .then(() => send(res, 200, req.body))
    .catch(err => send(res, 500, err.toString()))
}

module.exports.sendUpdate = async event => {
  const status = event.data.val()
  const track = await db.ref(`tracks/${status.trackId}`).once("value")

  const tokens = await db
    .ref(`favorites/${event.params.trackId}`)
    .once("value")
    .then(snap => {
      const users = snap.val()

      return Promise.all(
        Object.keys(users || {})
          .filter(id => users[id]) // Only if favorited is true
          .map(userId =>
            db
              .ref(`users/${userId}/token`)
              .once("value")
              .then(token => token.val())
          )
      )
    })

  const messages = tokens.map(to => ({
    to,
    sound: "default",
    body: `${track.val().name} updated with a new status! \nTrack is ${
      status.open ? "open" : "closed"
    } with condition: ${status.condition}`,
    data: { withSome: "data" }
  }))

  return expo
    .chunkPushNotifications(messages)
    .map(async chunk => await expo.sendPushNotificationsAsync(chunk))
}
