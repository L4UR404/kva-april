
import axios from 'axios';



import { ToyModel } from "../../models/toy.model";

const client = axios.create({
    baseURL: 'https://toy.pequla.com/api',
    headers: {
        'Accept': 'application/json',
        'X-Name': `KVA_2026/dev`
    },
    validateStatus(status){
        return status === 200 
    }
})
export class ToyService{
    static async getToys(){
        return await client.get<ToyModel[]>('/toy')
    }

    static async getToyById(id: number){
       return await client.get<ToyModel>('/toy/' + id)


    }

    static async getToyTypes(){
        return await client.get<string[]>('/toy/type')
    }
    static async getToysToPreferenceGender(gend: string){
        const rsp= await client.get<ToyModel[]>('/toy');
        return rsp.data.filter(t => t.targetGroup === gend)
        
    }
    static async getToyPrice(id: number): Promise<number> {
    const rsp = await client.get<ToyModel>('/toy/' + id);
    return rsp.data.price;
  }
  static async getToysByIds(ids: number){
    return await client.request({
        url: '//toy/list',
        method: 'post',
        data: ids
    })
  }

}