
import { _decorator, Component, Node } from 'cc';
import { ITile } from '../../DATA/Levels';
import SingleTon from '../Base/SingleTon';
const { ccclass, property } = _decorator;

interface IItem{
    func: Function
    ctx: unknown    //上下文
}

@ccclass('EventManager')
export default class EventManager extends SingleTon{
    static get Instance(){
        return super.getInstance<EventManager>()
    }
    private eventDic : Map<string,Array<IItem>> = new Map()


    //注册事件
    on(eventName:string, func:Function, ctx: unknown){
        if(this.eventDic.has(eventName)){
            this.eventDic.get(eventName).push({func,ctx})
        }
        else{
            this.eventDic.set(eventName,[{func,ctx}])
        }
    }

    //注销事件
    off(eventName:string, func:Function){
        if(this.eventDic.has(eventName)){
            const index = this.eventDic.get(eventName).findIndex(i => i.func === func)
            index >-1 && this.eventDic.get(eventName).splice(index, 1)  //短路判断，如果index>-1就删除
        }
    }

    //触发事件
    emit(eventName:string, ...params: unknown[]){
        if(this.eventDic.has(eventName)){
            this.eventDic.get(eventName).forEach(({func,ctx})=>{
                ctx?func.apply(ctx,params):func(...params)
            })
        }
    }

    //清除事件
    clear(){
        this.eventDic.clear()
    }
}



