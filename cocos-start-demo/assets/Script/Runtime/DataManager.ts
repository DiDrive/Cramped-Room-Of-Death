
import { _decorator, Component, Node } from 'cc';
import { ITile } from '../../DATA/Levels';
import SingleTon from '../Base/SingleTon';
import { TileManager } from '../Tile/TileManager';
import { PlayerManager } from '../Player/PlayerManager';
import { WoodenSkeletonManager } from '../WoodenSkeleton/WoodenSkeletonManager';
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
    player:PlayerManager
    enemies:WoodenSkeletonManager[]

    reset(){
        this.mapInfo = []
        this.tileInfo = []
        this.enemies = []
        this.player = null
        this.mapRowCount = 0
        this.mapColumnCount = 0
    }
}



