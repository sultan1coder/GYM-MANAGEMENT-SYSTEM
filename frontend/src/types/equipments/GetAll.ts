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

export interface IUpdateResponseEquip {
    isSuccess:       boolean;
    message:         string;
    updateEquipment: UpdateEquipment;
}

export interface UpdateEquipment extends Equipment {}

export interface Equipment {
    id:                string;
    name:              string;
    type:              string;
    category:          string;
    brand?:            string;
    model?:            string;
    serialNumber?:     string;
    quantity:          number;
    available:         number;
    inUse:             number;
    status:            'OPERATIONAL' | 'MAINTENANCE' | 'OUT_OF_SERVICE' | 'RETIRED';
    location?:         string;
    description?:      string;
    imageUrl?:         string;
    purchaseDate?:     string;
    warrantyExpiry?:   string;
    cost?:             number;
    maintenance:       boolean;
    lastMaintenance?:  string;
    nextMaintenance?:  string;
    createdAt:         Date;
    updatedAt:         Date;
}

export interface MaintenanceLog {
    id:          string;
    equipmentId: string;
    type:        'PREVENTIVE' | 'CORRECTIVE' | 'INSPECTION' | 'REPAIR';
    description: string;
    cost?:       number;
    performedBy?: string;
    performedAt: Date;
    nextDue?:    Date;
}

export interface EquipmentStats {
    total:        number;
    operational:  number;
    maintenance:  number;
    outOfService: number;
    categories:   Array<{ category: string; _count: { category: number } }>;
    totalValue:   number;
}
