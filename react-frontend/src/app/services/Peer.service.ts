
export class PeerService {

    peer: RTCPeerConnection | undefined ;

    constructor() {
        this.initilizePeer();
    }

    initilizePeer(){
        this.peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        "stun:stun.l.google.com:19302",
                        "stun:global.stun.twilio.com:3478",
                    ]
                }
            ]
        })
    }

    async getOffer() {
        if(this.peer){
            const offer = await this.peer.createOffer();
            await this.peer.setLocalDescription(new RTCSessionDescription(offer));
            return offer;
        }
    }
    
    async getAnswer(offer: RTCSessionDescriptionInit) {
        if(this.peer){
            await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
            const ans: RTCSessionDescriptionInit  = await this.peer.createAnswer();
            await this.peer.setLocalDescription(new RTCSessionDescription(ans));//ye
            return ans;
        }
    }   

    async setRemoteDescription(ans: RTCSessionDescriptionInit) {
        if(this.peer){
            await this.peer.setRemoteDescription(new RTCSessionDescription(ans))//ye
        }
    }

    closeConnection() {
        if(this.peer){
            this.peer.close();
        }
    }
}