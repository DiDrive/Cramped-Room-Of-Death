
import { _decorator, animation, Animation, AnimationClip, Component, Node, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';
import EventManager from '../Runtime/EventManager';
import { CONTROLLER_ENUM, DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../../DATA/Enums';
import { TILE_HEIGTH, TILE_WIDTH } from '../Tile/TileManager';
import ResourceManager from '../Runtime/ResourceManager';
import { PlayerStateMachine } from './PlayerStateMachine';
import { EntityManager } from '../Base/EntityManager';
import DataManager from '../Runtime/DataManager';
const { ccclass, property } = _decorator;



@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {
    //目标x,y坐标
    targetX:number = 0
    targetY:number = 0
    private readonly moveSpeed = 1/10  //玩家移动速度

    async init(){
        this.fsm = this.addComponent(PlayerStateMachine)
        await this.fsm.init()
        super.init({
          x:2,
          y:8,
          type:ENTITY_TYPE_ENUM.PLAYER,
          direction:DIRECTION_ENUM.UP,
          state:ENTITY_STATE_ENUM.IDLE
        })
        this.targetX = this.x
        this.targetY = this.y
        EventManager.Instance.on(EVENT_ENUM.PLAY_CTRL, this.inputHandle, this)
    }

    update(){
      this.updateXY()
      super.update()
    }

    //瓦片地图左上角为原点（0，0）
    //更新位置
    updateXY(){
      if(this.targetX < this.x){
        this.x -= this.moveSpeed
      }else if(this.targetX > this.x){
        this.x += this.moveSpeed
      }

      if(this.targetY < this.y){
        this.y -= this.moveSpeed
      }else if(this.targetY > this.y){
        this.y += this.moveSpeed
      }


      //距离目标位置过近直接赋值，防止抽搐
      if(Math.abs(this.targetX - this.x) <= 0.1  && Math.abs(this.targetY - this.y) <= 0.1 ){
        this.x = this.targetX
        this.y = this.targetY
      }
    }


    //处理输入信息
    inputHandle(inputDirection: CONTROLLER_ENUM){
      if(this.willBlock(inputDirection)){
        console.log("Bolock")
        return
      }
      this.move(inputDirection)
    }

    move(inputDirection: CONTROLLER_ENUM){
      if(inputDirection === CONTROLLER_ENUM.UP){  //因为Cocosy轴相反，因此向上y-1
        this.targetY -= 1
      }else if(inputDirection === CONTROLLER_ENUM.DOWN){
        this.targetY += 1
      }else if(inputDirection === CONTROLLER_ENUM.LEFT){
        this.targetX -= 1
      }else if(inputDirection === CONTROLLER_ENUM.RIGHT){
        this.targetX += 1
      }else if(inputDirection === CONTROLLER_ENUM.TURNLEFT){
        if(this.direction === DIRECTION_ENUM.UP){
          this.direction =DIRECTION_ENUM.LEFT
        }else if(this.direction === DIRECTION_ENUM.LEFT){
          this.direction =DIRECTION_ENUM.DOWN
        }else if(this.direction === DIRECTION_ENUM.DOWN){
          this.direction =DIRECTION_ENUM.RIGHT
        }else if(this.direction === DIRECTION_ENUM.RIGHT){
          this.direction =DIRECTION_ENUM.UP
        }
        this.state = ENTITY_STATE_ENUM.TURNLEFT
      }else if(inputDirection === CONTROLLER_ENUM.TURNRIGHT){
        if(this.direction === DIRECTION_ENUM.UP){
          this.direction =DIRECTION_ENUM.RIGHT
        }else if(this.direction === DIRECTION_ENUM.RIGHT){
          this.direction =DIRECTION_ENUM.DOWN
        }else if(this.direction === DIRECTION_ENUM.DOWN){
          this.direction =DIRECTION_ENUM.LEFT
        }else if(this.direction === DIRECTION_ENUM.LEFT){
          this.direction =DIRECTION_ENUM.UP
        }
        this.state = ENTITY_STATE_ENUM.TURNRIGHT
      }
    }

    //是否碰撞
    willBlock(inputDirection: CONTROLLER_ENUM){
      const {targetX:x, targetY:y, direction} = this
      const {tileInfo} = DataManager.Instance

      if(inputDirection === CONTROLLER_ENUM.UP){  //玩家点击方向是上
        if(direction === DIRECTION_ENUM.UP){  //此时人物也面向上
          const PlayerNextY = y-1   //玩家的下一个位置
          const WeaponNextY = y-2   //武器的下一个位置
          const playerTile = tileInfo[x][PlayerNextY]
          const weanponTile = tileInfo[x][WeaponNextY]
          if(PlayerNextY < 0){
            this.state = ENTITY_STATE_ENUM.BLOCKFRONT
            return true
          }

          if(playerTile && playerTile.moveable && (!weanponTile || weanponTile.turnable)){
            //无碰撞可以移动
          }
          else{
            this.state = ENTITY_STATE_ENUM.BLOCKFRONT
            return true
          }
        }else if(direction === DIRECTION_ENUM.LEFT){
          const playerNextY = y-1
          const WeaponNextX = x-1
          const playerTile = tileInfo[x][playerNextY]
          const weanponTile = tileInfo[WeaponNextX][playerNextY]
          if(playerNextY < 0){
            this.state = ENTITY_STATE_ENUM.BLOCKRIGHT
            return true
          }

          if(playerTile && playerTile.moveable && (!weanponTile || weanponTile.turnable)){
            //无碰撞可以移动
          }
          else{
            this.state = ENTITY_STATE_ENUM.BLOCKRIGHT
            return true
          }
        }else if(direction === DIRECTION_ENUM.RIGHT){
          const playerNextY = y-1
          const WeaponNextX = x+1
          const playerTile = tileInfo[x][playerNextY]
          const weanponTile = tileInfo[WeaponNextX][playerNextY]
          if(playerNextY < 0){
             this.state = ENTITY_STATE_ENUM.BLOCKLEFT
            return true
          }

          if(playerTile && playerTile.moveable && (!weanponTile || weanponTile.turnable)){
            //无碰撞可以移动
          }
          else{
             this.state = ENTITY_STATE_ENUM.BLOCKLEFT
            return true
          }
        }else if(direction === DIRECTION_ENUM.DOWN){
          const PlayerNextY = y-1
          const WeaponNextY = y-1
          const playerTile = tileInfo[x][PlayerNextY]
          const weanponTile = tileInfo[x][WeaponNextY]
          if(PlayerNextY < 0){
             this.state = ENTITY_STATE_ENUM.BLOCKBACK
            return true
          }

          if(playerTile && playerTile.moveable && (!weanponTile || weanponTile.turnable)){
            //无碰撞可以移动
          }
          else{
            this.state = ENTITY_STATE_ENUM.BLOCKBACK
            return true
          }
        }
      }else if(inputDirection === CONTROLLER_ENUM.LEFT){  //按下向左移动按键
        if(direction === DIRECTION_ENUM.LEFT){
          const playerNextX = x-1
          const WeaponNextX = x-2
          const playerTile = tileInfo[playerNextX][y]
          const weanponTile = tileInfo[WeaponNextX][y]
          if(playerNextX < 0){
            this.state = ENTITY_STATE_ENUM.BLOCKFRONT
            return true
          }

          if(playerTile && playerTile.moveable && (!weanponTile || weanponTile.turnable)){
            //无碰撞可以移动
          }
          else{
            this.state = ENTITY_STATE_ENUM.BLOCKFRONT
            return true
          }
        }else if(direction === DIRECTION_ENUM.UP){
          const playerNextX = x-1
          const WeaponNextY = y-1
          const playerTile = tileInfo[playerNextX][y]
          const weanponTile = tileInfo[playerNextX][WeaponNextY]
          if(playerNextX < 0){
            this.state = ENTITY_STATE_ENUM.BLOCKLEFT
            return true
          }

          if(playerTile && playerTile.moveable && (!weanponTile || weanponTile.turnable)){
            //无碰撞可以移动
          }
          else{
            this.state = ENTITY_STATE_ENUM.BLOCKLEFT
            return true
          }
        }else if(direction === DIRECTION_ENUM.DOWN){
          const playerNextX = x-1
          const WeaponNextY = y+1
          const playerTile = tileInfo[playerNextX][y]
          const weanponTile = tileInfo[playerNextX][WeaponNextY]
          if(playerNextX < 0){
            this.state = ENTITY_STATE_ENUM.BLOCKRIGHT
            return true
          }

          if(playerTile && playerTile.moveable && (!weanponTile || weanponTile.turnable)){
            //无碰撞可以移动
          }
          else{
            this.state = ENTITY_STATE_ENUM.BLOCKRIGHT
            return true
          }
        }
        else if(direction === DIRECTION_ENUM.RIGHT){
          const playerNextX = x-1
          const WeaponNextX = x-1
          const playerTile = tileInfo[playerNextX][y]
          const weanponTile = tileInfo[WeaponNextX][y]
          if(playerNextX < 0){
            this.state = ENTITY_STATE_ENUM.BLOCKBACK
            return true
          }

          if(playerTile && playerTile.moveable && (!weanponTile || weanponTile.turnable)){
            //无碰撞可以移动
          }
          else{
            this.state = ENTITY_STATE_ENUM.BLOCKBACK
            return true
          }
        }
      }else if(inputDirection === CONTROLLER_ENUM.DOWN){  //按下向下移动按键
        if(direction === DIRECTION_ENUM.LEFT){
          const playerNextY = y+1
          const WeaponNextX = x-1
          const playerTile = tileInfo[x][playerNextY]
          const weanponTile = tileInfo[WeaponNextX][playerNextY]
          if(playerNextY < 0){
            this.state = ENTITY_STATE_ENUM.BLOCKLEFT
            return true
          }

          if(playerTile && playerTile.moveable && (!weanponTile || weanponTile.turnable)){
            //无碰撞可以移动
          }
          else{
            this.state = ENTITY_STATE_ENUM.BLOCKLEFT
            return true
          }
        }else if(direction === DIRECTION_ENUM.UP){
          const playerNextY = y+1
          const WeaponNextY = y+1
          const playerTile = tileInfo[x][playerNextY]
          const weanponTile = tileInfo[x][WeaponNextY]
          if(playerNextY < 0){
            this.state = ENTITY_STATE_ENUM.BLOCKBACK
            return true
          }

          if(playerTile && playerTile.moveable && (!weanponTile || weanponTile.turnable)){
            //无碰撞可以移动
          }
          else{
            this.state = ENTITY_STATE_ENUM.BLOCKBACK
            return true
          }
        }else if(direction === DIRECTION_ENUM.DOWN){
          const playerNextY = y+1
          const WeaponNextY = y+2
          const playerTile = tileInfo[x][playerNextY]
          const weanponTile = tileInfo[x][WeaponNextY]
          if(playerNextY < 0){
            this.state = ENTITY_STATE_ENUM.BLOCKFRONT
            return true
          }

          if(playerTile && playerTile.moveable && (!weanponTile || weanponTile.turnable)){
            //无碰撞可以移动
          }
          else{
            this.state = ENTITY_STATE_ENUM.BLOCKFRONT
            return true
          }
        }
        else if(direction === DIRECTION_ENUM.RIGHT){
          const playerNextY = y+1
          const WeaponNextX = x+1
          const playerTile = tileInfo[x][playerNextY]
          const weanponTile = tileInfo[WeaponNextX][playerNextY]
          if(playerNextY < 0){
            this.state = ENTITY_STATE_ENUM.BLOCKRIGHT
            return true
          }

          if(playerTile && playerTile.moveable && (!weanponTile || weanponTile.turnable)){
            //无碰撞可以移动
          }
          else{
            this.state = ENTITY_STATE_ENUM.BLOCKRIGHT
            return true
          }
        }
      }else if(inputDirection === CONTROLLER_ENUM.RIGHT){  //按下向右移动按键
        if(direction === DIRECTION_ENUM.LEFT){
          const playerNextX = x+1
          const WeaponNextX = x+1
          const playerTile = tileInfo[playerNextX][y]
          const weanponTile = tileInfo[WeaponNextX][y]
          if(playerNextX < 0){
            this.state = ENTITY_STATE_ENUM.BLOCKBACK
            return true
          }

          if(playerTile && playerTile.moveable && (!weanponTile || weanponTile.turnable)){
            //无碰撞可以移动
          }
          else{
            this.state = ENTITY_STATE_ENUM.BLOCKBACK
            return true
          }
        }else if(direction === DIRECTION_ENUM.UP){
          const playerNextX = x+1
          const WeaponNextY = y-1
          const playerTile = tileInfo[playerNextX][y]
          const weanponTile = tileInfo[playerNextX][WeaponNextY]
          if(playerNextX < 0){
            this.state = ENTITY_STATE_ENUM.BLOCKRIGHT
            return true
          }

          if(playerTile && playerTile.moveable && (!weanponTile || weanponTile.turnable)){
            //无碰撞可以移动
          }
          else{
            this.state = ENTITY_STATE_ENUM.BLOCKRIGHT
            return true
          }
        }else if(direction === DIRECTION_ENUM.DOWN){
          const playerNextX = x+1
          const WeaponNextY = y+1
          const playerTile = tileInfo[playerNextX][y]
          const weanponTile = tileInfo[playerNextX][WeaponNextY]
          if(playerNextX < 0){
            this.state = ENTITY_STATE_ENUM.BLOCKLEFT
            return true
          }

          if(playerTile && playerTile.moveable && (!weanponTile || weanponTile.turnable)){
            //无碰撞可以移动
          }
          else{
            this.state = ENTITY_STATE_ENUM.BLOCKLEFT
            return true
          }
        }
        else if(direction === DIRECTION_ENUM.RIGHT){
          const playerNextX = x+1
          const WeaponNextX = x+2
          const playerTile = tileInfo[playerNextX][y]
          const weanponTile = tileInfo[WeaponNextX][y]
          if(playerNextX < 0){
            this.state = ENTITY_STATE_ENUM.BLOCKFRONT
            return true
          }

          if(playerTile && playerTile.moveable && (!weanponTile || weanponTile.turnable)){
            //无碰撞可以移动
          }
          else{
            this.state = ENTITY_STATE_ENUM.BLOCKFRONT
            return true
          }
        }
      }else if(inputDirection === CONTROLLER_ENUM.TURNLEFT){  //左转
        let nextX
        let nextY
        if(direction === DIRECTION_ENUM.UP){
          nextX = x-1
          nextY = y-1
        }else if(direction === DIRECTION_ENUM.DOWN){
          nextX = x+1
          nextY = y+1
        }
        else if(direction === DIRECTION_ENUM.LEFT){
          nextX = x-1
          nextY = y+1
        }
        else if(direction === DIRECTION_ENUM.RIGHT){
          nextX = x+1
          nextY = y-1
        }
        if(
          (!tileInfo[x][nextY] || tileInfo[x][nextY].turnable) &&
          (!tileInfo[nextX][y] || tileInfo[nextX][y].turnable) &&
          (!tileInfo[nextX][nextY] || tileInfo[nextX][nextY].turnable)
        ){
          //可以移动
        }else {
          this.state = ENTITY_STATE_ENUM.BLOCKTRUNLEFT
          return true
        }
      }else if(inputDirection === CONTROLLER_ENUM.TURNRIGHT){  //右转
        let nextX
        let nextY
        if(direction === DIRECTION_ENUM.UP){
          nextX = x+1
          nextY = y-1
        }else if(direction === DIRECTION_ENUM.RIGHT){
          nextX = x+1
          nextY = y+1
        }else if(direction === DIRECTION_ENUM.DOWN){
          nextX = x-1
          nextY = y+1
        }
        else if(direction === DIRECTION_ENUM.LEFT){
          nextX = x-1
          nextY = y-1
        }
        if(
          (!tileInfo[x][nextY] || tileInfo[x][nextY].turnable) &&
          (!tileInfo[nextX][y] || tileInfo[nextX][y].turnable) &&
          (!tileInfo[nextX][nextY] || tileInfo[nextX][nextY].turnable)
        ){
          //可以移动
        }else {
          this.state = ENTITY_STATE_ENUM.BLOCKTRUNRIGHT
          return true
        }
      }
      return false
    }
}

