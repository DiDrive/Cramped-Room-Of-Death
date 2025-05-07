
import { _decorator, Component, Node } from 'cc';
import EventManager from '../Runtime/EventManager';
import { EVENT_ENUM } from '../../DATA/Enums';
const { ccclass, property } = _decorator;



@ccclass('ControllerManager')
export class ControllerManager extends Component {

    handleCtrl(){
        EventManager.Instance.emit(EVENT_ENUM.NEXT_LEVEL)
    }
}


