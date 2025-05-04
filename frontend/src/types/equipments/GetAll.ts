export interface IGetResponseEquip {
    message:   string;
    equipment: Equipment[];
}
export interface IDeleteResponseEquip {
    message:   string;
    deleteEquipment: Equipment;
}
export interface IGetSingleEquip {
    message:   string;
    equipment: Equipment;
}


export interface Equipment {
    id:        string;
    name:      string;
    type:      string;
    quantity:  number;
    createdAt: Date;
    updatedAt: Date;
}
