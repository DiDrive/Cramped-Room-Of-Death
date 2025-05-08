
import { _decorator, animation, Animation, AnimationClip, Component, Node, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';
import EventManager from '../Runtime/EventManager';
import { CONTROLLER_ENUM, EVENT_ENUM } from '../../DATA/Enums';
import { TILE_HEIGTH, TILE_WIDTH } from '../Tile/TileManager';
import ResourceManager from '../Runtime/ResourceManager';
const { ccclass, property } = _decorator;

const ANIMATION_SPEED = 1/8  //动画播放速度，1秒8帧

@ccclass('PlayerManager')
export class PlayerManager extends Component {

    //当前x,y坐标
    x:number = 0
    y:number = 0
    //目标x,y坐标
    targetX:number = 0
    targetY:number = 0

    private readonly moveSpeed = 1/10  //玩家移动速度

    async init(){
        await this.render()
        EventManager.Instance.on(EVENT_ENUM.PLAY_CTRL, this.move, this)
    }

    update(){
      this.updateXY()
      this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH *1.5, -this.y * TILE_HEIGTH + TILE_HEIGTH *1.5)
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

    //渲染人物动画
    async render(){
      const sprite = this.addComponent(Sprite)
      sprite.sizeMode = Sprite.SizeMode.CUSTOM

      const transform = this.getComponent(UITransform)
      transform.setContentSize(TILE_WIDTH * 4,TILE_HEIGTH * 4)  //设置sprite大小


      const spriteFrames = await ResourceManager.Instance.loadDir("texture/player/idle/top")    //sprite资源路径
      const animationComponent = this.addComponent(Animation)

      const animationClip = new AnimationClip();

      const track  = new animation.ObjectTrack(); // 创建一个向量轨道
      track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame'); // 指定轨道路径，即指定目标对象Sprite组件上的iteFrame" 属性

      const frames: Array<[number, SpriteFrame]> = spriteFrames.map((item: SpriteFrame,index: number) => [ANIMATION_SPEED * index, item])
      track.channel.curve.assignSorted(frames);

      // 最后将轨道添加到动画剪辑以应用
      animationClip.duration = frames.length * ANIMATION_SPEED; // 整个动画剪辑的周期
      animationClip.wrapMode = AnimationClip.WrapMode.Loop    //循环播放
      animationClip.addTrack(track);
      animationComponent.defaultClip = animationClip
      animationComponent.play()
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
      }
    }
}

