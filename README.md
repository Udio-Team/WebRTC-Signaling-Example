# Signaling (STUN) Server

This server runs on port 8080, and is designed to create peer to peer connections between users for the WebRTC-Example project. Once this server is running, your demo WebRTC project should be able to connect to it.

_Note: Don't forget to change the IP address in the WebRTC-Example to the IP address of the computer that you're running this server on. That configuration is found in the `Config.swift` file._

## Install
`git clone https://github.com/Udio-Team/WebRTC-Signaling-Example`
`cd WebRTC-Signaling-Example`
`yarn install`

## Run
`yarn start`