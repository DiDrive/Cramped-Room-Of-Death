
import { _decorator, animation, Animation, AnimationClip, Component, Node, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';
import EventManager from '../Runtime/EventManager';
import { CONTROLLER_ENUM, DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../../DATA/Enums';
import { TILE_HEIGTH, TILE_WIDTH } from '../Tile/TileManager';
import ResourceManager from '../Runtime/ResourceManager';
import { PlayerStateMachine } from './PlayerStateMachine';
import { EntityManager } from '../Base/EntityManager';
import DataManager from '../Runtime/DataManager';
import { IEntity } from '../../DATA/Levels';
const { ccclass, property } = _decorator;



@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {
    //目标x,y坐标
    targetX:number = 0
    targetY:number = 0
    private readonly moveSpeed = 1/10  //玩家移动速度
    ismoving:boolean

    async init(params:IEntity){
        this.fsm = this.addComponent(PlayerStateMachine)
        await this.fsm.init()
        super.init(params)
        this.targetX = this.x
        this.targetY = this.y
        EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL, this.inputHandle, this)
        EventManager.Instance.on(EVENT_ENUM.ATTACK_PLAYER, this.onDead, this)
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
      if(Math.abs(this.targetX - this.x) <= 0.1  && Math.abs(this.targetY - this.y) <= 0.1 && this.ismoving){
        this.ismoving = false
        this.x = this.targetX
        this.y = this.targetY
        EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
      }
    }


    //处理输入信息
    inputHandle(inputDirection: CONTROLLER_ENUM){
      if(this.ismoving){
        return
      }
      if(this.state === ENTITY_STATE_ENUM.DEATH || this.state === ENTITY_STATE_ENUM.AIRDEATH || this.state === ENTITY_STATE_ENUM.ATTACK){    //死亡禁止移动
        return
      }

      const id = this.willAttack(inputDirection)
      if(id){
        EventManager.Instance.emit(EVENT_ENUM.ATTACK_ENEMY, id)
        //EventManager.Instance.emit(EVENT_ENUM.DOOR_OPEN)  //刚攻击就判断门是否能开启
        return
      }
      if(this.willBlock(inputDirection)){
        //console.log("Bolock")
        return
      }
      this.move(inputDirection)
    }

    //玩家死亡
    onDead(type:ENTITY_STATE_ENUM){
      this.state = type

    }


    //玩家移动
    move(inputDirection: CONTROLLER_ENUM){

      if(inputDirection === CONTROLLER_ENUM.UP){  //因为Cocosy轴相反，因此向上y-1
        this.targetY -= 1
        this.ismoving = true
      }else if(inputDirection === CONTROLLER_ENUM.DOWN){
        this.targetY += 1
        this.ismoving = true
      }else if(inputDirection === CONTROLLER_ENUM.LEFT){
        this.targetX -= 1
        this.ismoving = true
      }else if(inputDirection === CONTROLLER_ENUM.RIGHT){
        this.targetX += 1
        this.ismoving = true
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
        EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
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

    willAttack(inputDirection: CONTROLLER_ENUM){
      const enemies = DataManager.Instance.enemies.filter(enemy =>enemy.state !== ENTITY_STATE_ENUM.DEATH)
      for(let i = 0; i<enemies.length; i++){
        const {x:enemyX,y:enemyY,id:enemyId} =enemies[i]
        if(inputDirection ===CONTROLLER_ENUM.UP &&this.direction ===DIRECTION_ENUM.UP && enemyX ===this.x && enemyY === this.targetY-2){
          this.state = ENTITY_STATE_ENUM.ATTACK
          return enemyId
        }else if(inputDirection ===CONTROLLER_ENUM.LEFT &&this.direction ===DIRECTION_ENUM.LEFT && enemyX ===this.x-2 && enemyY === this.targetY){
          this.state = ENTITY_STATE_ENUM.ATTACK
          return enemyId
        }else if(inputDirection ===CONTROLLER_ENUM.DOWN &&this.direction ===DIRECTION_ENUM.DOWN && enemyX ===this.x && enemyY === this.targetY+2){
          this.state = ENTITY_STATE_ENUM.ATTACK
          return enemyId
        }else if(inputDirection ===CONTROLLER_ENUM.RIGHT &&this.direction ===DIRECTION_ENUM.RIGHT && enemyX ===this.x+2 && enemyY === this.targetY){
          this.state = ENTITY_STATE_ENUM.ATTACK
          return enemyId
        }
      }
      return ''
    }

    //是否碰撞
    willBlock(inputDirection: CONTROLLER_ENUM){
      const {targetX:x, targetY:y, direction} = this
      const {tileInfo} = DataManager.Instance
      const {x:doorX, y:doorY, state:doorState} = DataManager.Instance.door
      const enemies = DataManager.Instance.enemies.filter(enemy => enemy.state !==ENTITY_STATE_ENUM.DEATH)

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

          if(((x === doorX && PlayerNextY ===doorY) || (x === doorX && WeaponNextY === doorY)) &&
           doorState !== ENTITY_STATE_ENUM.DEATH)
          {
            this.state = ENTITY_STATE_ENUM.BLOCKFRONT
            return true
          }
          for(let i =0; i < enemies.length; i++){
            const {x:enemyX, y:enemyY} = enemies[i]
            if((x === enemyX && PlayerNextY ===enemyY) || (x === enemyX && WeaponNextY === enemyY)){
            this.state = ENTITY_STATE_ENUM.BLOCKFRONT
            return true
            }
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
        //玩家与门的碰撞
        if(((x === doorX && nextY === doorY) ||
            (nextX === doorX && y === doorY) ||
            (nextX === doorX && nextY === doorY)) &&
            doorState !== ENTITY_STATE_ENUM.DEATH
        ){
          this.state = ENTITY_STATE_ENUM.BLOCKTRUNLEFT
          return true
        }

        for(let i =0; i < enemies.length; i++){
            const {x:enemyX, y:enemyY} = enemies[i]
            if(
              (x === enemyX && nextY === enemyY) ||
              (nextX === enemyX && y === enemyY) ||
              (nextX === enemyX && nextY === enemyY)
          ){
            this.state = ENTITY_STATE_ENUM.BLOCKTRUNLEFT
            return true
        }
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

