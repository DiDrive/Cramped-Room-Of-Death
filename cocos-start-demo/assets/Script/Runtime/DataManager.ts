import { _decorator, Component, Node } from 'cc';
import { ITile } from '../../DATA/Levels';
import SingleTon from '../Base/SingleTon';
import { TileManager } from '../Tile/TileManager';
import { PlayerManager } from '../Player/PlayerManager';
import { DoorManager } from '../Door/DoorManager';
import { EnemyManager } from '../Base/EnemyManager';
import { BurstManager } from '../Burst/BurstManager';
import { SpikesManager } from '../Spikes/SpikesManager';
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
    door:DoorManager
    burst:BurstManager[]
    enemies:EnemyManager[]
    spikes:SpikesManager[]

    reset(){
        this.mapInfo = []
        this.tileInfo = []
        this.enemies = []
        this.burst = []
        this.spikes = []
        this.player = null
        this.door = null
        this.mapRowCount = 0
        this.mapColumnCount = 0
    }
}



