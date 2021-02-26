export class Configuration <T extends string>{
    databaseURI = 'mongodb://localhost:27017/node-express-auth';
    port = 3000;
    jwtSecret = 'jwtSecret';

    constructor(){
        this.initialise();
    }

    private initialise(){
        if(process.env.ENVIRONMENT === 'PRODUCTION'){
            Object.keys(this).forEach((key) => {
                const variable:any =  process.env[key.toUpperCase()];
                if(variable){
                    this[key as keyof this] = variable;
                } else {
                    throw ("Missing environment variable: " + key);
                }
            })
        }
    }
}

export const configuration = new Configuration();