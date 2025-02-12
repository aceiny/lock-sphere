export interface ResponseInterface<T> {
    message : string ,
    status : number , 
    data? : T
}