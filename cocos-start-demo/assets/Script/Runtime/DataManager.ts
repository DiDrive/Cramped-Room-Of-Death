
import { _decorator, Component, Node } from 'cc';
import { ITile } from '../../DATA/Levels';
import SingleTon from '../Base/SingleTon';
import { TileManager } from '../Tile/TileManager';
const { ccclass, property } = _decorator;



@ccclass('DataManager')
export default class DataManager extends SingleTon{
    static get Instance(){
        return super.getInstance<DataManager>()
    }
    mapInfo:Array<Array<ITile>>
    tileInfo:Array<Array<TileManager>>
    mapRowCount:number = 0
    mapColumnCount:number = 0
    levelIndex:number = 1   //当前关卡index

    reset(){
        this.mapInfo = []
        this.tileInfo = []
        this.mapRowCount = 0
        this.mapColumnCount = 0
    }
}



