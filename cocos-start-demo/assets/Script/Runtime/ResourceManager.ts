
import { _decorator, Component, Node, resources, SpriteFrame } from 'cc';
import { ITile } from '../../DATA/Levels';
import SingleTon from '../Base/SingleTon';
const { ccclass, property } = _decorator;



@ccclass('ResourceManager')
export default class ResourceManager extends SingleTon{
    static get Instance(){
        return super.getInstance<ResourceManager>()
    }

    loadDir(path : string, type : typeof SpriteFrame = SpriteFrame){
        return new Promise<SpriteFrame[]>((resolve,reject)=>{
            resources.loadDir(path, SpriteFrame, function (err, assets) {
                if(err){
                    reject(err)
                    return
                }
                resolve(assets)
            });

        })
    }
}



