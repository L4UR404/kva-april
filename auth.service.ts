import { OrderModel } from "../../models/order.model"
import { ToyModel } from "../../models/toy.model"
import { UserModel } from "../../models/user.model"

const USERS = 'users'
const ACTIVE = 'active'
export class AuthService{
    static getUsers(): UserModel[]{
        const baseUser: UserModel = {
            email: 'user@example.com',
                password: 'user123',
                preferenceGender: 'svi',
                firstName: 'Petar',
                lastName: 'Kresoja',
                orders: []
        }
        if(localStorage.getItem(USERS) == null){
            localStorage.setItem(USERS, JSON.stringify([baseUser ]))
            
        }
        return JSON.parse(localStorage.getItem(USERS)!)
    }
    static login(email: string, password: string){
        const users = this.getUsers()
        for (let u of users){
            if (u.email  === email && u.password === password){
                localStorage.setItem(ACTIVE, email)
                return true
            }
        }
        return false
    }
    static getActiveUser(): UserModel| null {
        const users = this.getUsers()
         for (let u of users){
            if (u.email === localStorage.getItem(ACTIVE)){
                return u
            }
         }
         return null
    }

    static updateActiveUser(newUserData: UserModel){
        const users = this.getUsers()
         for (let u of users){
            if (u.email === localStorage.getItem(ACTIVE)){
                u.firstName = newUserData.firstName
                u.lastName = newUserData.lastName
                u.preferenceGender = newUserData.preferenceGender

            }
         }
         localStorage.setItem(USERS, JSON.stringify(users))
    }

    static updateActiveUserPassword(newPassword: string){
         const users = this.getUsers()
         for (let u of users){
            if (u.email === localStorage.getItem(ACTIVE)){
                u.password = newPassword
            }
            localStorage.setItem(USERS, JSON.stringify(users))
    }
}

    static logout(){
        localStorage.removeItem(ACTIVE)
    }

    static createOrder(order: Partial< OrderModel>, toy: ToyModel ){
        order.state = 'w'
        order.toyId= toy.toyId
        order.toyName= toy.name
        order.createdAt= new Date().toISOString()
        
         const users = this.getUsers()
         for (let u of users){
            if (u.email === localStorage.getItem(ACTIVE)){
                u.orders.push(order as OrderModel)
            }
            localStorage.setItem(USERS, JSON.stringify(users))
    
        }
    }
    static getOrdersOnWaiting(){
        const users = this.getUsers()
         for (let u of users){
            if (u.email === localStorage.getItem(ACTIVE)){
                return u.orders.filter((o)=> o.state === 'w')
            }
            
    
        }
        return[]
    }
    static cancelOrder(createdAt: string) {
    const users = this.getUsers()
    for (let u of users) {
        if (u.email === localStorage.getItem(ACTIVE)) {
            for (let o of u.orders) {
                // Proveravamo stanje 'w' (waiting) i tačan datum kreiranja
                if (o.state == 'w' && o.createdAt == createdAt) {
                    o.state = 'c' // Menjamo u 'c' (cancelled)
                }
            }
        }
    }
    localStorage.setItem(USERS, JSON.stringify(users))
}
static payOrders() {
    const users = this.getUsers()
    for (let u of users) {
        if (u.email === localStorage.getItem(ACTIVE)) {
            for (let o of u.orders) {
                // Sve što je bilo na čekanju ('w') sada prelazi u plaćeno ('p')
                if (o.state == 'w') {
                    o.state = 'p'
                }
            }
        }
    }
    localStorage.setItem(USERS, JSON.stringify(users))
}

static getOrdersByState(state: 'w' | 'p' | 'c') {
    const users = this.getUsers();
    const activeEmail = localStorage.getItem(ACTIVE);
    for (let u of users) {
        if (u.email === activeEmail) {
            return u.orders.filter((o) => o.state === state);
        }
    }
    return [];
}
}