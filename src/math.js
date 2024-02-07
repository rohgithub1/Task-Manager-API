const fahranheitToCelsius = (temp) =>{
    return (temp - 32) / 1.8
} 

const celciusToFahranheit = (temp) =>{
    return (temp * 1.8) + 32
}

const add = (a,b) =>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            if(a<0|| b<0){
                return reject('Number are non negative')
            }
    
            resolve(a+b)
        },2000)
    })
}

module.exports = {
    fahranheitToCelsius,
    celciusToFahranheit,
    add
}