export enum TILE_TYPE_ENUM {

    WALL_ROW = 'WALL_ROW',
    WALL_COLUMN = 'WALL_COLUMN',
    WALL_LEFT_TOP = 'WALL_LEFT_TOP',
    WALL_RIGHT_TOP = 'WALL_RIGHT_TOP',
    WALL_LEFT_BOTTOM = 'WALL_LEFT_BOTTOM',
    WALL_RIGHT_BOTTOM = 'WALL_RIGHT_BOTTOM',
    CLIFF_LEFT = 'CLIFF_ROW_START',
    CLIFF_CENTER = 'CLIFF_ROW_CENTER',
    CLIFF_RIGHT = 'CLIFF_ROW_END',
    FLOOR = 'FLOOR',
}

//方向枚举
export enum DIRECTION_ENUM{
    UP = "UP",
    DOWN = "DOWN",
    LEFT = "LEFT",
    RIGHT = "RIGHT",
}

export enum DIRECTION_ORDER_ENUM{
    UP = 0,
    DOWN = 1,
    LEFT = 2,
    RIGHT = 3,
}

//实体类型枚举
export enum ENTITY_TYPE_ENUM{
    PLAYER = "PLAYER"
}

//实体状态枚举
export enum ENTITY_STATE_ENUM{
    IDLE ="IDLE",
    TURNLEFT = "TURNLEFT",
    TURNRIGHT = "TURNRIGHT",

}

//事件枚举
export enum EVENT_ENUM{
    NEXT_LEVEL = "NEXT_LEVEL",
    PLAY_CTRL = "PLAY_CTRL"

}

//玩家控制枚举
export enum CONTROLLER_ENUM{
    UP = "UP",
    DOWN = "DOWN",
    LEFT = "LEFT",
    RIGHT = "RIGHT",
    TURNLEFT = "TURNLEFT",
    TURNRIGHT ="TURNRIGHT"
}

//有限状态机类型枚举
export enum FSM_PARAMS_TYPE_ENUM{
    TRIGGER = "TRIGGER",
    NUMBER= "NUMBER",
}

//参数枚举
export enum PARAMS_NAME_ENUM{
    IDLE ="IDLE",
    TURNLEFT = "TURNLEFT",
    TURNRIGHT = "TURNRIGHT",
    DIRECTION = "DIRECTION"
}
