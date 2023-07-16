import {HttpRequest} from "@/components/code/HttpRequest";
import EventBus from "@/components/code/EventBusEvent";

export class Engine {

    engineUrl = "http://localhost:8787/api/engine?key=iRK4yPoX9Wc4eKwuTwKzRsPYehC60dY0"
    registerUrl = "http://localhost:8787/api/register?key=iRK4yPoX9Wc4eKwuTwKzRsPYehC60dY0"
    add = "&mode=add"
    remove = "&mode=remove"

    http = new HttpRequest()

    remover(str: String, charToRemove: any) {
        const regex = new RegExp(charToRemove, 'g');
        return str.replace(regex, '');
    }

    getPlayers(){
        this.http.httpRequest(
            this.engineUrl + "&mode=players",
        ).then(r =>
            this.analysePlayers(r)
        );
    }

    analysePlayers(json: any){
        if(json === undefined){
            //EventBus.emit("players", names)
        }else{
            let data = JSON.stringify(json.info)
            data = this.remover(data, '"')
            let split = data.split(";;;")
            let names = []
            for(let i = 0; i < split.length; i++){
                names.push(split[i])
            }
            EventBus.emit("players", names)
        }
    }

    registerPlayer(name: string){
        console.log(this.registerUrl + "&name=" + name + this.add)
        this.http.httpRequestPost(
            this.registerUrl + this.add, name,
        ).then(r =>
            this.analysePlayers(r)
        );
    }

    removePlayer(name: string){
        this.http.httpRequestPost(
            this.registerUrl + this.remove, name,
        ).then(r =>
            this.analysePlayers(r)
        );
    }

    isStarted(){
        this.http.httpRequest(
            this.engineUrl + "&mode=started",
        ).then(r =>
            this.analyseStarted(r)
        );
    }

    isStop(){
        this.http.httpRequest(
            this.engineUrl + "&mode=started",
        ).then(r =>
            this.analyseStop(r)
        );
    }

    analyseStarted(json: any){
        if(json.info === false){
            EventBus.emit("game-start", false)
        }else if(json.info === true){
            EventBus.emit("game-start", true)
        }
    }

    analyseStop(json: any){
        if(json.info === false){
            EventBus.emit("is-running", false)
        }else if(json.info === true){
            EventBus.emit("is-running", true)
        }
    }

    startGame(){
        this.http.httpRequest(
            this.engineUrl + "&mode=start",
        ).then(r =>
            this.nothing()
        );
    }

    stopGame(){
        this.http.httpRequest(
            this.engineUrl + "&mode=stop",
        ).then(r =>
            this.nothing()
        );
    }

    nothing(){

    }

}