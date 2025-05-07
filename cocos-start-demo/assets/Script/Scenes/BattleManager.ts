
import { _decorator, Component, Node } from 'cc';
import { TileMapManager } from '../Tile/TileMapManager';
import { creatUINode } from '../../utils';
import levels, { ILevel } from '../../DATA/Levels';
import DataManager from '../Runtime/DataManager';
import { TILE_HEIGTH, TILE_WIDTH } from '../Tile/TileManager';
import EventManager from '../Runtime/EventManager';
import { EVENT_ENUM } from '../../DATA/Enums';
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
    generateTileMap(){

        const tileMap = creatUINode()
        tileMap.setParent(this.stage)
        const tileMapManager = tileMap.addComponent(TileMapManager)
        tileMapManager.init()
        this.adaptPos()
    }

    //地图适配屏幕中心
    adaptPos(){
        const {mapColumnCount,mapRowCount} =DataManager.Instance
        const disX = (TILE_WIDTH * mapRowCount) / 2
        const disY = (TILE_HEIGTH * mapColumnCount) / 2 + 80
        this.stage.setPosition(-disX , disY)
    }



}


