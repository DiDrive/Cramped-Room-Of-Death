
import { _decorator, Component, Node } from 'cc';
import { TileMapManager } from '../Tile/TileMapManager';

import { creatUINode } from '../../utils';
import levels, { ILevel } from '../../DATA/Levels';
import DataManager from '../Runtime/DataManager';
import { TILE_HEIGTH, TILE_WIDTH } from '../Tile/TileManager';
import EventManager from '../Runtime/EventManager';
import { EVENT_ENUM } from '../../DATA/Enums';
import { PlayerManager } from '../Player/PlayerManager';
import { WoodenSkeletonManager } from '../WoodenSkeleton/WoodenSkeletonManager';
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
        await playerManager.init()
        DataManager.Instance.player = playerManager
        EventManager.Instance.emit(EVENT_ENUM.PLAER_BRON, true)
    }

    //生成怪物
    async generateEnemies(){
        const enemies = creatUINode()
        enemies.setParent(this.stage)
        const woodenSkeletonManager = enemies.addComponent(WoodenSkeletonManager)
        await woodenSkeletonManager.init()
        DataManager.Instance.enemies.push(woodenSkeletonManager)
    }

    //地图适配屏幕中心
    adaptPos(){
        const {mapColumnCount,mapRowCount} =DataManager.Instance
        const disX = (TILE_WIDTH * mapRowCount) / 2
        const disY = (TILE_HEIGTH * mapColumnCount) / 2 + 80
        this.stage.setPosition(-disX , disY)
    }



}


