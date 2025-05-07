
import { _decorator, Component, Layers, Node, UITransform } from 'cc';

export const creatUINode = (name:string ='')=>{

    const node = new Node()
    const transform = node.addComponent(UITransform)
    transform.setAnchorPoint(0,1)
    node.layer = 1<<Layers.nameToLayer("UI_2D")
    return node

}

export const randomByRange = (start:number,end:number)=>{
    return Math.floor(start + (end-start) * Math.random())
}
