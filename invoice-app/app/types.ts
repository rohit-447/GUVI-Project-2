export interface Item {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Client {
    name: string;
    address: string;
    contactPerson: string;
    email: string;
    phone: string;
}

export interface Project {
    name: string;
    id: string;
    description: string;
}
