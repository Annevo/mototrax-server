import * as firebase from "firebase-admin"
import * as functions from "firebase-functions"

firebase.initializeApp(functions.config().firebase)

module.exports = firebase
