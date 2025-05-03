export interface IGetResponseEquip {
    message:   string;
    equipments: Equipment[];
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
