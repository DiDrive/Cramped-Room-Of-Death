
import { _decorator, Component, Layers, Node, SpriteFrame, UITransform } from 'cc';

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

export const sortSpriteFrames = (spriteFrames: SpriteFrame[]): SpriteFrame[] => {
    return spriteFrames.sort((a, b) => {
        // 从文件名中提取数字
        const nameA = a.name;
        const nameB = b.name;
        
        // 使用正则表达式提取文件名中的数字部分
        const numA = parseInt(nameA.match(/\d+/)?.[0] || '0');
        const numB = parseInt(nameB.match(/\d+/)?.[0] || '0');
        
        return numA - numB;
    });
}
