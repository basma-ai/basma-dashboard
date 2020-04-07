<template>
  <div>
    <div class="call_box">
<!--      <div id="local-media" v-if="!isItIos">-->
      <div id="local-media">
<!--        <CamPreview v-if="localCamIsEnabled"></CamPreview>-->
      </div>
      <div id="remote-media-div"></div>
      <div id="controls">
        <div @click="toggle_mute_camera">
          <vs-button radius icon="videocam" type="filled" color="primary" v-if="localCamIsEnabled"></vs-button>
          <vs-button radius icon="videocam_off" type="filled" color="danger" v-if="!localCamIsEnabled"></vs-button>
        </div>
        <div @click="toggle_mute_mic">
          <vs-button radius icon="volume_up" type="filled" color="primary" v-if="localMicIsEnabled"></vs-button>
          <vs-button radius icon="volume_off" type="filled" color="danger" v-if="!localMicIsEnabled"></vs-button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
  import Vue from 'vue'
  import CamPreview from '@/components/CamPreview.vue';
  import {isIOS} from 'mobile-device-detect';

  const {connect, createLocalTracks, createLocalVideoTrack, LocalVideoTrack} = require('twilio-video');

  export default {
    props: ['connection_token', 'room_name'],
    data: () => ({
      found_remote_track: false,
      isItIos: isIOS,
      localTrack: false,
      remoteTrack: '',
      activeRoom: '',
      previewTracks: '',
      room: null,
      localCamIsEnabled: true,
      localMicIsEnabled: true
    }),
    components: {CamPreview},
    methods: {
      toggle_mute_camera: function () {

        let this_app = this;

        if (undefined != this.localTracks) {
          this.localTracks.forEach((track) => {
            console.log('In mute function code');
            console.log(JSON.stringify(track));
            try{
              if(track.kind == 'video') {
                if (track.isEnabled) {
                  track.disable();
                  this_app.localCamIsEnabled = false;
                } else {
                  track.enable();
                  this_app.localCamIsEnabled = true;
                }
              }
            } catch(ex) {
              console.log(ex.toString());
            }
          })
        }


      },
      toggle_mute_mic: function () {

        let this_app = this;

        this.localTracks.forEach((track) => {
          console.log('In mute function code');
          console.log(JSON.stringify(track));
          try{
            if(track.kind == 'audio') {
              if (track.isEnabled) {
                track.disable();
                this_app.localMicIsEnabled = false;
              } else {
                track.enable();
                this_app.localMicIsEnabled = true;
              }
            }
          } catch(ex) {
            console.log(ex.toString());
          }
        })

      },
      end_call: function () {
        let this_app = this;

        if (this.room != null) {
          this.room.disconnect();
          this.room = null;
        }

        this.localTracks.forEach((track) => {
          console.log('In mute function code');
          console.log(JSON.stringify(track));
          try{
              if (track.isEnabled) {
                track.disable();
                track.stop();
                const attachedElements = track.detach();
                attachedElements.forEach(element => element.remove());
                this_app.localMicIsEnabled = false;
              } else {
                track.enable();
                this_app.localMicIsEnabled = true;
              }
          } catch(ex) {
            console.log(ex.toString());
          }
        })
      },
      check_remote: function (room) {

        let this_app = this;
        room.participants.forEach(participant => {

          console.log("PARTICIPANT");
          console.log(JSON.stringify(participant));


          if (!this_app.found_remote_track) {
          }
          console.log(`Participant "${participant.identity}" is connected to the Room`);

          setTimeout(function () {
            participant.tracks.forEach(publication => {

              console.log("PUBLICATION");
              console.log(JSON.stringify(publication));

              if (publication.isSubscribed) {

                console.log("I am inside IF(publication.isSubscribed)");
                const track = publication.track;

                if (track == null) {
                  console.log("track is null");
                  this_app.check_remote(room);
                } else {
                  console.log("track is not null");
                  this_app.found_remote_track = true;
                  //document.getElementById('remote-media-div').innerHTML = "";
                  document.getElementById('remote-media-div').appendChild(track.attach());
                }


              } else {
                console.log("I am inside ELSE(publication.isSubscribed)");
                this_app.check_remote(room);
              }
            });
          }, 5000);

        });
      }
    }
    ,
    created() {

      // check if isIos
      if (process.client) {
        this.isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      }

      let token = this.connection_token;

      let this_app = this;

      createLocalTracks({
        audio: true,
        video: {width: 640}
      }).then(localTracks => {

        this_app.localTracks = localTracks;
        return connect(token, {
          name: this.room_name,
          tracks: localTracks
        });


      }).then(room => {
        console.log(`Connected to Room: ${room.name}`);
        // console.log(JSON.stringify(room));

        room.localParticipant.tracks.forEach((a)=>{
          console.log('room.localParticipant.tracks',a)
          if(a.kind === "video"){
            const localMediaContainer = document.getElementById("local-media");
            localMediaContainer.innerHTML = "";
            localMediaContainer.prepend(a.track.attach());
          }
        })

        console.log("PARTICIPANTS");
        this_app.room = room;
        this_app.check_remote(room);


        // Attach the Participant's Media to a <div> element.
        room.on('participantConnected', participant => {
          console.log("A participant has been connected");
          console.log(`Participant "${participant.identity}" connected`);

          participant.tracks.forEach(publication => {
            if (publication.isSubscribed) {
              const track = publication.track;
              // document.getElementById('remote-media-div').innerHTML = "";
              document.getElementById('remote-media-div').appendChild(track.attach());
            }
          });

          participant.on('trackSubscribed', track => {
            document.getElementById('remote-media-div').appendChild(track.attach());
          });
        });

        // Attach the Participant's Media to a <div> element.
        room.on("participantDisconnected", (participant) => {
          console.log(`Participant disconnected: ${participant.identity}`);
          document.getElementById("remote-media-div").innerHTML = ""
        });

      });


    }
  }
</script>
<style>
  .call_box {
    width: inherit;
    background: #DDD;
    border: 1px solid #DDD;
    position: relative;
    height: inherit;
    background: #000;
    display: inline-block;
    min-height: 300px;
  }

  .call_box #controls {
    bottom: 0;
    position: absolute;
    right: 0;
    margin: 10px;
  }

  .call_box #controls button{
    margin-bottom: 3px;
  }

  #local-media {
    position: absolute;
    width: 100%;
  }

  #local-media video {
    max-width: 25%;
    max-height: 25%;
    float: left;
    left: 0;
    border-bottom: 1px solid #DDD;
    border-right: 1px solid #DDD;
  }

  #remote-media-div video {
    width: 100%;
    max-height: 600px;
    margin: 0;
    padding: 0;
    height: 100%;
    margin-bottom: -6px;
  }


</style>
