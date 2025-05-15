import { animation, AnimationClip, Sprite, SpriteFrame, UITransform } from "cc";
import { PlayerStateMachine } from "../Player/PlayerStateMachine";
import { TILE_HEIGTH, TILE_WIDTH } from "../Tile/TileManager";
import ResourceManager from "../Runtime/ResourceManager";
import { StateMachine } from "./StateMachine";
import { sortSpriteFrames } from "../../utils";

/*
播放对应动画
*/
const ANIMATION_SPEED = 1/8  //动画播放速度，1秒8帧

export default class State{
  private animationClip: AnimationClip
  constructor(
      private fsm:  StateMachine,
      private path: string,
      private wrapMode: AnimationClip.WrapMode =AnimationClip.WrapMode.Normal,  //播放是否循环，Normal为只播放一次
  ){

    this.init()
  }


  async init(){
      const promise = ResourceManager.Instance.loadDir(this.path)    //加载sprite资源
      this.fsm.waitingList.push(promise)  //将Promise添加到等待列表
      let spriteFrames = await promise
      spriteFrames = sortSpriteFrames(spriteFrames)

      this.animationClip = new AnimationClip();
      const track  = new animation.ObjectTrack(); // 创建一个向量轨道
      track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame'); // 指定轨道路径，即指定目标对象Sprite组件上的iteFrame" 属性
      const frames: Array<[number, SpriteFrame]> = spriteFrames.map((item: SpriteFrame,index: number) => [ANIMATION_SPEED * index, item])
      track.channel.curve.assignSorted(frames);

      // 最后将轨道添加到动画剪辑以应用
      this.animationClip.addTrack(track);
      this.animationClip.name = this.path   //将clip的名字设置为路径（独一无二）
      this.animationClip.duration = frames.length * ANIMATION_SPEED; // 整个动画剪辑的周期
      this.animationClip.wrapMode = this.wrapMode    //播放模式
  }

  run(){  //播放动画
    if(this.fsm.animationComponent?.defaultClip?.name === this.animationClip.name){
      return
    }
    this.fsm.animationComponent.defaultClip = this.animationClip
    this.fsm.animationComponent.play()
  }
}
