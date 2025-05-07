
import { _decorator, Component, Node } from 'cc';
import { ITile } from '../../DATA/Levels';
import SingleTon from '../Base/SingleTon';
const { ccclass, property } = _decorator;



@ccclass('DataManager')
export default class DataManager extends SingleTon{
    static get Instance(){
        return super.getInstance<DataManager>()
    }
    mapInfo:Array<Array<ITile>>
    mapRowCount:number = 0      //
    mapColumnCount:number = 0
    levelIndex:number = 1   //当前关卡index

    reset(){
        this.mapInfo = []
        this.mapRowCount = 0
        this.mapColumnCount = 0
    }
}



