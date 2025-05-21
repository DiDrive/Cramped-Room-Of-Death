
import { _decorator, Component, Node } from 'cc';
import { TileMapManager } from '../Tile/TileMapManager';

import { creatUINode } from '../../utils';
import levels, { ILevel } from '../../DATA/Levels';
import DataManager from '../Runtime/DataManager';
import { TILE_HEIGTH, TILE_WIDTH } from '../Tile/TileManager';
import EventManager from '../Runtime/EventManager';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../../DATA/Enums';
import { PlayerManager } from '../Player/PlayerManager';
import { WoodenSkeletonManager } from '../WoodenSkeleton/WoodenSkeletonManager';
import { IronSkeletonManager } from '../IronSkeleton/IronSkeletonManager'
import { DoorManager } from '../Door/DoorManager';
import { BurstManager } from '../Burst/BurstManager';
import { SpikesManager } from '../Spikes/SpikesManager';
const { ccclass, property } = _decorator;



@ccclass('BattleManager')
export class BattleManager extends Component {
    level:ILevel
    stage:Node

    protected onLoad(): void {

        EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this)

    }
    protected onDestroy(): void {

        EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel)

    }

    start () {
        this.generateStage()
        this.initLevel()

    }

    initLevel(){
        const level = levels[`level${DataManager.Instance.levelIndex}`]
        if(level){
            this.clearLevel()
            this.level=level
            DataManager.Instance.mapInfo = this.level.mapInfo
            DataManager.Instance.mapRowCount = this.level.mapInfo.length
            DataManager.Instance.mapColumnCount = this.level.mapInfo[0].length
            this.generateTileMap()
            this.generateBurst()
            this.generateSpikes()
            this.generateDoor()
            this.generateEnemies()
            this.generatePlayer()

        }
    }

    nextLevel(){
        DataManager.Instance.levelIndex++
        this.initLevel()
        console.log(`当前关卡：第 ${DataManager.Instance.levelIndex} 关`, this.level)
    }


    //清除地图,重置数据,在切换关卡时调用
    clearLevel(){
        this.stage.destroyAllChildren()
        DataManager.Instance.reset()
    }

    generateStage(){
        this.stage = creatUINode()
        this.stage.setParent (this.node)
    }

    //生成地图
    async generateTileMap(){

        const tileMap = creatUINode()
        tileMap.setParent(this.stage)
        const tileMapManager = tileMap.addComponent(TileMapManager)
        await tileMapManager.init()
        this.adaptPos()
    }

    //生成玩家
    async generatePlayer(){
        const player = creatUINode()
        player.setParent(this.stage)
        const playerManager = player.addComponent(PlayerManager)
        await playerManager.init({
                  x:2,
                  y:8,
                  type:ENTITY_TYPE_ENUM.PLAYER,
                  direction:DIRECTION_ENUM.UP,
                  state:ENTITY_STATE_ENUM.IDLE
                })
        DataManager.Instance.player = playerManager
        EventManager.Instance.emit(EVENT_ENUM.PLAER_BRON, true)
    }

    //生成怪物
    async generateEnemies(){
        const enemies1 = creatUINode()
        enemies1.setParent(this.stage)
        const woodenSkeletonManager = enemies1.addComponent(WoodenSkeletonManager)
        await woodenSkeletonManager.init({
                  x:1,
                  y:6,
                  type:ENTITY_TYPE_ENUM.SKELETON_WOODEN,
                  direction:DIRECTION_ENUM.UP,
                  state:ENTITY_STATE_ENUM.IDLE
                })
        DataManager.Instance.enemies.push(woodenSkeletonManager)

        const enemies2 = creatUINode()
        enemies2.setParent(this.stage)
        const ironSkeletonManager = enemies2.addComponent(IronSkeletonManager)
        await ironSkeletonManager.init({
                  x:2,
                  y:2,
                  type:ENTITY_TYPE_ENUM.SKELETON_IRON,
                  direction:DIRECTION_ENUM.UP,
                  state:ENTITY_STATE_ENUM.IDLE
                })
        DataManager.Instance.enemies.push(ironSkeletonManager)
    }

    //生成门
    async generateDoor(){
        const door = creatUINode()
        door.setParent(this.stage)
        const doorManager = door.addComponent(DoorManager)
        await doorManager.init({
                  x:7,
                  y:8,
                  type:ENTITY_TYPE_ENUM.DOOR,
                  direction:DIRECTION_ENUM.UP,
                  state:ENTITY_STATE_ENUM.IDLE
                })
        DataManager.Instance.door = doorManager
    }

    //生成地缝
    async generateBurst(){
        const burst = creatUINode()
        burst.setParent(this.stage)
        const burstManager = burst.addComponent(BurstManager)
        await burstManager.init({
                  x:2,
                  y:6,
                  type:ENTITY_TYPE_ENUM.BURST,
                  direction:DIRECTION_ENUM.UP,
                  state:ENTITY_STATE_ENUM.IDLE
                })
        DataManager.Instance.burst.push(burstManager)
    }

    //生成地刺
    async generateSpikes(){
        const spikes = creatUINode()
        spikes.setParent(this.stage)
        const spikesManager = spikes.addComponent(SpikesManager)
        await spikesManager.init({
                  x:2,
                  y:5,
                  type:ENTITY_TYPE_ENUM.SPIKES_FOUR,
                  count:0
                })
        DataManager.Instance.spikes.push(spikesManager)
    }
    //地图适配屏幕中心
    adaptPos(){
        const {mapColumnCount,mapRowCount} =DataManager.Instance
        const disX = (TILE_WIDTH * mapRowCount) / 2
        const disY = (TILE_HEIGTH * mapColumnCount) / 2 + 80
        this.stage.setPosition(-disX , disY)
    }



}


