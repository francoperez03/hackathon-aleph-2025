

export class ServiceProvider {
    privateKey?: string

    constructor(address: string, privateKey?: string) {
        this.privateKey = privateKey;
    }

}